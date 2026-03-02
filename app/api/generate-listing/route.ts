import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing in Vercel" }, { status: 500 });
    }

    // Direct fetch to the stable v1 production endpoint (Bypassing SDK bugs)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
            Each tone needs a "headline" and "description" key.`
          }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Google API Error" }, { status: response.status });
    }

    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return NextResponse.json(JSON.parse(jsonMatch[0]));

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
