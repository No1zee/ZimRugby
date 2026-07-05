import { Match } from "@/types";
import directus from "@/lib/directus/client";
import { readItems } from "@directus/sdk";

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
      competition: "Africa Cup",
      round: "Semi-Final",
      date: "22 June 2026",
      time: "15:00",
      venue: "Kyadondo Rugby Club, Kampala",
      homeTeam: {
        name: "Zimbabwe Sables",
        logo: "/images/zru-logo.webp",
        score: 32
      },
      awayTeam: {
        name: "Namibia Welwitschias",
        logo: "https://flagcdn.com/w160/na.png",
        score: 10
      },
      status: "completed" as const,
      category: "Sables"
    },
    upcoming: {
      id: "next-1",
      competition: "Africa Cup",
      round: "Final",
      date: "06 July 2026",
      time: "16:00",
      venue: "Mweru Stadium, Lusaka",
      homeTeam: {
        name: "Zimbabwe Sables",
        logo: "/images/zru-logo.webp"
      },
      awayTeam: {
        name: "Algeria",
        logo: "https://flagcdn.com/w160/dz.png"
      },
      status: "upcoming" as const,
      category: "Sables"
    }
  };

  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const prevMatches = await directus.request(
        readItems('matches', {
          filter: {
            status: { _in: ['completed', 'finished'] }
          },
          sort: ['-date'],
          limit: 1
        })
      );
      
      const nextMatches = await directus.request(
        readItems('matches', {
          filter: {
            status: { _eq: 'upcoming' }
          },
          sort: ['date'],
          limit: 1
        })
      );
      
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
