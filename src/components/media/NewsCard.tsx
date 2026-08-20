"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface NewsCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  categories?: string[];
  image?: string;
  slug?: string;
  variant?: "grid" | "featured" | "compact";
  source?: "website" | "social";
}

export default function NewsCard({
  title,
  excerpt,
  date,
  category,
  categories,
  image,
  slug = "#",
  variant = "grid",
}: NewsCardProps) {
  const displayCategories = categories && categories.length > 0 ? categories : [category || "ZRU"];

  if (variant === "compact") {
    return (
      <Link href={slug} className="block group">
        <div className="flex items-center justify-between gap-4 py-3 border-b border-black/10 dark:border-white/10 hover:border-zru-green transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2 py-0.5 rounded-none text-[9px] font-black tracking-widest uppercase bg-zru-green/10 text-zru-green border border-zru-green/30 shrink-0">
              {displayCategories[0]}
            </span>
            <h4 className="text-sm font-heading font-black uppercase tracking-tight text-rich-black dark:text-white truncate group-hover:text-zru-green transition-colors">
              {title}
            </h4>
          </div>
          <span className="text-xs font-mono text-black/40 dark:text-white/40 shrink-0 uppercase">
            {date}
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={slug} className="block group">
        <div className="flex flex-col lg:flex-row gap-6 bg-white dark:bg-rich-black p-6 sm:p-8 rounded-3xl border border-black/10 dark:border-white/10 relative overflow-hidden transition-all duration-300 hover:border-zru-green/50 shadow-md">
          {image && (
            <div className="w-full lg:w-96 h-56 sm:h-64 relative rounded-2xl overflow-hidden shrink-0 bg-black/10">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {displayCategories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-none text-[10px] font-black tracking-widest uppercase bg-zru-green/15 text-zru-green border border-zru-green/30"
                  >
                    {cat}
                  </span>
                ))}
                {date && (
                  <span className="text-black/50 dark:text-white/50 text-xs font-mono font-bold uppercase tracking-wider ml-1">
                    {date}
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-rich-black dark:text-white mb-3 group-hover:text-zru-green transition-colors leading-tight">
                {title}
              </h3>
              <p className="text-black/70 dark:text-white/70 text-sm leading-relaxed line-clamp-3">
                {excerpt}
              </p>
            </div>
            <span className="text-zru-green text-xs font-black uppercase tracking-widest flex items-center gap-2 mt-6">
              Read Full Article <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default Grid Variant
  return (
    <Link href={slug} className="block group h-full">
      <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-zru-green/50 shadow-sm hover:shadow-md">
        {image && (
          <div className="relative aspect-video w-full overflow-hidden bg-black/5 shrink-0">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 bg-zru-green text-white px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-none shadow-sm">
              {displayCategories[0]}
            </span>
          </div>
        )}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <span className="text-[10px] font-mono font-bold text-black/40 dark:text-white/40 uppercase tracking-widest block mb-2">
              {date}
            </span>
            <h3 className="font-heading text-lg font-black uppercase tracking-tight text-rich-black dark:text-white line-clamp-2 group-hover:text-zru-green transition-colors mb-2">
              {title}
            </h3>
            <p className="text-black/60 dark:text-white/60 text-xs leading-relaxed line-clamp-2">
              {excerpt}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-zru-green mt-4 group-hover:gap-2.5 transition-[gap]">
            Read More <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
