"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal, Tilt3DCard } from "../ui/animations";
import { RugbyDecorations, CornerAccent } from "../ui/RugbyDecorations";

import { type Match as DataMatch } from "@/lib/data-fetcher";
import type { FixtureTwinData } from "@/lib/api/fixtures";
import type { RankingsData } from "@/lib/api/rankings";

interface MatchCentreStripProps {
  initialMatches?: DataMatch[];
  twinData: FixtureTwinData;
  rankingsData: RankingsData;
}

export default function MatchCentreStrip({ initialMatches = [], twinData }: MatchCentreStripProps) {
  // Get upcoming spotlight match from twinData
  const spotlightMatch = twinData.upcoming;

  // Find the next upcoming match after the spotlight one from initialMatches
  const nextMatches = initialMatches.filter(
    (m) => m.id !== spotlightMatch.id && m.status === "upcoming"
  );
  
  // If we don't have secondary upcoming matches, create a realistic mock one
  const secondaryMatch: any = nextMatches[0] || {
    id: "sec-match-nam",
    competition: "Rugby Africa Cup 2026",
    round: "Round 1",
    date: "14 MAY 2026",
    time: "15:00",
    venue: "Nelson Mandela Bay Stadium",
    homeTeam: { name: "Namibia", logo: "https://flagcdn.com/w160/na.png" },
    awayTeam: { name: "Kenya", logo: "https://flagcdn.com/w160/ke.png" },
    status: "upcoming"
  };

  // Helper to parse date string (e.g. "25 APRIL 2026") into day, month, weekday
  const parseMatchDate = (dateStr: string) => {
    try {
      const parts = dateStr.split(" ");
      if (parts.length >= 2) {
        return {
          day: parts[0],
          month: parts[1].substring(0, 3).toUpperCase(),
          weekday: "SAT" // Default to Saturday for rugby matches
        };
      }
    } catch (e) {
      // Fallback
    }
    return { day: "19", month: "JUL", weekday: "SUN" };
  };

  const spotlightDate = parseMatchDate(spotlightMatch.date);
  const secondaryDate = parseMatchDate(secondaryMatch.date);

  return (
    <section 
      className="py-24 bg-transparent relative overflow-hidden border-t border-white/5"
      id="match-centre"
    >
      {/* Background Media with subtle stadium overlay */}
      <div className="absolute inset-0 z-0 opacity-8">
        <Image 
          src="/images/events/africa-cup.jpg" 
          alt="Stadium Background" 
          fill 
          priority
          sizes="100vw"
          quality={50}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/30" />
      </div>

      <RugbyDecorations variant="mixed" />
      <CornerAccent position="top-left" />
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title: MATCH CENTRE */}
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl font-heading text-center text-white tracking-widest uppercase mb-16 italic font-bold">
            Match Centre
          </h2>
        </ScrollReveal>

        {/* 1. Spotlight Upcoming Match Card (HK Rugby inspired split-gradient design) */}
        <ScrollReveal delay={0.1}>
          <Tilt3DCard tiltAmount={1}>
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-linear-to-r from-clubhouse-green via-[#003820] to-[#051C12] p-8 md:p-12 mb-10 group hover:border-clubhouse-gold/30 transition-all duration-500">
              
              {/* Top Row / Badges */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                {/* Slanted Date Badge */}
                <div className="bg-white text-rich-black font-heading text-lg md:text-xl px-8 py-1.5 transform -skew-x-12 inline-block font-black shadow-lg">
                  {spotlightDate.day} {spotlightDate.month} | {spotlightDate.weekday}
                </div>
                
                {/* Competition Tag */}
                <div className="flex flex-col items-center md:items-end">
                  <span className="text-clubhouse-gold text-[10px] font-black uppercase tracking-[0.25em] mb-1">
                    Upcoming Match
                  </span>
                  <span className="bg-white/10 text-white border border-white/15 text-[10px] font-bold tracking-widest px-4 py-1 rounded-full uppercase">
                    {spotlightMatch.competition}
                  </span>
                </div>
              </div>

              {/* Matchup row (Left Team vs Right Team) */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8 md:gap-4 my-8">
                
                {/* Left Team: Home Team */}
                <div className="md:col-span-4 flex flex-col items-center md:items-end text-center md:text-right">
                  <div className="w-24 h-24 rounded-full border border-white/10 bg-black/30 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500 p-4 mb-4">
                    {spotlightMatch.homeTeam.logo ? (
                      <Image 
                        src={spotlightMatch.homeTeam.logo} 
                        alt={spotlightMatch.homeTeam.name} 
                        width={80} 
                        height={80} 
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xl font-heading text-white">{spotlightMatch.homeTeam.name.substring(0, 3).toUpperCase()}</span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading text-white tracking-wide uppercase leading-none">
                    {spotlightMatch.homeTeam.name}
                  </h3>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-1">Sables</span>
                </div>

                {/* Center: VS Circle */}
                <div className="md:col-span-4 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-rich-black/80 border-2 border-white/10 flex items-center justify-center shadow-lg">
                    <span className="font-heading text-xl text-clubhouse-gold tracking-wide italic font-black">VS</span>
                  </div>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-2">{spotlightMatch.round}</span>
                </div>

                {/* Right Team: Away Team */}
                <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="w-24 h-24 rounded-full border border-white/10 bg-black/30 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500 p-4 mb-4">
                    {spotlightMatch.awayTeam.logo ? (
                      <Image 
                        src={spotlightMatch.awayTeam.logo} 
                        alt={spotlightMatch.awayTeam.name} 
                        width={80} 
                        height={80} 
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xl font-heading text-white">{spotlightMatch.awayTeam.name.substring(0, 3).toUpperCase()}</span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading text-white tracking-wide uppercase leading-none">
                    {spotlightMatch.awayTeam.name}
                  </h3>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-1">Opponent</span>
                </div>

              </div>

              {/* Bottom details & CTA */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10 mt-8">
                
                {/* Details info */}
                <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3 text-white/70 text-xs font-body font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-clubhouse-gold" />
                    <span>{spotlightMatch.time} CAT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-clubhouse-gold" />
                    <span>{spotlightMatch.venue}</span>
                  </div>
                </div>

                {/* Slanted CTA Button */}
                <Link href="/match-centre">
                  <button className="relative group/btn font-heading tracking-widest text-xs uppercase bg-clubhouse-gold text-rich-black font-black px-8 py-3.5 clip-slanted shadow-xl hover:bg-white hover:text-clubhouse-green transition-all duration-300">
                    View Match Details +
                  </button>
                </Link>
              </div>

            </div>
          </Tilt3DCard>
        </ScrollReveal>

        {/* 2. Secondary Match Row (Bottom Strip) */}
        <ScrollReveal delay={0.2}>
          <div className="relative w-full rounded-xl overflow-hidden border border-white/5 bg-[#0F0F0F] flex flex-col md:flex-row items-stretch shadow-lg">
            
            {/* Left Date Sidebar */}
            <div className="w-full md:w-28 bg-[#161616] border-b md:border-b-0 md:border-r border-white/5 flex flex-row md:flex-col items-center justify-between md:justify-center p-4 md:py-6 text-center shrink-0 font-heading">
              <div className="flex md:flex-col items-center gap-2 md:gap-0">
                <span className="text-3xl text-white font-black leading-none">{secondaryDate.day}</span>
                <span className="text-xs text-clubhouse-gold font-bold uppercase tracking-widest md:mt-1">{secondaryDate.month}</span>
              </div>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider md:mt-2 font-body">
                {secondaryDate.weekday}
              </span>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-between p-6 gap-6">
              
              {/* Tournament and Matchup details */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
                <span className="bg-white/5 text-white/60 border border-white/10 text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded uppercase">
                  {secondaryMatch.competition} • {secondaryMatch.round}
                </span>
                
                <div className="flex items-center gap-4">
                  {/* Home Team */}
                  <span className="text-white font-heading text-lg uppercase tracking-wide">{secondaryMatch.homeTeam.name}</span>
                  {secondaryMatch.homeTeam.logo && (
                    <Image src={secondaryMatch.homeTeam.logo} alt={secondaryMatch.homeTeam.name} width={24} height={24} className="object-contain shrink-0" />
                  )}
                  
                  {/* VS */}
                  <span className="text-clubhouse-gold font-heading text-sm italic font-bold">VS</span>
                  
                  {/* Away Team */}
                  {secondaryMatch.awayTeam.logo && (
                    <Image src={secondaryMatch.awayTeam.logo} alt={secondaryMatch.awayTeam.name} width={24} height={24} className="object-contain shrink-0" />
                  )}
                  <span className="text-white font-heading text-lg uppercase tracking-wide">{secondaryMatch.awayTeam.name}</span>
                </div>
              </div>

              {/* Time & Location */}
              <div className="flex flex-col sm:flex-row items-center gap-6 text-white/50 text-xs font-body font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-clubhouse-gold/60" />
                  <span>{secondaryMatch.time} CAT</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-clubhouse-gold/60" />
                  <span className="max-w-[200px] truncate">{secondaryMatch.venue.split(",")[0]}</span>
                </div>
              </div>

            </div>

          </div>
        </ScrollReveal>

        {/* 3. Bottom Button: View Match Centre */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mt-12">
            <Link href="/match-centre">
              <button className="inline-flex items-center gap-2 font-heading tracking-widest text-xs uppercase border-2 border-white/10 hover:border-clubhouse-gold/50 text-white hover:text-clubhouse-gold px-8 py-3.5 clip-slanted transition-all duration-300 bg-transparent">
                View Match Centre +
              </button>
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
