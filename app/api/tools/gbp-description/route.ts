import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { trade, city, businessName, yearsExperience, specialties, licensedInsured } = await req.json();

    if (!trade || !city) {
      return NextResponse.json(
        { error: "Trade and city are required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const context = [
      `Trade: ${trade}`,
      `City: ${city}`,
      businessName ? `Business name: ${businessName}` : null,
      yearsExperience ? `Years of experience: ${yearsExperience}` : null,
      specialties ? `Specialties: ${specialties}` : null,
      licensedInsured ? "Licensed and insured: yes" : null,
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `You are an expert at writing Google Business Profile descriptions for local trade contractors.

Contractor info:
${context}

Write a Google Business Profile description that:
- Is STRICTLY under 750 characters (this is a hard Google limit)
- Naturally includes the trade and city for local SEO
- Highlights key services and differentiators
- Mentions "licensed and insured" if applicable
- Reads naturally — not like a keyword list
- Ends with a clear call to action (e.g., "Call today for a free estimate.")
- Does NOT use all-caps or excessive punctuation

Return ONLY the description text. No quotes, no explanation.`;

    const result = await model.generateContent(prompt);
    let description = result.response.text().trim();

    // Hard truncate to 750 chars as a safety net
    if (description.length > 750) {
      description = description.substring(0, 747) + "...";
    }

    return NextResponse.json({ description });
  } catch (err) {
    console.error("GBP description error:", err);
    return NextResponse.json(
      { error: "Failed to generate description. Please try again." },
      { status: 500 }
    );
  }
}
