import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

const rateLimitMap = new Map();

export async function POST(req: Request) {
  try {
    const adminSupabase = getServiceSupabase();
    const { trade } = await req.json();

    if (!trade) return NextResponse.json({ error: 'Trade required' }, { status: 400 });

    // Slugify the trade name
    const slug = trade.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Using v2 in the filename to force-update from the old "brass fitting" versions
    const filename1 = `${slug}-v2-1.jpg`;
    const filename2 = `${slug}-v2-2.jpg`;

    // 1. Check if high-end images already exist in Supabase Storage
    const { data: existingFiles } = await adminSupabase.storage.from('trades').list('', {
      search: slug
    });

    // If these specific v2 files exist, return them immediately ($0 cost)
    const hasFiles = existingFiles?.some(f => f.name === filename1) && existingFiles?.some(f => f.name === filename2);

    if (hasFiles) {
      const img1 = adminSupabase.storage.from('trades').getPublicUrl(filename1).data.publicUrl;
      const img2 = adminSupabase.storage.from('trades').getPublicUrl(filename2).data.publicUrl;
      return NextResponse.json({ photo1: img1, photo2: img2 });
    }

    // 2. Simple Rate Limiting (3 fresh generations per IP)
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const usage = rateLimitMap.get(ip) || 0;
    if (usage >= 3) return NextResponse.json({ error: 'Limit reached for this session.' }, { status: 429 });
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

      // Fetch image and convert to buffer for Supabase
      const imgRes = await fetch(imageUrl);
      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload using Admin Client
      const { error: uploadError } = await adminSupabase.storage
        .from('trades')
        .upload(name, buffer, { 
          contentType: 'image/jpeg', 
          upsert: true 
        });

      if (uploadError) throw uploadError;
      
      return adminSupabase.storage.from('trades').getPublicUrl(name).data.publicUrl;
    };

    // 4. Run High-End Brand Generations
    console.log(`Generating high-end assets for: ${trade}`);
    
    // PROMPT 1: The "Hero" (Cinematic, clean uniform, professional lighting)
    const photo1 = await generateAndUpload(
      `high-end commercial brand photography, professional ${trade} technician wearing a clean modern uniform performing expert service, bright airy professional lighting, cinematic depth of field with blurred background, minimalist aesthetic, 8k resolution, premium advertising style --ar 1:1`, 
      filename1
    );

    // PROMPT 2: The "Premium Layout" (Clean tools, organized, bright natural light)
    const photo2 = await generateAndUpload(
      `commercial product photography, close-up of high-end professional tools for ${trade} arranged neatly and artistically, bright natural lighting, soft shadows, professional color grading, minimalist clean background, advertising quality --ar 1:1`, 
      filename2
    );

    return NextResponse.json({ photo1, photo2 });

  } catch (error: any) {
    console.error("API Route Error:", error.message);
    return NextResponse.json({ error: error.message || 'Failed to generate images' }, { status: 500 });
  }
}
