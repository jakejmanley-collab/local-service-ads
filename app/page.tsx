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
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/upgrade-offer" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg text-center">
            Get Your Webpage
          </Link>
          <Link href="/preview" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg border border-slate-300 hover:bg-slate-100 transition shadow-sm text-center">
            Try Flyer Tool Free
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-lg text-green-700 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <span className="font-bold text-slate-700 text-sm">Business flyers increase conversions by 34%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-700 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"></path></svg>
            </div>
            <span className="font-bold text-slate-700 text-sm">Optimized text increases sales by 30%</span>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section id="pricing" className="py-24 bg-slate-50 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-16 italic underline decoration-blue-500 underline-offset-8">Fair pricing for the working pro.</h2>

          <div className="grid md:grid-cols-3 gap-8 text-left mb-16">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-semibold mb-2 italic">Free</h3>
              <div className="text-4xl font-bold mb-4">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <p className="text-slate-600 mb-8 min-h-[3rem]">Perfect for making your first few ad flyers.</p>
              <ul className="space-y-4 mb-10 flex-grow text-slate-700">
                <li>✓ Make unlimited flyers</li>
                <li>✓ Basic ad text templates</li>
              </ul>
            </div>

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
            </div>

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
            </div>
          </div>

          {/* ADDED: Upgraded Flyer Package Standalone Offer */}
          <div className="max-w-3xl mx-auto bg-blue-50 rounded-3xl p-8 border border-blue-100 shadow-sm text-center">
            <h3 className="text-xl font-bold mb-2">Just need one perfect flyer?</h3>
            <p className="text-slate-600 mb-6 font-medium">Get our Upgraded Flyer Package with custom AI-optimized text and premium design elements.</p>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-4">$25 <span className="text-base font-normal text-slate-500">one-time</span></div>
              <Link href="https://buy.stripe.com/aFa28l6uL2WY11G3Tt" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-md">
                Buy Flyer Package
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-slate-900 text-white py-20 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 italic">Trusted by Hard-Working Local Pros</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed italic">"I used to get maybe one message a week for my landscaping business. After using these flyer templates and the ad text, I booked three jobs in two days."</p>
              <div className="font-bold text-white text-sm uppercase tracking-wider">- Mike T., Landscaping</div>
            </div>
            {/* ... other reviews ... */}
          </div>
        </div>
      </section>
    </main>
  );
}
