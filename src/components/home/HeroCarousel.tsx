"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon, ArrowRight, Play, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FloatingParticles } from "../ui/animations";
import Logo from "../ui/Logo";
import MagneticElement from "../ui/MagneticElement";
import type { HeroSlideData } from "@/lib/api/hero";

const iconMap: Record<string, LucideIcon> = {
  Ticket,
  ArrowRight,
  Play,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1] as const, // Equivalent to power3.out
    },
  },
};

function SlideContent({ slide }: { slide: HeroSlideData }) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={slide.id}
      className="space-y-6 max-w-3xl"
    >
      {/* Left Column / Main Stack */}
      <div className="space-y-6 z-20">
        {/* Headline */}
        <motion.h1 variants={itemVariants} className="font-heading uppercase tracking-widest leading-[0.9] relative">
          {/* Spotlights */}
          <div className="absolute -inset-x-32 -top-64 bottom-0 pointer-events-none z-0 opacity-40">
            <div className="absolute top-0 left-0 w-0 h-0 border-l-120 border-l-transparent border-r-120 border-r-transparent border-t-400 border-t-zru-green/20 -rotate-12 blur-3xl origin-top" />
            <div className="absolute top-0 right-0 w-0 h-0 border-l-120 border-l-transparent border-r-120 border-r-transparent border-t-400 border-t-zru-green/20 rotate-12 blur-3xl origin-top" />
          </div>
          
          <span className="block relative z-20 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-glow-heavy leading-none text-white drop-shadow-2xl">
            {slide.headline.line1}
          </span>
          <span className="block relative z-20 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-glow-green leading-none text-white drop-shadow-2xl">
            {slide.headline.line2}
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p variants={itemVariants} className="text-white/70 text-base md:text-lg font-medium max-w-xl leading-relaxed drop-shadow-2xl font-body">
          {slide.subtext}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-start items-center pt-2">
          <MagneticElement intensity={0.25}>
            <Link href={slide.ctas.primary.href} className="inline-flex items-center justify-center font-heading tracking-wider uppercase transition-all duration-300 bg-white text-rich-black hover:bg-zru-green hover:text-white px-8 py-3 text-lg clip-slanted shadow-2xl min-w-[200px] gap-3">
              {slide.ctas.primary.iconName && iconMap[slide.ctas.primary.iconName] && (() => {
                const Icon = iconMap[slide.ctas.primary.iconName];
                return <Icon className="w-4 h-4" />;
              })()}
              {slide.ctas.primary.label}
            </Link>
          </MagneticElement>
          
          {slide.ctas.secondary && (
            <MagneticElement intensity={0.25}>
              <Link href={slide.ctas.secondary.href} className="inline-flex items-center justify-center font-heading tracking-wider uppercase transition-all duration-300 bg-transparent border-2 border-white/30 text-white hover:bg-white hover:border-white hover:text-rich-black px-8 py-3 text-lg clip-slanted min-w-[200px] gap-3 backdrop-blur-sm">
                {slide.ctas.secondary.iconName && iconMap[slide.ctas.secondary.iconName] && (() => {
                  const Icon = iconMap[slide.ctas.secondary.iconName];
                  return <Icon className="w-4 h-4" />;
                })()}
                {slide.ctas.secondary.label}
              </Link>
            </MagneticElement>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HeroCarousel({ slides }: { slides: HeroSlideData[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-play functionality
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 12000); // 12 seconds per slide (marinating time)

    return () => clearInterval(timer);
  }, [currentSlide, nextSlide]);

  const activeSlide = slides[currentSlide];

  return (
    <section ref={containerRef} className="relative w-full h-[100dvh] bg-rich-black overflow-hidden flex items-center justify-center cursor-none">
      
      {/* Background & Transitions - Mode changed to crossfade for performance and LCP */}
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          className="absolute inset-0 z-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Image/Video Background with GSAP-controlled media */}
            {/* Performance Hint: Removed heavy black overlay that delayed LCP */}
            <div 
              className="relative w-full h-full hero-bg-media will-change-transform filter-[brightness(var(--hero-brightness,1))]"
            >
                {activeSlide.video ? (
                  isMobile ? (
                    /* Mobile Fallback: Animated WebP bypasses all autoplay restrictions */
                    <img
                      src={activeSlide.video.replace('.mp4', '.webp')}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={activeSlide.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      poster={activeSlide.image}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )
                ) : (
                  <Image
                    src={activeSlide.image}
                    alt={`${activeSlide.headline.line1} ${activeSlide.headline.line2}`}
                    fill
                    priority={currentSlide === 0}
                    loading={currentSlide === 0 ? "eager" : "lazy"}
                    sizes="100vw"
                    quality={75}
                    className="object-cover"
                  />
                )}
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-rich-black z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Particles (Global) */}
      <div className="hidden md:block absolute inset-0 z-10 pointer-events-none">
          <FloatingParticles count={15} />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-start pt-24 lg:pt-32 pb-24">
        <div className="text-left w-full mr-auto">
          <SlideContent slide={activeSlide} />
        </div>
      </div>

      {/* Slide Navigation Hints */}
      <div className="absolute bottom-12 left-0 w-full z-30 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end">
          <div className="flex items-center gap-8 pointer-events-auto">
            <button 
              onClick={prevSlide} 
              className="text-white/30 hover:text-white transition-colors cursor-none -ml-2"
              aria-label="Previous Slide"
              title="Previous Slide"
            >
                <ChevronLeft size={32} />
            </button>
            <div className="flex gap-3">
               {slides.map((_, i) => (
                 <div key={i} className={`h-2 transition-all duration-500 clip-slanted-sm ${i === currentSlide ? 'w-16 bg-zru-gold' : 'w-8 bg-white/40 hover:bg-white/60'}`} />
               ))}
            </div>
            <button 
              onClick={nextSlide} 
              className="text-white/30 hover:text-white transition-colors cursor-none"
              aria-label="Next Slide"
              title="Next Slide"
            >
                <ChevronRight size={32} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-linear-to-t from-rich-black via-rich-black/50 to-transparent pointer-events-none z-10" />

      {/* ZRU Crest Overlay */}
      <div className="absolute bottom-8 left-8 z-40 hidden md:flex items-center gap-4 pointer-events-none">
        <Logo variant="white-on-black" alt="ZRU Crest" width={60} height={75} priority clearSpaceRatio={0.08} minHeightPx={56} imageClassName="drop-shadow-2xl opacity-90 w-auto h-16" />
        <div className="flex flex-col">
          <span className="text-white font-display text-lg tracking-widest leading-tight">ZIMBABWE</span>
          <span className="text-zru-gold font-display text-lg tracking-widest leading-tight">RUGBY UNION</span>
        </div>
      </div>

    </section>
  );
}
