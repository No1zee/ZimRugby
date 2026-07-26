"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   HomeNewsletterBanner — Interactive Hover Reveal Form
   - Default: Only the SUBSCRIBE button is visible in right side
   - On Hover: Email input, arrow icon, input title & privacy terms reveal smoothly
   - Un-boxed ZRU emblem grows & centers in 1/3 section
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
          <div className="absolute inset-0 opacity-0 group-hover/uiverseCard:opacity-20 group-focus-within/uiverseCard:opacity-20 pointer-events-none bg-gradient-to-r from-transparent via-[#006747] to-transparent transition-opacity duration-700" />

          {/* Left Group: Un-boxed Emblem (Centers & Grows to 1/3 on hover) + Disappearing Text */}
          <div className="flex items-center justify-start lg:group-hover/uiverseCard:justify-center lg:group-focus-within/uiverseCard:justify-center gap-6 relative z-10 lg:w-3/5 lg:group-hover/uiverseCard:w-1/3 lg:group-focus-within/uiverseCard:w-1/3 transition-all duration-500 shrink-0">
            
            {/* Un-boxed ZRU Crest Emblem (No outer square box, centers and scales up on hover) */}
            <div className="relative shrink-0 flex items-center justify-center transition-all duration-500 group-hover/uiverseCard:scale-175 sm:group-hover/uiverseCard:scale-200">
              <Image
                src="/images/logos/zru-logo.svg"
                alt="ZRU Emblem"
                width={72}
                height={72}
                className="w-16 sm:w-20 h-16 sm:h-20 object-contain filter drop-shadow-[0_4px_30px_rgba(0,103,71,0.85)] group-hover/uiverseCard:drop-shadow-[0_8px_35px_rgba(52,211,153,0.6)] transition-all duration-500"
              />
            </div>

            {/* Headline & Paragraph — Fades out and collapses on hover */}
            <div className="space-y-1.5 transition-all duration-500 origin-left max-w-lg opacity-100 group-hover/uiverseCard:opacity-0 group-hover/uiverseCard:max-w-0 group-hover/uiverseCard:scale-95 group-hover/uiverseCard:overflow-hidden group-focus-within/uiverseCard:opacity-0 group-focus-within/uiverseCard:max-w-0 group-focus-within/uiverseCard:scale-95 group-focus-within/uiverseCard:overflow-hidden shrink">
              <h2 className="text-2xl sm:text-3xl text-white font-heading font-black uppercase tracking-tight whitespace-nowrap">
                JOIN THE FAN ZONE
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed font-body line-clamp-2">
                Subscribe to our official newsletter and be the first to receive match ticket drops, Sable squad announcements, and inner-sanctum updates.
              </p>
            </div>

          </div>

          {/* Right Group: Subscription Form Container — Default compact SUBSCRIBE button, expands on hover */}
          <div className="relative z-10 w-full lg:w-auto lg:group-hover/uiverseCard:w-2/3 lg:group-focus-within/uiverseCard:w-2/3 flex flex-col items-center lg:items-end transition-all duration-500">
            <div className="w-full lg:w-auto lg:group-hover/uiverseCard:w-full lg:group-focus-within/uiverseCard:w-full bg-white p-3 group-hover/uiverseCard:p-5 sm:group-hover/uiverseCard:p-7 group-focus-within/uiverseCard:p-5 sm:group-focus-within/uiverseCard:p-7 rounded-2xl border border-black/5 group-hover/uiverseCard:border-[#006747]/60 group-focus-within/uiverseCard:border-[#006747]/60 transition-all duration-500 ease-in-out shadow-lg">
              
              {/* Header Label — Hidden before hover */}
              <p className="text-[#003822]/70 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-500 opacity-0 max-h-0 overflow-hidden mb-0 group-hover/uiverseCard:opacity-100 group-hover/uiverseCard:max-h-10 group-hover/uiverseCard:mb-3 group-hover/uiverseCard:text-[#006747] group-focus-within/uiverseCard:opacity-100 group-focus-within/uiverseCard:max-h-10 group-focus-within/uiverseCard:mb-3 group-focus-within/uiverseCard:text-[#006747]">
                ENTER YOUR EMAIL BELOW TO JOIN THE FAN ZONE
              </p>
              
              {subscribed ? (
                <div className="bg-[#006747]/10 text-[#0E0E0E] p-4 rounded-xl border border-[#006747]/20 text-sm font-bold flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#006747] shrink-0" />
                  <span>Welcome to the Zimbabwe Rugby Fan Zone!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full items-center justify-end">
                  {/* Email Input Field — Hidden before hover */}
                  <div className="w-0 opacity-0 max-w-0 overflow-hidden transition-all duration-500 ease-in-out group-hover/uiverseCard:w-full group-hover/uiverseCard:opacity-100 group-hover/uiverseCard:max-w-full group-focus-within/uiverseCard:w-full group-focus-within/uiverseCard:opacity-100 group-focus-within/uiverseCard:max-w-full flex-1">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-black/5 text-[#0E0E0E] px-4 py-3.5 rounded-xl border border-black/10 focus:outline-none focus:border-[#006747] text-sm placeholder:text-[#0E0E0E]/40 transition-all min-h-[46px]"
                    />
                  </div>

                  {/* Subscribe Button — Always visible; Arrow reveals on hover */}
                  <button
                    type="submit"
                    className="group/btn bg-gradient-to-b from-[#00704D] to-[#005238] hover:from-[#00855B] hover:to-[#006747] text-white px-8 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-black text-xs tracking-widest uppercase font-heading shrink-0 shadow-lg shadow-[#006747]/30 min-h-[46px] w-full sm:w-auto"
                  >
                    <span>SUBSCRIBE</span>
                    {/* Arrow Icon — Hidden before hover */}
                    <ArrowRight className="w-0 opacity-0 -translate-x-2 transition-all duration-300 ease-in-out group-hover/uiverseCard:w-4 group-hover/uiverseCard:opacity-100 group-hover/uiverseCard:translate-x-0 group-focus-within/uiverseCard:w-4 group-focus-within/uiverseCard:opacity-100 group-focus-within/uiverseCard:translate-x-0 shrink-0" />
                  </button>
                </form>
              )}

              {/* Privacy Footer — Hidden before hover */}
              <div className="text-[10px] text-[#0E0E0E]/40 font-normal transition-all duration-500 opacity-0 max-h-0 overflow-hidden mt-0 group-hover/uiverseCard:opacity-100 group-hover/uiverseCard:max-h-10 group-hover/uiverseCard:mt-3.5 group-focus-within/uiverseCard:opacity-100 group-focus-within/uiverseCard:max-h-10 group-focus-within/uiverseCard:mt-3.5 flex items-center justify-between w-full">
                <span>Zero spam. Unsubscribe at any time.</span>
                <Link className="underline hover:text-[#006747] transition-colors" href="/privacy-policy">
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
