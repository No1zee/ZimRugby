"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, User, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signUpFan, signInWithOAuth } from "@/lib/supabase/auth";

export default function JoinFanZoneSection() {
  const { user, isAuthenticated, signInFan } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [favoriteTeam, setFavoriteTeam] = useState<
    "Sables" | "Lady Sables" | "Cheetahs" | "Junior Sables" | "Domestic Rugby"
  >("Sables");
  const [cdpaConsent, setCdpaConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    setIsSubmitting(true);
    setError("");
    try {
      await fetch("/api/fan-zone/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, favoriteTeam, cdpaConsent }),
      });
      const authRes = await signUpFan({ email, name, favoriteTeam });
      signInFan(authRes.profile);
      setSubmitted(true);
      setName("");
      setEmail("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <section className="w-full bg-milk-white py-10 sm:py-12 lg:py-16 relative z-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl p-8 text-center space-y-3 border border-white/10"
            style={{
              background:
                "radial-gradient(circle at 50% 25%, #0A1C15 0%, #00331F 60%, #001A10 100%)",
            }}
          >
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-lg font-black uppercase tracking-wider text-white font-heading">
              Welcome to the Fan Zone!
            </p>
            <p className="text-sm text-white/50">
              Check your inbox for your VIP pass and exclusive member benefits.
            </p>
            <Link
              href="/fan-zone"
              className="clip-slanted inline-flex items-center gap-2 mt-2 bg-zru-green hover:bg-[#004D2C] text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition-all duration-200 hover:-translate-y-0.5 shadow-md"
            >
              <span>Visit Fan Zone</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* ── Already logged in ── */
  if (isAuthenticated && user) {
    return (
      <section className="w-full bg-milk-white py-10 sm:py-12 lg:py-16 relative z-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10"
            style={{
              background:
                "radial-gradient(circle at 50% 25%, #0A1C15 0%, #00331F 60%, #001A10 100%)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl text-white border-2 border-[#006B3F] shrink-0"
                style={{ background: "radial-gradient(circle, #006B3F, #003820)" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-black text-base">{user.name}</p>
                <p className="text-white/50 text-xs font-mono">{user.email}</p>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  ✓ Active Fan Zone Member
                </span>
              </div>
            </div>
            <Link
              href="/fan-zone"
              className="clip-slanted inline-flex items-center gap-2 bg-zru-green hover:bg-[#004D2C] text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-[#006B3F]/30"
            >
              <span>Fan Zone Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* ── Default: Unauthenticated view ── */
  return (
    <section className="w-full bg-milk-white py-12 sm:py-16 relative z-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          style={{
            background:
              "radial-gradient(circle at 50% 25%, #0A1C15 0%, #00331F 60%, #001A10 100%)",
          }}
          className="group/fzCard rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-2xl transition-shadow duration-500 ease-in-out touch-manipulation cursor-pointer border border-white/10"
        >
          {/* Subtle glow border effect on hover */}
          <div className="absolute inset-0 border border-white/10 group-hover/fzCard:border-zru-green/60 group-focus-within/fzCard:border-[#006B3F]/60 group-hover/fzCard:shadow-[inset_0_0_60px_rgba(0,107,63,0.4)] transition-shadow duration-700 pointer-events-none rounded-3xl" />

          {/* Left: Text & Pitch + ZRU Crest Hover Choreography */}
          <div className="flex-1 flex items-center gap-4 sm:gap-6 z-10 sm:pr-4 relative min-h-[110px] w-full">
            {/* Animated ZRU Crest: Left by default -> Centered and Enlarged on Hover */}
            <div className="relative shrink-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/fzCard:translate-x-[calc(50vw-120px)] sm:group-hover/fzCard:translate-x-[calc(50%-180px)] group-hover/fzCard:scale-[1.85] group-hover/fzCard:rotate-6 group-focus-within/fzCard:translate-x-[calc(50%-180px)] group-focus-within/fzCard:scale-[1.85] z-20 pointer-events-none">
              <div className="w-14 h-14 sm:w-16 sm:h-16 relative filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] group-hover/fzCard:drop-shadow-[0_8px_24px_rgba(0,107,63,0.6)] transition-all duration-700">
                <Image
                  src="/images/logos/zru-logo-white-text.svg"
                  alt="Zimbabwe Rugby Union Crest"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Text details: Fades out and slides left on hover */}
            <div className="space-y-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/fzCard:opacity-0 group-hover/fzCard:-translate-x-6 group-hover/fzCard:pointer-events-none group-focus-within/fzCard:opacity-0 group-focus-within/fzCard:-translate-x-6 group-focus-within/fzCard:pointer-events-none">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white font-heading leading-tight">
                JOIN THE ZRU FAN ZONE
              </h3>
              <p className="text-white/65 text-xs sm:text-sm leading-relaxed max-w-lg">
                Priority ticket presale, 10% merchandise discount, exclusive team access, and member-only competitions. Free forever.
              </p>
            </div>
          </div>

          {/* Right: Expandable Auth Area */}
          <div className="w-full sm:w-auto z-10 shrink-0">
            <div className="w-full sm:w-auto group-hover/fzCard:w-full group-focus-within/fzCard:w-full bg-[#0B0F0E]/95 backdrop-blur-xl p-5 sm:p-7 group-hover/fzCard:p-6 sm:group-hover/fzCard:p-8 group-focus-within/fzCard:p-6 sm:group-focus-within/fzCard:p-8 rounded-2xl sm:rounded-3xl border border-emerald-500/30 group-hover/fzCard:border-emerald-400/60 group-focus-within/fzCard:border-emerald-400/60 transition-all duration-500 ease-in-out shadow-[0_25px_60px_rgba(0,0,0,0.7)] relative overflow-hidden">
              
              {/* Subtle top-right ambient glow */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl opacity-0 group-hover/fzCard:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Header / Unexpanded prompt */}
              <div className="transition-[opacity,max-height,margin] duration-500 opacity-0 max-h-0 overflow-hidden mb-0 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-24 group-hover/fzCard:mb-5 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-24 group-focus-within/fzCard:mb-5">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 font-heading block mb-1">
                  ZIMBABWE RUGBY UNION • SABLES FAN ZONE
                </span>
                <h4 className="text-white text-sm sm:text-base font-black uppercase tracking-tight font-heading leading-tight mb-1">
                  JOIN <span className="text-emerald-400">10,000+</span> SABLES SUPPORTERS WORLDWIDE
                </h4>
                <p className="text-white/60 text-[11px] sm:text-xs">
                  Get matchday priority, exclusive locker-room access, and member perks.
                </p>
              </div>

              {error && (
                <div className="p-2.5 mb-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              {/* Google Sign-In — revealed on expand */}
              <div className="overflow-hidden opacity-0 max-h-0 transition-[opacity,max-height,margin] duration-500 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-24 group-hover/fzCard:mb-4 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-24 group-focus-within/fzCard:mb-4">
                <button
                  type="button"
                  onClick={() => signInWithOAuth("google")}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 active:bg-zinc-200 text-rich-black text-xs sm:text-sm font-bold py-3 px-4 rounded-xl border border-white/20 transition-all duration-200 shadow-md group/gbtn cursor-pointer"
                >
                  {/* Google "G" SVG */}
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                  </svg>
                  <span className="text-zinc-900 group-hover/gbtn:text-black transition-colors duration-200">Continue with Google</span>
                </button>
                
                {/* OR divider */}
                <div className="flex items-center gap-3 my-3.5">
                  <div className="flex-1 h-px bg-white/15" />
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest font-heading">or continue with email</span>
                  <div className="flex-1 h-px bg-white/15" />
                </div>
              </div>

              {/* Form with stacked inputs + icons */}
              <form
                onSubmit={handleSubmit}
                className="overflow-hidden opacity-0 max-h-0 transition-[opacity,max-height,margin] duration-500 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-[500px] group-hover/fzCard:mb-3 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-[500px] group-focus-within/fzCard:mb-3 space-y-3"
              >
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name (e.g. Tendai Mtawarira)"
                    className="w-full bg-[#070A09] text-white pl-11 pr-4 py-3 rounded-xl border border-white/15 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 text-xs sm:text-sm placeholder:text-white/35 transition-all duration-300 font-sans"
                  />
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address (you@domain.com)"
                    className="w-full bg-[#070A09] text-white pl-11 pr-4 py-3 rounded-xl border border-white/15 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 text-xs sm:text-sm placeholder:text-white/35 transition-all duration-300 font-mono"
                  />
                </div>

                {/* Benefits grid container */}
                <div className="bg-[#070A09]/80 border border-white/10 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    "Priority ticket presale",
                    "10% merch discount",
                    "Insider squad newsletter",
                    "VIP fan competitions",
                  ].map((b) => (
                    <div key={b} className="flex items-center gap-2 text-[11px] text-white/80 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* Primary CTA button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !cdpaConsent}
                  id="fan-zone-join-btn"
                  className="w-full rounded-xl bg-zru-green hover:bg-[#00855B] active:bg-[#005E37] text-white font-black text-xs sm:text-sm tracking-widest uppercase font-heading py-3.5 px-6 shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer group/btn"
                >
                  <span>{isSubmitting ? "AUTHENTICATING..." : "JOIN THE FAN ZONE"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </button>
              </form>

              {/* CDPA consent + footer — revealed on expand */}
              <div className="opacity-0 max-h-0 overflow-hidden transition-[opacity,max-height,margin] duration-500 mt-0 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-24 group-hover/fzCard:mt-3 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-24 group-focus-within/fzCard:mt-3 space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="cdpa-banner"
                    checked={cdpaConsent}
                    onChange={(e) => setCdpaConsent(e.target.checked)}
                    className="mt-0.5 rounded border-white/30 bg-black/40 text-zru-green focus:ring-emerald-400 focus:ring-offset-0"
                  />
                  <label htmlFor="cdpa-banner" className="text-[10px] text-white/60 leading-relaxed cursor-pointer select-none">
                    I consent to ZRU news &amp; ticket alerts (
                    <Link href="/privacy-policy" className="text-emerald-400 underline hover:text-white transition-colors">
                      CDPA 2021 &amp; Data Protection
                    </Link>
                    ).
                  </label>
                </div>
                <div className="text-[10px] text-white/40 flex items-center justify-between w-full pt-1 border-t border-white/5">
                  <span>Unsubscribe anytime. Protected under CDPA 2021.</span>
                  <Link className="text-emerald-400 hover:text-white underline transition-colors" href="/fan-zone">
                    Learn more
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
