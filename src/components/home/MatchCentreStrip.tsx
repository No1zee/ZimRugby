"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal, StaggerContainer, staggerItemVariants, Tilt3DCard, GlowButton } from "../ui/animations";
import { RugbyDecorations, CornerAccent } from "../ui/RugbyDecorations";

import { getLiveMatches, type Match as DataMatch } from "@/lib/data-fetcher";

// Match types for filtering
const matchCategories = [
  { id: "all", label: "All Matches" },
  { id: "Sables", label: "International" },
  { id: "domestic", label: "Domestic" },
  { id: "women", label: "Women" },
  { id: "youth", label: "Youth" },
];

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

export default function MatchCentreStrip() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  useEffect(() => {
    async function fetchFixtures() {
      try {
        const data = await getLiveMatches();
        const allFixtures: Fixture[] = data.map((m: DataMatch, idx: number) => ({
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
        setFixtures(allFixtures);
      } catch (error) {
        console.error('Failed to fetch fixtures:', error);
      }
    }
    fetchFixtures();
  }, []);
  
  const filteredMatches = activeFilter === "all" 
    ? fixtures 
    : fixtures.filter(m => m.category === activeFilter);

  const featuredMatch = fixtures.find(f => f.isFeatured) || fixtures[0];

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "international": return "bg-zru-gold text-rich-black";
      case "women": return "bg-pink-500 text-white";
      case "youth": return "bg-blue-500 text-white";
      case "domestic": return "bg-zru-green text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <section 
      className="bg-rich-black py-20 lg:py-32 relative overflow-hidden"
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
                <span className="text-zru-gold text-xs font-black uppercase tracking-[0.3em]">Live & Upcoming</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                Match Centre
              </h2>
            </div>
            
            {/* Filter Bar - Horizontal Scroll on Mobile */}
            <div className="flex gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
              {matchCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`
                    whitespace-nowrap px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-full transition-all border
                    ${activeFilter === cat.id 
                      ? "bg-zru-gold text-rich-black border-zru-gold scale-105 shadow-[0_0_20px_rgba(255,215,0,0.3)]" 
                      : "bg-white/5 text-white/60 border-white/5 hover:border-white/20 hover:text-white"
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Featured Match - Cinematic Redesign */}
        {featuredMatch && (
          <ScrollReveal delay={0.1}>
            <Tilt3DCard tiltAmount={2}>
              <div className="relative bg-white/5 rounded-2xl overflow-hidden mb-12 border border-white/10 group">
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

                <div className="relative p-10 lg:p-16">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                    
                    {/* Rivalry Visuals */}
                    <div className="flex items-center gap-8 md:gap-16">
                      <div className="flex flex-col items-center gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          className="w-24 h-24 md:w-32 md:h-32 relative drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                          {featuredMatch.homeTeam.logo ? (
                            <Image src={featuredMatch.homeTeam.logo} alt={featuredMatch.homeTeam.name} fill sizes="128px" className="object-contain" />
                          ) : (
                            <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center text-white/20 font-black">ZIM</div>
                          )}
                        </motion.div>
                        <span className="text-white font-black text-xl md:text-2xl uppercase tracking-widest">{featuredMatch.homeTeam.name}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="h-20 w-px bg-white/10 mb-4" />
                        <span className="text-zru-gold italic font-black text-3xl md:text-4xl">VS</span>
                        <div className="h-20 w-px bg-white/10 mt-4" />
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-24 h-24 md:w-32 md:h-32 relative drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                          {featuredMatch.awayTeam.logo ? (
                            <Image src={featuredMatch.awayTeam.logo} alt={featuredMatch.awayTeam.name} fill sizes="128px" className="object-contain" />
                          ) : (
                            <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center text-white/20 font-black">OPP</div>
                          )}
                        </motion.div>
                        <span className="text-white font-black text-xl md:text-2xl uppercase tracking-widest">{featuredMatch.awayTeam.name}</span>
                      </div>
                    </div>

                    {/* Match Info & CTA */}
                    <div className="flex-1 max-w-md text-center lg:text-left space-y-8">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                          <span className={`${getCategoryColor(featuredMatch.category)} px-3 py-1 text-[10px] font-black uppercase rounded shadow-lg`}>
                            {featuredMatch.category}
                          </span>
                          <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                            {featuredMatch.competition}
                          </span>
                        </div>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase italic leading-[0.8] tracking-tighter text-glow-green">
                          The Africa Cup Defence
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-6 pb-8 border-b border-white/10">
                        <div className="space-y-1">
                          <span className="text-white/30 text-[9px] font-black uppercase tracking-widest block">Date & Time</span>
                          <span className="text-white font-bold text-sm block">{featuredMatch.date} • {featuredMatch.time}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-white/30 text-[9px] font-black uppercase tracking-widest block">Venue</span>
                          <span className="text-white font-bold text-sm block">{featuredMatch.venue}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                        <Link href={`/matches/${featuredMatch.id}`}>
                          <GlowButton 
                            className="bg-white text-rich-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] rounded transition-all"
                            glowColor="rgba(255, 255, 255, 0.3)"
                          >
                            Get Tickets
                          </GlowButton>
                        </Link>
                        <Link href={`/matches/${featuredMatch.id}`} className="text-white/60 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                          Match Insights <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tilt3DCard>
          </ScrollReveal>
        )}

        {/* Secondary Match Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
          {filteredMatches.filter(m => !m.isFeatured).map((match) => (
            <motion.div key={match.id} variants={staggerItemVariants}>
              <Link href={`/matches/${match.id}`} className="block group">
                <div className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 p-6 rounded-xl transition-all duration-500 h-full flex flex-col justify-between group-hover:-translate-y-1">
                  
                  <div className="space-y-6">


                    <div className="flex items-center justify-between px-2">
                      <div className="flex flex-col items-center gap-2 w-1/3">
                         <div className="w-10 h-10 relative flex items-center justify-center overflow-hidden">
                            {match.homeTeam.logo ? (
                                <Image src={match.homeTeam.logo} alt={match.homeTeam.name} fill sizes="40px" className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : (
                                <div className="w-full h-full bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40 group-hover:text-white transition-colors">
                                    {match.homeTeam.name.substring(0, 3).toUpperCase()}
                                </div>
                            )}
                         </div>
                         <span className="text-white/80 font-bold text-[10px] uppercase text-center">{match.homeTeam.name}</span>
                      </div>
                      
                      <span className="text-white/20 italic font-black text-sm">VS</span>

                      <div className="flex flex-col items-center gap-2 w-1/3">
                         <div className="w-10 h-10 relative flex items-center justify-center overflow-hidden">
                            {match.awayTeam.logo ? (
                                <Image src={match.awayTeam.logo} alt={match.awayTeam.name} fill sizes="40px" className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : (
                                <div className="w-full h-full bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40 group-hover:text-white transition-colors">
                                    {match.awayTeam.name.substring(0, 3).toUpperCase()}
                                </div>
                            )}
                         </div>
                         <span className="text-white/80 font-bold text-[10px] uppercase text-center">{match.awayTeam.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-white/60 font-bold text-[10px] block">{match.date}</span>
                      <span className="text-white/40 text-[9px] block uppercase">{match.venue}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-rich-black transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>

        <ScrollReveal delay={0.4}>
          <div className="text-center mt-16">
            <Link href="/match-centre">
              <button 
                className="group flex flex-col items-center gap-4 transition-all"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-zru-gold group-hover:bg-zru-gold transition-all">
                  <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-1" />
                </div>
                <span className="text-white/30 group-hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-colors">
                  Explore Full Season
                </span>
              </button>
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
