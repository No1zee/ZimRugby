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

export async function getHeroSlides(): Promise<HeroSlideData[]> {
  const mockSlides: HeroSlideData[] = [
    {
      id: 1,
      tag: "LADY SABLES",
      contextPill: "RUGBY AFRICA CUP 2026 – HOME LEG",
      image: "/images/teams/sables.jpg",
      headline: {
        line1: "LADY SABLES",
        line2: "ARE HOME",
      },
      subtext: "National Sports Stadium - Harare",
      matchCard: {
        opponent: "UGANDA",
        opponentSub: "LADY CRANES",
        date: "14 MAY",
        time: "15:00",
        venue: "National Sports Stadium",
        tag: "UPCOMING FIXTURE"
      },
      ctas: {
        primary: { label: "Lady Sables Match Centre", href: "/match-centre", iconName: "ArrowRight" },
        secondary: { label: "Sign In", href: "/login", iconName: "ArrowRight" },
      },
    },
    {
      id: 2,
      tag: "SABLES",
      contextPill: "VICTORIA FALLS DOMESTIC SERIES",
      image: "/images/hero/campaign-victoria-falls.png",
      headline: {
        line1: "BATTLE OF",
        line2: "THE ZAMBEZI",
      },
      subtext: "Experience the pride of Harare and Bulawayo as the Sables clash in the Victoria Falls Domestic Series.",
      ctas: {
        primary: { label: "Match Info", href: "/events", iconName: "ArrowRight" },
        secondary: { label: "Sign In", href: "/login", iconName: "Play" },
      },
    },
    {
      id: 3,
      tag: "DOMESTIC RUGBY",
      contextPill: "PREMIER DIVISION",
      image: "/images/hero/campaign-denver-tour.png",
      headline: {
        line1: "SUPER SIX",
        line2: "RUGBY LEAGUE",
      },
      subtext: "The 2026 season kicks off this weekend. Witness the fiercest domestic rivalries unfold.",
      ctas: {
        primary: { label: "League Table", href: "/teams/sables", iconName: "ArrowRight" },
        secondary: { label: "Watch Live", href: "/media", iconName: "Play" },
      },
    },
    {
      id: 4,
      tag: "SABLES",
      contextPill: "SUMMER TEST SERIES",
      image: "/images/hero/campaign-springboks-match.png",
      headline: {
        line1: "LEGENDS",
        line2: "COLLIDE",
      },
      subtext: "A historic battle in Port Elizabeth as the Sables face the Springboks 'A' on June 20, 2026.",
      matchCard: {
        opponent: "SPRINGBOKS 'A'",
        opponentSub: "HOSTS",
        date: "20 JUN",
        time: "17:00",
        venue: "Nelson Mandela Bay Stadium",
        tag: "UPCOMING FIXTURE"
      },
      ctas: {
        primary: { label: "Sables Squad", href: "/teams/sables", iconName: "ArrowRight" },
        secondary: { label: "Sign In", href: "/login", iconName: "ArrowRight" },
      },
    },
    {
      id: 5,
      tag: "U20 JUNIOR SABLES",
      image: "/images/teams/african-champions-2025.jpg", 
      headline: {
        line1: "AFRICAN",
        line2: "CHAMPIONS",
      },
      subtext: "Celebrating the victorious journey of the Junior Sables as they conquer the continent.",
      ctas: {
        primary: { label: "Celebrate With Us", href: "/teams/junior-sables", iconName: "Ticket" },
        secondary: { label: "View Gallery", href: "/media/gallery", iconName: "ArrowRight" },
      },
    },
    {
      id: 6,
      tag: "CHEETAHS",
      image: "/images/media/vid1.jpg", 
      video: "/images/zim-rugby-slow-mo-2.mp4",
      headline: {
        line1: "A CUT ABOVE",
        line2: "THE COMPETITION",
      },
      subtext: "Witness the elite athleticism of Zimbabwe's 7s finest. Precision, power, and the pursuit of excellence.",
      ctas: {
        primary: { label: "Watch Highlights", href: "/media", iconName: "Play" },
        secondary: { label: "Sign In", href: "/login", iconName: "ArrowRight" },
      },
    },
  ];

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

  return mockSlides;
}
