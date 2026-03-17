import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Use your existing Supabase client logic
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 3600; // Revalidate every hour

export default async function LocationsDirectory() {
  // Fetch slugs from your SEO table
  const { data: articles } = await supabase
    .from('seo_articles')
    .select('slug, title');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black uppercase italic mb-8">Service Locations & Guides</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles?.map((article) => (
          <Link 
            key={article.slug} 
            href={`/guides/${article.slug}`}
            className="p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all font-bold"
          >
            {article.title || article.slug.replace(/-/g, ' ')}
          </Link>
        ))}
      </div>
    </div>
  );
}
