"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Partner {
  id: string;
  name: string;
  logo: string;
  role?: string;
}

const FEATURED: Partner = {
  id: "nedbank",
  name: "Nedbank Zimbabwe",
  logo: "/images/sponsors/nedbank.svg",
  role: "HEADLINE PARTNER",
};

const PARTNERS: Partner[] = [
  { id: "world-rugby", name: "World Rugby", logo: "/images/sponsors/world-rugby.png" },
  { id: "rugby-africa", name: "Rugby Africa", logo: "/images/sponsors/rugby-africa.png" },
  { id: "cfao", name: "CFAO Mobility", logo: "/images/sponsors/cfao.svg" },
  { id: "gilbert", name: "Gilbert Rugby", logo: "/images/sponsors/gilbert.svg" },
  { id: "blk", name: "BLK Sport", logo: "/images/sponsors/blk.svg" },
  { id: "seedco", name: "Seed Co", logo: "/images/sponsors/seedco.svg" },
  { id: "zoc", name: "ZOC", logo: "/images/sponsors/zoc.png" },
  { id: "src", name: "SRC", logo: "/images/sponsors/src.png" },
];

export default function PartnersSection() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section
      id="partners"
      className="relative overflow-hidden bg-rich-black"
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial ambient glow behind featured partner */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,103,71,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 pt-20 sm:pt-24 pb-16 sm:pb-20">
        {/* ── Header ── */}
        <div className="text-center mb-14 sm:mb-18 space-y-4">
          <span className="block text-[10px] sm:text-[11px] font-black uppercase tracking-[0.35em] text-white/30 font-subheading">
            Our Partners
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.05]">
            Powering{" "}
            <span className="text-[#006747]">Zimbabwe</span>{" "}
            Rugby
          </h2>
          <p className="text-white/35 text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-body">
            A collective of organisations committed to elevating the sport —
            from grassroots to the world stage.
          </p>
        </div>

        {/* ── Visual Stage ── */}
        <div className="relative max-w-4xl mx-auto">
          {/* Desktop: radial layout. Mobile: stacked. */}

          {/* ── Featured Partner (Center) ── */}
          <div className="flex justify-center mb-10 sm:mb-14">
            <div className="group relative">
              {/* Glow ring behind card */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-b from-[#006747]/15 via-[#006747]/5 to-transparent blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <Link
                href="/partners"
                className="relative flex flex-col items-center gap-4 w-48 sm:w-56 lg:w-64 py-7 sm:py-8 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.03] border border-white/[0.08] backdrop-blur-sm hover:border-[#006747]/40 hover:from-white/[0.10] hover:to-white/[0.05] transition-all duration-500 cursor-pointer"
              >
                <div className="relative w-24 h-10 sm:w-28 sm:h-12 lg:w-32 lg:h-14">
                  <Image
                    src={FEATURED.logo}
                    alt={FEATURED.name}
                    fill
                    className="object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    sizes="(max-width: 640px) 160px, 200px"
                  />
                </div>
                {FEATURED.role && (
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-[#006747] font-subheading">
                    {FEATURED.role}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* ── Secondary Partners Ring ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {PARTNERS.map((partner) => {
              const isActive = activeId === partner.id;
              return (
                <button
                  key={partner.id}
                  onMouseEnter={() => setActiveId(partner.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(partner.id)}
                  onBlur={() => setActiveId(null)}
                  className={`group relative flex items-center justify-center h-16 sm:h-18 lg:h-20 rounded-xl border transition-all duration-400 cursor-pointer ${
                    isActive
                      ? "bg-white/[0.08] border-white/[0.15] shadow-lg shadow-black/20"
                      : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]"
                  }`}
                  aria-label={partner.name}
                >
                  <div className="relative w-16 h-8 sm:w-20 sm:h-9 lg:w-24 lg:h-10">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className={`object-contain transition-all duration-500 ${
                        isActive
                          ? "brightness-0 invert opacity-90"
                          : "brightness-0 invert opacity-35 group-hover:opacity-70"
                      }`}
                      sizes="(max-width: 640px) 80px, (max-width: 1024px) 100px, 120px"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="text-center mt-14 sm:mt-18">
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.25em] text-white/30 hover:text-[#006747] transition-colors duration-400 font-subheading"
          >
            <span className="border-b border-white/10 hover:border-[#006747]/50 pb-0.5 transition-colors duration-400">
              Become a Partner
            </span>
            <span className="text-xs transition-transform duration-300 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
