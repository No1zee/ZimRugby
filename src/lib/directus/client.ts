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
  ranking_rivals: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  referee_resources: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  referee_courses: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  referee_notices: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  teams: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  videos: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  competitions: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  articles: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  partners: any[];
}

// Initialize the Directus client
// Next.js caches fetch requests by default. If you need fresh data, 
// configure caching appropriately in your fetch calls or API handlers.
const directus = createDirectus<DirectusSchema>(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055').with(rest());

export default directus;
