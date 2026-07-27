export interface TeamStat {
  label: string;
  value: string;
}

export interface Team {
  id: string;
  slug: string;
  shortName: string;
  fullName: string;
  category: string;
  format: "15s" | "7s";
  formatLabel: string;
  accent: string;
  jerseyColors: [string, string];
  tagline: string;
  description: string;
  ranking: string;
  rankingValue: string;
  worldRankingTier: string;
  keyHonour: string;
  recentRecord: ("W" | "L" | "D")[];
  pathway: string;
  squadSize: number;
  heroImage: string;
  featuredImage: string;
  featuredPlayer: string;
  stats: TeamStat[];
  href: string;
}
