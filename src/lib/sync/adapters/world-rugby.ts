import { MatchProviderAdapter, NormalizedMatch } from "../types";

export interface WorldRugbyMatchFeedItem {
  matchId: string | number;
  description?: string;
  venue?: {
    name?: string;
    city?: string;
    country?: string;
  };
  time?: {
    millis?: number;
    label?: string;
  };
  teams?: Array<{
    id?: number;
    name?: string;
    score?: number;
  }>;
  status?: string;
  event?: {
    label?: string;
    id?: string;
  };
}

export class WorldRugbyAdapter implements MatchProviderAdapter {
  name = "world_rugby" as const;
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.WORLD_RUGBY_API_BASE || "https://api.wr-rims-prod.pulselive.com/rugby/v3";
  }

  async fetchFixtures(options?: {
    teamId?: number | string;
    teamName?: string;
    season?: number;
    pageSize?: number;
  }): Promise<NormalizedMatch[]> {
    try {
      const teamId = options?.teamId || 57; // 57 is Zimbabwe Sables in World Rugby
      const pageSize = options?.pageSize || 20;
      const url = `${this.baseUrl}/match?teams=${teamId}&sort=desc&pageSize=${pageSize}`;

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "ZRU-Sync-Worker/1.0",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return [];
      }

      const payload = await res.json();
      const matches: WorldRugbyMatchFeedItem[] = payload.content || payload.matches || [];

      return matches.map((m) => this.normalizeMatch(m));
    } catch {
      return [];
    }
  }

  private normalizeMatch(m: WorldRugbyMatchFeedItem): NormalizedMatch {
    const home = m.teams?.[0]?.name || "Zimbabwe";
    const away = m.teams?.[1]?.name || "Opponent";
    const isHome = home.toLowerCase().includes("zimbabwe");

    const zruTeam = isHome ? home : away;
    const oppTeam = isHome ? away : home;

    const dateIso = m.time?.millis
      ? new Date(m.time.millis).toISOString()
      : new Date().toISOString();

    const slug = `${zruTeam}-vs-${oppTeam}-${dateIso.substring(0, 10)}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const homeScore = (m as { scores?: number[] }).scores?.[0] ?? m.teams?.[0]?.score ?? null;
    const awayScore = (m as { scores?: number[] }).scores?.[1] ?? m.teams?.[1]?.score ?? null;

    let status: "upcoming" | "live" | "completed" = "upcoming";
    if (m.status === "C" || m.status === "COMPLETED" || m.status === "FT") {
      status = "completed";
    } else if (m.status === "L" || m.status === "LIVE") {
      status = "live";
    }

    const competition = m.event?.label || (m as { competition?: string }).competition || m.description || "World Rugby Test Match";

    return {
      externalId: `world_rugby_${m.matchId}`,
      source: "world_rugby",
      title: `${home} vs ${away}`,
      slug,
      matchType: "international",
      teamName: zruTeam,
      opponentName: oppTeam,
      competitionName: competition,
      venueName: m.venue?.name || (m.venue?.city ? `${m.venue.city}, ${m.venue.country || ""}` : undefined),
      kickoffAt: dateIso,
      status,
      homeScore: isHome ? homeScore : awayScore,
      awayScore: isHome ? awayScore : homeScore,
      isHome,
      rawPayload: m as unknown as Record<string, unknown>,
    };
  }
}

