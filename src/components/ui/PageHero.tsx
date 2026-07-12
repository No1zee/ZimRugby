"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageHeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  tag?: string;
  breadcrumb?: BreadcrumbItem[];
}

export default function PageHero({
  title,
  subtitle,
  backgroundImage,
  tag,
  breadcrumb,
}: PageHeroProps) {
  return (
    <section className="relative min-h-[40vh] md:min-h-[45vh] flex items-end pt-32 pb-16 overflow-hidden bg-rich-black border-b border-white/5">
      {/* Background Image / Ambient Gradient */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {backgroundImage ? (
          <>
            <Image
              src={backgroundImage}
              alt={title}
              fill
              className="object-cover opacity-20 blur-[1px] grayscale"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/70 to-rich-black" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,107,63,0.12),transparent_60%)]" />
        )}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-15" />
        
        {/* Subtly animated decorative green glow line */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-zru-green/50 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl space-y-6"
        >
          {/* Breadcrumbs and Tag */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
            <Link href="/" className="text-white/40 hover:text-zru-green transition-colors">
              HOME
            </Link>
            {breadcrumb &&
              breadcrumb.map((item, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3 h-3 text-white/20" />
                  {idx === breadcrumb.length - 1 ? (
                    <span className="text-zru-green">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="text-white/40 hover:text-zru-green transition-colors">
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            {tag && (
              <>
                <ChevronRight className="w-3 h-3 text-white/20" />
                <span className="bg-zru-green/15 text-zru-green px-2 py-0.5 rounded-sm border border-zru-green/20">
                  {tag}
                </span>
              </>
            )}
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-white/60 font-body font-medium leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
