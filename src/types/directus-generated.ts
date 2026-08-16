/**
 * Auto-generated Directus TypeScript definitions.
 * Generated on 2026-07-30T08:13:58.837Z
 */

export interface GlobalSettings {
  id?: string;
  site_name?: string;
  site_tagline?: string;
  logo?: string;
  tickets_url?: string;
  shop_url?: string;
  sign_in_url?: string;
  primary_nav_label?: string;
  match_centre_label?: string;
  privacy_policy_url?: string;
  terms_url?: string;
  cookie_policy_url?: string;
  compliance_label?: string;
  contact_location_url?: string;
  contact_phone_url?: string;
  facebook_url?: string;
  x_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  status?: string;
  date_created?: string;
  date_updated?: string;
}

export interface Pages {
  id?: string;
  title?: string;
  slug?: string;
  route?: string;
  page_type?: string;
  breadcrumb_label?: string;
  hero_kicker?: string;
  hero_title?: string;
  hero_intro?: string;
  seo_title?: string;
  seo_description?: string;
  status?: string;
  publish_at?: string;
  expire_at?: string;
  sort?: number;
  date_created?: string;
  date_updated?: string;
  hero_image?: string;
  hero_image_url?: string;
}

export interface MatchCentreSettings {
  id?: string;
  page_id?: string;
  default_tab?: string;
  fixtures_enabled?: boolean;
  results_enabled?: boolean;
  standings_enabled?: boolean;
  search_placeholder?: string;
  next_match_mode?: string;
  manual_next_match_id?: string;
  show_live_strip?: boolean;
  show_fan_bulletin?: boolean;
  show_team_filters?: boolean;
  featured_standings_table_id?: string;
  status?: string;
  date_created?: string;
  date_updated?: string;
}

export interface Teams {
  id?: string;
  name?: string;
  short_name?: string;
  slug?: string;
  code?: string;
  team_type?: string;
  gender?: string;
  age_grade?: string;
  filter_label?: string;
  display_name?: string;
  crest?: string;
  primary_color?: string;
  secondary_color?: string;
  is_national_team?: boolean;
  is_active?: boolean;
  display_order?: number;
  status?: string;
  date_created?: string;
  date_updated?: string;
  tagline?: string;
  history?: string;
  stats?: Record<string, unknown>;
  coaching_staff?: Record<string, unknown>;
  squad?: Record<string, unknown>;
  matches?: Record<string, unknown>;
  gallery?: Record<string, unknown>;
  hero_image?: string;
}

export interface Opponents {
  id?: string;
  name?: string;
  short_name?: string;
  slug?: string;
  code?: string;
  country?: string;
  crest?: string;
  team_type?: string;
  notes?: string;
  status?: string;
  date_created?: string;
  date_updated?: string;
}

export interface Competitions {
  id?: string;
  name?: string;
  short_name?: string;
  slug?: string;
  competition_type?: string;
  season_label?: string;
  governing_body?: string;
  logo?: string;
  description?: string;
  is_standings_enabled?: boolean;
  sort?: number;
  status?: string;
  date_created?: string;
  date_updated?: string;
}

export interface Venues {
  id?: string;
  name?: string;
  slug?: string;
  city?: string;
  region?: string;
  country?: string;
  full_label?: string;
  google_maps_url?: string;
  timezone?: string;
  capacity?: number;
  address?: string;
  status?: string;
  date_created?: string;
  date_updated?: string;
}

export interface Matches {
  id?: string;
  title?: string;
  slug?: string;
  team_id?: string;
  opponent_id?: string;
  competition_id?: string;
  venue_id?: string;
  season_year?: number;
  match_type?: string;
  status?: string;
  home_or_away?: string;
  kickoff_at?: string;
  kickoff_timezone?: string;
  display_date_label?: string;
  display_time_label?: string;
  round_label?: string;
  stage_label?: string;
  matchday_label?: string;
  team_score?: number;
  opponent_score?: number;
  team_score_ht?: number;
  opponent_score_ht?: number;
  result_outcome?: string;
  result_label?: string;
  is_featured?: boolean;
  is_live_feature?: boolean;
  is_next_match?: boolean;
  show_on_match_centre?: boolean;
  show_on_team_page?: boolean;
  show_on_homepage?: boolean;
  pinned_order?: number;
  summary?: string;
  broadcast_notes?: string;
  ticket_url?: string;
  hero_image?: string;
  search_keywords?: string;
  publish_at?: string;
  expire_at?: string;
  status_editorial?: string;
  date_created?: string;
  date_updated?: string;
}

export interface StandingsTables {
  id?: string;
  title?: string;
  slug?: string;
  competition_id?: string;
  season_year?: number;
  notes?: string;
  is_active?: boolean;
  sort?: number;
  status?: string;
  date_created?: string;
  date_updated?: string;
}

/**
 * Soft-delete markers present on every content collection (added 2026-08-16).
 * Rows with deleted_at set are trashed: hidden from the public site, restorable
 * by id (links survive), purged only by super admins.
 */
export interface SoftDeletedFields {
  deleted_at?: string | null;
  deleted_by?: string | null;
}

/**
 * Canonical prod schema for `announcements` (verified against the live
 * Directus API 2026-08-16). Keys are the single source of truth for the
 * admin form (AdminClient), the public mapper (api/announcements.ts) and the
 * ticker/hero panels. Do NOT reintroduce legacy aliases (variant, page_scope,
 * start_at, urgent, category) — Directus silently drops unknown fields.
 */
export interface Announcements extends SoftDeletedFields {
  id?: string;
  title?: string;
  slug?: string;
  body?: string | null;
  design_variant?: "banner" | "spotlight-card" | "ticker" | "overlay" | string;
  /** Integer: 0 = normal, 20 = high, 30 = critical (site normalizes). */
  priority?: number;
  starts_at?: string | null;
  ends_at?: string | null;
  scope?: string | string[];
  segment?: "sables" | "lady_sables" | "schools" | "general" | string;
  badge?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  is_sticky?: boolean;
  is_enabled?: boolean;
  status?: string;
  related_match?: string | number | null;
  related_event?: string | number | null;
  related_article?: string | number | null;
  date_created?: string;
  date_updated?: string;
}

export interface HeroSlides {
  id?: number;
  tag?: string;
  context_pill?: string;
  headline_line1?: string;
  headline_line2?: string;
  subtext?: string;
  image?: string;
  video?: string;
  image_url?: string;
  imagePosition?: string;
  cta_primary_label?: string;
  cta_primary_href?: string;
  cta_primary_icon?: string;
  cta_secondary_label?: string;
  cta_secondary_href?: string;
  cta_secondary_icon?: string;
  match_opponent?: string;
  match_date?: string;
  match_time?: string;
  match_venue?: string;
  alignment?: string;
  sort?: number;
}

export interface Photos {
  id?: number;
  title?: string;
  caption?: string;
  tags?: string;
  photographer?: string;
  taken_at?: any;
  sort?: number;
  status?: string;
}

export interface Videos {
  id?: number;
  title?: string;
  description?: string;
  video_url?: string;
  thumbnail?: string;
  category?: string;
  duration?: string;
  sort?: number;
  status?: string;
}

export interface Partners {
  id?: number;
  name?: string;
  role?: string;
  logo?: string;
  description?: string;
  website_url?: string;
  badge?: string;
  sort?: number;
  status?: string;
}

export interface Rankings {
  id?: number;
  world_position?: number;
  world_previous_position?: number;
  world_points?: number;
  world_trend?: string;
  africa_position?: number;
  africa_previous_position?: number;
  africa_points?: number;
  africa_trend?: string;
  last_updated?: string;
  status?: string;
}

export interface HomepageContent {
  id?: number;
  status?: string;
  block_key: string;
  title?: string;
  content?: string;
  items?: Record<string, unknown>;
  image_url?: string;
  sort?: number;
}

export interface SocialPosts {
  id?: number;
  status?: string;
  source_id?: string;
  title?: string;
  excerpt?: string;
  date_label?: string;
  image_url?: string;
  category?: string;
  post_url?: string;
  source_platform?: string;
  sort?: number;
}

export interface PageSections {
  id?: string;
  page_id?: string;
  section_key?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  cta_label?: string;
  cta_url?: string;
  display_variant?: string;
  is_enabled?: boolean;
  audience_scope?: string;
  start_at?: string;
  end_at?: string;
  sort?: number;
  status?: string;
  date_created?: string;
  date_updated?: string;
  image?: string;
  content?: string;
  items?: Record<string, unknown>;
  image_url?: string;
}

export interface Events {
  id?: number;
  title?: string;
  subtitle?: string;
  date_label?: string;
  date?: any;
  location?: string;
  description?: string;
  content?: string;
  tags?: Record<string, unknown>;
  image?: string;
  image_url?: string;
  ticket_url?: string;
  sort?: number;
  status?: string;
  page_type?: string;
  category?: string;
  time?: string;
  related_team_id?: number;
}

export interface Tickets {
  id?: number;
  competition?: string;
  teams?: string;
  date?: string;
  time?: string;
  venue?: string;
  city?: string;
  status?: string;
  url?: string;
  category?: string;
  is_world_cup_pathway?: boolean;
  tags?: Record<string, unknown>;
  event_id?: number;
}

export interface Clubs {
  id?: number;
  status?: string;
  sort?: number;
  name: string;
  slug: string;
  province?: string;
  league?: string;
  venue?: string;
  color?: string;
  contact?: string;
  description?: string;
  date_created?: any;
  date_updated?: any;
}

export interface SchoolInitiatives {
  id?: number;
  status?: string;
  sort?: number;
  title: string;
  description?: string;
  icon?: string;
  stat?: string;
  date_created?: any;
  date_updated?: any;
}

export interface Campaigns {
  id?: number;
  status?: string;
  sort?: number;
  name: string;
  slug: string;
  description?: string;
  countdown_target?: string;
  hero_image?: string;
  cta_label?: string;
  cta_url?: string;
  items?: Record<string, unknown>;
  date_created?: any;
  date_updated?: any;
}

export interface SiteSettings {
  id?: number;
  site_name?: string;
  site_tagline?: string;
  hero_title?: string;
  hero_strapline?: string;
  primary_cta_label?: string;
  primary_cta_url?: string;
  secondary_cta_label?: string;
  secondary_cta_url?: string;
  seo_title?: string;
  seo_description?: string;
  facebook_url?: string;
  x_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  date_created?: any;
  date_updated?: any;
}

export interface Players {
  id?: number;
  status?: string;
  sort?: number;
  name: string;
  slug?: string;
  position?: string;
  team?: string;
  team_id?: number;
  caps?: number;
  age?: number;
  photo?: string;
  bio?: string;
  featured?: boolean;
  date_created?: any;
  date_updated?: any;
}

