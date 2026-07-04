"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ChevronLeft, Award, FileText, BarChart3, Users, Ticket } from "lucide-react";
import type { MatchDetailData } from "@/lib/api/matchDetail";
import { getFlagUrl } from "@/lib/flags";

interface MatchDetailClientProps {
  data: MatchDetailData;
}

export default function MatchDetailClient({ data }: MatchDetailClientProps) {
  const { match, homeLineup, awayLineup, stats, report } = data;
  const [activeTab, setActiveTab] = useState<"report" | "lineups" | "stats">(
    report ? "report" : "lineups"
  );

  const homeLogo = match.homeTeam.logo || getFlagUrl(match.homeTeam.name);
  const awayLogo = match.awayTeam.logo || getFlagUrl(match.awayTeam.name);

  // Tab definitions dynamically enabled based on available data
  const tabs = [
    ...(report ? [{ id: "report" as const, label: "MATCH REPORT", icon: FileText }] : []),
    { id: "lineups" as const, label: "TEAM SHEETS", icon: Users },
    ...(stats ? [{ id: "stats" as const, label: "STATS & ANALYSIS", icon: BarChart3 }] : [])
  ];

  return (
    <div className="min-h-screen bg-rich-black text-white pt-24 pb-20">
      
      {/* Back to match centre */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link href="/match-centre" className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Match Centre</span>
        </Link>
      </div>

      {/* Scoreboard / Cinematic Header */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 md:p-12 overflow-hidden shadow-2xl glow-green-card">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-zru-green/10 opacity-30 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-zru-gold text-xs font-black uppercase tracking-[0.3em] mb-2">
              {match.competition}
            </span>
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-8">
              {match.category} • Match Details
            </span>

            {/* Score / VS row */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full max-w-4xl mb-8">
              
              {/* Home Team */}
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 flex-1 justify-end text-center md:text-right">
                <span className="text-xl md:text-2xl font-black uppercase tracking-wider order-2 md:order-1">{match.homeTeam.name}</span>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center border border-white/10 relative overflow-hidden order-1 md:order-2">
                  {homeLogo ? (
                    <Image src={homeLogo} alt={match.homeTeam.name} fill className="object-contain p-3" sizes="80px" />
                  ) : (
                    <span className="text-black font-black">{match.homeTeam.name.substring(0, 3).toUpperCase()}</span>
                  )}
                </div>
              </div>

              {/* Score / Status Badge */}
              <div className="flex flex-col items-center shrink-0">
                {match.status === "finished" || match.status === "completed" ? (
                  <div className="flex flex-col items-center">
                    <span className="text-4xl md:text-6xl font-black italic tracking-tighter text-glow-green text-white">
                      {match.homeTeam.score ?? 0} - {match.awayTeam.score ?? 0}
                    </span>
                    <span className="bg-white/10 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-3">
                      FULL TIME
                    </span>
                  </div>
                ) : match.status === "live" ? (
                  <div className="flex flex-col items-center">
                    <span className="text-4xl md:text-6xl font-black italic tracking-tighter text-glow-green text-white">
                      {match.homeTeam.score ?? 0} - {match.awayTeam.score ?? 0}
                    </span>
                    <span className="bg-zru-green text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-3 animate-pulse">
                      ● LIVE
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-3xl md:text-5xl font-black italic text-zru-gold">VS</span>
                    <span className="bg-white/10 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-3">
                      UPCOMING
                    </span>
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 flex-1 justify-start text-center md:text-left">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center border border-white/10 relative overflow-hidden">
                  {awayLogo ? (
                    <Image src={awayLogo} alt={match.awayTeam.name} fill className="object-contain p-3" sizes="80px" />
                  ) : (
                    <span className="text-black font-black">{match.awayTeam.name.substring(0, 3).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-xl md:text-2xl font-black uppercase tracking-wider">{match.awayTeam.name}</span>
              </div>

            </div>

            {/* Stadium, Date & Time */}
            <div className="flex flex-col md:flex-row items-center gap-6 justify-center text-sm text-white/60 border-t border-white/10 pt-6 w-full max-w-2xl">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zru-gold" />
                <span className="font-bold uppercase">{match.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zru-gold" />
                <span className="font-bold uppercase">{match.time} CAT</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zru-gold" />
                <span className="font-bold uppercase">{match.venue}</span>
              </div>
            </div>

            {/* Upcoming Ticket CTA */}
            {match.status === "upcoming" && (
              <div className="mt-8">
                <Link href="/tickets">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="bg-zru-gold text-rich-black font-black text-xs uppercase tracking-[0.2em] px-8 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-zru-gold/20 transition-all cursor-none"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Purchase Match Tickets</span>
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex border-b border-white/10 py-1 overflow-x-auto gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 px-4 text-xs font-black uppercase tracking-wider relative transition-all duration-300 ${
                    isActive ? "text-zru-gold" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="matchDetailTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-zru-gold"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Panels */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            
            {/* Report Tab */}
            {activeTab === "report" && report && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Paragraphs and narrative */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="border-l-4 border-zru-gold pl-4 mb-8">
                    <h2 className="text-xl font-black uppercase tracking-wider">MATCH REPORT</h2>
                    <p className="text-sm text-white/50 mt-1">Official match summary and timeline events.</p>
                  </div>
                  <p className="text-xl font-semibold text-white leading-relaxed italic border-b border-white/10 pb-6 mb-6">
                    &ldquo;{report.summary}&rdquo;
                  </p>
                  {report.paragraphs.map((p, idx) => (
                    <p key={idx} className="text-white/70 leading-relaxed text-base font-medium">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Scorer Timeline */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-fit">
                  <h3 className="text-base font-black uppercase tracking-widest text-white border-b border-white/10 pb-4 mb-6">
                    SCORING TIMELINE
                  </h3>
                  <div className="space-y-4">
                    {report.scorerTimeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <span className="text-zru-gold font-black text-xs min-w-[32px] pt-0.5">{item.minute}&apos;</span>
                        <div className="flex-1">
                          <span className="text-white font-bold text-sm block">{item.player}</span>
                          <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider block mt-0.5">
                            {item.type} • {item.team === 'home' ? match.homeTeam.name : match.awayTeam.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Lineups Tab */}
            {activeTab === "lineups" && (
              <div className="space-y-12">
                <div className="border-l-4 border-zru-gold pl-4">
                  <h2 className="text-xl font-black uppercase tracking-wider">OFFICIAL LINEUPS & TEAM SHEETS</h2>
                  <p className="text-sm text-white/50 mt-1">Starting rosters and tactical reserves selected for this match.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Home Lineup */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 shadow-xl">
                    <h3 className="text-lg font-black uppercase tracking-wider border-b border-white/10 pb-4 mb-6 text-glow-green text-white">
                      {match.homeTeam.name} Squad
                    </h3>
                    <div className="space-y-3">
                      {homeLineup.map((player) => (
                        <div key={player.number} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-sm">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-xs font-black text-zru-gold">
                              {player.number}
                            </span>
                            <span className="font-semibold text-white uppercase tracking-tight">{player.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-white/60 text-xs font-bold uppercase tracking-wider">{player.position}</span>
                            {player.club && <span className="text-[10px] text-white/30 block">{player.club}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Away Lineup */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 shadow-xl">
                    <h3 className="text-lg font-black uppercase tracking-wider border-b border-white/10 pb-4 mb-6 text-white/80">
                      {match.awayTeam.name} Squad
                    </h3>
                    <div className="space-y-3">
                      {awayLineup.map((player) => (
                        <div key={player.number} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-sm">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-xs font-black text-white/40">
                              {player.number}
                            </span>
                            <span className="font-semibold text-white/80 uppercase tracking-tight">{player.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-white/40 text-xs font-bold uppercase tracking-wider">{player.position}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && stats && (
              <div className="max-w-3xl mx-auto space-y-12">
                <div className="border-l-4 border-zru-gold pl-4">
                  <h2 className="text-xl font-black uppercase tracking-wider">STATS & PERFORMANCE COMPARISON</h2>
                  <p className="text-sm text-white/50 mt-1">A comparative look at key performance indicators.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-10 space-y-8">
                  {/* Possession */}
                  <div>
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2 text-white">
                      <span>{stats.possession.home}%</span>
                      <span>POSSESSION</span>
                      <span>{stats.possession.away}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full flex overflow-hidden">
                      <div className="bg-zru-gold h-full" style={{ width: `${stats.possession.home}%` }} />
                      <div className="bg-white/30 h-full" style={{ width: `${stats.possession.away}%` }} />
                    </div>
                  </div>

                  {/* Territory */}
                  <div>
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2 text-white">
                      <span>{stats.territory.home}%</span>
                      <span>TERRITORY</span>
                      <span>{stats.territory.away}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full flex overflow-hidden">
                      <div className="bg-zru-gold h-full" style={{ width: `${stats.territory.home}%` }} />
                      <div className="bg-white/30 h-full" style={{ width: `${stats.territory.away}%` }} />
                    </div>
                  </div>

                  {/* Other statistics */}
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 text-center uppercase font-bold text-sm">
                    {/* Home stat value */}
                    <div className="space-y-4">
                      <div className="text-xl font-black text-white">{stats.scrums.home}</div>
                      <div className="text-xl font-black text-white">{stats.penalties.home}</div>
                      <div className="text-xl font-black text-white">{stats.tries.home}</div>
                    </div>
                    {/* Stat Label */}
                    <div className="space-y-4 text-white/40 text-xs font-black tracking-wider">
                      <div>SCRUMS WON</div>
                      <div>PENALTIES CONCEDED</div>
                      <div>TRIES SCORED</div>
                    </div>
                    {/* Away stat value */}
                    <div className="space-y-4">
                      <div className="text-xl font-black text-white">{stats.scrums.away}</div>
                      <div className="text-xl font-black text-white">{stats.penalties.away}</div>
                      <div className="text-xl font-black text-white">{stats.tries.away}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
