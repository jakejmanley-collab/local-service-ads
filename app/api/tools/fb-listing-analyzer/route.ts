import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { listing, trade } = await req.json();

    if (!listing || !trade) {
      return NextResponse.json(
        { error: "Listing and trade are required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert Facebook Marketplace coach for local service contractors. You have reviewed thousands of listings and know exactly what separates a listing that gets ignored from one that generates calls.

A ${trade} has submitted their Facebook Marketplace listing for review. Analyze it specifically — not generically. Reference actual phrases or gaps from the listing itself.

LISTING TO ANALYZE:
"""
${listing}
"""

Evaluate the listing on these criteria:
- Does it have a clear price or price range?
- Does it have a call to action (call, text, DM)?
- Does it mention the service area or city?
- Does it have trust signals (licensed, insured, years of experience, guarantees)?
- Is the tone professional and buyer-focused?
- Is it specific about what services are offered?
- Does it create urgency or stand out from generic listings?

Return ONLY valid JSON (no markdown, no code fences) in exactly this shape:
{
  "score": <integer 1-10>,
  "verdict": "<one sentence summary of the listing's main strength and biggest weakness>",
  "whatsWorking": ["<specific thing 1>", "<specific thing 2>"],
  "whatsMissing": [
    { "issue": "<short label>", "why": "<1-2 sentences explaining why this hurts the listing and what buyers think when they see it missing>" },
    { "issue": "<short label>", "why": "<explanation>" }
  ],
  "improvedListing": "<full rewritten listing ready to paste into Facebook Marketplace, fixing every gap identified, written in first person, with a strong opening line, price range or starting rate, clear service area, trust signals, specific services, and a clear call to action>"
}

Rules:
- Score honestly. A listing missing price, CTA, and trust signals should score 3-5, not 7-8.
- whatsWorking should have 2-3 items maximum. Only cite things that are genuinely present in the listing.
- whatsMissing should have 3-5 items. Be specific about what is actually missing from this listing.
- The improvedListing must be a complete, ready-to-use Facebook Marketplace listing — not a template, not instructions. Write it as if you are the contractor.
- Do not be generic. Reference the specific trade, any details mentioned, and the actual gaps you found.`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Strip markdown fences if present
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleaned);

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("FB listing analyzer error:", err);
    return NextResponse.json(
      { error: "Failed to analyze listing. Please try again." },
      { status: 500 }
    );
  }
}
