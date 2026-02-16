"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import Button from "../common/Button";
import Link from "next/link";

interface MatchCardProps {
  competition: string;
  round: string;
  date: string;
  time: string;
  venue: string;
  homeTeam: {
    name: string;
    score?: number;
    logo?: string; // URL to logo
  };
  awayTeam: {
    name: string;
    score?: number;
    logo?: string;
  };
  status?: "upcoming" | "live" | "completed";
}

export default function MatchCard({
  competition,
  round,
  date,
  time,
  venue,
  homeTeam,
  awayTeam,
  status = "upcoming",
}: MatchCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-zru-green transition-all duration-300 group"
    >
      {/* Header: Competition & Round */}
      <div className="bg-white/5 px-6 py-3 flex justify-between items-center border-b border-white/5">
        <span className="text-white text-xs font-bold tracking-widest uppercase truncate max-w-[70%]">
          {competition}
        </span>
        <span className="text-white/40 text-xs font-bold uppercase">{round}</span>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-3 w-1/3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2">
              {/* Fallback for logo */}
              <span className="text-black font-heading font-bold text-xl">
                {homeTeam.name.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <span className="text-white font-heading text-lg text-center leading-tight">
              {homeTeam.name}
            </span>
          </div>

          {/* VS / Score */}
          <div className="flex flex-col items-center justify-center w-1/3">
            {status === "completed" || status === "live" ? (
              <div className="text-3xl font-heading text-white bg-white/10 px-4 py-2 rounded-lg tracking-widest">
                {homeTeam.score} - {awayTeam.score}
              </div>
            ) : (
                <div className="flex flex-col items-center">
                    <span className="text-3xl font-heading text-white/20 mb-2">VS</span>
                    <div className="px-3 py-1 bg-white/10 rounded text-xs font-bold uppercase text-zru-green">
                        UPCOMING
                    </div>
                </div>
            )}
            {status === "live" && (
                <span className="text-zru-green text-[10px] font-bold tracking-widest uppercase mt-2 animate-pulse">
                    ● LIVE
                </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-3 w-1/3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 border-2 border-transparent group-hover:border-zru-green transition-colors">
               <span className="text-black font-heading font-bold text-xl">
                {awayTeam.name.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <span className="text-white font-heading text-lg text-center leading-tight">
              {awayTeam.name}
            </span>
          </div>
        </div>

        {/* Details: Date, Time, Venue */}
        <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-white/60">
                <Calendar className="w-4 h-4" />
                <span className="font-bold uppercase">{date}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full mx-1"></span>
                <Clock className="w-4 h-4" />
                <span className="font-bold uppercase">{time}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase hover:text-zru-green transition-colors cursor-pointer">
             <MapPin className="w-3 h-3" />
             <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
             >
                {venue}
             </a>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
            <Link href="/match-centre/match-details">
                <Button variant="outline" className="w-full justify-between group-hover:bg-white group-hover:text-rich-black transition-all duration-300">
                    <span>MATCH CENTER</span>
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </Link>
        </div>
      </div>
    </motion.div>
  );
}
