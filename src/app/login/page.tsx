import { Metadata } from "next";
import { login, signup } from './actions'
import SlantedButton from '@/components/ui/SlantedButton'
import Link from 'next/link'
import { ArrowLeft, Shield, Trophy, Ticket, Megaphone } from 'lucide-react'

export const metadata: Metadata = {
  title: "Fan Zone Login | Zimbabwe Rugby Union",
  description: "Sign in to your Zimbabwe Rugby Union Fan Zone account for priority tickets, exclusive content, and member perks.",
};

const benefits = [
  { icon: Ticket, label: "Priority ticket access" },
  { icon: Trophy, label: "Exclusive match content" },
  { icon: Megaphone, label: "Early announcements" },
  { icon: Shield, label: "Member-only perks" },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF0] flex flex-col selection:bg-zru-green selection:text-white">
      {/* Top back nav */}
      <div className="flex-none px-6 pt-6 max-w-[1440px] mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-rich-black/40 hover:text-rich-black transition-colors text-[10px] font-heading font-black uppercase tracking-[0.2em] group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to ZimRugby
        </Link>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Left — Fan Zone branding */}
          <div className="hidden md:flex flex-col gap-8 px-4">
            <div>
              <span className="inline-block text-[9px] font-black uppercase tracking-[0.2em] text-zru-green mb-3 bg-zru-green/10 px-2 py-1 rounded-sm border border-zru-green/15">
                FAN ZONE
              </span>
              <h1 className="text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-rich-black leading-[1.05]">
                Your rugby.
                <br />
                <span className="text-zru-green">Your community.</span>
              </h1>
              <p className="text-rich-black/50 text-sm font-body mt-4 leading-relaxed max-w-sm">
                Join thousands of Zimbabwe rugby fans. Priority tickets, exclusive content, and behind-the-scenes access — all in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zru-green/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-zru-green" />
                    </div>
                    <span className="text-xs font-bold text-rich-black/70 uppercase tracking-wider">
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Sign-in form */}
          <div className="w-full max-w-md mx-auto">
            {/* Mobile-only heading */}
            <div className="md:hidden text-center mb-6">
              <span className="inline-block text-[9px] font-black uppercase tracking-[0.2em] text-zru-green mb-2 bg-zru-green/10 px-2 py-1 rounded-sm border border-zru-green/15">
                FAN ZONE
              </span>
              <h1 className="text-3xl font-heading font-black uppercase tracking-tight text-rich-black">
                Sign In
              </h1>
              <p className="text-rich-black/50 text-xs font-body mt-1">
                Access your Zimbabwe Rugby Union Fan Zone account
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-8">
              <div className="text-center mb-6 hidden md:block">
                <h2 className="text-2xl font-heading font-black uppercase tracking-tight text-rich-black">
                  Sign In
                </h2>
                <p className="text-rich-black/40 text-xs font-body mt-1">
                  Welcome back to the Fan Zone
                </p>
              </div>

              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[10px] font-heading font-extrabold text-rich-black/50 uppercase tracking-[0.2em]">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="bg-[#FDFBF0] border border-black/10 rounded-lg p-3 text-rich-black placeholder-rich-black/30 focus:border-zru-green focus:outline-none transition-[border-color] text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-[10px] font-heading font-extrabold text-rich-black/50 uppercase tracking-[0.2em]">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="bg-[#FDFBF0] border border-black/10 rounded-lg p-3 text-rich-black placeholder-rich-black/30 focus:border-zru-green focus:outline-none transition-[border-color] text-sm"
                  />
                </div>

                <div className="flex justify-end -mt-1">
                  <Link
                    href="/contact"
                    className="text-[11px] text-zru-green hover:text-[#005238] transition-[color] font-heading font-bold uppercase tracking-[0.2em]"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="flex flex-col gap-3 mt-3">
                  <SlantedButton formAction={login} variant="primary" className="w-full justify-center">
                    Sign In
                  </SlantedButton>
                  <SlantedButton formAction={signup} variant="secondary" className="w-full justify-center">
                    Create Account
                  </SlantedButton>
                </div>
              </form>
            </div>

            <p className="text-center text-[10px] text-rich-black/30 mt-4 font-body">
              By signing in you agree to our{" "}
              <Link href="/terms-of-use" className="underline hover:text-rich-black/60 transition-[color]">Terms</Link>
              {" & "}
              <Link href="/privacy-policy" className="underline hover:text-rich-black/60 transition-[color]">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Slim footer */}
      <div className="flex-none text-center px-6 py-4 border-t border-black/5">
        <p className="text-[10px] text-rich-black/30 font-body">
          © {new Date().getFullYear()} Zimbabwe Rugby Union. All rights reserved.
        </p>
      </div>
    </div>
  )
}
