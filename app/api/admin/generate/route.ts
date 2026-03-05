import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// --- DATA MAPPING FOR WIZARD CHOICES ---
const COLOR_MAP: Record<string, string> = {
  'color-1': 'Deep Navy, Premium Gold, and Crisp White',
  'color-2': 'Crimson Red, Dark Slate, and Off-White',
  'color-3': 'Ocean Teal, Sky Blue, and Soft Silver',
  'color-4': 'Forest Green, Vibrant Leaf, and Charcoal',
  'color-5': 'Safety Yellow, Heavy Black, and Concrete Grey',
  'color-6': 'Electric Indigo, Vibrant Cyan, and Dark Slate',
  'color-7': 'Matte Black, Champagne, and Ivory',
  'color-8': 'Flame Orange, Ice Blue, and Deep Navy',
  'color-9': 'Mint Green, Bright Coral, and Pearl White',
  'color-10': 'Rust Copper, Warm Sand, and Espresso Brown',
};

const STYLE_MAP: Record<string, string> = {
  'style-1': 'A sophisticated layout with sleek, modern sans-serif typography. Clean grid.',
  'style-2': 'A dynamic and active layout featuring high contrast, and a large diagonal hero image.',
  'style-3': 'A luxury editorial magazine layout with lots of negative space, elegant typography, and geometric blocking.',
  'style-4': 'A professional corporate layout utilizing dynamic diagonal color blocks and structured checkmark lists.',
  'style-5': 'A highly structured graphic design featuring overlapping circular photo frames and bright sweeping accent shapes.',
  'style-6': 'A clean B2B minimalist grid using solid colored rectangular blocks and highly legible sans-serif typography.',
  'style-7': 'A modern high-end layout featuring a faded background image and three distinct, colorful rounded columns at the bottom.',
  'style-8': 'An ultra-modern layout featuring sharp diamond and chevron shapes masking the professional photography.'
};

const getPrompts = (details: any) => {
  // Extract data from the Wizard
  const { businessName, trade, phone, selectedStyles = [], selectedColors = [], features = [], service1, service2 } = details;
  
  const name = businessName || 'Premium Service';
  const industry = trade || 'Service';
  const contact = phone || '555-555-5555';
  const specialty1 = service1 || 'Quality Service';
  const specialty2 = service2 || 'Professional Support';

  // Map choices to actual AI instructions (with safe fallbacks)
  const style1 = STYLE_MAP[selectedStyles[0]] || STYLE_MAP['style-4'];
  const style2 = STYLE_MAP[selectedStyles[1]] || STYLE_MAP['style-5'];
  
  const color1 = COLOR_MAP[selectedColors[0]] || 'Slate Grey and Crimson Red';
  const color2 = COLOR_MAP[selectedColors[1]] || 'Navy Blue and Gold';

  // Translate trust badges into an AI prompt command
  const badgesText = features.length > 0 ? `Include stylized graphic badges/icons that communicate: ${features.join(', ')}.` : '';

  // We generate 5 variations mixing their 2 style and 2 color choices
  return [
    `A high-end graphic design business flyer for "${name}", a ${industry} company. ${style1} The color palette uses exactly ${color1}. The flyer includes text reading "${name}", "${specialty1}", and "${specialty2}". At the bottom, a bold banner reads "${contact}". ${badgesText} Vector graphic design, agency quality.`,

    `A high-end graphic design business flyer for "${name}", a ${industry} company. ${style2} The color palette uses exactly ${color1}. The flyer includes text reading "${name}", "${specialty1}", and "${specialty2}". At the bottom, a bold banner reads "${contact}". ${badgesText} Vector graphic design, agency quality.`,

    `A high-end graphic design business flyer for "${name}", a ${industry} company. ${style1} The color palette uses exactly ${color2}. The flyer includes text reading "${name}", "${specialty1}", and "${specialty2}". At the bottom, a bold banner reads "${contact}". ${badgesText} Vector graphic design, agency quality.`,

    `A high-end graphic design business flyer for "${name}", a ${industry} company. ${style2} The color palette uses exactly ${color2}. The flyer includes text reading "${name}", "${specialty1}", and "${specialty2}". At the bottom, a bold banner reads "${contact}". ${badgesText} Vector graphic design, agency quality.`,

    `A high-end graphic design business flyer for "${name}", a ${industry} company. A clean, premium layout with professional photography. The color palette uses exactly ${color1}. The flyer includes perfect typography reading "${name}". At the bottom, a bold banner reads "${contact}". ${badgesText} Vector graphic design, agency quality.`
  ];
};

export async function POST(req: Request) {
  let currentOrderId: string | null = null;

  try {
    const body = await req.json();
    const { orderId, details } = body;
    currentOrderId = orderId;

    if (!orderId || !details) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const adminSupabase = getServiceSupabase();
    await adminSupabase.from('flyer_orders').update({ status: 'processing' }).eq('id', orderId);

    const prompts = getPrompts(details);
    const imageUrls = [];

    console.log(`Starting generation for wizard order: ${orderId}`);

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
    
    if (currentOrderId) {
      const adminSupabase = getServiceSupabase();
      await adminSupabase.from('flyer_orders').update({ status: 'needs_generation' }).eq('id', currentOrderId);
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
