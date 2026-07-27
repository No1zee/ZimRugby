import type { Team } from "@/types/team";

export function formatRanking(team: Team): string {
  return team.ranking.toUpperCase();
}
