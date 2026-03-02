import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Write 3 distinct Facebook Marketplace listings for:
      Business: ${businessName}
      Trade: ${trade}
      Services: ${services.join(", ")}

      Return ONLY a JSON object with these keys:
      "professional": { "headline": "string", "description": "string" },
      "friendly": { "headline": "string", "description": "string" },
      "aggressive": { "headline": "string", "description": "string" },
      "tags": "string of 10 tags"

      Tone Guide:
      - Professional: Trustworthy, corporate, expert.
      - Friendly: Neighborly, approachable, local vibe.
      - Aggressive: High urgency, "Don't Wait", "Best Prices", heavy CTAs.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
