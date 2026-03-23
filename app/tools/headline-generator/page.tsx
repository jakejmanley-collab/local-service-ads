"use client";

import { useState } from "react";

const TRADES = [
  "Plumber",
  "Electrician",
  "HVAC Technician",
  "General Contractor",
  "Landscaper",
  "Painter",
  "Roofer",
  "Carpenter",
  "Drywall Installer",
  "Flooring Installer",
  "Handyman",
  "House Cleaner",
  "Window Cleaner",
  "Pressure Washer",
  "Snow Removal",
  "Tree Service",
  "Fence Installer",
  "Concrete / Paving",
  "Welder",
  "Moving Service",
];

export default function HeadlineGeneratorPage() {
  const [trade, setTrade] = useState("");
  const [city, setCity] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  const handleGenerate = async () => {
    if (!trade || !city) return;
    setLoading(true);
    setError("");
    setHeadlines([]);

    try {
      const res = await fetch("/api/tools/headline-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade, city, serviceType }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setHeadlines(data.headlines);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 1800);
    if (!leadSubmitted) setShowLeadCapture(true);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(headlines.join("\n"));
    setCopied(-1);
    setTimeout(() => setCopied(null), 1800);
    if (!leadSubmitted) setShowLeadCapture(true);
  };

  const handleLeadSubmit = async () => {
    if (!leadEmail.includes("@")) return;
    setLeadLoading(true);
    try {
      await fetch("/api/tools/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, tool: "headline-generator" }),
      });
    } catch {
      // fail silently — don't block the user
    } finally {
      setLeadLoading(false);
      setLeadSubmitted(true);
      setShowLeadCapture(false);
    }
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
            Contractor Ad Headline Generator
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Get 6 punchy, proven ad headlines for your trade business in
            seconds. Built for Facebook Marketplace, Kijiji, and local flyers.
          </p>
        </div>
      </section>

      {/* Tool */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
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

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Your City <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Toronto, Calgary, Kitchener"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Optional specialty */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Specialty or Service{" "}
              <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. emergency drain cleaning, kitchen renovations, snow plowing"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleGenerate}
            disabled={!trade || !city || loading}
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
                Generating…
              </span>
            ) : (
              "Generate My Headlines →"
            )}
          </button>

          {error && (
            <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Results */}
        {headlines.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                Your Headlines
              </h2>
              <button
                onClick={handleCopyAll}
                className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                {copied === -1 ? "✓ Copied all!" : "Copy all"}
              </button>
            </div>
            <ul className="space-y-3">
              {headlines.map((h, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 group hover:border-amber-400/40 transition-colors"
                >
                  <span className="text-white font-medium text-base pr-4">
                    {h}
                  </span>
                  <button
                    onClick={() => handleCopy(h, i)}
                    className="shrink-0 text-xs text-zinc-500 group-hover:text-amber-400 font-semibold transition-colors"
                  >
                    {copied === i ? "✓ Copied" : "Copy"}
                  </button>
                </li>
              ))}
            </ul>

            {/* Email capture — shown after first copy */}
            {showLeadCapture && (
              <div className="mt-6 bg-zinc-900 border border-amber-400/40 rounded-2xl px-6 py-5">
                <p className="text-white font-semibold mb-1">
                  Want more customers finding you automatically?
                </p>
                <p className="text-zinc-400 text-sm mb-4">
                  Drop your email and we&apos;ll send you a free checklist for getting more local leads.
                </p>
                <div className="flex gap-2">
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
                    {leadLoading ? "Sending…" : "Send it"}
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
              <div className="mt-6 bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-center">
                <p className="text-zinc-300 text-sm">✓ Got it — check your inbox soon.</p>
              </div>
            )}

            {/* Upsell nudge */}
            <div className="mt-6 bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-5 text-center">
              <p className="text-amber-300 font-semibold mb-1">
                Want customers to find you without posting every day?
              </p>
              <p className="text-zinc-400 text-sm mb-4">
                Get a professional contractor website that works for you 24/7.
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
            Why Your Ad Headline Matters
          </h2>
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm leading-relaxed space-y-4">
            <p>
              When a homeowner is scrolling through Facebook Marketplace or
              Kijiji, your headline is the only thing standing between you and
              their click. A weak headline — like "Plumber available" — gets
              ignored. A strong one builds instant trust and drives action.
            </p>
            <p>
              The best contractor headlines do three things: they state who you
              are, signal professionalism, and create a reason to act now.
              Including your city name also helps you rank in local searches and
              feel relevant to the reader.
            </p>
            <p>
              This free tool uses AI trained on high-converting local service
              ads to generate headlines tailored to your specific trade and
              market. Use them on Kijiji, Facebook, Google ads, flyers, or
              anywhere you need to grab attention fast.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
