import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* ... Hero and Stats sections remain the same ... */}

      {/* Pricing Grid */}
      <section id="pricing" className="py-24 bg-slate-50 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-16 italic underline decoration-blue-500 underline-offset-8 text-balance">
            Fair pricing for the working pro.
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-left mb-12">
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
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-full w-max">Most Popular</span>
              <h3 className="text-2xl font-semibold mb-2 italic text-pretty">Verified Pro</h3>
              <div className="text-4xl font-bold mb-4">$9<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <p className="text-slate-600 mb-8 min-h-[3rem]">Your own professional webpage hosted on our trades network.</p>
              <ul className="space-y-4 mb-10 flex-grow text-slate-700 font-medium text-pretty">
                <li>✓ Your own webpage on the Aretifi network</li>
                <li>✓ We write your business bio</li>
                <li>✓ Logo & colors for flyers</li>
                <li>✓ Standard email support</li>
              </ul>
              <Link href="/upgrade-offer" className="w-full py-4 rounded-xl font-bold text-center bg-blue-600 text-white hover:bg-blue-700 shadow-md transition">Get Listed Now</Link>
            </div>

            {/* Pro Plus */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-semibold mb-2 italic text-pretty">Pro Plus</h3>
              <div className="text-4xl font-bold mb-4">$29<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <p className="text-slate-600 mb-8 min-h-[3rem]">Get more jobs with priority access and support.</p>
              <ul className="space-y-4 mb-10 flex-grow text-slate-700 font-medium text-pretty">
                <li className="font-bold text-blue-600">✓ Webpage hosted on unique URL</li>
                <li>✓ 20 page website</li>
                <li>✓ Get found on Google!</li>
                <li>✓ Priority customer support</li>
              </ul>
              <Link href="/upgrade-offer" className="w-full py-3 rounded-xl font-bold text-center bg-slate-900 text-white hover:bg-slate-800 transition">Get Pro Plus</Link>
            </div>
          </div>

          {/* Corrected Upgraded Flyer Package Section */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-white rounded-3xl p-10 border border-blue-100 shadow-md text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm">
              BEST VALUE
            </div>
            
            <h3 className="text-2xl font-bold mb-4">Upgraded Flyer Package</h3>
            <p className="text-slate-700 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
              Get <span className="font-bold text-blue-600">5 custom-designed flyers</span> with AI-optimized sales text and premium elements to make your business stand out.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-slate-900">$25</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">One-Time Payment</div>
              </div>
              
              <div className="hidden md:block h-12 w-px bg-slate-200"></div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-blue-700 uppercase tracking-tight italic">Free with Yearly Plan</div>
                <div className="text-sm font-medium text-slate-500">Included with Verified Pro or Pro Plus Yearly</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="https://buy.stripe.com/aFa28l6uL2WY11G3Tt" className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                Buy Flyer Package ($25)
              </Link>
              <Link href="/upgrade-offer" className="bg-white text-blue-600 border-2 border-blue-600 px-10 py-4 rounded-xl font-bold hover:bg-blue-50 transition">
                Get for Free (Yearly)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ... Reviews Section remains the same ... */}
    </main>
  );
}
