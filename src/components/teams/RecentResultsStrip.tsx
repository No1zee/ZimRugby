"use client";

import { useState } from "react";
import Image from "next/image";
import { Trophy, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";
import { TeamMatch } from "@/types";
import { getTeamEmblem } from "@/lib/teamLogos";

interface RecentResultsStripProps {
  matches: TeamMatch[];
  teamName: string;
}

function parseScore(score?: string): { zim: number; opp: number } | null {
  if (!score) return null;
  const parts = score.split("-").map(s => parseInt(s.trim(), 10));
  if (parts.length === 2 && !parts.some(isNaN)) {
    return { zim: parts[0], opp: parts[1] };
  }
  return null;
}

function getResult(match: TeamMatch): "win" | "loss" | "draw" {
  if (typeof match.zimScore === "number" && typeof match.opponentScore === "number") {
    if (match.zimScore > match.opponentScore) return "win";
    if (match.zimScore < match.opponentScore) return "loss";
    return "draw";
  }
  const parsed = parseScore(match.score);
  if (!parsed) return "draw";
  if (parsed.zim > parsed.opp) return "win";
  if (parsed.zim < parsed.opp) return "loss";
  return "draw";
}

const RESULT_STYLES = {
  win: { bg: "bg-zru-green/5", border: "border-zru-green/20", icon: TrendingUp, label: "WIN", color: "text-zru-green" },
  loss: { bg: "bg-red-50", border: "border-red-200", icon: TrendingDown, label: "LOSS", color: "text-red-600" },
  draw: { bg: "bg-black/5", border: "border-black/10", icon: Minus, label: "DRAW", color: "text-black/50" },
};

export default function RecentResultsStrip({ matches, teamName }: RecentResultsStripProps) {
  const [expandedMatchIdx, setExpandedMatchIdx] = useState<number | null>(null);

  const recentCompleted = matches
    .filter(m => m.status === "completed" && (m.score || (typeof m.zimScore === "number" && typeof m.opponentScore === "number")))
    .slice(-3)
    .reverse();

  if (recentCompleted.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Trophy className="w-4 h-4 text-zru-green" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green">
          Recent Results &bull; {teamName}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recentCompleted.map((match, idx) => {
          const result = getResult(match);
          const style = RESULT_STYLES[result];
          const ResultIcon = style.icon;
          const logoSrc = getTeamEmblem(match.opponent, match.opponentLogo);
          const isExpanded = expandedMatchIdx === idx;
          const displayScore = match.score || (typeof match.zimScore === "number" ? `${match.zimScore} - ${match.opponentScore}` : "N/A");
          const stats = match.statsSummary;

          return (
            <div
              key={idx}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-[box-shadow,border-color] duration-200 hover:shadow-md ${style.bg} ${style.border}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${style.border}`}>
                  <ResultIcon className={`w-5 h-5 ${style.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-4 relative shrink-0 flex items-center justify-center overflow-hidden rounded-[2px]">
                      <Image
                        src={logoSrc}
                        alt={`${match.opponent} emblem`}
                        fill
                        sizes="20px"
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm font-black text-rich-black uppercase tracking-tight truncate">
                      vs {match.opponent}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 truncate">
                    <span className="text-[11px] text-black/60 font-bold">{match.date}</span>
                    <span className="text-[10px] text-black/30">&bull;</span>
                    <span className="text-[11px] text-black/60 font-bold truncate">{match.venue}</span>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className={`text-xl font-black not-italic tracking-tighter tabular-nums ${style.color}`}>
                    {displayScore}
                  </span>
                  <span className={`block text-[9px] font-black uppercase tracking-widest ${style.color} mt-0.5`}>
                    {style.label}
                  </span>
                </div>
              </div>

              {/* High-level stats summary drawer */}
              {stats && (
                <div className="mt-3 pt-3 border-t border-black/5">
                  <button
                    type="button"
                    onClick={() => setExpandedMatchIdx(isExpanded ? null : idx)}
                    className="flex items-center justify-between w-full text-[10px] font-bold text-black/50 hover:text-black/80 transition-colors uppercase tracking-wider"
                  >
                    <span>Official Match Summary</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 space-y-1.5 text-[11px] bg-white/60 backdrop-blur-sm rounded-lg p-2.5 border border-black/5">
                      {stats.halfTimeScore && (
                        <div className="flex justify-between items-center text-black/70">
                          <span className="font-semibold">Half-Time Score:</span>
                          <span className="font-black text-rich-black">{stats.halfTimeScore}</span>
                        </div>
                      )}
                      {(stats.triesZim !== undefined || stats.triesOpp !== undefined) && (
                        <div className="flex justify-between items-center text-black/70">
                          <span className="font-semibold">Tries (ZIM / OPP):</span>
                          <span className="font-black text-rich-black">{stats.triesZim ?? 0} &ndash; {stats.triesOpp ?? 0}</span>
                        </div>
                      )}
                      {stats.topScorer && (
                        <div className="flex justify-between items-center text-black/70 pt-1 border-t border-black/5">
                          <span className="font-semibold">Top Scorer:</span>
                          <span className="font-bold text-zru-green truncate max-w-[140px]">{stats.topScorer}</span>
                        </div>
                      )}
                      {(stats.yellowCardsZim || stats.redCardsZim) ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-700 font-bold pt-1">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Cards (ZIM): {stats.yellowCardsZim ? `${stats.yellowCardsZim} Yellow` : ""}{stats.redCardsZim ? ` ${stats.redCardsZim} Red` : ""}</span>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
