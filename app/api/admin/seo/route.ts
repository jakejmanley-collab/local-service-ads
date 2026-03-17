export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * CORE BACKEND: SEO GENERATOR BRAIN
 * This route handles security, AI content generation with Gemini, 
 * and saving to the shared Supabase database.
 */

// Initialize Supabase with the Service Role Key to bypass RLS for administrative writes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { keyword, passcode, site } = await req.json();

    // 1. DYNAMIC SECURITY CHECK
    // This allows the server to look for either variable name you might have used in Vercel
    const storedAuth = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSCODE;

    // Safety check: if neither variable is set in Vercel, the server will error
    if (!storedAuth) {
      console.error("CRITICAL: No ADMIN_PASSWORD or ADMIN_PASSCODE found in Vercel Env Vars.");
      return NextResponse.json({ error: 'Server Auth Configuration Missing' }, { status: 500 });
    }

    // Strict comparison with .trim() to eliminate issues with accidental spaces
    if (!passcode || passcode.trim() !== storedAuth.trim()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. AI CONTENT GENERATION
    const isDiscord = site === 'discord';
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Detailed prompt to ensure Gemini returns valid JSON without markdown formatting
    const prompt = `Write a high-end, professional SEO article for the keyword "${keyword}". 
    Target Site: ${isDiscord ? 'DiscordCompression.com' : 'Aretifi.com'}. 
    ${isDiscord ? 'Focus on video compression, 25MB limits, and H.264 codecs.' : 'Focus on professional contractor marketing and flyer design.'}
    
    Return ONLY a raw JSON string. Do not include markdown backticks or the word 'json'.
    Required JSON Structure:
    { 
      "h1": "Main Heading", 
      "title": "SEO Meta Title", 
      "description": "SEO Meta Description", 
      "content": "Full article body in HTML format using only <h2> and <p> tags" 
    }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean potential markdown artifacts if Gemini ignores the "no backticks" instruction
    const cleanedJson = responseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedJson);

    // 3. DATABASE UPSERT
    // Saves or updates the article in the shared 'seo_articles' table
    const { error: dbError } = await supabase
      .from('seo_articles')
      .upsert({
        slug: keyword.toLowerCase().replace(/ /g, '-').trim(),
        h1: data.h1,
        title: data.title,
        description: data.description,
        content: data.content,
        site_tag: site,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'slug' // Ensures we update existing articles instead of creating duplicates
      });

    if (dbError) {
      console.error("Supabase Error:", dbError.message);
      throw new Error(`Database Error: ${dbError.message}`);
    }

    return NextResponse.json({ success: true, keyword });

  } catch (err: any) {
    console.error("SEO API Error:", err.message);
    return NextResponse.json({ 
      error: err.message, 
      details: "Check Gemini API Key and Supabase Table Permissions" 
    }, { status: 500 });
  }
}
