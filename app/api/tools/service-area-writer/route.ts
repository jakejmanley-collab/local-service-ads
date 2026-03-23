import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { trade, city, areas, specialties } = await req.json();

    if (!trade || !city || !areas) {
      return NextResponse.json(
        { error: "Trade, city, and service areas are required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert at writing SEO-optimized service area content for local trade contractor websites.

Contractor info:
- Trade: ${trade}
- Primary city: ${city}
- Service areas: ${areas}
${specialties ? `- Key services: ${specialties}` : ""}

Write a service area section for their website that:
- Is 2 short paragraphs (150–200 words total)
- Naturally mentions the primary city and all the service areas listed
- Includes the trade name naturally for local SEO
- Mentions key services if provided
- Ends with a call to action to contact them
- Reads naturally — not like a list of keywords
- Does NOT use headings or bullet points — just clean prose

Return ONLY the content text. No quotes, no explanation, no headings.`;

    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    return NextResponse.json({ content });
  } catch (err) {
    console.error("Service area writer error:", err);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
