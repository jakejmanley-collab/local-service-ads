import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (We can use the public anon key here since this data is public)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fallback images based on industry so the pages always look premium
const getHeroImage = (industry: string) => {
  const images: Record<string, string> = {
    plumbing: 'https://images.unsplash.com/photo-1607472586893-edb57cb31422?auto=format&fit=crop&q=80&w=2000',
    landscaping: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2000',
    cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=2000',
    hvac: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=2000',
    roofing: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=2000',
    painting: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=2000',
    other: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=2000',
  };
  return images[industry.toLowerCase()] || images['other'];
};

// Next.js automatically passes the URL params to this page
export default async function ProProfilePage({ params }: { params: { slug: string } }) {
  // 1. Fetch the pro's data from Supabase using the URL slug
  const { data: pro, error } = await supabase
    .from('verified_pros')
    .select('*')
    .eq('slug', params.slug)
    .single();

  // If the URL doesn't match anyone in the database, show a 404 page
  if (error || !pro) {
    notFound();
  }

  // Choose the background image
  const heroImage = pro.hero_image_url || getHeroImage(pro.industry);

  // Turn their bullet points string into an actual list
  const bulletPoints = pro.bullets.split('\n').filter((b: string) => b.trim() !== '');

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Hero Section */}
      <div 
        className="relative h-80 md:h-96 w-full bg-slate-900 flex items-end"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.3)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-5xl mx-auto w-full px-6 pb-12 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full flex items-center gap-1 shadow-md">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              Verified Pro
            </span>
            <span className="text-slate-300 font-medium capitalize flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {pro.city}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 tracking-tight">
            {pro.business_name}
          </h1>
          <p className="text-xl text-slate-200 capitalize font-medium">{pro.industry} Services</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-6 mt-12 grid md:grid-cols-3 gap-12">
        
        {/* Left Column: Bio & Info */}
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">About Us</h2>
            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
              {pro.ai_bio}
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Choose Us?</h2>
            <ul className="space-y-4">
              {bulletPoints.map((bullet: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  <span className="text-lg text-slate-700 font-medium">{bullet.replace(/^-/, '').trim()}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column: Sticky Contact Card */}
        <div className="relative">
          <div className="sticky top-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Need a Quote?</h3>
            <p className="text-slate-500 mb-6 text-sm">Call us directly to schedule your service or request an estimate.</p>
            
            <a 
              href={`tel:${pro.phone.replace(/[^0-9]/g, '')}`} 
              className="block w-full bg-blue-600 text-white font-bold text-xl py-4 rounded-xl hover:bg-blue-700 transition shadow-md mb-4"
            >
              {pro.phone}
            </a>
            
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-6">
              Verified & Listed on Aretifi
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
