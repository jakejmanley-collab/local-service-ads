import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Gemini and Supabase
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { keyword, passcode, site } = await req.json();

    // 1. Security Check
    if (passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Prepare slug and site-specific context
    const slug = keyword.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const isDiscord = site === 'discord';
    
    // 3. Dynamic Prompt based on the selected site
    const prompt = `
      Act as a senior SEO content strategist. Write a 1000-word, high-conversion article targeting the keyword: "${keyword}".
      
      Context: This is for ${isDiscord ? 'DiscordCompression.com, a private browser-based video tool' : 'Aretifi.com, a contractor marketing platform'}.
      ${isDiscord ? 'Focus on Discord 25MB limits, private FFmpeg processing, and bulk uploads.' : 'Focus on contractor branding and high-end flyer design.'}
      
      Return ONLY a valid JSON object:
      {
        "title": "SEO Title (60 chars)",
        "description": "Meta description (155 chars)",
        "h1": "Main Article H1",
        "cta_header": "Strong CTA Heading",
        "cta_body": "Supporting CTA sentence",
        "content": "Full article HTML with <h2>, <p>, and <ul> tags."
      }
    `;

    // 4. Generate Content with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from potential markdown code blocks
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    const articleData = JSON.parse(jsonMatch[0]);

    // 5. Upsert to your shared Aretifi Supabase project
    const { error } = await supabase.from('seo_articles').upsert({
      slug,
      ...articleData,
      site_tag: site || 'aretifi', // Assigns the article to the correct site
    }, { onConflict: 'slug' });

    if (error) throw error;

    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    console.error("SEO Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
