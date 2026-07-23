"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function ClubhouseHero() {
  return (
    <section className="relative min-h-[75vh] lg:min-h-[82vh] w-full flex items-center justify-center overflow-hidden bg-milk-white border-b border-black/10">
      {/* Background Hero Banner with Clean Light Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/lady-sables.webp"
          alt="Sables Rugby Clubhouse Flagship"
          fill
          priority
          quality={75}
          className="object-cover object-center grayscale-[0.25] opacity-20"
        />
        {/* Soft Milk-White Gradient Wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-milk-white via-milk-white/90 to-milk-white/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-milk-white via-transparent to-milk-white z-10" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center gap-6 pt-20 pb-16">
        
        {/* Official Union Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zru-green/10 border border-zru-green/30"
        >
          <ShieldCheck className="w-4 h-4 text-zru-green" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-zru-green">
            OFFICIAL ZIMBABWE RUGBY UNION FLAGSHOP
          </span>
        </motion.div>

        {/* Display Headline — Official Unison / Heading Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-heading text-black tracking-tight uppercase italic leading-[0.95]"
        >
          THE OFFICIAL <span className="text-zru-green">SABLES CLUBHOUSE</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="body-large text-black/70 max-w-2xl font-sans"
        >
          Match-grade performance apparel and heritage athletics. Engineered for international battle. Built for Sable pride.
        </motion.p>

        {/* Clean Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-4 mt-4"
        >
          <a
            href="#drop-section"
            className="px-8 py-4 bg-zru-green hover:bg-[#005238] text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-3 shadow-lg shadow-zru-green/20"
          >
            <span>EXPLORE KITS</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#collections-section"
            className="px-8 py-4 bg-black/5 hover:bg-black/10 text-black border border-black/15 font-extrabold text-xs uppercase tracking-[0.2em] rounded-lg transition-all duration-300"
          >
            LIMITED HERITAGE DROP
          </a>
        </motion.div>

        {/* Highlights Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 mt-10 pt-8 border-t border-black/10 w-full max-w-3xl text-left"
        >
          <div>
            <span className="block text-2xl font-heading text-black italic">100%</span>
            <span className="text-[11px] uppercase tracking-widest text-zru-green font-extrabold">Official Match Spec</span>
          </div>
          <div>
            <span className="block text-2xl font-heading text-zru-green italic">PRO-VENT</span>
            <span className="text-[11px] uppercase tracking-widest text-black/60 font-extrabold">Technical Mesh Tech</span>
          </div>
          <div>
            <span className="block text-2xl font-heading text-black italic">GLOBAL</span>
            <span className="text-[11px] uppercase tracking-widest text-zru-green font-extrabold">Express Shipping</span>
          </div>
          <div>
            <span className="block text-2xl font-heading text-zru-green italic">ZRU 1895</span>
            <span className="text-[11px] uppercase tracking-widest text-black/60 font-extrabold">Legacy Craftsmanship</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
