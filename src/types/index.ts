// 1. Team & Squad Entities
export interface Player {
  name: string;
  position: string;
  club: string;
  caps: number;
  image?: string;
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
  status: 'upcoming' | 'completed';
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
  status: 'upcoming' | 'live' | 'completed' | 'finished';
  ticketUrl?: string;
  category: string;
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
  category: 'Match Highlights' | 'Press Conferences' | 'Player Features' | 'Rugby Explained';
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

