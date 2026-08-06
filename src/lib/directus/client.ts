import { createDirectus, rest } from '@directus/sdk';

export interface DirectusSchema {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matches: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  photos: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hero_slides: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rankings: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  teams: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  videos: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  competitions: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  partners: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clubs: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  school_initiatives: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  campaigns: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  site_settings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  players: any[];
}

const directus = createDirectus<DirectusSchema>(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055').with(rest());

export default directus;
