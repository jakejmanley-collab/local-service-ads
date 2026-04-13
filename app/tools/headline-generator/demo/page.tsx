"use client";

import { useState } from "react";

const DEMO_TRADE = "Plumber";
const DEMO_CITY = "Nashville, TN";
const DEMO_SPECIALTY = "emergency drain cleaning";
const DEMO_HEADLINES = [
  "Nashville's #1 Plumber — Same-Day Emergency Drain Cleaning",
  "Licensed Nashville Plumber | Drains Cleared in 60 Min or Less",
  "Blocked Drain? Nashville's Trusted Plumber Is On the Way",
  "24/7 Emergency Drain Cleaning — Nashville's 5-Star Plumber",
  "Fast. Local. Guaranteed. Nashville Plumber for Drain Emergencies",
  "Nashville Plumber Available Now — Drain Cleaning from $89",
];

export default function HeadlineGeneratorDemo() {
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    try {
      navigator.clipboard.writeText(text);
    } catch {
      // clipboard unavailable in some environments — visual feedback still shows
    }
    setCopied(index);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4 border border-amber-400/30 rounded-full px-3 py-1">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Contractor Ad Headline Generator
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10">
            Generate 6 high-converting ad headlines for your trade business in seconds.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-6 py-5">
              <p className="text-3xl font-extrabold text-amber-400 mb-1">3x</p>
              <p className="text-zinc-400 text-sm">More clicks with a benefit-focused headline (WordStream)</p>
            </div>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-6 py-5">
              <p className="text-3xl font-extrabold text-amber-400 mb-1">87%</p>
              <p className="text-zinc-400 text-sm">Of customers read listings before calling (BrightLocal)</p>
            </div>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-6 py-5">
              <p className="text-3xl font-extrabold text-amber-400 mb-1">1B+</p>
              <p className="text-zinc-400 text-sm">Monthly Facebook Marketplace users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tool — pre-filled, results shown */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Your Trade <span className="text-amber-400">*</span>
              </label>
              <div className="w-full bg-zinc-800 border border-amber-400/60 text-white rounded-lg px-4 py-3 text-sm">
                {DEMO_TRADE}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Your City <span className="text-amber-400">*</span>
              </label>
              <div className="w-full bg-zinc-800 border border-amber-400/60 text-white rounded-lg px-4 py-3 text-sm">
                {DEMO_CITY}
              </div>
            </div>
          </div>
          <div className="mb-7">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Specialty or Service{" "}
              <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <div className="w-full bg-zinc-800 border border-amber-400/60 text-white rounded-lg px-4 py-3 text-sm">
              {DEMO_SPECIALTY}
            </div>
          </div>
          <div className="w-full bg-amber-400 text-zinc-900 font-bold text-base py-4 rounded-xl text-center">
            Generate My Headlines →
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Your Headlines</h2>
          </div>
          <ul className="space-y-3">
            {DEMO_HEADLINES.map((h, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 group hover:border-amber-400/40 transition-colors"
              >
                <span className="text-white font-medium text-base pr-4">{h}</span>
                <button
                  onClick={() => handleCopy(h, i)}
                  className="shrink-0 text-xs text-zinc-500 group-hover:text-amber-400 font-semibold transition-colors"
                >
                  {copied === i ? "✓ Copied" : "Copy"}
                </button>
              </li>
            ))}
          </ul>

          {/* Upsell */}
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
      </section>
    </main>
  );
}
