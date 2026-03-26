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

const FAQ_ITEMS = [
  {
    q: "What makes a good contractor ad headline?",
    a: "A strong headline does three things: identifies who you are (your trade), signals trust (licensed, insured, 5-star), and creates a reason to act (same-day, free quote, local). Weak headlines like \"Plumber available\" get ignored — specific ones like \"Licensed Nashville Plumber — Same-Day Drain Cleaning\" get clicks.",
  },
  {
    q: "How many headlines should I test?",
    a: "Start with 2-3. Run each one for at least a week on your listings and track which gets more messages. According to AdEspresso, A/B testing ad headlines can improve click-through rates by up to 49%.",
  },
  {
    q: "Can I use these headlines on Google Ads?",
    a: "Yes. Google Local Service Ads and Google Search Ads both use headlines as the primary text. These headlines are designed to work across platforms — just make sure your headline matches what your landing page or listing promises.",
  },
  {
    q: "Should I include my city name in the headline?",
    a: "Yes, always. BrightLocal research shows that 78% of local mobile searches result in an offline purchase — and including your city makes your listing feel immediately relevant to the searcher.",
  },
  {
    q: "How often should I change my headlines?",
    a: "Refresh your headlines every 4-6 weeks or when you notice your response rate dropping. Seasonal updates also help — a roofing company in winter should lead with ice dam removal, not general repairs.",
  },
  {
    q: "Are these headlines unique to my business?",
    a: "Each set is generated specifically for your trade, city, and specialty. Two different plumbers in different cities will get different headlines. That said, we recommend tweaking them slightly to add your business name or a specific offer.",
  },
  {
    q: "What trades does this tool support?",
    a: "The tool supports 20 trades including plumbers, electricians, HVAC technicians, roofers, landscapers, painters, handymen, and more. If your trade isn't listed, select the closest match and add your specialty in the optional field.",
  },
  {
    q: "Is this tool really free?",
    a: "Yes, completely free. No account required, no credit card, no limits. We build free tools for tradespeople because we believe every contractor deserves professional marketing — whether or not they can afford an agency.",
  },
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

      {/* ── 1. HERO ── */}
      <section className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4 border border-amber-400/30 rounded-full px-3 py-1">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Contractor Ad Headline Generator
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10">
            Generate 6 high-converting ad headlines for your trade business in seconds — built for Facebook Marketplace, Kijiji, Google Ads, and local flyers.
          </p>

          {/* Stat block */}
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

      {/* ── 2. THE TOOL ── */}
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
              <h2 className="text-xl font-bold text-white">Your Headlines</h2>
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

      {/* ── 3. WHY YOUR HEADLINE MATTERS ── */}
      <section className="bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Why Your Ad Headline Is Your Most Important Line of Text
          </h2>
          <div className="space-y-5 text-zinc-400 text-base leading-relaxed">
            <p>
              Homeowners scroll fast — and weak headlines get ignored. According to Facebook&apos;s own data, users spend an average of 1.7 seconds looking at each piece of content in their feed. That means your headline has less than two seconds to stop the scroll, communicate your value, and earn the click.
            </p>
            <p>
              A strong contractor headline does four things: it states who you are, signals trust through credibility markers (licensed, insured, 5-star rated), creates urgency or a reason to act now (same-day, free quote, available this week), and includes your location for local SEO relevance. Skip any one of these and you&apos;re leaving clicks on the table.
            </p>
            <p>
              These headlines aren&apos;t just for Facebook Marketplace. Use them across Kijiji, Craigslist, Google Local Service Ads, print flyers, door hangers, and even as the hero text on your website. A great headline is the single highest-leverage piece of marketing copy you can write — and it works everywhere you need to be found.
            </p>
          </div>

          {/* Callout box */}
          <div className="mt-8 border border-amber-400/40 bg-amber-400/5 rounded-xl px-6 py-5">
            <p className="text-amber-300 font-semibold text-sm leading-relaxed">
              WordStream data shows that ads with a location in the headline have a 200% higher click-through rate for local service searches.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-7">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-zinc-900 font-extrabold text-lg flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="text-white font-bold text-base mb-2">Enter Your Trade &amp; City</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Select your trade from the dropdown and enter your city. The more specific the better.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-7">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-zinc-900 font-extrabold text-lg flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="text-white font-bold text-base mb-2">Add Your Specialty <span className="text-zinc-500 font-normal">(optional)</span></h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Tell us what makes you different — emergency service, same-day, licensed &amp; insured, etc.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-7">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-zinc-900 font-extrabold text-lg flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="text-white font-bold text-base mb-2">Copy &amp; Deploy</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Get 6 ready-to-use headlines. Copy any one and paste it directly into your listing, ad, or flyer.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. WHERE TO USE YOUR HEADLINES ── */}
      <section className="bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 text-center">
            Where to Use Your Headlines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 19h6" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">Facebook Marketplace Listings</h3>
                <p className="text-zinc-400 text-sm">Grab attention in a crowded feed of competing contractors.</p>
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">Kijiji / Craigslist Ads</h3>
                <p className="text-zinc-400 text-sm">Stand out in classified listings where titles are everything.</p>
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">Google Local Service Ads</h3>
                <p className="text-zinc-400 text-sm">Optimized for local intent — showing up when someone searches your trade in your city.</p>
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">Print Flyers &amp; Door Hangers</h3>
                <p className="text-zinc-400 text-sm">Your headline is the hook that makes someone pick up the flyer instead of tossing it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-white font-semibold text-sm pr-4">{item.q}</span>
                <span className="shrink-0 text-amber-400 text-lg leading-none">
                  {openFaq === i ? "−" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5">
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. BOTTOM CTA ── */}
      <section className="bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Ready for customers to find YOU instead?
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
            A professional contractor website works for you 24/7 — no posting, no chasing leads. See what your business could look like.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/upgrade-offer"
              className="inline-block bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold px-8 py-4 rounded-xl text-base transition-colors"
            >
              See Pricing &amp; Plans →
            </a>
            <a
              href="/showcase"
              className="inline-block text-zinc-400 hover:text-zinc-200 font-medium text-sm transition-colors"
            >
              See a live example first
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
