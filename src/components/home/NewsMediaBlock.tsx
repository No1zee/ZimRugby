"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { type Report } from "@/lib/data-fetcher";

import { BentoCard } from "../ui/BentoGrid";
import SlantedButton from "../ui/SlantedButton";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "../ui/animations";

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
    <section className="py-24 relative overflow-hidden bg-transparent border-y border-black/5 skew-y-1 origin-top-left">

      <div className="max-w-[1440px] mx-auto px-6 relative z-10 -skew-y-1">
        
        {/* Header */}
        <ScrollReveal className="flex flex-col md:flex-row justify-between items-end gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-black/20" />
              <span className="text-rich-black/60 text-[10px] font-black uppercase tracking-[0.5em]">The Wire</span>
            </div>
            <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-rich-black">
              NEWS & <span className="text-stroke-black text-transparent">MEDIA</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {["All", "Sables", "Lady Sables", "Cheetahs 7s", "Schools"].map((cat) => {
              const isActive = activeCategory === cat;
              return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] font-black uppercase tracking-widest px-6 py-2 border transition-colors clip-slanted-sm cursor-pointer ${
                  isActive 
                    ? "bg-zru-green text-white border-zru-green" 
                    : "bg-transparent text-rich-black/50 border-black/20 hover:text-zru-green hover:border-zru-green hover:bg-black/5"
                }`}
              >
                {cat}
              </button>
            )})}
          </div>
        </ScrollReveal>

        {/* Editorial Grid */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8" staggerDelay={0.08}>
          
          {/* Left Column: Featured Hero Card (1/3 width, tall height) */}
          <motion.div variants={staggerItemVariants} className="lg:col-span-1">
             <Link href={`/media/${featuredStory.id}`} className="block h-full group">
                <div className="h-[524px] relative overflow-hidden card-dark border border-black/8 hover:border-zru-green/30 transition-all duration-300 p-0 rounded-2xl">
                  <Image
                    src={featuredStory.image}
                    alt={featuredStory.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
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
                    <h3 className="font-heading text-3xl md:text-4xl tracking-wide text-white line-clamp-3 leading-tight">
                      {featuredStory.title}
                    </h3>
                    <p className="font-body text-white/70 line-clamp-2 text-sm">
                      {featuredStory.excerpt.split('. ')[0]}.
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-3 text-xs font-heading tracking-widest uppercase text-white group-hover:text-zru-green transition-colors">
                        Read Full Story <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>
             </Link>
          </motion.div>

          {/* Right Column: 2-Column Grid (2/3 width, contains 3 secondary cards of equal height) */}
          <motion.div variants={staggerItemVariants} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
             {item1 && (
               <Link href={`/media/${item1.id}`} className="col-span-1 block group">
                 <div className="h-[250px] relative overflow-hidden card-dark border border-black/8 hover:border-zru-green/30 transition-all duration-300 p-0 rounded-2xl">
                    <Image 
                       src={item1.image} 
                       alt={item1.title} 
                       fill
                       sizes="(max-width: 768px) 100vw, 30vw"
                       className="object-cover opacity-60 group-hover:opacity-85 transition-all duration-700 group-hover:scale-105" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                     <div className="absolute inset-0 p-6 flex flex-col justify-end space-y-3">
                       <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black uppercase tracking-widest text-zru-green">{item1.category}</span>
                           <div className="w-1 h-1 bg-white/40" />
                           <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{item1.date}</span>
                       </div>
                       <h4 className="font-heading text-xl md:text-2xl tracking-wide text-white group-hover:text-zru-green transition-colors line-clamp-2 leading-tight">
                         {item1.title}
                       </h4>
                     </div>
                 </div>
               </Link>
             )}
             
             {item2 && (
               <Link href={`/media/${item2.id}`} className="col-span-1 block group">
                 <div className="h-[250px] relative overflow-hidden card-dark border border-black/8 hover:border-zru-green/30 transition-all duration-300 p-0 rounded-2xl">
                    <Image 
                       src={item2.image} 
                       alt={item2.title} 
                       fill
                       sizes="(max-width: 768px) 100vw, 30vw"
                       className="object-cover opacity-60 group-hover:opacity-85 transition-all duration-700 group-hover:scale-105" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                     <div className="absolute inset-0 p-6 flex flex-col justify-end space-y-3">
                       <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black uppercase tracking-widest text-zru-green">{item2.category}</span>
                           <div className="w-1 h-1 bg-white/40" />
                           <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{item2.date}</span>
                       </div>
                       <h4 className="font-heading text-xl md:text-2xl tracking-wide text-white group-hover:text-zru-green transition-colors line-clamp-2 leading-tight">
                         {item2.title}
                       </h4>
                     </div>
                 </div>
               </Link>
             )}

             {item3 && (
               <Link href={`/media/${item3.id}`} className="col-span-1 md:col-span-2 block group">
                 <div className="h-[250px] relative overflow-hidden card-dark border border-black/8 hover:border-zru-green/30 transition-all duration-300 p-0 rounded-2xl">
                    <Image 
                       src={item3.image} 
                       alt={item3.title} 
                       fill
                       sizes="(max-width: 768px) 100vw, 60vw"
                       className="object-cover opacity-60 group-hover:opacity-85 transition-all duration-700 group-hover:scale-105" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                     <div className="absolute inset-0 p-6 flex flex-col justify-end space-y-3">
                       <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black uppercase tracking-widest text-zru-green">{item3.category}</span>
                           <div className="w-1 h-1 bg-white/40" />
                           <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{item3.date}</span>
                       </div>
                       <h4 className="font-heading text-xl md:text-2xl tracking-wide text-white group-hover:text-zru-green transition-colors line-clamp-2 leading-tight">
                         {item3.title}
                       </h4>
                     </div>
                 </div>
               </Link>
             )}
          </motion.div>

        </StaggerContainer>

        {/* Archive Action */}
        <div className="mt-16 flex justify-center">
          <SlantedButton href="/media" variant="secondary" size="md">
             Full Media Archives
          </SlantedButton>
        </div>

      </div>
    </section>
  );
}
