import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCompetitions } from "@/lib/api/competitions";
import { ArrowRight, Trophy, Swords, Globe } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Competitions | Zimbabwe Rugby Union",
  description: "Overview of all active Zimbabwe Rugby Union competitions including the Rugby Africa Cup, Victoria Cup, and more.",
};

export const revalidate = 3600;

const typeIcons: Record<string, typeof Trophy> = {
  cup: Trophy,
  tournament: Swords,
  test: Globe,
};

const typeColors: Record<string, string> = {
  cup: "bg-amber-500",
  tournament: "bg-blue-500",
  test: "bg-emerald-500",
};

export default async function CompetitionsPage() {
  const competitions = await getCompetitions();

  return (
    <main className="min-h-screen bg-milk-white">
      <PageHero
        kicker="Tournaments & Leagues"
        title="Competitions"
        subtitle="Active competitions featuring Zimbabwe national teams and domestic rugby."
        breadcrumb={[{ label: "Competitions", href: "/competitions" }]}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((comp) => {
            const Icon = typeIcons[comp.competition_type || ""] || Trophy;
            const color = typeColors[comp.competition_type || ""] || "bg-zru-green";
            return (
              <Link
                key={comp.id}
                href={`/match-centre`}
                className="group bg-white border border-black/10 hover:border-zru-green/40 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="p-8">
                  <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {comp.logo && (
                    <div className="mb-4 h-10 relative">
                      <Image
                        src={comp.logo}
                        alt={comp.name}
                        width={120}
                        height={40}
                        className="object-contain object-left h-full"
                      />
                    </div>
                  )}

                  <h2 className="text-xl font-black uppercase tracking-tight text-rich-black group-hover:text-zru-green transition-colors not-italic">
                    {comp.name}
                  </h2>

                  {comp.season_label && (
                    <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-white bg-rich-black/80 px-2.5 py-1 rounded">
                      {comp.season_label} Season
                    </span>
                  )}

                  {comp.description && (
                    <p className="text-rich-black/60 text-sm mt-4 leading-relaxed font-normal line-clamp-3">
                      {comp.description}
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zru-green group-hover:gap-2.5 transition-all">
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}