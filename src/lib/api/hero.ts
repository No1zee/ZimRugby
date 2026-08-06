import type { HeroSlideData } from "@/types";
import { directusFetch } from "@/lib/directus/fetch";
import { heroAssetUrl } from "@/lib/directus/assets";

export type { HeroSlideData };

export async function getHeroSlides(): Promise<HeroSlideData[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directusFetch<any>('hero_slides', {
        sort: ['sort'],
      });
      if (response && response.length > 0) {
        return response.map((slide: any) => {
          const rawImage = slide.image || slide.image_url || "";
          const isDirectUrl = rawImage.startsWith("http") || rawImage.startsWith("/");
          return {
            id: Number(slide.id),
            tag: slide.tag,
            contextPill: slide.context_pill,
            image: isDirectUrl ? rawImage : (heroAssetUrl(rawImage) || rawImage),
            video: slide.video ? `/api/assets/${slide.video}` : slide.video_url,
          headline: {
            line1: slide.headline_line1 || "",
            line2: slide.headline_line2 || "",
          },
          subtext: slide.subtext || "",
          matchCard: slide.match_opponent ? {
            opponent: slide.match_opponent,
            opponentSub: slide.match_opponent_sub,
            date: slide.match_date,
            time: slide.match_time,
            venue: slide.match_venue,
            tag: slide.match_tag || "UPCOMING FIXTURE",
          } : undefined,
          ctas: {
            primary: {
              label: slide.cta1_label || slide.cta_primary_label || "Learn More",
              href: slide.cta1_href || slide.cta_primary_href || "/teams",
              iconName: slide.cta1_icon || slide.cta_primary_icon || "ArrowRight",
            },
            secondary: (slide.cta2_label || slide.cta_secondary_label) ? {
              label: slide.cta2_label || slide.cta_secondary_label,
              href: slide.cta2_href || slide.cta_secondary_href || "/match-centre",
              iconName: slide.cta2_icon || slide.cta_secondary_icon,
            } : undefined,
          },
          alignment: slide.alignment || "left",
        };
      });
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for hero slides:", error);
  }

  return [];
}
