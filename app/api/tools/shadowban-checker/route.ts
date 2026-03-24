import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ── Hardcoded flag categories ──────────────────────────────────────────────

type Severity = "high" | "medium";

interface HardcodedFlag {
  pattern: RegExp | string;
  isRegex: boolean;
  category: string;
  reason: string;
  severity: Severity;
  suggestedAlternative: string;
}

const HARDCODED_FLAGS: HardcodedFlag[] = [
  // Payment apps — high risk
  { pattern: "venmo", isRegex: false, category: "Payment App", reason: "Facebook suppresses off-platform payment mentions", severity: "high", suggestedAlternative: "cash or bank transfer" },
  { pattern: "zelle", isRegex: false, category: "Payment App", reason: "Facebook suppresses off-platform payment mentions", severity: "high", suggestedAlternative: "direct bank transfer" },
  { pattern: "cashapp", isRegex: false, category: "Payment App", reason: "Facebook suppresses off-platform payment mentions", severity: "high", suggestedAlternative: "cash payment" },
  { pattern: "cash app", isRegex: false, category: "Payment App", reason: "Facebook suppresses off-platform payment mentions", severity: "high", suggestedAlternative: "cash payment" },
  { pattern: "paypal", isRegex: false, category: "Payment App", reason: "Facebook suppresses off-platform payment mentions", severity: "high", suggestedAlternative: "online payment accepted" },
  { pattern: "apple pay", isRegex: false, category: "Payment App", reason: "Facebook suppresses off-platform payment mentions", severity: "high", suggestedAlternative: "tap-to-pay accepted" },
  { pattern: "google pay", isRegex: false, category: "Payment App", reason: "Facebook suppresses off-platform payment mentions", severity: "high", suggestedAlternative: "digital payment accepted" },
  { pattern: "chime", isRegex: false, category: "Payment App", reason: "Facebook suppresses off-platform payment mentions", severity: "high", suggestedAlternative: "bank transfer" },

  // Contact info — high risk (regex)
  { pattern: String.raw`\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b`, isRegex: true, category: "Phone Number", reason: "Direct contact info in listings triggers spam filters", severity: "high", suggestedAlternative: "contact through Messenger" },
  { pattern: String.raw`\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b`, isRegex: true, category: "Email Address", reason: "Email addresses in listings trigger spam filters", severity: "high", suggestedAlternative: "message me through Facebook" },

  // External platforms — medium risk
  { pattern: "whatsapp", isRegex: false, category: "External Platform", reason: "Directing users off Facebook reduces listing visibility", severity: "medium", suggestedAlternative: "Messenger" },
  { pattern: "telegram", isRegex: false, category: "External Platform", reason: "Directing users off Facebook reduces listing visibility", severity: "medium", suggestedAlternative: "Messenger" },
  { pattern: "signal", isRegex: false, category: "External Platform", reason: "Directing users off Facebook reduces listing visibility", severity: "medium", suggestedAlternative: "Messenger" },
  { pattern: "instagram", isRegex: false, category: "External Platform", reason: "Competitor platform references can reduce reach", severity: "medium", suggestedAlternative: "check my profile for more photos" },
  { pattern: "snapchat", isRegex: false, category: "External Platform", reason: "Competitor platform references can reduce reach", severity: "medium", suggestedAlternative: "message me here for more info" },
  { pattern: "tiktok", isRegex: false, category: "External Platform", reason: "Competitor platform references can reduce reach", severity: "medium", suggestedAlternative: "message me for a demo video" },
  { pattern: "craigslist", isRegex: false, category: "External Platform", reason: "Competitor marketplace references are penalized", severity: "medium", suggestedAlternative: "other listing sites" },
  { pattern: "offerup", isRegex: false, category: "External Platform", reason: "Competitor marketplace references are penalized", severity: "medium", suggestedAlternative: "other marketplaces" },
  { pattern: "thumbtack", isRegex: false, category: "External Platform", reason: "Competitor service platform references are penalized", severity: "medium", suggestedAlternative: "other booking platforms" },

  // Spam signals — medium risk
  { pattern: "best price", isRegex: false, category: "Spam Signal", reason: "Generic sales phrases trigger spam detection", severity: "medium", suggestedAlternative: "fair pricing" },
  { pattern: "lowest price", isRegex: false, category: "Spam Signal", reason: "Generic sales phrases trigger spam detection", severity: "medium", suggestedAlternative: "competitive rates" },
  { pattern: "cheapest", isRegex: false, category: "Spam Signal", reason: "Generic sales phrases trigger spam detection", severity: "medium", suggestedAlternative: "affordable" },
  { pattern: "guaranteed", isRegex: false, category: "Spam Signal", reason: "Guarantee claims are flagged as spam signals", severity: "medium", suggestedAlternative: "satisfaction assured" },
  { pattern: "100%", isRegex: false, category: "Spam Signal", reason: "Percentage claims trigger spam filters", severity: "medium", suggestedAlternative: "fully" },
  { pattern: "no one beats", isRegex: false, category: "Spam Signal", reason: "Superlative claims trigger spam detection", severity: "medium", suggestedAlternative: "hard to beat" },
  { pattern: "unbeatable", isRegex: false, category: "Spam Signal", reason: "Superlative claims trigger spam detection", severity: "medium", suggestedAlternative: "excellent value" },
  { pattern: "act now", isRegex: false, category: "Spam Signal", reason: "Urgency phrases are classic spam signals", severity: "medium", suggestedAlternative: "reach out today" },
  { pattern: "limited time", isRegex: false, category: "Spam Signal", reason: "Urgency phrases are classic spam signals", severity: "medium", suggestedAlternative: "available now" },
  { pattern: "hurry", isRegex: false, category: "Spam Signal", reason: "Urgency phrases are classic spam signals", severity: "medium", suggestedAlternative: "spots are filling up" },
  { pattern: "today only", isRegex: false, category: "Spam Signal", reason: "Urgency phrases are classic spam signals", severity: "medium", suggestedAlternative: "this week" },
  { pattern: "dm me", isRegex: false, category: "Spam Signal", reason: "Informal call-to-action phrases trigger filters", severity: "medium", suggestedAlternative: "send me a message" },
  { pattern: "message me", isRegex: false, category: "Spam Signal", reason: "Direct solicitation phrases can trigger filters", severity: "medium", suggestedAlternative: "reach out through this listing" },
  { pattern: "text me", isRegex: false, category: "Spam Signal", reason: "Off-platform contact solicitation triggers filters", severity: "medium", suggestedAlternative: "message me here" },
  { pattern: "call me", isRegex: false, category: "Spam Signal", reason: "Off-platform contact solicitation triggers filters", severity: "medium", suggestedAlternative: "connect through this listing" },

  // Brand names — medium risk
  { pattern: "google", isRegex: false, category: "Brand Name", reason: "Competitor brand mentions can reduce reach", severity: "medium", suggestedAlternative: "search online" },
  { pattern: "amazon", isRegex: false, category: "Brand Name", reason: "Competitor brand mentions can reduce reach", severity: "medium", suggestedAlternative: "online retailers" },
  { pattern: "apple", isRegex: false, category: "Brand Name", reason: "Brand mentions may trigger algorithmic scrutiny", severity: "medium", suggestedAlternative: "smartphones" },
  { pattern: "meta", isRegex: false, category: "Brand Name", reason: "Parent company name can flag algorithmic review", severity: "medium", suggestedAlternative: "the platform" },
];

// ── Hardcoded analysis runner ──────────────────────────────────────────────

interface RawFlag {
  word: string;
  category: string;
  reason: string;
  severity: Severity;
  suggestedAlternative: string;
  startIndex: number;
  endIndex: number;
}

function runHardcodedChecks(listing: string): RawFlag[] {
  const flags: RawFlag[] = [];
  const lowerListing = listing.toLowerCase();

  for (const flag of HARDCODED_FLAGS) {
    if (flag.isRegex) {
      const re = new RegExp(flag.pattern as string, "gi");
      let match: RegExpExecArray | null;
      while ((match = re.exec(listing)) !== null) {
        flags.push({
          word: match[0],
          category: flag.category,
          reason: flag.reason,
          severity: flag.severity,
          suggestedAlternative: flag.suggestedAlternative,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        });
      }
    } else {
      const needle = (flag.pattern as string).toLowerCase();
      let searchFrom = 0;
      while (true) {
        const idx = lowerListing.indexOf(needle, searchFrom);
        if (idx === -1) break;
        flags.push({
          word: listing.slice(idx, idx + needle.length),
          category: flag.category,
          reason: flag.reason,
          severity: flag.severity,
          suggestedAlternative: flag.suggestedAlternative,
          startIndex: idx,
          endIndex: idx + needle.length,
        });
        searchFrom = idx + needle.length;
      }
    }
  }

  // ALL CAPS detection (4+ character words)
  const capsRe = /\b[A-Z]{4,}\b/g;
  let capsMatch: RegExpExecArray | null;
  while ((capsMatch = capsRe.exec(listing)) !== null) {
    const word = capsMatch[0];
    // Skip if already flagged as something else at this position
    const alreadyFlagged = flags.some(
      (f) => f.startIndex <= capsMatch!.index && f.endIndex >= capsMatch!.index + word.length
    );
    if (!alreadyFlagged) {
      flags.push({
        word,
        category: "ALL CAPS",
        reason: "All-caps words signal spam and reduce listing reach",
        severity: "medium",
        suggestedAlternative: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        startIndex: capsMatch.index,
        endIndex: capsMatch.index + word.length,
      });
    }
  }

  // Excessive punctuation (!!! or ???)
  const punctRe = /[!?]{3,}/g;
  let punctMatch: RegExpExecArray | null;
  while ((punctMatch = punctRe.exec(listing)) !== null) {
    flags.push({
      word: punctMatch[0],
      category: "Excessive Punctuation",
      reason: "Repeated punctuation marks trigger spam detection",
      severity: "medium",
      suggestedAlternative: punctMatch[0][0], // single punctuation
      startIndex: punctMatch.index,
      endIndex: punctMatch.index + punctMatch[0].length,
    });
  }

  return flags;
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { listing } = await req.json();

    if (!listing || typeof listing !== "string" || listing.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a listing with at least 10 characters." },
        { status: 400 }
      );
    }

    const hardcodedFlags = runHardcodedChecks(listing);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const flagSummary =
      hardcodedFlags.length > 0
        ? hardcodedFlags
            .map((f) => `- "${f.word}" (${f.category}, ${f.severity} risk): ${f.reason}`)
            .join("\n")
        : "None detected by hardcoded rules.";

    const prompt = `You are an expert on Facebook Marketplace algorithm rules and shadowbanning. Analyze this listing for anything that could get it suppressed, hidden, or flagged.

LISTING:
"""
${listing}
"""

ALREADY DETECTED BY RULES:
${flagSummary}

Your job:
1. Find any additional risky words, phrases, or patterns NOT already in the detected list above
2. For every flagged item (both from the rules and any new ones you find), provide a safe alternative word or phrase
3. Write a cleaned version of the listing with ALL risky items replaced with safe alternatives
4. Provide an overall risk score

Consider these additional risk factors:
- Overly promotional language that sounds like an ad, not a genuine listing
- Vague or misleading descriptions
- Anything that reads as a commercial solicitation rather than a genuine Marketplace post
- Industry-specific terminology that could be misread as suspicious
- URLs or website links (high risk)
- Pricing manipulation language

Return ONLY valid JSON (no markdown fences) in this exact shape:
{
  "riskScore": "low" | "medium" | "high",
  "additionalFlags": [
    {
      "word": "exact text from listing",
      "category": "category name",
      "reason": "why this is risky",
      "severity": "high" | "medium",
      "suggestedAlternative": "safe replacement",
      "startIndex": <number>,
      "endIndex": <number>
    }
  ],
  "alternativesForHardcodedFlags": [
    {
      "word": "exact flagged word from listing",
      "suggestedAlternative": "better contextual replacement"
    }
  ],
  "cleanedListing": "the full listing text with all risky items replaced"
}

For startIndex/endIndex: count from 0 in the original listing string.
If you find no additional flags, return an empty array for additionalFlags.
The cleanedListing must be natural-sounding and ready to post.`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let geminiData: {
      riskScore: "low" | "medium" | "high";
      additionalFlags: RawFlag[];
      alternativesForHardcodedFlags: { word: string; suggestedAlternative: string }[];
      cleanedListing: string;
    };

    try {
      geminiData = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Analysis failed to parse. Please try again." },
        { status: 500 }
      );
    }

    // Merge hardcoded flags with Gemini-improved alternatives
    const alternativesMap = new Map(
      (geminiData.alternativesForHardcodedFlags || []).map((a) => [
        a.word.toLowerCase(),
        a.suggestedAlternative,
      ])
    );

    const mergedHardcodedFlags = hardcodedFlags.map((f) => ({
      ...f,
      suggestedAlternative:
        alternativesMap.get(f.word.toLowerCase()) || f.suggestedAlternative,
    }));

    // Combine all flags, deduplicate by startIndex
    const allFlags: RawFlag[] = [...mergedHardcodedFlags];
    for (const af of geminiData.additionalFlags || []) {
      const duplicate = allFlags.some(
        (f) =>
          f.startIndex === af.startIndex ||
          f.word.toLowerCase() === af.word.toLowerCase()
      );
      if (!duplicate) {
        allFlags.push(af);
      }
    }

    // Sort by position in text
    allFlags.sort((a, b) => a.startIndex - b.startIndex);

    return NextResponse.json({
      riskScore: geminiData.riskScore,
      flags: allFlags,
      cleanedListing: geminiData.cleanedListing,
    });
  } catch (err) {
    console.error("Shadowban checker error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
