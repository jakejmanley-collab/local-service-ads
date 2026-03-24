import Link from "next/link";
import { MapPin, DollarSign, SplitSquareHorizontal } from "lucide-react";
import { ReactNode } from "react";

const TOOLS: { href: string; title: string; description: string; icon: string | ReactNode }[] = [
  {
    href: "/tools/headline-generator",
    title: "Ad Headline Generator",
    description: "6 punchy, proven ad headlines for Facebook Marketplace, Kijiji, and local flyers.",
    icon: "✏️",
  },
  {
    href: "/tools/bio-writer",
    title: "Contractor Bio Writer",
    description: "A professional short bio and full bio for Google profiles, Kijiji, and your website.",
    icon: "👤",
  },
  {
    href: "/tools/review-response",
    title: "Review Response Generator",
    description: "Professional responses to Google and Yelp reviews — for 5-star praise and tough complaints.",
    icon: "⭐",
  },
  {
    href: "/tools/estimate-email",
    title: "Estimate Follow-Up Email",
    description: "A follow-up email to send after giving a quote. Close more jobs without being pushy.",
    icon: "📧",
  },
  {
    href: "/tools/gbp-description",
    title: "Google Business Profile Description",
    description: "An optimized 750-character GBP description to attract more customers from map searches.",
    icon: "📍",
  },
  {
    href: "/tools/service-area-writer",
    title: "Service Area Page Writer",
    description: "SEO-optimized content listing all the cities and neighbourhoods you serve.",
    icon: "🗺️",
  },
  {
    href: "/tools/voicemail-script",
    title: "Voicemail Script Generator",
    description: "A professional voicemail greeting that makes a great first impression when you can't pick up.",
    icon: "📞",
  },
  {
    href: "/tools/job-posting",
    title: "Job Posting Writer",
    description: "A help-wanted ad for employees, subcontractors, or apprentices — ready to post anywhere.",
    icon: "🔨",
  },
  {
    href: "/tools/fb-listing-analyzer",
    title: "FB Listing Analyzer",
    description: "Paste any Facebook Marketplace listing and get a score, specific gaps, and an improved version ready to copy.",
    icon: "🔍",
  },
  {
    href: "/tools/service-area-checker",
    title: "Service Area Checker",
    description: "Enter your zip code and drive radius — get a ranked list of cities to target and ready-to-paste Facebook Marketplace service area text.",
    icon: <MapPin className="w-6 h-6 text-amber-400" />,
  },
  {
    href: "/tools/job-pricing-estimator",
    title: "Job Pricing Estimator",
    description: "Enter your trade, zip code, and job details — get a realistic price range for your local market with a ready-to-paste quote for Facebook Marketplace.",
    icon: <DollarSign className="w-6 h-6 text-amber-400" />,
  },
  {
    href: "/tools/before-after-tool",
    title: "Before & After Maker",
    description: "Upload two photos and get a perfectly formatted 1080×1080 before/after image ready for Facebook Marketplace — with your branding baked in.",
    icon: <SplitSquareHorizontal className="w-6 h-6 text-amber-400" />,
  },
  {
    href: "/tools/shadowban-checker",
    title: "Shadowban & Flagged Word Checker",
    description: "Paste your Facebook Marketplace listing and find out which words are getting you suppressed — with safe replacements and a cleaned version ready to copy.",
    icon: "🚫",
  },
  {
    href: "/tools/cross-platform-formatter",
    title: "Cross-Platform Listing Formatter",
    description: "Fill in your details once and get perfectly formatted, ready-to-paste listings for Facebook Marketplace, Craigslist, and Kijiji — each optimized for that platform.",
    icon: "📋",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">
            Free Tools
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Free Tools for Contractors
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Everything you need to market your trade business — headlines, bios,
            emails, and more. Free, fast, and built for local service pros.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-2xl p-6 transition-all hover:bg-zinc-900/80"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-0.5 shrink-0">
                  {tool.icon}
                </span>
                <div>
                  <h2 className="text-white font-bold text-base mb-1 group-hover:text-amber-400 transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
