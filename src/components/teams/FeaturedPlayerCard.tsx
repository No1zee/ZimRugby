"use client";

import Image from "next/image";
import Link from "next/link";
import { CometCard } from "@/components/ui/comet-card";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { FeaturedPlayer } from "@/types";

interface FeaturedPlayerCardProps {
  player: FeaturedPlayer;
}

/**
 * Compact player card wrapped in CometCard 3D tilt.
 * Shows: circular photo, name, position, team, caps/age stats, profile link.
 * Falls back to a static card on mobile and for prefers-reduced-motion.
 */
export default function FeaturedPlayerCard({ player }: FeaturedPlayerCardProps) {
  const prefersReduced = usePrefersReducedMotion();

  const slug =
    player.slug ?? player.name.toLowerCase().replace(/\s+/g, "-");

  const cardContent = (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 p-3 sm:p-4 lg:p-5 w-full">
      {/* Photo */}
      <div className="flex justify-center mb-3 lg:mb-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-zru-green/20">
          <Image
            src={player.photo}
            alt={player.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="text-center font-heading font-black text-sm sm:text-base lg:text-lg uppercase tracking-wide text-rich-black leading-tight">
        {player.name}
      </h3>

      {/* Position • Team */}
      <p className="text-center text-xs sm:text-sm text-neutral-mid mt-1">
        {player.position} • {player.team}
      </p>

      {/* Stats row */}
      <div className="flex justify-center gap-6 sm:gap-8 mt-3 lg:mt-4 pt-3 border-t border-black/5">
        <div className="text-center">
          <span className="block text-base sm:text-lg font-black text-rich-black leading-none">
            {player.caps}
          </span>
          <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-mid mt-1 block">
            Caps
          </span>
        </div>
        <div className="text-center">
          <span className="block text-base sm:text-lg font-black text-rich-black leading-none">
            {player.age}
          </span>
          <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-mid mt-1 block">
            Age
          </span>
        </div>
      </div>

      {/* View profile link */}
      <div className="mt-3 lg:mt-4 text-center">
        <Link
          href={`/players/${slug}`}
          className="inline-block clip-slanted-sm bg-gradient-to-b from-[#00704D] to-[#005238] hover:from-[#006747] hover:to-[#00402B] text-white font-heading font-black text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.18em] px-4 sm:px-5 lg:px-6 py-1.5 sm:py-2 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          View Profile
        </Link>
      </div>
    </div>
  );

  // Static card: no 3D tilt on mobile or when reduced motion is preferred
  if (prefersReduced) {
    return <div className="w-full">{cardContent}</div>;
  }

  return (
    <CometCard
      rotateDepth={14}
      translateDepth={16}
      className="w-full"
    >
      {cardContent}
    </CometCard>
  );
}
