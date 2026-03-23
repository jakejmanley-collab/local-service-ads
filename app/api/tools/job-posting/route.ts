import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { trade, city, businessName, positionType, experience, payRange, perks } = await req.json();

    if (!trade || !city) {
      return NextResponse.json(
        { error: "Trade and city are required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const context = [
      `Trade: ${trade}`,
      `City: ${city}`,
      businessName ? `Business name: ${businessName}` : null,
      `Position type: ${positionType}`,
      experience ? `Experience required: ${experience}` : null,
      payRange ? `Pay range: ${payRange}` : null,
      perks ? `Perks / benefits: ${perks}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `You are an expert at writing job postings for local trade contractor businesses.

Job details:
${context}

Write a job posting that:
- Has a concise, specific job title (e.g. "Journeyman Plumber – Toronto" or "Landscaping Crew Member – Calgary")
- Has a body that is 150–200 words
- Opens with a short "About us" sentence (1–2 sentences)
- Describes the role and day-to-day responsibilities clearly
- Lists 3–5 requirements or qualifications (use plain text, not bullet symbols)
- Mentions pay range if provided
- Lists perks/benefits if provided
- Ends with clear instructions on how to apply (call, text, or email)
- Sounds like a real employer — direct and approachable

Return ONLY a JSON object with two keys: "title" and "posting". No markdown, no explanation.
Example: {"title": "Journeyman Plumber – Toronto", "posting": "..."}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Job posting error:", err);
    return NextResponse.json(
      { error: "Failed to generate job posting. Please try again." },
      { status: 500 }
    );
  }
}
