import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Environment variable GEMINI_API_KEY is not set." }, { status: 500 });
    }

    // Direct REST call to the 2026 Gemini 3 production endpoint
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Return ONLY a JSON object for:
            Business: ${businessName}
            Trade: ${trade}
            Services: ${services.join(", ")}

            Required JSON keys:
            {
              "professional": { "headline": "...", "description": "..." },
              "friendly": { "headline": "...", "description": "..." },
              "aggressive": { "headline": "...", "description": "..." },
              "tags": "..."
            }`
          }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        error: data.error?.message || "Google API Response Error",
        status: response.status 
      }, { status: response.status });
    }

    // Extraction logic to handle potential model chatter
    const rawText = data.candidates[0].content.parts[0].text;
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error("AI output was not parseable JSON.");
    
    return NextResponse.json(JSON.parse(jsonMatch[0]));

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
