import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    // VERIFIED: gemini-2.5-flash is the stable production model for March 2026
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Write 3 Facebook Marketplace listings for:
            Business: ${businessName}
            Trade: ${trade}
            Services: ${services.join(", ")}
            Return ONLY a JSON object with keys: "professional", "friendly", "aggressive", "tags".
            Each tone needs a "headline" and "description" key. No markdown formatting.`
          }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "API Error" }, { status: response.status });
    }

    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error("Invalid AI response");
    
    return NextResponse.json(JSON.parse(jsonMatch[0]));

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
