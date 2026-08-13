import { directusFetch } from "@/lib/directus/fetch";
import { photoAssetUrl } from "@/lib/directus/assets";
import { deriveEventStatus } from "@/lib/events/status";
import { staticData } from "@/lib/static-data";
import type { EventItem } from "@/types";
import { getDirectusMatches } from "@/lib/match-centre/api";
import type { MatchCardViewModel } from "@/lib/match-centre/types";

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
  score: string | null;
}

interface MatchJson {
  id: string;
  homeTeam: { name: string; logo?: string };
  awayTeam: { name: string; logo?: string };
  date: string;
  time?: string;
  venue?: string;
  competition?: string;
  category?: string;
  status?: string;
  score?: string;
  ticketUrl?: string;
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

function mapDirectusEvent(item: DirectusEvent): EventItem {
  return {
    id: String(item.id),
    title: item.title || "",
    subtitle: item.subtitle || "",
    date: item.date_label || (item.date ? new Date(item.date).toISOString().split('T')[0] : ""),
    location: item.location || "",
    description: item.description || "",
    tags: parseTags(item.tags),
    image: (item.image ? photoAssetUrl(item.image) : null) || (item.image_url || "/images/events/super-league.jpg"),
    content: item.content || "",
    ticketUrl: item.ticket_url || "/tickets",
    score: item.score || undefined,
    status: deriveEventStatus(item.date, item.time)
  };
}

function mapMatchToEvent(match: MatchJson): EventItem {
  const home = match.homeTeam?.name || "Team A";
  const away = match.awayTeam?.name || "Team B";
  const categoryTag = match.category || "National";
  const compTag = match.competition || "Match";

  return {
    id: match.id,
    title: `${home} vs ${away}`,
    subtitle: `${compTag} • ${categoryTag}`,
    date: match.date,
    location: match.venue || "Harare Sports Club",
    description: `Official ${compTag} fixture between ${home} and ${away} at ${match.venue || 'Harare Sports Club'}.`,
    tags: [categoryTag, compTag],
    image: match.homeTeam?.logo || "/images/events/super-league.jpg",
    ticketUrl: match.ticketUrl || "/tickets",
    score: match.score,
    homeTeam: home,
    awayTeam: away,
    status: (match.status as EventItem["status"]) || "upcoming"
  };
}

function mapDirectusMatchToEvent(match: MatchCardViewModel): EventItem {
  const home = match.homeTeam?.name || "Team A";
  const away = match.awayTeam?.name || "Team B";
  const categoryTag = match.teamCategory || "National";
  const compTag = match.competition || "Match";
  const dateStr = match.dateIso ? match.dateIso.split("T")[0] : "";

  return {
    id: match.id,
    title: `${home} vs ${away}`,
    subtitle: `${compTag} • ${categoryTag}`,
    date: dateStr,
    location: match.venue || "Harare Sports Club",
    description: `Official ${compTag} fixture between ${home} and ${away} at ${match.venue || 'Harare Sports Club'}.`,
    tags: [categoryTag, compTag],
    image: match.homeTeam?.logo || "/images/events/super-league.jpg",
    ticketUrl: match.ticketUrl || "/tickets",
    score: match.homeTeam?.score !== undefined && match.awayTeam?.score !== undefined
      ? `${match.homeTeam.score} - ${match.awayTeam.score}`
      : undefined,
    homeTeam: home,
    awayTeam: away,
    status: match.status === "live" ? "ongoing" : (match.status === "completed" ? "completed" : "upcoming")
  };
}

function getStaticFallbackEvents(): EventItem[] {
  const matchesData = (staticData["matches.json"] || []) as MatchJson[];
  const eventsData = (staticData["events.json"] || []) as EventItem[];

  const mappedMatches = matchesData.map(mapMatchToEvent);
  
  // Combine matches + static events
  const combined = [...mappedMatches];
  
  for (const ev of eventsData) {
    if (!combined.some(c => c.id === ev.id)) {
      combined.push(ev);
    }
  }

  return combined;
}

export async function getEvents(): Promise<EventItem[]> {
  const fallback = getStaticFallbackEvents();
  
  try {
    const [response, matches] = await Promise.all([
      directusFetch<DirectusEvent>('events', {
        sort: ['sort', 'date_label']
      }).catch(() => [] as DirectusEvent[]),
      getDirectusMatches().catch(() => [] as MatchCardViewModel[])
    ]);

    const cmsItems = response.map(mapDirectusEvent);
    const cmsMatches = matches.map(mapDirectusMatchToEvent);
    const merged = [...cmsItems, ...cmsMatches];

    // Merge static fallback elements (only if they aren't already represented in cms data)
    for (const fb of fallback) {
      if (!merged.some(m => m.id === fb.id || m.title === fb.title)) {
        merged.push(fb);
      }
    }
    
    return merged;
  } catch (error) {
    console.warn("Directus fetch for events fallback to static dataset:", error);
  }

  return fallback;
}

export async function getCompetitions(): Promise<EventItem[]> {
  const all = await getEvents();
  return all.filter(e => e.tags?.some(t => ["National", "Clubs", "Schools", "Super 6", "Competition", "Gold Cup", "Barthes"].some(k => t.toLowerCase().includes(k.toLowerCase()))));
}

export async function getGeneralEvents(): Promise<EventItem[]> {
  const all = await getEvents();
  return all.filter(e => !e.tags?.some(t => ["National", "Clubs", "Schools"].some(k => t.toLowerCase().includes(k.toLowerCase()))));
}

export async function getEventById(id: string): Promise<EventItem | null> {
  const allEvents = await getEvents();
  return allEvents.find(e => e.id === id) || null;
}
