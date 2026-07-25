"use client";

import Image from "next/image";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TeamMatch } from "@/types";

interface RecentResultsStripProps {
  matches: TeamMatch[];
  teamName: string;
}

function parseScore(score: string): { home: number; away: number } | null {
  const parts = score.split("-").map(s => parseInt(s.trim()));
  if (parts.length === 2 && !parts.some(isNaN)) {
    return { home: parts[0], away: parts[1] };
  }
  return null;
}

function getResult(score: string): "win" | "loss" | "draw" {
  const parsed = parseScore(score);
  if (!parsed) return "draw";
  if (parsed.home > parsed.away) return "win";
  if (parsed.home < parsed.away) return "loss";
  return "draw";
}

const RESULT_STYLES = {
  win: { bg: "bg-zru-green/5", border: "border-zru-green/20", icon: TrendingUp, label: "WIN", color: "text-zru-green" },
  loss: { bg: "bg-red-50", border: "border-red-200", icon: TrendingDown, label: "LOSS", color: "text-red-600" },
  draw: { bg: "bg-black/5", border: "border-black/10", icon: Minus, label: "DRAW", color: "text-black/50" },
};

export default function RecentResultsStrip({ matches, teamName }: RecentResultsStripProps) {
  const recentCompleted = matches
    .filter(m => m.status === "completed" && m.score)
    .slice(-3)
    .reverse();

  if (recentCompleted.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Trophy className="w-4 h-4 text-zru-green" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green">
          Recent Results
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recentCompleted.map((match, idx) => {
          const result = getResult(match.score!);
          const style = RESULT_STYLES[result];
          const ResultIcon = style.icon;

          return (
            <div
              key={idx}
              className={`rounded-xl border p-4 flex items-center gap-4 transition-all hover:shadow-md ${style.bg} ${style.border}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${style.border}`}>
                <ResultIcon className={`w-5 h-5 ${style.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {match.opponentLogo && (
                    <Image
                      src={match.opponentLogo}
                      alt={match.opponent}
                      width={20}
                      height={14}
                      className="object-contain shrink-0"
                    />
                  )}
                  <span className="text-sm font-black text-rich-black uppercase tracking-tight truncate">
                    vs {match.opponent}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-black/50 font-bold">{match.date}</span>
                  <span className="text-[10px] text-black/30">|</span>
                  <span className="text-xs text-black/50 font-bold">{match.venue}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xl font-black italic tracking-tighter ${style.color}`}>
                  {match.score}
                </span>
                <span className={`block text-[9px] font-black uppercase tracking-widest ${style.color} mt-0.5`}>
                  {style.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
