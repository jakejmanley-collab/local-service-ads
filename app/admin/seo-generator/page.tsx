import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { keyword, passcode, site } = await req.json();

    // --- SECURITY DIAGNOSTIC ---
    const storedPasscode = process.env.ADMIN_PASSCODE?.trim();
    const providedPasscode = passcode?.trim();

    if (!providedPasscode || providedPasscode !== storedPasscode) {
      console.error("Auth Failed. Rec:", providedPasscode, "Exp:", storedPasscode);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isDiscord = site === 'discord';
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write a high-end SEO article for "${keyword}". Target: ${isDiscord ? 'DiscordCompression.com' : 'Aretifi.com'}. 
    ${isDiscord ? 'Focus on 25MB limits and private video processing.' : 'Focus on professional contractor flyer design.'}
    Return JSON: { "h1": "", "title": "", "description": "", "content": "HTML with <h2> and <p>" }`;

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());

    const { error } = await supabase
      .from('seo_articles')
      .upsert({
        slug: keyword.toLowerCase().replace(/ /g, '-'),
        ...data,
        site_tag: site,
        last_updated: new Date()
      });

    if (error) throw error;
    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
