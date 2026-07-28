import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTeamData } from "@/lib/api/teams";
import type { Team } from "@/types";

interface PlayerPageProps {
  params: Promise<{ slug: string }>;
}

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function findPlayer(slug: string) {
  const teamSlugs = ["sables", "lady-sables", "junior-sables", "cheetahs", "u20"];
  const name = slugToName(slug);

  for (const teamSlug of teamSlugs) {
    const team: Team | null = await getTeamData(teamSlug);
    if (!team) continue;

    const player = team.squad.find(
      (p) =>
        p.name.toLowerCase() === name.toLowerCase() ||
        p.name.toLowerCase().replace(/\s+/g, "-") === slug
    );

    if (player) {
      return { player, team };
    }
  }

  return null;
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await findPlayer(slug);
  if (!result) return { title: "Player Not Found" };

  return {
    title: `${result.player.name} | ${result.team.name}`,
    description: `Profile for ${result.player.name} — ${result.player.position} for ${result.team.name}.`,
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;
  const result = await findPlayer(slug);

  if (!result) notFound();

  const { player, team } = result;
  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-milk-white">
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          {player.image && player.image !== "/images/teams/player-placeholder.webp" ? (
            <Image
              src={player.image}
              alt={player.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top opacity-50 filter brightness-75"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#003822] to-[#001A10]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#010905] via-[#010905]/60 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-end gap-8">
            {/* Player Avatar */}
            <div className="shrink-0">
              {player.image && player.image !== "/images/teams/player-placeholder.webp" ? (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-zru-green shadow-2xl">
                  <Image
                    src={player.image}
                    alt={player.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-zru-green/20 border-4 border-zru-green shadow-2xl flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-heading font-black text-zru-green">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <Link
                  href={`/teams/${team.id}`}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green hover:text-emerald-400 transition-colors"
                >
                  {team.name}
                </Link>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white leading-none not-italic">
                {player.name}
              </h1>
              <p className="text-white/60 text-lg mt-3 font-normal">
                {player.position}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#003822] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-8 py-6">
            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">
                Position
              </span>
              <span className="text-lg font-black text-white uppercase not-italic">
                {player.position}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">
                Caps
              </span>
              <span className="text-lg font-black text-white uppercase not-italic tabular-nums">
                {player.caps}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">
                Club
              </span>
              <span className="text-lg font-black text-white uppercase not-italic">
                {player.club}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl space-y-12">
          <div>
            <h2 className="font-heading text-2xl font-black uppercase tracking-wider text-rich-black mb-4">
              About
            </h2>
            <p className="text-rich-black/70 text-base leading-relaxed">
              {player.name} plays as {player.position.toLowerCase()} for {team.name} and represents Zimbabwe on the international rugby stage. Currently playing their club rugby at {player.club} with {player.caps} international caps.
            </p>
          </div>

          {/* Back to team link */}
          <Link
            href={`/teams/${team.id}`}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zru-green hover:text-[#005238] transition-colors"
          >
            ← Back to {team.name} Squad
          </Link>
        </div>
      </div>
    </main>
  );
}
