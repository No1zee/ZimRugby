"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield, ArrowRight, Award, Users, Trophy } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";

export default function FlagshipTeamHero() {
  return (
    <section className="relative w-full bg-[#050D08] text-white pt-28 pb-16 overflow-hidden border-b border-white/10">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(0,107,63,0.35),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,107,63,0.15),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Category Badge */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3.5 py-1 rounded-full bg-zru-green text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-lg">
            Flagship National Side
          </span>
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest hidden sm:inline">
            Africa Cup Champions
          </span>
        </div>

        {/* Grid Layout: Hero Content + Stat Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Copy & Hero CTA */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] italic text-white">
              ZIMBABWE <br />
              <span className="text-zru-green">SABLES</span>
            </h1>
            <p className="text-white/80 text-base sm:text-lg font-body leading-relaxed max-w-2xl">
              The flagship men&apos;s 15s national team representing Zimbabwe on the global rugby stage. African champions driving towards World Cup qualification with pride, physicality, and speed.
            </p>

            {/* Quick Action Pathways */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/teams/sables">
                <SlantedButton variant="primary" size="lg" className="inline-flex items-center gap-2">
                  Explore Sables Hub <ArrowRight className="w-4 h-4" />
                </SlantedButton>
              </Link>
              <Link 
                href="/match-centre?team=Sables"
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-zru-green text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                View Fixtures & Results
              </Link>
            </div>
          </div>

          {/* Stat Rail & Image Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-rich-black/60 shadow-2xl p-6 space-y-6 backdrop-blur-xl">
              {/* Featured Image */}
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/images/gallery/zimbabwe-sables-0351.webp"
                  alt="Zimbabwe Sables National Team"
                  fill
                  priority
                  className="object-cover object-top filter brightness-95 contrast-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black text-zru-green uppercase tracking-widest block">World Rugby Ranking</span>
                    <span className="font-heading text-2xl font-black text-white">#28 Global</span>
                  </div>
                  <Shield className="w-8 h-8 text-zru-green" />
                </div>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-center">
                  <Trophy className="w-4 h-4 text-zru-green mx-auto mb-1" />
                  <span className="block text-lg font-heading font-black text-white">1st</span>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider block">Africa Rugby Cup</span>
                </div>
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-center">
                  <Award className="w-4 h-4 text-zru-green mx-auto mb-1" />
                  <span className="block text-lg font-heading font-black text-white">1991</span>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider block">RWC Debut</span>
                </div>
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-center">
                  <Users className="w-4 h-4 text-zru-green mx-auto mb-1" />
                  <span className="block text-lg font-heading font-black text-white">36</span>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider block">Senior Roster</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
