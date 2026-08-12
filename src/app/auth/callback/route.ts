import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/fan-zone'

  if (code) {
    const cookieQueue: Array<{ name: string; value: string; options: any }> = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach((cookie) => cookieQueue.push(cookie))
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const email = data.user.email?.toLowerCase() ?? ''
      const meta = (data.user.app_metadata || {}) as Record<string, any>
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

      const response = NextResponse.redirect(`${origin}${next}`)

      cookieQueue.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options)
      })

      const userMeta = (data.user.user_metadata || {}) as Record<string, any>
      const baseName = userMeta?.full_name ?? userMeta?.name ?? email.split('@')[0] ?? 'User'
      const handleStr = '@' + baseName.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '')
      const profile = {
        email,
        name: baseName,
        handle: handleStr,
        favoriteTeam: 'Sables',
      }

      response.cookies.set(
        'zru_user_session',
        encodeURIComponent(JSON.stringify(profile)),
        { path: '/', maxAge: 60 * 60 * 24 * 30, sameSite: 'lax' }
      )

      return response
    }
  }

  return NextResponse.redirect(`${origin}/login?message=Could+not+authenticate+user`)
}
