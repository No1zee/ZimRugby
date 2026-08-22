export type MatchSource = "api_sports" | "world_rugby" | "manual";

export interface NormalizedMatch {
  externalId: string;
  source: MatchSource;
  title: string;
  slug: string;
  matchType: "international" | "domestic" | "schools" | "sevens";
  teamName: string;
  teamSlug?: string;
  opponentName: string;
  opponentSlug?: string;
  competitionName: string;
  competitionSlug?: string;
  venueName?: string;
  venueCity?: string;
  kickoffAt: string; // ISO 8601 string
  status: "upcoming" | "live" | "completed";
  homeScore?: number | null;
  awayScore?: number | null;
  isHome: boolean;
  rawPayload?: Record<string, unknown>;
}

export interface MatchSyncResult {
  source: MatchSource;
  totalFetched: number;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
  matches: Array<{
    title: string;
    action: "created" | "updated" | "skipped";
    id?: string;
  }>;
}

export interface MatchProviderAdapter {
  name: MatchSource;
  fetchFixtures(options?: {
    teamId?: number | string;
    teamName?: string;
    season?: number;
    leagueId?: number | string;
  }): Promise<NormalizedMatch[]>;
}
