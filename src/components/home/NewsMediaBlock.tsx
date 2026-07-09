"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { type Report } from "@/lib/data-fetcher";

import { BentoGrid, BentoCard } from "../ui/BentoGrid";
import SlantedButton from "../ui/SlantedButton";

interface NewsMediaBlockProps {
  initialReports?: Report[];
}

export default function NewsMediaBlock({ initialReports = [] }: NewsMediaBlockProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const reports = initialReports;
  const featuredStory = reports[0];
  const item1 = reports[1];
  const item2 = reports[2];
  const item3 = reports[3];

  if (!featuredStory) return null;
  return (
    <section className="py-section relative overflow-hidden">
      
      {/* Background Polish */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(80,80,80,0.1),transparent_70%)]" />

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-white/40" />
              <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.5em]">The Wire</span>
            </div>
            <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-white">
              NEWS & <span className="text-stroke-charcoal text-transparent">MEDIA</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {["All", "Sables", "Lady Sables", "Cheetahs 7s", "Schools"].map((cat) => {
              const isActive = activeCategory === cat;
              return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] font-black uppercase tracking-widest px-6 py-2 border transition-colors clip-slanted-sm ${
                  isActive 
                    ? "bg-zru-green text-white border-zru-green" 
                    : "bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/50"
                }`}
              >
                {cat}
              </button>
            )})}
          </div>
        </div>

        {/* Bento Grid */}
        <BentoGrid className="grid-cols-1 md:grid-cols-4 grid-rows-[auto_auto] gap-4 md:gap-6">
          
          {/* Featured Story - 2 cols, 2 rows */}
          <Link href={`/media/${featuredStory.id}`} className="col-span-1 md:col-span-2 md:row-span-2 block group">
            <BentoCard className="h-full min-h-[400px] md:min-h-full relative overflow-hidden rounded-2xl p-0 border-0">
              <Image
                src={featuredStory.image}
                alt={featuredStory.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-4">
                <div className="flex items-center gap-4">
                  <span className="bg-zru-green text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest clip-slanted-sm">
                    {featuredStory.category}
                  </span>
                  <span className="text-white/80 text-xs font-bold uppercase tracking-widest">
                    {featuredStory.date}
                  </span>
                </div>
                <h3 className="font-heading text-3xl md:text-5xl tracking-wide text-white line-clamp-3">
                  {featuredStory.title}
                </h3>
                <p className="font-body text-white/70 line-clamp-2">
                  {featuredStory.excerpt.split('. ')[0]}.
                </p>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-3 text-xs font-heading tracking-widest uppercase text-white group-hover:text-zru-green transition-colors">
                    Read Full Story <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </BentoCard>
          </Link>

          {/* Item 1 - 2 cols, 1 row */}
          {item1 && (
            <Link href={`/media/${item1.id}`} className="col-span-1 md:col-span-2 md:row-span-1 block group">
              <BentoCard className="h-full min-h-[250px] relative overflow-hidden rounded-2xl p-0 border-0">
                 <Image 
                    src={item1.image} 
                    alt={item1.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-40 group-hover:opacity-80 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zru-green">{item1.category}</span>
                        <div className="w-1 h-1 bg-white/40" />
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{item1.date}</span>
                    </div>
                    <h4 className="font-heading text-2xl md:text-3xl tracking-wide text-white group-hover:text-zru-green transition-colors line-clamp-2">
                      {item1.title}
                    </h4>
                  </div>
              </BentoCard>
            </Link>
          )}

          {/* Item 2 - 1 col, 1 row */}
          {item2 && (
            <Link href={`/media/${item2.id}`} className="col-span-1 md:col-span-1 md:row-span-1 block group">
              <BentoCard className="h-full min-h-[250px] p-6 justify-end space-y-4 hover:border-zru-green/50">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zru-green">{item2.category}</span>
                </div>
                <h4 className="font-heading text-xl tracking-wide text-white group-hover:text-zru-green transition-colors line-clamp-3">
                  {item2.title}
                </h4>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item2.date}</span>
              </BentoCard>
            </Link>
          )}

          {/* Item 3 - 1 col, 1 row */}
          {item3 && (
            <Link href={`/media/${item3.id}`} className="col-span-1 md:col-span-1 md:row-span-1 block group">
              <BentoCard className="h-full min-h-[250px] p-6 justify-end space-y-4 hover:border-zru-green/50">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zru-green">{item3.category}</span>
                </div>
                <h4 className="font-heading text-xl tracking-wide text-white group-hover:text-zru-green transition-colors line-clamp-3">
                  {item3.title}
                </h4>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item3.date}</span>
              </BentoCard>
            </Link>
          )}

        </BentoGrid>

        {/* Archive Action */}
        <div className="mt-16 flex justify-center">
          <SlantedButton href="/media" variant="outline" size="sm">
             Full Media Archives
          </SlantedButton>
        </div>

      </div>
    </section>
  );
}
