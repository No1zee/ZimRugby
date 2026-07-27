"use client";

import type { Team } from "@/types/team";
import TeamRail from "./TeamRail";

interface Props {
  teams: Team[];
  activeTeam: Team;
  onSelect: (slug: string) => void;
}

export default function TeamRailShell({ teams, activeTeam, onSelect }: Props) {
  return (
    <section
      aria-labelledby="national-teams-rail-heading"
      className="space-y-3 sm:space-y-4"
    >
      <div className="flex flex-col gap-1 px-4 sm:px-8">
        <h2
          id="national-teams-rail-heading"
          className="font-heading text-base sm:text-lg text-white/80"
        >
          Choose a squad to explore
        </h2>
      </div>

      <div
        className="relative -mx-4 sm:mx-0 px-4 sm:px-0"
        aria-label="National team tabs"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-rich-black via-rich-black/40 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-rich-black via-rich-black/40 to-transparent z-10" />

        <div className="relative overflow-x-auto no-scrollbar snap-x snap-mandatory">
          <TeamRail teams={teams} activeTeam={activeTeam} onSelect={onSelect} />
        </div>
      </div>
    </section>
  );
}
