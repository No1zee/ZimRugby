"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TeamLogo from "./TeamLogo";
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
        "group relative snap-center shrink-0 flex flex-col items-center gap-3 py-4 px-5 rounded-2xl transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal cursor-pointer",
        isActive
          ? "bg-white/[0.08] ring-1 ring-white/15"
          : "hover:bg-white/[0.04]"
      )}
    >
      <TeamLogo
        name={team.shortName}
        accent={team.accent}
        jerseyColors={team.jerseyColors}
        isActive={isActive}
        size="lg"
      />

      <div className="text-center space-y-1">
        <h3
          className={cn(
            "font-heading not-italic text-sm sm:text-base font-black uppercase tracking-wide transition-colors duration-300",
            isActive ? "text-white" : "text-white/60 group-hover:text-white/80"
          )}
        >
          {team.shortName}
        </h3>

        <p
          className={cn(
            "text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
            isActive ? "text-accent-teal" : "text-white/30"
          )}
        >
          {team.ranking}
        </p>
      </div>

      {/* Active indicator dot */}
      {isActive && (
        <motion.div
          layoutId="active-dot"
          className="w-1.5 h-1.5 rounded-full bg-accent-teal"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
