export const maxDuration = 60; 

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(req: Request) {
  try {
    const { keyword, passcode } = await req.json();

    if (passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slug = keyword.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const prompt = `
      Write a 1000-word, high-quality SEO article for: "${keyword}".
      Target Audience: Local service businesses (plumbers, cleaners, etc.).
      Tone: Professional, helpful, and expert.

      Return ONLY a raw JSON object:
      {
        "title": "SEO Optimized Title",
        "description": "Meta description under 160 chars",
        "h1": "Main Article Heading",
        "cta_header": "Ready to Professionalize Your Business?",
        "cta_body": "If you're looking for help starting or growing your own business, try our free flyer and ad text writer. For those ready to scale, check out our affordable pro plans designed for local pros.",
        "content": "Full HTML content using <h2>, <p>, <ul>, and <li> tags. Do not include the CTA in this field."
      }
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanJsonString = responseText.replace(/```json\n?|```/g, '').trim();
    const articleData = JSON.parse(cleanJsonString);

    const { error: dbError } = await supabase.from('seo_articles').upsert({
      slug,
      title: articleData.title,
      description: articleData.description,
      h1: articleData.h1,
      cta_header: articleData.cta_header,
      cta_body: articleData.cta_body,
      content: articleData.content
    }, { onConflict: 'slug' });

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, slug });

  } catch (error: any) {
    console.error("SEO Gen Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
