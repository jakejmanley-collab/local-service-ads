import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; //

const rateLimitMap = new Map();

export async function POST(req: Request) {
  try {
    const { trade } = await req.json();
    if (!trade) return NextResponse.json({ error: 'Trade required' }, { status: 400 });

    const slug = trade.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filename1 = `${slug}-1.jpg`;
    const filename2 = `${slug}-2.jpg`;

    // 1. Check if images already exist in Supabase Storage
    const { data: existingFiles } = await supabase.storage.from('trades').list('', {
      search: slug
    });

    if (existingFiles && existingFiles.length >= 2) {
      const img1 = supabase.storage.from('trades').getPublicUrl(filename1).data.publicUrl;
      const img2 = supabase.storage.from('trades').getPublicUrl(filename2).data.publicUrl;
      return NextResponse.json({ photo1: img1, photo2: img2 });
    }

    // 2. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const usage = rateLimitMap.get(ip) || 0;
    if (usage >= 3) return NextResponse.json({ error: 'Limit exceeded' }, { status: 429 });
    rateLimitMap.set(ip, usage + 1);

    // 3. Generate via Fal.ai
    const generateAndUpload = async (prompt: string, name: string) => {
      const res = await fetch('https://fal.run/fal-ai/flux/dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Key ${process.env.FAL_API_KEY}` },
        body: JSON.stringify({ prompt, image_size: "square_hd" })
      });
      const data = await res.json();
      const imageUrl = data.images[0].url;

      // Download from Fal and upload to Supabase
      const imgRes = await fetch(imageUrl);
      const blob = await imgRes.blob();
      await supabase.storage.from('trades').upload(name, blob, { contentType: 'image/jpeg', upsert: true });
      
      return supabase.storage.from('trades').getPublicUrl(name).data.publicUrl;
    };

    const photo1 = await generateAndUpload(`commercial photography of hands using tools for ${trade}, macro detail`, filename1);
    const photo2 = await generateAndUpload(`commercial photography of a technician performing ${trade} service, professional lighting`, filename2);

    return NextResponse.json({ photo1, photo2 });

  } catch (error: any) {
    console.error("Storage/Gen Error:", error);
    return NextResponse.json({ error: 'Failed to process images' }, { status: 500 });
  }
}
