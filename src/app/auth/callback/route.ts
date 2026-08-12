import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/fan-zone'

  if (code) {
    const cookieBuffer: Array<{
      name: string
      value: string
      options: any
    }> = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const raw = request.headers.get('cookie') ?? ''
            return raw
              .split(';')
              .filter(Boolean)
              .map((c) => {
                const eq = c.indexOf('=')
                return {
                  name: c.slice(0, eq).trim(),
                  value: c.slice(eq + 1).trim(),
                }
              })
          },
          setAll(cookiesToSet) {
            for (const { name, value, options } of cookiesToSet) {
              cookieBuffer.push({ name, value, options: options ?? {} })
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const email = data.user.email?.toLowerCase() ?? ''
      const meta = data.user.app_metadata as Record<string, any>
      let role = meta?.role as string | undefined

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

      const redirectRes = NextResponse.redirect(origin + next)

      for (const { name, value, options } of cookieBuffer) {
        redirectRes.cookies.set({ name, value, ...options })
      }

      const userMeta = data.user.user_metadata as Record<string, any>
      const baseName =
        userMeta?.full_name ?? userMeta?.name ?? email.split('@')[0] ?? 'User'

      const handleStr = '@' + baseName.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '')
      const profile = {
        email,
        name: baseName,
        handle: handleStr,
        favoriteTeam: 'Sables',
      }

      redirectRes.cookies.set(
        'zru_user_session',
        encodeURIComponent(JSON.stringify(profile)),
        { path: '/', maxAge: 60 * 60 * 24 * 30, sameSite: 'lax' }
      )

      return redirectRes
    }
  }

  return NextResponse.redirect(
    origin + '/login?message=Could+not+authenticate+user'
  )
}
