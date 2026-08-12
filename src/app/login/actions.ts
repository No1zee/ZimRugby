'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zimrugby.vercel.app'}/auth/callback`,
    },
  })

  // Prevent account enumeration by redirecting with a generic check-email message
  // regardless of user status or exact email existence in database.
  revalidatePath('/', 'layout')
  redirect(`/verify-email?email=${encodeURIComponent(email)}`)
}

export async function resendVerification(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zimrugby.vercel.app'}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}


export async function signInWithProvider(formData: FormData) {
  const supabase = await createClient()
  const provider = formData.get('provider') as string

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as 'google' | 'facebook' | 'apple',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zimrugby.vercel.app'}/auth/callback`,
    },
  })

  if (error) {
    redirect('/login?message=Could not authenticate with provider')
  }

  if (data?.url) {
    redirect(data.url)
  }
}
