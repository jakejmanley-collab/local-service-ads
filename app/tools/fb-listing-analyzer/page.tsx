"use client";

import { useState } from "react";
import Link from "next/link";

const TRADES = [
  "Plumber",
  "Electrician",
  "HVAC Technician",
  "Landscaper",
  "Roofer",
  "Painter",
  "Handyman",
  "Cleaner",
  "Pressure Washer",
  "Other",
];

interface MissingItem {
  issue: string;
  why: string;
}

interface AnalysisResult {
  score: number;
  verdict: string;
  whatsWorking: string[];
  whatsMissing: MissingItem[];
  improvedListing: string;
}

function LeadCaptureModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch("/api/tools/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tool: "fb-listing-analyzer" }),
      });
      setSubmitted(true);
    } catch {
      // Silently close on error
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        {submitted ? (
          <div className="text-center">
            <p className="text-amber-400 font-bold text-lg mb-2">You&apos;re on the list!</p>
            <p className="text-zinc-400 text-sm mb-6">
              We&apos;ll let you know when we add new free tools.
            </p>
            <button
              onClick={onClose}
              className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-white font-bold text-lg mb-2">
              Want us to let you know when we add new free tools?
            </h3>
            <p className="text-zinc-400 text-sm mb-5">
              No spam. Just a quick heads-up when something new drops.
            </p>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent mb-3"
            />
            <button
              onClick={handleSubmit}
              disabled={!email || submitting}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-900 font-bold py-3 rounded-xl text-sm transition-colors mb-3"
            >
              {submitting ? "Saving…" : "Yes, keep me posted"}
            </button>
            <button
              onClick={onClose}
              className="w-full text-zinc-500 hover:text-zinc-300 text-sm py-1 transition-colors"
            >
              No thanks, skip
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  let colorClass = "text-red-400";
  if (score > 7) colorClass = "text-green-400";
  else if (score >= 5) colorClass = "text-yellow-400";

  return (
    <span className={`text-6xl font-black leading-none ${colorClass}`}>
      {score}
      <span className="text-2xl font-bold text-zinc-500">/10</span>
    </span>
  );
}

export default function FbListingAnalyzerPage() {
  const [trade, setTrade] = useState("");
  const [listing, setListing] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  const handleAnalyze = async () => {
    if (!trade || !listing.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/fb-listing-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing, trade }),
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

  const handleCopyImproved = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.improvedListing);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);

    if (!hasShownModal) {
      setHasShownModal(true);
      setTimeout(() => setShowModal(true), 400);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {showModal && <LeadCaptureModal onClose={() => setShowModal(false)} />}

      {/* Hero */}
      <section className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Facebook Marketplace Listing Analyzer
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Paste any listing, pick your trade, and get a score, specific
            gaps, and an improved version ready to copy.
          </p>
        </div>
      </section>

      {/* Tool */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          {/* Trade */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Your Trade <span className="text-amber-400">*</span>
            </label>
            <select
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="">Select your trade…</option>
              {TRADES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Listing textarea */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Your Facebook Marketplace Listing <span className="text-amber-400">*</span>
            </label>
            <textarea
              value={listing}
              onChange={(e) => setListing(e.target.value)}
              placeholder="Paste your Facebook Marketplace listing here..."
              rows={10}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-y leading-relaxed"
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleAnalyze}
            disabled={!trade || !listing.trim() || loading}
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
              "Analyze My Listing →"
            )}
          </button>

          {error && (
            <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Score + Verdict */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="shrink-0">
                  <ScoreBadge score={result.score} />
                </div>
                <div>
                  <p className="text-zinc-300 text-base leading-relaxed">
                    {result.verdict}
                  </p>
                </div>
              </div>
            </div>

            {/* What's Working */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-green-400">&#10003;</span> What&apos;s Working
              </h2>
              <ul className="space-y-2">
                {result.whatsWorking.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-400 mt-0.5 shrink-0">&#8226;</span>
                    <span className="text-zinc-300 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Missing */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-red-400">&#9888;</span> What&apos;s Missing
              </h2>
              <ul className="space-y-4">
                {result.whatsMissing.map((item, i) => (
                  <li key={i} className="border-l-2 border-red-400/40 pl-4">
                    <p className="text-white font-semibold text-sm mb-1">{item.issue}</p>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.why}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improved Listing */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">
                  Your Improved Listing
                </h2>
                <button
                  onClick={handleCopyImproved}
                  className="text-sm bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 font-semibold px-4 py-2 rounded-lg border border-amber-400/30 transition-colors"
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-4">
                <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {result.improvedListing}
                </p>
              </div>
            </div>

            {/* Upsell */}
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-7 text-center">
              <h3 className="text-white font-bold text-lg mb-2">
                Stop rewriting listings. Get customers finding you automatically.
              </h3>
              <p className="text-zinc-400 text-sm mb-5 max-w-sm mx-auto leading-relaxed">
                A professional website puts you in front of buyers who are
                already searching for your service — no posting, no guessing.
              </p>
              <Link
                href="/upgrade-offer"
                className="inline-block bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold px-7 py-3 rounded-xl text-sm transition-colors"
              >
                See how it works
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
