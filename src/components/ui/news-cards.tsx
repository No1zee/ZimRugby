"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowUpRight, Tag } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  category: "SABLES" | "JUNIOR SABLES" | "CHEETAHS 7S" | "LADY SABLES" | "DEVELOPMENT";
  date: string;
  excerpt: string;
  image: string;
  slug: string;
  featured?: boolean;
}

const newsData: NewsItem[] = [
  {
    id: "news-1",
    title: "SABLES PREPARE FOR NATIONS CUP CLASH AGAINST NAMIBIA",
    category: "SABLES",
    date: "15 MAY 2026",
    excerpt: "Head Coach Piet Benade names a formidable 28-man squad as the Sables target a decisive victory in the opening fixture.",
    image: "/images/teams/sables.jpg",
    slug: "sables-prepare-for-nations-cup",
    featured: true,
  },
  {
    id: "news-2",
    title: "JUNIOR SABLES U20 SQUAD ANNOUNCED FOR WORLD RUGBY TROPHY",
    category: "JUNIOR SABLES",
    date: "14 MAY 2026",
    excerpt: "Young talent shines through as 30 players are selected to represent Zimbabwe on the global stage.",
    image: "/images/teams/junior-sables.jpg",
    slug: "junior-sables-squad-announced",
  },
  {
    id: "news-3",
    title: "ZIMBABWE 7S CHEETAHS GEARING UP FOR AFRICA CUP",
    category: "CHEETAHS 7S",
    date: "12 MAY 2026",
    excerpt: "High-intensity conditioning camp underway in Harare ahead of the Sevens World Series qualifiers.",
    image: "/images/teams/cheetahs.jpg",
    slug: "cheetahs-gearing-up-africa-cup",
  },
  {
    id: "news-4",
    title: "LADY SABLES LAUNCH HIGH-PERFORMANCE WOMEN'S RUGBY CAMP",
    category: "LADY SABLES",
    date: "10 MAY 2026",
    excerpt: "Expanding the women's game with dedicated elite training facilities and regional talent search camps.",
    image: "/images/teams/lady-sables.jpg",
    slug: "lady-sables-training-camp",
  },
  {
    id: "news-5",
    title: "ZRU & NEDBANK EXTEND LANDMARK GRASSROOTS RUGBY PARTNERSHIP",
    category: "DEVELOPMENT",
    date: "08 MAY 2026",
    excerpt: "Multi-year investment commitment to expand school rugby tournaments and referee certification programs.",
    image: "/images/schools/schoolboy-team-group.jpg",
    slug: "zru-nedbank-partnership-extension",
  },
  {
    id: "news-6",
    title: "NATIONAL STADIUM PITCH UPGRADE COMPLETED AHEAD OF INTERNATIONALS",
    category: "SABLES",
    date: "05 MAY 2026",
    excerpt: "State-of-the-art turf drainage and stadium seating enhancements ready for home test matches.",
    image: "/images/media/heritage-1991.jpg",
    slug: "stadium-pitch-upgrade-completed",
  },
];

interface NewsCardsProps {
  enableAnimations?: boolean;
}

export function NewsCards({ enableAnimations = true }: NewsCardsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", "SABLES", "JUNIOR SABLES", "CHEETAHS 7S", "LADY SABLES", "DEVELOPMENT"];

  const filteredNews = selectedCategory === "ALL"
    ? newsData
    : newsData.filter((item) => item.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="w-full space-y-8">
      
      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 whitespace-nowrap border ${
                isActive
                  ? "bg-gradient-to-b from-[#00704D] to-[#005238] text-white border-[#006747] shadow-lg shadow-[#006747]/30 scale-105"
                  : "bg-black/40 text-white/70 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of Animated News Cards */}
      <motion.div
        variants={enableAnimations ? containerVariants : undefined}
        initial={enableAnimations ? "hidden" : undefined}
        animate={enableAnimations ? "visible" : undefined}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredNews.map((item) => (
            <motion.div
              key={item.id}
              layout={enableAnimations}
              variants={enableAnimations ? cardVariants : undefined}
              initial={enableAnimations ? { opacity: 0, scale: 0.95 } : undefined}
              animate={enableAnimations ? { opacity: 1, scale: 1 } : undefined}
              exit={enableAnimations ? { opacity: 0, scale: 0.95 } : undefined}
              whileHover={enableAnimations ? { y: -6 } : undefined}
              className="group flex flex-col bg-gradient-to-b from-[#0A1812] via-[#06120D] to-[#030B07] rounded-2xl overflow-hidden border border-white/10 hover:border-[#006747]/60 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Card Image Wrapper */}
              <div className="relative w-full h-48 sm:h-52 overflow-hidden shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1812] via-transparent to-transparent opacity-80" />
                
                {/* Category Pill */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-[#006747]/90 text-white rounded-lg text-[10px] font-black tracking-widest uppercase border border-white/20 backdrop-blur-md shadow-md">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/50 text-[11px] font-bold">
                    <Calendar className="w-3.5 h-3.5 text-[#006747]" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-lg font-heading font-black text-white group-hover:text-[#006747] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-white/70 font-normal leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>

                {/* Read Story Link */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/media/${item.slug}`}
                    className="text-xs font-black tracking-widest text-[#006747] group-hover:text-white uppercase flex items-center gap-1.5 transition-colors"
                  >
                    <span>READ STORY</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
