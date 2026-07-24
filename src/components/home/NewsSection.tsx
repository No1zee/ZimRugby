"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import SlantedButton from "../ui/SlantedButton";
import Link from "next/link";
import Image from "next/image";

const newsItems = [
  {
    id: 1,
    title: "Sables Aim for Historic Rugby World Cup 2027 Qualification",
    category: "The Sables",
    date: "5 MAY 2025",
    author: "ZRU Media",
    excerpt: "Zimbabwe's national team prepares for crucial match against Namibia as the road to Australia 2027 heats up.",
    image: "/images/media/vid3.jpg",
    isFeatured: true,
  },
  {
    id: 2,
    title: "Lady Sables Announce Squad for Africa Women's Cup",
    category: "Lady Sables",
    date: "3 MAY 2025",
    image: "/images/teams/lady-sables.jpg",
    isFeatured: false,
  },
  {
    id: 3,
    title: "Schools Rugby Festival Dates Confirmed for 2025",
    category: "Schools Rugby",
    date: "1 MAY 2025",
    image: "/images/events/schools-fest.jpg",
    isFeatured: false,
  },
  {
    id: 4,
    title: "ZRU Launches New Development Program in Bulawayo",
    category: "Development",
    date: "28 APR 2025",
    image: "/images/events/africa-cup.jpg",
    isFeatured: false,
  },
];

export default function NewsSection() {
  return (
    <section className="py-20 bg-milk-white relative border-t border-black/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="label block mb-2">LATEST UPDATES</span>
            <h2 className="heading-1 text-black">NEWS &amp; MEDIA</h2>
          </div>
          <SlantedButton variant="outline" size="sm" className="hidden md:flex gap-2">
            VIEW ALL NEWS
            <ArrowRight className="w-5 h-5" />
          </SlantedButton>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Featured Article */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="lg:col-span-2 relative group overflow-hidden rounded-2xl h-[420px] border border-black/10 hover:border-zru-green/50 shadow-md hover:shadow-xl transition-all duration-300 bg-white"
          >
             {/* Background Image Container */}
             <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={newsItems[0].image}
                  alt={newsItems[0].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
             </div>

             <div className="absolute bottom-0 left-0 p-8 w-full z-20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-zru-green text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    {newsItems[0].category}
                  </span>
                  <span className="text-white/70 text-xs font-bold uppercase tracking-wider">
                    {newsItems[0].date}
                  </span>
                </div>
                <h3 className="heading-2 text-white uppercase italic tracking-tight mb-2 line-clamp-2">
                  {newsItems[0].title}
                </h3>
                <p className="text-white/80 text-sm font-sans line-clamp-2 max-w-2xl mb-4">
                  {newsItems[0].excerpt}
                </p>
                <Link
                  href={`/media`}
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-[#84d7af] uppercase tracking-widest hover:text-white transition-colors"
                >
                  <span>READ FULL DISPATCH</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
             </div>
          </motion.div>

          {/* Side Articles */}
          <div className="flex flex-col gap-6 h-full">
            {newsItems.slice(1).map((item) => (
              <motion.div 
                key={item.id} 
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                className="flex gap-4 group cursor-pointer bg-white p-4 rounded-2xl border border-black/10 hover:border-zru-green/50 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-1/3 aspect-video bg-black/5 rounded-xl overflow-hidden relative shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="160px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-zru-green text-[10px] font-extrabold uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-black/30 text-[10px]">&bull;</span>
                        <span className="text-black/50 text-[10px] font-bold uppercase">
                          {item.date}
                        </span>
                     </div>
                     <Link href={`/media`}>
                       <h4 className="heading-3 text-black text-sm hover:text-zru-green transition-colors leading-snug line-clamp-2">
                         {item.title}
                       </h4>
                     </Link>
                   </div>
                   <div className="mt-2">
                     <span className="text-[11px] font-extrabold text-zru-green group-hover:text-black flex items-center gap-1 transition-colors uppercase tracking-wider">
                       Read Story <ChevronRight className="w-3 h-3" />
                     </span>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
