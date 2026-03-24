import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const {
      trade,
      serviceDescription,
      price,
      location,
      specialOffer,
      contactPreference,
      phone,
    } = await req.json();

    if (!trade || !serviceDescription || !price || !location) {
      return NextResponse.json(
        { error: "Trade, service description, price, and location are required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const phoneInfo =
      phone && contactPreference !== "Message only"
        ? `Phone: ${phone}`
        : "No phone number provided — contact via message only";

    const offerInfo = specialOffer
      ? `Special offer/guarantee: ${specialOffer}`
      : "No special offer";

    const prompt = `You are an expert copywriter for local trade businesses who knows exactly how to format listings for each major platform. Generate 3 platform-specific listings for this contractor.

SERVICE DETAILS:
- Trade/Service: ${trade}
- Service Description: ${serviceDescription}
- Price: ${price}
- Location/Service Area: ${location}
- ${offerInfo}
- Contact Preference: ${contactPreference}
- ${phoneInfo}

PLATFORM RULES — follow these exactly:

=== FACEBOOK MARKETPLACE ===
- Short punchy title (under 100 chars)
- Short paragraphs with line breaks every 2-3 sentences (mobile-first audience)
- Use emoji as bullet points (✅ ⭐ 🔧 💪 🏠 etc.) — regular bullet points do NOT render on Facebook
- DO NOT include any phone number in the description (causes shadowbanning)
- End with "Message me to book" as the CTA
- Mention the service area naturally in the text
- Keep it conversational and direct
- Format: Title on first line, then blank line, then body

=== CRAIGSLIST ===
- Longer form is fine — desktop audience
- Plain text structure only — no markdown formatting, no emoji whatsoever
- ALL CAPS for section headers: ABOUT ME, SERVICES INCLUDE, PRICING, CONTACT
- Phone number should be included in the CONTACT section if provided
- End with "Reply to this post or call/text [number]" CTA (use the actual number if provided, otherwise "reply to this post")
- More formal and informational tone
- Use dashes (- ) for bullet points under each section
- Format: Title on first line, then blank line, then body

=== KIJIJI ===
- Conversational and friendly tone — mix of casual and professional
- Standard bullet points work — use • character
- Include price information clearly
- Phone number fine to include if provided
- Mention location prominently near the top
- End with "Feel free to message or call/text anytime" CTA (include number if provided)
- Format: Title on first line, then blank line, then body

Return ONLY valid JSON (no markdown fences, no explanation) in this exact shape:
{
  "facebook": "full Facebook Marketplace listing text here",
  "craigslist": "full Craigslist listing text here",
  "kijiji": "full Kijiji listing text here"
}

Each value must be the complete ready-to-paste listing text including the title on the first line. Use actual newlines (\\n) for line breaks within the strings.`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let data: { facebook: string; craigslist: string; kijiji: string };

    try {
      data = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse listings. Please try again." },
        { status: 500 }
      );
    }

    if (!data.facebook || !data.craigslist || !data.kijiji) {
      return NextResponse.json(
        { error: "Incomplete listings returned. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      facebook: data.facebook,
      craigslist: data.craigslist,
      kijiji: data.kijiji,
    });
  } catch (err) {
    console.error("Cross-platform formatter error:", err);
    return NextResponse.json(
      { error: "Failed to generate listings. Please try again." },
      { status: 500 }
    );
  }
}
