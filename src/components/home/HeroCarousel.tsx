"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { LucideIcon, ArrowRight, Play, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FloatingParticles } from "../ui/animations";
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
      ease: [0.25, 1, 0.5, 1] as const, // Upgraded cubic-bezier ease for whip and settle
    },
  },
};

const lineVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
};

function SlideContent({ slide }: { slide: HeroSlideData }) {
  const tag = slide.tag?.toUpperCase() || "";
  let spotlightColor = "border-t-zru-green/25";
  if (tag.includes("LADY")) {
    spotlightColor = "border-t-white/20";
  } else if (tag.includes("CHEETAHS")) {
    spotlightColor = "border-t-zru-green/20";
  } else if (tag.includes("JUNIOR") || tag.includes("U20") || tag.includes("DOMESTIC")) {
    spotlightColor = "border-t-zru-green/25";
  }

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
        
        {/* ZRU Bible Team Tags / Context pills */}
        {(slide.tag || slide.contextPill) && (
          <motion.div variants={itemVariants} className="flex items-center gap-3 flex-wrap">
            {slide.tag && (
              <span className="bg-zru-green/20 text-zru-green border border-zru-green/30 px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase rounded-sm backdrop-blur-xs">
                {slide.tag}
              </span>
            )}
            {slide.contextPill && (
              <span className="text-white/40 text-[10px] font-bold tracking-[0.15em] uppercase">
                {slide.contextPill}
              </span>
            )}
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="font-heading uppercase tracking-wider leading-[1.1] relative">
          {/* Spotlights */}
          <motion.div 
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute -inset-x-32 -top-64 bottom-0 pointer-events-none z-0"
          >
            <div className={`absolute top-0 left-0 w-0 h-0 border-l-[120px] border-l-transparent border-r-[120px] border-r-transparent border-t-[400px] ${spotlightColor} -rotate-12 blur-3xl origin-top`} />
            <div className={`absolute top-0 right-0 w-0 h-0 border-l-[120px] border-l-transparent border-r-[120px] border-r-transparent border-t-[400px] ${spotlightColor} rotate-12 blur-3xl origin-top`} />
          </motion.div>
          
          <div className="overflow-hidden block py-0.5">
            <motion.span 
              variants={lineVariants}
              className="block relative z-20 text-3xl sm:text-4xl md:text-[44px] tracking-wide leading-[1.1] text-glow-heavy text-white drop-shadow-2xl font-heading font-black"
            >
              {slide.headline.line1}
            </motion.span>
          </div>
          <div className="overflow-hidden block py-0.5">
            <motion.span 
              variants={lineVariants}
              className="block relative z-20 text-3xl sm:text-4xl md:text-[44px] tracking-wide leading-[1.1] text-glow-green text-white drop-shadow-2xl font-heading font-black"
            >
              {slide.headline.line2}
            </motion.span>
          </div>
        </motion.h1>

        {/* Subtext */}
        <motion.p variants={itemVariants} className="text-white/60 text-sm sm:text-base font-normal max-w-md leading-relaxed drop-shadow-2xl font-body">
          {slide.subtext}
        </motion.p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-start items-center pt-2">
          {/* Primary CTA: Sign In (delayed animation so it loads last) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          >
            <MagneticElement intensity={0.25}>
              <Link href={slide.ctas.primary.href} className="inline-flex items-center justify-center font-subheading tracking-widest uppercase transition-all duration-300 bg-white text-rich-black hover:bg-zru-green hover:text-white border border-white hover:border-zru-green px-8 py-3.5 text-xs font-black clip-slanted shadow-2xl min-w-[200px] gap-3">
                {slide.ctas.primary.iconName && iconMap[slide.ctas.primary.iconName] && (() => {
                  const Icon = iconMap[slide.ctas.primary.iconName];
                  return <Icon className="w-4.5 h-4.5" />;
                })()}
                {slide.ctas.primary.label}
              </Link>
            </MagneticElement>
          </motion.div>
          
          {slide.ctas.secondary && (
            <motion.div variants={itemVariants}>
              <MagneticElement intensity={0.25}>
                <Link href={slide.ctas.secondary.href} className="inline-flex items-center justify-center font-subheading tracking-widest uppercase transition-all duration-300 bg-transparent border-2 border-white/20 text-white hover:bg-white hover:border-white hover:text-rich-black px-8 py-3.5 text-xs font-black clip-slanted min-w-[200px] gap-3 backdrop-blur-xs">
                  {slide.ctas.secondary.iconName && iconMap[slide.ctas.secondary.iconName] && (() => {
                    const Icon = iconMap[slide.ctas.secondary.iconName];
                    return <Icon className="w-4.5 h-4.5" />;
                  })()}
                  {slide.ctas.secondary.label}
                </Link>
              </MagneticElement>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroCarousel({ slides }: { slides: HeroSlideData[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Scroll Parallax Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

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
    <section ref={containerRef} className="relative w-full h-[100dvh] bg-rich-black overflow-hidden flex items-center justify-center">
      
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
            <motion.div 
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }} // Upgraded from 1.06 to 1.08 for more dramatic Ken Burns
              transition={{ duration: 12, ease: "linear" }}
              style={{ y: yBg, opacity: opacityBg }} // Apply scroll parallax
              className="relative w-full h-full hero-bg-media will-change-transform filter-[brightness(var(--hero-brightness,1))]"
            >
                {activeSlide.video ? (
                  isMobile ? (
                    /* Mobile Fallback: Animated WebP bypasses all autoplay restrictions */
                    // eslint-disable-next-line @next/next/no-img-element -- animated WebP mobile fallback for background video
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
                    sizes="(max-width: 768px) 100vw, 100vw"
                    quality={75}
                    className="object-cover"
                  />
                )}
            </motion.div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-rich-black z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Particles (Global) */}
      <div className="hidden md:block absolute inset-0 z-10 pointer-events-none">
          <FloatingParticles count={15} />
      </div>

      {/* Content Layer */}
      <motion.div style={{ y: yText, opacity: opacityText }} className="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-start pt-24 lg:pt-32 pb-24">
        <div className="text-left w-full mr-auto">
          <SlideContent slide={activeSlide} />
        </div>
      </motion.div>

      {/* Slide Navigation Hints */}
      <div className="absolute bottom-12 left-0 w-full z-30 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end">
          <div className="flex items-center gap-8 pointer-events-auto">
            <button 
              onClick={prevSlide} 
              className="text-white/30 hover:text-white transition-colors -ml-2"
              aria-label="Previous Slide"
              title="Previous Slide"
            >
                <ChevronLeft size={32} />
            </button>
            <div className="flex gap-3">
               {slides.map((_, i) => {
                 const isActive = i === currentSlide;
                 return (
                   <button
                     key={i}
                     onClick={() => setCurrentSlide(i)}
                     className={`h-2 transition-all duration-500 clip-slanted-sm relative overflow-hidden ${
                       isActive ? 'w-16 bg-white/20' : 'w-8 bg-white/40 hover:bg-white/60'
                     }`}
                     aria-label={`Go to slide ${i + 1}`}
                     title={`Go to slide ${i + 1}`}
                   >
                     <span className="sr-only">Go to slide {i + 1}</span>
                     {isActive && (
                       <motion.div
                         key={currentSlide} // Resets the animation when slide changes
                         initial={{ width: "0%" }}
                         animate={{ width: "100%" }}
                         transition={{ duration: 12, ease: "linear" }}
                         className="absolute inset-0 bg-zru-green"
                       />
                     )}
                   </button>
                 );
               })}
            </div>
            <button 
              onClick={nextSlide} 
              className="text-white/30 hover:text-white transition-colors"
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
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG crest; next/image does not optimize SVGs */}
        <img src="/zru logo main.svg" alt="ZRU Crest" className="drop-shadow-2xl opacity-90 object-contain w-auto h-16" />
        <div className="flex flex-col">
          <span className="text-white font-heading text-lg tracking-widest leading-tight">ZIMBABWE</span>
          <span className="text-zru-green font-heading text-lg tracking-widest leading-tight">RUGBY UNION</span>
        </div>
      </div>

      {/* Decorative Slanted Brand Frames (Angle-Cut Overlays) */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.2 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 right-0 w-[30vw] h-full pointer-events-none z-10 overflow-hidden hidden lg:block"
      >
        <div className="absolute top-[-50%] right-[-10%] w-[150px] h-[200%] bg-zru-green rotate-[24deg] blur-md transform origin-center" />
        <div className="absolute top-[-50%] right-[calc(-10%+170px)] w-[8px] h-[200%] bg-white/10 rotate-[24deg] transform origin-center" />
      </motion.div>
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.15 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute bottom-0 left-0 w-[20vw] h-[30vh] pointer-events-none z-10 overflow-hidden hidden lg:block"
      >
        <div className="absolute bottom-[-10%] left-[-5%] w-[80px] h-[200%] bg-zru-green rotate-[24deg] transform origin-center" />
        <div className="absolute bottom-[-10%] left-[calc(-5%+100px)] w-[4px] h-[200%] bg-white/10 rotate-[24deg] transform origin-center" />
      </motion.div>

    </section>
  );
}
