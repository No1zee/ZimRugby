import React from "react";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

interface EventCardProps {
  title: string;
  dateRange: string;
  location: string;
  category: string;
  description?: string;
  href?: string;
}

export default function EventCard({
  title,
  dateRange,
  location,
  category,
  description,
  href,
}: EventCardProps) {
  const content = (
    <div className="bg-white border border-black/5 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
      <span className="text-[9px] font-black uppercase tracking-widest text-zru-green bg-zru-green/10 px-3 py-1 rounded-sm inline-block mb-4">
        {category}
      </span>

      <h3 className="font-heading text-lg font-black uppercase tracking-tight text-rich-black mb-3 group-hover:text-zru-green transition-colors">
        {title}
      </h3>

      {description && (
        <p className="text-black/60 text-xs leading-relaxed mb-4 line-clamp-2">{description}</p>
      )}

      <div className="flex items-center gap-4 text-[11px] text-black/50 font-medium">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> {dateRange}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> {location}
        </span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
