"use client";

import React from "react";
import Image from "next/image";
import { AnimatedCountdown } from "@/components/ui/animated-countdown";
import MatchdayVideoHighlights from "@/components/media/MatchdayVideoHighlights";
import FeaturedPlayersGrid from "@/components/teams/FeaturedPlayersGrid";
import type { FeaturedPlayer } from "@/types";

interface RoadToWorldCupProps {
  featuredPlayers: FeaturedPlayer[];
}

export default function RoadToWorldCup({ featuredPlayers }: RoadToWorldCupProps) {
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
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/90 mb-3 font-heading block">
            ROAD TO AUSTRALIA
          </span>
          <span className="text-[9px] font-normal tracking-[0.2em] uppercase text-white/50 mb-4 font-heading block">
            2027 RUGBY WORLD CUP
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
        <div className="absolute bottom-0 left-0 w-40 lg:w-52 h-[260px] lg:h-[320px] pointer-events-none z-[5]">
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
        <div className="absolute bottom-0 right-0 w-40 lg:w-52 h-[260px] lg:h-[320px] pointer-events-none z-[5]">
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
        <div className="relative z-10 max-w-[1360px] mx-auto px-8 lg:px-10 text-center pt-14 mb-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black uppercase tracking-tight text-white not-italic leading-[1.0]">
            ROAD TO{" "}
            <span className="text-accent-teal">AUSTRALIA</span>
            <span className="block text-lg sm:text-xl lg:text-2xl text-white/60 font-normal tracking-[0.15em] mt-2">
              2027 RUGBY WORLD CUP
            </span>
          </h2>
        </div>

        {/* White center tile — sits on top of the green */}
        <div className="relative z-20 max-w-[1360px] mx-auto px-8 lg:px-10">
          <div className="bg-[#FDFBF0] rounded-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.15)] overflow-hidden">
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
                showChannelLink={true}
              />
            </div>

            {/* Featured Players */}
            <div className="px-4 sm:px-6 lg:px-8 py-10 border-t border-black/5">
              <div className="mb-8">
                <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-rich-black not-italic">
                  FEATURED{" "}
                  <span className="text-accent-teal">PLAYERS</span>
                </h2>
              </div>
              <FeaturedPlayersGrid players={featuredPlayers} />
            </div>
          </div>
        </div>

        {/* Spacer — green extends this far below the white tile, -mb-32 pulls Grassroots behind it */}
        <div className="h-32 relative" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#006747]" />
        </div>
      </div>
    </section>
  );
}
