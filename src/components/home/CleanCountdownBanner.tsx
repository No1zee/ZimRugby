"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ShieldCheck, Mail, Trophy, Radio } from "lucide-react";

export default function CleanCountdownBanner() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 354,
    hours: 14,
    mins: 32,
    secs: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2027-10-01T20:00:00").getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
          secs: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section
      className="py-16 sm:py-20 text-white border-y border-white/10 relative overflow-hidden select-none"
      style={{
        background: "radial-gradient(circle at 50% 30%, #007A50 0%, #004D2C 60%, #002D1A 100%)",
      }}
    >
      {/* Stadium Pitch Markings & Diagonal Brand Stripe Motif */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)",
          backgroundSize: "40px 40px"
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

      {/* Left Player Cutout (Framing the Left Flank on All Screens) */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 -left-8 sm:left-0 lg:left-4 w-36 sm:w-56 md:w-72 lg:w-96 h-auto pointer-events-none z-10 block"
      >
        <Image
          src="/images/cutouts/3.svg"
          alt="Zimbabwe Rugby Celebration Left"
          width={400}
          height={520}
          className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
          unoptimized
          priority
        />
      </motion.div>

      {/* Right Player Cutout (Framing the Right Flank on All Screens) */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 -right-8 sm:right-0 lg:right-4 w-36 sm:w-56 md:w-72 lg:w-96 h-auto pointer-events-none z-10 block"
      >
        <Image
          src="/images/cutouts/1.svg"
          alt="Zimbabwe Rugby Celebration Right"
          width={400}
          height={520}
          className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
          unoptimized
          priority
        />
      </motion.div>

      {/* Main 2-Column Split Stage Container */}
      <div className="relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: World Cup Campaign Header & 4-Digit Live Timer */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Headline */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black uppercase italic tracking-tight text-white drop-shadow-md leading-none">
                RUGBY WORLD CUP QUALIFICATION
              </h2>
              <p className="text-white/80 text-xs sm:text-sm font-sans font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Follow the Sables&apos; journey to Australia 2027. Track qualification countdowns, squad releases &amp; matchday ticket priority.
              </p>
            </div>

            {/* Clean Digital Counter Grid */}
            <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto lg:mx-0 pt-2">
              <div className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-black/30 border border-white/15 backdrop-blur-md shadow-xl">
                <span className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white">
                  {String(timeLeft.days).padStart(3, "0")}
                </span>
                <span className="text-[9px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#84d7af] mt-1 font-heading">
                  DAYS
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-black/30 border border-white/15 backdrop-blur-md shadow-xl">
                <span className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#84d7af] mt-1 font-heading">
                  HOURS
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-black/30 border border-white/15 backdrop-blur-md shadow-xl">
                <span className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white">
                  {String(timeLeft.mins).padStart(2, "0")}
                </span>
                <span className="text-[9px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#84d7af] mt-1 font-heading">
                  MINS
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-black/30 border border-white/15 backdrop-blur-md shadow-xl">
                <span className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white">
                  {String(timeLeft.secs).padStart(2, "0")}
                </span>
                <span className="text-[9px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#84d7af] mt-1 font-heading">
                  SECS
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Contrast Milk White Glass Dispatch Card */}
          <div className="lg:col-span-5 bg-white text-black rounded-3xl p-6 sm:p-8 border border-black/10 shadow-2xl space-y-5 relative z-20">
            
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#006747]/10 border border-[#006747]/20">
                <Mail className="w-3.5 h-3.5 text-[#006747]" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#006747] font-heading">
                  SABLES DISPATCH PASS
                </span>
              </div>

              <h3 className="heading-2 text-black tracking-tight uppercase italic">
                STAY CONNECTED WITH THE SABLES
              </h3>

              <p className="text-black/70 text-xs font-sans font-medium leading-relaxed">
                Receive inner-sanctum squad announcements, ticket presale alerts, and match highlights delivered straight to your inbox.
              </p>
            </div>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-[#006747]/10 border border-[#006747]/30 flex items-center gap-3 text-[#006747]">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <h4 className="font-heading text-xs font-extrabold uppercase tracking-wide">
                    Dispatch Access Confirmed
                  </h4>
                  <p className="text-[11px] text-black/70 font-sans mt-0.5">
                    You are subscribed to official ZRU Sables campaign dispatches.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-milk-white border border-black/15 text-black placeholder:text-black/40 text-xs font-sans focus:outline-none focus:border-[#006747] shadow-inner font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#006747] hover:bg-[#004d35] text-white font-heading font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#006747]/20"
                >
                  <span>JOIN SABLES DISPATCH</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[10px] text-black/50 font-sans font-medium">
              <span>Zero spam. Unsubscribe anytime.</span>
              <Link href="/privacy-policy" className="hover:text-[#006747] underline">
                CDPA 2021 Compliant
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
