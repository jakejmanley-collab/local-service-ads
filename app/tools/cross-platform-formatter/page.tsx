"use client";

import { useState } from "react";

const TRADES = [
  "Plumber",
  "Electrician",
  "HVAC",
  "Landscaper",
  "Cleaner",
  "Painter",
  "Handyman",
  "Roofer",
  "Carpenter",
  "Other",
];

const CONTACT_PREFERENCES = [
  "Message only",
  "Phone + message",
  "Email + message",
];

type Platform = "facebook" | "craigslist" | "kijiji";

const PLATFORM_META: Record<
  Platform,
  { label: string; icon: string; color: string; borderColor: string }
> = {
  facebook: {
    label: "Facebook Marketplace",
    icon: "📘",
    color: "text-blue-400",
    borderColor: "border-blue-500/40",
  },
  craigslist: {
    label: "Craigslist",
    icon: "📋",
    color: "text-purple-400",
    borderColor: "border-purple-500/40",
  },
  kijiji: {
    label: "Kijiji",
    icon: "🍁",
    color: "text-green-400",
    borderColor: "border-green-500/40",
  },
};

export default function CrossPlatformFormatterPage() {
  const [trade, setTrade] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [specialOffer, setSpecialOffer] = useState("");
  const [contactPreference, setContactPreference] = useState("Message only");
  const [phone, setPhone] = useState("");

  const [listings, setListings] = useState<{
    facebook: string;
    craigslist: string;
    kijiji: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<Platform | null>(null);
  const [activeTab, setActiveTab] = useState<Platform>("facebook");

  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  const showPhone = contactPreference !== "Message only";

  const canSubmit =
    trade && serviceDescription.trim() && price.trim() && location.trim();

  const handleFormat = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setListings(null);

    try {
      const res = await fetch("/api/tools/cross-platform-formatter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trade,
          serviceDescription,
          price,
          location,
          specialOffer,
          contactPreference,
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setListings(data);
      setActiveTab("facebook");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (platform: Platform) => {
    if (!listings) return;
    navigator.clipboard.writeText(listings[platform]);
    setCopied(platform);
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
        body: JSON.stringify({
          email: leadEmail,
          tool: "cross-platform-formatter",
        }),
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
            Cross-Platform Listing Formatter
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Fill in your details once. Get perfectly formatted, ready-to-paste
            listings for Facebook Marketplace, Craigslist, and Kijiji —
            each one optimized for that platform.
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
                Trade / Service Type <span className="text-amber-400">*</span>
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

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Price <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                placeholder='e.g. "Free estimate", "$150 flat rate", "$75/hr"'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Service Description */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Service Description <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="What does the job cover? What's included? What makes you different?"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
            />
          </div>

          {/* Location */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Location / Service Area <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              placeholder='e.g. "Nashville, TN and surrounding areas"'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* Special Offer */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Special Offer or Guarantee{" "}
              <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder='e.g. "10% off first-time customers", "Satisfaction guaranteed"'
              value={specialOffer}
              onChange={(e) => setSpecialOffer(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-7">
            {/* Contact Preference */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Contact Preference
              </label>
              <select
                value={contactPreference}
                onChange={(e) => setContactPreference(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              >
                {CONTACT_PREFERENCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone — conditional */}
            {showPhone && (
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Phone Number{" "}
                  <span className="text-zinc-500 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. (615) 555-0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={handleFormat}
            disabled={!canSubmit || loading}
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
                Formatting your listings…
              </span>
            ) : (
              "Format My Listing →"
            )}
          </button>

          {error && (
            <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Results */}
        {listings && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-5">
              Your Formatted Listings
            </h2>

            {/* Platform Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {(["facebook", "craigslist", "kijiji"] as Platform[]).map(
                (platform) => {
                  const meta = PLATFORM_META[platform];
                  const isActive = activeTab === platform;
                  return (
                    <button
                      key={platform}
                      onClick={() => setActiveTab(platform)}
                      className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-amber-400 text-zinc-900"
                          : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                      }`}
                    >
                      <span>{meta.icon}</span>
                      {meta.label}
                    </button>
                  );
                }
              )}
            </div>

            {/* Active Platform Card */}
            {(["facebook", "craigslist", "kijiji"] as Platform[]).map(
              (platform) => {
                if (platform !== activeTab) return null;
                const meta = PLATFORM_META[platform];
                return (
                  <div
                    key={platform}
                    className={`bg-zinc-900 border ${meta.borderColor} rounded-2xl p-6`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{meta.icon}</span>
                        <span
                          className={`font-bold text-base ${meta.color}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(platform)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-amber-400 transition-colors"
                      >
                        {copied === platform ? (
                          <>
                            <svg
                              className="w-4 h-4 text-green-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                              />
                              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                            </svg>
                            Copy listing
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {listings[platform]}
                    </pre>
                  </div>
                );
              }
            )}

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
                <p className="text-zinc-300 text-sm">
                  Got it — check your inbox soon.
                </p>
              </div>
            )}

            {/* Upsell nudge */}
            <div className="mt-6 bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-5 text-center">
              <p className="text-amber-300 font-semibold mb-1">
                Tired of posting on Marketplace every week?
              </p>
              <p className="text-zinc-400 text-sm mb-4">
                Get a website that brings customers to you — no more manual
                posting.
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
            Why Platform Formatting Matters
          </h2>
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm leading-relaxed space-y-4">
            <p>
              Facebook Marketplace, Craigslist, and Kijiji each have their own
              audience, layout, and algorithm quirks. A listing that performs
              great on one platform can fall flat — or get suppressed — on
              another. Phone numbers get you shadowbanned on Facebook. Plain
              text without structure gets ignored on Craigslist. Missing the
              casual tone on Kijiji makes you sound like a robot.
            </p>
            <p>
              This tool formats your listing correctly for each platform in one
              shot: emoji bullets for Facebook (because plain bullets don't
              render), ALL CAPS section headers for Craigslist, and a
              conversational tone for Kijiji. Fill in your details once and get
              three listings ready to paste.
            </p>
            <p>
              Whether you're a plumber, electrician, handyman, or landscaper,
              showing up right on every platform means more leads without more
              work. Paste and go.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
