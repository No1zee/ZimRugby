"use client";

import Link from "next/link";
import { GraduationCap, MapPin } from "lucide-react";
import type { PageSection } from "@/lib/api/pages";

export default function DevelopmentPathways({ section }: { section: PageSection }) {
  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="group/devCard rounded-3xl p-6 sm:p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 relative overflow-hidden shadow-2xl transition-shadow duration-500 ease-in-out touch-manipulation cursor-pointer border border-white/10"
        style={{ background: "radial-gradient(circle at 50% 25%, #0A1C15 0%, #00331F 60%, #001A10 100%)" }}
      >
        <div className="absolute inset-0 border border-white/10 group-hover/devCard:border-[#006747]/60 group-focus-within/devCard:border-[#006747]/60 group-hover/devCard:shadow-[inset_0_0_60px_rgba(0,103,71,0.4)] transition-shadow duration-700 pointer-events-none rounded-3xl" />
        <div className="absolute inset-0 opacity-0 group-hover/devCard:opacity-20 group-focus-within/devCard:opacity-20 pointer-events-none bg-gradient-to-r from-transparent via-[#006747] to-transparent transition-opacity duration-700" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-[10px] font-black text-accent-teal uppercase tracking-[0.3em] font-heading">
            {section.eyebrow || "Development & Pathways"}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl text-white font-black uppercase tracking-tight leading-tight">
            {section.body || "From Schoolboy Leagues to National Caps"}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 font-body leading-relaxed line-clamp-2">
            {section.content ||
              "From premier high school competitions to provincial leagues, follow the talent pipeline driving Zimbabwean players onto the international stage."}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3 shrink-0">
          <Link
            href="/schools"
            className="group/btn inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-b from-[#00704D] to-[#005238] hover:from-[#00855B] hover:to-[#006747] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors duration-300 shadow-lg shadow-[#006747]/30 font-heading"
          >
            School Rugby Leagues <GraduationCap className="w-4 h-4" />
          </Link>
          <Link
            href="/clubs"
            className="group/btn inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 font-heading"
          >
            Find a Club <MapPin className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
