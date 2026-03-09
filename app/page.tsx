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
        
        {/* Hero Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/upgrade-offer" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg text-center">
            Get Your Webpage
          </Link>
          <Link href="/preview" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg border border-slate-300 hover:bg-slate-100 transition shadow-sm text-center">
            Try Flyer Tool Free
          </Link>
        </div>

        {/* STATS ROW - Corrected Icons */}
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-lg text-green-700 shadow-sm">
              {/* Upward Growth Icon for Conversions */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <span className="font-bold text-slate-700 text-sm">Business flyers increase conversions by 34%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-700 shadow-sm">
              {/* Text/Chat Icon for Optimized Text */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </div>
            <span className="font-bold text-slate-700 text-sm">Optimized text increases sales by 30%</span>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-blue-600 mb-4 flex justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 italic">Verified Pro Presence</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Your own professional webpage hosted on our trades network so customers trust you instantly.</p>
            </div>
            <div className="p-6">
              <div className="text-blue-600 mb-4 flex justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 italic">Automatic Writing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Don't waste time typing. Our system automatically writes your professional business description for you.</p>
            </div>
            <div className="p-6">
              <div className="text-blue-600 mb-4 flex justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 italic">Save More Money</h3>
              <p className="text-slate-600 text-sm leading-relaxed">We use smart tech to keep our costs low and pass those savings directly to you. No hidden setup fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section id="pricing" className="py-24 bg-slate-50 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-16 italic underline decoration-blue-500 underline-offset-8">Fair pricing for the working pro.</h2>

          <div className="grid md:grid-cols-3 gap-8 text-left mb-16">
            {/* Free */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-semibold mb-2 italic">Free</h3>
              <div className="text-4xl font-bold mb-4">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <p className="text-slate-600 mb-8 min-h-[3rem]">Perfect for making your first few ad flyers.</p>
              <ul className="space-y-4 mb-10 flex-grow text-slate-700">
                <li>✓ Make unlimited flyers</li>
                <li>✓ Basic ad text templates</li>
              </ul>
              <Link href="/preview" className="w-full py-3 rounded-xl font-bold text-center bg-slate-100 text-slate-900 hover:bg-slate-200 transition">Start Free</Link>
            </div>

            {/* Verified Pro */}
            <div className="bg-white rounded-3xl p-8 ring-2 ring-blue-600 shadow-xl relative md:-translate-y-2 flex flex-col">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-full">Most Popular</span>
              <h3 className="text-2xl font-semibold mb-2 italic">Verified Pro</h3>
              <div className="text-4xl font-bold mb-4">$9<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <p className="text-slate-600 mb-8 min-h-[3rem]">Your own professional webpage hosted on our trades network.</p>
              <ul className="space-y-4 mb-10 flex-grow text-slate-700 font-medium">
                <li>✓ Your own webpage on the Aretifi network</li>
                <li>✓ We write your business bio</li>
                <li>✓ Logo & colors for flyers</li>
                <li>✓ Standard email support</li>
              </ul>
              <Link href="/upgrade-offer" className="w-full py-4 rounded-xl font-bold text-center bg-blue-600 text-white hover:bg-blue-700 shadow-md transition">Get Listed Now</Link>
            </div>

            {/* Pro Plus */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-semibold mb-2 italic">Pro Plus</h3>
              <div className="text-4xl font-bold mb-4">$29<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <p className="text-slate-600 mb-8 min-h-[3rem]">Get more jobs with priority access and support.</p>
              <ul className="space-y-4 mb-10 flex-grow text-slate-700 font-medium">
                <li className="font-bold text-blue-600">✓ Webpage hosted on unique URL</li>
                <li>✓ 20 page website</li>
                <li>✓ Get found on Google!</li>
                <li>✓ Priority customer support</li>
              </ul>
              <Link href="/upgrade-offer" className="w-full py-3 rounded-xl font-bold text-center bg-slate-900 text-white hover:bg-slate-800 transition">Get Pro Plus</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 italic">Trusted by Hard-Working Local Pros</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-inner text-balance">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed italic text-pretty">"I used to get maybe one message a week for my landscaping business. After using these flyer templates and the ad text, I booked three jobs in two days."</p>
              <div className="font-bold text-white text-sm uppercase tracking-wider">- Mike T., Landscaping</div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-inner text-balance">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed italic text-pretty">"Now when I reply to marketplace leads, I send them my custom link. It makes me look like a high-end company, not just a side-hustler."</p>
              <div className="font-bold text-white text-sm uppercase tracking-wider">- Sarah J., Residential Cleaning</div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-inner text-balance">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed italic text-pretty">"Fast, easy, and it works. They don't overcharge like the big agency guys. My page was built instantly and it looks great."</p>
              <div className="font-bold text-white text-sm uppercase tracking-wider">- David R., Plumbing Services</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
