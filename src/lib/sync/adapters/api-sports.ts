import { MatchProviderAdapter, NormalizedMatch } from "../types";

export interface ApiSportsGame {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  week: string | null;
  status: {
    short: string;
    long: string;
  };
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
    season: number;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  scores: {
    home: number | null;
    away: number | null;
  };
}

export class ApiSportsRugbyAdapter implements MatchProviderAdapter {
  name = "api_sports" as const;
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || process.env.API_SPORTS_KEY || process.env.RAPIDAPI_KEY || "";
    this.baseUrl = baseUrl || process.env.API_SPORTS_BASE_URL || "https://v1.rugby.api-sports.io";
  }

  private getHeaders(): Record<string, string> {
    if (!this.apiKey) {
      throw new Error("API_SPORTS_KEY is not configured in environment variables.");
    }

    if (this.baseUrl.includes("rapidapi.com")) {
      return {
        "x-rapidapi-key": this.apiKey,
        "x-rapidapi-host": "api-rugby.p.rapidapi.com",
      };
    }

    return {
      "x-apisports-key": this.apiKey,
    };
  }

  async searchTeam(name: string): Promise<Array<{ id: number; name: string }>> {
    const url = `${this.baseUrl}/teams?search=${encodeURIComponent(name)}`;
    const res = await fetch(url, {
      headers: this.getHeaders(),
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`API-Sports team search failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.response || [];
  }

  async fetchFixtures(options?: {
    teamId?: number | string;
    teamName?: string;
    season?: number;
    leagueId?: number | string;
  }): Promise<NormalizedMatch[]> {
    const currentYear = new Date().getFullYear();
    const season = options?.season || currentYear;
    
    let resolvedTeamId = options?.teamId;
    if (!resolvedTeamId && !options?.leagueId) {
      const searchTarget = options?.teamName || "Zimbabwe";
      try {
        const teams = await this.searchTeam(searchTarget);
        if (teams.length > 0) {
          resolvedTeamId = teams[0].id;
        } else {
          resolvedTeamId = 320; // Fallback to Zimbabwe Sables team ID
        }
      } catch {
        resolvedTeamId = 320;
      }
    }

    const params = new URLSearchParams();
    params.set("season", season.toString());

    if (resolvedTeamId) {
      params.set("team", resolvedTeamId.toString());
    } else if (options?.leagueId) {
      params.set("league", options.leagueId.toString());
    }

    const url = `${this.baseUrl}/games?${params.toString()}`;

    const res = await fetch(url, {
      headers: this.getHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`API-Sports games fetch failed: ${res.status} ${res.statusText} — ${errBody}`);
    }

    const payload = await res.json();
    const games: ApiSportsGame[] = payload.response || [];

    return games.map((game) => this.normalizeGame(game));
  }

  private normalizeGame(game: ApiSportsGame): NormalizedMatch {
    const isHome = (game.teams.home.name.toLowerCase().includes("zimbabwe") ||
      game.teams.home.name.toLowerCase().includes("sables"));

    const zruTeamName = isHome ? game.teams.home.name : game.teams.away.name;
    const oppName = isHome ? game.teams.away.name : game.teams.home.name;

    // Determine status
    let status: "upcoming" | "live" | "completed" = "upcoming";
    const statusShort = (game.status?.short || "").toUpperCase();
    if (["FT", "AET", "POST"].includes(statusShort)) {
      status = "completed";
    } else if (["1H", "2H", "HT", "LIVE", "ET"].includes(statusShort)) {
      status = "live";
    } else {
      status = "upcoming";
    }

    // Determine match type
    const leagueName = (game.league?.name || "").toLowerCase();
    let matchType: "international" | "domestic" | "schools" | "sevens" = "international";
    if (leagueName.includes("7s") || leagueName.includes("sevens")) {
      matchType = "sevens";
    } else if (leagueName.includes("cup") || leagueName.includes("africa") || leagueName.includes("qualifier")) {
      matchType = "international";
    }

    const slug = `${zruTeamName}-vs-${oppName}-${game.date.substring(0, 10)}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return {
      externalId: `api_sports_${game.id}`,
      source: "api_sports",
      title: `${game.teams.home.name} vs ${game.teams.away.name}`,
      slug,
      matchType,
      teamName: zruTeamName,
      opponentName: oppName,
      competitionName: game.league?.name || "International Match",
      venueName: game.country?.name ? `${game.country.name}` : undefined,
      kickoffAt: game.date.includes("T") ? game.date : `${game.date}T${game.time || "15:00:00"}Z`,
      status,
      homeScore: game.scores?.home,
      awayScore: game.scores?.away,
      isHome,
      rawPayload: game as unknown as Record<string, unknown>,
    };
  }
}
