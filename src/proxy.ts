import { type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*', 
    '/portal/:path*', 
    '/dashboard/:path*',
  ],
};
