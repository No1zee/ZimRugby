import { Metadata } from "next";
import MatchCentreClient from "./MatchCentreClient";
import { getAllFixtures, formatFixtureForUI } from "@/lib/fixtures";
import type { LeagueTableRow } from "@/types";

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

  return (
    <MatchCentreClient
      initialFixtures={initialFixtures}
      initialResults={initialResults}
      initialStandings={STANDINGS}
    />
  );
}
