import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      const email = data.user.email?.toLowerCase() || ''
      let role = data.user.app_metadata?.role

      if (email === 'edwardmagejo@gmail.com') {
        role = 'super_admin'
        // Persist super_admin role into Supabase Auth app_metadata permanently via Admin Client
        const adminClient = getAdminClient()
        if (adminClient) {
          await adminClient.auth.admin.updateUserById(data.user.id, {
            app_metadata: { ...data.user.app_metadata, role: 'super_admin' },
          }).catch(() => {})
        }
      }

      if (email === 'edwardmagejo@gmail.com' || role === 'super_admin') {
        next = '/admin'
      } else if (!next) {
        next = '/fan-zone'
      }

      const res = NextResponse.redirect(`${origin}${next}`)
      
      // Set zru_user_session cookie on response for seamless fallback auth
      const baseName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || email.split('@')[0] || 'Admin'
      const profile = {
        email,
        name: baseName,
        handle: `@${baseName.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '')}`,
        favoriteTeam: 'Sables',
      }
      res.cookies.set('zru_user_session', encodeURIComponent(JSON.stringify(profile)), {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      })

      return res
    }
  }

  return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`)
}
