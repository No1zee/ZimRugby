import { Match } from "@/types";

export interface FixtureTwinData {
  previous: Match;
  upcoming: Match;
}

/**
 * CMS_SWAP_TODO: Replace mock implementation with actual REST/GraphQL endpoints once backend is available.
 * Fully compatible with React Native / Mobile platforms for direct cross-platform consumption.
 */
export async function getFixtureTwinData(): Promise<FixtureTwinData> {
  return {
    previous: {
      id: "prev-sables-alg",
      competition: "Rugby Africa Cup 2025",
      round: "Final",
      date: "27 JULY 2025",
      time: "15:00",
      venue: "Stade M'Saken, Tunisia",
      homeTeam: {
        name: "Zimbabwe Sables",
        logo: "/images/zru-logo.webp",
        score: 29
      },
      awayTeam: {
        name: "Algeria",
        logo: "https://flagcdn.com/w160/dz.png",
        score: 3
      },
      status: "completed",
      category: "Sables"
    },
    upcoming: {
      id: "zru-zambia-2026",
      competition: "Battle of Mosi-oa-Tunya",
      round: "International Cup",
      date: "25 APRIL 2026",
      time: "15:00",
      venue: "Harare Sports Club",
      homeTeam: {
        name: "Zimbabwe Sables",
        logo: "/images/zru-logo.webp"
      },
      awayTeam: {
        name: "Zambia",
        logo: "https://flagcdn.com/w160/zm.png"
      },
      status: "upcoming",
      ticketUrl: "/tickets",
      category: "Sables"
    }
  };
}
