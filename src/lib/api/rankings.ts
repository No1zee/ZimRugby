/* eslint-disable @typescript-eslint/no-explicit-any */
import { directusFetch } from "@/lib/directus/fetch";

export interface RankingDetail {
  position: number;
  previousPosition?: number;
  points: number;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}

export interface RankingsData {
  world: RankingDetail;
  africa: RankingDetail;
  rivals: {
    name: string;
    position: number;
    points: number;
    logo?: string;
  }[];
}

export async function getRankingsData(): Promise<RankingsData> {
  const mockRankings: RankingsData = {
    world: {
      position: 28,
      previousPosition: 31,
      points: 54.12,
      trend: "up",
      lastUpdated: "June 2026"
    },
    africa: {
      position: 2,
      previousPosition: 3,
      points: 54.12,
      trend: "up",
      lastUpdated: "June 2026"
    },
    rivals: [
      {
        name: "Namibia",
        position: 22,
        points: 60.56,
        logo: "https://flagcdn.com/w160/na.png"
      },
      {
        name: "Kenya",
        position: 34,
        points: 49.80,
        logo: "https://flagcdn.com/w160/ke.png"
      },
      {
        name: "Uganda",
        position: 38,
        points: 47.10,
        logo: "https://flagcdn.com/w160/ug.png"
      }
    ]
  };

  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directusFetch<any>('rankings', {
        limit: 1
      });
      const rivalsResponse = await directusFetch<any>('ranking_rivals', {
        sort: ['position']
      });
      
      if (response?.[0]) {
        const mainRank = response[0];
        return {
          world: {
            position: Number(mainRank.world_position),
            previousPosition: mainRank.world_previous_position ? Number(mainRank.world_previous_position) : undefined,
            points: Number(mainRank.world_points),
            trend: mainRank.world_trend || "stable",
            lastUpdated: mainRank.last_updated || "June 2026"
          },
          africa: {
            position: Number(mainRank.africa_position),
            previousPosition: mainRank.africa_previous_position ? Number(mainRank.africa_previous_position) : undefined,
            points: Number(mainRank.africa_points),
            trend: mainRank.africa_trend || "stable",
            lastUpdated: mainRank.last_updated || "June 2026"
          },
          rivals: (rivalsResponse || []).map((rival: any) => ({
            name: rival.name,
            position: Number(rival.position),
            points: Number(rival.points),
            logo: rival.logo ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${rival.logo}` : rival.logo_url
          }))
        };
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for rankings data, falling back to mock data:", error);
  }

  return mockRankings;
}
