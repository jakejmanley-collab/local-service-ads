import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Write 3 Facebook Marketplace listings for:
      Business: ${businessName}
      Trade: ${trade}
      Services: ${services.join(", ")}

      You must return ONLY a raw JSON object. No markdown, no backticks.
      Structure:
      {
        "professional": { "headline": "...", "description": "..." },
        "friendly": { "headline": "...", "description": "..." },
        "aggressive": { "headline": "...", "description": "..." },
        "tags": "tag1, tag2, tag3"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // This regex removes everything except the actual JSON brackets
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in AI response");
    
    const cleanJson = jsonMatch[0];
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    console.error("Gemini Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
