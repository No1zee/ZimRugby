import { NextResponse } from 'next/server';
import { getSocialPosts } from '@/lib/data-fetcher';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await getSocialPosts();
    return NextResponse.json({
      success: true,
      count: posts.length,
      posts: posts.slice(0, 10),
      lastUpdated: posts[0]?.date || null,
      message: 'Facebook sync is manual. Run "npm run sync:facebook" to scrape latest posts.'
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to load social posts' },
      { status: 500 }
    );
  }
}
