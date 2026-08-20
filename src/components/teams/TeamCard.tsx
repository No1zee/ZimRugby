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
    <Link href={href} prefetch={false} className="block h-full">
      <motion.div
        whileHover={{ y: -6, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.08)" }}
        transition={{ duration: 0.3 }}
        className="group h-full flex flex-col bg-white border border-black/5 rounded-2xl overflow-hidden shadow-xs hover:border-black/10 transition-[border-color,box-shadow] duration-300"
      >
        {/* Top Image Section */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gray-100 shrink-0">
          <Image 
            src={image} 
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:brightness-110 transition-[filter] duration-500"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-rich-black uppercase tracking-tight mb-3 group-hover:text-zru-green transition-colors duration-300">
              {name}
            </h3>
            
            <p className="text-black/60 text-xs sm:text-sm leading-relaxed mb-6 font-normal line-clamp-3">
              {description}
            </p>
          </div>

          <div className="mt-auto">
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
