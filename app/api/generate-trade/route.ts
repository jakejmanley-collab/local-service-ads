import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

const rateLimitMap = new Map();

export async function POST(req: Request) {
  try {
    const adminSupabase = getServiceSupabase();
    const { trade } = await req.json();

    if (!trade) return NextResponse.json({ error: 'Trade required' }, { status: 400 });

    const slug = trade.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filename1 = `${slug}-1.jpg`;
    const filename2 = `${slug}-2.jpg`;

    // 1. Check if images already exist in Supabase Storage
    const { data: existingFiles } = await adminSupabase.storage.from('trades').list('', {
      search: slug
    });

    // If both files exist, return them immediately ($0 cost)
    if (existingFiles && existingFiles.length >= 2) {
      const img1 = adminSupabase.storage.from('trades').getPublicUrl(filename1).data.publicUrl;
      const img2 = adminSupabase.storage.from('trades').getPublicUrl(filename2).data.publicUrl;
      return NextResponse.json({ photo1: img1, photo2: img2 });
    }

    // 2. Simple Rate Limiting (3 fresh generations per IP)
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const usage = rateLimitMap.get(ip) || 0;
    if (usage >= 3) return NextResponse.json({ error: 'Generation limit reached for this session.' }, { status: 429 });
    rateLimitMap.set(ip, usage + 1);

    // 3. Helper to Generate (Fal.ai) and Upload (Supabase)
    const generateAndUpload = async (prompt: string, name: string) => {
      const res = await fetch('https://fal.run/fal-ai/flux/dev', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Key ${process.env.FAL_API_KEY}` 
        },
        body: JSON.stringify({ 
          prompt, 
          image_size: "square_hd",
          num_inference_steps: 28,
          guidance_scale: 3.5
        })
      });

      const data = await res.json();
      if (!data.images || data.images.length === 0) throw new Error("Fal.ai failed to generate");
      
      const imageUrl = data.images[0].url;

      // Fetch the image from Fal.ai and convert to blob for Supabase
      const imgRes = await fetch(imageUrl);
      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase using the Admin Client
      const { error: uploadError } = await adminSupabase.storage
        .from('trades')
        .upload(name, buffer, { 
          contentType: 'image/jpeg', 
          upsert: true 
        });

      if (uploadError) throw uploadError;
      
      return adminSupabase.storage.from('trades').getPublicUrl(name).data.publicUrl;
    };

    // 4. Run both generations
    console.log(`Generating new assets for: ${trade}`);
    const photo1 = await generateAndUpload(`high-end commercial photography, close-up of hands using professional tools for ${trade}, clean, bright, macro detail --ar 1:1`, filename1);
    const photo2 = await generateAndUpload(`high-end commercial photography, professional technician performing ${trade} service, bright professional lighting, clean environment --ar 1:1`, filename2);

    return NextResponse.json({ photo1, photo2 });

  } catch (error: any) {
    console.error("API Route Error:", error.message);
    return NextResponse.json({ error: error.message || 'Failed to generate images' }, { status: 500 });
  }
}
