import { Ticket, ShoppingBag } from "lucide-react";

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  isMega?: boolean;
  children?: NavChild[];
}

export interface UtilityNavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  isAction?: boolean;
}

/* ── Main nav: 6 content categories ── */
export const mainNav: NavItem[] = [
  {
    label: "NATIONAL TEAMS",
    href: "/teams",
    isMega: true,
    children: [
      { label: "Sables (Men's XV)", href: "/teams/sables" },
      { label: "Lady Sables (Women's XV)", href: "/teams/lady-sables" },
      { label: "Junior Sables (U20)", href: "/teams/junior-sables" },
      { label: "Cheetahs (Men's 7s)", href: "/teams/cheetahs" },
    ],
  },
  {
    label: "MATCH CENTRE",
    href: "/match-centre",
    children: [
      { label: "Fixtures & Results", href: "/match-centre" },
    ],
  },
  {
    label: "WHAT'S ON",
    href: "/events",
    children: [
      { label: "Upcoming Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    label: "CAMPAIGNS",
    href: "/campaigns",
    children: [
      { label: "Active Campaigns", href: "/campaigns" },
      { label: "Road to Australia 2027", href: "/campaigns/road-to-australia-2027" },
      { label: "Africa Cup Tour", href: "/campaigns/africa-cup-tour-2026" },
    ],
  },
  {
    label: "MEDIA",
    href: "/media",
    children: [
      { label: "Latest News", href: "/media" },
      { label: "Video Hub", href: "/video-hub" },
    ],
  },
  {
    label: "ABOUT ZRU",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Commercial Partners", href: "/partners" },
      { label: "Get Into Rugby", href: "/play-rugby" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

/* ── Utility bar: Tickets (highlighted), Shop ── */
export const utilityNav: UtilityNavItem[] = [
  // Hidden per user request:
  // {
  //   label: "TICKETS",
  //   href: "/tickets",
  //   icon: Ticket,
  // },
  // {
  //   label: "SHOP",
  //   href: "/shop",
  //   icon: ShoppingBag,
  // },
];

/* ── Legacy export for backward compatibility ── */
export const navConfig = mainNav;
