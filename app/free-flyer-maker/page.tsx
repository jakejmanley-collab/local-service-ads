import Link from 'next/link';

export const metadata = {
  title: 'Free Flyer Maker for Local Service Pros | Aretifi',
  description: 'Create professional, high-converting flyers for your trades business in seconds. Free flyer templates, AI-written ad copy, and custom brand colors.',
};

export default function FreeFlyerMakerPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-blue-100 text-blue-700 font-bold px-4 py-1.5 rounded-full text-sm mb-6 shadow-sm">
          100% Free Flyer Generator
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight text-balance">
          Free Flyer Maker for <br className="hidden md:block" />
          <span className="text-blue-600">Local Service Pros</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          Stop struggling with complex design tools. Enter your business details, and our AI instantly builds professional, high-converting flyers for your trade.
        </p>
        
        <div className="flex justify-center mb-12">
          <Link href="/preview" className="bg-blue-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg text-center">
            Start Building for Free
          </Link>
        </div>

        {/* Stat Row */}
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-lg text-green-700 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <span className="font-bold text-slate-700 text-sm">Business flyers increase conversions by 34%</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 italic text-slate-900">
            Everything you need to book more jobs.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center text-blue-600 mb-6 shadow-sm border border-slate-200">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">1-Click Templates</h3>
              <p className="text-slate-600 leading-relaxed text-sm text-balance">
                Choose from proven layouts like Circle, Square, and Hex. No dragging, dropping, or design skills required.
              </p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center text-blue-600 mb-6 shadow-sm border border-slate-200">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Written Ad Copy</h3>
              <p className="text-slate-600 leading-relaxed text-sm text-balance">
                We generate professional, friendly, and aggressive sales copy tailored specifically to your trade and services.
              </p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center text-blue-600 mb-6 shadow-sm border border-slate-200">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Brand Colors</h3>
              <p className="text-slate-600 leading-relaxed text-sm text-balance">
                Instantly match your flyer to your brand's identity with our built-in color themes to look like a premium company.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 italic">How to make your flyer in 30 seconds</h2>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-black italic">1</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Enter your basic info</h3>
                <p className="text-slate-600 text-lg">Type in your business name, trade, phone number, and top services.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-black italic">2</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Let our system build it</h3>
                <p className="text-slate-600 text-lg">Our tool automatically formats your flyer, drops in relevant industry photos, and writes your ad copy.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-black italic">3</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Download and post</h3>
                <p className="text-slate-600 text-lg">Pick your favorite layout, grab the AI text, and start posting on local community boards to get jobs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-900 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6 italic">Ready to look professional?</h2>
          <p className="text-xl text-slate-300 mb-10 text-balance">
            Stop sending text-only replies to leads. Stand out with a custom flyer and optimized sales copy today.
          </p>
          <Link href="/preview" className="inline-block bg-blue-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-blue-700 transition shadow-lg">
            Create Your Flyer Now
          </Link>
        </div>
      </section>

    </main>
  );
}
