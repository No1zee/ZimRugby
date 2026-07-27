"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Trophy,
  Shield,
  Users,
  Calendar,
  BookOpen,
  Star,
} from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";

interface ControlRoomTeam {
  id: string;
  name: string;
  shortName: string;
  category: string;
  format: string;
  formatTag: string;
  tagline: string;
  description: string;
  ranking: string;
  keyHonour: string;
  squadSize: string;
  pathway: string;
  accentColor: string;
  accentRaw: string;
  jerseyColors: string[];
  heroImage: string;
  featuredImage: string;
  href: string;
  recentRecord: string;
  heroStats: { label: string; value: string }[];
}

const TEAMS: ControlRoomTeam[] = [
  {
    id: "sables",
    name: "ZIMBABWE SABLES",
    shortName: "SABLES",
    category: "Senior Men's 15s National Team",
    format: "15-a-side",
    formatTag: "15s",
    tagline: "Reigning Africa Champions driving towards the global stage.",
    description:
      "The flagship men's 15s national team representing Zimbabwe on the world rugby stage. Reigning African Champions pursuing World Cup qualification with pride, speed, and physicality.",
    ranking: "#28 World",
    keyHonour: "Africa Cup Champions",
    squadSize: "36",
    pathway: "From Junior Sables",
    accentColor: "#006747",
    accentRaw: "#006747",
    jerseyColors: ["#006747", "#D4A843"],
    heroImage: "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp",
    featuredImage: "/images/gallery/zimbabwe-sables-0351.webp",
    href: "/teams/sables",
    recentRecord: "4W – 1L – 0D",
    heroStats: [
      { label: "Africa Cup Titles", value: "2" },
      { label: "RWC Appearances", value: "2" },
      { label: "Senior Roster", value: "36" },
    ],
  },
  {
    id: "lady-sables",
    name: "LADY SABLES",
    shortName: "LADY SABLES",
    category: "Senior Women's National Team",
    format: "15-a-side",
    formatTag: "15s",
    tagline: "The pride of women's rugby in Zimbabwe, competing across Africa.",
    description:
      "Zimbabwe's senior women's national team. Competing in Rugby Africa tournaments and international test matches, driving growth and excellence across women's rugby.",
    ranking: "Africa Top 8",
    keyHonour: "Continental Contenders",
    squadSize: "30",
    pathway: "Schools & Clubs Pipeline",
    accentColor: "#00C88C",
    accentRaw: "#00C88C",
    jerseyColors: ["#006747", "#FFFFFF"],
    heroImage: "/images/hero/lady-sables.webp",
    featuredImage: "/images/gallery/sables-women-9.webp",
    href: "/teams/lady-sables",
    recentRecord: "2W – 3L – 0D",
    heroStats: [
      { label: "Africa Cup Apps", value: "4" },
      { label: "Registered Players", value: "1.2K+" },
      { label: "Senior Roster", value: "30" },
    ],
  },
  {
    id: "cheetahs",
    name: "ZIMBABWE CHEETAHS",
    shortName: "CHEETAHS",
    category: "Senior Men's Sevens Team",
    format: "7-a-side",
    formatTag: "7s",
    tagline: "High-octane sevens with pace, flair, and Olympic ambition.",
    description:
      "High-octane sevens squad representing Zimbabwe on the World Rugby Sevens Challenger Series and Olympic qualifying circuits with pace, flair, and relentless speed.",
    ranking: "WR Challenger Series",
    keyHonour: "Africa 7s Podium",
    squadSize: "18",
    pathway: "Crossover from Sables",
    accentColor: "#00704D",
    accentRaw: "#00704D",
    jerseyColors: ["#006747", "#D4A843"],
    heroImage: "/images/hero/cheetahs-hero.webp",
    featuredImage: "/images/teams/cheetahs.jpg",
    href: "/teams/cheetahs",
    recentRecord: "3W – 2L – 0D",
    heroStats: [
      { label: "Circuit", value: "WR 7s" },
      { label: "Speed Tier", value: "Elite" },
      { label: "Squad Roster", value: "18" },
    ],
  },
  {
    id: "junior-sables",
    name: "JUNIOR SABLES",
    shortName: "JUNIOR SABLES",
    category: "U20 Men's 15s National Team",
    format: "15-a-side",
    formatTag: "15s",
    tagline: "Back-to-back Barthes Trophy champions building the future.",
    description:
      "Back-to-back Barthes Trophy African U20 Champions and World Rugby Junior Trophy contenders. The high-performance pipeline producing the next generation of senior Sables.",
    ranking: "Africa U20 #1",
    keyHonour: "Barthes Trophy Champions",
    squadSize: "32",
    pathway: "Feeds Senior Sables",
    accentColor: "#00452A",
    accentRaw: "#00452A",
    jerseyColors: ["#006747", "#FFFFFF"],
    heroImage: "/images/hero/junior-sables-hero.webp",
    featuredImage: "/images/hero/zim-u20s.webp",
    href: "/teams/junior-sables",
    recentRecord: "5W – 0L – 0D",
    heroStats: [
      { label: "Barthes Cup", value: "1st" },
      { label: "World Trophy", value: "Finalists" },
      { label: "U20 Roster", value: "32" },
    ],
  },
];

export default function NationalSquadsControlRoom() {
  const [activeIdx, setActiveIdx] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  const activeTeam = TEAMS[activeIdx];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIdx((prev) => Math.min(prev + 1, TEAMS.length - 1));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIdx((prev) => Math.max(prev - 1, 0));
      }
    },
    []
  );

  return (
    <section className="relative bg-rich-black text-white overflow-hidden">
      {/* Ambient radial gradients */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(0,107,63,0.3),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,107,63,0.12),transparent_70%)] pointer-events-none" />

      {/* Grain overlay — site standard */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="controlroom-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#controlroom-grain)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── 1. TEAM RAIL — card-surface system ─── */}
        <div className="pt-5 pb-2">
          <div
            ref={railRef}
            role="tablist"
            aria-label="National teams"
            onKeyDown={handleKeyDown}
            className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4"
          >
            {TEAMS.map((team) => {
              const isActive = team.id === activeTeam.id;
              const idx = TEAMS.indexOf(team);
              return (
                <button
                  key={team.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${team.name} — ${team.format} — ${team.ranking}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIdx(idx)}
                  className={`group relative flex-shrink-0 w-[260px] rounded-lg p-5 text-left transition-all duration-300 cursor-pointer overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                    isActive
                      ? "card-green"
                      : "card-surface card-glow-green"
                  }`}
                  style={{
                    borderTop: `3px solid ${isActive ? team.accentColor : "transparent"}`,
                    transform: isActive ? "scale(1.02)" : undefined,
                  }}
                >
                  <div className="relative z-10 space-y-2.5">
                    {/* Top row: format badge + jersey colors */}
                    <div className="flex items-center justify-between">
                      <span
                        className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-500/30"
                        style={{
                          color: team.accentColor,
                          backgroundColor: `${team.accentRaw}20`,
                        }}
                      >
                        {team.formatTag}
                      </span>
                      <div className="flex gap-1">
                        {team.jerseyColors.map((c, i) => (
                          <span
                            key={i}
                            className="w-3 h-3 rounded-full border border-emerald-500/20"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Team name */}
                    <h3 className="font-heading text-lg font-black uppercase tracking-tight leading-[1.0] italic text-white">
                      {team.shortName}
                    </h3>

                    {/* Tagline */}
                    <p className="text-[11px] font-bold text-white/60 leading-snug line-clamp-2 min-h-[2em]">
                      {team.tagline}
                    </p>

                    {/* Key stat */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <Trophy
                        className="w-3 h-3 flex-shrink-0"
                        style={{ color: team.accentColor }}
                      />
                      <span
                        className="text-[11px] font-black uppercase tracking-wider"
                        style={{ color: team.accentColor }}
                      >
                        {team.ranking}
                      </span>
                    </div>

                    {/* Quick actions on hover */}
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      <Link
                        href={`${team.href}#fixtures`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 rounded text-[8px] font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors"
                      >
                        <Calendar className="w-2.5 h-2.5" />
                        Fixtures
                      </Link>
                      <Link
                        href={`${team.href}#squad`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 rounded text-[8px] font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors"
                      >
                        <Users className="w-2.5 h-2.5" />
                        Roster
                      </Link>
                      <Link
                        href={`${team.href}#media`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 rounded text-[8px] font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors"
                      >
                        <BookOpen className="w-2.5 h-2.5" />
                        Story
                      </Link>
                    </div>
                  </div>

                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="rail-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-zru-green"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 3. CINEMATIC HERO PANEL ─── */}
        <div className="pt-6 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-lg overflow-hidden border border-emerald-500/20"
              style={{
                boxShadow: "0 20px 50px -12px rgba(0,0,0,0.5), 0 0 60px rgba(0,150,70,0.1)",
              }}
            >
              {/* Background hero image */}
              <div className="absolute inset-0">
                <Image
                  src={activeTeam.heroImage}
                  alt={activeTeam.name}
                  fill
                  priority
                  className="object-cover object-center brightness-[0.22] contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-rich-black via-rich-black/90 to-rich-black/55" />
                <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-rich-black/40" />
              </div>

              {/* Decorative diagonal accent lines — homepage hero pattern */}
              <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[15%] -right-8 w-[6px] h-[180px] bg-white/8 rotate-[24deg] blur-[1px]" />
                <div className="absolute top-[30%] -right-3 w-[3px] h-[140px] bg-zru-green/25 rotate-[24deg] blur-sm" />
                <div className="absolute top-[50%] right-8 w-[3px] h-[100px] bg-white/4 rotate-[24deg]" />
              </div>

              {/* Split layout */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 p-6 sm:p-8 lg:p-12 min-h-[400px] lg:min-h-[460px] items-center">
                {/* ── Left: Identity + inline stats ── */}
                <div className="lg:col-span-7 space-y-5">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent-teal block">
                    {activeTeam.category}
                  </span>

                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.88] italic text-white text-glow-green">
                    {activeTeam.name}
                  </h1>

                  <p className="text-white/75 text-sm sm:text-base font-body leading-relaxed max-w-xl">
                    {activeTeam.description}
                  </p>

                  {/* Inline stats row */}
                  <div className="flex items-center gap-0 pt-2 border-t border-white/10">
                    {activeTeam.heroStats.map((st, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {idx > 0 && (
                          <span className="w-px h-8 bg-white/15" />
                        )}
                        <div className="text-center px-2">
                          <span className="block text-base sm:text-lg font-heading font-black italic text-accent-teal">
                            {st.value}
                          </span>
                          <span className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-widest block whitespace-nowrap">
                            {st.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTAs — both parallelogram */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link href={activeTeam.href}>
                      <SlantedButton
                        variant="primary"
                        size="lg"
                        className="inline-flex items-center gap-2"
                      >
                        <span>Explore {activeTeam.shortName.replace("ZIMBABWE ", "")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </SlantedButton>
                    </Link>
                    <Link href={activeTeam.href}>
                      <SlantedButton
                        variant="outline"
                        size="lg"
                        className="inline-flex items-center gap-2"
                      >
                        <span>Fixtures & Results</span>
                        <ArrowRight className="w-4 h-4" />
                      </SlantedButton>
                    </Link>
                  </div>
                </div>

                {/* ── Right: Featured image promo — card-surface bento pattern ── */}
                <div className="lg:col-span-5">
                  <div className="card-surface rounded-lg overflow-hidden">
                    {/* Bento header strip */}
                    <div className="bg-gradient-to-b from-[#00704D] to-[#005238] px-5 py-3 border-b border-emerald-500/20">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white">
                        {activeTeam.keyHonour}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="relative h-56 sm:h-64">
                      <Image
                        src={activeTeam.featuredImage}
                        alt={activeTeam.name}
                        fill
                        className="object-cover object-top filter brightness-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                      {/* Ranking overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-accent-teal block">
                            Team Ranking
                          </span>
                          <span className="font-heading text-xl font-black text-white text-shadow-hero">
                            {activeTeam.ranking}
                          </span>
                        </div>
                        <Shield className="w-7 h-7 text-accent-teal" />
                      </div>
                    </div>

                    {/* Footer with CTA */}
                    <div className="bg-gradient-to-b from-[#00704D] to-[#005238] px-5 py-3 flex items-center justify-between border-t border-emerald-500/20">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/70">
                        {activeTeam.format} • {activeTeam.squadSize} Players
                      </span>
                      <Link href={activeTeam.href}>
                        <SlantedButton
                          variant="primary"
                          size="sm"
                          className="inline-flex items-center gap-1.5"
                        >
                          <span>Visit Hub</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </SlantedButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom accent bar — green gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-zru-green to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ─── 4. INFO GRID — light section ─── */}
      <div id="overview" className="bg-milk-white text-rich-black">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Section header — two-tone */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-0.5 bg-[#006747]" />
                  <span className="text-[11px] font-heading font-black uppercase tracking-[0.25em] text-[#006747]">
                    SQUAD OVERVIEW
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight italic leading-[1.0]">
                  <span className="text-rich-black">
                    {activeTeam.shortName.split(" ").slice(0, -1).join(" ")}
                    {activeTeam.shortName.split(" ").length > 1 ? " " : ""}
                  </span>
                  <span className="text-accent-teal">
                    {activeTeam.shortName.split(" ").slice(-1)}
                  </span>
                </h2>
              </div>

              {/* 6-cell info grid */}
              <div
                id="pathway"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
              >
                <InfoCell
                  label="Format"
                  value={activeTeam.format}
                />
                <InfoCell
                  label="Category"
                  value={activeTeam.category}
                  size="sm"
                />
                <InfoCell
                  label="World Ranking"
                  value={activeTeam.ranking}
                  highlight
                />
                <InfoCell
                  label="Squad Size"
                  value={`${activeTeam.squadSize} Players`}
                />
                <InfoCell
                  label="Recent Record"
                  value={activeTeam.recentRecord}
                />
                <InfoCell
                  label="Pathway"
                  value={activeTeam.pathway}
                />
              </div>

              {/* Last major honour */}
              <div className="mt-6 p-5 bg-white rounded-2xl border border-black/5 shadow-card flex items-center gap-4 hover:border-green-primary/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent-teal" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-black/40 block">
                    Last Major Honour
                  </span>
                  <span className="font-heading text-base font-black uppercase text-rich-black">
                    {activeTeam.keyHonour}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function InfoCell({
  label,
  value,
  size = "md",
  highlight = false,
}: {
  label: string;
  value: string;
  size?: "sm" | "md";
  highlight?: boolean;
}) {
  return (
    <div className="p-4 bg-white rounded-2xl border border-black/5 shadow-card hover:border-green-primary/20 transition-colors">
      <span className="text-[9px] font-black uppercase tracking-widest text-black/35 block mb-1">
        {label}
      </span>
      <span
        className={`font-heading font-black uppercase leading-tight block ${
          highlight ? "text-accent-teal" : ""
        } ${size === "sm" ? "text-xs" : "text-sm sm:text-base"}`}
      >
        {value}
      </span>
    </div>
  );
}
