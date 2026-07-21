import { Metadata } from "next";
import FlagshipTeamHero from "@/components/teams/FlagshipTeamHero";
import TeamCardBento from "@/components/teams/TeamCardBento";
import PlayerSpotlightStrip from "@/components/teams/PlayerSpotlightStrip";
import Link from "next/link";
import { ArrowRight, Trophy, GraduationCap, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "National Teams | Zimbabwe Rugby Union",
  description: "Official representative teams of the Zimbabwe Rugby Union. Sables, Lady Sables, Cheetahs 7s, and Junior Sables.",
};

export default function TeamsPage() {
  return (
    <main className="bg-milk-white min-h-screen">
      {/* 1. Flagship Sables Spotlight Hero */}
      <FlagshipTeamHero />

      {/* 2. Differentiated National Teams Bento Grid */}
      <TeamCardBento />

      {/* 3. Player to Watch Editorial Interstitial */}
      <PlayerSpotlightStrip />

      {/* 4. Development & Pathways Banner */}
      <section className="py-20 bg-milk-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 bg-rich-black text-white rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,107,63,0.25),transparent_70%)]" />
            
            <div className="relative z-10 max-w-3xl space-y-6">
              <span className="text-[10px] font-black text-zru-green uppercase tracking-[0.3em]">
                National Pathway Pipeline
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight italic">
                From Schoolboy Leagues to National Caps
              </h2>
              <p className="text-white/70 text-base font-body leading-relaxed">
                Our structured pathways connect provincial school competitions, club championships, and high-performance academies directly to national squad selection.
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
        </div>
      </section>
    </main>
  );
}
