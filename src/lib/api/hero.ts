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
      tag: "LADY SABLES",
      contextPill: "RUGBY AFRICA CUP 2026",
      image: "/images/hero/lady-sables.webp",
      headline: {
        line1: "LADY SABLES",
        line2: "RISING",
      },
      subtext: "Zimbabwe's women lead the charge on the continent. The Lady Sables are ready to conquer.",
      ctas: {
        primary: { label: "Lady Sables Match Centre", href: "/match-centre", iconName: "ArrowRight" },
        secondary: { label: "View Squad", href: "/teams/lady-sables", iconName: "ArrowRight" },
      },
    },
    {
      id: 2,
      tag: "UPCOMING MATCH",
      contextPill: "INTERNATIONAL FIXTURE",
      image: "/images/hero/upcoming-match.webp",
      headline: {
        line1: "NEXT STOP",
        line2: "GLORY",
      },
      subtext: "Don't miss the next big international clash. Secure your place in history.",
      ctas: {
        primary: { label: "View Fixtures", href: "/match-centre", iconName: "ArrowRight" },
        secondary: { label: "Get Tickets", href: "/tickets", iconName: "Ticket" },
      },
    },
    {
      id: 3,
      tag: "SABLES",
      contextPill: "INTERNATIONAL RUGBY",
      image: "/images/hero/tonga-vs-zim.webp",
      headline: {
        line1: "TONGA VS",
        line2: "ZIMBABWE",
      },
      subtext: "Relive the drama. Watch the highlights from Zimbabwe's epic clash against Tonga.",
      ctas: {
        primary: { label: "Watch Highlights", href: "/media", iconName: "Play" },
        secondary: { label: "Match Centre", href: "/match-centre", iconName: "ArrowRight" },
      },
    },
    {
      id: 4,
      tag: "U20 JUNIOR SABLES",
      contextPill: "YOUTH DEVELOPMENT",
      image: "/images/hero/zim-u20s.webp",
      headline: {
        line1: "NEXT GEN",
        line2: "RISING",
      },
      subtext: "The future of Zimbabwean rugby is here. The Junior Sables are forging tomorrow's champions today.",
      ctas: {
        primary: { label: "Junior Sables", href: "/teams/junior-sables", iconName: "ArrowRight" },
        secondary: { label: "View Gallery", href: "/media/gallery", iconName: "ArrowRight" },
      },
    },
    {
      id: 5,
      tag: "FAN ZONE",
      contextPill: "JOIN THE PRIDE",
      image: "/images/hero/fan-zone.webp",
      headline: {
        line1: "THE PRIDE",
        line2: "IS ALIVE",
      },
      subtext: "Feel the electric atmosphere. Join thousands of passionate fans as we cheer our Sables to victory.",
      ctas: {
        primary: { label: "Get Tickets", href: "/tickets", iconName: "Ticket" },
        secondary: { label: "Fan Membership", href: "/membership", iconName: "ArrowRight" },
      },
    },
    {
      id: 6,
      tag: "ZIM RUGBY",
      contextPill: "OUR JOURNEY",
      image: "/images/hero/zru-6.webp",
      headline: {
        line1: "BUILT ON",
        line2: "PASSION",
      },
      subtext: "From the grassroots to the global stage — Zimbabwe Rugby's story of resilience and pride.",
      ctas: {
        primary: { label: "Our Story", href: "/about", iconName: "ArrowRight" },
        secondary: { label: "View Gallery", href: "/media/gallery", iconName: "ArrowRight" },
      },
    },
    {
      id: 7,
      tag: "ZIM RUGBY",
      contextPill: "EXCELLENCE",
      image: "/images/hero/zru-7.webp",
      headline: {
        line1: "STRENGTH",
        line2: "UNITED",
      },
      subtext: "Zimbabwe Rugby — one nation, one pride, one unstoppable force.",
      ctas: {
        primary: { label: "Meet the Teams", href: "/teams", iconName: "ArrowRight" },
        secondary: { label: "Sign In", href: "/login", iconName: "ArrowRight" },
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
