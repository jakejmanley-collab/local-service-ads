import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing in Vercel" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Explicitly use the stable production model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Write 3 Facebook Marketplace listings for:
      Business: ${businessName}
      Trade: ${trade}
      Services: ${services.join(", ")}

      Return ONLY a JSON object with these keys:
      "professional": { "headline": "...", "description": "..." },
      "friendly": { "headline": "...", "description": "..." },
      "aggressive": { "headline": "...", "description": "..." },
      "tags": "..."
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON even if the AI adds markdown backticks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned invalid format");
    
    return NextResponse.json(JSON.parse(jsonMatch[0]));

  } catch (error: any) {
    console.error("API_FAILURE:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
