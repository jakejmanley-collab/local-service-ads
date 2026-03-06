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

    // Security check
    if (passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Passcode' }, { status: 401 });
    }

    const slug = keyword.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const prompt = `
      You are an expert SEO copywriter for local service businesses.
      Write a comprehensive, highly-actionable, 1000-word article about: "${keyword}".
      
      You must return ONLY a valid JSON object with the following keys:
      {
        "title": "SEO Title (under 60 chars)",
        "description": "Meta description (under 155 chars)",
        "h1": "Main header",
        "cta": "Call to action for our flyer generator",
        "content": "Full article with <h2>, <p>, <ul>, and <li> tags."
      }
    `;

    // UPDATED: Switching to a supported model (gemini-2.5-flash)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanJsonString = responseText.replace(/```json\n?|```/g, '').trim();
    const articleData = JSON.parse(cleanJsonString);

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
