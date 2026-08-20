import React from "react";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

interface TeamInfo {
  name: string;
  logo?: string;
  score?: number;
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
  const content = (
    <div className="bg-white border border-black/5 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
      {competition && (
        <span className="text-[9px] font-black uppercase tracking-widest text-zru-green mb-4 block">
          {competition}
        </span>
      )}

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0 border border-black/10">
            <span className="text-[10px] font-black uppercase">{homeTeam.name.slice(0, 3)}</span>
          </div>
          <span className="text-sm font-bold truncate">{homeTeam.name}</span>
        </div>

        <div className="text-center shrink-0">
          {status === "live" ? (
            <span className="text-[10px] font-black uppercase text-red-500 animate-pulse">LIVE</span>
          ) : status === "completed" && homeTeam.score != null && awayTeam.score != null ? (
            <span className="text-lg font-black">
              {homeTeam.score} - {awayTeam.score}
            </span>
          ) : (
            <span className="text-[10px] font-black text-zru-green">VS</span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
          <span className="text-sm font-bold truncate">{awayTeam.name}</span>
          <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0 border border-black/10">
            <span className="text-[10px] font-black uppercase">{awayTeam.name.slice(0, 3)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-black/50 font-normal">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> {date}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> {venue}
        </span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} prefetch={false}>{content}</Link>;
  }

  return content;
}
