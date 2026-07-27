"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Trophy,
  Shield,
  Target,
  Users,
  Calendar,
  ClipboardList,
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
  campaignRibbon: string;
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
  filters: string[];
  recentRecord: string;
  competitionBadges: string[];
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
    campaignRibbon: "WORLD CUP QUALIFIERS",
    tagline: "Reigning Africa Champions driving towards the global stage.",
    description:
      "The flagship men's 15s national team representing Zimbabwe on the world rugby stage. Reigning African Champions pursuing World Cup qualification with pride, speed, and physicality.",
    ranking: "#28 World",
    keyHonour: "Africa Cup Champions",
    squadSize: "36",
    pathway: "From Junior Sables",
    accentColor: "#D4A843",
    accentRaw: "#D4A843",
    jerseyColors: ["#006747", "#D4A843"],
    heroImage: "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp",
    featuredImage: "/images/gallery/zimbabwe-sables-0351.webp",
    href: "/teams/sables",
    filters: ["15s"],
    recentRecord: "4W – 1L – 0D",
    competitionBadges: ["Africa Cup", "RWC 2027 Qualifiers"],
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
    campaignRibbon: "AFRICA WOMEN'S CUP 2026",
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
    filters: ["15s", "women"],
    recentRecord: "2W – 3L – 0D",
    competitionBadges: ["Africa Women's Cup", "Rugby Africa"],
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
    campaignRibbon: "SEVENS WORLD CIRCUIT",
    tagline: "High-octane sevens with pace, flair, and Olympic ambition.",
    description:
      "High-octane sevens squad representing Zimbabwe on the World Rugby Sevens Challenger Series and Olympic qualifying circuits with pace, flair, and relentless speed.",
    ranking: "WR Challenger Series",
    keyHonour: "Africa 7s Podium",
    squadSize: "18",
    pathway: "Crossover from Sables",
    accentColor: "#22D96B",
    accentRaw: "#22D96B",
    jerseyColors: ["#006747", "#D4A843"],
    heroImage: "/images/hero/cheetahs-hero.webp",
    featuredImage: "/images/teams/cheetahs.jpg",
    href: "/teams/cheetahs",
    filters: ["7s"],
    recentRecord: "3W – 2L – 0D",
    competitionBadges: ["Sevens Challenger Series", "Africa 7s Cup"],
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
    campaignRibbon: "U20 PATHWAY TO SENIORS",
    tagline: "Back-to-back Barthes Trophy champions building the future.",
    description:
      "Back-to-back Barthes Trophy African U20 Champions and World Rugby Junior Trophy contenders. The high-performance pipeline producing the next generation of senior Sables.",
    ranking: "Africa U20 #1",
    keyHonour: "Barthes Trophy Champions",
    squadSize: "32",
    pathway: "Feeds Senior Sables",
    accentColor: "#84CC16",
    accentRaw: "#84CC16",
    jerseyColors: ["#006747", "#FFFFFF"],
    heroImage: "/images/hero/junior-sables-hero.webp",
    featuredImage: "/images/hero/zim-u20s.webp",
    href: "/teams/junior-sables",
    filters: ["15s", "u20"],
    recentRecord: "5W – 0L – 0D",
    competitionBadges: ["Barthes Trophy", "U20 World Trophy"],
    heroStats: [
      { label: "Barthes Cup", value: "1st" },
      { label: "World Trophy", value: "Finalists" },
      { label: "U20 Roster", value: "32" },
    ],
  },
];

const FILTERS = [
  { id: "all", label: "ALL" },
  { id: "15s", label: "15s" },
  { id: "7s", label: "7s" },
  { id: "women", label: "WOMEN" },
  { id: "u20", label: "U20" },
];

export default function NationalSquadsControlRoom() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const railRef = useRef<HTMLDivElement>(null);

  const filteredTeams =
    activeFilter === "all"
      ? TEAMS
      : TEAMS.filter((t) => t.filters.includes(activeFilter));

  const activeTeam = TEAMS[activeIdx];

  const currentFilteredIdx = filteredTeams.findIndex(
    (t) => t.id === activeTeam.id
  );

  useEffect(() => {
    if (filteredTeams.length > 0) {
      const stillVisible = filteredTeams.some(
        (t) => t.id === TEAMS[activeIdx].id
      );
      if (!stillVisible) {
        setActiveIdx(TEAMS.indexOf(filteredTeams[0]));
      }
    }
  }, [activeFilter]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = Math.min(currentFilteredIdx + 1, filteredTeams.length - 1);
        setActiveIdx(TEAMS.indexOf(filteredTeams[next]));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = Math.max(currentFilteredIdx - 1, 0);
        setActiveIdx(TEAMS.indexOf(filteredTeams[prev]));
      }
    },
    [currentFilteredIdx, filteredTeams]
  );

  return (
    <section className="relative bg-[#050D08] text-white overflow-hidden">
      {/* Ambient radial gradients */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(0,107,63,0.3),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,107,63,0.12),transparent_70%)] pointer-events-none" />

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="controlroom-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#controlroom-grain)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── 1. CAMPAIGN RIBBON ─── */}
        <div className="pt-6 pb-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border"
              style={{
                backgroundColor: `${activeTeam.accentRaw}15`,
                color: activeTeam.accentColor,
                borderColor: `${activeTeam.accentRaw}35`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: activeTeam.accentColor }}
              />
              {activeTeam.campaignRibbon}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── 2. FILTER CHIPS ─── */}
        <div
          className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar"
          role="toolbar"
          aria-label="Filter teams by format"
        >
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.id;
            const count =
              f.id === "all"
                ? TEAMS.length
                : TEAMS.filter((t) => t.filters.includes(f.id)).length;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? "bg-white text-[#050D08] border-white shadow-lg shadow-white/10"
                    : "bg-white/5 text-white/50 border-white/8 hover:bg-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                {f.label}
                <span
                  className={`ml-1.5 text-[8px] ${
                    isActive ? "text-[#050D08]/50" : "text-white/30"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── 3. TEAM RAIL ─── */}
        <div
          ref={railRef}
          role="tablist"
          aria-label="National teams"
          onKeyDown={handleKeyDown}
          className="flex gap-3 overflow-x-auto no-scrollbar py-4 -mx-4 px-4"
        >
          {filteredTeams.map((team) => {
            const isActive = team.id === activeTeam.id;
            const globalIdx = TEAMS.indexOf(team);
            return (
              <button
                key={team.id}
                role="tab"
                aria-selected={isActive}
                aria-label={`${team.name} — ${team.ranking}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveIdx(globalIdx)}
                className={`group relative flex-shrink-0 w-[210px] rounded-2xl p-4 text-left transition-all duration-300 cursor-pointer border overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                  isActive
                    ? "border-white/25 shadow-2xl shadow-black/40"
                    : "border-white/5 hover:border-white/15 hover:shadow-lg hover:shadow-black/20"
                }`}
                style={{
                  backgroundColor: isActive
                    ? `${team.accentRaw}12`
                    : "rgba(255,255,255,0.02)",
                  transform: isActive ? "scale(1.03)" : undefined,
                }}
              >
                {/* Hover background image */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500">
                  <Image
                    src={team.featuredImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="210px"
                  />
                  <div className="absolute inset-0 bg-[#050D08]/85" />
                </div>

                <div className="relative z-10 space-y-3">
                  {/* Crest + Jersey Colors */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/15 bg-white/5">
                      <Image
                        src={team.featuredImage}
                        alt={team.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex gap-1">
                      {team.jerseyColors.map((c, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Short tagline */}
                  <p className="text-[11px] font-bold text-white/60 leading-tight line-clamp-2 min-h-[2.5em]">
                    {team.tagline}
                  </p>

                  {/* Key stat */}
                  <div className="flex items-center gap-1.5">
                    <Trophy
                      className="w-3 h-3"
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
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white/8 hover:bg-white/15 rounded text-[8px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
                    >
                      <Calendar className="w-2.5 h-2.5" />
                      Fixtures
                    </Link>
                    <Link
                      href={`${team.href}#squad`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white/8 hover:bg-white/15 rounded text-[8px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
                    >
                      <Users className="w-2.5 h-2.5" />
                      Roster
                    </Link>
                    <Link
                      href={`${team.href}#media`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white/8 hover:bg-white/15 rounded text-[8px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
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
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ backgroundColor: team.accentColor }}
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

        {/* ─── 4. CINEMATIC HERO PANEL ─── */}
        <div className="pt-4 pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl overflow-hidden border border-white/8"
            >
              {/* Background hero image */}
              <div className="absolute inset-0">
                <Image
                  src={activeTeam.heroImage}
                  alt={activeTeam.name}
                  fill
                  priority
                  className="object-cover object-center brightness-[0.25] contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050D08] via-[#050D08]/88 to-[#050D08]/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050D08] via-transparent to-[#050D08]/50" />
              </div>

              {/* Split layout */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10 min-h-[420px] lg:min-h-[480px] items-center">
                {/* ── Left: Big typographic identity ── */}
                <div className="lg:col-span-7 space-y-5">
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-[0.2em] block"
                    style={{ color: activeTeam.accentColor }}
                  >
                    {activeTeam.category}
                  </span>

                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.88] italic text-white">
                    {activeTeam.name}
                  </h1>

                  <p className="text-white/65 text-sm sm:text-base font-body leading-relaxed max-w-xl">
                    {activeTeam.description}
                  </p>

                  {/* Competition badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeTeam.competitionBadges.map((badge) => (
                      <span
                        key={badge}
                        className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border"
                        style={{
                          backgroundColor: `${activeTeam.accentRaw}10`,
                          borderColor: `${activeTeam.accentRaw}30`,
                          color: activeTeam.accentColor,
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <Link href={activeTeam.href}>
                      <SlantedButton
                        variant="primary"
                        size="lg"
                        className="inline-flex items-center gap-2"
                      >
                        <span>
                          Explore {activeTeam.shortName.replace("ZIMBABWE ", "")}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </SlantedButton>
                    </Link>
                    <Link
                      href={`/match-centre?team=${encodeURIComponent(activeTeam.name)}`}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-xl"
                    >
                      Fixtures & Results
                    </Link>
                  </div>
                </div>

                {/* ── Right: Featured image + stats ── */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Featured image card */}
                  <div className="relative h-52 sm:h-56 rounded-2xl overflow-hidden border border-white/10">
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
                        <span
                          className="text-[9px] font-black uppercase tracking-widest block"
                          style={{ color: activeTeam.accentColor }}
                        >
                          Team Ranking
                        </span>
                        <span className="font-heading text-xl font-black text-white">
                          {activeTeam.ranking}
                        </span>
                      </div>
                      <Shield
                        className="w-7 h-7"
                        style={{ color: activeTeam.accentColor }}
                      />
                    </div>
                  </div>

                  {/* Stat grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {activeTeam.heroStats.map((st, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white/5 border border-white/8 rounded-xl text-center"
                      >
                        {idx === 0 ? (
                          <Trophy
                            className="w-3.5 h-3.5 mx-auto mb-1"
                            style={{ color: activeTeam.accentColor }}
                          />
                        ) : idx === 1 ? (
                          <Target
                            className="w-3.5 h-3.5 mx-auto mb-1"
                            style={{ color: activeTeam.accentColor }}
                          />
                        ) : (
                          <Users
                            className="w-3.5 h-3.5 mx-auto mb-1"
                            style={{ color: activeTeam.accentColor }}
                          />
                        )}
                        <span className="block text-sm font-heading font-black text-white">
                          {st.value}
                        </span>
                        <span className="text-[8px] text-white/40 uppercase tracking-wider block line-clamp-1">
                          {st.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom accent bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${activeTeam.accentColor}, transparent)`,
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── 5. STICKY SUB-NAV ─── */}
        <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-3">
          <div className="flex items-center gap-1 bg-[#0a1610]/95 backdrop-blur-lg border border-white/8 rounded-xl px-2 py-1.5 overflow-x-auto no-scrollbar">
            {[
              { label: "Overview", href: "#overview", icon: Shield },
              { label: "Fixtures", href: `${activeTeam.href}#fixtures`, icon: Calendar },
              { label: "Squad", href: `${activeTeam.href}#squad`, icon: Users },
              { label: "Media", href: `${activeTeam.href}#media`, icon: BookOpen },
              { label: "Pathway", href: "#pathway", icon: Target },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/8 transition-all duration-200 whitespace-nowrap"
                >
                  <Icon className="w-3 h-3" />
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 6. INFO GRID — light section ─── */}
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
              {/* Section header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-6 h-0.5"
                    style={{ backgroundColor: activeTeam.accentColor }}
                  />
                  <span
                    className="text-[11px] font-heading font-black uppercase tracking-[0.25em]"
                    style={{ color: activeTeam.accentColor }}
                  >
                    SQUAD OVERVIEW
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight text-rich-black italic leading-[1.0]">
                  {activeTeam.shortName}
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
                  accent={activeTeam.accentColor}
                />
                <InfoCell
                  label="Category"
                  value={activeTeam.category}
                  accent={activeTeam.accentColor}
                  size="sm"
                />
                <InfoCell
                  label="World Ranking"
                  value={activeTeam.ranking}
                  accent={activeTeam.accentColor}
                />
                <InfoCell
                  label="Squad Size"
                  value={`${activeTeam.squadSize} Players`}
                  accent={activeTeam.accentColor}
                />
                <InfoCell
                  label="Recent Record"
                  value={activeTeam.recentRecord}
                  accent={activeTeam.accentColor}
                />
                <InfoCell
                  label="Pathway"
                  value={activeTeam.pathway}
                  accent={activeTeam.accentColor}
                />
              </div>

              {/* Last major honour */}
              <div className="mt-6 p-5 bg-white rounded-xl border border-black/5 flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${activeTeam.accentRaw}15` }}
                >
                  <Star
                    className="w-5 h-5"
                    style={{ color: activeTeam.accentColor }}
                  />
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
  accent,
  size = "md",
}: {
  label: string;
  value: string;
  accent: string;
  size?: "sm" | "md";
}) {
  return (
    <div className="p-4 bg-white rounded-xl border border-black/5 hover:border-black/10 transition-colors">
      <span className="text-[9px] font-black uppercase tracking-widest text-black/35 block mb-1">
        {label}
      </span>
      <span
        className={`font-heading font-black uppercase leading-tight block ${
          size === "sm" ? "text-xs" : "text-sm sm:text-base"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
