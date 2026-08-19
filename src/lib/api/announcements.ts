import { Announcement } from "@/types";
import type { Announcements as DirectusAnnouncement } from "@/types/directus-generated";
import { directusFetch } from "@/lib/directus/fetch";

/**
 * Fetches active announcements from Directus, filtering out soft-deleted items.
 * Automatically filters by active date range (starts_at <= now <= ends_at) when matching from Directus.
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  const nowStr = new Date().toISOString();

  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directusFetch<DirectusAnnouncement>(
        "announcements",
        {
          filter: {
            ends_at: { _gte: nowStr },
            starts_at: { _lte: nowStr },
            is_enabled: { _eq: true },
            deleted_at: { _null: true },
          },
          sort: ["-is_sticky", "-priority", "-starts_at"]
        },
        60
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
            title: item.title || "",
            slug: item.slug || `ann-${item.id}`,
            body: item.body || "",
            // Directus stores priority as a number (0 = normal); map back to the
            // string union the site components expect.
            priority: (() => {
              const p = Number(item.priority) || 0;
              return p >= 30 ? "critical" : p >= 20 ? "high" : "normal";
            })(),
            scope: parsedScope,
            ctaLabel: item.cta_label || undefined,
            ctaUrl: item.cta_url || undefined,
            startsAt: item.starts_at || nowStr,
            endsAt: item.ends_at || nowStr,
            segment: (item.segment as Announcement["segment"]) || "general",
            designVariant: (item.design_variant as Announcement["designVariant"]) || "spotlight-card",
            isSticky: !!item.is_sticky,
            badge: item.badge || undefined,
            relatedMatchId: item.related_match ? String(item.related_match) : undefined,
            relatedEventId: item.related_event ? String(item.related_event) : undefined,
            relatedArticleId: item.related_article ? String(item.related_article) : undefined
          };
        });
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for announcements:", error);
  }

  // If Directus is empty or offline, return empty array (do not show fake/mock announcements)
  return [];
}
