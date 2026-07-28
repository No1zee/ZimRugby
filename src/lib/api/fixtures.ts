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
        sort: ['-date'],
        limit: 1
      }, 60);
      
      const nextMatches = await directusFetch<DirectusMatchItem>('matches', {
        filter: {
          status: { _eq: 'upcoming' }
        },
        sort: ['date'],
        limit: 1
      }, 60);
      
      if (prevMatches?.[0] && nextMatches?.[0]) {
        const mapMatch = (m: DirectusMatchItem): Match => ({
          id: String(m.id),
          competition: m.competition || "International Match",
          round: m.round || "Standard",
          date: m.date_label || new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }),
          time: m.time || new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }),
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
