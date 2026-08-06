import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayerBySlug } from "@/lib/api/players";
import { ArrowLeft } from "lucide-react";

interface PlayerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);
  if (!player) return { title: "Player Not Found" };

  return {
    title: `${player.name} | Zimbabwe Rugby`,
    description: player.bio || `Profile for ${player.name} — ${player.position || "Player"} for Zimbabwe Rugby.`,
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);

  if (!player) notFound();

  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const photoUrl = player.photo;

  return (
    <main className="min-h-screen bg-milk-white">
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          {photoUrl ? (
            <Image
              src={photoUrl}
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
            <div className="shrink-0">
              {photoUrl ? (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-zru-green shadow-2xl">
                  <Image
                    src={photoUrl}
                    alt={player.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-zru-green/10 border-4 border-zru-green/30 shadow-2xl flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-heading font-black text-zru-green/50">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {player.team && (
                <div className="flex items-center gap-3 mb-3">
                  <Link
                    href={`/teams/sables`}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green hover:text-emerald-400 transition-colors"
                  >
                    {player.team}
                  </Link>
                </div>
              )}
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white leading-none not-italic">
                {player.name}
              </h1>
              {player.position && (
                <p className="text-white/60 text-lg mt-3 font-normal">
                  {player.position}
                </p>
              )}
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
                {player.position || "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">
                Caps
              </span>
              <span className="text-lg font-black text-white uppercase not-italic tabular-nums">
                {player.caps ?? "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">
                Age
              </span>
              <span className="text-lg font-black text-white uppercase not-italic">
                {player.age ?? "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">
                Team
              </span>
              <span className="text-lg font-black text-white uppercase not-italic">
                {player.team || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl space-y-12">
          {player.bio && (
            <div>
              <h2 className="font-heading text-2xl font-black uppercase tracking-wider text-rich-black mb-4">
                About
              </h2>
              <p className="text-rich-black/70 text-base leading-relaxed whitespace-pre-line">
                {player.bio}
              </p>
            </div>
          )}

          <Link
            href="/teams/sables"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zru-green hover:text-[#005238] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Squad
          </Link>
        </div>
      </div>
    </main>
  );
}
