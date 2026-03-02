import { NextResponse } from 'next/server';

// Simple in-memory rate limiting (Resets on Vercel cold boot, but prevents rapid spam)
const rateLimitMap = new Map();

export async function POST(req: Request) {
  try {
    const { trade } = await req.json();
    if (!trade) return NextResponse.json({ error: 'Trade required' }, { status: 400 });

    // 1. IP Rate Limiting (Max 3 fresh generations per IP)
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const usage = rateLimitMap.get(ip) || 0;
    if (usage >= 3) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    const slug = trade.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // 2. Check if the image already exists locally (Caching)
    const baseUrl = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL;
    const localCheck = await fetch(`${baseUrl}/trades/${slug}-1.jpg`);
    
    if (localCheck.ok) {
      // It exists locally! Return the local paths, cost = $0.00
      return NextResponse.json({
        photo1: `/trades/${slug}-1.jpg`,
        photo2: `/trades/${slug}-2.jpg`
      });
    }

    // 3. It doesn't exist. Increment usage and Generate via Fal.ai
    rateLimitMap.set(ip, usage + 1);
    
    const FAL_KEY = process.env.FAL_API_KEY;
    if (!FAL_KEY) throw new Error("Missing FAL_API_KEY");

    const generate = async (prompt: string) => {
      const res = await fetch('https://fal.run/fal-ai/flux/dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Key ${FAL_KEY}`
        },
        body: JSON.stringify({
          prompt,
          image_size: "square_hd",
          num_inference_steps: 28,
          guidance_scale: 3.5
        })
      });
      const data = await res.json();
      return data.images[0].url;
    };

    const url1 = await generate(`commercial photography of a close-up of hands using tools for ${trade}, bright, clean, high resolution macro detail --ar 1:1`);
    const url2 = await generate(`commercial photography of a professional technician performing ${trade} service, bright, professional lighting, clean environment --ar 1:1`);

    // Note: To make caching permanent, you would download these URLs to Supabase Storage or Vercel Blob here.
    // For now, we return the Fal.ai CDN URLs directly to the user.
    return NextResponse.json({ photo1: url1, photo2: url2 });

  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: 'Failed to generate images' }, { status: 500 });
  }
}
