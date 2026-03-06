export const dynamicParams = true;

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateStaticParams() {
  const { data: articles } = await supabase.from('seo_articles').select('slug').limit(10);
  return (articles || []).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: page } = await supabase.from('seo_articles').select('*').eq('slug', params.slug).single();
  if (!page) return { title: 'Page Not Found' };
  return { 
    title: `${page.title} | Aretifi Studio`, 
    description: page.description 
  };
}

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const { data: page } = await supabase.from('seo_articles').select('*').eq('slug', params.slug).single();
  
  if (!page) notFound();

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-20 text-slate-900">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-black italic uppercase text-xl tracking-tight">Aretifi Studio</Link>
          <div className="flex gap-4">
            <Link href="/preview" className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Try Free</Link>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-6 mt-16">
        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
          {page.h1}
        </h1>
        
        <div 
          className="prose prose-lg prose-slate max-w-none mb-16 prose-headings:font-black prose-headings:italic prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* Lead Magnet CTA Box */}
        <section className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
          <h2 className="text-3xl font-black uppercase italic mb-4 leading-tight">
            {page.cta_header || "Level Up Your Business"}
          </h2>
          <p className="text-lg font-medium text-slate-600 mb-8 max-w-xl">
            {page.cta_body || "Start building your brand today with our professional tools."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/preview" className="bg-blue-600 text-white font-black py-4 px-10 rounded-xl hover:scale-105 transition-transform text-lg shadow-md">
              Free Flyer & Ad Writer
            </Link>
            <Link href="/pricing" className="bg-black text-white font-black py-4 px-10 rounded-xl hover:scale-105 transition-transform text-lg shadow-md">
              View Pro Plans
            </Link>
          </div>
        </section>
      </article>

      {/* Footer link back to all guides */}
      <footer className="max-w-3xl mx-auto px-6 mt-20 pt-8 border-t border-slate-200">
        <Link href="/guides" className="text-blue-600 font-bold hover:underline">
          ← Back to all business guides
        </Link>
      </footer>
    </main>
  );
}
