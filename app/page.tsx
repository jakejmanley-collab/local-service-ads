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
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
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

      {/* Feature Grid - Mirrored from your Upgrade Page */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-4 border-r md:border-slate-100 last:border-0">
              <div className="text-blue-600 font-bold text-lg mb-2 underline underline-offset-4 decoration-2">Verified Pro</div>
              <p className="text-slate-600 text-sm italic">"Your own professional webpage hosted on our trades network."</p>
            </div>
            <div className="p-4 border-r md:border-slate-100 last:border-0">
              <div className="text-blue-600 font-bold text-lg mb-2 underline underline-offset-4 decoration-2">AI Writing</div>
              <p className="text-slate-600 text-sm">We automatically write your business description for you.</p>
            </div>
            <div className="p-4 border-r md:border-slate-100 last:border-0">
              <div className="text-blue-600 font-bold text-lg mb-2 underline underline-offset-4 decoration-2">Custom Branding</div>
              <p className="text-slate-600 text-sm">Add your own logo and colors to your ad flyers.</p>
            </div>
            <div className="p-4">
              <div className="text-blue-600 font-bold text-lg mb-2 underline underline-offset-4 decoration-2">Pro Plus Advantage</div>
              <p className="text-slate-600 text-sm">Show up in extra cities and rank higher on the directory.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 italic">Fair pricing for the working pro.</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-8 rounded-3xl border-2 border-blue-600 shadow-xl">
              <h3 className="text-2xl font-bold italic">Verified Pro</h3>
              <p className="text-4xl font-bold mt-2 text-blue-600">$9<span className="text-lg text-slate-500 font-normal">/mo</span></p>
              <Link href="/upgrade-offer" className="mt-8 block w-full bg-blue-600 text-white py-4 rounded-xl text-center font-bold shadow-lg hover:bg-blue-700 transition">Get Listed Now</Link>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold italic">Pro Plus</h3>
              <p className="text-4xl font-bold mt-2 text-slate-900">$29<span className="text-lg text-slate-500 font-normal">/mo</span></p>
              <Link href="/upgrade-offer" className="mt-8 block w-full bg-slate-900 text-white py-4 rounded-xl text-center font-bold hover:bg-slate-800 transition">Get More Jobs</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
