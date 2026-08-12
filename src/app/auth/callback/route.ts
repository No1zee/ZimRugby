import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const email = data.user?.email?.toLowerCase()
      const role = data.user?.app_metadata?.role

      if (email === 'edwardmagejo@gmail.com' || role === 'super_admin') {
        next = '/admin'
      } else if (!next) {
        next = '/fan-zone'
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`)
}
