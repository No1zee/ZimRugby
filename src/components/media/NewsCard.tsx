"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface NewsCardProps {
  id: string | number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
  slug?: string;
}

export default function NewsCard({
  id,
  title,
  excerpt,
  date,
  category,
  image,
  slug = "#",
}: NewsCardProps) {
  return (
    <Link href={slug}>
        <motion.div 
            whileHover={{ x: 5 }}
            className="flex flex-col md:flex-row gap-6 group cursor-pointer border-b border-white/5 pb-8 last:border-0"
        >
            {image && (
                <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden shrink-0">
                    <Image 
                        src={image} 
                        alt={title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                </div>
            )}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-zru-green text-xs font-bold tracking-widest uppercase">{category}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span className="text-gray-500 text-xs font-bold uppercase">{date}</span>
                </div>
                <h3 className="text-xl font-heading text-white mb-3 group-hover:text-zru-green transition-colors leading-tight">
                    {title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {excerpt}
                </p>
                <span className="text-white text-xs font-bold uppercase tracking-widest group-hover:text-zru-green transition-colors flex items-center gap-2">
                    Read More <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </span>
            </div>
        </motion.div>
    </Link>
  );
}
