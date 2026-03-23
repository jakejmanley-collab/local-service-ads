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

const POSITION_TYPES = [
  { value: "employee", label: "Employee (full-time / part-time)" },
  { value: "subcontractor", label: "Subcontractor / Independent" },
  { value: "apprentice", label: "Apprentice / Helper" },
];

export default function JobPostingPage() {
  const [trade, setTrade] = useState("");
  const [city, setCity] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [positionType, setPositionType] = useState("employee");
  const [experience, setExperience] = useState("");
  const [payRange, setPayRange] = useState("");
  const [perks, setPerks] = useState("");
  const [result, setResult] = useState<{ title: string; posting: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"title" | "posting" | "all" | null>(null);

  const handleGenerate = async () => {
    if (!trade || !city) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/job-posting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade, city, businessName, positionType, experience, payRange, perks }),
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

  const handleCopy = (text: string, key: "title" | "posting" | "all") => {
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
            Contractor Job Posting Writer
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Generate a professional help-wanted ad for your trade business in
            seconds. Post it on Indeed, Facebook, Kijiji, or anywhere you
            recruit.
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

            {/* Position Type */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Position Type <span className="text-amber-400">*</span>
              </label>
              <select
                value={positionType}
                onChange={(e) => setPositionType(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              >
                {POSITION_TYPES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
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

            {/* Experience Required */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Experience Required{" "}
                <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 2+ years, journeyman license, any level"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            {/* Pay Range */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Pay Range{" "}
                <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. $28–$35/hr, $70k–$90k/year"
                value={payRange}
                onChange={(e) => setPayRange(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Perks */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Perks / Benefits{" "}
              <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. company truck, tool allowance, flexible hours, paid holidays"
              value={perks}
              onChange={(e) => setPerks(e.target.value)}
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
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Generating…
              </span>
            ) : (
              "Write My Job Posting →"
            )}
          </button>

          {error && (
            <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Your Job Posting</h2>
              <button
                onClick={() => handleCopy(`${result.title}\n\n${result.posting}`, "all")}
                className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                {copied === "all" ? "✓ Copied all!" : "Copy all"}
              </button>
            </div>

            {/* Title */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 group hover:border-amber-400/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">Job Title</span>
                <button
                  onClick={() => handleCopy(result.title, "title")}
                  className="text-xs text-zinc-500 group-hover:text-amber-400 font-semibold transition-colors"
                >
                  {copied === "title" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <p className="text-white text-sm font-medium">{result.title}</p>
            </div>

            {/* Posting Body */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 group hover:border-amber-400/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">Posting</span>
                <button
                  onClick={() => handleCopy(result.posting, "posting")}
                  className="text-xs text-zinc-500 group-hover:text-amber-400 font-semibold transition-colors"
                >
                  {copied === "posting" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{result.posting}</p>
            </div>

            {/* Upsell nudge */}
            <div className="mt-4 bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-5 text-center">
              <p className="text-amber-300 font-semibold mb-1">
                Growing your team? Grow your brand too.
              </p>
              <p className="text-zinc-400 text-sm mb-4">
                A professional business presence helps attract better applicants. Build yours free with Aretifi.
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
            How to Write a Job Posting That Attracts Reliable Tradespeople
          </h2>
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm leading-relaxed space-y-4">
            <p>
              Finding good help is one of the hardest parts of running a trades business. A well-written job posting filters out bad fits and attracts serious candidates — but most contractor job ads are too vague or too intimidating to get quality responses.
            </p>
            <p>
              The best trade job postings are specific about the work, honest about expectations, and clear about what makes your company worth working for. Mentioning pay range, even as a ballpark, dramatically increases the number of applications. Listing perks like a company vehicle or flexible scheduling helps you stand out from other postings.
            </p>
            <p>
              Post your job ad on Indeed, Facebook Jobs, Kijiji, and any local trade forums or community boards. The more places it appears, the faster you&apos;ll find the right hire.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
