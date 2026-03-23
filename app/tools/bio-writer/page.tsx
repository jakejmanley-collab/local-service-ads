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

export default function BioWriterPage() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [trade, setTrade] = useState("");
  const [city, setCity] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [licensedInsured, setLicensedInsured] = useState(false);
  const [bios, setBios] = useState<{ shortBio: string; fullBio: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"short" | "full" | null>(null);

  const handleGenerate = async () => {
    if (!name || !trade || !city) return;
    setLoading(true);
    setError("");
    setBios(null);

    try {
      const res = await fetch("/api/tools/bio-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          businessName,
          trade,
          city,
          yearsExperience,
          specialties,
          licensedInsured,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setBios(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: "short" | "full") => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
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
            Contractor Business Bio Writer
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Generate a professional short bio and full bio for your trade business in seconds.
            Perfect for Google profiles, Kijiji, Facebook, and flyers.
          </p>
        </div>
      </section>

      {/* Tool */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Your Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Mike Thompson"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              placeholder="e.g. emergency drain cleaning, kitchen renovations, hot water tanks"
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
            disabled={!name || !trade || !city || loading}
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
                Generating…
              </span>
            ) : (
              "Write My Bio →"
            )}
          </button>

          {error && (
            <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Results */}
        {bios && (
          <div className="mt-8 space-y-5">
            <h2 className="text-xl font-bold text-white">Your Bios</h2>

            {/* Short Bio */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 group hover:border-amber-400/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                  Short Bio
                </span>
                <button
                  onClick={() => handleCopy(bios.shortBio, "short")}
                  className="text-xs text-zinc-500 group-hover:text-amber-400 font-semibold transition-colors"
                >
                  {copied === "short" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <p className="text-white text-sm leading-relaxed">{bios.shortBio}</p>
            </div>

            {/* Full Bio */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 group hover:border-amber-400/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                  Full Bio
                </span>
                <button
                  onClick={() => handleCopy(bios.fullBio, "full")}
                  className="text-xs text-zinc-500 group-hover:text-amber-400 font-semibold transition-colors"
                >
                  {copied === "full" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <p className="text-white text-sm leading-relaxed">{bios.fullBio}</p>
            </div>

            {/* Upsell nudge */}
            <div className="mt-4 bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-5 text-center">
              <p className="text-amber-300 font-semibold mb-1">
                Like your new bio?
              </p>
              <p className="text-zinc-400 text-sm mb-4">
                Add it to a professional flyer or business page in minutes with Aretifi.
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
            Why Every Contractor Needs a Professional Bio
          </h2>
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm leading-relaxed space-y-4">
            <p>
              When homeowners search for a contractor online, they want to know who they're letting
              into their home. A professional bio instantly builds credibility — it tells your story,
              signals experience, and makes you feel like a real business rather than a random ad.
            </p>
            <p>
              A great contractor bio does three things: it introduces you by name, highlights your
              expertise and local roots, and reassures the customer that you're the right person for
              the job. Mentioning that you're licensed and insured is especially powerful — it removes
              one of the biggest hesitations homeowners have.
            </p>
            <p>
              Use your short bio for ad listings, Google Business profiles, and social media bios.
              Use your full bio on your website, flyers, or anywhere customers spend more time reading
              about you before making a call.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
