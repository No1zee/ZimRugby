"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
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
              className="inline-flex items-center gap-2 mt-2 bg-zru-green hover:bg-zru-green/90 text-white font-black uppercase tracking-widest text-xs px-6 py-3 rounded-xl transition-all duration-200"
            >
              Visit Fan Zone <ArrowRight className="w-4 h-4" />
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
              className="inline-flex items-center gap-2 bg-zru-green hover:bg-zru-green/90 text-white font-black uppercase tracking-widest text-xs px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#006B3F]/30"
            >
              Fan Zone Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* ── Main banner (original expand mechanic) ── */
  return (
    <section className="w-full bg-milk-white py-10 sm:py-12 lg:py-16 relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/*
          group/fzCard — the original CSS-only expand trick.
          On hover/focus-within the logo zooms, the text slides away,
          and the form panel expands to fill the space.
        */}
        <div
          className="group/fzCard rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-2xl transition-shadow duration-500 ease-in-out touch-manipulation cursor-pointer border border-white/10"
          style={{
            background:
              "radial-gradient(circle at 50% 25%, #0A1C15 0%, #00331F 60%, #001A10 100%)",
          }}
        >
          {/* Border glow on hover */}
          <div className="absolute inset-0 border border-white/10 group-hover/fzCard:border-zru-green/60 group-focus-within/fzCard:border-[#006B3F]/60 group-hover/fzCard:shadow-[inset_0_0_60px_rgba(0,107,63,0.4)] transition-shadow duration-700 pointer-events-none rounded-3xl" />
          {/* Green gradient sweep */}
          <div className="absolute inset-0 opacity-0 group-hover/fzCard:opacity-20 group-focus-within/fzCard:opacity-20 pointer-events-none bg-gradient-to-r from-transparent via-[#006B3F] to-transparent transition-opacity duration-700" />

          {/* LEFT: Logo + collapsed text */}
          <div className="flex items-center justify-start group-hover/fzCard:justify-center group-focus-within/fzCard:justify-center gap-4 relative z-10 sm:w-3/5 group-hover/fzCard:w-1/3 group-focus-within/fzCard:w-1/3 transition-[width,justify-content] duration-500 shrink-0">

            {/* Logo — scales up on hover */}
            <div className="relative shrink-0 flex items-center justify-center transition-transform duration-500 group-hover/fzCard:scale-150">
              <Image
                src="/images/logos/zru-logo-white-text.svg"
                alt="ZRU Emblem"
                width={56}
                height={56}
                className="w-12 sm:w-14 h-12 sm:h-14 object-contain filter drop-shadow-[0_4px_30px_rgba(0,107,63,0.85)] group-hover/fzCard:drop-shadow-[0_8px_35px_rgba(52,211,153,0.6)] transition-[filter] duration-500"
              />
            </div>

            {/* Collapsed label — slides away on hover */}
            <div className="space-y-1.5 transition-[opacity,max-width,transform] duration-500 origin-left max-w-lg opacity-100 group-hover/fzCard:opacity-0 group-hover/fzCard:max-w-0 group-hover/fzCard:scale-95 group-hover/fzCard:overflow-hidden group-focus-within/fzCard:opacity-0 group-focus-within/fzCard:max-w-0 group-focus-within/fzCard:scale-95 group-focus-within/fzCard:overflow-hidden shrink min-w-0">
              <h2 className="text-2xl sm:text-3xl text-white font-heading font-black uppercase tracking-tight leading-tight">
                JOIN THE FAN ZONE
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed font-body line-clamp-2">
                Priority ticket presale, 10% merch discounts, insider squad news, and VIP
                competitions. Free to join.
              </p>
            </div>
          </div>

          {/* RIGHT: Form panel — expands on hover/focus */}
          <div className="relative z-10 w-full sm:w-2/5 group-hover/fzCard:w-2/3 group-focus-within/fzCard:w-2/3 flex flex-col items-center group-hover/fzCard:items-end group-focus-within/fzCard:items-end transition-[width] duration-500">
            <div className="w-full sm:w-auto group-hover/fzCard:w-full group-focus-within/fzCard:w-full bg-white p-3 group-hover/fzCard:p-5 sm:group-hover/fzCard:p-7 group-focus-within/fzCard:p-5 sm:group-focus-within/fzCard:p-7 rounded-2xl border border-black/5 group-hover/fzCard:border-[#006B3F]/50 group-focus-within/fzCard:border-[#006B3F]/50 transition-[width,padding,border-color] duration-500 ease-in-out shadow-lg">

              {/* Header — revealed on expand */}
              <p className="text-zru-green/70 text-xs font-black uppercase tracking-wider font-heading transition-[opacity,max-height,margin] duration-500 opacity-0 max-h-0 overflow-hidden mb-0 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-10 group-hover/fzCard:mb-3 group-hover/fzCard:text-[#002D1A] group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-10 group-focus-within/fzCard:mb-3 group-focus-within/fzCard:text-[#002D1A]">
                Join the Fan Zone &mdash; It&apos;s Free
              </p>

              {error && (
                <p className="text-[10px] text-red-500 font-bold mb-2">{error}</p>
              )}

              {/* Google Sign-In — revealed on expand */}
              <div className="overflow-hidden opacity-0 max-h-0 transition-[opacity,max-height,margin] duration-500 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-24 group-hover/fzCard:mb-3 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-24 group-focus-within/fzCard:mb-3">
                <button
                  type="button"
                  onClick={() => signInWithOAuth("google")}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-black/12 hover:border-[#006B3F]/60 hover:bg-zru-green/5 text-rich-black text-xs font-bold py-3 rounded-xl transition-all duration-200 shadow-sm group/gbtn"
                >
                  {/* Google "G" SVG */}
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                  </svg>
                  <span className="group-hover/gbtn:text-zru-green transition-colors duration-200">Continue with Google</span>
                </button>
                {/* OR divider */}
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-black/10" />
                  <span className="text-[10px] text-black/40 font-medium uppercase tracking-wider">or join with email</span>
                  <div className="flex-1 h-px bg-black/10" />
                </div>
              </div>

              {/* Name + Email row — revealed on expand */}
              <div className="overflow-hidden opacity-0 max-h-0 transition-[opacity,max-height,margin] duration-500 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-28 group-hover/fzCard:mb-2.5 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-28 group-focus-within/fzCard:mb-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-black/5 text-rich-black px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-[#006B3F] text-sm placeholder:text-rich-black/40 transition-[border-color] duration-300"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-black/5 text-rich-black px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-[#006B3F] text-sm placeholder:text-rich-black/40 transition-[border-color] duration-300"
                  />
                </div>
              </div>

              {/* Team select + submit row */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2 w-full items-center justify-center group-hover/fzCard:justify-end group-focus-within/fzCard:justify-end transition-[justify-content] duration-500"
              >
                {/* Team select — revealed on expand */}
                <div className="w-0 opacity-0 max-w-0 overflow-hidden transition-[width,opacity,max-width] duration-500 ease-in-out group-hover/fzCard:w-full group-hover/fzCard:opacity-100 group-hover/fzCard:max-w-full group-focus-within/fzCard:w-full group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-w-full flex-1">
                  <select
                    value={favoriteTeam}
                    onChange={(e) => setFavoriteTeam(e.target.value as typeof favoriteTeam)}
                    className="w-full bg-black/5 text-rich-black px-4 py-3.5 rounded-xl border border-black/10 focus:outline-none focus:border-[#006B3F] text-sm transition-[border-color] duration-300 min-h-[46px]"
                  >
                    <option value="Sables">Zimbabwe Sables (Men&apos;s XV)</option>
                    <option value="Lady Sables">Lady Sables (Women&apos;s XV)</option>
                    <option value="Cheetahs">Cheetahs (7s)</option>
                    <option value="Junior Sables">Junior Sables (U20)</option>
                    <option value="Domestic Rugby">Domestic Club League</option>
                  </select>
                </div>

                {/* JOIN button — always visible */}
                <button
                  type="submit"
                  disabled={isSubmitting || !cdpaConsent}
                  id="fan-zone-join-btn"
                  className="group/btn bg-gradient-to-b from-zru-green to-[#005238] hover:from-[#00855B] hover:to-zru-green text-white px-8 py-3.5 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 font-black text-xs tracking-widest uppercase font-heading shrink-0 shadow-lg shadow-zru-green/30 min-h-[46px] w-full sm:w-auto disabled:opacity-50"
                >
                  <span>{isSubmitting ? "…" : "JOIN"}</span>
                  <ArrowRight className="w-0 opacity-0 -translate-x-2 transition-[width,opacity,transform] duration-300 ease-in-out group-hover/fzCard:w-4 group-hover/fzCard:opacity-100 group-hover/fzCard:translate-x-0 group-focus-within/fzCard:w-4 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:translate-x-0 shrink-0" />
                </button>
              </form>

              {/* Benefits grid — revealed on expand */}
              <div className="grid grid-cols-2 gap-2 py-3 opacity-0 max-h-0 overflow-hidden transition-[opacity,max-height] duration-500 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-40 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-40">
                {[
                  "Priority ticket presale",
                  "10% merch discount",
                  "Insider squad newsletter",
                  "VIP fan competitions",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-1.5 text-[10px] text-black/60">
                    <span className="w-1 h-1 rounded-full bg-zru-green shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* CDPA consent + footer — revealed on expand */}
              <div className="opacity-0 max-h-0 overflow-hidden transition-[opacity,max-height,margin] duration-500 mt-0 group-hover/fzCard:opacity-100 group-hover/fzCard:max-h-20 group-hover/fzCard:mt-3 group-focus-within/fzCard:opacity-100 group-focus-within/fzCard:max-h-20 group-focus-within/fzCard:mt-3">
                <div className="flex items-start gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="cdpa-banner"
                    checked={cdpaConsent}
                    onChange={(e) => setCdpaConsent(e.target.checked)}
                    className="mt-0.5 rounded border-black/20 text-zru-green focus:ring-zru-green focus:ring-offset-0"
                  />
                  <label htmlFor="cdpa-banner" className="text-[10px] text-black/50 leading-relaxed cursor-pointer">
                    I consent to ZRU news &amp; ticket alerts (
                    <Link href="/privacy-policy" className="text-zru-green underline hover:text-black transition-colors">
                      CDPA 2021
                    </Link>
                    ).
                  </label>
                </div>
                <div className="text-[10px] text-rich-black/40 flex items-center justify-between w-full">
                  <span>Priority tickets, discounts, and VIP access.</span>
                  <Link className="underline hover:text-zru-green transition-[color]" href="/fan-zone">
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
