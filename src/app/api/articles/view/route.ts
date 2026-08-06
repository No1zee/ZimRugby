import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { slug, articleId } = await req.json();

    if (!slug && !articleId) {
      return NextResponse.json({ error: 'Missing slug or articleId' }, { status: 400 });
    }

    const key = slug || String(articleId);

    // Initialize Supabase client
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Upsert view count in article_views table
      const { data: existing } = await supabase
        .from('article_views')
        .select('views')
        .eq('article_slug', key)
        .single();

      const newViews = (existing?.views || 0) + 1;

      await supabase
        .from('article_views')
        .upsert(
          {
            article_slug: key,
            views: newViews,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'article_slug' }
        );

      return NextResponse.json({ success: true, views: newViews });
    }

    // Directus Fallback if Directus Token is available
    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const directusToken = process.env.DIRECTUS_ADMIN_TOKEN;

    if (directusUrl && directusToken && articleId) {
      await fetch(`${directusUrl}/items/articles/${articleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${directusToken}`,
        },
        body: JSON.stringify({
          views: { $inc: 1 },
        }),
      }).catch(() => null);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging article view:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ views: 0 });
  }

  try {
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data } = await supabase
        .from('article_views')
        .select('views')
        .eq('article_slug', slug)
        .single();

      return NextResponse.json({ views: data?.views || 0 });
    }
  } catch {
    // ignore
  }

  return NextResponse.json({ views: 0 });
}
