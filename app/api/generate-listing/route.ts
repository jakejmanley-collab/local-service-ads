import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { businessName, trade, services } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("CRITICAL ERROR: GEMINI_API_KEY is missing in Vercel environment variables.");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // 2026 Production Endpoint for Gemini 3 Flash
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Write 3 professional Facebook Marketplace listings for a ${trade} business named ${businessName}. 
            Services offered: ${services.join(", ")}.
            
            Strictly return ONLY a JSON object with this structure:
            {
              "professional": { "headline": "...", "description": "..." },
              "friendly": { "headline": "...", "description": "..." },
              "aggressive": { "headline": "...", "description": "..." },
              "tags": "tag1, tag2, tag3"
            }
            Do not include markdown, backticks, or any text before or after the JSON.`
          }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google API Response Error:", data);
      return NextResponse.json({ error: data.error?.message || "Upstream API Error" }, { status: response.status });
    }

    // Defensive parsing: Ensure we extract JSON even if the model adds fluff
    const rawText = data.candidates[0].content.parts[0].text;
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("AI failed to return a parseable JSON object.");
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));

  } catch (error: any) {
    console.error("Internal Server Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
