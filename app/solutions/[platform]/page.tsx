import Link from 'next/link';
import { notFound } from 'next/navigation';

// Define the content for each specific platform
const platformContent: Record<string, { title: string; headline: string; problem: string; solution: string }> = {
  'thumbtack': {
    title: 'Thumbtack',
    headline: 'Stop wasting money on leads that do not convert.',
    problem: 'When you pay per lead, blending in costs you money. If your profile looks amateur, homeowners will click the next contractor.',
    solution: 'Aretifi transforms your profile with high-end, commercial-grade visual assets that establish instant authority.'
  },
  'taskrabbit': {
    title: 'TaskRabbit',
    headline: 'Stand out in a list of 50 competitors.',
    problem: 'TaskRabbit is a highly visual search engine. A standard selfie or blurry job-site photo makes you look like a hobbyist, not a pro.',
    solution: 'Use Aretifi to generate a branded portfolio image that commands attention and justifies higher hourly rates.'
  },
  'facebook-marketplace': {
    title: 'Facebook Marketplace',
    headline: 'Get your post noticed in a crowded feed.',
    problem: 'Marketplace is flooded with generic text posts and bad photos. Users scroll right past services that lack visual impact.',
    solution: 'Aretifi creates high-contrast, professional flyers designed specifically to stop the scroll on social media feeds.'
  },
  'kijiji': {
    title: 'Kijiji',
    headline: 'Stop competing on price alone.',
    problem: 'Kijiji is flooded with low-bid handymen. If your ad looks like everyone else\'s, the only way to win the job is to lower your price.',
    solution: 'Aretifi gives you premium visual assets that justify higher rates and attract serious clients who value quality over the lowest bid.'
  },
  'nextdoor': {
    title: 'Nextdoor',
    headline: 'Become the most trusted pro in the neighborhood.',
    problem: 'Nextdoor runs on neighbor recommendations. A plain text post gets lost quickly, and amateur photos don\'t inspire trust for in-home services.',
    solution: 'Generate high-trust, commercial-grade flyers that look like an established local business neighbors want to recommend.'
  },
  'booksy': {
    title: 'Booksy',
    headline: 'Fill your calendar with premium clients.',
    problem: 'Your portfolio is competing with dozens of other pros in your area. Basic photos don\'t convince clients to book high-ticket services.',
    solution: 'Upgrade your Booksy profile with polished, high-end promotional graphics that make your services look irresistible and fully booked.'
  }
};

export default function SolutionPage({ params }: { params: { platform: string } }) {
  // Look up the platform data based on the URL (e.g., /solutions/thumbtack)
  const content = platformContent[params.platform.toLowerCase()];

  // If someone types a URL that doesn't exist, show a 404
  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 pt-24 pb-32 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-blue-500 font-bold tracking-widest uppercase mb-4 text-sm">
            Aretifi for {content.title}
          </h2>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-8 leading-tight">
            {content.headline}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            {content.problem}
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/create" 
              className="bg-blue-600 text-white px-8 py-4 rounded-md font-black uppercase tracking-tight hover:bg-blue-700 transition-colors"
            >
              Fix Your Profile Now
            </Link>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-12 shadow-sm text-center">
          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mb-6">
            The Commercial Advantage
          </h3>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            {content.solution}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-12">
            <div className="border-t-4 border-slate-900 pt-4">
              <h4 className="font-bold text-slate-900 mb-2">1. Instant Trust</h4>
              <p className="text-sm text-slate-600">Look like an established company, not a side-hustle.</p>
            </div>
            <div className="border-t-4 border-slate-900 pt-4">
              <h4 className="font-bold text-slate-900 mb-2">2. Higher Conversion</h4>
              <p className="text-sm text-slate-600">Clear, legible contact info on mobile screens.</p>
            </div>
            <div className="border-t-4 border-slate-900 pt-4">
              <h4 className="font-bold text-slate-900 mb-2">3. Zero Design Time</h4>
              <p className="text-sm text-slate-600">Generated in seconds. No Photoshop required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// This function tells Next.js to pre-build these specific URLs as static HTML pages
export async function generateStaticParams() {
  return [
    { platform: 'thumbtack' },
    { platform: 'taskrabbit' },
    { platform: 'facebook-marketplace' },
    { platform: 'kijiji' },
    { platform: 'nextdoor' },
    { platform: 'booksy' },
  ];
}
