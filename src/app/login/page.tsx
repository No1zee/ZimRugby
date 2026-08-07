'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Lock, Mail, User, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<'register' | 'magic_link'>('register')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [favoriteTeam, setFavoriteTeam] = useState('sables')
  const [consent, setConsent] = useState(true)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zimrugby.vercel.app'
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      console.error('Google Sign In Error:', err)
      setError(err.message || 'Failed to initialize Google Sign In')
      setGoogleLoading(false)
    }
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const supabase = createClient()
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zimrugby.vercel.app'

      if (authMode === 'register' || authMode === 'magic_link') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
              full_name: fullName,
              favorite_team: favoriteTeam,
              cdpa_consent: consent,
            },
          },
        })
        if (error) throw error
        setMessage('Check your email! We sent you a magic login link to access your ZRU Passport.')
      }
    } catch (err: any) {
      console.error('Auth Submit Error:', err)
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-rich-black text-white relative overflow-hidden flex flex-col justify-center items-center px-4 py-16">
      {/* Ambient Radial Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zru-green/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Animated Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          {/* Green Badge Header */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zru-green/20 border border-zru-green/40 text-zru-green text-xs font-bold uppercase tracking-wider rounded-full mb-6 shadow-[0_0_15px_rgba(0,107,63,0.3)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Fan Zone Authentication</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
            Join The Sables Fan Zone
          </h1>

          {/* Subheadline */}
          <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto mb-8 font-light">
            Get 10% off official merchandise, priority ticket alerts, and exclusive Sables match updates.
          </p>

          {/* Form Box */}
          <div className="bg-black/40 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl text-left">
            {/* Quick Google Sign In */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-3.5 px-4 bg-white/10 hover:bg-white/15 active:scale-[0.99] border border-white/20 hover:border-zru-green/60 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-3 shadow-md group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-black/60 px-3 text-xs text-white/50 uppercase font-medium absolute">Or Email Passport</span>
            </div>

            {/* Error / Success Alerts */}
            {error && (
              <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-5 p-4 bg-zru-green/20 border border-zru-green/40 rounded-xl flex items-center gap-3 text-zru-green text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Farai Moyo"
                  className="w-full px-4 py-3.5 bg-black/30 border border-white/10 focus:border-zru-green rounded-xl text-white placeholder-white/30 text-sm focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farai@example.co.zw"
                  className="w-full px-4 py-3.5 bg-black/30 border border-white/10 focus:border-zru-green rounded-xl text-white placeholder-white/30 text-sm focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-2">
                  Favorite Rugby Team
                </label>
                <select
                  value={favoriteTeam}
                  onChange={(e) => setFavoriteTeam(e.target.value)}
                  className="w-full px-4 py-3.5 bg-black/30 border border-white/10 focus:border-zru-green rounded-xl text-white text-sm focus:outline-none transition-colors"
                >
                  <option value="sables">Sables Men's XV</option>
                  <option value="cheetahs">Cheetahs Men's 7s</option>
                  <option value="lady-sables">Lady Sables Women's XV</option>
                  <option value="lady-cheetahs">Lady Cheetahs Women's 7s</option>
                  <option value="junior-sables">Junior Sables (U20)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 text-zru-green focus:ring-zru-green bg-black/30 cursor-pointer"
                />
                <label htmlFor="consent" className="text-xs text-white/70 cursor-pointer">
                  I agree to receive ZRU news & ticket alerts (CDPA 2021 Compliant).
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-zru-green hover:bg-zru-green/90 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-zru-green/20 flex items-center justify-center gap-2 mt-4"
              >
                <span>{loading ? 'Generating Passport...' : 'Join Fan Zone & Get VIP Pass'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
