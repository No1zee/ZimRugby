"use client";

import React from "react";
import Image from "next/image";
import { AnimatedCountdown } from "@/components/ui/animated-countdown";
import MatchdayVideoHighlights from "@/components/media/MatchdayVideoHighlights";

export default function RoadToWorldCup() {
  const targetDate = new Date("2027-10-01T20:00:00");

  return (
    <section className="relative select-none">
      {/* ── Mobile: thin countdown strip ── */}
      <div
        className="md:hidden py-5 text-white border-y border-white/10 relative overflow-hidden min-h-[120px]"
        style={{
          background: "radial-gradient(circle at 50% 25%, #007A50 0%, #004D2C 60%, #002D1A 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative z-20 max-w-[1360px] mx-auto px-4 flex flex-col items-center text-center">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/90 mb-4 font-heading">
            ROAD TO AUSTRALIA 2027
          </span>
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
      </div>

      {/* ── Desktop: frame with green sides + white center tile ── */}
      <div
        className="hidden md:block relative -mb-32"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, #007A50 0%, #004D2C 50%, #002D1A 100%)",
        }}
      >
        {/* Pitch grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Left player cutout */}
        <div className="absolute bottom-0 left-0 w-56 lg:w-72 h-[300px] lg:h-[360px] pointer-events-none z-[5]">
          <Image
            src="/images/cutouts/3.svg"
            alt=""
            width={280}
            height={360}
            className="w-full h-full object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
            unoptimized
          />
        </div>

        {/* Right player cutout */}
        <div className="absolute bottom-0 right-0 w-56 lg:w-72 h-[300px] lg:h-[360px] pointer-events-none z-[5]">
          <Image
            src="/images/cutouts/1.svg"
            alt=""
            width={280}
            height={360}
            className="w-full h-full object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
            unoptimized
          />
        </div>

        {/* Section heading on the green */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-8 lg:px-12 text-center pt-14 mb-8">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/80 font-heading">
            ROAD TO AUSTRALIA 2027
          </span>
        </div>

        {/* White center tile — sits on top of the green */}
        <div className="relative z-20 max-w-[1080px] mx-auto px-8 lg:px-12">
          <div className="bg-[#FDFBF0] rounded-t-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.15)] overflow-hidden">
            {/* Countdown row */}
            <div className="px-8 py-10 flex flex-col items-center border-b border-black/5">
              <AnimatedCountdown
                targetDate={targetDate}
                variant="digital"
                size="sm"
                containerClassName="border-transparent bg-transparent shadow-none"
                unitClassName="border-black/10 bg-black/5 text-rich-black"
                numberClassName="text-rich-black"
                labelClassName="text-rich-black/40"
              />
            </div>

            {/* Video carousel */}
            <div className="px-2 sm:px-4 py-6">
              <MatchdayVideoHighlights
                title={<>ROAD TO <span className="text-accent-teal">WORLD CUP</span></>}
                subtitle="NATIONS CUP HIGHLIGHTS"
                showChannelLink={true}
              />
            </div>
          </div>
        </div>

        {/* Spacer — green extends this far below the white tile, -mb-32 pulls Grassroots behind it */}
        <div className="h-32" aria-hidden="true" />
      </div>
    </section>
  );
}
