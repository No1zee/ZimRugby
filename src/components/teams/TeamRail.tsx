"use client";

import { useRef } from "react";
import type { Team } from "@/types/team";
import TeamRailCard from "./TeamRailCard";

interface Props {
  teams: Team[];
  activeTeam: Team;
  onSelect: (slug: string) => void;
}

export default function TeamRail({ teams, activeTeam, onSelect }: Props) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % teams.length;
    if (e.key === "ArrowLeft")
      next = (index - 1 + teams.length) % teams.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = teams.length - 1;
    if (next !== null) {
      e.preventDefault();
      onSelect(teams[next].slug);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      aria-label="Select national team"
      className="flex gap-4 sm:gap-5 md:gap-6 py-2"
    >
      {teams.map((team, i) => (
        <div
          key={team.id}
          onKeyDown={(e) => handleKeyDown(e, i)}
        >
          <TeamRailCard
            team={team}
            isActive={team.slug === activeTeam.slug}
            index={i}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  );
}
