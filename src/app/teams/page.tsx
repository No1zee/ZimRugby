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
      <div className="pt-16">
        <Suspense>
          <TeamBentoGrid teams={TEAMS} />
        </Suspense>
      </div>

      {/* Fan Zone Signup */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-black/5 rounded-2xl p-6 md:p-8">
          <FanZoneSignup variant="compact" />
        </div>
      </section>

      {/* Development & Pathways — Dark CTA Banner (family pattern) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-rich-black text-white rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,107,63,0.25),transparent_70%)]" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-[10px] font-black text-zru-green uppercase tracking-[0.3em] font-heading">
              Development &amp; Pathways
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-wide not-italic text-white leading-tight">
              From Schoolboy Leagues to National Caps
            </h2>
            <p className="text-white/60 text-sm font-body leading-relaxed">
              From premier high school competitions to provincial leagues,
              follow the talent pipeline driving Zimbabwean players onto the
              international stage.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/schools"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-zru-green hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                School Rugby Leagues <GraduationCap className="w-4 h-4" />
              </Link>
              <Link
                href="/clubs"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                Find a Club <MapPin className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
