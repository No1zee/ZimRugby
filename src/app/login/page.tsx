import { login, signup } from './actions'
import SlantedButton from '@/components/ui/SlantedButton'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-rich-black flex flex-col justify-between selection:bg-zru-green selection:text-white">
      {/* Top back nav */}
      <div className="flex-none px-6 pt-6 max-w-[1440px] mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[10px] font-heading font-black uppercase tracking-[0.2em] group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to ZimRugby
        </Link>
      </div>

      {/* Centered card */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 my-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zru-green/20 border border-zru-green/40 mb-4">
              <Lock className="w-5 h-5 text-zru-green" />
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-white tracking-widest uppercase mb-2 italic">
              ZRU Portal
            </h1>
            <p className="text-white/50 text-xs sm:text-sm font-medium">
              Sign in to your Zimbabwe Rugby Union portal account
            </p>
          </div>

          {/* Form card */}
          <div className="card-green border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl">
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[10px] font-heading font-extrabold text-white/70 uppercase tracking-widest">
                  Email Address
                </label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="you@example.com"
                  className="bg-rich-black border border-white/20 rounded-lg p-3 text-white placeholder-white/30 focus:border-zru-green focus:outline-none transition-colors text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-[10px] font-heading font-extrabold text-white/70 uppercase tracking-widest">
                  Password
                </label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="bg-rich-black border border-white/20 rounded-lg p-3 text-white placeholder-white/30 focus:border-zru-green focus:outline-none transition-colors text-sm"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end -mt-1">
                <Link 
                  href="/contact" 
                  className="text-[11px] text-zru-green hover:text-white transition-colors font-heading font-bold uppercase tracking-widest"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Button hierarchy: Log In is primary (zru green filled), Create Account is secondary (outline) */}
              <div className="flex flex-col gap-3 mt-3">
                <SlantedButton formAction={login} variant="primary" className="w-full justify-center">
                  Log In
                </SlantedButton>
                <SlantedButton formAction={signup} variant="outline" className="w-full justify-center">
                  Create Account
                </SlantedButton>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Slim Footer */}
      <div className="flex-none text-center px-6 py-4 border-t border-white/10 bg-black/40">
        <p className="text-[10px] text-white/40 font-medium">
          © {new Date().getFullYear()} Zimbabwe Rugby Union. All rights reserved.{" "}
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          {" · "}
          <Link href="/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link>
        </p>
      </div>
    </div>
  )
}
