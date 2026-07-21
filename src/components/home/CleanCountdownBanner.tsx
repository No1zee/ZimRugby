"use client";

import React, { useState, useEffect } from "react";

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
    <section
      className="py-10 sm:py-12 text-white border-y border-white/10 relative overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 25%, #007A50 0%, #004D2C 60%, #002D1A 100%)",
      }}
    >
      {/* Pitch Grid Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Title */}
        <h3 className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-white/90 mb-8 font-heading">
          ROAD TO AUSTRALIA 2027
        </h3>

        {/* Numeric Counter Grid */}
        <div className="grid grid-cols-4 gap-6 sm:gap-12 md:gap-16 max-w-2xl mx-auto">
          
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight">
              {String(timeLeft.days).padStart(3, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white/70 mt-1">
              DAYS
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white/70 mt-1">
              HOURS
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight">
              {String(timeLeft.mins).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white/70 mt-1">
              MINS
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight">
              {String(timeLeft.secs).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white/70 mt-1">
              SECS
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
