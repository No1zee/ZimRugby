import { directusFetch } from "@/lib/directus/fetch";

export interface Club {
  id: number;
  name: string;
  slug: string;
  province?: string;
  league?: string;
  venue?: string;
  color?: string;
  contact?: string;
  description?: string;
  status?: string;
  sort?: number;
}

const fallbackClubs: Club[] = [
  { id: 1, name: "Old Hararians RFC", slug: "old-hararians-rfc", province: "Mashonaland", league: "Super Six League", venue: "Old Hararians Sports Club, Milton Park, Harare", color: "ZRU Green / Gold Accent", contact: "ohrfc@zru.co.zw", description: "One of the most decorated clubs in Zimbabwean rugby history, boasting multiple championship trophies and producing world-class Sables." },
  { id: 2, name: "Harare Sports Club", slug: "harare-sports-club", province: "Mashonaland", league: "Super Six League", venue: "Harare Sports Club, Central Harare", color: "Red / White Accent", contact: "hsc@zru.co.zw", description: "The home of the 'Red Lions'. HSC is a cornerstone club of the national league and host to major international test fixtures." },
  { id: 3, name: "Old Georgians RFC", slug: "old-georgians-rfc", province: "Mashonaland", league: "Super Six League", venue: "Old Georgians Sports Club, Groombridge, Harare", color: "Red / Black Accent", contact: "ogrfc@zru.co.zw", description: "The 'Dragons' have a state-of-the-art facility and a rich history of tactical excellence in both 15s and 7s formats." },
  { id: 4, name: "Old Miltonians RFC", slug: "old-miltonians-rfc", province: "Matabeleland", league: "Super Six League", venue: "Hartsfield Rugby Ground, Bulawayo", color: "Yellow / Black Accent", contact: "omrfc@zru.co.zw", description: "Bulawayo's premier rugby franchise, carrying the pride of Matabeleland rugby with a gritty, high-performance style." },
  { id: 5, name: "Matabeleland Warriors", slug: "matabeleland-warriors", province: "Matabeleland", league: "Super Six League", venue: "Hartsfield Rugby Ground, Bulawayo", color: "Blue / Black Accent", contact: "warriors@zru.co.zw", description: "A fierce competitive club based at Hartsfield Bulawayo, committed to development and regional talent growth." },
  { id: 6, name: "Mutare Sports Club", slug: "mutare-sports-club", province: "Manicaland", league: "First Division", venue: "Mutare Sports Club, Mutare", color: "Green / White Accent", contact: "mutare@zru.co.zw", description: "Representing Manicaland province in the national league structure. A community hub fostering talent in the eastern regions." },
];

export async function getClubs(): Promise<Club[]> {
  try {
    if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return fallbackClubs;

    const clubs = await directusFetch<Club>("clubs", {
      filter: { status: { _eq: "published" } },
      sort: ["sort"],
      limit: 50,
    });

    if (clubs && clubs.length > 0) return clubs;

    return fallbackClubs;
  } catch {
    console.warn("Failed to fetch clubs from Directus, using fallback");
    return fallbackClubs;
  }
}
