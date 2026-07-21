"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Award, Users, Zap } from "lucide-react";

export interface TeamInfo {
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  ranking?: string;
  badgeText: string;
  accentStyle: "green" | "dark" | "outline";
  stats: { label: string; value: string }[];
}

const TEAMS_DATA: TeamInfo[] = [
  {
    slug: "sables",
    name: "Zimbabwe Sables",
    category: "Men's 15s Senior National Team",
    description: "African Cup Champions pursuing World Cup qualification. The elite peak of Zimbabwean rugby.",
    image: "/images/gallery/zimbabwe-sables-0351.webp",
    ranking: "#28 WR",
    badgeText: "Reigning Africa Champions",
    accentStyle: "green",
    stats: [
      { label: "Format", value: "15-a-side" },
      { label: "Head Coach", value: "Piet Benade" },
      { label: "Squad Size", value: "36 Players" },
    ],
  },
  {
    slug: "lady-sables",
    name: "Lady Sables",
    category: "Women's 15s & 7s National Team",
    description: "The pride of women's rugby in Zimbabwe. Competing in regional test matches and international tournaments.",
    image: "/images/hero/lady-sables-hero.webp",
    badgeText: "Rugby Africa Women's Cup",
    accentStyle: "dark",
    stats: [
      { label: "Format", value: "15s & 7s" },
      { label: "Category", value: "Senior Women" },
      { label: "Squad Size", value: "30 Players" },
    ],
  },
  {
    slug: "cheetahs",
    name: "Zimbabwe Cheetahs",
    category: "Men's National Sevens Team",
    description: "High-octane, fast-paced rugby. World Rugby Sevens Series contenders and Africa 7s Cup contenders.",
    image: "/images/cheetahs-action.webp",
    badgeText: "World Rugby 7s Contenders",
    accentStyle: "outline",
    stats: [
      { label: "Format", value: "7-a-side" },
      { label: "Category", value: "Senior Sevens" },
      { label: "Speed", value: "Elite Tier" },
    ],
  },
  {
    slug: "junior-sables",
    name: "Junior Sables (U20)",
    category: "Men's Under-20 National Team",
    description: "Back-to-back Barthes Trophy champions and World Rugby U20 Trophy participants. The future of Sables rugby.",
    image: "/images/hero/zim-u20s.webp",
    badgeText: "Barthes Trophy Champions",
    accentStyle: "green",
    stats: [
      { label: "Format", value: "15-a-side" },
      { label: "Age Grade", value: "Under 20" },
      { label: "Pathway", value: "Senior Sables" },
    ],
  },
];

export default function TeamCardBento() {
  return (
    <section className="py-20 bg-milk-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[10px] font-black text-zru-green uppercase tracking-[0.3em]">
              National Teams Ecosystem
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-rich-black italic">
              Representative Teams
            </h2>
            <p className="text-rich-black/70 text-base font-body leading-relaxed">
              Every national team embodies the physical strength, strategic discipline, and intense national pride of Zimbabwe Rugby.
            </p>
          </div>
        </div>

        {/* Differentiated Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TEAMS_DATA.map((team, idx) => {
            const isFeatured = idx === 0;
            return (
              <div
                key={team.slug}
                className={`group relative rounded-3xl overflow-hidden border border-black/5 hover:border-zru-green/30 transition-all duration-300 flex flex-col justify-between p-8 sm:p-10 shadow-lg ${
                  team.accentStyle === "green" 
                    ? "bg-zru-green text-white" 
                    : team.accentStyle === "dark" 
                    ? "bg-rich-black text-white" 
                    : "bg-white text-rich-black"
                }`}
              >
                {/* Background Image / Overlay */}
                <div className="absolute inset-0 z-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
                  <Image
                    src={team.image}
                    alt={team.name}
                    fill
                    className="object-cover object-center"
                  />
                  <div className={`absolute inset-0 ${
                    team.accentStyle === "green" 
                      ? "bg-linear-to-t from-zru-green via-zru-green/80 to-transparent" 
                      : team.accentStyle === "dark" 
                      ? "bg-linear-to-t from-rich-black via-rich-black/80 to-transparent" 
                      : "bg-linear-to-t from-white via-white/80 to-transparent"
                  }`} />
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Top Badge & Category */}
                  <div className="flex justify-between items-start gap-4">
                    <span className={`px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      team.accentStyle === "green" 
                        ? "bg-white/10 border border-white/20 text-white" 
                        : team.accentStyle === "dark" 
                        ? "bg-zru-green/20 border border-zru-green/30 text-zru-green" 
                        : "bg-zru-green/10 border border-zru-green/20 text-zru-green"
                    }`}>
                      {team.badgeText}
                    </span>

                    {team.ranking && (
                      <span className="text-xs font-heading font-black uppercase tracking-wider text-zru-green">
                        {team.ranking}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3 pt-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest block ${
                      team.accentStyle === "outline" ? "text-rich-black/50" : "text-white/60"
                    }`}>
                      {team.category}
                    </span>
                    <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-wide leading-none italic">
                      {team.name}
                    </h3>
                    <p className={`text-sm font-body leading-relaxed max-w-md ${
                      team.accentStyle === "outline" ? "text-rich-black/75" : "text-white/80"
                    }`}>
                      {team.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Stats & Pathway Link */}
                <div className="relative z-10 pt-8 mt-8 border-t border-black/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex items-center gap-6">
                    {team.stats.map((st) => (
                      <div key={st.label}>
                        <span className={`text-[9px] uppercase tracking-wider block font-bold ${
                          team.accentStyle === "outline" ? "text-rich-black/50" : "text-white/50"
                        }`}>
                          {st.label}
                        </span>
                        <span className="font-heading text-sm font-black uppercase">
                          {st.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href={`/teams/${team.slug}`}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      team.accentStyle === "green" 
                        ? "bg-white text-zru-green hover:bg-milk-white" 
                        : team.accentStyle === "dark" 
                        ? "bg-zru-green text-white hover:bg-green-700" 
                        : "bg-zru-green text-white hover:bg-green-700"
                    }`}
                  >
                    Team Hub <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
