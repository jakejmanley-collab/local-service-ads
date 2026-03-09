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
          Stop paying thousands to web designers. Answer a few questions, and our system instantly builds you a professional webpage on our trusted trades directory.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/preview" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg">
            Create Free Ad Flyer
          </Link>
          <Link href="#pricing" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg border border-slate-300 hover:bg-slate-100 transition shadow-sm">
            View Fair Pricing
          </Link>
        </div>
      </section>

      {/* Proof Section (Plain English Features) */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Your Own Webpage</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Get a dedicated page on our industry directory (like PlumbingVerse.com) that makes you look like a top-tier pro to potential customers.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">We Do The Writing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Don't know what to say? Just give us a few bullet points. Our system automatically writes a professional business description that gets customers to call.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Fair, Honest Pricing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">We don't charge heavy setup fees or lock you into expensive contracts. You pay one low monthly price, and you keep all the money from your jobs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight mb-6 text-slate-900">
            Fair pricing for the working pro.
          </h2>
          <p className="text-lg text-slate-600 mb-16 max-w-2xl mx-auto text-center">
            Upgrade when just one extra job pays for your entire year.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left mb-16">
            
            {/* Free Tier */}
            <div className="bg-white rounded-3xl p-8 flex flex-col transition-all border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-semibold mb-2 text-slate-900">Free</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500 font-medium">/mo</span>
              </div>
              <p className="text-slate-600 mb-8 min-h-[3rem]">
                Perfect for making your first few ad flyers.
              </p>
              <ul className="space-y-4 mb-10 flex-grow text-slate-700">
                <li className="flex items-start"><span className="mr-3 text-blue-500 font-bold">✓</span> Make unlimited flyers</li>
                <li className="flex items-start"><span className="mr-3 text-blue-500 font-bold">✓</span> Basic ad text templates</li>
                <li className="flex items-start"><span className="mr-3 text-blue-500 font-bold">✓</span> Community support</li>
              </ul>
              <Link href="/preview" className="block w-full py-3.5 rounded-xl font-semibold text-center transition-colors bg-slate-100 text-slate-900 hover:bg-slate-200">
                Start for Free
              </Link>
            </div>

            {/* Verified Pro Tier */}
            <div className="bg-white rounded-3xl p-8 flex flex-col transition-all ring-2 ring-blue-600 shadow-xl relative md:-translate-y-2">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-full w-max">
                Most Popular
              </span>
              <h3 className="text-2xl font-semibold mb-2 text-slate-900">Verified Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-slate-900">$9</span>
                <span className="text-slate-500 font-medium">/mo</span>
              </div>
              <p className="text-slate-600 mb-8 min-h-[3rem]">
                Your own professional webpage hosted on our trades network.
              </p>
              <ul className="space-y-4 mb-10 flex-grow text-slate-700">
                <li className="flex items-start"><span className="mr-3 text-blue-500 font-bold">✓</span> Your own webpage on our network</li>
                <li className="flex items-start"><span className="mr-3 text-blue-500 font-bold">✓</span> We write your business description</li>
                <li className="flex items-start"><span className="mr-3 text-blue-500 font-bold">✓</span> Add your logo and colors to flyers</li>
                <li className="flex items-start"><span className="mr-3 text-blue-500 font-bold">✓</span> Standard email support</li>
              </ul>
              <Link href="/upgrade-offer" className="block w-full py-3.5 rounded-xl font-semibold text-center transition-colors bg-blue-600 text-white hover:bg-blue-700 shadow-md">
                Get Listed
              </Link>
            </div>

            {/* Pro Plus Tier */}
            <div className="bg-white rounded-3xl p-8 flex flex-col transition-all border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-semibold mb-2 text-slate-900">Pro Plus</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-slate-900">$29</span>
                <span className="text-slate-500 font-medium">/mo</span>
              </div>
              <p className="text-slate-600 mb-8 min-h-[3rem]">
                Get seen by more customers in more cities.
              </p>
              <ul className="space-y-4 mb-10 flex-grow text-slate-700">
                <li className="flex items-start"><span className="mr-3 text-blue-500 font-bold">✓</span> Everything in Verified Pro</li>
                <li className="flex items-start"><span className="mr-3 text-blue-500 font-bold">✓</span> Show up in 3 extra cities</li>
                <li className="flex items-start"><span className="mr-3 text-blue-500 font-bold">✓</span> Rank higher on our directory</li>
                <li className="flex items-start"><span className="mr-3 text-blue-500 font-bold">✓</span> Priority customer support</li>
              </ul>
              <Link href="/upgrade-offer" className="block w-full py-3.5 rounded-xl font-semibold text-center transition-colors bg-slate-100 text-slate-900 hover:bg-slate-200">
                Get Pro Plus
              </Link>
            </div>

          </div>

          {/* Annual Bonus Offer Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto shadow-sm relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
            
            <div className="text-left flex-1 relative z-10">
              <div className="inline-block bg-blue-600 text-white font-bold px-3 py-1 rounded-full text-sm mb-4 shadow-sm">
                Yearly Plan Bonus
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Get our Premium Flyer Tool Free
              </h3>
              <p className="text-slate-600 text-lg">
                Choose a yearly plan and get our Premium Flyer Tool completely free, plus save over 20% on your subscription.
              </p>
            </div>
            
            <div className="flex-shrink-0 w-full md:w-auto relative z-10">
              <Link 
                href="/upgrade-offer" 
                className="bg-slate-900 text-white font-semibold py-4 px-8 rounded-xl hover:bg-slate-800 transition-colors shadow-md block text-center text-lg w-full md:w-auto"
              >
                View Yearly Plans
              </Link>
            </div>
          </div>
          
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Trusted by Hard-Working Local Pros</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-700">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed">"I used to get maybe one message a week for my landscaping business. After using these flyer templates, I booked three jobs in two days."</p>
              <div className="font-bold text-white">- Mike T., Landscaping</div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-700">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed">"Getting listed on their network changed everything. Now when I reply to leads, I send them my custom link. It makes me look like a high-end company."</p>
              <div className="font-bold text-white">- Sarah J., Residential Cleaning</div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-700">
              <div className="text-yellow-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed">"Fast, easy, and it works. They don't overcharge like the big agency guys. I answered a few questions and my page was built instantly."</p>
              <div className="font-bold text-white">- David R., Plumbing Services</div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
