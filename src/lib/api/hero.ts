import type { HeroSlideData } from "@/types";
import { directusFetch } from "@/lib/directus/fetch";
import { heroAssetUrl } from "@/lib/directus/assets";

export type { HeroSlideData };

const DEFAULT_HERO_SLIDES: HeroSlideData[] = [
  {
    id: 1,
    tag: "REIGNING AFRICA CHAMPIONS",
    contextPill: "ROAD TO AUSTRALIA 2027",
    image: "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp",
    headline: {
      line1: "ZIMBABWE",
      line2: "SABLES",
    },
    subtext: "Reclaiming our position among rugby's elite. Follow the journey to the 2027 Rugby World Cup in Australia.",
    matchCard: {
      opponent: "USA Eagles",
      opponentSub: "INTERNATIONAL TEST MATCH",
      date: "4 July 2026",
      time: "15:00 CAT",
      venue: "Denver, Colorado",
      tag: "UPCOMING TEST",
    },
    ctas: {
      primary: {
        label: "Explore Sables Squad",
        href: "/teams/sables",
        iconName: "ArrowRight",
      },
      secondary: {
        label: "Match Centre",
        href: "/match-centre",
        iconName: "ArrowRight",
      },
    },
    alignment: "left",
  },
  {
    id: 2,
    tag: "WOMEN'S RUGBY EXCELLENCE",
    contextPill: "RUGBY AFRICA CUP",
    image: "/images/teams/lady-sables.jpg",
    headline: {
      line1: "LADY",
      line2: "SABLES",
    },
    subtext: "The pride of Zimbabwe women's sport, inspiring the next generation across Africa.",
    ctas: {
      primary: {
        label: "Lady Sables Hub",
        href: "/teams/lady-sables",
        iconName: "ArrowRight",
      },
      secondary: {
        label: "Grassroots Development",
        href: "/play-rugby",
        iconName: "ArrowRight",
      },
    },
    alignment: "left",
  },
  {
    id: 3,
    tag: "AGE-GRADE EXCELLENCE",
    contextPill: "BARTHES TROPHY CHAMPIONS",
    image: "/images/events/schools-fest.jpg",
    headline: {
      line1: "JUNIOR",
      line2: "SABLES U20",
    },
    subtext: "Multiple Barthes Trophy champions building the future pipeline of Zimbabwean rugby.",
    ctas: {
      primary: {
        label: "U20 Squad",
        href: "/teams/junior-sables",
        iconName: "ArrowRight",
      },
    },
    alignment: "left",
  },
];

export async function getHeroSlides(): Promise<HeroSlideData[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directusFetch<any>('hero_slides', {
        sort: ['sort'],
      });
      if (response && response.length > 0) {
        return response.map((slide: any) => {
          const rawImage = slide.image || slide.image_url || "";
          const directusBase = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://zru-directus-cms-production.up.railway.app";
          let resolvedImage = "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp";
          if (rawImage) {
            if (rawImage.startsWith("http://") || rawImage.startsWith("https://") || rawImage.startsWith("/")) {
              resolvedImage = rawImage;
            } else if (/^[a-f0-9-]{36}$/i.test(rawImage)) {
              resolvedImage = `${directusBase}/assets/${rawImage}`;
            } else {
              resolvedImage = heroAssetUrl(rawImage) || rawImage;
            }
          }
          return {
            id: Number(slide.id),
            tag: slide.tag,
            contextPill: slide.context_pill,
            image: resolvedImage,
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

  return DEFAULT_HERO_SLIDES;
}
