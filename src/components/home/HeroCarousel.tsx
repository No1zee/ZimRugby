"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { LucideIcon, ArrowRight, Play, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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

function SlideContent({ 
  slide,
  slides,
  currentSlide,
  prevSlide,
  nextSlide,
  setCurrentSlide
}: { 
  slide: HeroSlideData;
  slides: HeroSlideData[];
  currentSlide: number;
  prevSlide: () => void;
  nextSlide: () => void;
  setCurrentSlide: (i: number) => void;
}) {
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
      className="space-y-6 max-w-3xl lg:max-w-4xl"
    >
      {/* Left Column / Main Stack */}
      <div className="space-y-6 z-20">
        
        {/* Text content — hidden for graphic slides that have their own designed text */}
        {!slide.graphicSlide && (
          <>
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
                  className="block relative z-20 text-4xl sm:text-5xl md:text-[56px] tracking-tight leading-[0.95] text-glow-heavy text-white drop-shadow-2xl font-heading font-black"
                >
                  {slide.headline.line1}
                </motion.span>
              </div>
              <div className="overflow-hidden block py-0.5">
                <motion.span 
                  variants={lineVariants}
                  className="block relative z-20 text-4xl sm:text-5xl md:text-[56px] tracking-tight leading-[0.95] text-accent-teal drop-shadow-2xl font-heading font-black"
                >
                  {slide.headline.line2}
                </motion.span>
              </div>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={itemVariants} className="text-white/60 text-sm sm:text-[15px] font-normal max-w-lg leading-relaxed drop-shadow-2xl font-body">
              {slide.subtext}
            </motion.p>
          </>
        )}

        {/* CTAs & Directly Attached Navigation Indicators */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row gap-3 justify-start items-center">
            {/* Primary CTA: Sign In */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            >
              <MagneticElement intensity={0.25}>
                <span className="relative inline-flex group">
                  <span aria-hidden className="absolute inset-0 clip-slanted bg-[#003D20] translate-x-[5px] translate-y-[5px] transition-transform duration-200 group-hover:translate-x-[7px] group-hover:translate-y-[7px] group-active:translate-x-[3px] group-active:translate-y-[3px]" />
                  <Link href={slide.ctas.primary.href} className="relative z-10 inline-flex items-center justify-center font-subheading tracking-widest uppercase transition-colors duration-300 bg-white text-rich-black hover:bg-zru-green hover:text-white border border-white hover:border-zru-green px-8 py-3.5 text-xs font-black clip-slanted shadow-[0_2px_4px_rgba(0,0,0,0.15)] min-w-[200px] gap-3">
                    {slide.ctas.primary.iconName && iconMap[slide.ctas.primary.iconName] && (() => {
                      const Icon = iconMap[slide.ctas.primary.iconName];
                      return <Icon className="w-4.5 h-4.5" />;
                    })()}
                    {slide.ctas.primary.label}
                  </Link>
                </span>
              </MagneticElement>
            </motion.div>
            
            {slide.ctas.secondary && (
              <motion.div variants={itemVariants}>
                <MagneticElement intensity={0.25}>
                  <Link href={slide.ctas.secondary.href} className="inline-flex items-center justify-center font-subheading tracking-widest uppercase transition-colors duration-300 bg-transparent border-2 border-white/20 text-white hover:bg-white hover:border-white hover:text-rich-black px-8 py-3.5 text-xs font-black clip-slanted min-w-[200px] gap-3 backdrop-blur-xs">
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

          {/* Slide Navigation Controls attached directly beneath CTA buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button 
              onClick={prevSlide} 
              className="text-white/40 hover:text-white transition-colors p-1 -ml-1"
              aria-label="Previous Slide"
              title="Previous Slide"
            >
                <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2.5">
               {slides.map((_, i) => {
                 const isActive = i === currentSlide;
                 return (
                   <button
                     key={i}
                     onClick={() => setCurrentSlide(i)}
                      className={`h-1.5 transition-[width,background-color] duration-500 clip-slanted-sm relative overflow-hidden ${
                       isActive ? 'w-12 bg-white/20' : 'w-6 bg-white/40 hover:bg-white/60'
                     }`}
                     aria-label={`Go to slide ${i + 1}`}
                     title={`Go to slide ${i + 1}`}
                   >
                     <span className="sr-only">Go to slide {i + 1}</span>
                     {isActive && (
                       <motion.div
                         key={currentSlide}
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
              className="text-white/40 hover:text-white transition-colors p-1"
              aria-label="Next Slide"
              title="Next Slide"
            >
                <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroCarousel({ slides = [] }: { slides: HeroSlideData[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => { prefersReducedMotion.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Scroll Parallax Hooks — disabled on mobile to avoid RAF scroll listener overhead
  const { scrollYProgress } = useScroll({
    target: (mounted && !isMobile) ? containerRef : undefined,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Auto-play functionality
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (prefersReducedMotion.current || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 12000);

    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  if (!slides || slides.length === 0) return null;

  const activeSlide = slides[currentSlide];
  const nextSlideData = slides[(currentSlide + 1) % slides.length];

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] bg-rich-black overflow-hidden flex items-center justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Hidden preloader for next slide image */}
      {nextSlideData && !nextSlideData.video && (
        <div className="hidden">
          <Image src={nextSlideData.image} alt="preload" fill priority sizes="100vw" quality={60} />
        </div>
      )}
      
      {/* Background & Transitions - Mode changed to crossfade for performance and LCP */}
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          className="absolute inset-0 z-0 w-full h-full"
          initial={{ opacity: currentSlide === 0 ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Image/Video Background with GSAP-controlled media */}
            {/* Performance Hint: Removed heavy black overlay that delayed LCP */}
            <motion.div 
              initial={{ scale: 1 }}
              animate={{ scale: isMobile ? 1 : 1.04 }} // Static scale on mobile to save GPU cycles
              transition={{ duration: 12, ease: "linear" }}
              style={isMobile ? undefined : { y: yBg, opacity: opacityBg }} // Disable scroll listener parallax on mobile
              className="relative w-full h-full hero-bg-media will-change-transform filter-[brightness(var(--hero-brightness,1))]"
            >
                {activeSlide.video ? (
                  isMobile ? (
                    /* Mobile Fallback: Animated WebP bypasses all autoplay restrictions */
                    <Image
                      src={activeSlide.video.replace('.mp4', '.webp')}
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={activeSlide.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
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
                    sizes="(max-width: 768px) 100vw, 100vw"
                    quality={60}
                    className="object-cover"
                    style={{ objectPosition: activeSlide.imagePosition ?? 'center center' }}
                  />
                )}
            </motion.div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-rich-black/90 via-rich-black/30 to-black/30 z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <motion.div style={{ y: yText, opacity: opacityText }} className="relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end justify-start pb-24 lg:pb-32">
        <div className="text-left w-full mr-auto">
          <SlideContent 
            slide={activeSlide} 
            slides={slides}
            currentSlide={currentSlide}
            prevSlide={prevSlide}
            nextSlide={nextSlide}
            setCurrentSlide={setCurrentSlide}
          />
        </div>
      </motion.div>



      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-linear-to-t from-rich-black via-rich-black/50 to-transparent pointer-events-none z-10" />


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
