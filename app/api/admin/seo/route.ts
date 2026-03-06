import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Must use the service role key to bypass row-level security
);

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    // 1. Create a URL-friendly slug (e.g., "Facebook Marketing" -> "facebook-marketing")
    const slug = keyword.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    // 2. The Master Prompt for Gemini
    const prompt = `
      You are an expert SEO copywriter for local service businesses (plumbing, cleaning, landscaping, etc.).
      Write a comprehensive, highly-actionable, 1000-word article about: "${keyword}".
      
      You must return ONLY a valid JSON object with the following keys. Do not use markdown code blocks like \`\`\`json around the response, just return the raw JSON:
      {
        "title": "A catchy, SEO-optimized Title (under 60 characters)",
        "description": "A compelling meta description (under 155 characters)",
        "h1": "The main H1 header for the page",
        "cta": "A 1-2 sentence call to action telling them to use our free ad flyer generator",
        "content": "The full 1000-word article. Use <h2> tags, <p> tags, <ul>, and <li> tags for formatting. Make it highly readable, authoritative, and actionable."
      }
    `;

    // 3. Generate the Content
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean the response just in case Gemini adds markdown formatting
    const cleanJsonString = responseText.replace(/```json\n?|```/g, '').trim();
    const articleData = JSON.parse(cleanJsonString);

    // 4. Save to Supabase
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
