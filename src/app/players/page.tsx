import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPlayers } from "@/lib/api/players";

export const metadata: Metadata = {
  title: "Players | Zimbabwe Rugby Union",
  description: "Meet the players of Zimbabwe Rugby — the Sables, Lady Sables, and all national teams.",
};

export const revalidate = 120;

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <main className="min-h-screen bg-milk-white">
      <div className="bg-rich-black border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white leading-none not-italic">
            Players
          </h1>
          <p className="text-white/50 text-lg mt-4 max-w-2xl font-normal">
            The men and women who represent Zimbabwe Rugby on the international stage.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {players.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40">No players found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {players.map((player) => (
              <Link
                key={player.id}
                href={player.slug ? `/players/${player.slug}` : "#"}
                className="group block bg-white rounded-xl overflow-hidden border border-black/5 hover:border-zru-green/40 hover:shadow-lg transition-all"
              >
                <div className="aspect-[3/4] relative bg-milk-white overflow-hidden">
                  {player.photo ? (
                    <Image
                      src={player.photo}
                      alt={player.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black/10 font-heading font-black text-4xl">
                      {player.name.split(" ").map(w => w[0]).join("").substring(0, 2)}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-heading font-black text-rich-black uppercase leading-tight truncate">
                    {player.name}
                  </h3>
                  {player.position && (
                    <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider mt-0.5">
                      {player.position}
                    </p>
                  )}
                  {player.caps !== undefined && (
                    <p className="text-[10px] text-zru-green font-black mt-1">
                      {player.caps} CAPS
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
