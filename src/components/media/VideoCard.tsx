"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface VideoCardProps {
  id: string | number;
  title: string;
  duration: string;
  date: string;
  thumbnail: string;
  category: string;
}

export default function VideoCard({
  id,
  title,
  duration,
  date,
  thumbnail,
  category,
}: VideoCardProps) {
  return (
    <motion.div
        whileHover={{ y: -5 }}
        className="group cursor-pointer"
    >
        <div className="relative aspect-video bg-white/10 rounded-xl overflow-hidden mb-4 border border-white/10 group-hover:border-zru-orange/50 transition-colors">
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 bg-gray-800">
                {/* <img src={thumbnail} alt={title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" /> */}
                <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900" />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-zru-orange transition-all duration-300 shadow-lg">
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                </div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 bg-zru-gold text-rich-black px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                {category}
            </div>
            <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                {duration}
            </div>
        </div>

        <div className="flex flex-col gap-1">
            <h3 className="text-lg font-heading text-white leading-tight group-hover:text-zru-gold transition-colors line-clamp-2">
                {title}
            </h3>
            <span className="text-gray-500 text-xs font-bold uppercase">{date}</span>
        </div>
    </motion.div>
  );
}
