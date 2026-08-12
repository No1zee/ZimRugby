/**
 * Typed Domain View Models for Zimbabwe Rugby Union Match Centre
 */

export interface GlobalSettings {
  siteName: string;
  siteTagline?: string;
  ticketsUrl?: string;
  shopUrl?: string;
  signInUrl?: string;
  complianceLabel: string;
}

export interface MatchCentrePageConfig {
  title: string;
  subtitle: string;
  tag: string;
  breadcrumb: Array<{ label: string; href: string }>;
}

export interface FanBulletinSection {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  displayVariant: "callout" | "inline" | "notice" | "empty-state";
}

export interface MatchCentreSettingsConfig {
  defaultTab: "fixtures" | "results" | "standings";
  fixturesEnabled: boolean;
  resultsEnabled: boolean;
  standingsEnabled: boolean;
  searchPlaceholder: string;
  showLiveStrip: boolean;
  showFanBulletin: boolean;
  showTeamFilters: boolean;
}

export interface TeamEntity {
  id: string;
  name: string;
  shortName?: string;
  slug: string;
  code?: string;
  teamType: string;
  filterLabel: string;
  displayOrder: number;
}

export interface MatchCardViewModel {
  id: string;
  slug: string;
  title: string;
  competition: string;
  round?: string;
  dateIso: string;
  time: string;
  venue: string;
  homeTeam: { name: string; code?: string; score?: number; logo?: string };
  awayTeam: { name: string; code?: string; score?: number; logo?: string };
  status: "upcoming" | "live" | "completed";
  resultOutcome?: "win" | "loss" | "draw" | "na";
  resultLabel?: string;
  teamCategory: string;
  ticketUrl?: string;
}

export interface StandingsRowViewModel {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDiff: number;
  bonusPoints: number;
  points: number;
  form: string[];
}

export interface StandingsTableViewModel {
  id: string;
  title: string;
  slug: string;
  seasonYear: number;
  rows: StandingsRowViewModel[];
}

export interface LiveAnnouncementStripViewModel {
  id: string;
  title: string;
  body?: string;
  variant: string;
  category?: string;
  urgent: boolean;
}
