"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import Button from "../common/Button";
import Image from "next/image";
import Link from "next/link";
import { getFlagUrl } from "@/lib/flags";

interface MatchCardProps {
  id: string | number;
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
  teamCategory?: string;
}

export default function MatchCard({
  id,
  competition,
  round,
  date,
  time,
  venue,
  homeTeam,
  awayTeam,
  status = "upcoming",
  teamCategory,
}: MatchCardProps) {
  const [imgError, setImgError] = useState<{ home: boolean; away: boolean }>({
    home: false,
    away: false,
  });

  const homeLogo = !imgError.home && homeTeam.logo ? homeTeam.logo : getFlagUrl(homeTeam.name);
  const awayLogo = !imgError.away && awayTeam.logo ? awayTeam.logo : getFlagUrl(awayTeam.name);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full flex flex-col bg-gradient-to-br from-zru-green to-[#004d34] border border-black/5 rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300 text-white"
    >
      {/* Header: Competition & Round */}
      <div className="bg-black/20 px-6 py-3 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-2 truncate max-w-[70%]">
          {teamCategory && (
            <span className="bg-white text-zru-green text-[9px] font-black uppercase px-2 py-0.5 rounded-sm tracking-wider shrink-0">
              {teamCategory}
            </span>
          )}
          <span className="text-white/85 text-xs font-bold tracking-widest uppercase truncate">
            {competition}
          </span>
        </div>
        <span className="text-white/60 text-xs font-bold uppercase">{round}</span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-3 w-1/3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 border border-white/10 overflow-hidden relative shadow-sm">
              {homeLogo ? (
                <Image 
                  src={homeLogo} 
                  alt={homeTeam.name} 
                  fill 
                  sizes="64px" 
                  className="object-contain p-2"
                  onError={() => setImgError(prev => ({ ...prev, home: true }))}
                />
              ) : (
                <span className="text-black font-heading font-bold text-xl">
                  {homeTeam.name.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-white font-heading text-base text-center leading-tight uppercase font-black">
              {homeTeam.name}
            </span>
          </div>

          {/* VS / Score */}
          <div className="flex flex-col items-center justify-center w-1/3">
            {status === "completed" || status === "live" ? (
              <div className="text-2xl font-heading text-white bg-white/10 px-4 py-2 rounded-lg tracking-widest font-black">
                {homeTeam.score} - {awayTeam.score}
              </div>
            ) : (
                <div className="flex flex-col items-center">
                    <span className="text-3xl font-heading text-white/30 mb-2 font-black">VS</span>
                    <div className="px-3 py-1 bg-white/15 rounded text-[10px] font-black uppercase text-white tracking-wider">
                        UPCOMING
                    </div>
                </div>
            )}
            {status === "live" && (
                <span className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase mt-2 animate-pulse">
                    ● LIVE
                </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-3 w-1/3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 border border-white/10 overflow-hidden relative shadow-sm group-hover:border-white/40 transition-colors">
               {awayLogo ? (
                 <Image 
                  src={awayLogo} 
                  alt={awayTeam.name} 
                  fill 
                  sizes="64px" 
                  className="object-contain p-2" 
                  onError={() => setImgError(prev => ({ ...prev, away: true }))}
                 />
               ) : (
                 <span className="text-black font-heading font-bold text-xl">
                    {awayTeam.name.substring(0, 3).toUpperCase()}
                  </span>
               )}
            </div>
            <span className="text-white font-heading text-base text-center leading-tight uppercase font-black">
              {awayTeam.name}
            </span>
          </div>
        </div>

        {/* Details: Date, Time, Venue */}
        <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-white/75">
                <Calendar className="w-4 h-4 text-white/60" />
                <span className="font-bold uppercase text-xs">{date}</span>
                <span className="w-1 h-1 bg-white/15 rounded-full mx-1"></span>
                <Clock className="w-4 h-4 text-white/60" />
                <span className="font-bold uppercase text-xs">{time}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/75 hover:text-white text-xs font-bold uppercase transition-colors cursor-pointer">
             <MapPin className="w-3.5 h-3.5 text-white/70" />
             <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline truncate"
             >
                {venue}
             </a>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-6">
                <Link href={`/matches/${id}`} className="w-full block">
                    <button className="w-full py-2 font-heading text-xs font-bold uppercase border border-white/20 text-white hover:bg-white hover:text-zru-green rounded-lg transition-all duration-300">
                        VIEW DETAILS
                    </button>
                </Link>
        </div>
      </div>
    </motion.div>
  );
}
