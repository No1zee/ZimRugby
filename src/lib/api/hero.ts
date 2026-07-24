export interface HeroSlideData {
  id: number;
  image: string;
  video?: string;
  headline: {
    line1: string;
    line2: string;
  };
  subtext: string;
  tag?: string; // Team tag, e.g., "SABLES", "CHEETAHS", "LADY SABLES"
  contextPill?: string;
  imagePosition?: string; // CSS object-position, e.g. "center top"
  graphicSlide?: boolean; // If true, hides text overlay — image has its own design/text
  matchCard?: {
    opponent: string;
    opponentSub?: string;
    date: string;
    time: string;
    venue: string;
    tag: string;
  };
  ctas: {
    primary: { label: string; href: string; iconName?: "Ticket" | "ArrowRight" | "Play" };
    secondary?: { label: string; href: string; iconName?: "Ticket" | "ArrowRight" | "Play" };
  };
  alignment?: "center" | "left";
}

/**
 * CMS_SWAP_TODO: Replace mock implementation with actual REST/GraphQL endpoints once backend is available.
 * Fully compatible with React Native / Mobile platforms for direct cross-platform consumption.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { directusFetch } from "@/lib/directus/fetch";

const MOCK_SLIDES: HeroSlideData[] = [
    {
      id: 1,
      tag: "ZIMBABWE RUGBY UNION",
      contextPill: "OFFICIAL GOVERNING BODY",
      image: "/images/hero/tonga-vs-zim.webp",
      imagePosition: "center 40%",
      headline: {
        line1: "GOVERNING & GROWING",
        line2: "ZIMBABWE RUGBY",
      },
      subtext: "From grassroots school leagues to the elite national Sables squads, ZRU is dedicated to developing character, discipline, and success.",
      ctas: {
        primary: { label: "Match Centre", href: "/match-centre", iconName: "ArrowRight" },
        secondary: { label: "Play Rugby", href: "/play-rugby", iconName: "ArrowRight" },
      },
    },
    {
      id: 2,
      tag: "SABLES",
      contextPill: "AFRICA CUP CHAMPIONS",
      image: "/images/hero/lady-sables.webp", // Standard fallback
      imagePosition: "center top",
      headline: {
        line1: "THE PRIDE OF",
        line2: "THE NATION",
      },
      subtext: "Witness the African Champions in their campaign to qualify for the Rugby World Cup. Bold, proud, and unstoppable.",
      ctas: {
        primary: { label: "Meet The Squad", href: "/teams/sables", iconName: "ArrowRight" },
        secondary: { label: "Latest News", href: "/media", iconName: "ArrowRight" },
      },
    },
    {
      id: 3,
      tag: "LADY SABLES",
      contextPill: "WOMEN'S RUGBY DEVELOPMENT",
      image: "/images/hero/zim-u20s.webp",
      imagePosition: "center center",
      headline: {
        line1: "LADY SABLES",
        line2: "INSPIRING THE FUTURE",
      },
      subtext: "The Lady Sables are leading the way in growing women's rugby across Zimbabwe. Be part of the legacy.",
      ctas: {
        primary: { label: "Lady Sables Squad", href: "/teams/lady-sables", iconName: "ArrowRight" },
        secondary: { label: "Match Centre", href: "/match-centre", iconName: "ArrowRight" },
      },
    },
  ];

export async function getHeroSlides(): Promise<HeroSlideData[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const response = await directusFetch<any>('hero_slides', {
        sort: ['sort'],
      });
      if (response && response.length > 0) {
        return response.map((slide: any) => ({
          id: Number(slide.id),
          tag: slide.tag,
          contextPill: slide.context_pill,
          image: slide.image ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${slide.image}` : slide.image_url,
          video: slide.video ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${slide.video}` : slide.video_url,
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
              label: slide.cta_primary_label || "Sign In",
              href: slide.cta_primary_href || "/login",
              iconName: slide.cta_primary_icon || "ArrowRight",
            },
            secondary: slide.cta_secondary_label ? {
              label: slide.cta_secondary_label,
              href: slide.cta_secondary_href || "/match-centre",
              iconName: slide.cta_secondary_icon,
            } : undefined,
          },
          alignment: slide.alignment || "left",
        }));
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for hero slides, falling back to mock data:", error);
  }

  return MOCK_SLIDES;
}
