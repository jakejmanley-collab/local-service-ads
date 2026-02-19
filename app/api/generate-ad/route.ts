import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { businessName, platform, services } = await req.json();

    const prompt = `You are an expert digital marketer specializing in local service businesses. Write high-converting, algorithm-friendly ad copy for ${platform}. Keep it punchy, use strategic emojis, include a strong hook, bulleted services, and a clear call to action.
    
    Business Name: ${businessName}
    Core Offer / Services: ${services}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to connect to AI');
    }

    const adText = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ adText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
