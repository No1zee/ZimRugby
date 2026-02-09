"use client";

import { motion, Variants } from "framer-motion";
import { ArrowDown, ChevronRight, Play } from "lucide-react";
import Button from "../common/Button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const textRevealVariants: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroSection() {
  const scrollToContent = () => {
    const matchCentre = document.getElementById("match-centre");
    matchCentre?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative h-[calc(100vh-5rem)] w-full overflow-hidden bg-rich-black">
      {/* Video Background (0.0s Fade) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full opacity-60"
          poster="/images/hero-poster.jpg"
        >
          {/* Placeholder video - replace with actual assets */}
            <source src="https://static.videezy.com/system/resources/previews/000/043/553/original/Rugby_Game.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-t from-rich-black via-rich-black/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-rich-black/80 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl"
        >
          {/* 0.3s: ZRU Logo Scale */}
          <motion.div variants={logoVariants} className="mb-6">
             <div className="w-20 h-20 bg-sables-green rounded-full flex items-center justify-center font-heading text-3xl border-4 border-white shadow-2xl">
                ZRU
             </div>
          </motion.div>

          {/* 0.6s: AFRICA CUP CHAMPIONS */}
          <div className="overflow-hidden mb-2">
            <motion.h2 variants={textRevealVariants} className="text-zru-orange font-heading text-2xl md:text-3xl tracking-widest uppercase">
              AFRICA CUP CHAMPIONS 2025
            </motion.h2>
          </div>

          {/* 0.9s: THE ZIMBABWE SABLES */}
          <div className="overflow-hidden mb-8">
            <motion.h1 variants={textRevealVariants} className="text-6xl md:text-8xl lg:text-9xl font-heading text-white leading-[0.9] drop-shadow-2xl uppercase">
              THE ZIMBABWE
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
                SABLES
              </span>
            </motion.h1>
          </div>

          {/* 1.2s: Paragraph */}
          <motion.p variants={itemVariants} className="text-gray-200 text-lg md:text-xl font-body max-w-2xl mb-10 leading-relaxed border-l-4 border-zru-orange pl-6">
            Witness the power, passion, and pride of Zimbabwe Rugby.
            Join us on our journey to the 2027 Rugby World Cup.
          </motion.p>
          
          {/* 1.4s: CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Button size="xl" rightIcon={<ChevronRight className="w-5 h-5" />} className="hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(0,102,51,0.5)]">
              SUPPORT THE SABLES
            </Button>
            <Button
              variant="outline"
              size="xl"
              leftIcon={<Play className="w-5 h-5" />}
              className="border-white text-white hover:bg-white hover:text-rich-black hover:border-white hover:scale-105 transition-transform duration-300"
            >
              WATCH HIGHLIGHTS
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* 1.6s: Scroll Indicator Loop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
            opacity: { delay: 1.6, duration: 1 },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1.6 }
        }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer"
        onClick={scrollToContent}
      >
        <span className="text-white/60 text-xs font-heading tracking-widest mb-2 uppercase">
          Scroll Down
        </span>
        <ArrowDown className="text-zru-orange w-6 h-6" />
      </motion.div>
    </div>
  );
}
