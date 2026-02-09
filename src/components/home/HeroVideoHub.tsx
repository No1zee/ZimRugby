"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import Button from "../common/Button";
import { useRef } from "react";

export default function HeroVideoHub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-rich-black">
      {/* Background Video/Image with Parallax */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-transparent z-20" />
        
        {/* Placeholder for Video - In a real app, use <video> tag here */}
        <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/hero-bg.jpg')" }} // Ensure this image exists or use a color fallback
        >
            <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center text-white/10 font-heading text-9xl">
                VIDEO PLACEHOLDER
            </div>
        </div>
      </motion.div>

      {/* Content Overlay */}
      <div className="relative z-30 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="w-12 h-1 bg-zru-green"></span>
            <span className="text-zru-green font-bold tracking-[0.2em] uppercase text-sm md:text-base">
              Africa Cup Champions 2025
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading text-white leading-[0.9] mb-6">
            ZIMBABWE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              RUGBY UNION
            </span>
          </h1>

          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-10 font-body leading-relaxed border-l-4 border-zru-gold pl-6">
            The Sables are rising. Experience the pride, passion, and power of Zimbabwean rugby as we march towards the World Cup.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" className="bg-zru-orange hover:bg-orange-600 border-none text-lg px-8 py-4">
              VIEW MATCH CENTRE
            </Button>
            <Button variant="outline" rightIcon={<Play className="w-5 h-5" />} className="text-lg px-8 py-4">
              WATCH HIGHLIGHTS
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-xs font-bold tracking-widest uppercase">Scroll</span>
        <motion.div
           animate={{ y: [0, 8, 0] }}
           transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
            <ChevronDown className="w-6 h-6 text-zru-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
