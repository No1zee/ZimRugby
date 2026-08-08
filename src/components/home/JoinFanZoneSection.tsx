"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Ticket,
  ShieldCheck,
  Zap,
  Users,
  Trophy,
  Gift,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signUpFan } from "@/lib/supabase/auth";

/* ─────────────────────────────────────────────
   Floating orb — purely decorative CSS motion
   ───────────────────────────────────────────── */
function Orb({ className }: { className: string }) {
  return <div className={`absolute rounded-full pointer-events-none ${className}`} />;
}

/* ─────────────────────────────────────────────
   Benefit pill with staggered entrance
   ───────────────────────────────────────────── */
const BENEFITS = [
  { icon: Ticket,    label: "Priority Ticket Alerts",        delay: 0   },
  { icon: Gift,      label: "10% Off Official Merchandise",  delay: 80  },
  { icon: Trophy,    label: "Exclusive Match Reports",        delay: 160 },
  { icon: Zap,       label: "Live Score Notifications",       delay: 240 },
  { icon: ShieldCheck, label: "CDPA 2021 Compliant",        delay: 320 },
  { icon: Users,     label: "ZRU Community Access",          delay: 400 },
];

function BenefitPill({
  icon: Icon,
  label,
  delay,
  visible,
}: {
  icon: React.ElementType;
  label: string;
  delay: number;
  visible: boolean;
}) {
  return (
    <div
      className="flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-2 text-white/80 text-xs font-medium backdrop-blur-sm transition-all duration-700 hover:bg-white/15 hover:border-[#006B3F]/60 hover:text-white group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <Icon className="w-3.5 h-3.5 text-[#00C46A] group-hover:scale-110 transition-transform duration-200" />
      {label}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Animated stat counter
   ───────────────────────────────────────────── */
function StatCounter({
  value,
  suffix,
  label,
  visible,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  visible: boolean;
  delay: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const duration = 1400;
    const step = value / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, value);
      setCount(Math.floor(current));
      if (current >= value) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, value]);

  return (
    <div
      className="text-center transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading tabular-nums">
        {count.toLocaleString()}
        <span className="text-[#00C46A]">{suffix}</span>
      </div>
      <div className="text-[11px] uppercase tracking-widest text-white/50 mt-1 font-medium">
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */
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

  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  /* Intersection observer — trigger entrance animations */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24 sm:py-32"
      style={{ background: "linear-gradient(160deg, #001D0E 0%, #003320 45%, #001A0C 100%)" }}
      aria-labelledby="fan-zone-heading"
    >
      {/* ── Ambient orbs ── */}
      <Orb className="w-[600px] h-[600px] -top-48 -left-32 bg-[#006B3F]/20 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
      <Orb className="w-[400px] h-[400px] -bottom-32 -right-24 bg-[#004D2C]/25 blur-[100px] animate-[pulse_6s_ease-in-out_infinite_2s]" />
      <Orb className="w-[200px] h-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00C46A]/8 blur-[80px] animate-[pulse_10s_ease-in-out_infinite_1s]" />

      {/* ── Grid texture overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Top label ── */}
        <div
          className="flex justify-center mb-6 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-12px)" }}
        >
          <span className="inline-flex items-center gap-2 bg-[#006B3F]/30 border border-[#00C46A]/30 rounded-full px-5 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#00C46A]">
            <Star className="w-3 h-3 fill-current" />
            Official Sables Fan Zone
            <Star className="w-3 h-3 fill-current" />
          </span>
        </div>

        {/* ── Heading ── */}
        <div className="text-center mb-4">
          <h2
            id="fan-zone-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-heading leading-none transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "100ms",
            }}
          >
            JOIN THE{" "}
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: "2px #00C46A",
                textShadow: "0 0 40px rgba(0,196,106,0.3)",
              }}
            >
              FAN ZONE
            </span>
          </h2>
          <p
            className="mt-4 text-sm sm:text-base text-white/60 max-w-xl mx-auto font-sans leading-relaxed transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transitionDelay: "180ms",
            }}
          >
            Become part of the official Zimbabwe Rugby community. Get priority access,
            exclusive content, and merch discounts — free forever.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div
          className="flex justify-center gap-12 sm:gap-20 mb-14 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transitionDelay: "240ms",
          }}
        >
          <StatCounter value={12400} suffix="+" label="Registered Fans"  visible={visible} delay={260} />
          <StatCounter value={5}     suffix=" Teams" label="Teams Covered" visible={visible} delay={340} />
          <StatCounter value={100}   suffix="% Free" label="Always Free"   visible={visible} delay={420} />
        </div>

        {/* ── Two-column layout: benefits + form ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start max-w-5xl mx-auto">

          {/* LEFT — benefits */}
          <div
            className="transition-all duration-700 space-y-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-30px)",
              transitionDelay: "300ms",
            }}
          >
            <h3 className="text-xl font-black uppercase tracking-widest text-white font-heading">
              What You Get
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {BENEFITS.map((b) => (
                <BenefitPill key={b.label} {...b} visible={visible} />
              ))}
            </div>

            {/* Decorative ZRU badge */}
            <div className="mt-8 flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
              <div
                className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xl text-white border-2 border-[#006B3F]"
                style={{ background: "radial-gradient(circle, #006B3F, #003820)" }}
              >
                ZRU
              </div>
              <div>
                <div className="text-white font-bold text-sm">Official Zimbabwe Rugby Union</div>
                <div className="text-white/50 text-xs mt-0.5">
                  Your data is protected under CDPA 2021. Unsubscribe anytime.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — form or logged-in state */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transitionDelay: "380ms",
            }}
          >
            {/* Already logged in */}
            {isAuthenticated && user ? (
              <div className="rounded-3xl p-8 border border-[#006B3F]/40 bg-[#002D1A]/60 backdrop-blur-sm space-y-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl text-white border-2 border-[#006B3F]"
                    style={{ background: "radial-gradient(circle, #006B3F, #003820)" }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{user.name}</h3>
                    <p className="text-xs text-white/50 font-mono">{user.email}</p>
                    <span className="inline-block mt-1 text-[11px] text-[#00C46A] font-semibold">
                      ✓ Active Fan Zone Member
                    </span>
                  </div>
                </div>
                <p className="text-sm text-white/60">
                  You&apos;re all set! Check out your exclusive member benefits below.
                </p>
                <Link
                  href="/fan-zone"
                  className="inline-flex items-center gap-2 bg-[#006B3F] hover:bg-[#007A48] text-white font-black uppercase tracking-widest text-xs px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#006B3F]/30"
                  style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                >
                  Go to Fan Zone Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : submitted ? (
              /* Success state */
              <div className="rounded-3xl p-8 border border-[#006B3F]/50 bg-[#002D1A]/60 backdrop-blur-sm text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#006B3F]/20 border-2 border-[#00C46A] flex items-center justify-center mx-auto">
                  <Trophy className="w-7 h-7 text-[#00C46A]" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest font-heading">
                  You&apos;re In!
                </h3>
                <p className="text-sm text-white/60">
                  Welcome to the official Sables Fan Zone. Check your email for your VIP pass.
                </p>
                <Link
                  href="/fan-zone"
                  className="inline-flex items-center gap-2 bg-[#006B3F] hover:bg-[#007A48] text-white font-black uppercase tracking-widest text-xs px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#006B3F]/30"
                >
                  Visit Fan Zone <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              /* Registration form */
              <div
                className="rounded-3xl border border-white/10 overflow-hidden backdrop-blur-sm"
                style={{ background: "radial-gradient(circle at 60% 0%, rgba(0,107,63,0.25) 0%, rgba(0,26,12,0.8) 60%)" }}
              >
                {/* Form header bar */}
                <div className="px-7 pt-7 pb-4 border-b border-white/8">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00C46A] mb-1">
                    Fan Registration
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider font-heading">
                    Create Your Free Account
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4" noValidate>
                  {error && (
                    <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Farai Moyo"
                        required
                        className="w-full bg-black/40 border border-white/12 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F]/40 transition-all duration-200 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="farai@example.co.zw"
                        required
                        className="w-full bg-black/40 border border-white/12 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F]/40 transition-all duration-200 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-1.5">
                      Favourite Team
                    </label>
                    <select
                      value={favoriteTeam}
                      onChange={(e) => setFavoriteTeam(e.target.value as typeof favoriteTeam)}
                      className="w-full bg-black/40 border border-white/12 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#006B3F] transition-all duration-200 font-sans"
                    >
                      <option value="Sables">Zimbabwe Sables (Men&apos;s XV)</option>
                      <option value="Lady Sables">Lady Sables (Women&apos;s XV)</option>
                      <option value="Cheetahs">Zimbabwe Cheetahs (7s)</option>
                      <option value="Junior Sables">Junior Sables (U20)</option>
                      <option value="Domestic Rugby">Domestic Club League</option>
                    </select>
                  </div>

                  <div className="flex items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="cdpa-fanzone"
                      checked={cdpaConsent}
                      onChange={(e) => setCdpaConsent(e.target.checked)}
                      required
                      className="mt-0.5 rounded bg-black/40 border-white/20 text-[#006B3F] focus:ring-[#006B3F] focus:ring-offset-0"
                    />
                    <label htmlFor="cdpa-fanzone" className="text-[11px] text-white/55 leading-relaxed cursor-pointer">
                      I consent to receive ZRU news, fixture alerts, and exclusive fan content.
                      Protected under{" "}
                      <Link href="/privacy-policy" className="text-[#00C46A] underline hover:text-white transition-colors">
                        CDPA 2021
                      </Link>
                      .
                    </label>
                  </div>

                  {/* CTA button — slanted ZRU style */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !cdpaConsent}
                    id="fan-zone-join-btn"
                    className="group relative w-full py-4 text-white font-heading font-black tracking-widest uppercase text-sm overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #006B3F 0%, #008F53 50%, #006B3F 100%)",
                      clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
                      boxShadow: "0 8px 32px rgba(0,107,63,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                  >
                    {/* Shimmer sweep on hover */}
                    <span
                      className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
                    />
                    <span className="relative flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Join Fan Zone — It&apos;s Free</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                      )}
                    </span>
                  </button>

                  <p className="text-center text-[10px] text-white/35 pt-1">
                    Already a member?{" "}
                    <Link href="/login" className="text-[#00C46A] hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
