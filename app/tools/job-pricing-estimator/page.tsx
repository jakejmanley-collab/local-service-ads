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
  "General Contractor",
  "Other",
];

const JOB_SIZES = [
  { value: "small", label: "Small", sub: "Under 2 hrs" },
  { value: "medium", label: "Medium", sub: "Half day" },
  { value: "large", label: "Large", sub: "Full day" },
  { value: "multiday", label: "Multi-day", sub: "2+ days" },
] as const;

const MATERIALS_OPTIONS = [
  { value: "contractor", label: "I'm supplying materials" },
  { value: "customer", label: "Customer supplying" },
  { value: "none", label: "No materials needed" },
] as const;

type JobSize = (typeof JOB_SIZES)[number]["value"];
type MaterialsSupplied = (typeof MATERIALS_OPTIONS)[number]["value"];

interface PricingResult {
  marketContext: string;
  priceRange: { low: number; fair: number; high: number };
  breakdown: {
    laborHours: string;
    laborCost: string;
    materialsCost: string;
    notes: string;
  };
  pricingFactors: Array<{ factor: string; impact: string }>;
  fbQuoteText: string;
  proTip: string;
  city: string;
  state: string;
  multiplier: number;
}

export default function JobPricingEstimatorPage() {
  const [trade, setTrade] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [jobSize, setJobSize] = useState<JobSize | "">("");
  const [materialsSupplied, setMaterialsSupplied] = useState<MaterialsSupplied | "">("");

  const [result, setResult] = useState<PricingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  const canSubmit =
    trade !== "" &&
    jobDescription.trim().length > 0 &&
    zipCode.length === 5 &&
    jobSize !== "" &&
    materialsSupplied !== "";

  const handleEstimate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/job-pricing-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade, jobDescription, zipCode, jobSize, materialsSupplied }),
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

  const handleCopyQuote = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.fbQuoteText);
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
        body: JSON.stringify({ email: leadEmail, tool: "job-pricing-estimator" }),
      });
    } catch {
      // fail silently
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
            Job Pricing Estimator
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Enter your trade, zip code, and job details to get a realistic price
            range for your local market — plus a ready-to-paste quote for
            Facebook Marketplace.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
          {/* Trade + Zip Code */}
          <div className="grid sm:grid-cols-2 gap-5">
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
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Your Zip Code <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 37201"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                maxLength={5}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Currently supports US zip codes only.
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Describe the Job <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe the job (e.g. Replace 40-gallon water heater, customer supplying the unit)"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
            />
          </div>

          {/* Job Size toggles */}
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-3">
              Job Size <span className="text-amber-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {JOB_SIZES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setJobSize(opt.value)}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-sm font-semibold transition-colors ${
                    jobSize === opt.value
                      ? "bg-amber-400 border-amber-400 text-zinc-900"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`text-xs font-normal mt-0.5 ${
                      jobSize === opt.value ? "text-zinc-800" : "text-zinc-500"
                    }`}
                  >
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Materials toggles */}
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-3">
              Materials <span className="text-amber-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {MATERIALS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMaterialsSupplied(opt.value)}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-colors ${
                    materialsSupplied === opt.value
                      ? "bg-amber-400 border-amber-400 text-zinc-900"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleEstimate}
            disabled={!canSubmit || loading}
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
                Estimating your price…
              </span>
            ) : (
              "Estimate My Price →"
            )}
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Market Context Bar */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-400">
              {result.marketContext}
            </div>

            {/* Price Range */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-5">
                Price Range for {result.city}, {result.state}
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                    Low
                  </p>
                  <p className="text-2xl font-bold text-zinc-300">
                    ${result.priceRange.low.toLocaleString()}
                  </p>
                </div>
                <div className="bg-zinc-800 border border-amber-400/40 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
                    Fair Market
                  </p>
                  <p className="text-3xl font-extrabold text-amber-400">
                    ${result.priceRange.fair.toLocaleString()}
                  </p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                    High
                  </p>
                  <p className="text-2xl font-bold text-zinc-300">
                    ${result.priceRange.high.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Cost Breakdown
              </h2>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
                    Labor Hours
                  </p>
                  <p className="text-sm font-semibold text-zinc-200">
                    {result.breakdown.laborHours}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
                    Labor Cost
                  </p>
                  <p className="text-sm font-semibold text-zinc-200">
                    {result.breakdown.laborCost}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
                    Materials
                  </p>
                  <p className="text-sm font-semibold text-zinc-200">
                    {result.breakdown.materialsCost}
                  </p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {result.breakdown.notes}
              </p>
            </div>

            {/* Pricing Factors */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                What Could Change the Price
              </h2>
              <div className="space-y-3">
                {result.pricingFactors.map((item, i) => (
                  <div key={i} className="border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-zinc-200 mb-0.5">
                      {item.factor}
                    </p>
                    <p className="text-sm text-zinc-500">{item.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FB Quote Text */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-1">
                Ready-to-Paste Facebook Quote
              </h2>
              <p className="text-zinc-500 text-xs mb-4">
                Copy and paste this into your Facebook Marketplace listing or when someone asks for a quote.
              </p>
              <p className="text-zinc-200 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                {result.fbQuoteText}
              </p>
              <button
                onClick={handleCopyQuote}
                className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm py-3 rounded-lg transition-colors"
              >
                {copied ? "✓ Copied!" : "Copy Quote Text"}
              </button>
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

            {leadSubmitted && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-center">
                <p className="text-zinc-300 text-sm">
                  Got it — check your inbox soon.
                </p>
              </div>
            )}

            {/* Pro Tip */}
            <div className="border-l-4 border-amber-400 bg-zinc-900 rounded-r-xl px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">
                Pro Tip
              </p>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {result.proTip}
              </p>
            </div>

            {/* Upsell */}
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-6 text-center">
              <p className="text-amber-300 font-semibold mb-2">
                Customers are already searching for your trade in your city.
              </p>
              <p className="text-zinc-400 text-sm mb-5">
                A website puts you in front of them on Google — so you get calls
                without posting every day.
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
    </main>
  );
}
