import { Metadata } from "next";
import { Suspense } from "react";
import TeamBentoGrid from "@/components/teams/TeamBentoGrid";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import { GraduationCap, MapPin } from "lucide-react";
import type { Team } from "@/types/team";
import FanZoneSignup from "@/components/fanzone/FanZoneSignup";

export const metadata: Metadata = {
  title: "National Teams | Zimbabwe Rugby Union",
  description:
    "Official representative teams of the Zimbabwe Rugby Union. Sables, Lady Sables, Cheetahs 7s, and Junior Sables.",
};

const TEAMS: Team[] = [
  {
    id: "sables",
    slug: "sables",
    shortName: "SABLES",
    fullName: "ZIMBABWE SABLES",
    category: "Senior Men's 15s National Team",
    format: "15s",
    formatLabel: "XV-A-Side Union",
    accent: "#006747",
    jerseyColors: ["#006747", "#D4A843"],
    tagline:
      "Reigning Africa Champions driving towards the global stage.",
    description:
      "The flagship men's 15s national team representing Zimbabwe on the world rugby stage. Reigning African Champions pursuing World Cup qualification with pride, speed, and physicality.",
    ranking: "#28 World",
    rankingValue: "#28",
    worldRankingTier: "Tier 2 Nation",
    keyHonour: "Africa Cup Champions",
    recentRecord: ["W", "W", "W", "W", "L"],
    pathway: "From Junior Sables",
    squadSize: 36,
    heroImage:
      "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp",
    featuredImage: "/images/gallery/zimbabwe-sables-0351.webp",
    featuredPlayer: "Tinotenda Masekere",
    stats: [
      { label: "Africa Cup Titles", value: "2" },
      { label: "RWC Appearances", value: "2" },
      { label: "Senior Roster", value: "36" },
    ],
    href: "/teams/sables",
  },
  {
    id: "lady-sables",
    slug: "lady-sables",
    shortName: "LADY SABLES",
    fullName: "LADY SABLES",
    category: "Senior Women's National Team",
    format: "15s",
    formatLabel: "XV-A-Side Union",
    accent: "#00C88C",
    jerseyColors: ["#006747", "#FFFFFF"],
    tagline:
      "The pride of women's rugby in Zimbabwe, competing across Africa.",
    description:
      "Zimbabwe's senior women's national team. Competing in Rugby Africa tournaments and international test matches, driving growth and excellence across women's rugby.",
    ranking: "Africa Top 8",
    rankingValue: "Top 8",
    worldRankingTier: "Continental Contender",
    keyHonour: "Continental Contenders",
    recentRecord: ["L", "W", "L", "W", "L"],
    pathway: "Schools & Clubs Pipeline",
    squadSize: 30,
    heroImage: "/images/hero/lady-sables.webp",
    featuredImage: "/images/gallery/sables-women-9.webp",
    featuredPlayer: "Paidashe Kambanje",
    stats: [
      { label: "Africa Cup Apps", value: "4" },
      { label: "Registered Players", value: "1.2K+" },
      { label: "Senior Roster", value: "30" },
    ],
    href: "/teams/lady-sables",
  },
  {
    id: "cheetahs",
    slug: "cheetahs",
    shortName: "CHEETAHS",
    fullName: "ZIMBABWE CHEETAHS",
    category: "Senior Men's Sevens Team",
    format: "7s",
    formatLabel: "Sevens Series",
    accent: "#00704D",
    jerseyColors: ["#006747", "#D4A843"],
    tagline:
      "High-octane sevens with pace, flair, and Olympic ambition.",
    description:
      "High-octane sevens squad representing Zimbabwe on the World Rugby Sevens Challenger Series and Olympic qualifying circuits with pace, flair, and relentless speed.",
    ranking: "WR Challenger Series",
    rankingValue: "Challenger",
    worldRankingTier: "Sevens Circuit",
    keyHonour: "Africa 7s Podium",
    recentRecord: ["W", "W", "L", "W", "L"],
    pathway: "Crossover from Sables",
    squadSize: 18,
    heroImage: "/images/hero/cheetahs-hero.webp",
    featuredImage: "/images/teams/cheetahs.jpg",
    featuredPlayer: "Shane Makombe",
    stats: [
      { label: "Circuit", value: "WR 7s" },
      { label: "Speed Tier", value: "Elite" },
      { label: "Squad Roster", value: "18" },
    ],
    href: "/teams/cheetahs",
  },
  {
    id: "junior-sables",
    slug: "junior-sables",
    shortName: "JUNIOR SABLES",
    fullName: "JUNIOR SABLES",
    category: "U20 Men's 15s National Team",
    format: "15s",
    formatLabel: "XV-A-Side Union",
    accent: "#00452A",
    jerseyColors: ["#006747", "#FFFFFF"],
    tagline:
      "Back-to-back Barthes Trophy champions building the future.",
    description:
      "Back-to-back Barthes Trophy African U20 Champions and World Rugby Junior Trophy contenders. The high-performance pipeline producing the next generation of senior Sables.",
    ranking: "Africa U20 #1",
    rankingValue: "#1 Africa",
    worldRankingTier: "U20 Continental Elite",
    keyHonour: "Barthes Trophy Champions",
    recentRecord: ["W", "W", "W", "W", "W"],
    pathway: "Feeds Senior Sables",
    squadSize: 32,
    heroImage: "/images/hero/junior-sables-hero.webp",
    featuredImage: "/images/hero/zim-u20s.webp",
    featuredPlayer: "Tendai Mawara",
    stats: [
      { label: "Barthes Cup", value: "1st" },
      { label: "World Trophy", value: "Finalists" },
      { label: "U20 Roster", value: "32" },
    ],
    href: "/teams/junior-sables",
  },
];

export default function TeamsPage() {
  return (
    <main className="bg-milk-white min-h-screen pb-12">
      {/* PageHero */}
      <PageHero
        title="National"
        accentTitle="Teams"
        subtitle="Four squads representing Zimbabwe on the world rugby stage — from the flagship Sables to the next-generation Junior Sables."
        tag="2026 Season"
        breadcrumb={[{ label: "Teams", href: "/teams" }]}
        backgroundImage="/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp"
      />

      {/* Bento Grid */}
      <div className="pt-10 md:pt-12">
        <Suspense>
          <TeamBentoGrid teams={TEAMS} />
        </Suspense>
      </div>

      {/* Fan Zone Signup */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FanZoneSignup />
      </section>

      {/* Development & Pathways — Dark CTA Banner (homepage pattern) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="group/devCard rounded-3xl p-6 sm:p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 relative overflow-hidden shadow-2xl transition-shadow duration-500 ease-in-out touch-manipulation cursor-pointer border border-white/10"
          style={{ background: "radial-gradient(circle at 50% 25%, #0A1C15 0%, #00331F 60%, #001A10 100%)" }}
        >
          <div className="absolute inset-0 border border-white/10 group-hover/devCard:border-[#006747]/60 group-focus-within/devCard:border-[#006747]/60 group-hover/devCard:shadow-[inset_0_0_60px_rgba(0,103,71,0.4)] transition-shadow duration-700 pointer-events-none rounded-3xl" />
          <div className="absolute inset-0 opacity-0 group-hover/devCard:opacity-20 group-focus-within/devCard:opacity-20 pointer-events-none bg-gradient-to-r from-transparent via-[#006747] to-transparent transition-opacity duration-700" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-[10px] font-black text-accent-teal uppercase tracking-[0.3em] font-heading">
              Development &amp; Pathways
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl text-white font-black uppercase tracking-tight leading-tight">
              From Schoolboy Leagues to National Caps
            </h2>
            <p className="text-xs sm:text-sm text-white/80 font-body leading-relaxed line-clamp-2">
              From premier high school competitions to provincial leagues,
              follow the talent pipeline driving Zimbabwean players onto the
              international stage.
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
    </main>
  );
}
