import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getAllFixtures, formatFixtureForUI, getNextUnionMatch } from "@/lib/fixtures";
import type { LeagueTableRow } from "@/types";

const MatchCentreClient = dynamic(() => import("./MatchCentreClient"), {
  loading: () => (
    <main className="bg-milk-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-black/5 rounded" />
          <div className="h-4 w-80 bg-black/5 rounded" />
          <div className="h-[400px] bg-black/5 rounded-2xl" />
        </div>
      </div>
    </main>
  ),
});

export const metadata: Metadata = {
  title: "Match Centre | Zimbabwe Rugby Union",
  description: "Fixtures, results, and league standings for Zimbabwe rugby teams.",
};

export const revalidate = 60;

const STANDINGS: LeagueTableRow[] = [
  { position: 1, team: "Zimbabwe Sables", played: 3, won: 3, drawn: 0, lost: 0, points: 15, form: ["W", "W", "W", "-", "-"] },
  { position: 2, team: "Algeria", played: 3, won: 2, drawn: 0, lost: 1, points: 9, form: ["L", "W", "W", "-", "-"] },
  { position: 3, team: "Namibia", played: 3, won: 1, drawn: 0, lost: 2, points: 5, form: ["L", "L", "W", "-", "-"] },
  { position: 4, team: "Kenya", played: 3, won: 0, drawn: 0, lost: 3, points: 1, form: ["L", "L", "L", "-", "-"] },
];

export default async function MatchCentre() {
  const rawFixtures = await getAllFixtures();
  const formattedFixtures = rawFixtures.map(formatFixtureForUI);
  const initialFixtures = formattedFixtures.filter(f => f.status === 'upcoming');
  const initialResults = formattedFixtures.filter(f => f.status === 'completed');
  const nextUnionMatch = getNextUnionMatch(formattedFixtures);

  return (
    <MatchCentreClient
      initialFixtures={initialFixtures}
      initialResults={initialResults}
      initialStandings={STANDINGS}
      nextUnionMatch={nextUnionMatch}
    />
  );
}
