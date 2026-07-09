import { Match } from "@/types";
import directus from "@/lib/directus/client";
import { readItems } from "@directus/sdk";
import { DirectusMatchItem, fetchFromDirectus, mapDirectusMatch } from "@/lib/directus/helpers";

export interface FixtureTwinData {
  previous: Match;
  upcoming: Match;
}

export async function getFixtureTwinData(): Promise<FixtureTwinData> {
  const fallback: FixtureTwinData = {
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

  return fetchFromDirectus(async () => {
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
      return {
        previous: mapDirectusMatch(prevMatches[0] as unknown as DirectusMatchItem),
        upcoming: mapDirectusMatch(nextMatches[0] as unknown as DirectusMatchItem)
      };
    }

    return null;
  }, fallback, "fixtures twin");
}
