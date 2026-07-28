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
    label: "DOMESTIC RUGBY",
    href: "/match-centre",
    isMega: true,
    children: [
      { label: "Fixtures & Results", href: "/match-centre" },
      { label: "Live Matches", href: "/live" },
      { label: "Club Championship", href: "/events?tab=competitions" },
      { label: "Schools Rugby", href: "/schools" },
      { label: "Referees & Laws", href: "/referees" },
    ],
  },
  {
    label: "EVENTS",
    href: "/events",
    children: [
      { label: "Upcoming Events", href: "/events" },
      { label: "Book Tickets", href: "/tickets" },
      { label: "Gallery", href: "/gallery" },
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
