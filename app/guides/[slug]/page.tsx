export const dynamicParams = true;

import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateStaticParams() {
  const { data: articles } = await supabase.from('seo_articles').select('slug').eq('site_tag', 'aretifi');
  return (articles || []).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: page } = await supabase.from('seo_articles').select('*').eq('slug', params.slug).eq('site_tag', 'aretifi').single();
  if (!page) return { title: 'Page Not Found' };
  return { 
    title: `${page.title}`, 
    description: page.description 
  };
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname.includes('youtube.com')) {
      videoId = u.searchParams.get('v');
    } else if (u.hostname === 'youtu.be') {
      videoId = u.pathname.slice(1);
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const { data: page } = await supabase.from('seo_articles').select('*').eq('slug', params.slug).eq('site_tag', 'aretifi').single();

  if (!page) notFound();

  const embedUrl = page.youtube_url ? getYouTubeEmbedUrl(page.youtube_url) : null;

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <article className="max-w-3xl mx-auto px-6 mt-16 text-slate-900">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight tracking-tight text-slate-900">
          {page.h1}
        </h1>

        {embedUrl && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={embedUrl}
                title={page.h1}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        <div
          className="prose prose-lg prose-slate max-w-none mb-16 prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        <section className="bg-white border border-slate-200 p-10 rounded-3xl shadow-xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
          <h2 className="text-3xl font-bold mb-4 text-slate-900">
            {page.cta_header || "Level Up Your Business"}
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            {page.cta_body || "Start building your brand today with our professional tools."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a href="/preview" className="bg-blue-600 text-white font-semibold py-3.5 px-8 rounded-xl hover:bg-blue-700 transition-colors">
              Free Flyer & Ad Writer
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
