// 1. Extend the Vercel timeout to the absolute maximum allowed
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

    // 2. The Prompt: Explicitly asking for 1000 words in JSON
    const prompt = `
      Write a 1000-word, high-quality SEO article for a local service business about: "${keyword}".
      Include expert advice, specific steps, and local trust-building tips.
      
      Return ONLY a raw JSON object (no markdown, no backticks):
      {
        "title": "SEO Title",
        "description": "Meta description",
        "h1": "Article H1",
        "cta": "Call to action text",
        "content": "Full HTML content with <h2>, <p>, <ul>, and <li> tags."
      }
    `;

    // 3. USING THE NEWEST MARCH 2026 WORKHORSE MODEL
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // 4. Heavy-duty JSON cleaning
    const cleanJsonString = responseText.replace(/```json\n?|```/g, '').trim();
    const articleData = JSON.parse(cleanJsonString);

    // 5. Save/Update in Supabase
    const { error: dbError } = await supabase.from('seo_articles').upsert({
      slug,
      title: articleData.title,
      description: articleData.description,
      h1: articleData.h1,
      cta: articleData.cta,
      content: articleData.content
    }, { onConflict: 'slug' });

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({ success: true, slug });

  } catch (error: any) {
    console.error("SEO Gen Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
