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

const STAR_OPTIONS = [
  { value: "5", label: "⭐⭐⭐⭐⭐ 5 stars" },
  { value: "4", label: "⭐⭐⭐⭐ 4 stars" },
  { value: "3", label: "⭐⭐⭐ 3 stars" },
  { value: "2", label: "⭐⭐ 2 stars" },
  { value: "1", label: "⭐ 1 star" },
];

export default function ReviewResponsePage() {
  const [trade, setTrade] = useState("");
  const [city, setCity] = useState("");
  const [stars, setStars] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!trade || !city || !reviewText) return;
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/tools/review-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade, city, stars, reviewText, customerName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResponse(data.response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
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
            Review Response Generator
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Generate a professional, on-brand response to any Google or Yelp
            review in seconds. Works for 5-star praise and tough 1-star
            complaints.
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

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Review Rating <span className="text-amber-400">*</span>
              </label>
              <select
                value={stars}
                onChange={(e) => setStars(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              >
                {STAR_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Customer Name{" "}
                <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah M."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Paste the Review <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="e.g. Great service! Mike showed up on time, fixed our drain quickly, and cleaned up after. Would definitely recommend."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleGenerate}
            disabled={!trade || !city || !reviewText || loading}
            className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-900 font-bold text-base py-4 rounded-xl transition-colors duration-150"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Generating…
              </span>
            ) : (
              "Generate My Response →"
            )}
          </button>

          {error && (
            <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Result */}
        {response && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Your Response</h2>
              <button
                onClick={handleCopy}
                className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-5 group hover:border-amber-400/40 transition-colors">
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{response}</p>
            </div>

            {/* Upsell nudge */}
            <div className="mt-6 bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-5 text-center">
              <p className="text-amber-300 font-semibold mb-1">
                Want more customers leaving great reviews?
              </p>
              <p className="text-zinc-400 text-sm mb-4">
                A professional business page on Aretifi makes it easy for happy customers to find and recommend you.
              </p>
              <a
                href="/preview"
                className="inline-block bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                Try the Free Flyer Builder →
              </a>
            </div>
          </div>
        )}
      </section>

      {/* SEO Content */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="border-t border-zinc-800 pt-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Why Responding to Reviews Matters for Contractors
          </h2>
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm leading-relaxed space-y-4">
            <p>
              When a homeowner searches for a plumber, electrician, or landscaper, they read the reviews — but they also notice who responds to them. Responding to every review, good or bad, signals that you're an attentive, professional business owner who cares about customers.
            </p>
            <p>
              For positive reviews, a response reinforces the relationship and encourages repeat business. For negative reviews, a calm, professional response can actually win back the customer and show potential clients that you handle problems with integrity.
            </p>
            <p>
              Google also rewards businesses that actively engage with their reviews. Regular responses can improve your local search ranking over time — making review management one of the easiest free SEO moves available to local contractors.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
