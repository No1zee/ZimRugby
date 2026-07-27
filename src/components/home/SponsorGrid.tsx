"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SPONSORS = [
  {
    id: "nedbank",
    name: "Nedbank Zimbabwe",
    role: "HEADLINE SPONSOR",
    logo: "/images/sponsors/nedbank.svg",
    blurb: "Official headline sponsor powering the Sables national team, domestic competitions, and grassroots rugby nationwide.",
    href: "https://www.nedbank.co.zw",
    badge: "PRIMARY PARTNER",
  },
  {
    id: "cfao",
    name: "CFAO Mobility Zimbabwe",
    role: "OFFICIAL AUTOMOTIVE PARTNER",
    logo: "/images/sponsors/cfao.svg",
    blurb: "Official mobility provider supporting national team logistics and transport across Southern Africa.",
    href: "https://www.cfaogroup.com",
    badge: "AUTOMOTIVE",
  },
  {
    id: "gilbert",
    name: "Gilbert Rugby",
    role: "OFFICIAL BALL & EQUIPMENT",
    logo: "/images/sponsors/gilbert.png",
    blurb: "Official technical supplier providing world-class match balls and training gear for all ZRU tests.",
    href: "https://www.gilbertrugby.com",
    badge: "EQUIPMENT",
  },
  {
    id: "seedco",
    name: "Seed Co Zimbabwe",
    role: "OFFICIAL SEED PARTNER",
    logo: "/images/sponsors/seedco.svg",
    blurb: "Supporting community sports fields and youth development programs across Zimbabwe.",
    href: "https://www.seedcogroup.com",
    badge: "COMMUNITY",
  },
  {
    id: "blk",
    name: "BLK Sport",
    role: "OFFICIAL APPAREL PARTNER",
    logo: "/images/sponsors/blk.svg",
    blurb: "Official apparel partner engineering high-performance matchday kits for the Sables.",
    href: "http://blksport.me",
    badge: "APPAREL",
  },
];

export default function SponsorGrid() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);
  const inViewRef = React.useRef(false);
  const hiddenRef = React.useRef(false);

  React.useEffect(() => {
    const el = sectionRef.current;
    const observer = el
      ? new IntersectionObserver(([entry]) => {
          inViewRef.current = entry.isIntersecting;
        }, { threshold: 0 })
      : null;
    if (el && observer) observer.observe(el);

    function handleVisibility() {
      hiddenRef.current = document.hidden;
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Subtle auto-rotation every 4 seconds unless hovered or off-screen
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      if (inViewRef.current && !hiddenRef.current) {
        setActiveIdx((prev) => (prev + 1) % SPONSORS.length);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const activeSponsor = SPONSORS[activeIdx];

  return (
    <section ref={sectionRef} id="partners" className="bg-white border-t border-black/5 pt-8 sm:pt-10 pb-0 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto space-y-6">
        
        {/* ── 1. Minimal Header ── */}
        <div className="space-y-1.5">
          <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase text-rich-black tracking-tight">
            POWERING ZIMBABWE{" "}
            <span className="text-accent-teal">RUGBY</span>
          </h2>
          <div className="w-12 h-1 bg-[#006747] rounded-full mt-2 opacity-80" />
        </div>

        {/* ── 2. Interactive Logo Dock (5 Partners) ── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {SPONSORS.map((s, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveIdx(idx)}
                className={`group relative bg-white rounded-xl p-4 h-[84px] flex items-center justify-center border transition-colors duration-300 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-b from-[#00704D] to-[#005238] border-transparent shadow-md"
                    : "border-gray-200/80 shadow-xs hover:border-[#006747]/40 hover:shadow-sm"
                }`}
              >
                <div className="relative w-full h-10 transition-[filter] duration-300">
                  <Image
                    src={s.logo}
                    alt={s.name}
                    fill
                    className={`object-contain transition-[filter] duration-300 ${
                      isActive ? "opacity-100 brightness-110" : "opacity-60 group-hover:opacity-100"
                    }`}
                  />
                </div>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#006747]" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── 3. Active Partner Minimal Spotlight Card ── */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[9px] font-black uppercase tracking-widest bg-gradient-to-b from-[#00704D] to-[#005238] text-white px-2 py-0.5 rounded">
                {activeSponsor.role}
              </span>
            </div>
            <h3 className="font-heading text-lg font-black uppercase text-gray-900 tracking-tight">
              {activeSponsor.name}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-md">
              {activeSponsor.blurb}
            </p>
          </div>

          <a
            href={activeSponsor.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-b from-[#00704D] to-[#005238] hover:from-[#005238] hover:to-[#004522] text-white font-extrabold text-[10px] tracking-widest uppercase px-5 py-3 rounded-lg shadow-md transition-colors flex items-center gap-1.5 shrink-0 group"
          >
            <span>VISIT SITE</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>

        </div>

        {/* ── 4. Minimal Partner CTA ── */}
        <div className="text-center pt-2">
          <Link
            href="/partners"
            className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#006747] hover:underline inline-flex items-center gap-1.5 transition-colors"
          >
            BECOME AN OFFICIAL PARTNER &rarr;
          </Link>
        </div>

      </div>

      {/* Green bottom padding */}
      <div className="bg-[#006747] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 sm:py-14" />
    </section>
  );
}


