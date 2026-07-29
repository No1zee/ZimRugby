"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import SlantedButton from "@/components/ui/SlantedButton";

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

  // Auto-rotation every 4 seconds unless hovered
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
    <section ref={sectionRef} id="partners" className="bg-[#FDFBF0] border-t border-black/5 pt-0 pb-0 px-4 sm:px-6 lg:px-8">
      {/* ── Green & White Strips with Logo Dock + Bottom CTA ── */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        {/* Green top strip */}
        <div className="bg-[#006747] py-6 sm:py-8 flex items-center justify-center">
          <span className="text-white font-heading text-lg sm:text-2xl font-black tracking-widest uppercase">
            POWERING ZIMBABWEAN RUGBY
          </span>
        </div>
        
        {/* White bottom strip — contains sponsor logos */}
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-b border-black/5">
          <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {SPONSORS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveIdx(idx)}
                className="relative h-10 sm:h-12 w-28 sm:w-36 transition-all duration-300 opacity-75 hover:opacity-100 hover:scale-105 cursor-pointer"
                title={s.name}
              >
                <Image
                  src={s.logo}
                  alt={s.name}
                  fill
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* CTA Button strip — matching top strip size & color */}
        <div className="bg-[#006747] py-6 sm:py-8 flex items-center justify-center">
          <SlantedButton
            href="/partners"
            variant="primary"
            size="md"
            rightIcon={<ArrowRight size={18} />}
            className="!bg-white !from-white !to-white !text-[#006747] hover:!bg-white/90 shadow-lg border-none"
          >
            BECOME AN OFFICIAL PARTNER
          </SlantedButton>
        </div>
      </div>
    </section>
  );
}
