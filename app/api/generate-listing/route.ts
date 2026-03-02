import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key is missing from Vercel environment" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Write 3 Facebook Marketplace listings for:
      Business: ${businessName}
      Trade: ${trade}
      Services: ${services.join(", ")}
      Return ONLY a JSON object with keys: "professional", "friendly", "aggressive", "tags".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");
    
    return NextResponse.json(JSON.parse(jsonMatch[0]));

  } catch (error: any) {
    // This logs the ACTUAL error to your Vercel Logs
    console.error("DETAILED_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
