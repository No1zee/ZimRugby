import { Match } from "@/types";
import { directusFetch } from "@/lib/directus/fetch";

export interface FixtureTwinData {
  previous: Match;
  upcoming: Match;
}

export interface DirectusMatchItem {
  id: string | number;
  competition?: string;
  round?: string;
  date: string;
  date_label?: string;
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
}

export async function getFixtureTwinData(): Promise<FixtureTwinData> {
  const fallback = {
    previous: {
      id: "prev-1",
      competition: "World Rugby Nations Cup",
      round: "Round 4",
      date: "18 July 2026",
      time: "15:00",
      venue: "Princess Auto Stadium, Winnipeg",
      homeTeam: {
        name: "Canada",
        logo: "/images/match-logos/CANADA.png",
        score: 23
      },
      awayTeam: {
        name: "Zimbabwe",
        logo: "/images/match-logos/ZIM.png",
        score: 19
      },
      status: "finished" as const,
      category: "Sables"
    },
    upcoming: {
      id: "next-1",
      competition: "Africa Cup",
      round: "Cup Final",
      date: "06 September 2026",
      time: "16:00",
      venue: "Harare Sports Club",
      homeTeam: {
        name: "Zimbabwe Sables",
        logo: "/images/match-logos/ZIM.png"
      },
      awayTeam: {
        name: "Namibia",
        logo: "https://flagcdn.com/w160/na.png"
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
        sort: ['-date'],
        limit: 1
      });
      
      const nextMatches = await directusFetch<DirectusMatchItem>('matches', {
        filter: {
          status: { _eq: 'upcoming' }
        },
        sort: ['date'],
        limit: 1
      });
      
      if (prevMatches?.[0] && nextMatches?.[0]) {
        const mapMatch = (m: DirectusMatchItem): Match => ({
          id: String(m.id),
          competition: m.competition || "International Match",
          round: m.round || "Standard",
          date: m.date_label || new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
          time: m.time || new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          venue: m.venue || "TBA",
          homeTeam: {
            name: m.home_team_name || "Zimbabwe Sables",
            logo: m.home_team_logo ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${m.home_team_logo}` : undefined,
            score: m.home_team_score !== null ? Number(m.home_team_score) : undefined
          },
          awayTeam: {
            name: m.away_team_name || "Opponent",
            logo: m.away_team_logo ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${m.away_team_logo}` : undefined,
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
