"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   HomeNewsletterBanner — Supercharged Option 2 Uiverse Interactive Container
   Refined Premium Colors, Soft Ambient Glow Frame & Motion Effects
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
        
        {/* Supercharged Option 2 Card Container with Hover & Motion Effects */}
        <div
          className="group/uiverseCard rounded-3xl p-6 sm:p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative overflow-hidden shadow-2xl transition-all duration-500 ease-in-out hover:scale-[1.01] active:scale-[0.99] touch-manipulation cursor-pointer border border-white/10"
          style={{
            background: "radial-gradient(circle at 50% 25%, #0A1C15 0%, #00331F 60%, #001A10 100%)",
          }}
        >
          {/* Soft, Subtle Premium Ambient Inner Glow Frame */}
          <div className="absolute inset-0 border border-white/10 group-hover/uiverseCard:border-[#006747]/60 group-focus-within/uiverseCard:border-[#006747]/60 group-hover/uiverseCard:shadow-[inset_0_0_50px_rgba(0,103,71,0.35)] transition-all duration-700 pointer-events-none rounded-3xl" />

          {/* Subtle Animated Light Trail Gradient Sweep */}
          <div className="absolute inset-0 opacity-0 group-hover/uiverseCard:opacity-15 group-focus-within/uiverseCard:opacity-15 pointer-events-none bg-gradient-to-r from-transparent via-[#34D399] to-transparent transition-opacity duration-700" />

          {/* Left Group: Logo & Headlines */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10 w-full lg:w-3/5">
            
            {/* ZRU Emblem Box (Scales Emblem Larger on Hover) */}
            <div className="relative flex items-center shrink-0">
              <div className="h-[64px] w-[64px] rounded-2xl bg-black/50 border border-white/15 p-2 flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out group-hover/uiverseCard:border-[#006747] group-hover/uiverseCard:shadow-[0_8px_25px_rgba(0,103,71,0.5)] group-focus-within/uiverseCard:border-[#006747]">
                
                {/* ZRU Crest Logo */}
                <Image
                  src="/images/logos/zru-logo.svg"
                  alt="ZRU Crest"
                  width={44}
                  height={44}
                  className="object-contain filter drop-shadow-md transition-transform duration-500 group-hover/uiverseCard:scale-125"
                />
              </div>
            </div>

            {/* Headline & Paragraph with Dynamic Letter-Spacing Transition */}
            <div className="space-y-2">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl text-white font-heading font-black uppercase tracking-tight transition-all duration-500 group-hover/uiverseCard:tracking-widest"
              >
                JOIN THE FAN ZONE
              </h2>
              <p className="text-xs sm:text-sm text-white/80 max-w-lg font-medium leading-relaxed transition-all duration-500 group-hover/uiverseCard:text-white font-sans">
                Subscribe to our official newsletter and be the first to receive match ticket drops, Sable squad announcements, and inner-sanctum updates.
              </p>
            </div>

          </div>

          {/* Right Group: Subscription Form Pill Container */}
          <div className="relative z-10 w-full lg:w-2/5 flex flex-col lg:items-end">
            <div className="w-full max-w-md bg-black/40 backdrop-blur-md p-5 sm:p-7 rounded-2xl border border-white/10 group-hover/uiverseCard:border-[#006747]/60 group-focus-within/uiverseCard:border-[#006747]/60 transition-all duration-500">
              
              <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-3 font-heading">
                ENTER YOUR EMAIL BELOW
              </p>
              
              {subscribed ? (
                <div className="bg-[#006747]/30 text-white p-4 rounded-xl border border-[#006747]/50 text-sm font-semibold flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#34D399] shrink-0" />
                  <span>Welcome to the Zimbabwe Rugby Fan Zone!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-white/5 text-white px-4 py-3.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#006747] text-sm placeholder:text-white/40 transition-all min-h-[46px]"
                  />
                  <button
                    type="submit"
                    className="group/btn bg-gradient-to-b from-[#00704D] to-[#005238] hover:from-[#00855B] hover:to-[#006747] text-white px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-black text-xs tracking-widest uppercase font-heading shrink-0 shadow-lg shadow-[#006747]/30 min-h-[46px]"
                  >
                    <span>SUBSCRIBE</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </form>
              )}

              <p className="text-[10px] text-white/40 mt-3.5 font-medium">
                By subscribing you agree to our{" "}
                <Link className="underline hover:text-white" href="/privacy-policy">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
