"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  tag?: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function SectionHeader({
  title,
  tag,
  description,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`space-y-3 mb-10 flex flex-col ${alignClasses[align]} ${className}`}
    >
      {tag && (
        <span className="text-zru-green text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] block">
          {tag}
        </span>
      )}
      
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black uppercase tracking-tight text-white leading-[1.1]">
          {title}
        </h2>
        {description && (
          <p className="text-white/60 font-subheading font-normal text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
