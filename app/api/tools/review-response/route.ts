import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { trade, city, stars, reviewText, customerName } = await req.json();

    if (!trade || !city || !reviewText) {
      return NextResponse.json(
        { error: "Trade, city, and review text are required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const tone = Number(stars) >= 4 ? "warm and grateful" : Number(stars) === 3 ? "appreciative but acknowledging the concern" : "calm, empathetic, and solution-focused";

    const prompt = `You are an expert at writing professional review responses for local trade contractors.

A ${trade} in ${city} received a ${stars}-star review${customerName ? ` from ${customerName}` : ""}.

Review text:
"${reviewText}"

Write a professional owner response that:
- Matches the tone: ${tone}
- Addresses specific points mentioned in the review
- Mentions the trade and city naturally (good for local SEO)
- Is 3-5 sentences max — concise and genuine
- Does NOT use generic filler phrases like "We strive for excellence"
- Sounds like a real person wrote it, not a robot
${Number(stars) <= 2 ? "- For low-star reviews: acknowledge the issue, apologize sincerely, and invite them to contact you directly to resolve it" : ""}

Return ONLY the response text. No quotes, no explanation.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    return NextResponse.json({ response });
  } catch (err) {
    console.error("Review response error:", err);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
