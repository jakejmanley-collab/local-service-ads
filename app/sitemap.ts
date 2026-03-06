import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aretifi.com'; // REPLACE WITH YOUR ACTUAL DOMAIN

  // Fetch all slugs from your SEO table
  const { data: articles } = await supabase
    .from('seo_articles')
    .select('slug, created_at');

  const articleEntries = (articles || []).map((article) => ({
    url: `${baseUrl}/guides/${article.slug}`,
    lastModified: new Date(article.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Add your main pages too
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/preview`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...articleEntries,
  ];
}
