import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Force Vercel to bypass cache and read Env Vars fresh
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { keyword, passcode, site } = await req.json();

    // 1. SECURITY CHECK - Using ADMIN_PASSWORD
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      console.error("Vercel Env Var ADMIN_PASSWORD is missing!");
      return NextResponse.json({ error: 'Server Config Error' }, { status: 500 });
    }

    if (!passcode || passcode.trim() !== expected.trim()) {
      return NextResponse.json({ error: 'Invalid Passcode' }, { status: 401 });
    }

    // 2. AI GENERATION
    const isDiscord = site === 'discord';
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Write a high-end SEO article for "${keyword}". Target: ${isDiscord ? 'DiscordCompression.com' : 'Aretifi.com'}. 
    Return ONLY the raw JSON string: { "h1": "", "title": "", "description": "", "content": "HTML with <h2> and <p>" }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedJson = responseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedJson);

    // 3. DATABASE ENTRY
    const adminSupabase = getServiceSupabase();
    const { error } = await adminSupabase
      .from('seo_articles')
      .upsert({
        slug: keyword.toLowerCase().replace(/ /g, '-').trim(),
        ...data,
        site_tag: site,
        last_updated: new Date().toISOString()
      }, { onConflict: 'slug' });

    if (error) throw error;
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
