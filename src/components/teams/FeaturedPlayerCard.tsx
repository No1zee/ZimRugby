"use client";

import Image from "next/image";
import Link from "next/link";
import { CometCard } from "@/components/ui/comet-card";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { FeaturedPlayer } from "@/types";

interface FeaturedPlayerCardProps {
  player: FeaturedPlayer;
}

export default function FeaturedPlayerCard({ player }: FeaturedPlayerCardProps) {
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const slug =
    player.slug ?? player.name.toLowerCase().replace(/\s+/g, "-");

  const cardContent = (
    <div className="group relative rounded-2xl bg-white border border-black/5 overflow-hidden shadow-sm hover:shadow-lg hover:border-zru-green/20 transition-[box-shadow,border-color] duration-300 w-full">
      {/* Image area with shield clip-path */}
      <div className="relative">
        <div
          className="relative h-[260px] sm:h-[280px] lg:h-[320px] bg-gradient-to-b from-zru-green to-[#003822]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%)" }}
        >
          {/* Watermark name */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <span
              className="font-heading text-[4rem] sm:text-[5rem] leading-[0.85] font-black uppercase not-italic text-white/[0.08] text-center select-none break-all"
              style={{ writingMode: "vertical-lr" }}
            >
              {player.name}
            </span>
          </div>

          {/* Player image */}
          {player.photo && player.photo !== "/images/teams/player-placeholder.webp" ? (
            <Image
              src={player.photo}
              alt={player.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top group-hover:brightness-110 transition-[filter] duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-heading font-black text-white/20 tracking-tight">
                {player.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
              </span>
            </div>
          )}
        </div>

        {/* Position badge — overlaps the shield clip edge */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
          <div className="clip-slanted-sm bg-zru-green text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 shadow-lg shadow-zru-green/30">
            {player.position}
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="pt-8 pb-2 px-4 text-center">
        <h3 className="font-heading text-sm sm:text-base lg:text-lg font-black uppercase tracking-tight text-rich-black leading-tight">
          {player.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-neutral-mid mt-0.5">{player.team}</p>
      </div>

      {/* Stats row */}
      <div className="mx-auto grid w-fit grid-cols-2 divide-x divide-black/5 py-2.5 border-t border-black/5">
        <div className="px-5 text-center">
          <div className="text-[13px] font-bold text-rich-black">{player.caps}</div>
          <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-0.5">Caps</div>
        </div>
        <div className="px-5 text-center">
          <div className="text-[13px] font-bold text-rich-black">{player.age}</div>
          <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-0.5">Age</div>
        </div>
      </div>

      {/* View Profile CTA */}
      <div className="px-4 pb-4 pt-1 text-center">
        <Link
          href={`/players/${slug}`}
          className="inline-block clip-slanted-sm bg-gradient-to-b from-[#00704D] to-[#005238] hover:from-[#006747] hover:to-[#00402B] text-white font-heading font-black text-[10px] sm:text-[11px] uppercase tracking-[0.18em] px-5 py-2 transition-[background-color,box-shadow] duration-300 shadow-sm hover:shadow-md"
        >
          View Profile
        </Link>
      </div>
    </div>
  );

  if (prefersReduced || isMobile) {
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
