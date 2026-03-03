import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          Turn Free Marketplace Listings <br className="hidden md:block" /> Into High-Paying Clients
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Generate commercial-grade flyers and high-converting ad copy for your local service business in seconds. Stop blending in and start booking more jobs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/preview" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition">
            Generate Free Flyers
          </Link>
          <Link href="#pricing" className="bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-lg border border-slate-300 hover:bg-slate-100 transition">
            View Upgrade Plans
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            
            {/* Stat 1: Trending Up Arrow */}
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <div className="text-4xl font-extrabold">34%</div>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">More Clicks</h3>
              <p className="text-slate-600 text-sm">Listings with multiple professional images get far more attention than standard single-photo posts from your competitors.</p>
            </div>
            
            {/* Stat 2: Plus Sign */}
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4"></path>
                </svg>
                <div className="text-4xl font-extrabold">30%</div>
              </div>
              <h3 className="text-lg font-bold mb-2">More Messages</h3>
              <p className="text-slate-600 text-sm">Clear, professional ad text stops people from scrolling past and makes them contact you to book a job.</p>
            </div>
            
            {/* Stat 3: Checkmark Circle */}
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <div className="text-4xl font-extrabold">9.96%</div>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Pro-Level Quality</h3>
              <p className="text-slate-600 text-sm">We format your free marketplace posts to look and perform like expensive, professional advertising campaigns.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Upgrade Your Online Presence</h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Free Package */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Flyer Generator<h3>
              <div className="text-3xl font-extrabold mb-6">$0<span className="text-lg text-slate-500 font-normal"> forever</span></div>
              <ul className="space-y-3 mb-8 flex-1 text-slate-600">
                <li className="flex gap-2">✓ <span>Standard professional flyers</span></li>
                <li className="flex gap-2">✓ <span>High-converting ad text</span></li>
                <li className="flex gap-2">✓ <span>Unlimited downloads</span></li>
                <li className="flex gap-2">✓ <span>No watermarks</span></li>
              </ul>
              <Link href="/preview" className="w-full bg-slate-100 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-200 text-center block">Create Free Flyers</Link>
            </div>

            {/* Network Package */}
            <div className="bg-blue-600 p-8 rounded-xl shadow-md border border-blue-700 flex flex-col text-white transform md:-translate-y-4">
              <div className="text-sm font-bold uppercase tracking-wider mb-2 text-blue-200">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Verified Pro Page</h3>
              <div className="text-3xl font-extrabold mb-6">$15<span className="text-lg text-blue-200 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1 text-blue-50">
                <li className="flex gap-2">✓ <span>Everything in Free</span></li>
                <li className="flex gap-2">✓ <span>Hosted single-page website</span></li>
                <li className="flex gap-2">✓ <span>Lead capture contact form</span></li>
                <li className="flex gap-2">✓ <span>Mobile optimized design</span></li>
              </ul>
              <Link href="/checkout?plan=network" className="w-full text-center bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-slate-100">Select Network</Link>
            </div>

            {/* Professional Package */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Pro Plus</h3>
              <div className="text-3xl font-extrabold mb-6">$49<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1 text-slate-600">
                <li className="flex gap-2">✓ <span>Everything in Network tier</span></li>
                <li className="flex gap-2">✓ <span>Unique standalone website</span></li>
                <li className="flex gap-2">✓ <span>20 locally optimized pages</span></li>
                <li className="flex gap-2">✓ <span>Designed to rank on Google</span></li>
              </ul>
              <Link href="/checkout?plan=seo" className="w-full text-center bg-slate-100 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-200">Select SEO</Link>
            </div>

          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Local Contractors Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg">
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="text-slate-300 mb-4">"I used to get maybe one message a week for my landscaping business. After using these flyer templates and the exact ad text they gave me, I booked three jobs in two days."</p>
              <div className="font-bold">- Mike T., Landscaping</div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="text-slate-300 mb-4">"The 1-page website upgrade changed everything. Now when I reply to Kijiji leads, I send them my site link. It makes me look like a established company, not just someone who is starting out."</p>
              <div className="font-bold">- Sarah J., Residential Cleaning</div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="text-slate-300 mb-4">"Fast, easy, and it works. I enter my services and it spits out a professional ad and flyer. Best ROI for my plumbing business this year."</p>
              <div className="font-bold">- David R., Plumbing Services</div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
