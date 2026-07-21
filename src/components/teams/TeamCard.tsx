"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TeamCardProps {
  name: string;
  description: string;
  image: string; // Background image path
  color: string; // Tailwind class like 'bg-zru-green'
  href: string;
}

export default function TeamCard({
  name,
  description,
  image,
  color,
  href,
}: TeamCardProps) {
  return (
    <Link href={href} className="block h-full">
      <motion.div
        whileHover={{ y: -6, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.08)" }}
        transition={{ duration: 0.3 }}
        className="group h-full flex flex-col bg-white border border-black/5 rounded-2xl overflow-hidden shadow-xs hover:border-black/10 transition-all duration-300"
      >
        {/* Top Image Section */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gray-100 shrink-0">
          <Image 
            src={image} 
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col justify-between flex-grow relative">
          {/* Brand/Accent Left Bar */}
          <div className={`absolute left-0 top-6 bottom-6 w-1 ${color} rounded-r`} />
          
          <div className="pl-3">
            <h3 className="text-xl sm:text-2xl font-black text-rich-black uppercase tracking-tight mb-3 group-hover:text-zru-green transition-colors duration-300">
              {name}
            </h3>
            
            <p className="text-black/60 text-xs sm:text-sm leading-relaxed mb-6 font-medium line-clamp-3">
              {description}
            </p>
          </div>

          <div className="pl-3 mt-auto">
            <span className="inline-flex items-center gap-2 text-zru-green font-black tracking-widest text-[10px] sm:text-xs uppercase group-hover:text-rich-black transition-colors duration-300">
              <span>View Team</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
