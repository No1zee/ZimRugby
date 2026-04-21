"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "../ui/animations";
import { useState, useEffect } from "react";
import { getLatestReports, type Report } from "@/lib/data-fetcher";

interface NewsMediaBlockProps {
  initialReports?: Report[];
}

export default function NewsMediaBlock({ initialReports = [] }: NewsMediaBlockProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const reports = initialReports;
  const featuredStory = reports[0];
  const mediaItems = reports.slice(1, 4);


  if (!featuredStory) return null;
  return (
    <section className="py-24 relative overflow-hidden">
      
      {/* Background Polish */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(80,80,80,0.1),transparent_70%)]" />

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Header: Institutional Style */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-zru-gold" />
              <span className="text-zru-gold text-[10px] font-black uppercase tracking-[0.5em]">The Wire</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              NEWS & <span className="text-stroke-white text-transparent">MEDIA</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {["All", "Sables", "Lady Sables", "Cheetahs 7s", "Schools"].map((cat) => {
              const isActive = activeCategory === cat;
              return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 border transition-all ${
                  isActive 
                    ? "bg-zru-gold text-black border-zru-gold shadow-[0_0_15px_rgba(235,178,23,0.3)]" 
                    : "bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/50"
                }`}
              >
                {cat}
              </button>
            )})}
          </div>
        </div>

        {/* Featured Story: Cinematic Hero Card */}
        <ScrollReveal>
          <Link href={`/media/${featuredStory.id}`} className="block group mb-12">
            <div className="relative aspect-video md:aspect-21/9 overflow-hidden rounded-4xl bg-neutral-900 shadow-2xl transition-all duration-700 group-hover:-translate-y-2">
              <Image
                src={featuredStory.image}
                alt={featuredStory.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end space-y-6 max-w-3xl">
                <div className="flex items-center gap-4">
                  <span className="bg-clubhouse-gold text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {featuredStory.category}
                  </span>
                  <span className="text-white/60 text-xs font-bold font-mono uppercase">
                    {featuredStory.date}
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] line-clamp-3">
                  {featuredStory.title}
                </h3>
                <p className="text-white/60 text-lg font-medium leading-relaxed line-clamp-2 md:block hidden">
                  {featuredStory.excerpt.split('. ')[0]}.
                </p>
                <div className="pt-6">
                  <span className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white">
                    Read Full Story <ArrowRight className="w-4 h-4 text-clubhouse-gold" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </ScrollReveal>

        {/* secondary Grid: Bulletin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {mediaItems.map((item) => (
            <motion.div key={item.id} className="group cursor-pointer">
              <Link href={`/media/${item.id}`} className="space-y-6 block">
                 <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-900 transition-all duration-700 group-hover:-translate-y-1 glow-green-card">
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-50 group-hover:opacity-100 transition-all duration-700" 
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                            <Play className="w-6 h-6 ml-1" />
                         </div>
                      </div>
                    )}
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-black uppercase tracking-widest text-clubhouse-gold">{item.category}</span>
                       <div className="w-1 h-1 rounded-full bg-white/20" />
                       <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{item.date}</span>
                    </div>
                    <h4 className="text-lg lg:text-xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-clubhouse-gold transition-colors line-clamp-3">
                      {item.title}
                    </h4>
                    <p className="text-white/40 text-xs font-medium line-clamp-2 leading-relaxed">
                      {item.excerpt?.split('. ')[0] || item.excerpt}.
                    </p>
                 </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Archive Action */}
        <div className="mt-24 pt-10 border-t border-white/5 flex justify-center">
          <Link href="/media" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/40 hover:text-white transition-colors">
             Full Media Archives <div className="w-12 h-px bg-current" />
          </Link>
        </div>

      </div>
    </section>
  );
}
