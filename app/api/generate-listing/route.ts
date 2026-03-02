import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    // UPDATED MODEL: gemini-3-flash is the 2026 production standard
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=${apiKey}`;

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
            Each tone needs a "headline" and "description" key. No markdown.`
          }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Model Error" }, { status: response.status });
    }

    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error("AI returned invalid JSON format");
    
    return NextResponse.json(JSON.parse(jsonMatch[0]));

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
