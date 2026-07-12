"use client";

import EdgyGradient from "@/components/ui/EdgyGradient";
import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import MatchList, { Match, MatchListSkeleton } from "@/components/matches/MatchList";
import LeagueTable from "@/components/matches/LeagueTable";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useState, useEffect } from "react";
import PageAnnouncements from "@/components/ui/PageAnnouncements";
import HeroMatchSpotlight from "@/components/matches/HeroMatchSpotlight";

export default function MatchCentre() {
  const [activeTab, setActiveTab] = useState<"fixtures" | "results" | "standings">("fixtures");
  const [data, setData] = useState<{ fixtures: Match[], results: Match[] }>({ fixtures: [], results: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchFixtures() {
      try {
        const response = await fetch('/api/fixtures');
        if (!response.ok) throw new Error('Failed to fetch fixtures');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    fetchFixtures();
  }, []);

  const upcomingFixtures = data.fixtures.filter(f => f.status === "upcoming");
  const nextMatch = upcomingFixtures[0];

  const showSpotlight = selectedTeam === "All" && !searchQuery && !!nextMatch;

  const filteredFixtures = data.fixtures.filter((match) => {
    const isFeatured = showSpotlight && nextMatch && match.id === nextMatch.id;
    if (isFeatured) return false;

    const matchesTeam = selectedTeam === "All" || match.teamCategory === selectedTeam;
    const matchesSearch = 
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.competition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  const filteredResults = data.results.filter((match) => {
    const matchesTeam = selectedTeam === "All" || match.teamCategory === selectedTeam;
    const matchesSearch = 
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.competition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  return (
    <>
      <main className="bg-rich-black min-h-screen pt-24 pb-24">
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <EdgyGradient opacity={0.4} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-black italic tracking-tight text-white mb-4">Match Centre</h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Follow every tackle, try, and triumph. The official schedule and results for all Zimbabwe Rugby Union teams.
            </p>
          </motion.div>

          {/* Contextual Announcements */}
          <PageAnnouncements scope="match-centre" className="mb-12" />

          {/* Hero Match Spotlight */}
          {activeTab === "fixtures" && showSpotlight && (
            <HeroMatchSpotlight match={nextMatch} />
          )}

        {/* Filters & Tabs */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
           
           {/* Tabs */}
           <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 relative z-0">
             {(["fixtures", "results", "standings"] as const).map((tab) => {
               const isActive = activeTab === tab;
               return (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`relative px-6 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition-colors duration-300 select-none z-10 ${
                     isActive ? "text-white" : "text-gray-400 hover:text-white"
                   }`}
                 >
                   {isActive && (
                     <motion.div
                       layoutId="activeTabIndicator"
                       className="absolute inset-0 bg-zru-green rounded-lg shadow-lg -z-10"
                       transition={{ type: "spring", stiffness: 380, damping: 26 }}
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
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                   <input 
                      type="text" 
                      placeholder="Search opponent or cup…" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-zru-green text-sm"
                  />
               </div>
           </div>
        </div>

        {/* Team Category Filter tabs */}
        {activeTab !== "standings" && (
          <div className="flex overflow-x-auto py-1 gap-2 no-scrollbar mb-10 w-full border-b border-white/5 pb-4">
            {["All", "Sables", "Lady Sables", "Cheetahs", "Junior Sables", "U20"].map((teamName) => {
              const isActive = selectedTeam === teamName;
              return (
                <button
                  key={teamName}
                  onClick={() => setSelectedTeam(teamName)}
                  className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                    isActive 
                      ? "bg-zru-green text-rich-black shadow-lg" 
                      : "card-green border text-white/60 hover:text-white hover:border-white/20"
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
            {isLoading ? (
                activeTab === "standings" ? <TableSkeleton /> : <MatchListSkeleton />
            ) : error ? (
                <div className="text-center py-20">
                    <p className="text-red-500 mb-4">Error: {error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            ) : (
                <>
                    {activeTab === "fixtures" && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            {filteredFixtures.length > 0 ? (
                                <MatchList matches={filteredFixtures} />
                            ) : (
                                <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl card-green">
                                    <p className="text-gray-500 font-heading">NO UPCOMING FIXTURES MATCHING FILTER</p>
                                </div>
                            )}
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
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="card-green border rounded-2xl p-6 lg:p-8">
                                <h2 className="text-2xl font-heading text-white mb-6">PREMIER LEAGUE STANDINGS</h2>
                                <LeagueTable />
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </div>

      </div>
    </main>
    <Footer />
    </>
  );
}
