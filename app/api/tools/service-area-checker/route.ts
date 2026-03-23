import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// us-zips exports a default object mapping zip string -> { zip, lat, lng, city, state_id, state_name, population, density, county_name, timezone }
// @ts-ignore
import zips from "us-zips";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: NextRequest) {
  try {
    const { zipCode, radiusMiles, trade } = await req.json();

    if (!zipCode || !radiusMiles || !trade) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const zipData = zips as unknown as Record<string, { zip: string; lat: number; lng: number; city: string; state_id: string; state_name: string; population: number; density: number; county_name: string }>;

    const origin = zipData[zipCode];
    if (!origin) {
      return NextResponse.json({ error: "Zip code not found. Please check and try again." }, { status: 400 });
    }

    // Find all zip codes within radius
    const nearby: Array<{ city: string; state: string; distance: number; population: number; density: number; county: string }> = [];
    const seenCities = new Set<string>();

    for (const [, data] of Object.entries(zipData)) {
      const dist = haversineDistance(origin.lat, origin.lng, data.lat, data.lng);
      if (dist <= radiusMiles && dist > 0) {
        const cityKey = `${data.city}|${data.state_id}`;
        if (!seenCities.has(cityKey)) {
          seenCities.add(cityKey);
          nearby.push({
            city: data.city,
            state: data.state_id,
            distance: Math.round(dist * 10) / 10,
            population: data.population || 0,
            density: data.density || 0,
            county: data.county_name,
          });
        }
      }
    }

    // Sort by population descending, take top 25
    const topAreas = nearby.sort((a, b) => b.population - a.population).slice(0, 25);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a local marketing expert helping a ${trade} contractor maximize their Facebook Marketplace reach.

Their home base: ${origin.city}, ${origin.state_id} (zip: ${zipCode})
Drive radius: ${radiusMiles} miles
Areas within radius (sorted by population): ${JSON.stringify(topAreas.map(a => ({ city: a.city, state: a.state, distance: a.distance, population: a.population })))}

Return a JSON object with this exact shape:
{
  "homeCity": "${origin.city}",
  "homeState": "${origin.state_id}",
  "totalAreas": <number of areas found>,
  "topTargets": [
    {
      "city": "City Name",
      "state": "ST",
      "distance": 4.2,
      "population": 45000,
      "priority": "high" | "medium" | "low",
      "reason": "One specific sentence explaining why a ${trade} should prioritize this area (homeowners, density, competition, etc.)"
    }
    // include ALL areas, ranked by your recommendation (high priority first)
  ],
  "serviceAreaText": "Ready-to-paste text for their Facebook Marketplace listing describing their service area. Should sound natural, list the top cities, and end with 'and surrounding areas'. Around 2-3 sentences.",
  "proTip": "One specific tip for how a ${trade} should use this service area info in their FB Marketplace listings to get more inquiries."
}

Only return valid JSON. No markdown fences.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/```json|```/g, "").trim();
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Service area checker error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
