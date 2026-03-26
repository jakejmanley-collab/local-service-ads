import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { slug, youtubeUrl, tiktokUrl, instagramUrl, passcode } = await req.json();

    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }
    if (!passcode || passcode.trim() !== expected.trim()) {
      return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const adminSupabase = getServiceSupabase();

    const { error } = await adminSupabase
      .from('seo_articles')
      .update({
        youtube_url: youtubeUrl || null,
        tiktok_url: tiktokUrl || null,
        instagram_url: instagramUrl || null,
      })
      .eq('slug', slug)
      .eq('site_tag', 'aretifi');

    if (error) {
      console.error('Supabase save-video error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('save-video error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
