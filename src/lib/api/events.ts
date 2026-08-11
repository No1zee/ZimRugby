import { directusFetch } from "@/lib/directus/fetch";
import { photoAssetUrl } from "@/lib/directus/assets";
import { deriveEventStatus } from "@/lib/events/status";
import type { EventItem } from "@/types";

export type { EventItem };

interface DirectusEvent {
  id: number;
  title: string;
  subtitle: string | null;
  date_label: string | null;
  date: string | null;
  location: string | null;
  description: string | null;
  content: string | null;
  tags: string[] | string | null;
  image: string | null;
  image_url: string | null;
  ticket_url: string | null;
  sort: number | null;
  status: string;
  page_type: string | null;
  category: string | null;
  time: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseTags(raw: any): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      if (raw.startsWith("[")) return JSON.parse(raw);
      return raw.split(",").map((s: string) => s.trim());
    } catch {
      return [raw];
    }
  }
  return [];
}

function mapEvent(item: DirectusEvent): EventItem {
  return {
    id: String(item.id),
    title: item.title || "",
    subtitle: item.subtitle || "",
    date: item.date_label || (item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : ""),
    location: item.location || "",
    description: item.description || "",
    tags: parseTags(item.tags),
    image: (item.image ? photoAssetUrl(item.image) : null) || (item.image_url || "/images/events/super-league.jpg"),
    content: item.content || "",
    ticketUrl: item.ticket_url || "/tickets",
    status: deriveEventStatus(item.date, item.time)
  };
}

export async function getEvents(): Promise<EventItem[]> {
  try {
    const response = await directusFetch<DirectusEvent>('events', {
      sort: ['sort', 'date_label']
    });
    if (response && response.length > 0) {
      return response.map(mapEvent);
    }
  } catch (error) {
    console.warn("Directus fetch failed for events, falling back to mock data:", error);
  }

  return [];
}

export async function getCompetitions(): Promise<EventItem[]> {
  try {
    const response = await directusFetch<DirectusEvent>('events', {
      filter: { page_type: { _eq: "competition" } },
      sort: ['sort']
    });
    if (response && response.length > 0) {
      return response.map(mapEvent);
    }
  } catch (error) {
    console.warn("Directus fetch failed for competitions, falling back to empty:", error);
  }

  return [];
}

export async function getGeneralEvents(): Promise<EventItem[]> {
  try {
    const response = await directusFetch<DirectusEvent>('events', {
      filter: { page_type: { _eq: "general" } },
      sort: ['sort']
    });
    if (response && response.length > 0) {
      return response.map(mapEvent);
    }
  } catch (error) {
    console.warn("Directus fetch failed for general events, falling back to empty:", error);
  }

  return [];
}

export async function getEventById(id: string): Promise<EventItem | null> {
  const allEvents = await getEvents();
  return allEvents.find(e => e.id === id) || null;
}
