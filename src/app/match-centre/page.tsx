"use client";

import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import MatchList from "@/components/matches/MatchList";
import LeagueTable from "@/components/matches/LeagueTable";
import { useState } from "react";

// Mock Data
const upcomingFixtures = [
  {
    id: 1,
    date: "22 JUL",
    time: "15:00",
    homeTeam: { name: "Zimbabwe Sables", logo: "/images/logos/zimbabwe.png" },
    awayTeam: { name: "Namibia", logo: "/images/logos/namibia.png" },
    venue: "Hartsfield, Bulawayo",
    competition: "AFRICA CUP",
    round: "ROUND 2",
    status: "upcoming" as const,
  },
  {
    id: 2,
    date: "29 JUL",
    time: "15:00",
    homeTeam: { name: "Uganda", logo: "/images/logos/uganda.png" },
    awayTeam: { name: "Zimbabwe Sables", logo: "/images/logos/zimbabwe.png" },
    venue: "Kyadondo, Kampala",
    competition: "AFRICA CUP",
    round: "ROUND 3",
    status: "upcoming" as const,
  },
  {
    id: 3,
    date: "05 AUG",
    time: "15:00",
    homeTeam: { name: "Zimbabwe Sables", logo: "/images/logos/zimbabwe.png" },
    awayTeam: { name: "Ivory Coast", logo: "/images/logos/ivory_coast.png" },
    venue: "Harare Sports Club",
    competition: "FRIENDLY",
    round: "WARM UP",
    status: "upcoming" as const,
  },
];

const pastResults = [
  {
    id: 101,
    date: "15 JUN",
    time: "15:00",
    homeTeam: { name: "Zimbabwe Sables", score: 32, logo: "/images/logos/zimbabwe.png" },
    awayTeam: { name: "Kenya Simbas", score: 15, logo: "/images/logos/kenya.png" },
    venue: "Prince Edward, Harare",
    competition: "VICTORIA CUP",
    round: "FINAL",
    status: "completed" as const,
  },
  {
    id: 102,
    date: "08 JUN",
    time: "14:00",
    homeTeam: { name: "Zambia", score: 12, logo: "/images/logos/zambia.png" },
    awayTeam: { name: "Zimbabwe Sables", score: 45, logo: "/images/logos/zimbabwe.png" },
    venue: "Lusaka Showgrounds",
    competition: "VICTORIA CUP",
    round: "SEMI-FINAL",
    status: "completed" as const,
  },
];

export default function MatchCentre() {
  const [activeTab, setActiveTab] = useState<"fixtures" | "results" | "standings">("fixtures");

  return (
    <>
      <Navigation />
      <main className="bg-rich-black min-h-screen pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-heading text-white mb-4">MATCH CENTRE</h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Follow every tackle, try, and triumph. The official schedule and results for all Zimbabwe Rugby Union teams.
            </p>
          </motion.div>

        {/* Filters & Tabs */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
           
           {/* Tabs */}
           <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
              <button 
                onClick={() => setActiveTab("fixtures")}
                className={`px-6 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition-all ${activeTab === "fixtures" ? "bg-zru-gold text-rich-black shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                Fixtures
              </button>
              <button 
                onClick={() => setActiveTab("results")}
                className={`px-6 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition-all ${activeTab === "results" ? "bg-zru-gold text-rich-black shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                Results
              </button>
              <button 
                onClick={() => setActiveTab("standings")}
                className={`px-6 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition-all ${activeTab === "standings" ? "bg-zru-gold text-rich-black shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                Standings
              </button>
           </div>
           
           {/* Search & Team Filter */}
           <div className="flex items-center gap-4 w-full lg:w-auto">
               <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                     type="text" 
                     placeholder="Search opponent..." 
                     className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-zru-gold text-sm"
                  />
               </div>
               <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 px-3">
                  <Filter className="w-5 h-5" />
               </Button>
           </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
            {activeTab === "fixtures" && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                >
                    <MatchList matches={upcomingFixtures} />
                </motion.div>
            )}

            {activeTab === "results" && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                >
                    <MatchList matches={pastResults} />
                </motion.div>
            )}

            {activeTab === "standings" && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                >
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8">
                        <h2 className="text-2xl font-heading text-white mb-6">PREMIER LEAGUE STANDINGS</h2>
                        <LeagueTable />
                    </div>
                </motion.div>
            )}
        </div>

      </div>
    </main>
    <Footer />
    </>
  );
}
