"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function SponsorGrid() {
  const headlineSponsor = {
    name: "Nedbank Zimbabwe",
    role: "HEADLINE SPONSOR",
    logo: "/images/sponsor/nedbank.svg",
    fallbackText: "NEDBANK",
    href: "https://www.nedbank.co.zw",
  };

  const officialSponsors = [
    { name: "CFAO Mobility Zimbabwe", role: "OFFICIAL AUTOMOTIVE PARTNER", logo: "/images/sponsor/cfao.svg", fallbackText: "CFAO MOBILITY", href: "#" },
    { name: "Gilbert Rugby", role: "OFFICIAL BALL & EQUIPMENT", logo: "/images/sponsor/gilbert.svg", fallbackText: "GILBERT", href: "#" },
  ];

  const associateSponsors = [
    { name: "Seed Co Zimbabwe", role: "OFFICIAL SEED PARTNER", fallbackText: "SEED CO", href: "#" },
    { name: "BLK Sport", role: "OFFICIAL APPAREL PARTNER", fallbackText: "BLK", href: "#" },
  ];

  return (
    <section className="bg-milk-white border-t border-black/5 py-16 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zru-green">
            COMMERCIAL PARTNERS & SPONSORS
          </span>
          <h2 className="font-heading text-2xl lg:text-3xl font-black uppercase text-rich-black tracking-tight">
            POWERING ZIMBABWE RUGBY
          </h2>
          <div className="w-12 h-1 bg-zru-green mx-auto rounded-full mt-3" />
        </div>

        {/* 1. Headline Sponsor */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">
            {headlineSponsor.role}
          </span>
          <a
            href={headlineSponsor.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-zru-green/40 transition-all flex items-center justify-center min-w-[280px] h-24"
          >
            <span className="font-heading text-2xl font-black uppercase tracking-wider text-zru-green group-hover:scale-105 transition-transform">
              {headlineSponsor.fallbackText}
            </span>
          </a>
        </div>

        {/* 2. Official Partners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {officialSponsors.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
                {s.role}
              </span>
              <div className="w-full bg-white rounded-xl border border-gray-200/60 p-5 shadow-xs hover:border-zru-green/30 transition-all flex items-center justify-center h-20">
                <span className="font-heading text-lg font-extrabold uppercase tracking-wide text-gray-800">
                  {s.fallbackText}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Associate Partners */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 max-w-xl mx-auto pt-4 border-t border-gray-200/50">
          {associateSponsors.map((s, idx) => (
            <div key={idx} className="text-center p-3">
              <span className="font-heading text-sm font-bold uppercase tracking-wider text-gray-600 block">
                {s.fallbackText}
              </span>
              <span className="text-[8px] font-semibold uppercase tracking-widest text-gray-400 block mt-0.5">
                {s.role}
              </span>
            </div>
          ))}
        </div>

        {/* Become a Partner CTA */}
        <div className="text-center pt-6">
          <Link
            href="/partners"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-zru-green hover:underline inline-flex items-center gap-1.5"
          >
            BECOME AN OFFICIAL PARTNER &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
}
