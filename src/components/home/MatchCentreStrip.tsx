"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Clock, MapPin, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal, Tilt3DCard } from "../ui/animations";
import { CornerAccent } from "../ui/RugbyDecorations";

import { type Match as DataMatch } from "@/lib/data-fetcher";
import type { FixtureTwinData } from "@/lib/api/fixtures";
import type { RankingsData } from "@/lib/api/rankings";

interface MatchCentreStripProps {
  initialMatches?: DataMatch[];
  twinData: FixtureTwinData;
  rankingsData: RankingsData;
}

export default function MatchCentreStrip({ initialMatches = [], twinData, rankingsData }: MatchCentreStripProps) {
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

  // Helper to parse date string (e.g. "25 April, 2026") into day, month, weekday
  const parseMatchDate = (dateStr: string) => {
    try {
      const parts = dateStr.replace(",", "").split(" ");
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
    return { day: "06", month: "JUL", weekday: "SAT" };
  };

  const spotlightDate = parseMatchDate(spotlightMatch.date);
  const secondaryDate = parseMatchDate(secondaryMatch.date);

  return (
    <section 
      className="py-8 lg:py-14 bg-transparent relative overflow-hidden border-t border-white/5"
      id="match-centre"
    >
      {/* Background Media with subtle stadium overlay */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <Image 
          src="/images/events/africa-cup.jpg" 
          alt="Stadium Background" 
          fill 
          loading="lazy"
          sizes="100vw"
          quality={40}
          className="object-cover scale-105 blur-xs"
        />
        <div className="absolute inset-0 bg-linear-to-b from-rich-black via-rich-black/80 to-rich-black" />
      </div>

      <CornerAccent position="top-left" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        


        {/* 12-Column Grid Layout (Spotlight Fixture + Rankings Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
          
          {/* Main Card (8-Columns) */}
          <div className="lg:col-span-8 flex">
            <ScrollReveal className="w-full flex" delay={0.1}>
              <Tilt3DCard className="w-full flex" tiltAmount={0.8}>
                <div className="relative w-full rounded-2xl overflow-hidden border border-zru-green/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-gradient-to-br from-zru-green/[0.36] via-zru-green/[0.12] to-zru-green/[0.02] backdrop-blur-xl p-5 md:p-12 flex flex-col justify-between group hover:border-zru-green/60 transition-all duration-500">
                  
                  {/* Dynamic Radial Spotlights inside the card */}
                  <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-zru-green/5 blur-3xl pointer-events-none z-0" />
                  <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-zru-green/5 blur-3xl pointer-events-none z-0" />

                  {/* Top Row / Badges */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 md:mb-8 z-10">
                    {/* Slanted Date Badge */}
                    <div className="bg-neutral-900/90 border border-white/10 text-white font-heading text-base px-6 py-2 transform -skew-x-12 inline-block font-black shadow-lg">
                      <span className="border-l-2 border-zru-green pl-3 block transform skew-x-12">
                        {spotlightDate.day} {spotlightDate.month} | {spotlightDate.weekday}
                      </span>
                    </div>
                    
                    {/* Competition Tag */}
                    <div className="flex flex-col items-center sm:items-end">
                      <span className="text-zru-green text-[9px] font-black uppercase tracking-[0.25em] mb-1">
                        Upcoming Match
                      </span>
                      <span className="bg-zru-green/20 text-white border border-zru-green/30 text-[9px] font-black tracking-widest px-3 py-1 rounded-sm uppercase">
                        {spotlightMatch.competition}
                      </span>
                    </div>
                  </div>

                  {/* Matchup row (Left Team vs Right Team) */}
                  <div className="grid grid-cols-3 md:grid-cols-12 items-center gap-2 md:gap-4 my-6 md:my-8 z-10 relative">
                    
                    {/* Background Neon Clashing Line */}
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[150px] bg-gradient-to-b from-transparent via-zru-green/30 to-transparent z-0" />

                    {/* Left Team: Zimbabwe Sables */}
                    <div className="col-span-1 md:col-span-4 flex flex-col items-center md:items-end text-center md:text-right z-10">
                      {/* Shield Crest Holder */}
                      <div className="w-16 h-16 md:w-24 md:h-24 rotate-[45deg] rounded-lg border border-zru-green/30 bg-neutral-900/60 flex items-center justify-center overflow-hidden shadow-xl shadow-zru-green/5 group-hover:scale-105 group-hover:border-zru-green/50 transition-all duration-500 mb-4 md:mb-6 relative">
                        <div className="-rotate-[45deg] p-2 md:p-4 w-full h-full flex items-center justify-center font-heading text-white font-bold flex-col gap-1 select-none">
                          {spotlightMatch.homeTeam.logo ? (
                            <Image 
                              src={spotlightMatch.homeTeam.logo} 
                              alt={spotlightMatch.homeTeam.name} 
                              width={70} 
                              height={70} 
                              className="w-8 h-8 md:w-[70px] md:h-[70px] object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] -rotate-[45deg]"
                            />
                          ) : (
                            <span className="text-sm md:text-xl -rotate-[45deg]">{spotlightMatch.homeTeam.name.substring(0, 3).toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-xs sm:text-sm md:text-2xl font-heading text-white tracking-wider uppercase leading-tight md:leading-none font-black break-words w-full drop-shadow-md">
                        {spotlightMatch.homeTeam.name}
                      </h3>
                      <span className="text-white/40 text-[8px] md:text-[9px] font-bold uppercase tracking-wider mt-1 md:mt-2 font-body hidden sm:block">Sables XV</span>
                    </div>

                    {/* Center: VS Gold Ring */}
                    <div className="col-span-1 md:col-span-4 flex flex-col items-center justify-center z-10">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg relative group/vs">
                        {/* Green Aura */}
                        <div className="absolute inset-0 rounded-full bg-zru-green/5 blur-md" />
                        <span className="font-heading text-sm md:text-lg text-zru-green tracking-wide italic font-black relative z-10">VS</span>
                      </div>
                      <span className="text-[8px] md:text-[10px] text-white/50 font-black uppercase tracking-widest mt-2 md:mt-3 font-subheading bg-white/5 px-2 md:px-3 py-0.5 rounded-full text-center">{spotlightMatch.round}</span>
                    </div>

                    {/* Right Team: Opponent */}
                    <div className="col-span-1 md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left z-10">
                      {/* Shield Crest Holder */}
                      <div className="w-16 h-16 md:w-24 md:h-24 rotate-[45deg] rounded-lg border border-white/10 bg-neutral-900/60 flex items-center justify-center overflow-hidden shadow-xl group-hover:scale-105 group-hover:border-white/30 transition-all duration-500 mb-4 md:mb-6 relative">
                        <div className="-rotate-[45deg] p-2 md:p-4 w-full h-full flex items-center justify-center font-heading text-white font-bold flex-col gap-1 select-none">
                          {spotlightMatch.awayTeam.logo ? (
                            <Image 
                              src={spotlightMatch.awayTeam.logo} 
                              alt={spotlightMatch.awayTeam.name} 
                              width={70} 
                              height={70} 
                              className="w-8 h-8 md:w-[70px] md:h-[70px] object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] -rotate-[45deg]"
                            />
                          ) : (
                            <span className="text-sm md:text-xl -rotate-[45deg]">{spotlightMatch.awayTeam.name.substring(0, 3).toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-xs sm:text-sm md:text-2xl font-heading text-white tracking-wider uppercase leading-tight md:leading-none font-black break-words w-full drop-shadow-md">
                        {spotlightMatch.awayTeam.name}
                      </h3>
                      <span className="text-white/40 text-[8px] md:text-[9px] font-bold uppercase tracking-wider mt-1 md:mt-2 font-body hidden sm:block">Opponent</span>
                    </div>

                  </div>

                  {/* Bottom details & CTA */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5 mt-8 z-10">
                    {/* Details info */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-white/60 text-[11px] font-body font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-zru-green" />
                        <span>{spotlightMatch.time} CAT</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-zru-green" />
                        <span>{spotlightMatch.venue}</span>
                      </div>
                    </div>

                    {/* Slanted CTA Button */}
                    <Link href="/match-centre">
                      <button className="relative group/btn font-subheading tracking-widest text-[10px] uppercase bg-zru-green text-white font-black px-6 py-3.5 clip-slanted shadow-xl shadow-zru-green/30 hover:bg-white hover:text-rich-black transition-all duration-300 cursor-pointer">
                        Match details
                      </button>
                    </Link>
                  </div>

                </div>
              </Tilt3DCard>
            </ScrollReveal>
          </div>

          {/* Sidebar Rankings Card (4-Columns) */}
          <div className="lg:col-span-4 flex">
            <ScrollReveal className="w-full flex" delay={0.2}>
              <div className="relative w-full rounded-2xl overflow-hidden border border-zru-green/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-gradient-to-br from-zru-green/[0.16] via-zru-green/[0.06] to-zru-green/[0.01] backdrop-blur-xl p-6 flex flex-col justify-between group hover:border-zru-green/40 transition-all duration-500">
                
                {/* Header */}
                <div className="space-y-1 mb-6">
                  <span className="text-zru-green text-[9px] font-black uppercase tracking-[0.25em] font-subheading block">
                    Official Standings
                  </span>
                  <div className="w-12 h-[1.5px] bg-zru-green" />
                </div>

                {/* Big Stat Row */}
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div className="card-green border p-4 rounded-xl relative overflow-hidden flex flex-col justify-between group/card">
                    <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest block mb-2 font-subheading">World</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-heading font-black text-white">#{rankingsData.world.position}</span>
                      {rankingsData.world.trend === "up" && (
                        <span className="text-[10px] font-black text-emerald-500 flex items-center">
                          <ChevronUp className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-green border p-4 rounded-xl relative overflow-hidden flex flex-col justify-between group/card">
                    <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest block mb-2 font-subheading">Africa</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-heading font-black text-white">#{rankingsData.africa.position}</span>
                      {rankingsData.africa.trend === "up" && (
                        <span className="text-[10px] font-black text-emerald-500 flex items-center">
                          <ChevronUp className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rivals Table */}
                <div className="space-y-3 mt-4">
                  <span className="text-white/30 text-[9px] font-black uppercase tracking-widest block font-subheading">African Rivals</span>
                  <div className="space-y-2.5">
                    {rankingsData.rivals.map((rival, index) => (
                      <div key={index} className="flex items-center justify-between card-green border px-4 py-2.5 rounded-lg">
                        <div className="flex items-center gap-3">
                          {rival.logo && (
                            <img loading="lazy" src={rival.logo} alt={rival.name} className="w-[18px] h-[14px] object-cover rounded-xs" />
                          )}
                          <span className="text-[11px] font-body font-bold text-white/80">{rival.name}</span>
                        </div>
                        <span className="text-xs font-heading font-black text-white">Rank #{rival.position}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Tag */}
                <div className="pt-4 border-t border-white/5 mt-6 flex justify-between items-center text-[9px] text-white/40 font-body">
                  <span>Last Updated: {rankingsData.world.lastUpdated}</span>
                  <span className="flex items-center gap-1 text-emerald-500 font-bold uppercase">
                    <TrendingUp className="w-3 h-3" /> Upward Trend
                  </span>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* 2. Secondary Match Row (Bottom Strip) */}
        <ScrollReveal delay={0.25}>
          <div className="relative w-full rounded-xl overflow-hidden border border-zru-green/20 bg-gradient-to-r from-zru-green/[0.16] via-zru-green/[0.06] to-zru-green/[0.01] backdrop-blur-md flex flex-col md:flex-row items-stretch shadow-lg hover:border-zru-green/40 transition-colors duration-500">
            
            {/* Left Date Sidebar */}
            <div className="w-full md:w-28 bg-zru-green/[0.24] border-b md:border-b-0 md:border-r border-zru-green/30 flex flex-row md:flex-col items-center justify-between md:justify-center p-4 md:py-6 text-center shrink-0 font-heading">
              <div className="flex md:flex-col items-center gap-2 md:gap-0">
                <span className="text-2xl text-white font-black leading-none">{secondaryDate.day}</span>
                <span className="text-[10px] text-zru-green font-bold uppercase tracking-widest md:mt-1">{secondaryDate.month}</span>
              </div>
              <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider md:mt-2 font-body">
                {secondaryDate.weekday}
              </span>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-between p-6 gap-6">
              
              {/* Tournament and Matchup details */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
                <span className="bg-white/5 text-white/60 border border-white/10 text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-sm uppercase">
                  {secondaryMatch.competition} • {secondaryMatch.round}
                </span>
                
                <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                  {/* Home Team */}
                  <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-1.5 sm:gap-3 text-center sm:text-right">
                    <span className="text-white font-heading text-xs sm:text-base uppercase tracking-wide font-bold break-words w-full sm:w-auto leading-tight">{secondaryMatch.homeTeam.name}</span>
                    {secondaryMatch.homeTeam.logo && (
                      <div className="w-8 h-8 sm:w-auto sm:h-auto flex items-center justify-center bg-white/5 sm:bg-transparent rounded-full sm:rounded-none shrink-0 p-1 sm:p-0">
                        <img loading="lazy" src={secondaryMatch.homeTeam.logo} alt={secondaryMatch.homeTeam.name} className="w-[22px] h-[18px] object-contain" />
                      </div>
                    )}
                  </div>
                  
                  {/* VS */}
                  <div className="flex justify-center items-center">
                    <span className="text-zru-green font-heading text-[10px] sm:text-xs italic font-bold bg-white/5 sm:bg-transparent px-2 py-0.5 rounded-sm">VS</span>
                  </div>
                  
                  {/* Away Team */}
                  <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-1.5 sm:gap-3 text-center sm:text-left">
                    {secondaryMatch.awayTeam.logo && (
                      <div className="w-8 h-8 sm:w-auto sm:h-auto flex items-center justify-center bg-white/5 sm:bg-transparent rounded-full sm:rounded-none shrink-0 p-1 sm:p-0">
                        <img loading="lazy" src={secondaryMatch.awayTeam.logo} alt={secondaryMatch.awayTeam.name} className="w-[22px] h-[18px] object-contain" />
                      </div>
                    )}
                    <span className="text-white font-heading text-xs sm:text-base uppercase tracking-wide font-bold break-words w-full sm:w-auto leading-tight">{secondaryMatch.awayTeam.name}</span>
                  </div>
                </div>
              </div>

              {/* Time & Location */}
              <div className="flex flex-col sm:flex-row items-center gap-6 text-white/50 text-[11px] font-body font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-zru-green/60" />
                  <span>{secondaryMatch.time} CAT</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zru-green/60" />
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
              <button className="inline-flex items-center gap-2 font-subheading tracking-widest text-[10px] uppercase border border-white/10 hover:border-zru-green/50 text-white hover:text-zru-green px-8 py-3.5 clip-slanted transition-all duration-300 bg-transparent cursor-pointer">
                View Full Match Centre
              </button>
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
