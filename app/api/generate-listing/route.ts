import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Write a high-converting Facebook Marketplace listing for a service-based business.
      Business Name: ${businessName}
      Service Category: ${trade}
      Specific Services: ${services.join(", ")}

      Return the response in JSON format with exactly these keys:
      - "headline": A punchy, all-caps headline under 40 characters.
      - "description": A professional description (200 words max) including a bulleted list of services, a "Why Choose Us" section, and a strong Call to Action.
      - "tags": 10 relevant search tags separated by commas.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean up potential markdown formatting in the AI response
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(jsonStr));
  } catch (error) {
    console.error("Listing Gen Error:", error);
    return NextResponse.json({ error: "Failed to generate copy" }, { status: 500 });
  }
}
