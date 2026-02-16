"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TeamCardProps {
  id: string;
  name: string;
  description: string;
  image: string; // Background image path
  color: string; // Tailwind class like 'bg-zru-green'
  href: string;
}

export default function TeamCard({
  id,
  name,
  description,
  image,
  color,
  href,
}: TeamCardProps) {
  return (
    <Link href={href}>
        <motion.div
        whileHover={{ y: -10 }}
        className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
        >
        {/* Background Image Placeholder if no real image */}
        <div className={`absolute inset-0 bg-gray-800 transition-transform duration-700 group-hover:scale-110`}>
             <Image 
                src={image} 
                alt={name}
                fill
                className="object-cover"
             />
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
             {/* Gradient Overlay */}
             <div className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent z-20`} />
        </div>

        <div className="absolute inset-0 z-30 p-8 flex flex-col justify-end">
            <div className={`w-12 h-1 ${color} mb-6 transform origin-left group-hover:scale-x-150 transition-transform duration-500`} />
            
            <h3 className="text-4xl font-heading text-white mb-3 uppercase leading-none">
            {name}
            </h3>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
            {description}
            </p>

            <div className="flex items-center gap-2 text-white font-bold tracking-widest text-xs uppercase">
                <span>View Team</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </div>
        </motion.div>
    </Link>
  );
}
