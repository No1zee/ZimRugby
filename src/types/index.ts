// 1. Team & Squad Entities
export interface Player {
  name: string;
  position: string;
  group?: "Forwards" | "Backs";
  club: string;
  caps: number;
  isCaptain?: boolean;
  image?: string;
}

/** Featured player for homepage showcase cards (CometCard). */
export interface FeaturedPlayer {
  name: string;
  position: string;
  team: string;
  caps: number;
  age: number;
  photo: string;
  slug?: string;
}

export interface Coach {
  name: string;
  role: string;
  image?: string;
}

export interface TeamMatch {
  opponent: string;
  opponentLogo?: string;
  date: string;
  venue: string;
  score?: string;
  zimScore?: number;
  opponentScore?: number;
  isHome?: boolean;
  status: 'upcoming' | 'completed' | 'live';
  statsSummary?: {
    halfTimeScore?: string;
    triesZim?: number;
    triesOpp?: number;
    conversionsZim?: number;
    penaltiesZim?: number;
    yellowCardsZim?: number;
    redCardsZim?: number;
    topScorer?: string;
  };
}

export interface Team {
  id: string;
  name: string;
  tagline: string;
  history: string;
  stats: {
    label: string;
    value: string;
  }[];
  coachingStaff: Coach[];
  squad: Player[];
  matches: TeamMatch[];
  gallery: string[];
}

// 2. Match & Fixture Entities
export interface TeamDetails {
  name: string;
  logo?: string;
  score?: number;
}

export interface Match {
  id: string | number;
  competition: string;
  round: string;
  date: string;
  time: string;
  venue: string;
  homeTeam: TeamDetails;
  awayTeam: TeamDetails;
  status?: 'upcoming' | 'live' | 'completed';
  ticketUrl?: string;
  category?: string;
  teamCategory?: string;
  opponentCategory?: string;
  dateIso?: string;
}

// 3. News, Articles & Report Entities
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  image: string;
  category: string;
  url: string;
  source: 'website' | 'social' | 'facebook';
  type?: 'news' | 'video';
}

// 4. Video Hub Entities
export interface Video {
  id: string;
  title: string;
  category: string;
  duration: string;
  date: string;
  thumbnail: string;
  embedUrl: string;
  description: string;
}

// 5. Photo Gallery Entities
export interface Photo {
  id: string;
  title: string;
  album: 'Match Day' | 'Historical Collections' | 'Community Rugby' | 'Training Camps';
  image: string;
  date: string;
  description: string;
  folder?: string;
  photographer?: string;
  license?: string;
}

// 6. Referees & Match Officials Entities
export interface RefereeResource {
  title: string;
  category: 'laws' | 'guides' | 'forms';
  size: string;
  downloadUrl: string;
}

export interface RefereeCourse {
  title: string;
  level: string;
  date: string;
  venue: string;
  instructor: string;
  status: 'open' | 'closed';
}

export interface RefereeNotice {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

// 8. League Table Entities
export interface LeagueTableRow {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  form: string[];
}

export interface SearchEventResult {
  id: string;
  title: string;
  location: string;
  category: string;
  href: string;
}

// 7. Announcement Entities
export interface Announcement {
  id: string;
  title: string;
  slug: string;
  body: string;
  priority: "critical" | "high" | "normal";
  scope: ("global" | "homepage" | "tickets" | "match-centre" | "events" | "media" | "clubhouse")[];
  ctaLabel?: string;
  ctaUrl?: string;
  startsAt: string;
  endsAt: string;
  segment: "sables" | "lady_sables" | "schools" | "general";
  designVariant: "banner" | "spotlight-card" | "ticker" | "overlay";
  isSticky: boolean;
  badge?: string;
  relatedMatchId?: string;
  relatedEventId?: string;
  relatedArticleId?: string;
}

// 9. Events (CMS)
export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  description: string;
  tags: string[];
  image: string;
  content?: string;
  ticketUrl?: string;
  score?: string;
  homeTeam?: string;
  awayTeam?: string;
  teams?: string[];
  city?: string;
  competition?: string;
  featured?: boolean;
  slug?: string;
  time?: string;
  /** True for all-day events (rendered as "All day", not a clock time). */
  isAllDay?: boolean;
  /** Derived from date/time at render time: "upcoming" | "ongoing" | "completed" */
  status?: "upcoming" | "ongoing" | "completed";
  /** True when the occurrence was cancelled (kept on calendar with STATUS:CANCELLED). */
  cancelled?: boolean;
}

// 10. Hero Slides (CMS)
export interface HeroSlideData {
  id: number;
  image: string;
  video?: string;
  headline: {
    line1: string;
    line2: string;
  };
  subtext: string;
  tag?: string;
  contextPill?: string;
  imagePosition?: string;
  graphicSlide?: boolean;
  matchCard?: {
    opponent: string;
    opponentSub?: string;
    date: string;
    time: string;
    venue: string;
    tag: string;
  };
  ctas: {
    primary: { label: string; href: string; iconName?: "Ticket" | "ArrowRight" | "Play" };
    secondary?: { label: string; href: string; iconName?: "Ticket" | "ArrowRight" | "Play" };
  };
  alignment?: "center" | "left";
}

// 11. Fixture Twin (previous + upcoming)
export interface FixtureTwinData {
  previous: Match;
  upcoming: Match;
}

// 12. Directus Match Item (CMS DTO)
export interface DirectusMatchItem {
  id: string | number;
  competition?: string;
  round?: string;
  date?: string;
  kickoff_at?: string;
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

// 13. Match Detail Entities
export interface LineupPlayer {
  number: number;
  name: string;
  position: string;
  club?: string;
}

export interface MatchStats {
  possession: { home: number; away: number };
  territory: { home: number; away: number };
  scrums: { home: string; away: string };
  penalties: { home: number; away: number };
  tries: { home: number; away: number };
}

export interface MatchDetailData {
  match: Match;
  homeLineup: LineupPlayer[];
  awayLineup: LineupPlayer[];
  stats?: MatchStats;
  campaign?: {
    slug: string;
    name: string;
  };
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

// 14. Rankings (CMS)
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

