"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface NewsCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  categories?: string[];
  image?: string;
  slug?: string;
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
}: NewsCardProps) {
  const displayCategories = categories && categories.length > 0 ? categories : [category || "ZRU"];

  return (
    <Link href={slug} className="block group">
      <div className="flex flex-col md:flex-row gap-6 group cursor-pointer card-green p-4 md:p-6 rounded-2xl border relative overflow-hidden transition-all duration-300 hover:border-zru-green/40 shadow-lg">
        {image && (
          <div className="w-full md:w-48 h-36 relative rounded-xl overflow-hidden shrink-0 bg-rich-black/40">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 20vw"
              className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {displayCategories.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase bg-zru-green/20 text-emerald-400 border border-zru-green/30"
                >
                  {cat}
                </span>
              ))}
              {date && (
                <>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{date}</span>
                </>
              )}
            </div>
            <h3 className="text-lg md:text-xl font-heading font-black text-white mb-2 group-hover:text-emerald-400 transition-colors leading-tight line-clamp-2">
              {title}
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed mb-4 line-clamp-2">
              {excerpt}
            </p>
          </div>
          <span className="text-white text-xs font-black uppercase tracking-widest group-hover:text-emerald-400 transition-colors flex items-center gap-1.5 self-start">
            Read More <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
