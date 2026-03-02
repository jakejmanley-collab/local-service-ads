import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Must be named exactly POST
export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
      Write 3 professional Facebook Marketplace listings for:
      Business: ${businessName}
      Trade: ${trade}
      Services: ${services.join(", ")}

      Return ONLY a JSON object. No markdown.
      {
        "professional": { "headline": "string", "description": "string" },
        "friendly": { "headline": "string", "description": "string" },
        "aggressive": { "headline": "string", "description": "string" },
        "tags": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI failed to return data");

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error: any) {
    console.error("SERVER_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
