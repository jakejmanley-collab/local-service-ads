import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// We initialize without the 'v1beta' prefix to use the stable production API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key is missing from Vercel environment" }, { status: 500 });
    }

    // Using the 'latest' alias specifically to resolve 404/Not Found errors
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest" 
    });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Improved Regex to handle potential AI chatter
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");
    
    return NextResponse.json(JSON.parse(jsonMatch[0]));

  } catch (error: any) {
    console.error("DETAILED_ERROR:", error.message);
    // If it still fails, we want to know if it's still a 404 or a different error
    return NextResponse.json({ 
      error: "Listing generation failed", 
      message: error.message 
    }, { status: 500 });
  }
}
