"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Clock } from "lucide-react";
import Button from "../common/Button";

export default function MatchCentreStrip() {
  return (
    <section className="bg-rich-black py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Featured Match - Takes up 2/3 on desktop */}
          <div className="lg:w-2/3">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-zru-gold text-sm font-bold tracking-[0.2em] uppercase">Next Match</h2>
                <div className="flex items-center gap-2 text-red-500 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    <span className="text-xs font-bold tracking-widest uppercase">Live in 4 Days</span>
                </div>
             </div>

             <motion.div 
               className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-8 h-full min-h-[300px] flex flex-col justify-center"
               whileHover={{ scale: 1.01, borderColor: "rgba(255, 255, 255, 0.2)" }}
             >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/images/pattern-overlay.png')] opacity-10" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                   
                   {/* Home Team */}
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center p-4">
                         {/* Replace with Image */}
                         <span className="text-3xl font-bold text-black">ZIM</span>
                      </div>
                      <span className="text-2xl md:text-4xl font-heading text-white">SABLES</span>
                   </div>

                   {/* VS / Info */}
                   <div className="flex flex-col items-center gap-2">
                      <div className="text-4xl font-heading text-white/20">VS</div>
                      <div className="flex flex-col items-center gap-1 mt-2">
                         <div className="flex items-center gap-2 text-white/80 text-sm font-bold">
                            <Calendar className="w-4 h-4" />
                            <span>15 JULY, 2025</span>
                         </div>
                         <div className="flex items-center gap-2 text-white/60 text-xs font-bold tracking-wide">
                            <Clock className="w-3 h-3" />
                            <span>15:00 KICK OFF</span>
                         </div>
                         <div className="flex items-center gap-2 text-white/60 text-xs font-bold tracking-wide mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>HARARE SPORTS CLUB</span>
                         </div>
                      </div>
                      <Button variant="primary" className="mt-6 bg-white text-rich-black hover:bg-gray-200 text-sm py-2 px-6">
                         BUY TICKETS
                      </Button>
                   </div>

                   {/* Away Team */}
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center p-4 border-4 border-red-600">
                         {/* Replace with Image */}
                         <span className="text-3xl font-bold text-black">KEN</span>
                      </div>
                      <span className="text-2xl md:text-4xl font-heading text-white">KENYA</span>
                   </div>

                </div>
             </motion.div>
          </div>

          {/* Upcoming Fixtures List - Takes up 1/3 on desktop */}
          <div className="lg:w-1/3 flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-sm font-bold tracking-[0.2em] uppercase">Upcoming Fixtures</h2>
                <a href="/match-centre" className="text-zru-orange text-xs font-bold tracking-widest hover:text-white transition-colors flex items-center gap-1">
                    VIEW ALL <ArrowRight className="w-3 h-3" />
                </a>
             </div>

             <div className="flex-1 flex flex-col gap-4">
                {[
                    { date: "22 JUL", opponent: "NAMIBIA", venue: "WINDHOEK", type: "AFRICA CUP" },
                    { date: "29 JUL", opponent: "UGANDA", venue: "KAMPALA", type: "AFRICA CUP" },
                    { date: "05 AUG", opponent: "IVORY COAST", venue: "HARARE", type: "FRIENDLY" }
                ].map((match, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center justify-center w-12 border-r border-white/10 pr-4">
                                <span className="text-white font-heading text-lg leading-none">{match.date.split(" ")[0]}</span>
                                <span className="text-white/40 text-[10px] font-bold uppercase">{match.date.split(" ")[1]}</span>
                            </div>
                            <div>
                                <div className="text-zru-gold text-[10px] font-bold tracking-widest uppercase mb-1">{match.type}</div>
                                <h3 className="text-white font-heading text-xl group-hover:text-zru-orange transition-colors">VS {match.opponent}</h3>
                                <div className="text-white/40 text-xs font-bold uppercase">{match.venue}</div>
                            </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-white/20 -rotate-90 group-hover:text-white transition-colors" />
                    </motion.div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}

import { ChevronDown } from "lucide-react";
