"use client";

import { useState } from "react";

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

const RADIUS_TICKS = [5, 15, 25, 50, 75];

interface TopTarget {
  city: string;
  state: string;
  distance: number;
  population: number;
  priority: "high" | "medium" | "low";
  reason: string;
}

interface ServiceAreaResult {
  homeCity: string;
  homeState: string;
  totalAreas: number;
  topTargets: TopTarget[];
  serviceAreaText: string;
  proTip: string;
}

export default function ServiceAreaCheckerPage() {
  const [zipCode, setZipCode] = useState("");
  const [radiusMiles, setRadiusMiles] = useState(25);
  const [trade, setTrade] = useState("");
  const [result, setResult] = useState<ServiceAreaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  const handleCheck = async () => {
    if (!zipCode || zipCode.length !== 5 || !trade) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/service-area-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zipCode, radiusMiles, trade }),
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

  const handleCopyServiceArea = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.serviceAreaText);
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
        body: JSON.stringify({ email: leadEmail, tool: "service-area-checker" }),
      });
    } catch {
      // fail silently — don't block the user
    } finally {
      setLeadLoading(false);
      setLeadSubmitted(true);
      setShowLeadCapture(false);
    }
  };

  const priorityBadge = (priority: TopTarget["priority"]) => {
    if (priority === "high") {
      return (
        <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30">
          High
        </span>
      );
    }
    if (priority === "medium") {
      return (
        <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-300 border border-zinc-600">
          Med
        </span>
      );
    }
    return (
      <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
        Low
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Service Area Checker
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Enter your zip code and drive radius to get a ranked list of cities
            to target — plus ready-to-paste Facebook Marketplace service area
            text.
          </p>
        </div>
      </section>

      {/* Tool */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            {/* Zip Code */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Your Zip Code <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 90210"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                maxLength={5}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            {/* Trade */}
            <div>
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
          </div>

          {/* Radius Slider */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-zinc-300 mb-1">
              How far will you drive?
            </label>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl font-extrabold text-amber-400 tabular-nums w-28">
                {radiusMiles} miles
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={75}
              step={5}
              value={radiusMiles}
              onChange={(e) => setRadiusMiles(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              {RADIUS_TICKS.map((tick) => (
                <span
                  key={tick}
                  className={`text-xs font-medium ${
                    radiusMiles === tick ? "text-amber-400" : "text-zinc-500"
                  }`}
                >
                  {tick}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleCheck}
            disabled={!zipCode || zipCode.length !== 5 || !trade || loading}
            className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-900 font-bold text-base py-4 rounded-xl transition-colors duration-150"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
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
                Checking your coverage…
              </span>
            ) : (
              "Check My Coverage →"
            )}
          </button>

          {error && (
            <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Coverage Summary Bar */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-zinc-400">📍</span>
              <span className="text-white font-semibold">
                {result.homeCity}, {result.homeState}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300">{radiusMiles} mile radius</span>
              <span className="text-zinc-600">·</span>
              <span className="text-amber-400 font-bold">
                {result.totalAreas} cities covered
              </span>
            </div>

            {/* Top Targets */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Top Target Areas</h2>
              <div className="space-y-3">
                {result.topTargets.map((target, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-white font-semibold">
                          {target.city}, {target.state}
                        </span>
                        {priorityBadge(target.priority)}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-zinc-500">{target.distance} mi away</div>
                        <div className="text-xs text-zinc-500">
                          {target.population.toLocaleString()} pop.
                        </div>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm mt-2">{target.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Area Text */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                Ready-to-Paste Service Area Text
              </h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <p className="text-zinc-200 text-sm leading-relaxed mb-4">
                  {result.serviceAreaText}
                </p>
                <button
                  onClick={handleCopyServiceArea}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm py-3 rounded-lg transition-colors"
                >
                  {copied ? "✓ Copied!" : "Copy Service Area Text"}
                </button>
              </div>
            </div>

            {/* Lead Capture */}
            {showLeadCapture && (
              <div className="bg-zinc-900 border border-amber-400/40 rounded-2xl px-6 py-5">
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
              <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-center">
                <p className="text-zinc-300 text-sm">✓ Got it — check your inbox soon.</p>
              </div>
            )}

            {/* Pro Tip */}
            <div className="border-l-4 border-amber-400 bg-zinc-900 rounded-r-xl px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">
                Pro Tip
              </p>
              <p className="text-zinc-300 text-sm leading-relaxed">{result.proTip}</p>
            </div>

            {/* Upsell */}
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-6 text-center">
              <p className="text-amber-300 font-semibold mb-2">
                Your service area deserves a permanent home online.
              </p>
              <p className="text-zinc-400 text-sm mb-5">
                A website means customers in all these cities can find you on
                Google — without you posting every day.
              </p>
              <a
                href="/upgrade-offer"
                className="inline-block bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                See how it works →
              </a>
            </div>
          </div>
        )}
      </section>

      {/* SEO Content */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="border-t border-zinc-800 pt-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Why Your Service Area Matters on Facebook Marketplace
          </h2>
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm leading-relaxed space-y-4">
            <p>
              Most contractors write something like "serving the greater metro
              area" — which tells customers nothing. A specific, well-written
              service area description builds instant credibility and helps you
              rank higher in Facebook Marketplace search results.
            </p>
            <p>
              This tool uses real US zip code data to find every city and town
              within your driving range, ranks them by population and market
              value, and gives you copy you can paste straight into your
              listings. No guessing, no generic templates.
            </p>
            <p>
              The more specific your service area, the more likely homeowners in
              those communities are to contact you instead of a competitor who
              listed a vague region. Use this text in your listing title,
              description, and any pinned posts.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
