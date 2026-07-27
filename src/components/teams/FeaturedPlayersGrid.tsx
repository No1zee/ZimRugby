import FeaturedPlayerCard from "./FeaturedPlayerCard";
import type { FeaturedPlayer } from "@/types";

interface FeaturedPlayersGridProps {
  players: FeaturedPlayer[];
}

export default function FeaturedPlayersGrid({
  players,
}: FeaturedPlayersGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 items-start">
      {players.map((player, i) => (
        <div
          key={player.name}
          className={i === 0 ? "lg:col-span-2" : i === 1 ? "lg:col-span-2 lg:mt-8" : "lg:col-span-2 lg:mt-4"}
        >
          <FeaturedPlayerCard player={player} />
        </div>
      ))}
    </div>
  );
}
