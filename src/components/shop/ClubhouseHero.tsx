"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function ClubhouseHero() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-[#0E0E0E]">
      {/* Background Image & Lighting Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/lady-sables.webp"
          alt="Sables Rugby Clubhouse Flagship"
          fill
          priority
          quality={75}
          className="object-cover object-center grayscale-[0.35] contrast-125 scale-105"
        />
        {/* Stadium Ambient Gradient & Radial Lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/70 to-[#0E0E0E]/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0E]/90 via-transparent to-[#0E0E0E]/90 z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-[#006747]/20 blur-[140px] pointer-events-none mix-blend-screen z-10" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto flex flex-col items-center gap-6 pt-24 pb-16">
        
        {/* Institutional Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#006747]/30 border border-[#006747]/50 backdrop-blur-md"
        >
          <ShieldCheck className="w-4 h-4 text-[#84d7af]" />
          <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#84d7af]">
            OFFICIAL ZIMBABWE RUGBY UNION FLAGSHIP STORE
          </span>
        </motion.div>

        {/* Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter text-white leading-[0.95] drop-shadow-2xl"
          style={{ fontFamily: "var(--font-montserrat, 'Montserrat'), sans-serif" }}
        >
          THE OFFICIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#84d7af] via-[#006747] to-[#84d7af]">SABLES CLUBHOUSE</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl font-medium text-[#bec9c1] max-w-2xl tracking-wide"
        >
          Match-Grade Performance Apparel &amp; Heritage Athletics. Engineered for international battle. Built for Sable pride.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-4 mt-6"
        >
          <a
            href="#drop-section"
            className="clip-slanted bg-[#006747] hover:bg-[#84d7af] text-white hover:text-[#003825] font-extrabold text-xs sm:text-sm uppercase tracking-[0.2em] px-8 py-4 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-2xl shadow-[#006747]/40"
          >
            <span>EXPLORE KITS</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#collections-section"
            className="clip-slanted-sm bg-black/40 hover:bg-white/10 text-[#84d7af] border border-[#006747]/60 backdrop-blur-md font-extrabold text-xs sm:text-sm uppercase tracking-[0.2em] px-8 py-4 transition-all duration-300 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#84d7af]" />
            <span>LIMITED HERITAGE DROP</span>
          </a>
        </motion.div>

        {/* Quick Highlights Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 mt-12 pt-8 border-t border-white/10 w-full max-w-3xl text-left"
        >
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-white italic">100%</span>
            <span className="text-[11px] uppercase tracking-widest text-[#88938c] font-bold">Official Match Spec</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-[#84d7af] italic">PRO-VENT</span>
            <span className="text-[11px] uppercase tracking-widest text-[#88938c] font-bold">Technical Mesh Tech</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-white italic">GLOBAL</span>
            <span className="text-[11px] uppercase tracking-widest text-[#88938c] font-bold">Express Shipping</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-[#84d7af] italic">ZRU 1895</span>
            <span className="text-[11px] uppercase tracking-widest text-[#88938c] font-bold">Legacy Craftsmanship</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
