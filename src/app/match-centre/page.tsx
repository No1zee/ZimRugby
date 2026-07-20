import MatchCentreClient from "./MatchCentreClient";
import { getAllFixtures, formatFixtureForUI } from "@/lib/fixtures";
import type { LeagueTableRow } from "@/types";

export const revalidate = 60;

const STANDINGS: LeagueTableRow[] = [
  { position: 1, team: "Old Georgians", played: 14, won: 12, drawn: 1, lost: 1, points: 58, form: ["W", "W", "W", "W", "W"] },
  { position: 2, team: "Harare Sports Club", played: 14, won: 10, drawn: 0, lost: 4, points: 48, form: ["W", "L", "W", "L", "W"] },
  { position: 3, team: "Old Hararians", played: 14, won: 9, drawn: 2, lost: 3, points: 45, form: ["L", "W", "W", "D", "W"] },
  { position: 4, team: "Pitbulls", played: 14, won: 7, drawn: 1, lost: 6, points: 35, form: ["W", "L", "L", "W", "L"] },
  { position: 5, team: "Mutare Sports Club", played: 14, won: 5, drawn: 0, lost: 9, points: 25, form: ["L", "L", "W", "L", "L"] },
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
