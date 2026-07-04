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
  ctas: {
    primary: { label: string; href: string; iconName?: "Ticket" | "ArrowRight" | "Play" };
    secondary: { label: string; href: string; iconName?: "Ticket" | "ArrowRight" | "Play" };
  };
  alignment?: "center" | "left";
}

/**
 * CMS_SWAP_TODO: Replace mock implementation with actual REST/GraphQL endpoints once backend is available.
 * Fully compatible with React Native / Mobile platforms for direct cross-platform consumption.
 */
export async function getHeroSlides(): Promise<HeroSlideData[]> {
  return [
    {
      id: 1,
      tag: "SABLES",
      image: "/images/hero/campaign-victoria-falls.png",
      headline: {
        line1: "BATTLE OF",
        line2: "MOSI OA TUNYA",
      },
      subtext: "Experience the pride of Harare and Bulawayo as the Sables clash in the Victoria Falls Domestic Series.",
      ctas: {
        primary: { label: "Book Tickets", href: "/tickets", iconName: "Ticket" },
        secondary: { label: "Match Info", href: "/events", iconName: "Play" },
      },
    },
    {
      id: 2,
      tag: "SABLES",
      image: "/images/hero/campaign-denver-tour.png",
      headline: {
        line1: "NATIONS",
        line2: "CUP",
      },
      subtext: "The Sables head to Denver at DICK'S Sporting Goods Park for a high-stakes showdown on July 4th.",
      ctas: {
        primary: { label: "Tour Details", href: "https://go.usa.rugby/nations-cup-2026-presale", iconName: "ArrowRight" },
        secondary: { label: "Watch Live", href: "/media", iconName: "Play" },
      },
    },
    {
      id: 3,
      tag: "SABLES",
      image: "/images/hero/campaign-springboks-match.png",
      headline: {
        line1: "LEGENDS",
        line2: "COLLIDE",
      },
      subtext: "A historic battle in Port Elizabeth as the Sables face the Springboks 'A' on June 20, 2026.",
      ctas: {
        primary: { label: "Get Tickets", href: "/tickets", iconName: "Ticket" },
        secondary: { label: "Sables Squad", href: "/teams/sables", iconName: "ArrowRight" },
      },
    },
    {
      id: 4,
      tag: "LADY SABLES",
      image: "/images/teams/sables.jpg",
      headline: {
        line1: "THE LADY SABLES",
        line2: "ARE HOME",
      },
      subtext: "Experience the roar of the National Sports Stadium as Zimbabwe defends their title.",
      ctas: {
        primary: { label: "Book Tickets", href: "/tickets", iconName: "Ticket" },
        secondary: { label: "Match Centre", href: "/match-centre", iconName: "Play" },
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
        primary: { label: "Secure Your Seat", href: "/tickets", iconName: "Ticket" },
        secondary: { label: "Watch Highlights", href: "/media", iconName: "Play" },
      },
    },
  ];
}
