"use client";

import { ArrowRight, ChevronRight, Clock, MapPin, TrendingUp, ChevronUp } from "lucide-react";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      if (typeof dateStr === "string") {
        const parts = dateStr.replace(",", "").split(" ");
        if (parts.length >= 2) {
          return {
            day: parts[0],
            month: parts[1].substring(0, 3).toUpperCase(),
            weekday: "SAT" // Default to Saturday for rugby matches
          };
        }
      }
    } catch {
      // Fallback
    }
    return { day: "06", month: "JUL", weekday: "SAT" };
  };

  const spotlightDate = parseMatchDate(spotlightMatch.date);
  const secondaryDate = parseMatchDate(secondaryMatch.date);

  return (
    <section 
      className="py-8 lg:py-14 bg-transparent relative overflow-hidden border-t border-black/5"
      id="match-centre"
    >


      <CornerAccent position="top-left" />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        


        {/* 12-Column Grid Layout (Spotlight Fixture + Rankings Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
          
          {/* Main Card (8-Columns) */}
          <div className="lg:col-span-8 flex">
            <ScrollReveal className="w-full flex" delay={0.1}>
              <Tilt3DCard className="w-full flex" tiltAmount={0.8}>
                <div className="relative w-full overflow-hidden card-dark p-6 md:p-12 flex flex-col justify-between group hover:border-zru-green/30 transition-all duration-500">
                  
                  {/* Dynamic Radial Spotlights inside the card */}
                  <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-zru-green/5 blur-3xl pointer-events-none z-0" />
                  <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-zru-green/5 blur-3xl pointer-events-none z-0" />

                  {/* Top Row / Badges */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 md:mb-8 z-10">
                    {/* Slanted Date Badge */}
                    <div className="bg-rich-black/90 border border-white/10 text-white font-heading text-base px-6 py-2 transform -skew-x-12 inline-block font-black shadow-lg">
                      <span className="border-l-2 border-zru-green pl-3 block transform skew-x-12">
                        {spotlightDate.day} {spotlightDate.month} | {spotlightDate.weekday}
                      </span>
                    </div>
                    
                    {/* Competition Tag */}
                    <div className="flex flex-col items-center sm:items-end">
                      <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.25em] mb-1">
                        Upcoming Match
                      </span>
                      <span className="text-rich-black/48 text-xs font-semibold tracking-[0.14em] uppercase">
                        {spotlightMatch.competition}
                      </span>
                    </div>
                  </div>

                  {/* Matchup row (Left Team vs Right Team) - Vertically aligned on mobile */}
                  <div className="flex flex-col md:grid md:grid-cols-12 items-center gap-6 md:gap-4 my-6 md:my-8 z-10 relative">
                    
                    {/* Background Neon Clashing Line */}
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent z-0" />
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[150px] bg-gradient-to-b from-transparent via-zru-green/30 to-transparent z-0" />

                    {/* Left Team: Zimbabwe Sables */}
                    <div className="flex flex-col items-center md:items-end text-center md:text-right z-10 md:col-span-4 w-full">
                      {/* Shield Crest Holder */}
                      <div className="w-16 h-16 md:w-24 md:h-24 rotate-[45deg] rounded-lg border border-zru-green/40 bg-gradient-to-br from-zru-green/[0.15] to-milk-white flex items-center justify-center overflow-hidden shadow-xl shadow-zru-green/20 group-hover:scale-105 group-hover:border-zru-green/60 group-hover:shadow-zru-green/30 transition-all duration-500 mb-3 md:mb-6 relative">
                        <div className="-rotate-[45deg] p-2 md:p-4 w-full h-full flex items-center justify-center font-heading text-rich-black font-bold flex-col gap-1 select-none">
                          {spotlightMatch.homeTeam.logo ? (
                            <Image 
                              src={spotlightMatch.homeTeam.logo} 
                              alt={spotlightMatch.homeTeam.name} 
                              width={80} 
                              height={80} 
                              className="w-10 h-10 md:w-[80px] md:h-[80px] object-contain drop-shadow-[0_0_12px_rgba(0,150,70,0.3)] -rotate-[45deg]"
                            />
                          ) : (
                            <span className="text-sm md:text-xl -rotate-[45deg]">{spotlightMatch.homeTeam.name.substring(0, 3).toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg md:text-2xl font-black text-rich-black tracking-tight uppercase leading-tight md:leading-none">
                        {spotlightMatch.homeTeam.name}
                      </h3>
                      <span className="text-zru-green text-[9px] font-black uppercase tracking-wider mt-1 md:mt-2 font-body">Sables XV</span>
                    </div>

                    {/* Center: VS Gold Ring */}
                    <div className="flex flex-col items-center justify-center z-10 md:col-span-4 py-2 md:py-0 w-full">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-milk-white border border-black/10 flex items-center justify-center shadow-lg relative group/vs">
                        <div className="absolute inset-0 rounded-full bg-zru-green/5 blur-md" />
                        <span className="font-heading text-sm md:text-lg text-zru-green tracking-wide italic font-black relative z-10">VS</span>
                      </div>
                      <span className="text-[9px] md:text-[10px] text-rich-black/50 font-black uppercase tracking-widest mt-2 md:mt-3 font-subheading bg-black/5 px-3 py-1 rounded-full text-center">{spotlightMatch.round}</span>
                    </div>

                    {/* Right Team: Opponent */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 md:col-span-4 w-full">
                      {/* Shield Crest Holder */}
                      <div className="w-16 h-16 md:w-24 md:h-24 rotate-[45deg] rounded-lg border border-black/10 bg-milk-white flex items-center justify-center overflow-hidden shadow-xl group-hover:scale-105 group-hover:border-black/30 transition-all duration-500 mb-3 md:mb-6 relative">
                        <div className="-rotate-[45deg] p-2 md:p-4 w-full h-full flex items-center justify-center font-heading text-rich-black font-bold flex-col gap-1 select-none">
                          {spotlightMatch.awayTeam.logo ? (
                            <Image 
                              src={spotlightMatch.awayTeam.logo} 
                              alt={spotlightMatch.awayTeam.name} 
                              width={70} 
                              height={70} 
                              className="w-8 h-8 md:w-[70px] md:h-[70px] object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] -rotate-[45deg]"
                            />
                          ) : (
                            <span className="text-sm md:text-xl -rotate-[45deg]">{spotlightMatch.awayTeam.name.substring(0, 3).toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg md:text-2xl font-black text-rich-black tracking-tight uppercase leading-tight md:leading-none">
                        {spotlightMatch.awayTeam.name}
                      </h3>
                      <span className="text-rich-black/40 text-[9px] font-bold uppercase tracking-wider mt-1 md:mt-2 font-body">Opponent</span>
                    </div>

                  </div>

                  {/* Bottom details & CTA */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-black/8 mt-8 z-10">
                    {/* Details info */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-rich-black/72 text-sm font-medium">
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
              <div className="relative w-full overflow-hidden card-dark p-6 flex flex-col justify-between group hover:border-zru-green/30 transition-all duration-500">
                
                {/* Header */}
                <div className="space-y-1 mb-6">
                  <span className="text-zru-green text-[9px] font-black uppercase tracking-[0.25em] font-subheading block">
                    Official Standings
                  </span>
                  <div className="w-12 h-[1.5px] bg-zru-green" />
                </div>

                {/* Big Stat Row */}
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div className="border border-black/5 bg-milk-white p-4 rounded-xl relative overflow-hidden flex flex-col justify-between group/card">
                    <span className="text-rich-black/40 text-[9px] font-bold uppercase tracking-widest block mb-2 font-subheading">World</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-heading font-black text-rich-black">#{rankingsData.world.position}</span>
                      {rankingsData.world.trend === "up" && (
                        <span className="text-[10px] font-black text-emerald-600 flex items-center">
                          <ChevronUp className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border border-black/5 bg-milk-white p-4 rounded-xl relative overflow-hidden flex flex-col justify-between group/card">
                    <span className="text-rich-black/40 text-[9px] font-bold uppercase tracking-widest block mb-2 font-subheading">Africa</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-heading font-black text-rich-black">#{rankingsData.africa.position}</span>
                      {rankingsData.africa.trend === "up" && (
                        <span className="text-[10px] font-black text-emerald-600 flex items-center">
                          <ChevronUp className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rivals Table */}
                <div className="space-y-3 mt-4">
                  <span className="text-rich-black/30 text-[9px] font-black uppercase tracking-widest block font-subheading">African Rivals</span>
                  <div className="space-y-2.5">
                    {rankingsData.rivals.map((rival, index) => (
                      <div key={index} className="flex items-center justify-between border border-black/5 bg-milk-white px-4 py-2.5 rounded-lg">
                        <div className="flex items-center gap-3">
                          {rival.logo && (
                            <Image src={rival.logo} alt={rival.name} width={18} height={14} className="object-cover rounded-xs" />
                          )}
                          <span className="text-[11px] font-body font-bold text-rich-black/80">{rival.name}</span>
                        </div>
                        <span className="text-xs font-heading font-black text-rich-black">Rank #{rival.position}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Tag */}
                <div className="pt-4 border-t border-black/8 mt-6 flex justify-between items-center text-[9px] text-rich-black/40 font-body">
                  <span>Last Updated: {rankingsData.world.lastUpdated}</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold uppercase">
                    <TrendingUp className="w-3 h-3" /> Upward Trend
                  </span>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* 2. Secondary Match Row (Condensed Card) */}
        <ScrollReveal delay={0.25}>
          <div className="relative w-full overflow-hidden card-dark shadow-lg hover:border-zru-green/30 transition-all duration-500 group">
            
            {/* Neon glow spots */}
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-zru-green/5 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-zru-green/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-stretch">
              
              {/* Left Date Sidebar */}
              <div className="w-full md:w-24 bg-zru-green/[0.12] border-b md:border-b-0 md:border-r border-zru-green/30 flex flex-row md:flex-col items-center justify-between md:justify-center p-3 md:py-4 text-center shrink-0 font-heading">
                <div className="flex md:flex-col items-center gap-1 md:gap-0">
                  <span className="text-xl md:text-2xl text-rich-black font-black leading-none">{secondaryDate.day}</span>
                  <span className="text-[9px] text-zru-green font-bold uppercase tracking-widest md:mt-1">{secondaryDate.month}</span>
                </div>
                <div className="flex items-center gap-2 md:flex-col md:gap-0">
                  <span className="text-[8px] text-rich-black/40 font-bold uppercase tracking-wider font-body">{secondaryDate.weekday}</span>
                  <span className="text-[8px] text-rich-black/40 font-black uppercase tracking-widest md:mt-1 font-subheading bg-black/5 px-2 py-0.5 rounded-full">{(secondaryMatch.round || "Round 1").replace("Round ", "R")}</span>
                </div>
              </div>

              {/* Main matchup row */}
              <div className="flex-1 flex flex-col sm:flex-row items-center justify-between p-4 md:p-5 gap-4">
                
                {/* Competition tag + teams */}
                <div className="flex flex-col items-center sm:items-start gap-2 w-full sm:w-auto">
                  <span className="bg-zru-green/20 text-rich-black border border-zru-green/30 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-sm uppercase self-center sm:self-start">
                    {secondaryMatch.competition}
                  </span>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-3 md:gap-5 w-full">
                    {/* Home Team */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 rotate-[45deg] rounded-md border border-zru-green/25 bg-milk-white flex items-center justify-center overflow-hidden shrink-0">
                        <div className="-rotate-[45deg] w-full h-full flex items-center justify-center">
                          {secondaryMatch.homeTeam.logo ? (
                            <Image src={secondaryMatch.homeTeam.logo} alt={secondaryMatch.homeTeam.name} width={24} height={24} className="object-contain" />
                          ) : (
                            <span className="text-[8px] font-black text-rich-black/60">{secondaryMatch.homeTeam.name.substring(0, 3).toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-rich-black font-heading text-xs sm:text-sm uppercase tracking-wide font-bold leading-tight">{secondaryMatch.homeTeam.name}</span>
                    </div>
                    
                    {/* VS */}
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-milk-white border border-black/10 flex items-center justify-center">
                        <span className="font-heading text-[9px] md:text-[10px] text-zru-green italic font-black">VS</span>
                      </div>
                    </div>
                    
                    {/* Away Team */}
                    <div className="flex items-center gap-2">
                      <span className="text-rich-black font-heading text-xs sm:text-sm uppercase tracking-wide font-bold leading-tight">{secondaryMatch.awayTeam.name}</span>
                      <div className="w-8 h-8 md:w-10 md:h-10 rotate-[45deg] rounded-md border border-black/10 bg-milk-white flex items-center justify-center overflow-hidden shrink-0">
                        <div className="-rotate-[45deg] w-full h-full flex items-center justify-center">
                          {secondaryMatch.awayTeam.logo ? (
                            <Image src={secondaryMatch.awayTeam.logo} alt={secondaryMatch.awayTeam.name} width={24} height={24} className="object-contain" />
                          ) : (
                            <span className="text-[8px] font-black text-rich-black/60">{secondaryMatch.awayTeam.name.substring(0, 3).toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time & Location */}
                <div className="flex items-center gap-4 text-rich-black/50 text-[10px] font-body font-medium shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-zru-green/60" />
                    <span>{secondaryMatch.time} CAT</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-zru-green/60" />
                    <span className="max-w-[140px] truncate">{secondaryMatch.venue.split(",")[0]}</span>
                  </div>
                  <Link href="/match-centre" className="text-zru-green hover:text-rich-black transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </ScrollReveal>

        {/* 3. Recent Results */}
        <ScrollReveal delay={0.28}>
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-zru-green/40" />
              <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.4em] font-subheading">Recent Results</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { date: "20 JUN", comp: "Internationals", home: "South Africa 'A'", away: "Zimbabwe", homeScore: 40, awayScore: 0, homeLogo: "/images/match-logos/SOUTH AFRICA A.png", awayLogo: "/images/match-logos/ZIM.png", zimWon: false },
                { date: "4 JUL", comp: "Nations Cup", home: "Tonga", away: "Zimbabwe", homeScore: 36, awayScore: 26, homeLogo: "/images/match-logos/TONGA.png", awayLogo: "/images/match-logos/ZIM.png", zimWon: false },
                { date: "11 JUL", comp: "Nations Cup", home: "USA", away: "Zimbabwe", homeScore: 31, awayScore: 15, homeLogo: "/images/match-logos/USA.png", awayLogo: "/images/match-logos/ZIM.png", zimWon: false },
                { date: "18 JUL", comp: "Nations Cup", home: "Canada", away: "Zimbabwe", homeScore: 23, awayScore: 19, homeLogo: "/images/match-logos/CANADA.png", awayLogo: "/images/match-logos/ZIM.png", zimWon: false },
              ].map((match, idx) => (
                <div key={idx} className="card-dark p-4 flex flex-col gap-3 hover:border-zru-green/30 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-rich-black/40 font-subheading">{match.date}</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-zru-green bg-zru-green/10 px-2 py-0.5 rounded-full">{match.comp}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-milk-white border border-black/5 flex items-center justify-center shrink-0 overflow-hidden">
                        <Image src={match.homeLogo} alt={match.home} width={28} height={28} className="object-contain" />
                      </div>
                      <span className="text-[11px] font-heading font-bold text-rich-black uppercase tracking-wide truncate">{match.home}</span>
                    </div>
                    <span className="text-sm font-heading font-black text-rich-black px-2 shrink-0">{match.homeScore}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-milk-white border border-black/5 flex items-center justify-center shrink-0 overflow-hidden">
                        <Image src={match.awayLogo} alt={match.away} width={28} height={28} className="object-contain" />
                      </div>
                      <span className="text-[11px] font-heading font-bold text-rich-black uppercase tracking-wide truncate">{match.away}</span>
                    </div>
                    <span className="text-sm font-heading font-black text-rich-black px-2 shrink-0">{match.awayScore}</span>
                  </div>
                  <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${match.zimWon ? 'text-emerald-600' : 'text-red-600'}`}>
                      {match.zimWon ? 'WIN' : 'LOSS'}
                    </span>
                    <Link href="/match-centre" className="text-zru-green hover:text-rich-black transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 4. Bottom Button: View Match Centre */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mt-8">
            <Link href="/match-centre">
              <button className="relative group/btn font-subheading tracking-widest text-[10px] uppercase bg-zru-green text-white font-black px-8 py-3.5 clip-slanted shadow-xl shadow-zru-green/30 hover:bg-white hover:text-rich-black transition-all duration-300 cursor-pointer inline-flex items-center gap-2">
                View Full Match Centre
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
