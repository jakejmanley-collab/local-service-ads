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
      {/* Navbar - Cleaned up typography */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold text-xl tracking-tight text-slate-900">
            Aretifi Studio
          </Link>
          <div className="flex gap-4">
            <Link href="/preview" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Try Free
            </Link>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-6 mt-16 text-slate-900">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight tracking-tight text-slate-900">
          {page.h1}
        </h1>
        
        {/* Softened the prose headings to remove the forced black italics */}
        <div 
          className="prose prose-lg prose-slate max-w-none mb-16 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:leading-relaxed prose-a:text-blue-600 hover:prose-a:text-blue-800"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* Lead Magnet CTA Box - Modernized */}
        <section className="bg-white border border-slate-200 p-10 rounded-3xl shadow-xl flex flex-col items-center text-center relative overflow-hidden mt-12">
          {/* Subtle blue top border accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
          
          <h2 className="text-3xl font-bold mb-4 leading-tight text-slate-900">
            {page.cta_header || "Level Up Your Business"}
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-xl">
            {page.cta_body || "Start building your brand today with our professional tools."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/preview" className="bg-blue-600 text-white font-semibold py-3.5 px-8 rounded-xl hover:bg-blue-700 transition-colors text-lg shadow-sm">
              Free Flyer & Ad Writer
            </Link>
            <Link href="/pricing" className="bg-slate-100 text-slate-900 font-semibold py-3.5 px-8 rounded-xl hover:bg-slate-200 transition-colors text-lg">
              View Pro Plans
            </Link>
          </div>
        </section>
      </article>

      {/* Footer link back to all guides */}
      <footer className="max-w-3xl mx-auto px-6 mt-20 pt-8 border-t border-slate-200 text-center">
        <Link href="/guides" className="text-blue-600 font-semibold hover:underline">
          ← Back to all business guides
        </Link>
      </footer>
    </main>
  );
}
