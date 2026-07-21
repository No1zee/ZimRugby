"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Award, Zap, ArrowRight } from "lucide-react";

export default function PlayerSpotlightStrip() {
  return (
    <section className="py-20 bg-rich-black text-white relative overflow-hidden border-t border-b border-white/10">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,107,63,0.2),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Player Spotlight Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-zru-green animate-pulse" />
              <span className="text-[10px] font-black text-zru-green uppercase tracking-[0.3em]">
                Player to Watch Spotlight
              </span>
            </div>

            <h2 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tight italic">
              TINOTENDA <br />
              <span className="text-zru-green">MASEKERE</span>
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-white/60">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">Position: Flyhalf / Fullback</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">Club: Old Hararians RFC</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">Sables Caps: 14 Caps</span>
            </div>

            <p className="text-white/75 text-base font-body leading-relaxed max-w-xl">
              &quot;Playing for the Sables is about representing 16 million Zimbabweans worldwide. Every time we step onto that pitch, we give everything for the jersey.&quot;
            </p>

            <div className="pt-4">
              <Link
                href="/media"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-zru-green hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                Read Player Feature <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Player Photo Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-white/5 p-6 backdrop-blur-xl space-y-4">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/gallery/zimbabwe-sables-0351.webp"
                  alt="Player to Watch Spotlight"
                  fill
                  className="object-cover object-center filter brightness-95"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-zru-green text-white p-2 rounded-xl shadow-lg">
                  <Star className="w-5 h-5 fill-white" />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-body text-white/60">
                <span>Featured in Africa Cup 2026</span>
                <span className="text-zru-green font-bold uppercase">Sables #10</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
