import { Match } from "@/types";
import { getLiveMatches } from "@/lib/data-fetcher";
import directus from "@/lib/directus/client";
import { readItem } from "@directus/sdk";

export interface LineupPlayer {
  number: number;
  name: string;
  position: string;
  club?: string;
}

export interface MatchStats {
  possession: { home: number; away: number };
  territory: { home: number; away: number };
  scrums: { home: string; away: string }; // e.g. "5/6" won
  penalties: { home: number; away: number };
  tries: { home: number; away: number };
}

export interface MatchDetailData {
  match: Match;
  homeLineup: LineupPlayer[];
  awayLineup: LineupPlayer[];
  stats?: MatchStats;
  report?: {
    summary: string;
    paragraphs: string[];
    scorerTimeline: {
      minute: number;
      team: 'home' | 'away';
      type: 'try' | 'conversion' | 'penalty' | 'drop-goal';
      player: string;
    }[];
  };
}

interface DirectusMatchDetailItem {
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
  home_lineup?: {
    number: number;
    name: string;
    position: string;
    club?: string;
  }[];
  away_lineup?: {
    number: number;
    name: string;
    position: string;
    club?: string;
  }[];
  stats?: {
    possession_home: number | string;
    possession_away: number | string;
    territory_home: number | string;
    territory_away: number | string;
    scrums_home: number;
    scrums_away: number;
    penalties_home: number | string;
    penalties_away: number | string;
    tries_home: number | string;
    tries_away: number | string;
  };
  report?: {
    summary?: string;
    paragraphs?: string[];
    scorer_timeline?: {
      minute: number;
      team: 'home' | 'away';
      type: 'try' | 'conversion' | 'penalty' | 'drop-goal';
      player: string;
    }[];
  };
}

export async function getMatchDetail(id: string): Promise<MatchDetailData | null> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const matchData = await directus.request(
        readItem('matches', id, {
          fields: ['*', 'home_lineup.*', 'away_lineup.*', 'stats.*', 'report.*']
        })
      );
      
      if (matchData) {
        const m = matchData as unknown as DirectusMatchDetailItem;
        const match: Match = {
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
          status: m.status as Match['status'],
          category: m.category || "Sables"
        };

        const homeLineup: LineupPlayer[] = (m.home_lineup || []).map((p) => ({
          number: Number(p.number),
          name: p.name,
          position: p.position,
          club: p.club
        }));

        const awayLineup: LineupPlayer[] = (m.away_lineup || []).map((p) => ({
          number: Number(p.number),
          name: p.name,
          position: p.position,
          club: p.club
        }));

        const stats: MatchStats | undefined = m.stats ? {
          possession: { home: Number(m.stats.possession_home), away: Number(m.stats.possession_away) },
          territory: { home: Number(m.stats.territory_home), away: Number(m.stats.territory_away) },
          scrums: { home: String(m.stats.scrums_home), away: String(m.stats.scrums_away) },
          penalties: { home: Number(m.stats.penalties_home), away: Number(m.stats.penalties_away) },
          tries: { home: Number(m.stats.tries_home), away: Number(m.stats.tries_away) }
        } : undefined;

        const report = m.report ? {
          summary: m.report.summary || "",
          paragraphs: Array.isArray(m.report.paragraphs) ? m.report.paragraphs : [m.report.summary || ""],
          scorerTimeline: (m.report.scorer_timeline || []).map((item) => ({
            minute: Number(item.minute),
            team: item.team as 'home' | 'away',
            type: item.type as 'try' | 'conversion' | 'penalty' | 'drop-goal',
            player: item.player
          }))
        } : undefined;

        return {
          match,
          homeLineup,
          awayLineup,
          stats: match.status === 'finished' || match.status === 'completed' || match.status === 'live' ? stats : undefined,
          report: match.status === 'finished' || match.status === 'completed' ? report : undefined
        };
      }
    }
  } catch (error) {
    console.warn(`Directus fetch failed for match detail ${id}, falling back to mock data:`, error);
  }

  // Mock Fallback
  const matches = await getLiveMatches();
  const match = matches.find(m => String(m.id) === id) as Match | undefined;
  if (!match) return null;

  const homeLineup: LineupPlayer[] = [
    { number: 1, name: "Cleopas Kundiona", position: "Prop", club: "Nevers" },
    { number: 2, name: "Simbarashe Mandioma", position: "Hooker", club: "Harare Sports Club" },
    { number: 3, name: "Bornwell Gwinji", position: "Prop", club: "Old Georgians" },
    { number: 4, name: "Kudakwashe Nyakufaringwa", position: "Lock", club: "Harare Sports Club" },
    { number: 5, name: "Simbarashe Siraha", position: "Lock", club: "Old Hararians" },
    { number: 6, name: "Dylan Mangimela", position: "Flanker", club: "Harare Sports Club" },
    { number: 7, name: "Connor Pritchard", position: "Flanker", club: "Griffiths" },
    { number: 8, name: "Aiden Burnett", position: "Number 8", club: "Old Georgians" },
    { number: 9, name: "Hilton Mudariki (C)", position: "Scrum-half", club: "Harare Sports Club" },
    { number: 10, name: "Ian Prior", position: "Fly-half", club: "Reds" },
    { number: 11, name: "Edward Sigauke", position: "Winger", club: "Old Hararians" },
    { number: 12, name: "Kudzai Mashawi", position: "Centre", club: "Harare Sports Club" },
    { number: 13, name: "Brandon Mudzekenyedzi", position: "Centre", club: "Old Georgians" },
    { number: 14, name: "Takudzwa Musingwini", position: "Winger", club: "Harare Sports Club" },
    { number: 15, name: "Tapiwa Mafura", position: "Full-back", club: "Lions" },
    { number: 16, name: "Liam Larkan", position: "Hooker", club: "Old Georgians" },
    { number: 17, name: "Zvikomborero Chimoto", position: "Prop", club: "Harare Sports Club" },
    { number: 18, name: "Vuyo Mupindo", position: "Prop", club: "Old Hararians" },
    { number: 19, name: "David Makamba", position: "Lock", club: "Old Georgians" },
    { number: 20, name: "Tinashe Chieza", position: "Flanker", club: "Harare Sports Club" },
    { number: 21, name: "Keegan Joubert", position: "Scrum-half", club: "Old Georgians" },
    { number: 22, name: "Dion Khumalo", position: "Utility Back", club: "Harare Sports Club" },
    { number: 23, name: "Tinashe Hombiro", position: "Utility Back", club: "Old Hararians" }
  ];

  const awayLineup: LineupPlayer[] = [
    { number: 1, name: "Moses Nyama", position: "Prop" },
    { number: 2, name: "Chisenga Kaseba", position: "Hooker" },
    { number: 3, name: "Mphatso Zulu", position: "Prop" },
    { number: 4, name: "John Mulenga", position: "Lock" },
    { number: 5, name: "Gift Kabeya", position: "Lock" },
    { number: 6, name: "Lawrence Banda", position: "Flanker" },
    { number: 7, name: "Brian Mbalwe", position: "Flanker" },
    { number: 8, name: "Terry Kaushiku", position: "Number 8" },
    { number: 9, name: "Elisha Bwalya", position: "Scrum-half" },
    { number: 10, name: "Laston Mukosa", position: "Fly-half" },
    { number: 11, name: "Simon Kapindu", position: "Winger" },
    { number: 12, name: "Patrick Mwewa", position: "Centre" },
    { number: 13, name: "Israel Kalumba", position: "Centre" },
    { number: 14, name: "Edmond Hamayuwa", position: "Winger" },
    { number: 15, name: "Charles Kaluwe", position: "Full-back" }
  ];

  const stats: MatchStats = {
    possession: { home: 58, away: 42 },
    territory: { home: 62, away: 38 },
    scrums: { home: "6/7", away: "4/6" },
    penalties: { home: 8, away: 12 },
    tries: { home: 4, away: 0 }
  };

  const report = {
    summary: "The Sables asserted their dominance over their regional rivals with a clinical 29-3 victory to secure the Barthes Cup.",
    paragraphs: [
      "Zimbabwe Sables put on a defensive masterclass in front of a packed home crowd, refusing to allow Algeria any try-scoring opportunities. Led by captain Hilton Mudariki, the team played with high intensity from the opening whistle.",
      "A brace of tries from winger Edward Sigauke, combined with stellar kicking from fly-half Ian Prior, built a comfortable lead by halftime. The second half saw a physical battle in the forward packs, but Zimbabwe's superior scrum efficiency sealed the victory."
    ],
    scorerTimeline: [
      { minute: 12, team: 'home' as const, type: 'penalty' as const, player: 'Ian Prior' },
      { minute: 22, team: 'home' as const, type: 'try' as const, player: 'Edward Sigauke' },
      { minute: 23, team: 'home' as const, type: 'conversion' as const, player: 'Ian Prior' },
      { minute: 35, team: 'away' as const, type: 'penalty' as const, player: 'Laston Mukosa' },
      { minute: 45, team: 'home' as const, type: 'try' as const, player: 'Tapiwa Mafura' },
      { minute: 60, team: 'home' as const, type: 'try' as const, player: 'Edward Sigauke' },
      { minute: 61, team: 'home' as const, type: 'conversion' as const, player: 'Ian Prior' },
      { minute: 78, team: 'home' as const, type: 'try' as const, player: 'Hilton Mudariki' }
    ]
  };

  return {
    match,
    homeLineup,
    awayLineup,
    stats: match.status === 'finished' || match.status === 'completed' || match.status === 'live' ? stats : undefined,
    report: match.status === 'finished' || match.status === 'completed' ? report : undefined
  };
}
