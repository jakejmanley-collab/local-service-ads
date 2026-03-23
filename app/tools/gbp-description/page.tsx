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

const MAX_CHARS = 750;

export default function GbpDescriptionPage() {
  const [trade, setTrade] = useState("");
  const [city, setCity] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [licensedInsured, setLicensedInsured] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!trade || !city) return;
    setLoading(true);
    setError("");
    setDescription("");

    try {
      const res = await fetch("/api/tools/gbp-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade, city, businessName, yearsExperience, specialties, licensedInsured }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setDescription(data.description);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const charCount = description.length;
  const charColor = charCount > MAX_CHARS ? "text-red-400" : charCount > 650 ? "text-amber-400" : "text-zinc-500";

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Google Business Profile Description Generator
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Write an optimized Google Business Profile description under 750
            characters. Attract more local customers and rank higher in map
            searches.
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

            {/* Business Name */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Business Name{" "}
                <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Thompson Plumbing & Drain"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            {/* Years Experience */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Years of Experience{" "}
                <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                min="1"
                max="60"
                placeholder="e.g. 12"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Specialties{" "}
              <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. emergency drain cleaning, hot water tanks, basement waterproofing"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* Licensed & Insured */}
          <div className="mb-7">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <input
                type="checkbox"
                checked={licensedInsured}
                onChange={(e) => setLicensedInsured(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 accent-amber-400 cursor-pointer"
              />
              <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                Licensed &amp; Insured
              </span>
            </label>
          </div>

          {/* CTA */}
          <button
            onClick={handleGenerate}
            disabled={!trade || !city || loading}
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
              "Generate My GBP Description →"
            )}
          </button>

          {error && (
            <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Result */}
        {description && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Your Description</h2>
              <button
                onClick={handleCopy}
                className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-5 group hover:border-amber-400/40 transition-colors">
              <p className="text-white text-sm leading-relaxed">{description}</p>
              <p className={`mt-3 text-xs font-medium text-right ${charColor}`}>
                {charCount} / {MAX_CHARS} characters
              </p>
            </div>

            {/* Upsell nudge */}
            <div className="mt-6 bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-5 text-center">
              <p className="text-amber-300 font-semibold mb-1">
                Want a full business page to go with it?
              </p>
              <p className="text-zinc-400 text-sm mb-4">
                Aretifi lets you build a professional contractor page in minutes — free to start.
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
            How to Write a Great Google Business Profile Description
          </h2>
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm leading-relaxed space-y-4">
            <p>
              Your Google Business Profile description is one of the first things potential customers read. Google gives you 750 characters — and how you use them can be the difference between a click and a scroll-past.
            </p>
            <p>
              A strong GBP description naturally includes your trade, city, and key services. This helps Google understand exactly what you do and where, which improves your chances of showing up when someone searches "plumber near me" or "electrician in [your city]."
            </p>
            <p>
              Avoid keyword stuffing — Google penalizes it, and it looks unprofessional to potential customers. Instead, write naturally while weaving in your most important services and location. Mention that you're licensed and insured if applicable, as this builds immediate trust with homeowners.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
