"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight, ShieldCheck, LogOut, Ticket, Award } from "lucide-react";
import { getFanSession, saveFanSession, clearFanSession, subscribeFanSession, FanSession } from "@/lib/fanzone/fanSession";

interface FanZoneSignupProps {
  variant?: "compact" | "full";
  showBenefits?: boolean;
}

export default function FanZoneSignup({
  variant = "compact",
  showBenefits = false,
}: FanZoneSignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [favoriteTeam, setFavoriteTeam] = useState<"Sables" | "Lady Sables" | "Cheetahs" | "Junior Sables" | "Domestic Rugby">("Sables");
  const [cdpaConsent, setCdpaConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [activeSession, setActiveSession] = useState<FanSession | null>(null);

  useEffect(() => {
    setActiveSession(getFanSession());
    const unsubscribe = subscribeFanSession(() => {
      setActiveSession(getFanSession());
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/fan-zone/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          favoriteTeam,
          cdpaConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      const sessionData: FanSession = {
        name: name.trim(),
        email: email.trim(),
        favoriteTeam,
        vipCode: data.vipBadge?.code || "SABLES2027",
        registeredAt: new Date().toISOString(),
      };

      saveFanSession(sessionData);
      setActiveSession(sessionData);
      setEmail("");
      setName("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    clearFanSession();
    setActiveSession(null);
  };

  // If Fan is already registered/authenticated
  if (activeSession) {
    return (
      <div
        className="rounded-3xl p-6 sm:p-10 text-center space-y-6 border border-white/10 shadow-2xl relative overflow-hidden select-none"
        style={{
          background: "radial-gradient(circle at 50% 25%, #006747 0%, #004D34 60%, #003322 100%)",
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-emerald-300 text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ACTIVE VIP MEMBER SESSION</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-heading">
            WELCOME BACK, {activeSession.name.toUpperCase()}!
          </h2>
          <p className="text-xs text-white/70">
            Your VIP Sables Fan Zone Membership is active. Supporter Team: <span className="text-emerald-300 font-bold">{activeSession.favoriteTeam}</span>
          </p>
        </div>

        {/* Digital VIP Pass Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl max-w-md mx-auto space-y-3 text-white shadow-xl relative">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              VIP MEMBER PASS
            </span>
            <span className="text-[10px] font-mono text-white/60">{activeSession.email}</span>
          </div>

          <div className="py-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 block">Your Exclusive Voucher Code</span>
            <div className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-emerald-300 my-1">
              {activeSession.vipCode}
            </div>
            <span className="text-[11px] text-white/80 font-bold uppercase tracking-wider">10% OFF OFFICIAL MERCHANDISE & MATCHDAY TICKETS</span>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
            <Link href="/tickets" className="text-emerald-300 hover:underline font-bold flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5" />
              <span>BUY TICKETS WITH DISCOUNT →</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="text-white/50 hover:text-red-300 text-[10px] uppercase font-bold flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>SIGN OUT</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard Guest Registration Form
  return (
    <div
      className="rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden select-none"
      style={{
        background: "radial-gradient(circle at 50% 25%, #006747 0%, #004D34 60%, #003322 100%)",
      }}
    >
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300 block">
            OFFICIAL FAN ZONE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-heading">
            JOIN THE SABLES FAN ZONE
          </h2>
          <p className="text-xs text-white/70 max-w-md mx-auto">
            Get 10% off official merchandise, priority ticket alerts, and exclusive Sables match updates.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Farai Moyo"
              required
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 font-sans"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farai@example.co.zw"
              required
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">
              Favorite Rugby Team
            </label>
            <select
              value={favoriteTeam}
              onChange={(e: any) => setFavoriteTeam(e.target.value)}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 font-sans"
            >
              <option value="Sables">Sables Men's XV</option>
              <option value="Lady Sables">Lady Sables Women's XV</option>
              <option value="Cheetahs">Cheetahs Sevens</option>
              <option value="Junior Sables">Junior Sables (U20)</option>
              <option value="Domestic Rugby">Domestic Club League</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="cdpaConsent"
              checked={cdpaConsent}
              onChange={(e) => setCdpaConsent(e.target.checked)}
              required
              className="rounded bg-black/40 border-white/20 text-emerald-500 focus:ring-emerald-400"
            />
            <label htmlFor="cdpaConsent" className="text-[11px] text-white/70">
              I agree to receive ZRU news & ticket alerts (CDPA 2021 Compliant).
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#00A85A] hover:bg-[#00B963] active:bg-[#008F4C] text-white font-heading font-black tracking-widest uppercase text-sm rounded-xl transition-all shadow-lg shadow-[#00A85A]/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>GENERATING VIP PASS...</span>
            ) : (
              <>
                <span>JOIN FAN ZONE & GET VIP PASS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
