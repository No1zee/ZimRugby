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

/**
 * CMS_SWAP_TODO: Replace mock implementation with actual REST/GraphQL endpoints once backend is available.
 * Fully compatible with React Native / Mobile platforms for direct cross-platform consumption.
 */
export async function getRankingsData(): Promise<RankingsData> {
  return {
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
}
