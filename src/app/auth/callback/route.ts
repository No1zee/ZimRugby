import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/fan-zone'

  if (code) {
    // Build the redirect response first so we can wire the Supabase client
    // directly to it. This is required in Route Handlers because next/headers
    // cookies() is read-only — any setAll() call on the shared cookie store is
    // silently swallowed, meaning the session never actually lands on the
    // browser. By pointing the client at the response object we ensure the
    // Supabase auth cookies are written on the same response the browser follows.
    const redirectRes = NextResponse.redirect(`${origin}/fan-zone`) // temp target, overwritten below

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return (
              request.headers
                .get('cookie')
                ?.split(';')
                .map((c) => {
                  const [name, ...rest] = c.trim().split('=')
                  return { name: name.trim(), value: rest.join('=').trim() }
                }) ?? []
            )
          },
          setAll(cookiesToSet) {
            // Write every Supabase auth cookie onto the outbound redirect response
            cookiesToSet.forEach(({ name, value, options }) =>
              redirectRes.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const email = data.user.email?.toLowerCase() ?? ''
      let role = data.user.app_metadata?.role as string | undefined

      // Super-admin bootstrap: if no role is stored yet, stamp it now
      if (!role && email === 'edwardmagejo@gmail.com') {
        role = 'super_admin'
        const adminClient = getAdminClient()
        if (adminClient) {
          await adminClient.auth.admin
            .updateUserById(data.user.id, {
              app_metadata: { ...data.user.app_metadata, role: 'super_admin' },
            })
            .catch(() => {})
        }
      }

      // Determine where to send the user
      if (email === 'edwardmagejo@gmail.com' || role === 'super_admin') {
        next = '/admin'
      } else if (!next || next === '/fan-zone') {
        next = '/fan-zone'
      }

      // Set the correct destination on the redirect response
      redirectRes.headers.set('Location', `${origin}${next}`)

      // Also write a lightweight zru_user_session cookie so the AuthContext
      // can hydrate the user's display name / handle on the client side
      const baseName =
        data.user.user_metadata?.full_name ??
        data.user.user_metadata?.name ??
        email.split('@')[0] ??
        'User'

      const profile = {
        email,
        name: baseName,
        handle: `@${baseName.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '')}`,
        favoriteTeam: 'Sables',
      }

      redirectRes.cookies.set(
        'zru_user_session',
        encodeURIComponent(JSON.stringify(profile)),
        {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
          sameSite: 'lax',
        }
      )

      return redirectRes
    }
  }

  // Fallback — exchange failed or no code present
  return NextResponse.redirect(`${origin}/login?message=Could+not+authenticate+user`)
}
