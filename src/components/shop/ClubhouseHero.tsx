"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ClubhouseHero() {
  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex flex-col">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-clubhouse-charcoal z-10" />
        <div className="absolute inset-0 bg-[url('/images/clubhouse/hero-texture.png')] bg-cover bg-center grayscale scale-110 opacity-40 animate-slow-zoom" />
        
        {/* Abstract Rugby Graphics (Simulated with CSS/Motion) */}
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,77,46,0.15)_0%,transparent_70%)]"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 flex-1 flex flex-col justify-center items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "1.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="block text-xs md:text-sm font-bold uppercase tracking-[0.5em] text-clubhouse-gold mb-6"
          >
            Establishing the New Standard
          </motion.span>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-10 overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              HERITAGE
            </motion.span>
            <motion.span 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-transparent bg-clip-text bg-linear-to-r from-clubhouse-gold via-white/80 to-white/20 block"
            >
              REDEFINED
            </motion.span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="text-sm md:text-lg text-white/60 max-w-xl mx-auto mb-12 font-medium leading-relaxed tracking-wide"
          >
            The 2024 collection blends historic motifs with next-generation fabrics.
            Engineered for the elite. Designed for the legacy.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/clubhouse/kits"
              className="group relative px-10 py-5 bg-white text-clubhouse-charcoal text-xs font-black uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-clubhouse-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center">
                Shop Matchday Kits <ArrowRight className="ml-2 w-4 h-4" />
              </span>
            </Link>
            <Link 
              href="/clubhouse/lifestyle"
              className="px-10 py-5 border border-white/20 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all hover:scale-105"
            >
              Explore Clubhouse
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Benefit Strip */}
      <div className="relative z-20 bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 py-5">
          {[
            "Free Worldwide Shipping",
            "Express Local Delivery",
            "Clubhouse Early Access",
            "Ethically Crafted in Zim"
          ].map((benefit) => (
            <div key={benefit} className="flex justify-center items-center px-4">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 text-center">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
