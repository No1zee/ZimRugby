import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/fan-zone'

  if (code) {
    // Buffer the Supabase auth cookies - we can't write them until we have
    // the final redirect response, and we can't create that until we know
    // the destination. Buffer first, apply after.
    let bufferedCookies: { name: string; value: string; options: any }[] = []

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
          setAll(cookies) {
            bufferedCookies = cookies
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const email = data.user.email?.toLowerCase() ?? ''
      let role = data.user.app_metadata?.role as string | undefined

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

      if (email === 'edwardmagejo@gmail.com' || role === 'super_admin') {
        next = '/admin'
      } else if (!next || next === '/fan-zone') {
        next = '/fan-zone'
      }

      // Create redirect with the CORRECT destination from the start
      const redirectRes = NextResponse.redirect(${origin})

      // Apply buffered Supabase auth cookies onto the redirect response
      bufferedCookies.forEach(({ name, value, options }) =>
        redirectRes.cookies.set(name, value, options)
      )

      const baseName =
        data.user.user_metadata?.full_name ??
        data.user.user_metadata?.name ??
        email.split('@')[0] ??
        'User'

      const profile = {
        email,
        name: baseName,
        handle: @,
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

  return NextResponse.redirect(${origin}/login?message=Could+not+authenticate+user)
}
