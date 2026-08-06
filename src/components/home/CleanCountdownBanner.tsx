"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedCountdown } from "@/components/ui/animated-countdown";

export default function CleanCountdownBanner() {
  const targetDate = new Date("2027-10-01T20:00:00");

  return (
    <section
      className="py-5 sm:py-7 text-white border-y border-white/10 relative overflow-hidden select-none min-h-[120px] sm:min-h-[160px]"
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

      {/* Green Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[11]"
        style={{
          background: "linear-gradient(90deg, rgba(0,103,71,1) 0%, rgba(0,103,71,0.6) 2%, rgba(0,103,71,0.2) 5%, transparent 12%, transparent 88%, rgba(0,103,71,0.2) 95%, rgba(0,103,71,0.6) 98%, rgba(0,103,71,1) 100%)",
        }}
      />

      {/* Left Player SVG Cutout */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="absolute bottom-0 left-0 w-28 sm:w-44 md:w-56 lg:w-72 h-36 sm:h-56 md:h-[300px] lg:h-[360px] pointer-events-none z-10 block"
      >
        <Image
          src="/images/cutouts/3.svg"
          alt="Zimbabwe Rugby Cutout Left"
          width={280}
          height={360}
          className="w-full h-full object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
          unoptimized
        />
      </motion.div>

      {/* Right Player SVG Cutout */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="absolute bottom-0 right-0 w-28 sm:w-44 md:w-56 lg:w-72 h-36 sm:h-56 md:h-[300px] lg:h-[360px] pointer-events-none z-10 block"
      >
        <Image
          src="/images/cutouts/1.svg"
          alt="Zimbabwe Rugby Cutout Right"
          width={280}
          height={360}
          className="w-full h-full object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
          unoptimized
        />
      </motion.div>

      <div className="relative z-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Title */}
        <span className="text-[11px] sm:text-xs font-black tracking-[0.3em] uppercase text-white/90 mb-4 font-heading">
          ROAD TO AUSTRALIA 2027
        </span>

        {/* Animated Countdown */}
        <AnimatedCountdown
          targetDate={targetDate}
          variant="digital"
          size="sm"
          containerClassName="border-transparent bg-transparent shadow-none"
          unitClassName="border-white/20 bg-white/15 text-white"
          numberClassName="text-white"
          labelClassName="text-white/50"
        />
      </div>
    </section>
  );
}
