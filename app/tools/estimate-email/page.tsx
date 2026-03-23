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

export default function EstimateEmailPage() {
  const [trade, setTrade] = useState("");
  const [city, setCity] = useState("");
  const [yourName, setYourName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [estimateAmount, setEstimateAmount] = useState("");
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"subject" | "body" | "all" | null>(null);

  const handleGenerate = async () => {
    if (!trade || !city || !yourName || !jobDescription) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/estimate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade, city, yourName, customerName, jobDescription, estimateAmount }),
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

  const handleCopy = (text: string, key: "subject" | "body" | "all") => {
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
            Estimate Follow-Up Email Generator
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Write a professional follow-up email after giving a quote. Close
            more jobs by following up the right way — without sounding pushy.
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

            {/* Your Name */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Your Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Mike Thompson"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Customer Name{" "}
                <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. John or the Smiths"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Job Description <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. replace hot water tank, fix basement leak, full kitchen repaint"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* Estimate Amount */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Estimate Amount{" "}
              <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. $850 or $800–$1,000"
              value={estimateAmount}
              onChange={(e) => setEstimateAmount(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleGenerate}
            disabled={!trade || !city || !yourName || !jobDescription || loading}
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
              "Write My Follow-Up Email →"
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
              <h2 className="text-xl font-bold text-white">Your Email</h2>
              <button
                onClick={() => handleCopy(`Subject: ${result.subject}\n\n${result.body}`, "all")}
                className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                {copied === "all" ? "✓ Copied all!" : "Copy all"}
              </button>
            </div>

            {/* Subject */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 group hover:border-amber-400/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">Subject Line</span>
                <button
                  onClick={() => handleCopy(result.subject, "subject")}
                  className="text-xs text-zinc-500 group-hover:text-amber-400 font-semibold transition-colors"
                >
                  {copied === "subject" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <p className="text-white text-sm font-medium">{result.subject}</p>
            </div>

            {/* Body */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 group hover:border-amber-400/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">Email Body</span>
                <button
                  onClick={() => handleCopy(result.body, "body")}
                  className="text-xs text-zinc-500 group-hover:text-amber-400 font-semibold transition-colors"
                >
                  {copied === "body" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{result.body}</p>
            </div>

            {/* Upsell nudge */}
            <div className="mt-4 bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-5 text-center">
              <p className="text-amber-300 font-semibold mb-1">
                Want to look more professional when you follow up?
              </p>
              <p className="text-zinc-400 text-sm mb-4">
                Send customers to your own professional business page — built for free with Aretifi.
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
            Why Following Up After an Estimate Wins More Jobs
          </h2>
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm leading-relaxed space-y-4">
            <p>
              Most contractors give an estimate and never follow up. That's a massive missed opportunity. Studies show that a simple, polite follow-up can increase close rates by 20–30% — because many customers are still deciding and just need a gentle nudge.
            </p>
            <p>
              The best follow-up emails are short, personal, and value-focused. They remind the customer of your name and what the job involves, reaffirm your availability, and make it easy to say yes. Avoid being pushy — instead, position the follow-up as helpful customer service.
            </p>
            <p>
              Sending a follow-up email also signals professionalism. It shows you're organized, attentive, and run a real business — all things homeowners weigh when choosing between contractors.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
