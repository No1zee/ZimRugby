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

export const navConfig: NavItem[] = [
  {
    label: "HOME",
    href: "/",
  },
  {
    label: "NATIONAL TEAMS",
    href: "/teams",
    isMega: true,
    children: [
      { label: "Sables (Men's XV)", href: "/teams/sables" },
      { label: "Lady Sables (Women's XV)", href: "/teams/lady-sables" },
      { label: "Junior Sables (U20)", href: "/teams/junior-sables" },
      { label: "National Sevens", href: "/teams" },
    ],
  },
  {
    label: "DOMESTIC & MATCH CENTRE",
    href: "/match-centre",
    isMega: true,
    children: [
      { label: "Fixtures & Results", href: "/match-centre" },
      { label: "Club Championship", href: "/events?tab=competitions" },
      { label: "Schools Rugby", href: "/schools" },
      { label: "Referees & Laws", href: "/referees" },
      { label: "Book Match Tickets", href: "/tickets" },
      { label: "Live Matches", href: "/live" },
    ],
  },
  {
    label: "WHAT'S ON",
    href: "/events",
    children: [
      { label: "Competitions", href: "/events?tab=competitions" },
      { label: "Federation Events", href: "/events?tab=events" },
      { label: "Gallery", href: "/gallery" },
      { label: "Video Hub", href: "/video-hub" },
    ],
  },
  {
    label: "MEDIA",
    href: "/media",
    children: [
      { label: "Latest News", href: "/media" },
      { label: "Video Hub", href: "/video-hub" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    label: "ABOUT ZRU",
    href: "/about",
    isMega: true,
    children: [
      { label: "History", href: "/about/history" },
      { label: "Board & Governance", href: "/about/governance" },
      { label: "Safeguarding", href: "/about/safeguarding" },
      { label: "Partners", href: "/partners" },
      { label: "Careers", href: "/about/careers" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];
