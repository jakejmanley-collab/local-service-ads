import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { trade, city, yourName, customerName, jobDescription, estimateAmount } = await req.json();

    if (!trade || !city || !yourName || !jobDescription) {
      return NextResponse.json(
        { error: "Trade, city, your name, and job description are required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const context = [
      `Trade: ${trade}`,
      `City: ${city}`,
      `Contractor name: ${yourName}`,
      customerName ? `Customer name: ${customerName}` : null,
      `Job: ${jobDescription}`,
      estimateAmount ? `Estimate amount: ${estimateAmount}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `You are an expert at writing follow-up emails for local trade contractors.

Contractor info:
${context}

Write a professional, friendly follow-up email to send after giving a quote. The email should:
- Have a concise subject line (under 10 words)
- Be 3-4 short paragraphs in the body
- Open by referencing the estimate/quote
- Briefly restate the job and price if provided
- Reinforce why they should choose this contractor (reliability, local, quality)
- End with a clear, friendly call to action
- Sound like a real person — warm but professional
- NOT use generic filler like "I hope this email finds you well"

Return ONLY a JSON object with two keys: "subject" and "body". No markdown, no explanation.
Example: {"subject": "Following up on your plumbing estimate", "body": "Hi John,\\n\\n..."}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Estimate email error:", err);
    return NextResponse.json(
      { error: "Failed to generate email. Please try again." },
      { status: 500 }
    );
  }
}
