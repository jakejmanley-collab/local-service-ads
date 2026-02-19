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
            Start Your Free Preview
          </Link>
          <Link href="#pricing" className="bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-lg border border-slate-300 hover:bg-slate-100 transition">
            View Pricing Packages
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-extrabold text-blue-600 mb-2">34%</div>
              <h3 className="text-lg font-bold mb-2">Higher Click-Through Rate</h3>
              <p className="text-slate-600 text-sm">Listings that utilize multi-image carousel structures significantly outperform standard single-photo posts.</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-extrabold text-blue-600 mb-2">30%</div>
              <h3 className="text-lg font-bold mb-2">Conversion Increase</h3>
              <p className="text-slate-600 text-sm">Optimizing ad copy with clear value propositions and localized keywords prevents bounce rates.</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-extrabold text-blue-600 mb-2">9.96%</div>
              <h3 className="text-lg font-bold mb-2">Industry Standard Target</h3>
              <p className="text-slate-600 text-sm">We format your free, organic posts to match the conversion standards of professional paid lead-generation campaigns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Choose Your Growth Path</h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Starter Package */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="text-3xl font-extrabold mb-6">$29<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1 text-slate-600">
                <li className="flex gap-2">✓ <span>Commercial-grade business flyers</span></li>
                <li className="flex gap-2">✓ <span>AI-generated, high-converting ad text</span></li>
                <li className="flex gap-2">✓ <span>Unlimited edits and downloads</span></li>
              </ul>
              <button className="w-full bg-slate-100 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-200">Select Starter</button>
            </div>

            {/* Growth Package */}
            <div className="bg-blue-600 p-8 rounded-xl shadow-md border border-blue-700 flex flex-col text-white transform md:-translate-y-4">
              <div className="text-sm font-bold uppercase tracking-wider mb-2 text-blue-200">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Growth</h3>
              <div className="text-3xl font-extrabold mb-6">$99<span className="text-lg text-blue-200 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1 text-blue-50">
                <li className="flex gap-2">✓ <span>Everything in Starter</span></li>
                <li className="flex gap-2">✓ <span>Custom Single-Page Website</span></li>
                <li className="flex gap-2">✓ <span>Lead capture contact form</span></li>
                <li className="flex gap-2">✓ <span>Mobile optimized design</span></li>
              </ul>
              <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-slate-100">Select Growth</button>
            </div>

            {/* Professional Package */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="text-3xl font-extrabold mb-6">$299<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1 text-slate-600">
                <li className="flex gap-2">✓ <span>Everything in Growth</span></li>
                <li className="flex gap-2">✓ <span>20-Page SEO Optimized Website</span></li>
                <li className="flex gap-2">✓ <span>Programmatic local service pages</span></li>
                <li className="flex gap-2">✓ <span>Google Business Profile integration</span></li>
              </ul>
              <button className="w-full bg-slate-100 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-200">Select Professional</button>
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
