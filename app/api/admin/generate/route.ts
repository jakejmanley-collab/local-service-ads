import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

const getPrompts = (details: any) => {
  const { businessName, field, phone, websiteUrl, service1, service2 } = details;
  
  const name = businessName || 'Premium Service';
  const trade = field || 'Service';
  const contact = websiteUrl ? websiteUrl : phone;
  const specialty1 = service1 || trade;
  const specialty2 = service2 || 'Professional Service';

  return [
    `A premium modern advertising poster for a ${trade} company. The poster features a cinematic photo of a professional at work. Bold, elegant, perfectly spelled typography overlay that reads "${name}". Subtitle text reads "${specialty1} and ${specialty2}". At the bottom, clean text reads "${contact}". Clean graphic design, advertising agency quality.`,

    `High-end commercial photography of a sleek modern service van parked in a beautiful luxury driveway. The side of the van has large, clear, perfectly spelled typography that reads "${name}". Below it, text reading "${contact}". Professional lighting, 8k resolution, photorealistic.`,

    `Close up portrait of a friendly, professional ${trade} expert looking at the camera. They are wearing a clean, high-end uniform polo shirt. Embroidered perfectly on the chest is the company name "${name}". They are holding a sleek clipboard that says "${specialty1}". Cinematic lighting, trustworthy.`,

    `A crisp, premium advertising yard sign placed on a perfectly manicured green lawn. The sign has perfect, bold typography that reads "${name}". Below the name, it says "${contact}". Bright sunny day, professional real estate style photography, highly detailed.`,

    `Artistic, satisfying top-down flatlay of clean, premium ${trade} tools arranged neatly on a dark sleek background. In the center, a luxurious embossed business card. The card clearly and perfectly reads "${name}" and "${contact}". Soft studio lighting, 8k resolution.`
  ];
};

export async function POST(req: Request) {
  try {
    const { orderId, details } = await req.json();
    if (!orderId || !details) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const adminSupabase = getServiceSupabase();
    await adminSupabase.from('flyer_orders').update({ status: 'processing' }).eq('id', orderId);

    const prompts = getPrompts(details);
    const imageUrls = [];

    console.log(`Starting generation for premium order: ${orderId}`);

    for (let i = 0; i < prompts.length; i++) {
      const res = await fetch('https://fal.run/fal-ai/flux/dev', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Key ${process.env.FAL_API_KEY}` 
        },
        body: JSON.stringify({ 
          prompt: prompts[i], 
          image_size: "square_hd",
          num_inference_steps: 28, 
          guidance_scale: 3.5
        })
      });

      const data = await res.json();
      if (!data.images) throw new Error(`Fal.ai failed on image ${i + 1}`);
      const falUrl = data.images[0].url;

      const imgRes = await fetch(falUrl);
      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const fileName = `premium/${orderId}-img-${i + 1}.jpg`;
      
      await adminSupabase.storage
        .from('trades')
        .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: true });
      
      const publicUrl = adminSupabase.storage.from('trades').getPublicUrl(fileName).data.publicUrl;
      imageUrls.push(publicUrl);
    }

    await adminSupabase.from('flyer_orders').update({
      status: 'delivered',
      image_1: imageUrls[0], image_2: imageUrls[1], image_3: imageUrls[2],
      image_4: imageUrls[3], image_5: imageUrls[4],
    }).eq('id', orderId);

    return NextResponse.json({ success: true, imageUrls });

  } catch (error: any) {
    console.error("Generation Error:", error.message);
    const adminSupabase = getServiceSupabase();
    await adminSupabase.from('flyer_orders').update({ status: 'needs_generation' }).eq('id', orderId);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
