import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Phase 1 Route Protection for restricted areas.
  // In Phase 2, this will validate Supabase/Directus tokens.
  const url = request.nextUrl.clone();
  url.pathname = '/auth'; // Redirect to a generic auth page
  
  return NextResponse.redirect(url);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*', 
    '/portal/:path*', 
    '/dashboard/:path*'
  ],
};
