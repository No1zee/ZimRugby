import { Announcement } from "@/types";
import { directusFetch } from "@/lib/directus/fetch";

interface DirectusAnnouncementItem {
  id: string | number;
  title: string;
  slug: string;
  body?: string;
  priority?: "critical" | "high" | "normal";
  scope?: string | string[];
  cta_label?: string;
  cta_url?: string;
  starts_at?: string;
  ends_at?: string;
  segment?: "sables" | "lady_sables" | "schools" | "general";
  design_variant?: "banner" | "spotlight-card" | "ticker" | "overlay";
  is_sticky?: boolean;
  badge?: string;
  related_match?: string | number;
  related_event?: string | number;
  related_article?: string | number;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-tickets-zambezi",
    title: "Battle of the Zambezi Tickets Now on Sale!",
    slug: "battle-of-zambezi-tickets-live",
    body: "Secure your tickets for the biggest match of the year at Harare Sports Club. Early bird pricing ends soon!",
    priority: "critical",
    scope: ["global", "homepage", "tickets"],
    ctaLabel: "BOOK TICKETS",
    ctaUrl: "/tickets",
    startsAt: "2026-07-01T00:00:00Z",
    endsAt: "2026-08-30T23:59:59Z",
    segment: "general",
    designVariant: "banner",
    isSticky: true,
    badge: "TICKET ALERT"
  },
  {
    id: "ann-squad-sables-camp",
    title: "Sables Victoria Cup Squad Selection Named",
    slug: "sables-victoria-cup-squad-selection",
    body: "Head Coach Piet Benade has named a 32-man training squad for the upcoming camp in Bulawayo.",
    priority: "high",
    scope: ["homepage", "media"],
    ctaLabel: "READ SQUAD LIST",
    ctaUrl: "/media/heritage-1991",
    startsAt: "2026-07-01T00:00:00Z",
    endsAt: "2026-08-30T23:59:59Z",
    segment: "sables",
    designVariant: "spotlight-card",
    isSticky: false,
    badge: "SABLES XV"
  },
  {
    id: "ann-shuttle-matchday",
    title: "Matchday Fan Bus & Shuttle Service Confirmed",
    slug: "matchday-fan-bus-shuttle",
    body: "Shuttles will run from Avondale and Town straight to Harare Sports Club starting 11:30 AM.",
    priority: "normal",
    scope: ["match-centre", "events"],
    ctaLabel: "VIEW SHUTTLE TIMES",
    ctaUrl: "/match-centre",
    startsAt: "2026-07-01T00:00:00Z",
    endsAt: "2026-08-30T23:59:59Z",
    segment: "general",
    designVariant: "spotlight-card",
    isSticky: false,
    badge: "FAN INFO"
  },
  {
    id: "ann-merch-jersey",
    title: "Official Zimbabwe Sables 2026 Jersey Released",
    slug: "official-jersey-released-2026",
    body: "Pre-order the new home and away kits online today. Limited initial stock available.",
    priority: "normal",
    scope: ["clubhouse"],
    ctaLabel: "SHOP COLLECTION",
    ctaUrl: "/about/clubhouse",
    startsAt: "2026-07-01T00:00:00Z",
    endsAt: "2026-08-30T23:59:59Z",
    segment: "general",
    designVariant: "spotlight-card",
    isSticky: false,
    badge: "MERCH DROP"
  },
  {
    id: "ann-ticker-gates-open",
    title: "Gates open at 11:00 AM CAT | Local schools curtain raisers start at 12:00 PM CAT | Live DJ set in the fan zone from 18:00 CAT",
    slug: "ticker-gates-open",
    body: "",
    priority: "normal",
    scope: ["homepage", "match-centre"],
    ctaLabel: "",
    ctaUrl: "",
    startsAt: "2026-07-01T00:00:00Z",
    endsAt: "2026-08-30T23:59:59Z",
    segment: "general",
    designVariant: "ticker",
    isSticky: false,
    badge: "LIVE UPDATES"
  }
];

/**
 * Fetches active announcements from Directus, falling back to mock data if offline or not configured.
 * Automatically filters by active date range (starts_at <= now <= ends_at) when matching from Directus.
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  const nowStr = new Date().toISOString();

  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      // Query active announcements (filtering by ends_at >= now)
      const response = await directusFetch<DirectusAnnouncementItem>(
        "announcements",
        {
          filter: {
            ends_at: { _gte: nowStr },
            starts_at: { _lte: nowStr }
          },
          sort: ["-is_sticky", "-priority", "-starts_at"]
        },
        60 // Revalidate every 60 seconds for high responsiveness during match weeks
      );

      if (response && response.length > 0) {
        return response.map((item) => {
          // Scope field can be saved as a JSON array, a CSV string, or standard array depending on Directus config
          let parsedScope: Announcement["scope"] = ["homepage"];
          if (Array.isArray(item.scope)) {
            parsedScope = item.scope as Announcement["scope"];
          } else if (typeof item.scope === "string") {
            try {
              if (item.scope.startsWith("[")) {
                parsedScope = JSON.parse(item.scope);
              } else {
                parsedScope = item.scope.split(",").map(s => s.trim()) as Announcement["scope"];
              }
            } catch {
              parsedScope = [item.scope] as Announcement["scope"];
            }
          }

          return {
            id: String(item.id),
            title: item.title,
            slug: item.slug,
            body: item.body || "",
            priority: item.priority || "normal",
            scope: parsedScope,
            ctaLabel: item.cta_label,
            ctaUrl: item.cta_url,
            startsAt: item.starts_at || nowStr,
            endsAt: item.ends_at || nowStr,
            segment: item.segment || "general",
            designVariant: item.design_variant || "spotlight-card",
            isSticky: !!item.is_sticky,
            badge: item.badge,
            relatedMatchId: item.related_match ? String(item.related_match) : undefined,
            relatedEventId: item.related_event ? String(item.related_event) : undefined,
            relatedArticleId: item.related_article ? String(item.related_article) : undefined
          };
        });
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for announcements, falling back to mock data:", error);
  }

  // Fallback: Filter mock data to only active items (though all mock items above are active in 2026)
  return MOCK_ANNOUNCEMENTS.filter(
    (ann) => new Date(ann.startsAt) <= new Date() && new Date(ann.endsAt) >= new Date()
  );
}
