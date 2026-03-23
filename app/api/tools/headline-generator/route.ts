import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { trade, city, serviceType } = await req.json();

    if (!trade || !city) {
      return NextResponse.json(
        { error: "Trade and city are required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert copywriter for local trade businesses (contractors, plumbers, electricians, etc.).

Generate 6 short, punchy ad headlines for a ${trade} business in ${city}${serviceType ? ` specializing in ${serviceType}` : ""}.

Rules:
- Each headline must be under 10 words
- Use power words that build trust and urgency (Licensed, Fast, Affordable, Local, Trusted, Same-Day, etc.)
- Some should include the city name naturally
- Avoid generic filler like "Best in Town" or "We're the Best"
- Write for Facebook Marketplace, Kijiji, or local flyer ads

Return ONLY a JSON array of 6 strings, no markdown, no explanation. Example format:
["headline 1", "headline 2", "headline 3", "headline 4", "headline 5", "headline 6"]`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Strip markdown fences if present
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const headlines = JSON.parse(cleaned);

    return NextResponse.json({ headlines });
  } catch (err) {
    console.error("Headline generator error:", err);
    return NextResponse.json(
      { error: "Failed to generate headlines. Please try again." },
      { status: 500 }
    );
  }
}
