"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Calendar } from "lucide-react";
import Link from "next/link";

const newsItems = [
  {
    id: 1,
    title: "Sables Squad Announced for Africa Cup Defense",
    category: "SABLES",
    date: "10 JULY, 2025",
    image: "/images/news-1.jpg", // Replace with real image
    excerpt: "Head coach Piet Benade has named a strong 35-man squad for the upcoming Africa Cup campaign in Kampala.",
  },
  {
    id: 2,
    title: "Lady Sables secure historic win over Kenya",
    category: "LADY SABLES",
    date: "08 JULY, 2025",
    image: "/images/news-2.jpg",
    excerpt: "A dominant second-half performance saw the Lady Sables cruise to a 32-15 victory at Prince Edward.",
  },
  {
    id: 3,
    title: "Schools Rugby Festival: Day 3 Round-up",
    category: "SCHOOLS",
    date: "05 JULY, 2025",
    image: "/images/news-3.jpg",
    excerpt: "PE Tigers and Falcon College remain unbeaten as the schools festival enters its final day.",
  },
];

export default function NewsMediaBlock() {
  return (
    <section className="bg-rich-black py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Latest News Column */}
          <div className="lg:w-1/2">
             <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl md:text-4xl font-heading text-white">LATEST NEWS</h2>
                <Link href="/news" className="text-zru-orange text-sm font-bold tracking-widest hover:text-white transition-colors flex items-center gap-2">
                    VIEW ALL <ArrowRight className="w-4 h-4" />
                </Link>
             </div>

             <div className="space-y-8">
                {newsItems.map((item, index) => (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex gap-6 cursor-pointer"
                    >
                        {/* Thumbnail */}
                        <div className="w-32 h-32 flex-shrink-0 bg-white/10 rounded-lg overflow-hidden relative">
                             {/* Image Placeholder */}
                             <div className="absolute inset-0 bg-gray-700 group-hover:scale-105 transition-transform duration-500" />
                             <div className="absolute inset-0 flex items-center justify-center text-white/20 font-heading">IMG</div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-zru-gold text-xs font-bold tracking-widest uppercase">{item.category}</span>
                                <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                                <span className="text-gray-400 text-xs font-bold uppercase">{item.date}</span>
                            </div>
                            <h3 className="text-xl font-heading text-white leading-tight mb-2 group-hover:text-zru-orange transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-2">
                                {item.excerpt}
                            </p>
                        </div>
                    </motion.div>
                ))}
             </div>
          </div>

          {/* Featured Video Column */}
          <div className="lg:w-1/2">
             <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl md:text-4xl font-heading text-white">FEATURED MEDIA</h2>
                <Link href="/media" className="text-zru-orange text-sm font-bold tracking-widest hover:text-white transition-colors flex items-center gap-2">
                    MEDIA HUB <ArrowRight className="w-4 h-4" />
                </Link>
             </div>

             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-video bg-white/5 rounded-2xl overflow-hidden group cursor-pointer border border-white/10"
             >
                 {/* Video Thumbnail Placeholder */}
                 <div className="absolute inset-0 bg-gray-800" />
                 
                 {/* Overlay */}
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                 
                 {/* Play Button */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-zru-orange rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                    </div>
                 </div>

                 {/* Video Info */}
                 <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="text-zru-gold text-sm font-bold tracking-widest uppercase mb-2">HIGHLIGHTS</div>
                    <h3 className="text-2xl md:text-3xl font-heading text-white mb-2">
                        SABLES VS NAMIBIA: FULL MATCH HIGHLIGHTS
                    </h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                        <Calendar className="w-4 h-4" />
                        <span>RECENTLY ADDED</span>
                        <span className="mx-2">•</span>
                        <span>10:42 MINS</span>
                    </div>
                 </div>
             </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
