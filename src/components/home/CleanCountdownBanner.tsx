"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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
      className="py-12 sm:py-16 text-white border-y border-white/10 relative overflow-hidden select-none"
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

      {/* Left Player SVG Cutout */}
      <motion.div
        initial={{ opacity: 0, x: -120 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="absolute bottom-0 -left-6 sm:left-0 lg:left-12 w-44 sm:w-60 md:w-80 lg:w-96 h-auto pointer-events-none z-10"
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

      {/* Right Player SVG Cutout */}
      <motion.div
        initial={{ opacity: 0, x: 120 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="absolute bottom-0 -right-6 sm:right-0 lg:right-12 w-44 sm:w-60 md:w-80 lg:w-96 h-auto pointer-events-none z-10"
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

      <div className="relative z-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
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
