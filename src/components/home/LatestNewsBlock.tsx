"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

/** Latest news bento grid for the homepage. */


export default function LatestNewsBlock() {
  return (
    <section className="py-12 md:py-16 bg-[#F6F5EF] text-rich-black">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-rich-black/80 font-heading">
            LATEST NEWS
          </h2>
          <Link 
            href="/media" 
            className="text-xs sm:text-sm font-bold tracking-widest uppercase text-rich-black/70 hover:text-zru-green transition-colors border-b border-rich-black/20 pb-0.5"
          >
            VIEW ALL NEWS
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Feature Article (2/3 width) */}
          <div className="lg:col-span-8 group relative rounded-2xl overflow-hidden shadow-sm bg-black border border-black/5 min-h-[380px] sm:min-h-[440px] flex flex-col justify-end">
            <Image
              src="/images/teams/african-chamions.png"
              alt="Sables Squad Announcement"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90"
              priority
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#003B22]/95 via-[#004D2C]/60 to-transparent pointer-events-none" />

            {/* Content Overlay */}
            <div className="relative z-10 p-6 sm:p-8">
              <span className="inline-block px-3 py-1 bg-zru-green text-white text-[11px] font-bold tracking-widest uppercase rounded-full mb-3 shadow-xs">
                SABLES NEWS
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-wide leading-tight mb-2 uppercase font-heading">
                SABLES SQUAD FOR NATIONS CUP CLASH
              </h3>
              <p className="text-sm text-white/80 line-clamp-2 max-w-2xl font-body">
                Head Coach confirms squad changes ahead of the critical opener in Windhoek. Experience and young talent combined for international test series.
              </p>
            </div>
          </div>

          {/* Stacked Side Articles (1/3 width) */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
            
            {/* Card 1: Junior Sables */}
            <Link 
              href="/media" 
              className="flex-1 group bg-[#EAE8DE] hover:bg-[#E2E0D4] border border-black/5 rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden mb-3">
                <Image
                  src="/images/teams/junior-sables.jpg"
                  alt="Junior Sables"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-zru-green block mb-1">
                  JUNIOR SABLES
                </span>
                <h4 className="text-sm sm:text-base font-bold text-rich-black uppercase tracking-wide group-hover:text-zru-green transition-colors leading-snug">
                  U20 Training Camp Roster Announced
                </h4>
              </div>
            </Link>

            {/* Card 2: 7s Cheetahs */}
            <Link 
              href="/media" 
              className="flex-1 group bg-[#EAE8DE] hover:bg-[#E2E0D4] border border-black/5 rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden mb-3">
                <Image
                  src="/images/teams/cheetahs.jpg"
                  alt="7s Cheetahs"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-zru-green block mb-1">
                  7S CHEETAHS
                </span>
                <h4 className="text-sm sm:text-base font-bold text-rich-black uppercase tracking-wide group-hover:text-zru-green transition-colors leading-snug">
                  Cheetahs Secure Dubai Invitational Tour
                </h4>
              </div>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}
