import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { name, businessName, trade, city, yearsExperience, specialties, licensedInsured } =
      await req.json();

    if (!name || !trade || !city) {
      return NextResponse.json(
        { error: "Name, trade, and city are required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const context = [
      `Name: ${name}`,
      businessName ? `Business name: ${businessName}` : null,
      `Trade: ${trade}`,
      `City: ${city}`,
      yearsExperience ? `Years of experience: ${yearsExperience}` : null,
      specialties ? `Specialties: ${specialties}` : null,
      licensedInsured ? "Licensed and insured: yes" : null,
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `You are an expert copywriter for local trade contractors.

Given the following contractor info:
${context}

Write two professional bios in third person:
1. A "short bio" — under 50 words. Punchy, great for a profile snippet or ad description.
2. A "full bio" — 80 to 100 words. Warm, professional, builds trust. Mention the city, trade, experience, and specialties if provided. Include "licensed and insured" naturally if applicable.

Return ONLY a JSON object with two keys: "shortBio" and "fullBio". No markdown, no explanation.
Example: {"shortBio": "...", "fullBio": "..."}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const bios = JSON.parse(cleaned);

    return NextResponse.json(bios);
  } catch (err) {
    console.error("Bio writer error:", err);
    return NextResponse.json(
      { error: "Failed to generate bio. Please try again." },
      { status: 500 }
    );
  }
}
