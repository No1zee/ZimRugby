import { Match } from "@/types";
import { directusFetch } from "@/lib/directus/fetch";
import { logoAssetUrl } from "@/lib/directus/assets";
import type { FixtureTwinData, DirectusMatchItem } from "@/types";

export type { FixtureTwinData, DirectusMatchItem };

export async function getFixtureTwinData(): Promise<FixtureTwinData> {
  const fallback = {
    previous: {
      id: "prev-1",
      competition: "Nations Cup",
      round: "Round 6",
      date: "18 July 2026",
      time: "15:00",
      venue: "Princess Auto Stadium, Winnipeg",
      homeTeam: {
        name: "Canada",
        logo: "https://r2.thesportsdb.com/images/media/team/badge/euxlik1566381764.png",
        score: 23
      },
      awayTeam: {
        name: "Zimbabwe",
        logo: "https://r2.thesportsdb.com/images/media/team/badge/6iaf541773658274.png",
        score: 19
      },
      status: "completed" as const,
      category: "Sables"
    },
    upcoming: {
      id: "next-1",
      competition: "Africa Cup",
      round: "TBA",
      date: "TBA",
      time: "TBA",
      venue: "TBA",
      homeTeam: {
        name: "Zimbabwe",
        logo: "https://r2.thesportsdb.com/images/media/team/badge/6iaf541773658274.png"
      },
      awayTeam: {
        name: "TBA",
        logo: ""
      },
      status: "upcoming" as const,
      category: "Sables"
    }
  };

  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const prevMatches = await directusFetch<DirectusMatchItem>('matches', {
        filter: {
          status: { _in: ['completed', 'finished'] }
        },
        sort: ['-kickoff_at'],
        limit: 1
      }, 60);
      
      const nextMatches = await directusFetch<DirectusMatchItem>('matches', {
        filter: {
          status: { _eq: 'upcoming' }
        },
        sort: ['kickoff_at'],
        limit: 1
      }, 60);
      
      if (prevMatches?.[0] && nextMatches?.[0]) {
        const mapMatch = (m: DirectusMatchItem): Match => ({
          id: String(m.id),
          competition: m.competition || "International Match",
          round: m.round || "Standard",
          date: m.date_label || (m.kickoff_at ? new Date(m.kickoff_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : 'TBA'),
          time: m.time || (m.kickoff_at ? new Date(m.kickoff_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }) : 'TBA'),
          venue: m.venue || "TBA",
          homeTeam: {
            name: m.home_team_name || "Zimbabwe Sables",
            logo: logoAssetUrl(m.home_team_logo),
            score: m.home_team_score !== null ? Number(m.home_team_score) : undefined
          },
          awayTeam: {
            name: m.away_team_name || "Opponent",
            logo: logoAssetUrl(m.away_team_logo),
            score: m.away_team_score !== null ? Number(m.away_team_score) : undefined
          },
          status: m.status as Match["status"],
          category: m.category || "Sables"
        });
        
        return {
          previous: mapMatch(prevMatches[0] as unknown as DirectusMatchItem),
          upcoming: mapMatch(nextMatches[0] as unknown as DirectusMatchItem)
        };
      }
    }
  } catch (error) {
    console.error("Error in getFixturesTwin API:", error);
  }

  return fallback;
}

interface DirectusFlatMatch {
  id: string | number;
  competition?: string;
  round?: string;
  date?: string;
  kickoff_at?: string;
  display_date_label?: string;
  display_time_label?: string;
  time?: string;
  venue?: string;
  home_team_name?: string;
  home_team_logo?: string;
  home_team_score?: number | null;
  away_team_name?: string;
  away_team_logo?: string;
  away_team_score?: number | null;
  status: string;
  category?: string;
  is_featured?: boolean;
  is_next_match?: boolean;
  show_on_match_centre?: boolean;
  show_on_homepage?: boolean;
}

const staticMatches: Match[] = [
  { id: "2026-fixture-01", competition: "Battle of the Zambezi", round: "Round 1", date: "25 April 2026", time: "15:00", venue: "Harare Sports Club", homeTeam: { name: "Zimbabwe", score: 28 }, awayTeam: { name: "Zambia", score: 14 }, status: "completed", category: "Sables" },
  { id: "2026-fixture-02", competition: "Victoria Cup", round: "Round 3", date: "30 May 2026", time: "15:30", venue: "Kyadondo Stadium, Kampala", homeTeam: { name: "Uganda", score: 19 }, awayTeam: { name: "Zimbabwe", score: 25 }, status: "completed", category: "Sables" },
  { id: "2026-fixture-03", competition: "Rugby Africa Cup 2026", round: "Pool B", date: "20 June 2026", time: "16:00", venue: "Harare Sports Club", homeTeam: { name: "Zimbabwe", score: 29 }, awayTeam: { name: "Algeria", score: 7 }, status: "completed", category: "Sables" },
  { id: "2026-fixture-04", competition: "Nations Cup", round: "Pool A", date: "4 July 2026", time: "15:00", venue: "Infinity Park, Denver", homeTeam: { name: "Tonga", score: 15 }, awayTeam: { name: "Zimbabwe", score: 22 }, status: "completed", category: "Sables" },
  { id: "2026-fixture-05", competition: "Nations Cup", round: "Pool A", date: "11 July 2026", time: "14:00", venue: "American Legion Memorial", homeTeam: { name: "USA", score: 31 }, awayTeam: { name: "Zimbabwe", score: 15 }, status: "completed", category: "Sables" },
  { id: "2026-fixture-06", competition: "Nations Cup", round: "Pool A", date: "18 July 2026", time: "15:00", venue: "Princess Auto Stadium, Winnipeg", homeTeam: { name: "Canada", score: 23 }, awayTeam: { name: "Zimbabwe", score: 19 }, status: "completed", category: "Sables" },
  { id: "2026-fixture-07", competition: "Rugby Africa Cup 2026", round: "Semi-Final", date: "16 August 2026", time: "14:30", venue: "Harare Sports Club", homeTeam: { name: "Zimbabwe" }, awayTeam: { name: "Namibia" }, status: "upcoming", category: "Sables" },
  { id: "2026-fixture-08", competition: "Rugby Africa Cup 2026", round: "Final", date: "30 August 2026", time: "15:00", venue: "Prince Edward Grounds", homeTeam: { name: "Zimbabwe" }, awayTeam: { name: "Kenya" }, status: "upcoming", category: "Sables" },
  { id: "2026-fixture-09", competition: "Friendly International", round: "Friendly", date: "12 September 2026", time: "16:00", venue: "Harare Sports Club", homeTeam: { name: "Zimbabwe" }, awayTeam: { name: "Uganda" }, status: "upcoming", category: "Sables" },
];

function mapFlatToMatch(m: DirectusFlatMatch): Match {
  const kickoff = m.kickoff_at ? new Date(m.kickoff_at) : null;
  return {
    id: String(m.id),
    competition: m.competition || "International Match",
    round: m.round || "Standard",
    date: m.display_date_label || (kickoff ? kickoff.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : m.date || "TBA"),
    time: m.display_time_label || (kickoff ? kickoff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : m.time || "TBA"),
    venue: m.venue || "TBA",
    homeTeam: {
      name: m.home_team_name || "Zimbabwe Sables",
      logo: logoAssetUrl(m.home_team_logo ?? undefined),
      score: m.home_team_score != null ? Number(m.home_team_score) : undefined,
    },
    awayTeam: {
      name: m.away_team_name || "Opponent",
      logo: logoAssetUrl(m.away_team_logo ?? undefined),
      score: m.away_team_score != null ? Number(m.away_team_score) : undefined,
    },
    status: (m.status === "completed" || m.status === "finished" ? "completed" : m.status === "live" ? "live" : "upcoming") as Match["status"],
    category: m.category || "Sables",
  };
}

export async function getAllMatches(): Promise<Match[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const matches = await directusFetch<DirectusFlatMatch>("matches", {
        filter: { status: { _nin: ["draft", "archived"] } },
        sort: ["-kickoff_at"],
        limit: 50,
      }, 120);

      if (matches && matches.length > 0) {
        return matches.map(mapFlatToMatch);
      }
    }
  } catch (error) {
    console.error("Error in getAllMatches API:", error);
  }

  return staticMatches;
}

export async function getAllUpcomingMatches(): Promise<Match[]> {
  const all = await getAllMatches();
  return all.filter(m => m.status === "upcoming");
}

export async function getAllCompletedMatches(): Promise<Match[]> {
  const all = await getAllMatches();
  return all.filter(m => m.status === "completed");
}
