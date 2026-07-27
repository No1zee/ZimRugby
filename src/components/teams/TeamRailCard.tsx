"use client";

import { motion } from "framer-motion";
import { Trophy, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Team } from "@/types/team";

interface Props {
  team: Team;
  isActive: boolean;
  index: number;
  onSelect: (slug: string) => void;
}

export default function TeamRailCard({
  team,
  isActive,
  index,
  onSelect,
}: Props) {
  return (
    <motion.button
      role="tab"
      id={`tab-${team.slug}`}
      aria-selected={isActive}
      aria-controls={`panel-${team.slug}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onSelect(team.slug)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={!isActive ? { y: -4 } : undefined}
      className={cn(
        "group relative snap-center shrink-0 w-[260px] rounded-2xl p-5 text-left transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal",
        isActive
          ? "card-green shadow-[0_12px_32px_rgba(0,150,70,0.25)]"
          : "card-surface card-glow-green hover:shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
      )}
      style={
        isActive
          ? {
              borderTop: `3px solid ${team.accent}`,
              transform: "scale(1.02)",
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider"
          style={{
            backgroundColor: `${team.accent}22`,
            color: team.accent,
          }}
        >
          {team.format === "7s" ? (
            <Zap className="w-3 h-3" />
          ) : (
            <ShieldCheck className="w-3 h-3" />
          )}
          {team.format.toUpperCase()}
        </span>

        {isActive ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent-teal">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active
          </span>
        ) : (
          <div className="flex gap-1">
            {team.jerseyColors.map((c, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full ring-1 ring-white/20"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
      </div>

      <h3 className="font-heading italic text-2xl font-black text-white mb-1 leading-none">
        {team.shortName}
      </h3>
      <p className="text-xs text-white/50 mb-3 line-clamp-2">
        {team.tagline}
      </p>

      <div
        className="flex items-center gap-1.5 text-sm font-bold tracking-wide"
        style={{ color: team.accent }}
      >
        <Trophy className="w-4 h-4" />
        {team.ranking}
      </div>

      <span className="absolute bottom-4 right-5 text-[10px] uppercase tracking-wider text-white/0 group-hover:text-white/50 transition-colors duration-300">
        View Team →
      </span>
    </motion.button>
  );
}
