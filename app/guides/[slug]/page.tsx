import { seoPages } from '@/lib/seo-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  return seoPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = seoPages.find((p) => p.slug === params.slug);
  if (!page) return { title: 'Page Not Found' };

  return {
    title: `${page.title} | Aretifi Studio`,
    description: page.description,
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const page = seoPages.find((p) => p.slug === params.slug);
  
  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-black italic uppercase text-xl tracking-tight text-slate-900">
            Aretifi Studio
          </Link>
          <Link href="/preview" className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-lg">
            Try Free
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 mt-16">
        <div className="mb-4 text-sm font-bold text-blue-600 uppercase tracking-wide">
          Local Business Growth Guide
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
          {page.h1}
        </h1>
        
        <div className="prose prose-lg prose-slate max-w-none mb-12">
          <p className="text-lg leading-relaxed text-slate-700 font-medium">
            {page.content}
          </p>
        </div>

        <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-2xl font-black uppercase italic mb-4 text-slate-900">
            Stop Blending In. Start Getting Leads.
          </h2>
          <p className="text-slate-600 font-medium mb-8">
            {page.cta}
          </p>
          <Link href="/preview" className="inline-block bg-black text-white font-black text-lg py-4 px-8 uppercase italic transition-transform hover:-translate-y-1 hover:shadow-xl">
            Create Free Ads Now →
          </Link>
        </div>
      </article>
    </main>
  );
}
