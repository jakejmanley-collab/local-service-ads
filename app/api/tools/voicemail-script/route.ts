import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { trade, city, businessName, callbackHours, offersEmergency } = await req.json();

    if (!trade || !city) {
      return NextResponse.json(
        { error: "Trade and city are required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const context = [
      `Trade: ${trade}`,
      `City: ${city}`,
      businessName ? `Business name: ${businessName}` : null,
      callbackHours ? `Callback hours: ${callbackHours}` : null,
      offersEmergency ? "Offers emergency / after-hours service: yes" : null,
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `You are an expert at writing professional voicemail scripts for local trade contractors.

Contractor info:
${context}

Write a professional voicemail greeting script that:
- Is under 20 seconds when read aloud (roughly 50–60 words)
- States the business name (or trade + city if no business name) upfront
- Tells callers they've reached the right place
- Asks them to leave their name, number, and a brief description of the job
- States the callback timeframe if provided
- Mentions emergency service availability if applicable
- Sounds warm and confident — not robotic
- Does NOT start with "Hello" or "Hi there"

Return ONLY the script text. No stage directions, no quotes, no explanation.`;

    const result = await model.generateContent(prompt);
    const script = result.response.text().trim();

    return NextResponse.json({ script });
  } catch (err) {
    console.error("Voicemail script error:", err);
    return NextResponse.json(
      { error: "Failed to generate script. Please try again." },
      { status: 500 }
    );
  }
}
