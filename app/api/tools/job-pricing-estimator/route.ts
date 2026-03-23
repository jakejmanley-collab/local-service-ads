import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// us-zips exports a default object mapping zip string -> { zip, lat, lng, city, state_id, state_name, population, density, county_name, timezone }
// @ts-ignore
import zips from "us-zips";

const STATE_MULTIPLIERS: Record<string, number> = {
  CA: 1.45, NY: 1.40, MA: 1.35, WA: 1.30, CT: 1.28, NJ: 1.27, AK: 1.25,
  HI: 1.25, MD: 1.20, CO: 1.18, OR: 1.15, IL: 1.12, MN: 1.10, VA: 1.08,
  TX: 1.05, FL: 1.03, GA: 1.00, NC: 0.98, AZ: 0.97, TN: 0.96, OH: 0.95,
  PA: 0.97, MI: 0.95, IN: 0.92, MO: 0.92, WI: 0.91, KY: 0.90, SC: 0.90,
  AL: 0.88, LA: 0.88, OK: 0.87, AR: 0.86, MS: 0.85, WV: 0.85, NM: 0.90,
  NV: 1.05, UT: 1.00, ID: 0.92, MT: 0.90, WY: 0.90, SD: 0.88, ND: 0.90,
  NE: 0.90, KS: 0.90, IA: 0.90, ME: 0.95, NH: 1.05, VT: 0.98, RI: 1.10,
  DE: 1.05, DC: 1.40,
};

export async function POST(req: NextRequest) {
  try {
    const { trade, jobDescription, zipCode, jobSize, materialsSupplied } = await req.json();

    if (!trade || !jobDescription || !zipCode || !jobSize || !materialsSupplied) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const zipData = zips as unknown as Record<string, {
      zip: string;
      lat: number;
      lng: number;
      city: string;
      state_id: string;
      state_name: string;
      population: number;
      density: number;
      county_name: string;
    }>;

    const location = zipData[zipCode];
    if (!location) {
      return NextResponse.json({ error: "Zip code not found. Please check and try again." }, { status: 400 });
    }

    const { city, state_id, density } = location;

    let multiplier = STATE_MULTIPLIERS[state_id] ?? 1.0;
    if (density > 2000) {
      multiplier += 0.08;
    } else if (density < 200) {
      multiplier -= 0.05;
    }
    multiplier = Math.round(multiplier * 100) / 100;

    const materialsLabel =
      materialsSupplied === "contractor"
        ? "Contractor is supplying materials"
        : materialsSupplied === "customer"
        ? "Customer is supplying materials"
        : "No materials needed";

    const jobSizeLabel =
      jobSize === "small"
        ? "Small (under 2 hours)"
        : jobSize === "medium"
        ? "Medium (half day)"
        : jobSize === "large"
        ? "Large (full day)"
        : "Multi-day";

    const prompt = `You are a construction and trades pricing expert. A contractor needs to know what to charge for a job in their local market.

Trade: ${trade}
Job Description: ${jobDescription}
Job Size: ${jobSizeLabel}
Materials: ${materialsLabel}
Location: ${city}, ${state_id}
Regional Labor Multiplier: ${multiplier} (1.0 = national average; higher = more expensive market)

Use the regional multiplier to adjust pricing relative to national averages. A multiplier of ${multiplier} means this market is ${multiplier > 1 ? `${Math.round((multiplier - 1) * 100)}% above` : `${Math.round((1 - multiplier) * 100)}% below`} average.

Return a JSON object with this exact shape:
{
  "marketContext": "One sentence describing the labor cost context for this trade in this city/state market.",
  "priceRange": {
    "low": <number — lower bound of what a budget contractor might charge>,
    "fair": <number — fair market rate for an experienced contractor>,
    "high": <number — premium rate for a top-tier or specialist contractor>
  },
  "breakdown": {
    "laborHours": "e.g. 3–5 hours",
    "laborCost": "e.g. $240–$375",
    "materialsCost": "e.g. $45–$80 (or 'N/A — customer supplying' if applicable)",
    "notes": "2–3 sentences explaining what the job typically involves and what drives the price range."
  },
  "pricingFactors": [
    { "factor": "Factor name", "impact": "How this factor could raise or lower the price." },
    { "factor": "Factor name", "impact": "How this factor could raise or lower the price." },
    { "factor": "Factor name", "impact": "How this factor could raise or lower the price." }
  ],
  "fbQuoteText": "A ready-to-paste quote for Facebook Marketplace. Written in first person from the contractor's perspective. Should mention the city, the price range, what's included, and invite a DM for an exact quote. 3–4 sentences, conversational tone.",
  "proTip": "One specific, actionable tip about pricing strategy or how to use this price range when posting on Facebook Marketplace to get more responses."
}

Only return valid JSON. No markdown fences. No extra text.`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/```json|```/g, "").trim();
    const data = JSON.parse(text);

    return NextResponse.json({ ...data, city, state: state_id, multiplier });
  } catch (err) {
    console.error("Job pricing estimator error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
