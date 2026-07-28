"use client";

import type { Team } from "@/types/team";
import Link from "next/link";
import TeamLogo from "./TeamLogo";
import { ArrowRight } from "lucide-react";

interface TileMeta {
  colSpan: string;
  rowSpan: string;
  order: string;
  tint: string;
}

const TILE_MAP: Record<string, TileMeta> = {
  sables: {
    colSpan: "col-span-1 sm:col-span-2",
    rowSpan: "row-span-1 sm:row-span-2",
    order: "order-1",
    tint: "bg-[#006747]/[0.04]",
  },
  "lady-sables": {
    colSpan: "col-span-1 sm:col-span-2",
    rowSpan: "row-span-1",
    order: "order-2",
    tint: "bg-[#00C88C]/[0.04]",
  },
  cheetahs: {
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    order: "order-3",
    tint: "bg-[#00704D]/[0.04]",
  },
  "junior-sables": {
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    order: "order-4",
    tint: "bg-[#00452A]/[0.04]",
  },
};

function TeamTile({ team }: { team: Team }) {
  const meta = TILE_MAP[team.slug] ?? {
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    order: "",
    tint: "bg-rich-black/[0.02]",
  };
  const isSables = team.slug === "sables";

  return (
    <Link
      href={team.href}
      className={[
        "group relative flex flex-col justify-between",
        "min-h-[280px] sm:min-h-[320px] rounded-2xl overflow-hidden",
        "border border-rich-black/[0.06]",
        "shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
        "transition-[filter] duration-300",
        "hover:brightness-[0.97]",
        "clip-slanted-sm",
        meta.colSpan,
        meta.rowSpan,
        meta.order,
        meta.tint,
      ].join(" ")}
    >
      {/* Hero image background (sables only) */}
      {isSables && team.heroImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={team.heroImage}
            alt=""
            className="w-full h-full object-cover opacity-[0.08] group-hover:opacity-[0.12] transition-[opacity] duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8">
        {/* Top: category label */}
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rich-black/40 font-heading">
          {team.category}
        </span>

        {/* Middle: logo + name + tagline */}
        <div className="flex-1 flex flex-col items-start justify-center gap-4 py-6">
          <div className={isSables ? "w-20 h-20 sm:w-24 sm:h-24" : "w-14 h-14 sm:w-16 sm:h-16"}>
            <TeamLogo
              name={team.shortName}
              accent={team.accent}
              jerseyColors={team.jerseyColors}
              size={isSables ? "lg" : "md"}
            />
          </div>
          <div>
            <h3 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight not-italic text-rich-black leading-tight">
              {team.shortName}
            </h3>
            <p className="text-xs text-rich-black/50 mt-1 font-body">{team.formatLabel}</p>
            <p className="text-xs text-rich-black/40 mt-2 font-body leading-relaxed max-w-[280px]">
              {team.tagline}
            </p>
          </div>
        </div>

        {/* Bottom: CTA */}
        <div className="flex items-end justify-between gap-4">
          <span
            className="font-heading text-sm font-black uppercase tracking-wide not-italic"
            style={{ color: team.accent }}
          >
            {team.keyHonour}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-rich-black/30 group-hover:text-rich-black/60 transition-colors duration-300">
            View squad
            <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function TeamBentoGrid({ teams }: { teams: Team[] }) {
  return (
    <>
      {/* Section heading */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 mb-8 sm:mb-12">
        <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight not-italic text-rich-black leading-[1.05]">
          Our Teams
        </h2>
      </div>

      {/* Bento grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-[auto_auto_auto] gap-3 sm:gap-4">
          {teams.map((team) => (
            <TeamTile key={team.id} team={team} />
          ))}
        </div>
      </div>
    </>
  );
}
