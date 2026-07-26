"use client";

import FeaturedPlayerCard from "./FeaturedPlayerCard";
import type { FeaturedPlayer } from "@/types";

interface FeaturedPlayersGridProps {
  players: FeaturedPlayer[];
}

/**
 * Fixed 3-column grid of FeaturedPlayerCards for the homepage.
 * Always one row — cards scale down on small screens.
 */
export default function FeaturedPlayersGrid({
  players,
}: FeaturedPlayersGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 justify-items-center">
      {players.map((player) => (
        <FeaturedPlayerCard key={player.name} player={player} />
      ))}
    </div>
  );
}
