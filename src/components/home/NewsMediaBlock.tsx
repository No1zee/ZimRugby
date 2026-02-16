"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Newspaper, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal, StaggerContainer, staggerItemVariants, GlowButton, Tilt3DCard } from "../ui/animations";
import { RugbyDecorations, CornerAccent } from "../ui/RugbyDecorations";

const featuredStory = {
  id: 1,
  title: "SABLES SQUAD ANNOUNCED FOR AFRICA CUP DEFENCE",
  excerpt: "Head coach Brendan Dawson names 30-man squad for the upcoming Africa Cup campaign, with several exciting new faces joining the defending champions.",
  date: "08 FEB 2025",
  image: "/images/media/vid3.jpg",
  category: "Sables"
};

const mediaItems = [
  {
    id: 2,
    type: "news",
    title: "LADY SABLES SECURE HISTORIC WIN OVER KENYA",
    excerpt: "A dominant second-half performance seals a memorable victory at Harare Sports Club.",
    date: "06 FEB 2025",
    image: "/images/teams/lady-sables.jpg",
    category: "Lady Sables"
  },
  {
    id: 3,
    type: "video",
    title: "CHEETAHS SEVENS: CAPE TOWN LEG HIGHLIGHTS",
    excerpt: "Watch the best moments from Zimbabwe's impressive run in the SVNS series.",
    date: "04 FEB 2025",
    image: "/images/teams/cheetahs.jpg",
    category: "Cheetahs 7s"
  },
  {
    id: 4,
    type: "news",
    title: "SCHOOLS RUGBY FESTIVAL: DAY 3 ROUND-UP",
    excerpt: "Churchill and Prince Edward set up a thrilling final after semi-final victories.",
    date: "02 FEB 2025",
    image: "/images/events/schools-fest.jpg",
    category: "Schools"
  },
];

const getCategoryColor = (category: string) => {
  return "bg-zru-green text-white";
};

export default function NewsMediaBlock() {
  return (
    <section 
      className="bg-rich-black py-16 lg:py-24 relative overflow-hidden"
      style={{
        backgroundImage: `repeating-linear-gradient(135deg, rgba(80, 80, 80, 0.15) 0px, rgba(80, 80, 80, 0.15) 1px, transparent 1px, transparent 100px)`
      }}
    >
      {/* Rugby-themed decorative elements */}
      <RugbyDecorations variant="goalposts" />
      <CornerAccent position="top-right" />
      <CornerAccent position="bottom-left" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Newspaper className="w-5 h-5 text-white" />
                <span className="text-white text-xs font-bold uppercase tracking-widest">Latest</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase">
                News & Media
              </h2>
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {["All", "Sables", "Lady Sables", "Cheetahs 7s", "Schools"].map((cat) => (
                <motion.button
                  key={cat}
                  className={`
                    px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all
                    ${cat === "All" ? "bg-white text-zru-green" : "bg-white/10 text-white hover:bg-white/20"}
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Featured Story */}
        <ScrollReveal delay={0.1}>
          <Link href={`/media/${featuredStory.id}`} className="block group mb-8">
            <Tilt3DCard tiltAmount={3}>
              <div className="relative bg-zru-green rounded-xl overflow-hidden group-hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row">
                  {/* Image with gradient placeholder */}
                  <div className="lg:w-1/2 h-64 lg:h-80 relative overflow-hidden">
                    <Image
                      src={featuredStory.image}
                      alt={featuredStory.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-zru-green via-zru-green/50 to-transparent z-10" />
                    {/* Abstract rugby shape overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-20 border-4 border-white/10 rounded-full rotate-45" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="lg:w-1/2 p-8 lg:p-10 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`${getCategoryColor(featuredStory.category)} px-3 py-1 text-[10px] font-bold uppercase rounded-full`}>
                        {featuredStory.category}
                      </span>
                      <span className="text-white/60 text-xs font-medium">
                        {featuredStory.date}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-black text-white uppercase leading-tight mb-4 group-hover:text-zru-green transition-colors">
                      {featuredStory.title}
                    </h3>
                    
                    <p className="text-white/80 text-base leading-relaxed mb-6">
                      {featuredStory.excerpt}
                    </p>
                    
                    <span className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-zru-green px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-all group-hover:gap-3">
                      Read Full Story <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Tilt3DCard>
          </Link>
        </ScrollReveal>

        {/* Media Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5" staggerDelay={0.1}>
          {mediaItems.map((item) => (
            <motion.div key={item.id} variants={staggerItemVariants}>
              <Link href={`/media/${item.id}`} className="block group h-full">
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  
                  {/* Image with gradient placeholder */}
                  <div className="h-44 relative overflow-hidden">
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient overlay based on category */}
                    <div className={`absolute inset-0 opacity-60 bg-linear-to-br from-zru-green/50 to-green-900/50`} />
                    
                    {/* Video play button or abstract shape */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {item.type === "video" ? (
                        <div className="w-14 h-14 bg-zru-green rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      ) : (
                        <div className="w-20 h-12 border-2 border-white/20 rounded-full rotate-45" />
                      )}
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`${getCategoryColor(item.category)} px-2 py-1 text-[9px] font-bold uppercase rounded shadow-md`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <h4 className="text-white font-bold text-sm uppercase leading-tight mb-2 group-hover:text-zru-green transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    
                    <p className="text-white/60 text-xs leading-relaxed mb-4 line-clamp-2">
                      {item.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-[10px] font-bold uppercase">{item.date}</span>
                      <span className="bg-white/10 text-white px-3 py-1 text-[10px] font-bold uppercase rounded flex items-center gap-1 group-hover:bg-white group-hover:text-zru-green transition-all">
                        {item.type === "video" ? "Watch" : "Read"} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* Read More Button */}
        <ScrollReveal delay={0.4}>
          <div className="text-center mt-10">
            <Link href="/media">
              <GlowButton 
                className="bg-zru-green hover:bg-green-800 text-white px-8 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mx-auto rounded transition-colors"
                glowColor="rgba(0, 96, 57, 0.4)"
              >
                View All News & Media <ExternalLink className="w-4 h-4" />
              </GlowButton>
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
