"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   HomeNewsletterBanner — Vacuum-Filling Interactive Hover Motion
   Text disappears on hover; Logo & Email Input expand to cover the stage
   ═══════════════════════════════════════════════════════════════════ */

export default function HomeNewsletterBanner() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="w-full bg-milk-white py-8 sm:py-12 lg:py-16 relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Interactive Uiverse Card Container */}
        <div
          className="group/uiverseCard rounded-3xl p-6 sm:p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 relative overflow-hidden shadow-2xl transition-all duration-500 ease-in-out hover:scale-[1.01] active:scale-[0.99] touch-manipulation cursor-pointer border border-white/10"
          style={{
            background: "radial-gradient(circle at 50% 25%, #0A1C15 0%, #00331F 60%, #001A10 100%)",
          }}
        >
          {/* Soft Premium Ambient Inner Glow Frame */}
          <div className="absolute inset-0 border border-white/10 group-hover/uiverseCard:border-[#006747]/60 group-focus-within/uiverseCard:border-[#006747]/60 group-hover/uiverseCard:shadow-[inset_0_0_60px_rgba(0,103,71,0.4)] transition-all duration-700 pointer-events-none rounded-3xl" />

          {/* Subtle Animated Light Trail Gradient Sweep */}
          <div className="absolute inset-0 opacity-0 group-hover/uiverseCard:opacity-20 group-focus-within/uiverseCard:opacity-20 pointer-events-none bg-gradient-to-r from-transparent via-[#34D399] to-transparent transition-opacity duration-700" />

          {/* Left Group: ZRU Logo + Disappearing Text Container */}
          <div className="flex items-center gap-6 relative z-10 shrink-0">
            
            {/* ZRU Crest Logo (Scales & Glows on Hover) */}
            <div className="relative flex items-center shrink-0">
              <div className="h-[64px] w-[64px] sm:h-[72px] sm:w-[72px] rounded-2xl bg-black/50 border border-white/15 p-2.5 flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out group-hover/uiverseCard:border-[#006747] group-hover/uiverseCard:scale-110 group-hover/uiverseCard:shadow-[0_8px_25px_rgba(0,103,71,0.5)]">
                <Image
                  src="/images/logos/zru-logo.svg"
                  alt="ZRU Crest"
                  width={48}
                  height={48}
                  className="object-contain filter drop-shadow-md transition-transform duration-500 group-hover/uiverseCard:scale-125"
                />
              </div>
            </div>

            {/* Headline & Paragraph — Fades out and collapses on hover to create vacuum */}
            <div className="space-y-1.5 transition-all duration-500 origin-left max-w-lg opacity-100 group-hover/uiverseCard:opacity-0 group-hover/uiverseCard:max-w-0 group-hover/uiverseCard:scale-95 group-hover/uiverseCard:overflow-hidden group-focus-within/uiverseCard:opacity-0 group-focus-within/uiverseCard:max-w-0 group-focus-within/uiverseCard:scale-95 group-focus-within/uiverseCard:overflow-hidden shrink">
              <h2 className="text-2xl sm:text-3xl text-white font-heading font-black uppercase tracking-tight whitespace-nowrap">
                JOIN THE FAN ZONE
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed font-sans line-clamp-2">
                Subscribe to our official newsletter and be the first to receive match ticket drops, Sable squad announcements, and inner-sanctum updates.
              </p>
            </div>

          </div>

          {/* Right Group: Subscription Form Container — Expands to fill the vacuum on hover */}
          <div className="relative z-10 w-full flex-1 flex flex-col items-center lg:items-end transition-all duration-500">
            <div className="w-full max-w-md lg:group-hover/uiverseCard:max-w-3xl lg:group-focus-within/uiverseCard:max-w-3xl bg-black/40 backdrop-blur-md p-5 sm:p-7 rounded-2xl border border-white/10 group-hover/uiverseCard:border-[#006747]/60 group-focus-within/uiverseCard:border-[#006747]/60 transition-all duration-500 ease-in-out shadow-lg">
              
              <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-3 font-heading transition-colors group-hover/uiverseCard:text-[#34D399]">
                ENTER YOUR EMAIL BELOW TO JOIN THE FAN ZONE
              </p>
              
              {subscribed ? (
                <div className="bg-[#006747]/30 text-white p-4 rounded-xl border border-[#006747]/50 text-sm font-semibold flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#34D399] shrink-0" />
                  <span>Welcome to the Zimbabwe Rugby Fan Zone!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-white/5 text-white px-4 py-3.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#006747] text-sm placeholder:text-white/40 transition-all min-h-[46px] flex-1"
                  />
                  <button
                    type="submit"
                    className="group/btn bg-gradient-to-b from-[#00704D] to-[#005238] hover:from-[#00855B] hover:to-[#006747] text-white px-8 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-black text-xs tracking-widest uppercase font-heading shrink-0 shadow-lg shadow-[#006747]/30 min-h-[46px]"
                  >
                    <span>SUBSCRIBE</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </form>
              )}

              <div className="mt-3.5 flex items-center justify-between text-[10px] text-white/40 font-medium">
                <span>Zero spam. Unsubscribe at any time.</span>
                <Link className="underline hover:text-white transition-colors" href="/privacy-policy">
                  CDPA 2021 Compliant
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
