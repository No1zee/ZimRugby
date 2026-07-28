"use client";

import Link from "next/link";
import { Megaphone, Calendar, ExternalLink } from "lucide-react";

interface Announcement {
  id: string;
  tag: string;
  title: string;
  href: string;
  icon: React.ElementType;
}

const announcements: Announcement[] = [
  {
    id: "rwc-qualifier",
    tag: "Upcoming Match",
    title: "Zimbabwe v Namibia — RWC Qualifier, 15 August 2026",
    href: "/tickets",
    icon: Calendar,
  },
  {
    id: "membership-drive",
    tag: "Announcement",
    title: "Fan Zone membership drive — Join now for priority ticket access",
    href: "/fan-zone",
    icon: Megaphone,
  },
];

export default function PinnedAnnouncements() {
  if (announcements.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="space-y-2">
        {announcements.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 bg-white border border-black/5 rounded-xl px-4 py-3 group hover:border-zru-green/30 transition-[border-color] duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-zru-green/10 flex items-center justify-center text-zru-green shrink-0 group-hover:bg-zru-green/15 transition-[background-color] duration-300">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-zru-green block">
                  {item.tag}
                </span>
                <p className="text-xs font-bold text-rich-black leading-snug truncate">
                  {item.title}
                </p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-black/30 group-hover:text-zru-green transition-[color] duration-300 shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
