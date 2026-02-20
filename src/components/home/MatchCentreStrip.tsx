"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Calendar, MapPin, Clock, Filter, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal, StaggerContainer, staggerItemVariants, Tilt3DCard, GlowButton } from "../ui/animations";
import { RugbyDecorations, CornerAccent } from "../ui/RugbyDecorations";
import { StripedBackground } from "../ui/StripedBackground";

// Match types for filtering
const matchCategories = [
  { id: "all", label: "All Matches" },
  { id: "international", label: "International" },
  { id: "domestic", label: "Domestic" },
  { id: "women", label: "Women" },
  { id: "youth", label: "Youth" },
];

const matches = [
  {
    id: 1,
    competition: "NATIONS CUP",
    homeTeam: "TONGA",
    awayTeam: "ZIM SABLES",
    homeLogo: "/images/teams/tonga.png",
    awayLogo: "/images/teams/zimbabwe.png",
    date: "04 JULY 2026",
    time: "TBA",
    venue: "USA",
    category: "international",
    isFeatured: true,
  },
  {
    id: 2,
    competition: "NATIONS CUP",
    homeTeam: "USA",
    awayTeam: "ZIM SABLES",
    homeLogo: "/images/teams/usa.svg",
    awayLogo: "/images/teams/zimbabwe.png",
    date: "11 JULY 2026",
    time: "TBA",
    venue: "USA",
    category: "international",
    isFeatured: false,
  },
  {
    id: 3,
    competition: "NATIONS CUP",
    homeTeam: "CANADA",
    awayTeam: "ZIM SABLES",
    homeLogo: "/images/teams/canada.svg",
    awayLogo: "/images/teams/zimbabwe.png",
    date: "18 JULY 2026",
    time: "TBA",
    venue: "CANADA",
    category: "international",
    isFeatured: false,
  },
  {
    id: 4,
    competition: "NATIONS CUP",
    homeTeam: "SAMOA",
    awayTeam: "ZIM SABLES",
    homeLogo: "/images/teams/samoa.png",
    awayLogo: "/images/teams/zimbabwe.png",
    date: "07 NOV 2026",
    time: "TBA",
    venue: "ENGLAND",
    category: "international",
    isFeatured: false,
  },
  {
    id: 5,
    competition: "NATIONS CUP",
    homeTeam: "URUGUAY",
    awayTeam: "ZIM SABLES",
    homeLogo: "/images/teams/uruguay.png",
    awayLogo: "/images/teams/zimbabwe.png",
    date: "14 NOV 2026",
    time: "TBA",
    venue: "ENGLAND",
    category: "international",
    isFeatured: false,
  },
  {
    id: 6,
    competition: "NATIONS CUP",
    homeTeam: "CHILE",
    awayTeam: "ZIM SABLES",
    homeLogo: "/images/teams/chile.png",
    awayLogo: "/images/teams/zimbabwe.png",
    date: "21 NOV 2026",
    time: "TBA",
    venue: "ENGLAND",
    category: "international",
    isFeatured: false,
  },
];

export default function MatchCentreStrip() {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const filteredMatches = activeFilter === "all" 
    ? matches 
    : matches.filter(m => m.category === activeFilter);

  const featuredMatch = matches.find(m => m.isFeatured);

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
      className="bg-rich-black py-16 lg:py-20 relative overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/events/africa-cup.jpg" 
          alt="Background" 
          fill 
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-b from-rich-black via-rich-black/90 to-rich-black" />
      </div>

      {/* Rugby-themed decorative elements */}
      <RugbyDecorations variant="mixed" />
      <CornerAccent position="top-left" />
      <CornerAccent position="bottom-right" />
      
      {/* HK Rugby style diagonal stripes */}
      <StripedBackground variant="subtle" position="right" color="green" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-2">
                Match Centre
              </h2>
              <p className="text-white/60 text-sm max-w-md">
                All upcoming fixtures for Zimbabwe Rugby teams and competitions.
              </p>
            </div>
            
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2">
              {matchCategories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`
                    px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all
                    ${activeFilter === cat.id 
                      ? "bg-zru-gold text-rich-black" 
                      : "bg-white/10 text-white hover:bg-white/20"
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Featured Match - Full Width Card */}
        {featuredMatch && (
          <ScrollReveal delay={0.1}>
            <Tilt3DCard tiltAmount={3}>
              <div className="relative bg-rich-black rounded-xl overflow-hidden mb-8 shadow-2xl">
                <Image 
                  src="/images/media/vid2.jpg" 
                  alt="Featured Match" 
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-linear-to-r from-rich-black via-rich-black/80 to-transparent" />
                <div className="relative p-8 lg:p-10">
                  
                  {/* Top: Competition & Category */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`${getCategoryColor(featuredMatch.category)} px-3 py-1 text-[10px] font-bold uppercase rounded-full shadow-md`}>
                      {featuredMatch.category}
                    </span>
                    <span className="text-white/60 text-xs font-bold uppercase tracking-wider">
                      {featuredMatch.competition}
                    </span>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    {/* Left: Teams */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 lg:gap-6 mb-6">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 relative">
                            <Image src={featuredMatch.homeLogo} alt={featuredMatch.homeTeam} fill className="object-contain" />
                          </div>
                          <span className="text-white font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight">{featuredMatch.homeTeam}</span>
                        </div>
                        <div className="flex flex-col items-center px-2">
                          <span className="text-white/60 text-xl lg:text-2xl font-bold">VS</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 relative">
                            <Image src={featuredMatch.awayLogo} alt={featuredMatch.awayTeam} fill className="object-contain" />
                          </div>
                          <span className="text-white font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight">{featuredMatch.awayTeam}</span>
                        </div>
                      </div>
                      
                      {/* Match Details with Icons */}
                      <div className="flex flex-wrap gap-6 text-white/80 text-sm">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-zru-gold" />
                          <span className="font-semibold">{featuredMatch.time} CAT</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-zru-gold" />
                          <span>{featuredMatch.venue}</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* Right: Date Block & CTA */}
                    <div className="flex items-center gap-6">
                      {/* Prominent Date Display */}
                      <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                        <div className="text-zru-gold font-black text-5xl lg:text-6xl leading-none">
                          {featuredMatch.date.split(' ')[0]}
                        </div>
                        <div className="text-white font-bold text-lg uppercase tracking-wider">
                          {featuredMatch.date.split(' ')[1]}
                        </div>
                      </div>
                      
                      {/* CTA */}
                      <Link href={`/matches/${featuredMatch.id}`}>
                        <GlowButton 
                          className="bg-zru-red hover:bg-red-700 text-white px-6 py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-lg transition-colors"
                          glowColor="rgba(215, 25, 32, 0.4)"
                        >
                          View Match
                          <ChevronRight className="w-4 h-4" />
                        </GlowButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Tilt3DCard>
          </ScrollReveal>
        )}

        {/* Match Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.1}>
          {filteredMatches.filter(m => !m.isFeatured).map((match) => (
            <motion.div key={match.id} variants={staggerItemVariants}>
              <Link href={`/matches/${match.id}`} className="block group">
                <div className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md shadow-lg rounded-lg p-5 transition-all duration-300 h-full">
                  
                  {/* Top Row: Category + Competition */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`${getCategoryColor(match.category)} px-2 py-1 text-[9px] font-bold uppercase rounded`}>
                      {match.category}
                    </span>
                    <span className="text-white/60 text-[10px] font-bold uppercase">
                      {match.competition}
                    </span>
                  </div>
                  
                  {/* Teams */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col items-start w-2/5">
                      <div className="w-10 h-10 relative mb-2">
                        <Image src={match.homeLogo} alt={match.homeTeam} fill className="object-contain drop-shadow-md" />
                      </div>
                      <span className="text-white font-bold text-sm uppercase leading-tight">{match.homeTeam}</span>
                    </div>
                    
                    <div className="text-zru-gold font-black text-xs px-2 shrink-0 w-1/5 text-center">VS</div>
                    
                    <div className="flex flex-col items-end w-2/5 text-right">
                      <div className="w-10 h-10 relative mb-2">
                        <Image src={match.awayLogo} alt={match.awayTeam} fill className="object-contain drop-shadow-md" />
                      </div>
                      <span className="text-white font-bold text-sm uppercase leading-tight">{match.awayTeam}</span>
                    </div>
                  </div>
                  
                  {/* Date/Time/Venue */}
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex items-center gap-4 text-white/60 text-xs">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {match.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {match.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60 text-xs">
                      <MapPin className="w-3 h-3" /> {match.venue}
                    </div>
                  </div>
                  
                  {/* View Match Link */}
                  <div className="mt-4 flex items-center gap-1 text-zru-gold text-xs font-bold uppercase group-hover:gap-2 transition-all">
                    View Match <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* View All Link */}
        <ScrollReveal delay={0.4}>
          <div className="text-center mt-10">
            <Link href="/match-centre">
              <motion.button 
                className="text-white/60 hover:text-zru-gold text-sm font-bold uppercase tracking-wider flex items-center gap-2 mx-auto transition-colors"
                whileHover={{ x: 5 }}
              >
                View Full Match Centre <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
