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
      Write a 1000-word SEO article for: "${keyword}".
      Return ONLY a raw JSON object:
      {
        "title": "SEO Title",
        "description": "Meta description",
        "h1": "Article H1",
        "cta_header": "Ready to Professionalize Your Business?",
        "cta_body": "Try our free flyer and ad text writer today.",
        "content": "Full HTML content with <h2>, <p>, <ul> tags."
      }
    `;

    // KEEPING THE WORKING MODEL
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI failed to return valid JSON.");
    const articleData = JSON.parse(jsonMatch[0]);

    const { error: dbError } = await supabase.from('seo_articles').upsert({
      slug,
      title: articleData.title,
      description: articleData.description,
      h1: articleData.h1,
      cta_header: articleData.cta_header,
      cta_body: articleData.cta_body,
      content: articleData.content,
      cta: "migrated" // FIX: This prevents the 'null value' error you saw
    }, { onConflict: 'slug' });

    if (dbError) throw new Error(`Database Error: ${dbError.message}`);

    return NextResponse.json({ success: true, slug });

  } catch (error: any) {
    console.error("SEO Gen Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
