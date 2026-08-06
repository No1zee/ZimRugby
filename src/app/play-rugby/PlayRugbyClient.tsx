"use client";

import { MapPin, Users, Search, ArrowRight, Heart, GraduationCap } from "lucide-react";
import Link from "next/link";
import PlayRugbyDevelopment from "@/components/home/PlayRugbyDevelopment";
import CmsHero from "@/components/cms/CmsHero";
import SectionRenderer from "@/components/cms/SectionRenderer";
import type { PageData } from "@/lib/api/pages";

const iconMap: Record<string, any> = {
  MapPin,
  GraduationCap,
  Heart,
  Users,
};

const fallbackProgrammes = [
  { title: "Find a Club", description: "Join one of over 50 registered rugby clubs across Zimbabwe. From social rugby to competitive leagues.", icon: MapPin, link: "/clubs", color: "bg-zru-green" },
  { title: "Schools Programme", description: "Over 200 schools participate in ZRU development programmes, from tag rugby to full contact.", icon: GraduationCap, link: "/schools", color: "bg-blue-600" },
  { title: "Women's Rugby", description: "Join the Lady Sables pathway. Women's rugby is thriving with opportunities at all levels.", icon: Heart, link: "/womens-rugby", color: "bg-pink-600" },
  { title: "Youth Development", description: "Age-grade programmes from U13 to U20, developing the next generation of Sables.", icon: Users, link: "/youth", color: "bg-orange-600" },
];

const fallbackClubs = [
  { name: "Old Hararians RFC", location: "Harare", league: "Super League" },
  { name: "Harare Sports Club", location: "Harare", league: "Super League" },
  { name: "Old Georgians RFC", location: "Harare", league: "Super League" },
  { name: "Old Miltonians RFC", location: "Bulawayo", league: "Super League" },
  { name: "Matabeleland Warriors", location: "Bulawayo", league: "Super League" },
  { name: "UZ Wolves", location: "Harare", league: "First Division" },
];

interface PlayRugbyClientProps {
  cmsPage: PageData | null;
}

export default function PlayRugbyClient({ cmsPage }: PlayRugbyClientProps) {
  const programmesSection = cmsPage?.sections?.find((s) => s.section_key === "programmes");
  const clubsSection = cmsPage?.sections?.find((s) => s.section_key === "clubs");

  const cmsProgrammes = programmesSection?.items as { title: string; description: string; link: string; icon?: string; stat?: number; stat_label?: string }[] | undefined;
  const programmes = cmsProgrammes?.length
    ? cmsProgrammes.map((p, i) => ({
        ...p,
        icon: iconMap[p.icon || ""] || fallbackProgrammes[i]?.icon || MapPin,
        link: p.link || fallbackProgrammes[i]?.link || "/clubs",
        color: fallbackProgrammes[i]?.color || "bg-zru-green",
      }))
    : fallbackProgrammes;

  const cmsClubs = clubsSection?.items as { name: string; location: string; league?: string }[] | undefined;
  const clubs = cmsClubs?.length
    ? cmsClubs.map((c) => ({ ...c, league: c.league || "Super League" }))
    : fallbackClubs;

  // Sections to render via SectionRenderer (excluding programmes/clubs which have custom rendering here)
  const otherSections = cmsPage?.sections?.filter(
    (s) => !["programmes", "clubs", "hero_image"].includes(s.section_key)
  ) || [];

  return (
    <main className="bg-rich-black min-h-screen">
      {/* Hero */}
      <CmsHero
        title={cmsPage?.hero_title || "Play Rugby"}
        intro={cmsPage?.hero_intro || "Whether you're picking up a ball for the first time or returning to the game, there's a place for you in Zimbabwe Rugby."}
      />

      {/* Development Programs */}
      <PlayRugbyDevelopment />

      {/* Programmes Grid */}
      <section className="py-10 md:py-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-zru-green uppercase mb-8">
            {programmesSection?.eyebrow || "Find Your Path"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programmes.map((prog) => (
              <Link key={prog.title} href={prog.link} className="group block">
                <div className="bg-gray-50 rounded-lg p-6 h-full hover:shadow-lg transition-all duration-300 border border-transparent hover:border-zru-green/30">
                  <div className={`${prog.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                    <prog.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-zru-green mb-2 group-hover:text-zru-green transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {prog.description}
                  </p>
                  <span className="text-zru-green text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Club Finder */}
      <section className="py-10 md:py-12 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-black text-zru-green uppercase mb-2">
                {clubsSection?.title || "Find a Club"}
              </h2>
              <p className="text-gray-600">
                {clubsSection?.content || "Join one of our registered clubs near you."}
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by city or club name… e.g. Harare"
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg w-full md:w-80 focus:outline-none focus:border-zru-green"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((club) => (
              <div key={club.name} className="bg-white rounded-lg p-5 border border-gray-100 hover:border-zru-green/30 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-zru-green">{club.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      {club.location}
                    </div>
                  </div>
                  <span className="bg-zru-green/20 text-zru-green text-[10px] font-bold px-2 py-1 rounded uppercase">
                    {club.league}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/clubs" className="inline-flex items-center gap-2 text-zru-green font-bold hover:text-zru-green transition-colors">
              View All Clubs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CMS sections (e.g. CTA) */}
      {otherSections.length > 0 && (
        <SectionRenderer sections={otherSections} />
      )}
    </main>
  );
}
