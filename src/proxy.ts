import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Redirect old onboarding paths to the consolidated /onboarding page
  if (
    path.startsWith('/onboarding/') &&
    path !== '/onboarding'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/onboarding';
    return NextResponse.redirect(url);
  }

  // 2. Execute Supabase authentication session update and route protection
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/portal/:path*', 
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/admin/:path*',
  ],
};
