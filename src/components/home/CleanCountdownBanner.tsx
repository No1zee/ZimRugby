"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function CleanCountdownBanner() {
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

  return (
    <section className="py-16 sm:py-20 bg-zru-green text-white border-y border-white/10 relative overflow-hidden select-none">
      
      {/* Stadium Pitch Line Markings & Diagonal Stripe Brand Motif */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)",
          backgroundSize: "40px 40px"
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)] pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8">
        
        {/* Section Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
          <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase text-white font-heading">
            OFFICIAL CAMPAIGN • ROAD TO AUSTRALIA 2027
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black uppercase italic tracking-tight text-white drop-shadow-md">
          RUGBY WORLD CUP QUALIFICATION
        </h2>

        {/* Large Prominent Stat Digital Block Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full max-w-3xl mx-auto pt-2">
          
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-black/25 border border-white/15 backdrop-blur-md shadow-xl">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-white">
              {String(timeLeft.days).padStart(3, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#84d7af] mt-2 font-heading">
              DAYS
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-black/25 border border-white/15 backdrop-blur-md shadow-xl">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-white">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#84d7af] mt-2 font-heading">
              HOURS
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-black/25 border border-white/15 backdrop-blur-md shadow-xl">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-white">
              {String(timeLeft.mins).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#84d7af] mt-2 font-heading">
              MINS
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-black/25 border border-white/15 backdrop-blur-md shadow-xl">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-white">
              {String(timeLeft.secs).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#84d7af] mt-2 font-heading">
              SECS
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
