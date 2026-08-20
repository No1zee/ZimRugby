"use client";

import Image from "next/image";
import CmsHero from "@/components/cms/CmsHero";
import JoinFanZoneSection from "@/components/home/JoinFanZoneSection";

interface FanZoneClientProps {
  cmsPage?: any;
}

const FUTURE_PILLARS = [
  {
    num: "01",
    kicker: "MATCHDAY & TERRACE CULTURE",
    title: "Matchday HQ & Stadium Guides",
    desc: "From Harare Sports Club to international tour destinations. Curated matchday itineraries, stadium entry guides, chants, traditions, and local supporter meetups around the world.",
    image: "/images/gallery/zimbabwe-sables-0350.webp",
  },
  {
    num: "02",
    kicker: "NEXT GENERATION",
    title: "Junior Rugby & Schools Hub",
    desc: "Connecting the historic roots of Zimbabwe schoolboy and schoolgirl rugby. Skill breakdowns from national coaches, youth tournament calendars, and printable supporter packs for young fans.",
    image: "/images/events/schools-fest-1200w.webp",
  },
  {
    num: "03",
    kicker: "THE INNER CIRCLE",
    title: "Direct Squad Briefings & Presales",
    desc: "Straight from the national training camp. Verified squad sheets, injury briefings, tactical audio breakdowns, and 48-hour priority test match ticket windows before general release.",
    image: "/images/gallery/zimbabwe-sables-0348.webp",
  },
];

export default function FanZoneClient({ cmsPage }: FanZoneClientProps) {
  return (
    <main className="bg-milk-white min-h-screen text-rich-black">
      {/* 1. Official ZRU Page Hero (Standard Design System) */}
      <CmsHero
        title={cmsPage?.hero_title || "THE GREEN & WHITE"}
        accentTitle={cmsPage?.hero_accent_title || "NATION"}
        intro={
          cmsPage?.hero_intro ||
          "From the electric terraces of Harare Sports Club to diaspora supporters across the globe—this is the official home for the faithful who back the Sables and Lady Sables."
        }
        image={cmsPage?.hero_image || "/images/gallery/zimbabwe-sables-0350.webp"}
        breadcrumb={[{ label: "Fan Zone", href: "/fan-zone" }]}
        pageId={cmsPage?.id}
      />

      {/* 2. The Supporter Manifesto */}
      <section className="py-20 sm:py-28 border-b border-black/10 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-baseline">
            <div className="lg:col-span-4">
              <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-rich-black">
                MORE THAN A GAME. <br />
                <span className="text-zru-green">A HERITAGE.</span>
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <p className="text-xl sm:text-2xl font-heading font-medium text-rich-black leading-snug tracking-tight">
                We are building the definitive digital home for Zimbabwe Rugby supporters worldwide. A unified hub designed to celebrate our culture, fuel matchday pride, and connect every supporter directly with our national teams.
              </p>
              <p className="text-sm sm:text-base text-black/70 font-body leading-relaxed max-w-3xl">
                Rugby in Zimbabwe is forged in raw passion, centuries of storied schoolboy rivalry, and an unwavering loyalty that spans across generations and continents. We are crafting an authentic supporter experience that honors that legacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 3 Editorial Pillars: What's to Come */}
      <section className="py-20 sm:py-28 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-rich-black">
            THE NEW FAN <span className="text-zru-green">EXPERIENCE</span>
          </h2>
          <p className="text-sm sm:text-base text-black/65 font-body leading-relaxed pt-1">
            A preview of the dedicated programs, portals, and exclusive privileges currently in development for registered supporters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          {FUTURE_PILLARS.map((pillar) => (
            <div
              key={pillar.num}
              className="group flex flex-col justify-between bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-black/20 transition-all duration-300"
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-rich-black">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.85] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rich-black/90 via-rich-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-xs font-mono font-black tracking-widest text-white/90 bg-rich-black/80 backdrop-blur-md px-3 py-1.5 rounded-none border border-white/10">
                    {pillar.num}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h3 className="text-xl sm:text-2xl font-heading font-black uppercase tracking-tight text-white leading-tight">
                    {pillar.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-black/75 font-body leading-relaxed">
                  {pillar.desc}
                </p>
                <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-black/40 font-medium">
                    STATUS: IN DEVELOPMENT
                  </span>
                  <span className="w-2 h-2 rounded-full bg-zru-green" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Consolidated Official Fan Zone Join Card */}
      <JoinFanZoneSection />
    </main>
  );
}
