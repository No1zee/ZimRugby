"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, ChevronRight, Share2 } from "lucide-react";
import Button from "../common/Button";
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
    <section className="py-20 bg-rich-black relative border-t border-white/10 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/events/africa-cup.jpg" 
          alt="Background" 
          fill 
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-b from-rich-black via-rich-black/90 to-rich-black" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-white font-heading text-xl tracking-widest mb-2">
              LATEST UPDATES
            </h2>
            <h3 className="text-4xl md:text-5xl font-heading text-white">
              NEWS & MEDIA
            </h3>
          </div>
          <Button variant="ghost" rightIcon={<ArrowRight className="w-5 h-5" />} className="hidden md:flex">
            VIEW ALL NEWS
          </Button>
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
            className="lg:col-span-2 relative group overflow-hidden rounded-2xl h-[500px]"
          >
             {/* Background Image Placeholder */}
             <div className="absolute inset-0 bg-gray-800 overflow-hidden">
                <motion.div 
                   className="w-full h-full bg-linear-to-br from-green-900 to-black opacity-80" 
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 0.7 }}
                />
             </div>
             <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

             <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <div className="flex gap-3 mb-4">
                  <span className="bg-zru-green text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                    {newsItems[0].category}
                  </span>
                  <span className="text-gray-300 text-xs font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {newsItems[0].date}
                  </span>
                </div>
                <Link href={`/news/${newsItems[0].id}`}>
                  <h3 className="text-3xl md:text-4xl font-heading text-white mb-4 hover:text-zru-green transition-colors duration-300 leading-tight">
                    {newsItems[0].title}
                  </h3>
                </Link>
                <p className="text-gray-300 font-body text-base md:text-lg mb-6 max-w-2xl line-clamp-2">
                  {newsItems[0].excerpt}
                </p>
                <div className="flex items-center gap-4">
                   <Button variant="primary" rightIcon={<ChevronRight className="w-4 h-4" />}>
                     READ FULL STORY
                   </Button>
                   <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
                     <Share2 className="w-5 h-5" />
                   </button>
                </div>
             </div>
          </motion.div>

          {/* Side Articles */}
          <div className="flex flex-col gap-8 h-full">
            {newsItems.slice(1).map((item) => (
              <motion.div 
                key={item.id} 
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                className="flex gap-4 group cursor-pointer h-full"
              >
                <div className="w-1/3 h-full min-h-[120px] bg-gray-800 rounded-xl overflow-hidden relative">
                    <motion.div 
                       className="absolute inset-0 bg-linear-to-br from-gray-700 to-gray-900" 
                       whileHover={{ scale: 1.1 }}
                       transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                   <div className="flex gap-2 mb-2">
                      <span className="text-zru-green text-[10px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-gray-500 text-[10px]">&bull;</span>
                      <span className="text-gray-500 text-[10px] font-bold">
                        {item.date}
                      </span>
                   </div>
                   <Link href={`/news/${item.id}`}>
                     <h4 className="font-heading text-xl text-white hover:text-zru-green transition-colors leading-tight mb-2 line-clamp-2">
                       {item.title}
                     </h4>
                   </Link>
                   <div className="mt-auto">
                     <span className="text-xs font-bold text-gray-400 group-hover:text-white flex items-center gap-1 transition-colors">
                       Read More <ChevronRight className="w-3 h-3" />
                     </span>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="mt-12 md:hidden flex justify-center">
            <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
                VIEW ALL NEWS
            </Button>
        </div>
      </div>
    </section>
  );
}
