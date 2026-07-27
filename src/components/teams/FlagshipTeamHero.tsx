"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, ArrowRight, Trophy, Award, Users, ChevronRight } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";
import { motion, AnimatePresence } from "framer-motion";

export interface TeamHeroProfile {
  id: string;
  name: string;
  category: string;
  description: string;
  bgImage: string;
  featuredImage: string;
  ranking: string;
  href: string;
  stats: { label: string; value: string }[];
}

const ALL_TEAMS: TeamHeroProfile[] = [
  {
    id: "sables",
    name: "ZIMBABWE SABLES",
    category: "Men's 15s Senior National Team",
    description: "The flagship men's 15s national team representing Zimbabwe on the global rugby stage. Reigning African Champions driving towards World Cup qualification with pride and speed.",
    bgImage: "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp",
    featuredImage: "/images/gallery/zimbabwe-sables-0351.webp",
    ranking: "#28 Global",
    href: "/teams/sables",
    stats: [
      { label: "Africa Rugby Cup", value: "1st" },
      { label: "RWC Debut", value: "1991" },
      { label: "Senior Roster", value: "36" },
    ],
  },
  {
    id: "lady-sables",
    name: "LADY SABLES",
    category: "Women's 15s & 7s National Team",
    description: "The pride of women's rugby in Zimbabwe. Competing in test matches and continental championships, driving growth and excellence across female rugby.",
    bgImage: "/images/hero/lady-sables.webp",
    featuredImage: "/images/hero/lady-sables.webp",
    ranking: "Africa Top 8",
    href: "/teams/lady-sables",
    stats: [
      { label: "Format", value: "15s & 7s" },
      { label: "Category", value: "Women" },
      { label: "Squad Roster", value: "30" },
    ],
  },
  {
    id: "cheetahs",
    name: "ZIMBABWE CHEETAHS",
    category: "Men's 7s National Team",
    description: "High-octane sevens squad representing Zimbabwe on the World Rugby Sevens Challenger Series and Olympic qualifying circuits with pace and flair.",
    bgImage: "/images/hero/cheetahs-hero.webp",
    featuredImage: "/images/hero/cheetahs-hero.webp",
    ranking: "WR Challenger",
    href: "/teams/cheetahs",
    stats: [
      { label: "Format", value: "Sevens" },
      { label: "Circuit", value: "WR 7s" },
      { label: "Squad Roster", value: "18" },
    ],
  },
  {
    id: "junior-sables",
    name: "JUNIOR SABLES",
    category: "U20 Men's 15s National Team",
    description: "Back-to-back Barthes Trophy African U20 Champions and World Rugby Junior Trophy contenders. The high-performance pipeline to senior caps.",
    bgImage: "/images/hero/junior-sables-hero.webp",
    featuredImage: "/images/hero/junior-sables-hero.webp",
    ranking: "Africa U20 Champions",
    href: "/teams/junior-sables",
    stats: [
      { label: "Barthes Cup", value: "1st" },
      { label: "World Trophy", value: "Finalists" },
      { label: "U20 Roster", value: "32" },
    ],
  },
];

export default function FlagshipTeamHero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeTeam = ALL_TEAMS[activeIdx];

  return (
    <section className="relative w-full bg-[#050D08] text-white pt-28 pb-16 overflow-hidden border-b border-white/10">
      {/* Background Hero Photography with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTeam.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={activeTeam.bgImage}
            alt={activeTeam.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#010905] via-[#010905]/80 to-[#010905]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-transparent to-[#050D08]/60" />
        </motion.div>
      </AnimatePresence>

      {/* Background ambient radial gradients */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(0,107,63,0.35),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,107,63,0.15),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Interactive All-Teams Tab Selector Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {ALL_TEAMS.map((team, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={team.id}
                onClick={() => setActiveIdx(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? "bg-[#006747] text-white border-[#006747] shadow-lg scale-105"
                    : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10"
                }`}
              >
                <span>{team.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>

        {/* Grid Layout: Dynamic Hero Content + Stat Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Copy & Hero CTA */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTeam.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <span className="text-xs font-extrabold uppercase tracking-widest text-accent-teal block">
                  {activeTeam.category}
                </span>

                <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[1.0] italic text-white">
                  {activeTeam.name}
                </h1>

                <p className="text-white/80 text-base sm:text-lg font-body leading-relaxed max-w-2xl">
                  {activeTeam.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Quick Action Pathways */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href={activeTeam.href}>
                <SlantedButton variant="primary" size="lg" className="inline-flex items-center gap-2">
                  <span>Explore {activeTeam.name.replace("ZIMBABWE ", "")} Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </SlantedButton>
              </Link>
              <Link 
                href={`/match-centre?team=${encodeURIComponent(activeTeam.name)}`}
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#006747] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                View Fixtures & Results
              </Link>
            </div>
          </div>

          {/* Stat Rail & Image Spotlight */}
          <div className="lg:col-span-5 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTeam.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-3xl overflow-hidden border border-white/10 bg-rich-black/60 shadow-2xl p-6 space-y-6 backdrop-blur-xl"
              >
                {/* Featured Image */}
                <div className="relative h-60 sm:h-64 w-full rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src={activeTeam.featuredImage}
                    alt={activeTeam.name}
                    fill
                    priority
                    className="object-cover object-top filter brightness-95 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>

                {/* Team Ranking / Status — below the image card */}
                <div className="flex justify-between items-end px-1">
                  <div>
                    <span className="text-[10px] font-black text-[#006747] uppercase tracking-widest block">Team Ranking / Status</span>
                    <span className="font-heading text-xl font-black text-white">{activeTeam.ranking}</span>
                  </div>
                  <Shield className="w-7 h-7 text-[#006747]" />
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  {activeTeam.stats.map((st, idx) => (
                    <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                      {idx === 0 ? (
                        <Trophy className="w-4 h-4 text-[#006747] mx-auto mb-1" />
                      ) : idx === 1 ? (
                        <Award className="w-4 h-4 text-[#006747] mx-auto mb-1" />
                      ) : (
                        <Users className="w-4 h-4 text-[#006747] mx-auto mb-1" />
                      )}
                      <span className="block text-base font-heading font-black text-white">{st.value}</span>
                      <span className="text-[9px] text-white/50 uppercase tracking-wider block line-clamp-1">{st.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
