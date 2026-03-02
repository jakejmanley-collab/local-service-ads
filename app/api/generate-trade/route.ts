import { NextResponse } from 'next/server';

const rateLimitMap = new Map();

export async function POST(req: Request) {
  try {
    const { trade } = await req.json();
    if (!trade) return NextResponse.json({ error: 'Trade required' }, { status: 400 });

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const usage = rateLimitMap.get(ip) || 0;
    if (usage >= 3) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    const slug = trade.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const baseUrl = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const localCheck = await fetch(`${baseUrl}/trades/${slug}-1.jpg`);
    
    if (localCheck.ok) {
      return NextResponse.json({
        photo1: `/trades/${slug}-1.jpg`,
        photo2: `/trades/${slug}-2.jpg`
      });
    }

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

    return NextResponse.json({ photo1: url1, photo2: url2 });

  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: 'Failed to generate images' }, { status: 500 });
  }
}
