"use client";

import { useState, useEffect } from "react";
import { ChevronRight, MapPin, Loader2 } from "lucide-react";
import Button from "../common/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Match } from "../matches/MatchList";
export default function MatchCentre() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "recent">("upcoming");
  const [data, setData] = useState<{ fixtures: Match[], results: Match[] }>({ fixtures: [], results: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFixtures() {
      try {
        const response = await fetch('/api/fixtures');
        if (!response.ok) throw new Error('Failed to fetch');
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error('Home MatchCentre fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFixtures();
  }, []);

  const fixtures = activeTab === "upcoming" ? data.fixtures : data.results;
  const nextMatch = fixtures[0];
  const otherMatches = fixtures.slice(1);

  return (
    <section className="py-20 bg-rich-black relative border-t border-white/10 overflow-hidden" id="match-centre">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-zru-orange font-heading text-xl tracking-widest mb-2">
              FIXTURES & RESULTS
            </h2>
            <h3 className="text-4xl md:text-5xl font-heading text-white">
              MATCH CENTRE
            </h3>
          </div>
          <div className="flex bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-2 rounded-md font-heading text-sm transition-all ${
                activeTab === "upcoming"
                  ? "bg-zru-orange text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              UPCOMING
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`px-6 py-2 rounded-md font-heading text-sm transition-all ${
                activeTab === "recent"
                  ? "bg-zru-orange text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              RECENT
            </button>
          </div>
        </div>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-zru-orange animate-spin" />
                <p className="text-gray-400 font-heading tracking-widest text-sm">FETCHING LIVE DATA...</p>
            </div>
        ) : fixtures.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                <p className="text-gray-500 font-heading">NO {activeTab.toUpperCase()} MATCHES FOUND</p>
                <Link href="/match-centre">
                    <Button variant="ghost" className="mt-4 text-zru-orange">VIEW FULL CALENDAR</Button>
                </Link>
            </div>
        ) : (
            <>
                {/* Featured NEXT MATCH Card */}
                {activeTab === "upcoming" && nextMatch && (
                <div className="mb-12">
                    <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.01, rotate: 0.5 }}
                    className="relative bg-linear-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl group"
                    >
                    {/* Cinematic Background */}
                    <div className="absolute inset-0 opacity-30 bg-[url('/images/stadium-bg.jpg')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent" />

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex-1 text-center md:text-left">
                            <span className="bg-zru-orange text-white px-3 py-1 rounded text-xs font-bold tracking-widest uppercase mb-4 inline-block">
                            NEXT MATCH
                            </span>
                            <h4 className="text-gray-300 font-heading text-2xl mb-1">{nextMatch.competition}</h4>
                            <p className="text-gray-400">{nextMatch.round} • {nextMatch.venue}</p>
                        </div>
                        
                        <div className="flex items-center gap-8 md:gap-16">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20 mb-4 mx-auto group-hover:border-zru-orange transition-colors">
                                    {nextMatch.homeTeam.logo ? (
                                        <Image src={nextMatch.homeTeam.logo} alt={nextMatch.homeTeam.name} width={64} height={64} className="object-contain" />
                                    ) : (
                                        <span className="font-heading text-2xl">{nextMatch.homeTeam.name.substring(0,3).toUpperCase()}</span>
                                    )}
                                </div>
                                <h3 className="font-heading text-xl md:text-2xl text-white max-w-[150px] mx-auto leading-tight">{nextMatch.homeTeam.name}</h3>
                            </div>

                            <div className="text-center flex flex-col items-center">
                                <span className="text-5xl font-heading text-white/20 mb-2">VS</span>
                                <div className="bg-white/10 backdrop-blur px-6 py-2 rounded border border-white/5">
                                    <span className="text-2xl font-bold text-white block">{nextMatch.time}</span>
                                    <span className="text-xs text-zru-orange font-bold tracking-widest uppercase">{nextMatch.date}</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20 mb-4 mx-auto group-hover:border-zru-orange transition-colors">
                                    {nextMatch.awayTeam.logo ? (
                                        <Image src={nextMatch.awayTeam.logo} alt={nextMatch.awayTeam.name} width={64} height={64} className="object-contain" />
                                    ) : (
                                        <span className="font-heading text-2xl">{nextMatch.awayTeam.name.substring(0,3).toUpperCase()}</span>
                                    )}
                                </div>
                                <h3 className="font-heading text-xl md:text-2xl text-white max-w-[150px] mx-auto leading-tight">{nextMatch.awayTeam.name}</h3>
                            </div>
                        </div>

                        <div className="flex-1 flex justify-end">
                            <Link href={nextMatch.ticketUrl || "/match-centre"} target={nextMatch.ticketUrl ? "_blank" : "_self"} className="w-full md:w-auto">
                                <Button size="lg" className="w-full md:w-auto hover:shadow-[0_0_15px_rgba(255,140,0,0.5)]">
                                    {nextMatch.ticketUrl ? "GET TICKETS" : "MATCH INFO"}
                                </Button>
                            </Link>
                        </div>
                    </div>
                    </motion.div>
                </div>
                )}

                {/* Scrolling Container for Other Fixtures */}
                <div className="overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide">
                <div className="flex gap-6 min-w-max">
                    {(activeTab === "upcoming" ? otherMatches : fixtures).map((match: Match, index: number) => (
                    <motion.div
                        key={match.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -10, rotate: 0.5 }}
                        className="w-[300px] md:w-[350px] bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-zru-orange/30 transition-all duration-300 group"
                    >
                        {/* Card Header */}
                        <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center group-hover:bg-white/10 transition-colors">
                        <div className="flex flex-col">
                            <span className="text-zru-orange text-[10px] font-bold tracking-wider uppercase">
                            {match.competition}
                            </span>
                            <span className="text-gray-400 text-[10px] mt-1 uppercase font-bold">
                            {match.round}
                            </span>
                        </div>
                        <div className="bg-rich-black/50 px-3 py-1 rounded text-[10px] font-bold text-white border border-white/10 uppercase">
                            {match.date}
                        </div>
                        </div>

                        {/* Match Details */}
                        <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            {/* Home Team */}
                            <div className="flex flex-col items-center gap-2 flex-1">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xs text-gray-400 border border-white/5 group-hover:border-zru-orange/50 transition-colors overflow-hidden">
                                {match.homeTeam.logo ? (
                                    <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={32} height={32} className="object-contain" />
                                ) : (
                                    <span>{match.homeTeam.name.substring(0, 3).toUpperCase()}</span>
                                )}
                            </div>
                            <span className="font-heading text-sm text-white text-center leading-tight h-10 flex items-center">
                                {match.homeTeam.name}
                            </span>
                            </div>

                            <div className="flex flex-col items-center px-2">
                                {match.status === "completed" ? (
                                    <span className="text-lg font-heading text-zru-orange">{match.homeTeam.score} - {match.awayTeam.score}</span>
                                ) : (
                                    <span className="text-xl font-heading text-gray-600">VS</span>
                                )}
                            </div>

                            {/* Away Team */}
                            <div className="flex flex-col items-center gap-2 flex-1">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xs text-gray-400 border border-white/5 group-hover:border-zru-orange/50 transition-colors overflow-hidden">
                                {match.awayTeam.logo ? (
                                    <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={32} height={32} className="object-contain" />
                                ) : (
                                    <span>{match.awayTeam.name.substring(0, 3).toUpperCase()}</span>
                                )}
                            </div>
                            <span className="font-heading text-sm text-white text-center leading-tight h-10 flex items-center">
                                {match.awayTeam.name}
                            </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400 text-[10px] mb-6 justify-center uppercase font-bold">
                            <MapPin className="w-3 h-3 text-zru-orange" />
                            <span className="truncate max-w-[200px]">{match.venue}</span>
                        </div>
                        
                        <div className="flex gap-2">
                            <Link href="/match-centre" className="flex-1">
                                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 text-xs py-2 h-9">
                                    CENTRE
                                </Button>
                            </Link>
                            {match.ticketUrl && (
                                <Link href={match.ticketUrl} target="_blank" className="flex-1">
                                    <Button className="w-full text-xs py-2 h-9">
                                        TICKETS
                                    </Button>
                                </Link>
                            )}
                        </div>
                        </div>
                    </motion.div>
                    ))}
                </div>
                </div>

                <div className="flex justify-center mt-8">
                <Link href="/match-centre">
                    <Button variant="ghost" rightIcon={<ChevronRight className="w-5 h-5" />}>
                        VIEW FULL SCHEDULE
                    </Button>
                </Link>
                </div>
            </>
        )}
      </div>
    </section>
  );
}
