"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SlantedButton from "@/components/ui/SlantedButton";
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
    logo?: string;
  };
  awayTeam: {
    name: string;
    score?: number;
    logo?: string;
  };
  status?: "upcoming" | "live" | "completed" | "finished";
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
      whileHover={{ y: -4 }}
      className="relative h-full flex flex-col bg-white border border-black/10 hover:border-zru-green/60 rounded-2xl overflow-hidden group shadow-[0_1px_2px_rgba(0,0,0,0.14),0_6px_16px_rgba(0,0,0,0.10)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.14),0_14px_28px_rgba(0,0,0,0.16)] transition-all duration-300 text-black before:content-[''] before:absolute before:top-0 before:left-[12%] before:right-[12%] before:h-px before:bg-gradient-to-r before:from-transparent before:via-black/20 before:to-transparent"
    >
      {/* Header: Competition & Round */}
      <div className="bg-milk-white px-6 py-3.5 flex justify-between items-center border-b border-black/10">
        <div className="flex items-center gap-2 truncate max-w-[70%]">
          {teamCategory && (
            <span className="bg-zru-green text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded tracking-wider shrink-0">
              {teamCategory}
            </span>
          )}
          <span className="text-black/80 text-xs font-extrabold tracking-widest uppercase truncate font-heading">
            {competition}
          </span>
        </div>
        <span className="text-black/50 text-xs font-bold uppercase">{round}</span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2.5 w-1/3">
            <div className="w-16 h-16 bg-milk-white rounded-full flex items-center justify-center p-2 border border-black/10 overflow-hidden relative shadow-sm group-hover:border-zru-green/30 transition-colors">
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
                <span className="text-black font-heading font-black text-xl">
                  {homeTeam.name.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-black font-heading text-sm text-center leading-tight uppercase font-black">
              {homeTeam.name}
            </span>
          </div>

          {/* VS / Score */}
          <div className="flex flex-col items-center justify-center w-1/3">
            {status === "completed" || status === "live" ? (
              <div className="relative overflow-hidden text-2xl font-heading text-white bg-gradient-to-b from-[#0A7A55] to-[#005238] px-4 py-1.5 rounded-lg tracking-widest font-black shadow-[0_3px_0_#00301A,0_6px_12px_rgba(0,0,0,0.20)] before:content-[''] before:absolute before:inset-x-1 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/20 before:to-transparent">
                {homeTeam.score} - {awayTeam.score}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-heading text-black/30 mb-1 font-black">VS</span>
                <div className="px-3 py-0.5 bg-black/5 border border-black/10 rounded text-[9px] font-extrabold uppercase text-black/70 tracking-wider">
                  UPCOMING
                </div>
              </div>
            )}
            {status === "live" && (
              <span className="text-zru-green text-[10px] font-black tracking-wider uppercase mt-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-zru-green/10 border border-zru-green/20">
                <span className="w-1.5 h-1.5 rounded-full bg-zru-green" /> LIVE NOW
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2.5 w-1/3">
            <div className="w-16 h-16 bg-milk-white rounded-full flex items-center justify-center p-2 border border-black/10 overflow-hidden relative shadow-sm group-hover:border-zru-green/30 transition-colors">
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
                <span className="text-black font-heading font-black text-xl">
                  {awayTeam.name.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-black font-heading text-sm text-center leading-tight uppercase font-black">
              {awayTeam.name}
            </span>
          </div>
        </div>

        {/* Details: Date, Time, Venue */}
        <div className="flex flex-col gap-2 border-t border-black/10 pt-4 mt-auto">
          <div className="flex items-center justify-between text-xs text-black/70">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-zru-green" />
              <span className="font-extrabold uppercase">{date}</span>
              <span className="w-1 h-1 bg-black/20 rounded-full mx-1" />
              <Clock className="w-3.5 h-3.5 text-zru-green" />
              <span className="font-extrabold uppercase">{time}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-black/70 hover:text-zru-green text-xs font-bold uppercase transition-colors">
            <MapPin className="w-3.5 h-3.5 text-zru-green" />
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
        <div className="pt-5">
          <Link href={`/matches/${id}`} className="w-full block">
            <SlantedButton variant="secondary" size="sm" className="w-full justify-center">
              MATCH DETAILS
            </SlantedButton>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
