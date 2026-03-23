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

export default function VoicemailScriptPage() {
  const [trade, setTrade] = useState("");
  const [city, setCity] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [callbackHours, setCallbackHours] = useState("");
  const [offersEmergency, setOffersEmergency] = useState(false);
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!trade || !city) return;
    setLoading(true);
    setError("");
    setScript("");

    try {
      const res = await fetch("/api/tools/voicemail-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade, city, businessName, callbackHours, offersEmergency }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setScript(data.script);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
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
            Contractor Voicemail Script Generator
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Get a professional voicemail greeting written for your trade
            business in seconds. Make a great first impression — even when
            you can&apos;t pick up.
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

            {/* Callback Hours */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Callback Hours{" "}
                <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Mon–Fri 8am–6pm, within 2 hours"
                value={callbackHours}
                onChange={(e) => setCallbackHours(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Emergency checkbox */}
          <div className="mb-7">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <input
                type="checkbox"
                checked={offersEmergency}
                onChange={(e) => setOffersEmergency(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 accent-amber-400 cursor-pointer"
              />
              <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                I offer emergency / after-hours service
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
              "Write My Voicemail Script →"
            )}
          </button>

          {error && (
            <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Result */}
        {script && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Your Voicemail Script</h2>
              <button
                onClick={handleCopy}
                className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-5 group hover:border-amber-400/40 transition-colors">
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{script}</p>
            </div>
            <p className="mt-3 text-xs text-zinc-500 text-center">
              Read this aloud slowly and clearly when recording. Aim for a calm, confident tone.
            </p>

            {/* Upsell nudge */}
            <div className="mt-6 bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-5 text-center">
              <p className="text-amber-300 font-semibold mb-1">
                Make it easy for customers to find you online too.
              </p>
              <p className="text-zinc-400 text-sm mb-4">
                Build a free professional business page on Aretifi — takes less than 5 minutes.
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
            Why Your Voicemail Greeting Is Part of Your Brand
          </h2>
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm leading-relaxed space-y-4">
            <p>
              As a contractor, you miss calls constantly — you&apos;re on the job, driving, or with customers. That&apos;s unavoidable. What&apos;s not unavoidable is what those callers hear when they reach your voicemail.
            </p>
            <p>
              A generic "leave a message" greeting signals amateur. A professional greeting that states your business name, trade, and city tells the caller they reached the right person and sets a professional tone before you ever speak to them. It also helps callers feel confident leaving a message rather than hanging up and calling the next contractor.
            </p>
            <p>
              Keep your voicemail under 20 seconds. State your name, business, and city. Give them one clear action — leave a message or text — and tell them when to expect a callback. That&apos;s it. Simple, confident, professional.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
