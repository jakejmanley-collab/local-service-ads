import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { businessName, platform, services } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert digital marketer specializing in local service businesses. Write high-converting, algorithm-friendly ad copy for marketplace platforms. Keep it punchy, use strategic emojis, include a strong hook, bulleted services, and a clear call to action.'
          },
          {
            role: 'user',
            content: `Business Name: ${businessName}\nPlatform: ${platform}\nCore Services/Offer: ${services}\n\nWrite the ad copy.`
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to connect to AI');
    }

    return NextResponse.json({ adText: data.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
