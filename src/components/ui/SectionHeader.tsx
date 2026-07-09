"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  tag?: string;
  description?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  tag,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`space-y-3 mb-10 ${className}`}
    >
      {tag && (
        <span className="text-zru-green text-[10px] sm:text-xs font-black uppercase tracking-[0.35em] block">
          {tag}
        </span>
      )}
      
      <div className="border-l-4 border-zru-green pl-4 sm:pl-6 space-y-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black uppercase italic tracking-wide text-white leading-none">
          {title}
        </h2>
        {description && (
          <p className="text-white/60 font-subheading font-medium text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
