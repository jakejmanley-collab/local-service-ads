import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 italic uppercase">
          Get More Jobs From <br className="hidden md:block" /> Your Facebook Ads
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
          Create professional looking ad photos and winning listing descriptions in seconds. Stop blending in and start getting more messages.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/preview" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg">
            Create My First Ad
          </Link>
          <Link href="#pricing" className="bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-lg border border-slate-300 hover:bg-slate-100 transition">
            See Professional Options
          </Link>
        </div>
      </section>

      {/* Proof Section */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <div className="text-4xl font-extrabold">34%</div>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">More Clicks</h3>
              <p className="text-slate-600 text-sm">Photos that look professional get way more attention than a blurry cell phone picture.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4"></path>
                </svg>
                <div className="text-4xl font-extrabold">30%</div>
              </div>
              <h3 className="text-lg font-bold mb-2">More Messages</h3>
              <p className="text-slate-600 text-sm">Using the right words in your description makes people trust you and message you faster.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <div className="text-4xl font-extrabold">100%</div>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Professional Look</h3>
              <p className="text-slate-600 text-sm">We make your small business look like a big company, so you can charge what you're worth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Level Up Your Business</h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Tier 1: Flyer Generator */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <h3 className="text-2xl font-bold mb-2 text-slate-900">Flyer Generator</h3>
              <div className="text-3xl font-extrabold mb-6 text-slate-900">$0<span className="text-lg text-slate-500 font-normal"> / free</span></div>
              <ul className="space-y-3 mb-8 flex-1 text-slate-600 font-medium">
                <li className="flex gap-2">✓ <span>Professional ad photos</span></li>
                <li className="flex gap-2">✓ <span>Winning ad descriptions</span></li>
                <li className="flex gap-2">✓ <span>Save and use instantly</span></li>
                <li className="flex gap-2">✓ <span>No hidden fees</span></li>
              </ul>
              <Link href="/preview" className="w-full bg-slate-100 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-200 text-center block transition">Start Free Account</Link>
            </div>

            {/* Tier 2: Verified Pro */}
            <div className="bg-blue-600 p-8 rounded-xl shadow-md border border-blue-700 flex flex-col text-white transform md:-translate-y-4">
              <div className="text-sm font-bold uppercase tracking-wider mb-2 text-blue-200">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Verified Pro</h3>
              <div className="text-3xl font-extrabold mb-6">$15<span className="text-lg text-blue-200 font-normal"> / mo</span></div>
              <ul className="space-y-3 mb-8 flex-1 text-blue-50 font-medium">
                <li className="flex gap-2">✓ <span>Everything in Free</span></li>
                <li className="flex gap-2">✓ <span>Your own professional web page</span></li>
                <li className="flex gap-2">✓ <span>Customers can message you directly</span></li>
                <li className="flex gap-2">✓ <span>"Verified" status on our site</span></li>
              </ul>
              <Link href="/checkout?plan=network" className="w-full text-center bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-slate-100 transition shadow-lg">Get This Plan</Link>
            </div>

            {/* Tier 3: Pro Plus */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <h3 className="text-2xl font-bold mb-2 text-slate-900">Pro Plus</h3>
              <div className="text-3xl font-extrabold mb-6 text-slate-900">$49<span className="text-lg text-slate-500 font-normal"> / mo</span></div>
              <ul className="space-y-3 mb-8 flex-1 text-slate-600 font-medium">
                <li className="flex gap-2">✓ <span>Everything in Verified Pro</span></li>
                <li className="flex gap-2">✓ <span>Your own website address (.com)</span></li>
                <li className="flex gap-2">✓ <span>20 pages built to rank locally</span></li>
                <li className="flex gap-2">✓ <span>Built to get found on Google</span></li>
              </ul>
              <Link href="/checkout?plan=seo" className="w-full text-center bg-slate-100 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-200 transition">Get This Plan</Link>
            </div>

          </div>
        </div>
      </section>

      {/* Reviews Section Restored */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Local Pros Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-700">
              <div className="text-yellow-400 mb-4 text-lg">★★★★★</div>
              <p className="text-slate-300 mb-4 font-medium">"I used to get maybe one message a week for my landscaping business. After using these flyer templates and the exact ad text they gave me, I booked three jobs in two days."</p>
              <div className="font-bold text-white">- Mike T., Landscaping</div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-700">
              <div className="text-yellow-400 mb-4 text-lg">★★★★★</div>
              <p className="text-slate-300 mb-4 font-medium">"The website upgrade changed everything. Now when I reply to marketplace leads, I send them my site link. It makes me look like an established company, not just someone starting out."</p>
              <div className="font-bold text-white">- Sarah J., Residential Cleaning</div>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-700">
              <div className="text-yellow-400 mb-4 text-lg">★★★★★</div>
              <p className="text-slate-300 mb-4 font-medium">"Fast, easy, and it works. I enter my services and it spits out a professional ad and flyer. Best ROI for my plumbing business this year."</p>
              <div className="font-bold text-white">- David R., Plumbing Services</div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
