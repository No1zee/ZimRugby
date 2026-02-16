"use client";

import { useState } from "react";
import { ArrowRight, ChevronRight, MapPin, Share2, Ticket } from "lucide-react";
import Button from "../common/Button";
import { motion } from "framer-motion";
import Image from "next/image";

const fixtures = [
  {
    id: 1,
    competition: "SABLES NATIONS CUP",
    round: "Tour Match",
    date: "4 JULY",
    day: "FRI",
    time: "TBA",
    homeTeam: "TONGA",
    homeScore: null,
    awayTeam: "ZIMBABWE",
    awayScore: null,
    venue: "USA",
    status: "UPCOMING",
  },
  {
    id: 2,
    competition: "SABLES NATIONS CUP",
    round: "Tour Match",
    date: "11 JULY",
    day: "SAT",
    time: "TBA",
    homeTeam: "USA",
    homeScore: null,
    awayTeam: "ZIMBABWE",
    awayScore: null,
    venue: "USA",
    status: "UPCOMING",
  },
  {
    id: 3,
    competition: "SABLES NATIONS CUP",
    round: "Tour Match",
    date: "18 JULY",
    day: "SAT",
    time: "TBA",
    homeTeam: "CANADA",
    homeScore: null,
    awayTeam: "ZIMBABWE",
    awayScore: null,
    venue: "CANADA",
    status: "UPCOMING",
  },
  {
    id: 4,
    competition: "SABLES NATIONS CUP",
    round: "November Tour",
    date: "7 NOV",
    day: "SAT",
    time: "TBA",
    homeTeam: "SAMOA",
    homeScore: null,
    awayTeam: "ZIMBABWE",
    awayScore: null,
    venue: "ENGLAND",
    status: "UPCOMING",
  },
  {
    id: 5,
    competition: "SABLES NATIONS CUP",
    round: "November Tour",
    date: "14 NOV",
    day: "SAT",
    time: "TBA",
    homeTeam: "URUGUAY",
    homeScore: null,
    awayTeam: "ZIMBABWE",
    awayScore: null,
    venue: "ENGLAND",
    status: "UPCOMING",
  },
  {
    id: 6,
    competition: "SABLES NATIONS CUP",
    round: "November Tour",
    date: "21 NOV",
    day: "SAT",
    time: "TBA",
    homeTeam: "CHILE",
    homeScore: null,
    awayTeam: "ZIMBABWE",
    awayScore: null,
    venue: "ENGLAND",
    status: "UPCOMING",
  },
];

export default function MatchCentre() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "recent">("upcoming");

  const nextMatch = fixtures[0];
  const upcomingFixtures = fixtures.slice(1);

  return (
    <section className="py-20 bg-rich-black relative border-t border-white/10 overflow-hidden" id="match-centre">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/events/africa-cup.jpg" 
          alt="Match Centre Background" 
          fill 
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-rich-black via-rich-black/80 to-rich-black" />
      </div>

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

        {/* Featured NEXT MATCH Card */}
        {activeTab === "upcoming" && (
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
                    <p className="text-gray-500">{nextMatch.round} • {nextMatch.venue}</p>
                 </div>
                 
                 <div className="flex items-center gap-8 md:gap-16">
                    <div className="text-center">
                       <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20 mb-4 mx-auto group-hover:border-zru-orange transition-colors">
                          <span className="font-heading text-2xl">{nextMatch.homeTeam.substring(0,3)}</span>
                       </div>
                       <h3 className="font-heading text-3xl text-white">{nextMatch.homeTeam}</h3>
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
                          <span className="font-heading text-2xl">{nextMatch.awayTeam.substring(0,3)}</span>
                       </div>
                       <h3 className="font-heading text-3xl text-white">{nextMatch.awayTeam}</h3>
                    </div>
                 </div>

                 <div className="flex-1 flex justify-end">
                    <Button size="lg" className="w-full md:w-auto hover:shadow-[0_0_15px_rgba(255,140,0,0.5)]">
                       GET TICKETS
                    </Button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Scrolling Container for Other Fixtures */}
        <div className="overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {upcomingFixtures.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, rotate: 1 }}
                className="w-[300px] md:w-[350px] bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-zru-orange/30 transition-all duration-300 group"
              >
                {/* Card Header */}
                <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center group-hover:bg-white/10 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-zru-orange text-xs font-bold tracking-wider uppercase">
                      {match.competition}
                    </span>
                    <span className="text-gray-400 text-xs mt-1">
                      {match.round}
                    </span>
                  </div>
                  <div className="bg-rich-black/50 px-3 py-1 rounded text-xs font-bold text-white border border-white/10">
                    {match.date}
                  </div>
                </div>

                {/* Match Details */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xs text-gray-400 border border-white/5 group-hover:border-zru-orange/50 transition-colors">
                        {match.homeTeam.substring(0, 3)}
                      </div>
                      <span className="font-heading text-lg text-white text-center leading-tight">
                        {match.homeTeam}
                      </span>
                    </div>

                    <span className="text-xl font-heading text-gray-600 px-2">VS</span>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xs text-gray-400 border border-white/5 group-hover:border-zru-orange/50 transition-colors">
                        {match.awayTeam.substring(0, 3)}
                      </div>
                      <span className="font-heading text-lg text-white text-center leading-tight">
                        {match.awayTeam}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-6 justify-center">
                    <MapPin className="w-3 h-3 text-zru-orange" />
                    <span>{match.venue}</span>
                  </div>

                  <Button className="w-full text-sm h-10" variant="outline">
                    MATCH CENTER
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="ghost" rightIcon={<ChevronRight className="w-5 h-5" />}>
            VIEW FULL SCHEDULE
          </Button>
        </div>
      </div>
    </section>
  );
}
