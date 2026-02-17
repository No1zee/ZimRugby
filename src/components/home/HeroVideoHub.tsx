"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Ticket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { TextScramble, FloatingParticles, GlowButton } from "../ui/animations";

export default function HeroVideoHub() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [0, 1]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  return (
    <section className="relative h-screen bg-rich-black overflow-hidden flex items-center justify-center">
      
      {/* Video Background with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        {/* Video/Image Background */}
        {/* Video/Image Background with Loading State */}
        <div className="w-full h-full relative">
          {!isLoaded && (
            <div className="absolute inset-0 bg-rich-black animate-pulse z-10" />
          )}
          <Image
            src="/images/teams/sables.jpg"
            alt="The Sables"
            fill
            priority
            className={`object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/50 to-rich-black z-10" />
        </div>
      </motion.div>

      {/* Floating Particles */}
      <FloatingParticles count={20} />

      {/* Main Content - Proper Hierarchy */}
      <motion.div 
        className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center pt-[35vh]"
        style={{ opacity }}
      >

        {/* Main Headline - H1 with Two Diagonal Spotlight Beams */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-black text-white uppercase tracking-tight leading-[0.9] mb-6 relative"
        >
          {/* Two diagonal spotlight beams shining on letters */}
          <motion.div
            className="absolute -inset-x-32 -top-64 bottom-0 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ delay: 0.6, duration: 3, times: [0, 0.1, 0.85, 1] }}
          >
            {/* LEFT SPOTLIGHT - Conical beam from top-left */}
            <motion.div
              className="absolute"
              style={{
                top: '0',
                left: '0',
                width: '0',
                height: '0',
                borderLeft: '120px solid transparent',
                borderRight: '120px solid transparent',
                borderTop: '400px solid rgba(0, 150, 70, 0.2)',
                transform: 'rotate(-20deg)',
                filter: 'blur(15px)',
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            />
            {/* Left beam sharp edge */}
            <motion.div
              className="absolute"
              style={{
                top: '0',
                left: '60px',
                width: '2px',
                height: '350px',
                background: 'linear-gradient(to bottom, rgba(0, 150, 70, 1) 0%, rgba(0, 150, 70, 0.5) 50%, transparent 100%)',
                transform: 'rotate(-20deg)',
                transformOrigin: 'top center',
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
            />
            
            {/* RIGHT SPOTLIGHT - Conical beam from top-right */}
            <motion.div
              className="absolute"
              style={{
                top: '0',
                right: '0',
                width: '0',
                height: '0',
                borderLeft: '120px solid transparent',
                borderRight: '120px solid transparent',
                borderTop: '400px solid rgba(0, 150, 70, 0.2)',
                transform: 'rotate(20deg)',
                filter: 'blur(15px)',
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
            />
            {/* Right beam sharp edge */}
            <motion.div
              className="absolute"
              style={{
                top: '0',
                right: '60px',
                width: '2px',
                height: '350px',
                background: 'linear-gradient(to bottom, rgba(0, 150, 70, 1) 0%, rgba(0, 150, 70, 0.5) 50%, transparent 100%)',
                transform: 'rotate(20deg)',
                transformOrigin: 'top center',
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
            />
          </motion.div>
          
          {/* Text glow effect where spotlights converge */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.7, 0] }}
            transition={{ delay: 0.6, duration: 3, times: [0, 0.25, 0.5, 1] }}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0, 150, 70, 0.5) 0%, transparent 60%)',
            }}
          />
          
          {/* THE SABLES - regular size - Mobile Optimized */}
          <span 
            className="block relative z-20 text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}
          >
            THE SABLES
          </span>
          
          {/* ARE HOME - Mobile Optimized */}
          <span 
            className="block text-white italic relative z-20 text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
            style={{ 
              textShadow: '0 0 40px rgba(0, 150, 70, 0.5), 0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            ARE HOME
          </span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-white/80 text-lg md:text-xl font-medium mb-10 max-w-xl mx-auto"
        >
          Experience the roar of the National Sports Stadium as Zimbabwe defends the Africa Cup title.
        </motion.p>

        {/* CTAs - Primary + Secondary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary CTA */}
          <Link href="/tickets">
            <GlowButton 
              className="bg-zru-green hover:bg-green-800 text-white px-8 py-4 text-sm font-bold uppercase tracking-widest flex items-center gap-3 rounded transition-all duration-300 min-w-[200px] justify-center"
              glowColor="rgba(0, 96, 57, 0.5)"
            >
              <Ticket className="w-5 h-5" />
              Book Tickets
            </GlowButton>
          </Link>
          
          {/* Secondary CTA */}
          <Link href="/match-centre">
            <motion.button 
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 text-sm font-bold uppercase tracking-widest flex items-center gap-3 rounded hover:bg-white/20 transition-all duration-300 min-w-[200px] justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4" />
              Match Centre
            </motion.button>
          </Link>
        </motion.div>

        {/* Next Match Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-12 inline-flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-6 py-3"
        >
          <div className="text-left">
            <div className="text-white/60 text-xs font-bold uppercase tracking-wider">Next Match</div>
            <div className="text-white font-bold">Sables vs Namibia</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-white font-black text-xl">22</div>
            <div className="text-white/60 text-xs font-bold uppercase">MAR</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-right">
            <div className="text-white/60 text-xs font-bold uppercase tracking-wider">Kick Off</div>
            <div className="text-white font-bold">16:00 CAT</div>
          </div>
        </motion.div>

      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-1 bg-white rounded-full"
          />
        </div>
      </motion.div>

      {/* Bottom fade to content */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-rich-black to-transparent pointer-events-none" />

    </section>
  );
}
