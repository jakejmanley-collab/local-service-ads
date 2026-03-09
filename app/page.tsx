import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-blue-100 text-blue-700 font-bold px-4 py-1.5 rounded-full text-sm mb-6 shadow-sm">
          Built for Local Service Pros
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Look like a premium business. <br className="hidden md:block" />
          <span className="text-blue-600">Get more jobs.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          Stop overpaying for websites. Answer a few questions and our system builds you a professional webpage on our trades network instantly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/upgrade-offer" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg">
            Get Your Webpage
          </Link>
          <Link href="/preview" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg border border-slate-300 hover:bg-slate-100 transition shadow-sm">
            Try Flyer Tool Free
          </Link>
        </div>
      </section>

      {/* Stats & Icons Section */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 italic">Verified Pro Presence</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Your own professional webpage hosted on our trades network so customers trust you instantly.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 italic">Automatic Writing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Don't waste time typing. Our system automatically writes your professional business description for you.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 italic">Fair, Honest Pricing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">We use smart tech to keep our costs low and pass those savings directly to you. No hidden setup fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Pricing Grid */}
      <section id="pricing" className="py-24 bg-slate-50 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 italic text-slate-900">Fair pricing for the working pro.</h2>
          <p className="text-lg text-slate-600 mb-16 max-w-2xl mx-auto">Upgrade when just one extra job pays for your entire year.</p>

          <div className="grid md:grid-cols-3 gap-8 text-left mb-16">
            {/* Free */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-semibold mb-2 italic">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500 font-medium">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow text-slate-700">
                <li>✓ Make unlimited flyers</li>
                <li>✓ Basic ad text templates</li>
                <li>✓ Community support</li>
              </ul>
              <Link href="/preview" className="w-full py-3 rounded-xl font-bold text-center bg-slate-100 text-slate-900 hover:bg-slate-200 transition">Start Free</Link>
            </div>

            {/* Verified Pro */}
            <div className="bg-white rounded-3xl p-8 ring-2 ring-blue-600 shadow-xl relative md:-translate-y-2 flex flex-col">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-full">Most Popular</span>
              <h3 className="text-2xl font-semibold mb-2 italic">Verified Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">$9</span>
                <span className="text-slate-500 font-medium">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow text-slate-700 font-medium">
                <li>✓ Your own webpage</li>
                <li>✓ We write your bio</li>
                <li>✓ Logo & colors for flyers</li>
                <li>✓ Standard email support</li>
              </ul>
              <Link href="/upgrade-offer" className="w-full py-4 rounded-xl font-bold text-center bg-blue-600 text-white hover:bg-blue-700 shadow-md transition">Get Listed Now</Link>
            </div>

            {/* Pro Plus */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-semibold mb-2 italic">Pro Plus</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">$29</span>
                <span className="text-slate-500 font-medium">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow text-slate-700">
                <li className="font-bold text-blue-600 underline underline-offset-4 decoration-2">✓ Everything in Verified Pro</li>
                <li>✓ Show up in 3 extra cities</li>
                <li>✓ Rank higher on directory</li>
                <li>✓ Priority customer support</li>
              </ul>
              <Link href="/upgrade-offer" className="w-full py-3 rounded-xl font-bold text-center bg-slate-900 text-white hover:bg-slate-800 transition">Get Pro Plus</Link>
            </div>
          </div>

          {/* Bonus Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto shadow-sm">
            <div className="text-left">
              <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded-full text-xs inline-block mb-3 uppercase">Yearly Plan Bonus</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Get our Premium Flyer Tool Free</h3>
              <p className="text-slate-600">Choose a yearly plan to save over 20% and get our Premium Flyer Tool completely free.</p>
            </div>
            <Link href="/upgrade-offer" className="bg-slate-900 text-white font-semibold py-4 px-8 rounded-xl hover:bg-slate-800 transition-colors shadow-md">View Yearly Savings</Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Trusted by Hard-Working Local Pros</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed italic">"I used to get maybe one message a week for my landscaping business. After using these flyer templates and the ad text, I booked three jobs in two days."</p>
              <div className="font-bold text-white">- Mike T., Landscaping</div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed italic">"Now when I reply to marketplace leads, I send them my custom link. It makes me look like a high-end company, not just a side-hustler."</p>
              <div className="font-bold text-white">- Sarah J., Residential Cleaning</div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed italic">"Fast, easy, and it works. They don't overcharge like the big agency guys. My page was built instantly and it looks great."</p>
              <div className="font-bold text-white">- David R., Plumbing Services</div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
