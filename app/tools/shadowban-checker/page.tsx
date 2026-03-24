"use client";

import { useState } from "react";

interface Flag {
  word: string;
  category: string;
  reason: string;
  severity: "high" | "medium";
  suggestedAlternative: string;
  startIndex: number;
  endIndex: number;
}

interface AnalysisResult {
  riskScore: "low" | "medium" | "high";
  flags: Flag[];
  cleanedListing: string;
}

function RiskBadge({ score }: { score: "low" | "medium" | "high" }) {
  const styles = {
    low: "bg-green-500/20 text-green-400 border-green-500/40",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    high: "bg-red-500/20 text-red-400 border-red-500/40",
  };
  const labels = { low: "Low Risk", medium: "Medium Risk", high: "High Risk" };

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm ${styles[score]}`}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          score === "low"
            ? "bg-green-400"
            : score === "medium"
            ? "bg-amber-400"
            : "bg-red-400"
        }`}
      />
      {labels[score]}
    </span>
  );
}

function HighlightedText({
  text,
  flags,
}: {
  text: string;
  flags: Flag[];
}) {
  if (flags.length === 0) {
    return (
      <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    );
  }

  // Build non-overlapping segments sorted by startIndex
  const sorted = [...flags].sort((a, b) => a.startIndex - b.startIndex);
  const segments: { text: string; flag: Flag | null }[] = [];
  let cursor = 0;

  for (const flag of sorted) {
    if (flag.startIndex < cursor) continue; // skip overlaps
    if (flag.startIndex > cursor) {
      segments.push({ text: text.slice(cursor, flag.startIndex), flag: null });
    }
    segments.push({
      text: text.slice(flag.startIndex, flag.endIndex),
      flag,
    });
    cursor = flag.endIndex;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), flag: null });
  }

  return (
    <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
      {segments.map((seg, i) =>
        seg.flag ? (
          <mark
            key={i}
            title={`${seg.flag.category}: ${seg.flag.reason}`}
            className={`rounded px-0.5 font-semibold ${
              seg.flag.severity === "high"
                ? "bg-red-500/40 text-red-200"
                : "bg-amber-500/40 text-amber-200"
            }`}
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </p>
  );
}

export default function ShadowbanCheckerPage() {
  const [listing, setListing] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  const handleCheck = async () => {
    if (!listing.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/shadowban-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCleaned = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.cleanedListing);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    if (!leadSubmitted) setShowLeadCapture(true);
  };

  const handleLeadSubmit = async () => {
    if (!leadEmail.includes("@")) return;
    setLeadLoading(true);
    try {
      await fetch("/api/tools/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, tool: "shadowban-checker" }),
      });
    } catch {
      // fail silently
    } finally {
      setLeadLoading(false);
      setLeadSubmitted(true);
      setShowLeadCapture(false);
    }
  };

  const highFlags = result?.flags.filter((f) => f.severity === "high") ?? [];
  const mediumFlags = result?.flags.filter((f) => f.severity === "medium") ?? [];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Facebook Marketplace Shadowban Checker
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Paste your listing and find out which words are getting you
            suppressed — with safe replacements and a cleaned version ready to
            copy.
          </p>
        </div>
      </section>

      {/* Tool */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="mb-7">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Your Facebook Marketplace Listing{" "}
              <span className="text-amber-400">*</span>
            </label>
            <textarea
              value={listing}
              onChange={(e) => setListing(e.target.value)}
              placeholder="Paste your listing description here. The more complete it is, the better the analysis."
              rows={10}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-y leading-relaxed"
            />
          </div>

          <button
            onClick={handleCheck}
            disabled={!listing.trim() || loading}
            className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-900 font-bold text-base py-4 rounded-xl transition-colors duration-150"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Analyzing your listing…
              </span>
            ) : (
              "Check My Listing →"
            )}
          </button>

          {error && (
            <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Risk Score */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="shrink-0">
                  <RiskBadge score={result.riskScore} />
                </div>
                <div className="text-zinc-400 text-sm">
                  {result.flags.length === 0
                    ? "No flagged words detected. Your listing looks clean."
                    : `${result.flags.length} flagged item${result.flags.length === 1 ? "" : "s"} found — ${highFlags.length} high risk, ${mediumFlags.length} medium risk.`}
                </div>
              </div>

              {/* Legend */}
              {result.flags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-sm bg-red-500/40" />
                    <span className="text-zinc-400">High risk</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-sm bg-amber-500/40" />
                    <span className="text-zinc-400">Medium risk</span>
                  </span>
                </div>
              )}
            </div>

            {/* Highlighted original text */}
            {result.flags.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-4">
                  Your Listing — Flagged Words Highlighted
                </h2>
                <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-4">
                  <HighlightedText text={listing} flags={result.flags} />
                </div>
              </div>
            )}

            {/* Flagged items list */}
            {result.flags.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-4">
                  Flagged Items
                </h2>
                <ul className="space-y-4">
                  {result.flags.map((flag, i) => (
                    <li
                      key={i}
                      className={`rounded-xl px-5 py-4 border ${
                        flag.severity === "high"
                          ? "bg-red-500/5 border-red-500/20"
                          : "bg-amber-500/5 border-amber-500/20"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`font-bold text-sm font-mono px-2 py-0.5 rounded ${
                            flag.severity === "high"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {flag.word}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {flag.category}
                        </span>
                        <span
                          className={`text-xs font-semibold ml-auto ${
                            flag.severity === "high"
                              ? "text-red-400"
                              : "text-amber-400"
                          }`}
                        >
                          {flag.severity === "high" ? "High Risk" : "Medium Risk"}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm mb-2">{flag.reason}</p>
                      <p className="text-zinc-300 text-sm">
                        <span className="text-zinc-500">Try instead: </span>
                        <span className="font-medium text-green-400">
                          {flag.suggestedAlternative}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cleaned listing */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">
                  Cleaned Listing
                </h2>
                <button
                  onClick={handleCopyCleaned}
                  className="text-sm bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 font-semibold px-4 py-2 rounded-lg border border-amber-400/30 transition-colors"
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-4">
                <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {result.cleanedListing}
                </p>
              </div>

              {/* Lead capture — shown after copy */}
              {showLeadCapture && (
                <div className="mt-5 bg-zinc-900 border border-amber-400/40 rounded-2xl px-6 py-5">
                  <p className="text-white font-semibold mb-1">
                    Want us to let you know when we add new free tools?
                  </p>
                  <div className="flex gap-2 mt-3">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                    <button
                      onClick={handleLeadSubmit}
                      disabled={leadLoading || !leadEmail.includes("@")}
                      className="bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-900 font-bold px-4 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
                    >
                      {leadLoading ? "Sending…" : "Yes, keep me posted"}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowLeadCapture(false)}
                    className="mt-3 text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
                  >
                    No thanks
                  </button>
                </div>
              )}

              {/* Submitted confirmation */}
              {leadSubmitted && (
                <div className="mt-5 bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-center">
                  <p className="text-zinc-300 text-sm">
                    ✓ Got it — check your inbox soon.
                  </p>
                </div>
              )}
            </div>

            {/* Upsell */}
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-7 text-center">
              <p className="text-amber-300 font-semibold mb-1">
                Tired of fighting the algorithm to get seen?
              </p>
              <p className="text-zinc-400 text-sm mb-4">
                A professional contractor website puts you in front of buyers
                who are already searching — no listings, no filters.
              </p>
              <a
                href="/upgrade-offer"
                className="inline-block bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                See Pricing →
              </a>
            </div>
          </div>
        )}
      </section>

      {/* SEO Content */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="border-t border-zinc-800 pt-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Why Facebook Marketplace Listings Get Suppressed
          </h2>
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm leading-relaxed space-y-4">
            <p>
              Facebook Marketplace uses automated filters to detect spam,
              off-platform solicitation, and policy violations. Even
              well-intentioned listings can get hidden if they contain certain
              words or patterns that the algorithm flags.
            </p>
            <p>
              Common triggers include payment app names like Venmo or PayPal
              (Facebook wants transactions to stay on-platform), phone numbers
              and email addresses in descriptions, and urgency phrases that
              read like spam. Listings that use all-caps words or excessive
              punctuation are also penalized.
            </p>
            <p>
              This tool scans your listing against a database of known
              trigger patterns and also uses AI to catch context-specific
              issues. The cleaned version gives you a ready-to-post listing
              that stays within the lines.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
