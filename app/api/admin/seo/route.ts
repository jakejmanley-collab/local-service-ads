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

    // 1. Security check
    if (passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Passcode' }, { status: 401 });
    }

    const slug = keyword.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    // 2. The Prompt (Explicitly demanding NO backticks)
    const prompt = `
      You are an expert SEO copywriter for local service businesses.
      Write a comprehensive, highly-actionable, 1000-word article about: "${keyword}".
      
      Return ONLY a raw JSON object. Do not include markdown formatting, backticks, or "json" labels. 
      JSON Structure:
      {
        "title": "SEO Title (under 60 chars)",
        "description": "Meta description (under 155 chars)",
        "h1": "Main header",
        "cta": "Call to action for our flyer generator",
        "content": "Full article with <h2>, <p>, <ul>, and <li> tags. Use deep, helpful details."
      }
    `;

    // 3. Using the most stable model name
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // 4. BULLETPROOF CLEANING: Extract JSON even if wrapped in backticks
    let cleanJsonString = responseText;
    if (responseText.includes('```')) {
      cleanJsonString = responseText.split('```')[1]; // Get content between first set of backticks
      if (cleanJsonString.startsWith('json')) {
        cleanJsonString = cleanJsonString.replace(/^json/, ''); // Remove the "json" label
      }
    }
    cleanJsonString = cleanJsonString.trim();

    const articleData = JSON.parse(cleanJsonString);

    // 5. Save to Supabase
    const { error: dbError } = await supabase.from('seo_articles').insert([{
      slug,
      title: articleData.title,
      description: articleData.description,
      h1: articleData.h1,
      cta: articleData.cta,
      content: articleData.content
    }]);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, slug });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    // Return the actual error to the UI so you can see it in the Vercel logs
    return NextResponse.json({ error: error.message, details: error.stack }, { status: 500 });
  }
}
