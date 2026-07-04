"use client";

import { motion } from "framer-motion";

import { ArrowRight, ChevronRight, TrendingUp, TrendingDown, Minus, Trophy, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal, StaggerContainer, staggerItemVariants, Tilt3DCard, GlowButton } from "../ui/animations";
import { RugbyDecorations, CornerAccent } from "../ui/RugbyDecorations";

import { type Match as DataMatch } from "@/lib/data-fetcher";
import type { FixtureTwinData } from "@/lib/api/fixtures";
import type { RankingsData } from "@/lib/api/rankings";

interface Fixture {
  id: string;
  competition: string;
  round: string;
  date: string;
  time: string;
  venue: string;
  homeTeam: { name: string; logo?: string; score?: number };
  awayTeam: { name: string; logo?: string; score?: number };
  status: 'upcoming' | 'live' | 'finished';
  category: string; 
  isFeatured?: boolean;
}

interface MatchCentreStripProps {
  initialMatches?: DataMatch[];
  twinData: FixtureTwinData;
  rankingsData: RankingsData;
}

export default function MatchCentreStrip({ initialMatches = [], twinData, rankingsData }: MatchCentreStripProps) {
  const fixtures: Fixture[] = initialMatches.map((m: DataMatch, idx: number) => ({
    id: m.id,
    competition: m.competition,
    round: 'Standard',
    date: m.date,
    time: m.time,
    venue: m.venue,
    homeTeam: { ...m.homeTeam, score: m.score?.home },
    awayTeam: { ...m.awayTeam, score: m.score?.away },
    status: m.status,
    category: m.category,
    isFeatured: idx === 0,
  }));

  const secondaryMatches = fixtures.filter(m => m.id !== twinData.upcoming.id).slice(0, 3);

  return (
    <section 
      className="py-section relative overflow-hidden"
      id="match-centre"
    >
      {/* Background Media with Parallax-ready feel */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image 
          src="/images/events/africa-cup.jpg" 
          alt="Stadium Background" 
          fill 
          priority
          sizes="100vw"
          quality={60}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-rich-black via-transparent to-rich-black" />
      </div>

      <RugbyDecorations variant="mixed" />
      <CornerAccent position="top-left" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-1 bg-zru-gold" />
                <span className="text-zru-gold text-xs font-black uppercase tracking-[0.3em]">Season Teaser</span>
              </div>
              <h2 className="heading-1 text-white">
                Match Centre
              </h2>
            </div>
            
            <Link href="/match-centre" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <span className="text-[10px] font-black uppercase tracking-widest">View Full Schedule</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Twin Widget + Rankings Grid (SA Rugby inspired) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1: Previous Match Result */}
          <ScrollReveal delay={0.1}>
            <Tilt3DCard tiltAmount={1}>
              <div className="relative bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col justify-between h-full group hover:border-zru-gold/30 transition-all duration-500 overflow-hidden glow-green-card">
                
                {/* Header tag */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zru-gold text-[10px] font-black uppercase tracking-[0.2em]">{twinData.previous.competition}</span>
                  <span className="bg-white/10 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">LATEST RESULT</span>
                </div>

                {/* Score section */}
                <div className="flex items-center justify-between gap-4 my-4">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-3 flex-1 text-center">
                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/5 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                      {twinData.previous.homeTeam.logo ? (
                        <Image src={twinData.previous.homeTeam.logo} alt={twinData.previous.homeTeam.name} width={36} height={36} className="object-contain" />
                      ) : (
                        <span className="text-[10px] font-black text-white">{twinData.previous.homeTeam.name.substring(0, 3).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-white font-black text-[11px] uppercase tracking-wider leading-tight h-8 flex items-center">{twinData.previous.homeTeam.name}</span>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-center px-2">
                    <span className="text-3xl font-black italic tracking-tighter text-glow-green text-white">
                      {twinData.previous.homeTeam.score} - {twinData.previous.awayTeam.score}
                    </span>
                    <span className="text-[9px] text-white/40 font-bold uppercase mt-1">FT</span>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-3 flex-1 text-center">
                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/5 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                      {twinData.previous.awayTeam.logo ? (
                        <Image src={twinData.previous.awayTeam.logo} alt={twinData.previous.awayTeam.name} width={36} height={36} className="object-contain" />
                      ) : (
                        <span className="text-[10px] font-black text-white">{twinData.previous.awayTeam.name.substring(0, 3).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-white font-black text-[11px] uppercase tracking-wider leading-tight h-8 flex items-center">{twinData.previous.awayTeam.name}</span>
                  </div>
                </div>

                {/* Footer details */}
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-tight">
                    <Calendar className="w-3.5 h-3.5 text-zru-gold" />
                    <span>{twinData.previous.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-bold tracking-wider max-w-[150px] truncate">{twinData.previous.venue}</span>
                    <Link href="/media" className="text-[10px] font-black uppercase text-zru-gold hover:text-white transition-colors tracking-[0.15em] flex items-center gap-1">
                      <span>Report</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
                
              </div>
            </Tilt3DCard>
          </ScrollReveal>

          {/* Card 2: Upcoming Match Fixture */}
          <ScrollReveal delay={0.2}>
            <Tilt3DCard tiltAmount={1}>
              <div className="relative bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col justify-between h-full group hover:border-zru-gold/30 transition-all duration-500 overflow-hidden glow-green-card">
                
                {/* Header tag */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zru-gold text-[10px] font-black uppercase tracking-[0.2em]">{twinData.upcoming.competition}</span>
                  <span className="bg-zru-gold text-rich-black px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">NEXT FIXTURE</span>
                </div>

                {/* VS section */}
                <div className="flex items-center justify-between gap-4 my-4">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-3 flex-1 text-center">
                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/5 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                      {twinData.upcoming.homeTeam.logo ? (
                        <Image src={twinData.upcoming.homeTeam.logo} alt={twinData.upcoming.homeTeam.name} width={36} height={36} className="object-contain" />
                      ) : (
                        <span className="text-[10px] font-black text-white">{twinData.upcoming.homeTeam.name.substring(0, 3).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-white font-black text-[11px] uppercase tracking-wider leading-tight h-8 flex items-center">{twinData.upcoming.homeTeam.name}</span>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center px-2">
                    <span className="text-2xl font-black italic tracking-tighter text-zru-gold">VS</span>
                    <span className="bg-white/10 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider mt-2">
                      {twinData.upcoming.time}
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-3 flex-1 text-center">
                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/5 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                      {twinData.upcoming.awayTeam.logo ? (
                        <Image src={twinData.upcoming.awayTeam.logo} alt={twinData.upcoming.awayTeam.name} width={36} height={36} className="object-contain" />
                      ) : (
                        <span className="text-[10px] font-black text-white">{twinData.upcoming.awayTeam.name.substring(0, 3).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-white font-black text-[11px] uppercase tracking-wider leading-tight h-8 flex items-center">{twinData.upcoming.awayTeam.name}</span>
                  </div>
                </div>

                {/* Footer details */}
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-tight">
                    <Calendar className="w-3.5 h-3.5 text-zru-gold" />
                    <span>{twinData.upcoming.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-bold tracking-wider max-w-[150px] truncate">{twinData.upcoming.venue}</span>
                    {twinData.upcoming.ticketUrl ? (
                      <Link href={twinData.upcoming.ticketUrl}>
                        <GlowButton 
                          className="bg-white text-rich-black px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em] rounded transition-all cursor-none"
                          glowColor="rgba(255, 255, 255, 0.4)"
                        >
                          Tickets
                        </GlowButton>
                      </Link>
                    ) : (
                      <span className="text-[10px] text-white/40 uppercase font-black tracking-wider">TBA</span>
                    )}
                  </div>
                </div>
                
              </div>
            </Tilt3DCard>
          </ScrollReveal>

          {/* Card 3: Africa Rugby Rankings Callout */}
          <ScrollReveal delay={0.3}>
            <Tilt3DCard tiltAmount={1}>
              <div className="relative bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col justify-between h-full group hover:border-zru-gold/30 transition-all duration-500 overflow-hidden glow-green-card">
                
                {/* Header tag */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zru-gold text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>AFRICA CUP CHAMPIONS</span>
                  </span>
                  <span className="bg-white/10 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">OFFICIAL RANKINGS</span>
                </div>

                {/* Rankings details */}
                <div className="grid grid-cols-2 gap-4 my-2">
                  {/* Africa Rank */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider block mb-1">AFRICA</span>
                    <span className="text-3xl font-black italic text-glow-green text-white">#{rankingsData.africa.position}</span>
                    <div className="flex items-center gap-1 mt-1 text-[9px] font-bold uppercase tracking-tight text-zru-gold">
                      {rankingsData.africa.trend === "up" && <TrendingUp className="w-3 h-3" />}
                      {rankingsData.africa.trend === "down" && <TrendingDown className="w-3 h-3" />}
                      {rankingsData.africa.trend === "stable" && <Minus className="w-3 h-3" />}
                      <span>{rankingsData.africa.trend}</span>
                    </div>
                  </div>

                  {/* World Rank */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider block mb-1">WORLD</span>
                    <span className="text-3xl font-black italic text-glow-green text-white">#{rankingsData.world.position}</span>
                    <div className="flex items-center gap-1 mt-1 text-[9px] font-bold uppercase tracking-tight text-zru-gold">
                      {rankingsData.world.trend === "up" && <TrendingUp className="w-3 h-3" />}
                      {rankingsData.world.trend === "down" && <TrendingDown className="w-3 h-3" />}
                      {rankingsData.world.trend === "stable" && <Minus className="w-3 h-3" />}
                      <span>{rankingsData.world.trend}</span>
                    </div>
                  </div>
                </div>

                {/* Regional Rivals */}
                <div className="space-y-2 mt-4">
                  <span className="text-white/30 text-[9px] font-black uppercase tracking-widest block">REGIONAL RIVALS</span>
                  <div className="space-y-1.5">
                    {rankingsData.rivals.map((rival) => (
                      <div key={rival.name} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-2">
                          {rival.logo && (
                            <div className="w-4 h-3 relative">
                              <Image src={rival.logo} alt={rival.name} fill className="object-cover rounded-xs" />
                            </div>
                          )}
                          <span className="text-white/80 font-medium uppercase tracking-tight">{rival.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">#{rival.position}</span>
                          <span className="text-white/40 text-[9px]">{rival.points}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer details */}
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[9px] text-white/40 font-bold uppercase tracking-widest">
                  <span>PTS: {rankingsData.world.points}</span>
                  <span>AS OF {rankingsData.world.lastUpdated}</span>
                </div>
                
              </div>
            </Tilt3DCard>
          </ScrollReveal>

        </div>

        {/* Secondary Match Cards - Limited to 3 */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
          {secondaryMatches.map((match) => (
            <motion.div key={match.id} variants={staggerItemVariants}>
              <Link href={`/matches/${match.id}`} className="block group">
                <div className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 p-6 rounded-xl transition-all duration-500 h-full flex flex-col justify-between group-hover:-translate-y-1 glow-green-card">
                  
                  <div className="space-y-6">
                    <div className="border-b border-white/5 pb-4">
                      <span className="text-white text-2xl font-black italic tracking-tighter block uppercase">{match.date}</span>
                      <span className="text-white/60 text-[9px] font-bold block uppercase tracking-widest mt-1">{match.competition}</span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 relative opacity-80">
                          {match.homeTeam.logo ? (
                            <Image src={match.homeTeam.logo} alt={match.homeTeam.name} fill sizes="32px" className="object-contain" />
                          ) : (
                            <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center text-[8px] font-black">{match.homeTeam.name.substring(0, 3)}</div>
                          )}
                        </div>
                        <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none">{match.homeTeam.name}</span>
                      </div>
                      
                      <span className="text-white/50 italic font-black text-[10px]">VS</span>

                      <div className="flex items-center gap-3 text-right">
                        <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none">{match.awayTeam.name}</span>
                        <div className="w-8 h-8 relative opacity-80">
                          {match.awayTeam.logo ? (
                            <Image src={match.awayTeam.logo} alt={match.awayTeam.name} fill sizes="32px" className="object-contain" />
                          ) : (
                            <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center text-[8px] font-black">{match.awayTeam.name.substring(0, 3)}</div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-zru-gold tracking-[0.2em] group-hover:text-white transition-colors">Match Details</span>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-rich-black transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* Portal to Full Match Centre */}
        <ScrollReveal delay={0.4}>
          <div className="text-center mt-16">
            <Link href="/match-centre">
              <button 
                className="group flex flex-col items-center gap-4 transition-all"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-zru-gold group-hover:bg-zru-gold transition-all">
                  <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-1" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white/80 group-hover:text-white text-xs font-black uppercase tracking-[0.3em] transition-colors mb-1">
                    View Full Season
                  </span>
                  <span className="text-white/30 text-[9px] font-bold uppercase tracking-[0.4em]">
                    Portfolio
                  </span>
                </div>
              </button>
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
