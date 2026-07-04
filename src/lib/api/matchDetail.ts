import { Match } from "@/types";
import { getLiveMatches } from "@/lib/data-fetcher";

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

/**
 * CMS_SWAP_TODO: Replace mock implementation with actual REST/GraphQL endpoints once backend is available.
 * Fully compatible with React Native / Mobile platforms for direct cross-platform consumption.
 */
export async function getMatchDetail(id: string): Promise<MatchDetailData | null> {
  const matches = await getLiveMatches();
  const match = matches.find(m => String(m.id) === id) as Match | undefined;
  if (!match) return null;

  // Mock lineups based on Sables team structure
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
    // Reserves
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
