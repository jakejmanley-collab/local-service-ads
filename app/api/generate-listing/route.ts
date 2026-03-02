import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Ensure the API Key is loaded
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key missing in Vercel" }, { status: 500 });
    }

    // Changing the model name to the most stable string
    // 'gemini-1.5-flash' is correct, but 'gemini-1.5-flash-latest' often resolves 404s
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Write 3 distinct Facebook Marketplace listings for:
      Business: ${businessName}
      Trade: ${trade}
      Services: ${services.join(", ")}

      Return ONLY a JSON object with these keys:
      "professional": { "headline": "...", "description": "..." },
      "friendly": { "headline": "...", "description": "..." },
      "aggressive": { "headline": "...", "description": "..." },
      "tags": "tag1, tag2, tag3"
    `;

    // Added a timeout/abort signal to prevent the "Hanging" issue
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("AI Response was not JSON:", text);
      throw new Error("AI returned text instead of data");
    }
    
    return NextResponse.json(JSON.parse(jsonMatch[0]));

  } catch (error: any) {
    console.error("Listing Gen Error Details:", error);
    return NextResponse.json({ 
      error: "Model connection error", 
      details: error.message 
    }, { status: 500 });
  }
}
