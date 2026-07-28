"use client";

import EdgyGradient from "@/components/ui/EdgyGradient";
import { motion } from "framer-motion";
import { Search, MapPin, BarChart3, History } from "lucide-react";
import MatchList from "@/components/matches/MatchList";
import type { Match } from "@/types";
import LeagueTable from "@/components/matches/LeagueTable";
import { useState } from "react";
import PageAnnouncements from "@/components/ui/PageAnnouncements";
import HeroMatchSpotlight from "@/components/matches/HeroMatchSpotlight";
import type { LeagueTableRow } from "@/types";
import Image from "next/image";

import PageHero from "@/components/ui/PageHero";
import SlantedButton from "@/components/ui/SlantedButton";
import { useEffect, useState as ReactState } from "react";
import NextUnionMatchHero from "@/components/match-centre/NextUnionMatchHero";

interface MatchCentreClientProps {
  initialFixtures: Match[];
  initialResults: Match[];
  initialStandings: LeagueTableRow[];
  nextUnionMatch?: {
    id: string | number;
    homeTeam: { name: string };
    awayTeam: { name: string };
    venue: string;
    competition: string;
    teamCategory?: string;
    dateIso: string;
    time: string;
    ticketUrl?: string;
  } | null;
}

export default function MatchCentreClient({ initialFixtures, initialResults, initialStandings, nextUnionMatch }: MatchCentreClientProps) {
  const [activeTab, setActiveTab] = useState<"fixtures" | "results" | "standings">("fixtures");
  const [selectedTeam, setSelectedTeam] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const upcomingFixtures = initialFixtures.filter(f => f.status === "upcoming" || !f.status);
  const nextMatch = upcomingFixtures[0];

  const showSpotlight = selectedTeam === "All" && !searchQuery && !!nextMatch;
  const recentResults = initialResults.slice(0, 3);

  const filteredFixtures = initialFixtures.filter((match) => {
    const isFeatured = showSpotlight && nextMatch && match.id === nextMatch.id;
    if (isFeatured) return false;

    const matchesTeam = selectedTeam === "All" || match.teamCategory === selectedTeam;
    const matchesSearch = 
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.competition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  const filteredResults = initialResults.filter((match) => {
    const matchesTeam = selectedTeam === "All" || match.teamCategory === selectedTeam;
    const matchesSearch = 
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.competition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  return (
    <main className="bg-milk-white min-h-screen pb-12">
      {/* PageHero header */}
      <PageHero
        title="Match Centre"
        subtitle="Follow every tackle, try, and triumph. The official schedule and results for all Zimbabwe Rugby Union teams."
        tag="Fixtures & Results"
        backgroundImage="/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp"
        breadcrumb={[{ label: "Match Centre", href: "/match-centre" }]}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative">
        <div className="relative z-10">

          {/* Contextual Announcements */}
          <PageAnnouncements scope="match-centre" className="mb-8" />

          {/* Next Union Match Hero */}
          <NextUnionMatchHero match={nextUnionMatch ?? null} />

          {/* Filters & Tabs */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
             
             {/* Tabs */}
             <div className="flex p-1 bg-black/5 rounded-xl border border-black/10 relative z-0">
               {(["fixtures", "results", "standings"] as const).map((tab) => {
                 const isActive = activeTab === tab;
                 return (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`relative px-6 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition-colors duration-300 select-none z-10 ${
                       isActive ? "text-white" : "text-black/60 hover:text-black"
                     }`}
                   >
                     {isActive && (
                       <motion.div
                         layoutId="activeTabIndicator"
                         className="absolute inset-0 bg-zru-green rounded-lg shadow-lg -z-10"
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                       />
                     )}
                     {tab}
                   </button>
                 );
               })}
             </div>
             
             {/* Search Input */}
             <div className="flex items-center gap-4 w-full lg:w-80">
                 <div className="relative flex-1">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/45" />
                     <input 
                        type="text" 
                        placeholder="Search opponent or cup..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/5 border border-black/10 rounded-lg pl-10 pr-4 py-2 text-rich-black placeholder-black/45 focus:outline-none focus:border-zru-green text-sm"
                    />
                 </div>
             </div>
          </div>

          {/* Team Category Filter tabs */}
          {activeTab !== "standings" && (
            <div className="flex overflow-x-auto py-1 gap-2 no-scrollbar mb-10 w-full border-b border-black/5 pb-4">
              {["All", "Sables", "Lady Sables", "Cheetahs", "Junior Sables", "U20"].map((teamName) => {
                const isActive = selectedTeam === teamName;
                return (
                  <button
                    key={teamName}
                    onClick={() => setSelectedTeam(teamName)}
                    className={`px-5 py-2 clip-slanted-sm text-xs font-black uppercase tracking-wider transition-[background-color,color,box-shadow] duration-300 whitespace-nowrap ${
                      isActive 
                        ? "bg-zru-green text-white shadow-lg" 
                        : "bg-black/5 border border-black/10 text-black/60 hover:text-black hover:border-black/20"
                    }`}
                  >
                    {teamName}
                  </button>
                );
              })}
            </div>
          )}

          {/* Content Area */}
          <div className="min-h-[500px]">
              {activeTab === "fixtures" && (
                  <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                  >
                       {showSpotlight ? (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 items-stretch">
                               {/* 1. Upcoming Fixture Hero (Large Bento) */}
                               <div className="lg:col-span-8 relative overflow-hidden rounded-2xl h-[400px] md:h-[500px] group transition-[filter] duration-300 hover:brightness-[0.97]">
                                   {/* Background Image */}
                                   <div 
                                       className="absolute inset-0 bg-cover bg-center transition-[filter] duration-300 group-hover:brightness-110" 
                                       style={{ backgroundImage: "url('/images/events/africa-cup.jpg')" }}
                                   ></div>
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                   
                                   {/* Content Overlay — flattened, no card-in-card */}
                                   <div className="absolute inset-0 p-8 flex flex-col justify-end max-w-2xl">
                                       <span className="font-heading text-xs font-bold text-zru-green bg-milk-white px-3 py-1 rounded-full mb-4 inline-block uppercase tracking-wider">
                                           {nextMatch.teamCategory || "INTERNATIONAL TEST SERIES"}
                                       </span>
                                       <h2 className="font-heading text-3xl md:text-4xl mb-2 flex items-center gap-4 uppercase font-black text-white">
                                           {nextMatch.homeTeam.name} <span className="text-zru-green font-anybody font-black">VS</span> {nextMatch.awayTeam.name}
                                       </h2>
                                       <p className="font-body text-base text-white/90 mb-6 flex items-center gap-2">
                                           <MapPin className="w-4 h-4 text-zru-green" /> {nextMatch.venue}
                                       </p>

                                       {/* Countdown & Action */}
                                       <div className="flex flex-wrap items-center justify-between gap-4">
                                           <div className="flex gap-4">
                                               <div className="text-center">
                                                   <div className="font-heading text-lg bg-zru-green w-14 h-14 flex items-center justify-center rounded-lg font-black">04</div>
                                                   <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1 block font-bold">Days</span>
                                               </div>
                                               <div className="text-center">
                                                   <div className="font-heading text-lg bg-zru-green w-14 h-14 flex items-center justify-center rounded-lg font-black">12</div>
                                                   <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1 block font-bold">Hrs</span>
                                               </div>
                                               <div className="text-center">
                                                   <div className="font-heading text-lg bg-zru-green w-14 h-14 flex items-center justify-center rounded-lg font-black">45</div>
                                                   <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1 block font-bold">Min</span>
                                               </div>
                                           </div>
                                           {nextMatch.ticketUrl && (
                                               <SlantedButton href={nextMatch.ticketUrl} variant="primary" size="sm">
                                                   GET TICKETS
                                               </SlantedButton>
                                           )}
                                       </div>
                                   </div>
                               </div>
 
                              {/* 2. Recent Results (Side Bento) */}
                               <div className="lg:col-span-4 bg-milk-white border border-black/5 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                                  <div>
                                      <div className="flex justify-between items-center mb-6">
                                          <h3 className="font-heading text-xl text-zru-green tracking-wide uppercase">Recent Results</h3>
                                          <History className="w-5 h-5 text-black/45" />
                                      </div>
                                      
                                      <div className="space-y-4">
                                          {recentResults.map((result) => (
                                               <div key={result.id} className="flex items-center justify-between p-4 rounded-lg bg-black/5 hover:bg-black/[0.08] transition-colors group cursor-pointer">
                                                  <div className="flex flex-col">
                                                      <span className="text-[10px] font-bold text-black/40 mb-1 uppercase">{result.date}</span>
                                                      <span className="font-heading text-base text-rich-black uppercase">{result.homeTeam.name}</span>
                                                  </div>
                                                  <div className="text-center px-2">
                                                      <span className="font-anybody font-black text-lg text-zru-green group-hover:text-green-700 transition-colors duration-300">
                                                          {result.homeTeam.score} - {result.awayTeam.score}
                                                      </span>
                                                  </div>
                                                  <div className="flex flex-col items-end">
                                                      <span className="text-[10px] font-bold text-black/40 mb-1 uppercase">FT</span>
                                                      <span className="font-heading text-base text-rich-black uppercase">{result.awayTeam.name}</span>
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                                  
                                  <button 
                                      onClick={() => setActiveTab("results")} 
                                      className="w-full mt-6 py-2.5 font-heading text-sm text-zru-green border border-zru-green hover:bg-zru-green hover:text-white rounded-xl transition-[background-color,color]"
                                  >
                                      VIEW ARCHIVE
                                  </button>
                              </div>

                              {/* 3. Player Stats (Small Bento) */}
                               <div className="lg:col-span-5 bg-milk-white border border-black/5 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                                  <div className="relative z-10">
                                      <div className="flex justify-between items-center mb-6">
                                          <h3 className="font-heading text-xl text-zru-green tracking-wide">PLAYER STATS</h3>
                                          <BarChart3 className="w-5 h-5 text-zru-green/50" />
                                      </div>
                                      
                                      <div className="space-y-6">
                                          <div className="flex items-center gap-4">
                                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zru-green shrink-0">
                                                  <Image className="w-full h-full object-cover" src="/images/gallery/zimbabwe-sables-0351.webp" alt="Tapiwa Mafura" width={48} height={48} />
                                              </div>
                                              <div className="flex-grow">
                                                  <div className="flex justify-between items-center">
                                                      <p className="font-bold text-sm text-rich-black">Tapiwa Mafura</p>
                                                      <p className="font-heading font-black text-zru-green">4 Tries</p>
                                                  </div>
                                                  <div className="w-full bg-black/5 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                                      <div className="bg-zru-green h-full rounded-full w-[85%]"></div>
                                                  </div>
                                              </div>
                                          </div>

                                          <div className="flex items-center gap-4">
                                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zru-green/20 shrink-0">
                                                  <Image className="w-full h-full object-cover" src="/images/gallery/zimbabwe-sables-0351.webp" alt="Hilton Mudariki" width={48} height={48} />
                                              </div>
                                              <div className="flex-grow">
                                                  <div className="flex justify-between items-center">
                                                      <p className="font-bold text-sm text-rich-black">Hilton Mudariki</p>
                                                      <p className="font-heading font-black text-zru-green">32 Pts</p>
                                                  </div>
                                                  <div className="w-full bg-black/5 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                                      <div className="bg-zru-green h-full rounded-full w-[70%]"></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  
                                  <div className="mt-8 border-t border-black/5 pt-4">
                                      <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest block">Season Leaders 2026</span>
                                  </div>
                              </div>

                              {/* 4. Africa Cup Standings (Medium Bento) */}
                               <div className="lg:col-span-7 bg-gradient-to-br from-zru-green to-[#004d34] text-white border border-black/5 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                                   <div className="relative z-10">
                                       <div className="flex justify-between items-center mb-6">
                                           <h3 className="font-heading text-xl text-white tracking-wide uppercase">Nations Cup Standings</h3>
                                       </div>
                                       <LeagueTable data={initialStandings} />
                                   </div>
                               </div>
                          </div>
                      ) : null}

                      {/* Remaining Fixtures Grid */}
                      <div>
                          {showSpotlight && (
                              <h3 className="font-heading text-2xl text-rich-black mb-6 tracking-wide">UPCOMING SCHEDULE</h3>
                          )}
                          {filteredFixtures.length > 0 ? (
                              <MatchList matches={filteredFixtures} />
                          ) : (
                              <div className="text-center py-20 border border-dashed border-black/10 rounded-2xl bg-milk-white">
                                  <p className="text-black/40 font-heading text-lg">NO UPCOMING FIXTURES MATCHING FILTER</p>
                              </div>
                          )}
                      </div>
                  </motion.div>
              )}

              {activeTab === "results" && (
                  <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                  >
                      {filteredResults.length > 0 ? (
                          <MatchList matches={filteredResults} />
                      ) : (
                          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl card-green">
                              <p className="text-gray-500 font-heading">NO RECENT RESULTS MATCHING FILTER</p>
                          </div>
                      )}
                  </motion.div>
              )}

              {activeTab === "standings" && (
                  <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                  >
                      <div className="bg-zru-green text-white border border-black/5 rounded-2xl p-6 lg:p-8 shadow-lg relative overflow-hidden">
                           <div className="relative z-10">
                               <h2 className="text-2xl font-heading text-white mb-6 uppercase tracking-wider">PREMIER LEAGUE STANDINGS</h2>
                               <LeagueTable data={initialStandings} />
                           </div>
                       </div>
                  </motion.div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
}
