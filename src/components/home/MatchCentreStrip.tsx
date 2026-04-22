"use client";

import { motion } from "framer-motion";

import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal, StaggerContainer, staggerItemVariants, Tilt3DCard, GlowButton } from "../ui/animations";
import { RugbyDecorations, CornerAccent } from "../ui/RugbyDecorations";

import { type Match as DataMatch } from "@/lib/data-fetcher";

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
}

export default function MatchCentreStrip({ initialMatches = [] }: MatchCentreStripProps) {
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
    isFeatured: idx === 0, // Feature the first upcoming match
  }));

  
  const featuredMatch = fixtures.find(f => f.isFeatured) || fixtures[0];
  const secondaryMatches = fixtures.filter(m => m.id !== featuredMatch?.id).slice(0, 3);

  return (
    <section 
      className="py-16 lg:py-24 relative overflow-hidden"
      id="match-centre"
    >
      {/* Background Media with Parallax-ready feel */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image 
          src="/images/events/africa-cup.jpg" 
          alt="Stadium Background" 
          fill 
          sizes="100vw"
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
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                Match Centre
              </h2>
            </div>
            
            <Link href="/match-centre" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <span className="text-[10px] font-black uppercase tracking-widest">View Full Schedule</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Featured Match - Cinematic Teaser */}
        {featuredMatch && (
          <ScrollReveal delay={0.1}>
            <Tilt3DCard tiltAmount={1}>
              <div className="relative bg-white/5 rounded-2xl overflow-hidden mb-12 border border-white/10 group glow-green-card">
                <div className="absolute inset-0 z-0">
                  <Image 
                    src="/images/media/vid2.jpg" 
                    alt="Focus background" 
                    fill
                    sizes="100vw"
                    className="object-cover opacity-30 blur-xs transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-rich-black via-rich-black/60 to-transparent" />
                </div>

                <div className="relative p-6 md:p-10 lg:p-16">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                    
                    {/* Rivalry Visuals */}
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                      
                      {/* Teams - Large Visual */}
                      <div className="flex items-center gap-8 md:gap-12">
                        <div className="flex flex-col items-center gap-4">
                          <motion.div 
                            whileHover={{ scale: 1.1, rotate: -3 }}
                            className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 relative drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                          >
                            {featuredMatch.homeTeam.logo ? (
                              <Image src={featuredMatch.homeTeam.logo} alt={featuredMatch.homeTeam.name} fill sizes="128px" className="object-contain" />
                            ) : (
                              <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center text-white/50 font-black uppercase">
                                {featuredMatch.homeTeam.name.substring(0, 3)}
                              </div>
                            )}
                          </motion.div>
                          <span className="text-white font-black text-xl md:text-2xl uppercase tracking-widest leading-none">{featuredMatch.homeTeam.name}</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="h-4 md:h-10 w-px bg-white/10 mb-2" />
                          <span className="text-zru-gold italic font-black text-2xl md:text-4xl">VS</span>
                          <div className="h-4 md:h-10 w-px bg-white/10 mt-2" />
                        </div>

                        <div className="flex flex-col items-center gap-4">
                          <motion.div 
                            whileHover={{ scale: 1.1, rotate: 3 }}
                            className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 relative drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                          >
                            {featuredMatch.awayTeam.logo ? (
                              <Image src={featuredMatch.awayTeam.logo} alt={featuredMatch.awayTeam.name} fill sizes="128px" className="object-contain" />
                            ) : (
                              <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center text-white/50 font-black uppercase">
                                {featuredMatch.awayTeam.name.substring(0, 3)}
                              </div>
                            )}
                          </motion.div>
                          <span className="text-white font-black text-xl md:text-2xl uppercase tracking-widest leading-none">{featuredMatch.awayTeam.name}</span>
                        </div>
                      </div>

                      {/* Match Info - Simplified Teaser */}
                      <div className="flex-1 max-w-md text-center lg:text-left space-y-8">
                        <div className="space-y-4">
                          <span className="text-zru-gold text-xs font-black uppercase tracking-[0.3em] block">{featuredMatch.competition}</span>
                          <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase italic leading-[0.8] tracking-tighter text-glow-green">
                            The Sables Return
                          </h3>
                          <p className="text-white/60 text-sm font-medium tracking-tight max-w-xs mx-auto lg:mx-0">
                            Witness the African Champions in action. Zimbabwe hosts the first major test of the 2026 season.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pb-8 border-b border-white/10">
                          <div className="space-y-1">
                            <span className="text-white/30 text-[9px] font-black uppercase tracking-widest block">Date & Time</span>
                            <span className="text-white font-bold text-sm block tracking-tighter">{featuredMatch.date} • {featuredMatch.time}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-white/30 text-[9px] font-black uppercase tracking-widest block">Venue</span>
                            <span className="text-white font-bold text-sm block tracking-tighter">{featuredMatch.venue}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                          <Link href={`/matches/${featuredMatch.id}`}>
                            <GlowButton 
                              className="bg-white text-rich-black px-6 py-4 md:px-10 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] rounded transition-all"
                              glowColor="rgba(255, 255, 255, 0.3)"
                            >
                              Match Tickets
                            </GlowButton>
                          </Link>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </Tilt3DCard>
          </ScrollReveal>
        )}

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
