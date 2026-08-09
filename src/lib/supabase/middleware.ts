import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // /dashboard, /portal → /login ; /admin pages → /admin-login
  const isAdminRoute = path.startsWith('/admin/') || path === '/admin'
  const isUserRoute = path.startsWith('/dashboard') || path.startsWith('/portal')

  // Redirect unauthenticated visitors to the appropriate login
  if (!user) {
    if (isAdminRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin-login'
      return NextResponse.redirect(url)
    }
    if (isUserRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated but unverified accounts to verification notice
  if (
    user &&
    !user.email_confirmed_at &&
    (isAdminRoute || isUserRoute)
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/verify-email'
    url.searchParams.set('email', user.email || '')
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
