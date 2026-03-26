import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { topic, format, passcode } = await req.json();

    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }
    if (!passcode || passcode.trim() !== expected.trim()) {
      return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 });
    }

    if (!topic || !format) {
      return NextResponse.json({ error: 'Missing topic or format' }, { status: 400 });
    }

    const isShort = format === 'short';

    const scriptPrompt = isShort
      ? `You are a knowledgeable contractor/trades professional creating a short-form vertical video script (TikTok/Reels/Shorts).

Topic: "${topic}"

Requirements:
- 60-90 seconds when spoken aloud at a natural voiceover pace (~130-195 words total)
- Hook in the FIRST 3 SECONDS — grab attention immediately
- Punchy, direct, no fluff
- Sound like a real contractor talking to another contractor — casual but authoritative
- No stage directions, no [pause], no scene descriptions — ONLY the spoken words
- MUST include at least one real, specific statistic with a source (e.g. "According to HomeAdvisor..." or "The BLS reports...") — this adds authority and credibility
- End with a clear call to action

Return ONLY the spoken script text. No intro, no metadata, just the words to be spoken.`
      : `You are a knowledgeable contractor/trades professional creating a long-form educational YouTube video script.

Topic: "${topic}"

Requirements:
- 5-8 minutes when spoken aloud at a natural voiceover pace (~650-1040 words total)
- Educational, step-by-step breakdown
- Hook in the first 15 seconds
- Sound like a real contractor talking to another contractor — knowledgeable, practical, no corporate speak
- Use natural transitions between steps
- No stage directions, no [pause], no scene descriptions — ONLY the spoken words
- MUST include at least 2 real, specific statistics with sources (e.g. "According to HomeAdvisor..." or "The BLS reports...") — woven naturally into the content to add authority
- End with a clear call to action and ask for likes/subscribes naturally

Return ONLY the spoken script text. No intro, no metadata, just the words to be spoken.`;

    const captionsPrompt = `Based on this video topic: "${topic}" (format: ${isShort ? 'short-form vertical TikTok/Reels/Shorts' : 'long-form YouTube'}), generate platform-optimized captions.

Return ONLY raw JSON with this exact structure:
{
  "youtube": "YouTube description (2-3 sentences about the video content, then 5-8 relevant hashtags on new lines)",
  "tiktok": "TikTok caption (punchy 1-2 sentences max) with 4-6 relevant hashtags inline",
  "instagram": "Instagram caption (engaging 2-3 sentences) with 8-12 relevant hashtags"
}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const [scriptResult, captionsResult] = await Promise.all([
      model.generateContent(scriptPrompt),
      model.generateContent(captionsPrompt),
    ]);

    const script = scriptResult.response.text().trim();
    const wordCount = script.split(/\s+/).filter(Boolean).length;
    const estimatedDuration = Math.round((wordCount / 130) * 60); // seconds

    const captionsRaw = captionsResult.response.text().replace(/```json|```/g, '').trim();
    let captions = { youtube: '', tiktok: '', instagram: '' };
    try {
      captions = JSON.parse(captionsRaw);
    } catch {
      captions = {
        youtube: `${topic}\n\n#contractor #trades #homeimprovement`,
        tiktok: `${topic} #contractor #trades`,
        instagram: `${topic}\n\n#contractor #trades #homeimprovement`,
      };
    }

    return NextResponse.json({ script, estimatedDuration, captions });
  } catch (err: any) {
    console.error('generate-script error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
