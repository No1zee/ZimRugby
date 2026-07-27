"use client";

import React from "react";
import { AnimatedCountdown } from "@/components/ui/animated-countdown";

export default function CleanCountdownBanner() {
  const targetDate = new Date("2027-10-01T20:00:00");

  return (
    <section className="bg-[#003822] text-white relative overflow-hidden select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left — label */}
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-accent-teal rounded-full" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.25em] text-white/70 font-heading">
              ROAD TO AUSTRALIA 2027
            </span>
          </div>

          {/* Right — countdown numbers */}
          <AnimatedCountdown
            targetDate={targetDate}
            variant="digital"
            size="sm"
            containerClassName="border-transparent bg-transparent shadow-none"
            unitClassName="border-white/15 bg-white/10 text-white"
            numberClassName="text-white"
            labelClassName="text-white/40"
          />
        </div>
      </div>
    </section>
  );
}
