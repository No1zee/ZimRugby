import Link from "next/link";
import { Megaphone, Calendar, ExternalLink } from "lucide-react";

export interface AnnouncementItem {
  id: string;
  tag: string;
  title: string;
  href: string;
  iconType: "calendar" | "megaphone";
}

interface Props {
  items?: AnnouncementItem[];
}

const ICON_MAP = { calendar: Calendar, megaphone: Megaphone } as const;

const FALLBACK_ITEMS: AnnouncementItem[] = [
  { id: "rwc-qualifier", tag: "Upcoming Match", title: "Zimbabwe v Namibia — RWC Qualifier, 15 August 2026", href: "/tickets", iconType: "calendar" },
  { id: "membership-drive", tag: "Announcement", title: "Fan Zone membership drive — Join now for priority ticket access", href: "/fan-zone", iconType: "megaphone" },
];

export default function PinnedAnnouncements({ items }: Props) {
  const active = items && items.length > 0 ? items : FALLBACK_ITEMS;

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="space-y-2">
        {active.map((item) => {
          const Icon = ICON_MAP[item.iconType];
          return (
            <Link
              key={item.id}
              href={item.href}
              className="block p-[1px] bg-black/5 hover:bg-zru-green/30 transition-[background-color] duration-300 clip-slanted-sm group"
            >
              <div className="flex items-center gap-3 bg-white pl-6 pr-5 py-3 clip-slanted-sm w-full">
                <div className="w-8 h-8 clip-slanted-sm bg-zru-green/10 flex items-center justify-center text-zru-green shrink-0 group-hover:bg-zru-green/15 transition-[background-color] duration-300">
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
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
