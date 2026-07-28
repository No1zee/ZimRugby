"use client";

import type { Team } from "@/types/team";
import Link from "next/link";
import Image from "next/image";
import TeamLogo from "./TeamLogo";

interface TileMeta {
  colSpan: string;
  rowSpan: string;
  order: string;
}

const TILE_MAP: Record<string, TileMeta> = {
  sables: {
    colSpan: "col-span-1 sm:col-span-2",
    rowSpan: "row-span-1 sm:row-span-2",
    order: "order-1",
  },
  "lady-sables": {
    colSpan: "col-span-1 sm:col-span-2",
    rowSpan: "row-span-1",
    order: "order-2",
  },
  cheetahs: {
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    order: "order-3",
  },
  "junior-sables": {
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    order: "order-4",
  },
};

function TeamTile({ team }: { team: Team }) {
  const meta = TILE_MAP[team.slug] ?? {
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    order: "",
  };

  const bgImage = team.heroImage || team.featuredImage || "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp";

  return (
    <Link
      href={team.href}
      className={[
        "group relative flex items-end",
        "min-h-[280px] sm:min-h-[320px] rounded-2xl overflow-hidden",
        "border border-rich-black/[0.06]",
        "shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
        "hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
        "transition-[box-shadow] duration-500",
        meta.colSpan,
        meta.rowSpan,
        meta.order,
      ].join(" ")}
    >
      {/* Background Image */}
      <Image
        src={bgImage}
        alt={team.fullName}
        fill
        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content — Logo only, centered at bottom */}
      <div className="relative z-10 w-full p-6 sm:p-8 flex justify-center">
        <TeamLogo
          name={team.shortName}
          accent={team.accent}
          jerseyColors={team.jerseyColors}
          size="lg"
        />
      </div>
    </Link>
  );
}

export default function TeamBentoGrid({ teams }: { teams: Team[] }) {
  return (
    <>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-12 mb-6 sm:mb-8">
        <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight not-italic text-rich-black leading-[1.0]">
          OUR <span className="text-accent-teal">TEAMS</span>
        </h2>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-[auto_auto_auto] gap-3 sm:gap-4">
          {teams.map((team) => (
            <TeamTile key={team.id} team={team} />
          ))}
        </div>
      </div>
    </>
  );
}
