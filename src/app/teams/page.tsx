import { Metadata } from "next";
import NationalSquadsControlRoom from "@/components/teams/NationalSquadsControlRoom";
import Link from "next/link";
import { GraduationCap, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "National Teams | Zimbabwe Rugby Union",
  description: "Official representative teams of the Zimbabwe Rugby Union. Sables, Lady Sables, Cheetahs 7s, and Junior Sables.",
};

export default function TeamsPage() {
  return (
    <main className="bg-milk-white min-h-screen">
      {/* 1. National Squads Control Room — cinematic team rail, hero, info grid */}
      <NationalSquadsControlRoom />

      {/* 2. Development & Pathways Banner */}
      <section className="py-20 bg-milk-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 bg-rich-black text-white rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,107,63,0.25),transparent_70%)]" />
            
            <div className="relative z-10 max-w-3xl space-y-6">
              <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight italic leading-[1.0]">
                From Schoolboy Leagues to National Caps
              </h2>
              <p className="text-white/75 text-base font-body leading-relaxed">
                From premier high school competitions to provincial leagues, follow the talent pipeline driving Zimbabwean players onto the international stage.
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
