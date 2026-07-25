"use client";

import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { TeamMatch } from "@/types";

interface NextMatchBannerProps {
  matches: TeamMatch[];
  teamName: string;
}

export default function NextMatchBanner({ matches, teamName }: NextMatchBannerProps) {
  const nextMatch = matches.find(m => m.status === "upcoming");

  if (!nextMatch) return null;

  return (
    <div className="bg-white border border-black/5 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green">
          Next Match
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zru-green/10 border border-zru-green/20 flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-black text-zru-green">
                {teamName.split(" ").pop()?.substring(0, 3).toUpperCase() || "ZIM"}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rich-black text-center">
              {teamName.split(" ").pop() || "Zimbabwe"}
            </span>
          </div>

          <span className="text-xs font-black text-black/30 uppercase tracking-widest">vs</span>

          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/5 border border-black/10 flex items-center justify-center overflow-hidden">
              {nextMatch.opponentLogo ? (
                <Image
                  src={nextMatch.opponentLogo}
                  alt={nextMatch.opponent}
                  width={48}
                  height={32}
                  className="object-contain"
                />
              ) : (
                <span className="text-lg sm:text-xl font-black text-black/40">
                  {nextMatch.opponent.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rich-black text-center">
              {nextMatch.opponent}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6 sm:text-right">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zru-green shrink-0" />
            <span className="text-sm font-bold text-rich-black">{nextMatch.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zru-green shrink-0" />
            <span className="text-sm font-bold text-rich-black">{nextMatch.venue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
