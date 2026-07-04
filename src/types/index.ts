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
