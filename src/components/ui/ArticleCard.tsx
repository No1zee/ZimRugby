import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  href: string;
}

export default function ArticleCard({
  title,
  excerpt,
  image,
  category,
  date,
  href,
}: ArticleCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white border border-black/5 rounded-2xl overflow-hidden hover:shadow-lg transition-[box-shadow] duration-300">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-[filter] duration-700 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute bottom-3 left-3 bg-zru-green text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm">
            {category}
          </span>
        </div>
        <div className="p-5">
          <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{date}</span>
          <h3 className="font-heading text-base font-black uppercase tracking-tight text-rich-black mt-2 mb-2 line-clamp-2 group-hover:text-zru-green transition-colors">
            {title}
          </h3>
          <p className="text-black/60 text-xs leading-relaxed line-clamp-2">{excerpt}</p>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-zru-green mt-4 group-hover:gap-2.5 transition-[gap]">
            Read More <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
