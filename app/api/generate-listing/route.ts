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

      Return ONLY a JSON object with these exact keys:
      "professional": { "headline": "...", "description": "..." },
      "friendly": { "headline": "...", "description": "..." },
      "aggressive": { "headline": "...", "description": "..." },
      "tags": "tag1, tag2, tag3"

      IMPORTANT: Do not include any markdown formatting, backticks, or extra text.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // This regex finds the first '{' and the last '}' and extracts everything in between
    // It prevents the "Hanging" issue by ignoring any extra text Gemini adds.
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }
    
    const cleanJson = JSON.parse(jsonMatch[0]);
    return NextResponse.json(cleanJson);

  } catch (error: any) {
    console.error("Listing Gen Error:", error.message);
    return NextResponse.json({ error: "Failed to generate copy" }, { status: 500 });
  }
}
