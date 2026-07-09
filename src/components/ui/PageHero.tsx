"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  tag?: string;
  backgroundImage?: string;
  breadcrumb?: { label: string; href: string }[];
}

export default function PageHero({
  title,
  subtitle,
  tag,
  backgroundImage = "/images/events/africa-cup.jpg",
  breadcrumb,
}: PageHeroProps) {
  return (
    <section className="relative h-[40vh] min-h-[300px] sm:h-[45vh] sm:min-h-[350px] overflow-hidden flex items-end w-full border-b border-white/5 bg-rich-black">
      
      {/* 1. Background Image with Gradients */}
      <div className="absolute inset-0 z-0 select-none">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35 filter brightness-[0.6] contrast-[1.05]"
        />
        {/* Soft radial overlay + linear overlay to feed into rich black */}
        <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 30%, var(--color-rich-black) 90%)" />
        <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/60 to-transparent" />
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
        <div className="space-y-4">
          
          {/* Breadcrumbs */}
          {breadcrumb && (
            <motion.nav 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-subheading font-bold uppercase tracking-widest text-white/50"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-zru-green transition-colors">
                HOME
              </Link>
              {breadcrumb.map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-white/20" />
                  {idx === breadcrumb.length - 1 ? (
                    <span className="text-white/80">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-zru-green transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </motion.nav>
          )}

          {/* Headline details */}
          <div className="space-y-2 border-l-4 border-zru-green pl-4 sm:pl-6">
            {tag && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-zru-green text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] block"
              >
                {tag}
              </motion.span>
            )}
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="text-4xl sm:text-6xl md:text-7xl font-heading font-black uppercase italic tracking-tighter text-white leading-none text-shadow-hero"
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-white/70 font-subheading font-medium text-sm sm:text-base md:text-lg max-w-2xl mt-2 leading-relaxed"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

        </div>
      </div>

    </section>
  );
}
