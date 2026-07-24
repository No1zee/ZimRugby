"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ShieldCheck, Mail } from "lucide-react";

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
        background: "radial-gradient(circle at 50% 25%, #007A50 0%, #004D2C 60%, #002D1A 100%)",
      }}
    >
      {/* Stadium Pitch Grid Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Left Player Cutout */}
      <motion.div
        initial={{ opacity: 0, x: -120 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="absolute bottom-0 -left-6 sm:left-0 lg:left-8 w-44 sm:w-60 md:w-80 lg:w-96 h-auto pointer-events-none z-10 hidden md:block"
      >
        <Image
          src="/images/cutouts/3.svg"
          alt="Zimbabwe Rugby Cutout Left"
          width={380}
          height={500}
          className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          unoptimized
          priority
        />
      </motion.div>

      {/* Right Player Cutout */}
      <motion.div
        initial={{ opacity: 0, x: 120 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="absolute bottom-0 -right-6 sm:right-0 lg:right-8 w-44 sm:w-60 md:w-80 lg:w-96 h-auto pointer-events-none z-10 hidden md:block"
      >
        <Image
          src="/images/cutouts/1.svg"
          alt="Zimbabwe Rugby Cutout Right"
          width={380}
          height={500}
          className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          unoptimized
          priority
        />
      </motion.div>

      {/* Main Unified Content Container */}
      <div className="relative z-20 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-10">
        
        {/* Campaign Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-[#84d7af]" />
          <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase text-white font-heading">
            OFFICIAL CAMPAIGN • ROAD TO AUSTRALIA 2027
          </span>
        </div>

        {/* Section Headline */}
        <div className="space-y-2 max-w-3xl">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black uppercase italic tracking-tight text-white drop-shadow-md">
            RUGBY WORLD CUP QUALIFICATION
          </h2>
          <p className="text-white/80 text-xs sm:text-sm font-sans font-medium max-w-xl mx-auto">
            Follow the Sables&apos; campaign to Australia 2027. Get matchday ticket alerts, squad announcements &amp; fan dispatches.
          </p>
        </div>

        {/* Numeric Counter Grid */}
        <div className="grid grid-cols-4 gap-4 sm:gap-10 md:gap-14 max-w-2xl mx-auto">
          <div className="flex flex-col items-center bg-black/25 border border-white/15 backdrop-blur-md p-3 sm:p-5 rounded-2xl">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white">
              {String(timeLeft.days).padStart(3, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#84d7af] mt-1 font-heading">
              DAYS
            </span>
          </div>

          <div className="flex flex-col items-center bg-black/25 border border-white/15 backdrop-blur-md p-3 sm:p-5 rounded-2xl">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#84d7af] mt-1 font-heading">
              HOURS
            </span>
          </div>

          <div className="flex flex-col items-center bg-black/25 border border-white/15 backdrop-blur-md p-3 sm:p-5 rounded-2xl">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white">
              {String(timeLeft.mins).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#84d7af] mt-1 font-heading">
              MINS
            </span>
          </div>

          <div className="flex flex-col items-center bg-black/25 border border-white/15 backdrop-blur-md p-3 sm:p-5 rounded-2xl">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white">
              {String(timeLeft.secs).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#84d7af] mt-1 font-heading">
              SECS
            </span>
          </div>
        </div>

        {/* Absorbed "Stay Connected With The Sables" Dispatch Form Block */}
        <div className="w-full max-w-xl bg-black/30 border border-white/20 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#84d7af]">
            <Mail className="w-4 h-4" />
            <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-white">
              STAY CONNECTED WITH THE SABLES
            </h3>
          </div>

          {subscribed ? (
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center gap-3 text-white">
              <CheckCircle className="w-5 h-5 text-[#84d7af]" />
              <span className="font-heading text-xs font-extrabold uppercase tracking-wider">
                Dispatch Confirmed — You Are In
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email for campaign alerts..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-xs font-sans focus:outline-none focus:border-[#84d7af]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#006747] hover:bg-[#84d7af] text-white hover:text-[#003822] font-extrabold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shrink-0 shadow-lg"
              >
                <span>JOIN DISPATCH</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="flex items-center justify-between text-[10px] text-white/60 pt-1">
            <span>Zero spam. Unsubscribe anytime.</span>
            <Link href="/privacy-policy" className="hover:text-[#84d7af] underline">
              CDPA 2021 Compliant
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
