"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getFlagUrl, COUNTRY_ISO_MAP } from "@/lib/flags";
import { getTeamEmblem } from "@/lib/teamLogos";

interface MatchCardProps {
  id: string | number;
  competition: string;
  round?: string;
  date: string;
  time?: string;
  venue?: string;
  homeTeam: {
    name: string;
    score?: number | null;
    logo?: string;
  };
  awayTeam: {
    name: string;
    score?: number | null;
    logo?: string;
  };
  status?: "upcoming" | "live" | "completed";
  teamCategory?: string;
  opponentCategory?: string;
}

function resolveTeamFlag(teamName: string, customLogo?: string): string {
  if (customLogo) return customLogo;
  if (!teamName) return "";
  const direct = getFlagUrl(teamName);
  if (direct) return direct;
  const match = Object.keys(COUNTRY_ISO_MAP).find((c) =>
    teamName.toLowerCase().includes(c.toLowerCase())
  );
  if (match) return getFlagUrl(match);
  return "";
}

function getTeamCode(name: string): string {
  if (!name) return "ZRU";
  const clean = name.replace(/\b(U\d+|Women|Men|Sevens|XV)\b/gi, "").trim();
  if (clean.length >= 3) {
    return clean.substring(0, 3).toUpperCase();
  }
  return name.substring(0, 3).toUpperCase();
}

function formatMatchDate(rawDate?: string): string {
  if (!rawDate) return "Date TBA";
  try {
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  } catch {
    /* fallback to raw */
  }
  return rawDate;
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
  opponentCategory,
}: MatchCardProps) {
  const [imgError, setImgError] = useState<{ home: boolean; away: boolean }>({
    home: false,
    away: false,
  });

  const homeLogo = getTeamEmblem(homeTeam.name, homeTeam.logo);
  const awayLogo = getTeamEmblem(awayTeam.name, awayTeam.logo);

  const isLive = status === "live";
  const isCompleted = status === "completed";

  // Score extraction (Only display scores for COMPLETED or LIVE matches, never upcoming!)
  const hasScores = (isCompleted || isLive) && homeTeam.score != null && awayTeam.score != null;
  const homeScore = homeTeam.score ?? 0;
  const awayScore = awayTeam.score ?? 0;

  const formattedDate = formatMatchDate(date);

  return (
    <Link href={`/matches/${id}`} prefetch={false} className="block h-full group focus:outline-none">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative h-full flex flex-col justify-between bg-[#FDFBF0] border border-black/10 group-hover:border-zru-green/50 rounded-2xl overflow-hidden shadow-md group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 text-rich-black"
      >
        {/* Top Hairline Accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-zru-green/40 to-transparent group-hover:via-zru-green transition-all duration-500" />

        <div>
          {/* Header Strip: Competition + Status */}
          <div className="bg-[#FAF9F5]/80 px-4 sm:px-5 py-3 flex flex-wrap justify-between items-center gap-2 border-b border-black/10">
            {/* Left: Competition & Category */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Trophy className="w-3.5 h-3.5 text-zru-green shrink-0" />
              {teamCategory && (
                <span className="bg-zru-green text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs tracking-wider shrink-0">
                  {teamCategory}
                </span>
              )}
              {opponentCategory && opponentCategory.toLowerCase() !== "international" && (
                <span className="bg-neutral-200 text-neutral-800 text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider shrink-0">
                  {opponentCategory}
                </span>
              )}
              <span className="text-neutral-900 font-heading font-black text-xs tracking-wide uppercase truncate" title={competition}>
                {competition}
              </span>
            </div>

            {/* Right: Round & Match Status Pill */}
            <div className="flex items-center gap-2 shrink-0">
              {round && (
                <span className="text-neutral-500 text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:inline-block">
                  {round}
                </span>
              )}
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
          </div>

          {/* 3-Column VS Match Arena with Centered Time, Date, and Venue */}
          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-12 items-center gap-2 sm:gap-4 my-2">
              {/* Home Team (4 Cols) */}
              <div className="col-span-4 flex flex-col items-center text-center gap-2.5 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-black/10 flex items-center justify-center p-2.5 relative shadow-sm group-hover:border-zru-green/50 transition-all">
                  {homeLogo ? (
                    <Image
                      src={homeLogo}
                      alt={homeTeam.name}
                      width={60}
                      height={60}
                      className="object-contain max-h-full"
                      onError={() => setImgError((prev) => ({ ...prev, home: true }))}
                    />
                  ) : (
                    <span className="text-stone-900 font-heading font-black text-base sm:text-lg tracking-wider">
                      {getTeamCode(homeTeam.name)}
                    </span>
                  )}
                </div>
                <span className="text-stone-900 font-heading text-xs sm:text-sm font-black uppercase leading-tight tracking-wide line-clamp-2 px-1">
                  {homeTeam.name}
                </span>
              </div>

              {/* Center: VS Badge + Time + Date + Venue (4 Cols) */}
              <div className="col-span-4 flex flex-col items-center justify-center text-center px-1">
                {hasScores ? (
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-3 py-1.5 rounded-xl border border-black/10 shadow-xs mb-2">
                    <span className="text-xl sm:text-2xl font-heading font-black text-rich-black tabular-nums">
                      {homeScore}
                    </span>
                    <span className="text-neutral-400 font-bold text-sm">-</span>
                    <span className="text-xl sm:text-2xl font-heading font-black text-rich-black tabular-nums">
                      {awayScore}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-heading font-black text-[#002112] tracking-widest uppercase bg-[#b2f0ca] border border-[#00C88C]/40 px-3.5 py-1 rounded-full shadow-xs mb-2">
                    VS
                  </span>
                )}

                {/* Time */}
                {time && (
                  <span className="text-[11px] font-mono font-bold text-neutral-900 tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zru-green shrink-0" />
                    {time.includes("CAT") ? time : `${time} CAT`}
                  </span>
                )}

                {/* Date below time */}
                <span className="text-[11px] font-bold text-neutral-800 tracking-wide flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-zru-green shrink-0" />
                  {formattedDate}
                </span>

                {/* Venue below date in the middle */}
                {venue && (
                  <span className="text-[10px] font-medium text-neutral-600 tracking-tight flex items-center gap-1 mt-0.5 text-center line-clamp-1 max-w-full">
                    <MapPin className="w-2.5 h-2.5 text-zru-green shrink-0" />
                    <span className="truncate">{venue}</span>
                  </span>
                )}
              </div>

              {/* Away Team (4 Cols) */}
              <div className="col-span-4 flex flex-col items-center text-center gap-2.5 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-black/10 flex items-center justify-center p-2.5 relative shadow-sm group-hover:border-zru-green/50 transition-all">
                  {awayLogo ? (
                    <Image
                      src={awayLogo}
                      alt={awayTeam.name}
                      width={60}
                      height={60}
                      className="object-contain max-h-full"
                      onError={() => setImgError((prev) => ({ ...prev, away: true }))}
                    />
                  ) : (
                    <span className="text-stone-900 font-heading font-black text-base sm:text-lg tracking-wider">
                      {getTeamCode(awayTeam.name)}
                    </span>
                  )}
                </div>
                <span className="text-stone-900 font-heading text-xs sm:text-sm font-black uppercase leading-tight tracking-wide line-clamp-2 px-1">
                  {awayTeam.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info: Match Details Button */}
        <div className="bg-[#FAF9F5]/80 border-t border-black/10 px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 text-xs text-neutral-600">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 truncate">
            {competition}
          </span>

          <div className="clip-slanted inline-flex items-center gap-1.5 px-3.5 py-1 bg-zru-green/10 group-hover:bg-zru-green text-zru-green group-hover:text-white font-heading font-black text-[11px] uppercase tracking-wider transition-all duration-200 shrink-0 shadow-xs">
            <span>{isCompleted ? "Report" : "Details"}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
