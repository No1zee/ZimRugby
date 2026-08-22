import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

interface TeamInfo {
  name: string;
  logo?: string;
  score?: number | null;
}

interface MatchCardProps {
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  date: string;
  venue: string;
  competition?: string;
  status: "upcoming" | "completed" | "live";
  href?: string;
}

export default function MatchCard({
  homeTeam,
  awayTeam,
  date,
  venue,
  competition,
  status,
  href,
}: MatchCardProps) {
  const isCompleted = status === "completed";
  const isLive = status === "live";
  const hasScores = (isCompleted || isLive) && homeTeam.score != null && awayTeam.score != null;

  const card = (
    <div className="bg-[#FDFBF0] border border-black/10 rounded-2xl p-5 hover:border-zru-green/50 hover:shadow-lg transition-all duration-300 group cursor-pointer text-rich-black flex flex-col justify-between h-full">
      <div>
        {/* Header Strip */}
        <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-3 mb-4">
          <span className="text-[11px] font-heading font-black uppercase tracking-wider text-neutral-800 truncate">
            {competition || "Match Fixture"}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest border shrink-0 ${
              isLive
                ? "bg-red-500/15 text-red-700 border-red-500/30 animate-pulse"
                : isCompleted
                ? "bg-black/5 text-neutral-700 border-black/10"
                : "bg-zru-green/10 text-zru-green border-zru-green/30"
            }`}
          >
            {isLive ? "● LIVE" : isCompleted ? "FINAL" : "UPCOMING"}
          </span>
        </div>

        {/* 3-Column VS Arena */}
        <div className="grid grid-cols-11 items-center gap-2 py-2">
          {/* Home Team */}
          <div className="col-span-4 flex flex-col items-center text-center gap-2 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-white border border-black/10 flex items-center justify-center p-2 shadow-xs group-hover:border-zru-green/40 transition-all">
              {homeTeam.logo ? (
                <Image src={homeTeam.logo} alt={homeTeam.name} width={40} height={40} className="object-contain max-h-full" />
              ) : (
                <span className="text-xs font-heading font-black text-rich-black">
                  {homeTeam.name.slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-xs font-heading font-black uppercase text-rich-black truncate w-full">
              {homeTeam.name}
            </span>
          </div>

          {/* Center VS / Scores */}
          <div className="col-span-3 flex flex-col items-center justify-center text-center">
            {hasScores ? (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-black/10 shadow-xs">
                <span className="text-base font-heading font-black text-rich-black tabular-nums">{homeTeam.score}</span>
                <span className="text-neutral-400 font-bold text-xs">-</span>
                <span className="text-base font-heading font-black text-rich-black tabular-nums">{awayTeam.score}</span>
              </div>
            ) : (
              <span className="text-[10px] font-heading font-black text-[#002112] tracking-widest uppercase bg-[#b2f0ca] border border-[#00C88C]/40 px-3 py-0.5 rounded-full shadow-xs">
                VS
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="col-span-4 flex flex-col items-center text-center gap-2 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-white border border-black/10 flex items-center justify-center p-2 shadow-xs group-hover:border-zru-green/40 transition-all">
              {awayTeam.logo ? (
                <Image src={awayTeam.logo} alt={awayTeam.name} width={40} height={40} className="object-contain max-h-full" />
              ) : (
                <span className="text-xs font-heading font-black text-rich-black">
                  {awayTeam.name.slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-xs font-heading font-black uppercase text-rich-black truncate w-full">
              {awayTeam.name}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 mt-3 border-t border-black/10 flex items-center justify-between gap-2 text-xs text-neutral-600">
        <div className="flex flex-col min-w-0 text-[11px]">
          <span className="truncate flex items-center gap-1.5 font-medium text-neutral-800">
            <Calendar className="w-3.5 h-3.5 text-zru-green shrink-0" />
            <span>{date}</span>
          </span>
          {venue && (
            <span className="truncate flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase">
              <MapPin className="w-3.5 h-3.5 text-zru-green shrink-0" />
              <span>{venue}</span>
            </span>
          )}
        </div>

        <div className="clip-slanted inline-flex items-center gap-1 px-3 py-1 bg-black/5 group-hover:bg-zru-green group-hover:text-white font-heading font-black text-[10px] uppercase tracking-wider text-rich-black transition-all shrink-0">
          <span>Details</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} prefetch={false} className="block h-full">
        {card}
      </Link>
    );
  }

  return card;
}
