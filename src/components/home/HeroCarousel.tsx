"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon, ArrowRight, Play, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FloatingParticles, GlowButton } from "../ui/animations";
import MagneticElement from "../ui/MagneticElement";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { HeroSlideData } from "@/lib/api/hero";

const iconMap: Record<string, LucideIcon> = {
  Ticket,
  ArrowRight,
  Play,
};

function SlideContent({ slide }: { slide: HeroSlideData }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".hero-text-item", {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: "power4.out",
    });
  }, { scope: containerRef, dependencies: [slide] });

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Headline */}
      <h1 className="font-black text-white uppercase tracking-tight leading-[0.8] relative hero-text-item">
        {/* Spotlights */}
        <div className="absolute -inset-x-32 -top-64 bottom-0 pointer-events-none z-0 opacity-40">
          <div className="absolute top-0 left-0 w-0 h-0 border-l-120 border-l-transparent border-r-120 border-r-transparent border-t-400 border-t-zru-green/20 -rotate-12 blur-3xl origin-top" />
          <div className="absolute top-0 right-0 w-0 h-0 border-l-120 border-l-transparent border-r-120 border-r-transparent border-t-400 border-t-zru-green/20 rotate-12 blur-3xl origin-top" />
        </div>
        
        {slide.tag && (
          <span className="block text-zru-gold text-sm md:text-xl font-black uppercase tracking-[0.4em] mb-4 sm:mb-8">
            {slide.tag}
          </span>
        )}

        <span className="block relative z-20 text-5xl sm:text-7xl md:text-8xl lg:text-[4rem] xl:text-[5.5rem] 2xl:text-[8rem] text-glow-heavy leading-none">
          {slide.headline.line1}
        </span>
        <span className="block text-white italic relative z-20 text-6xl sm:text-8xl md:text-[8rem] lg:text-[4.5rem] xl:text-[6rem] 2xl:text-[9rem] -mt-2 sm:-mt-4 lg:-mt-6 xl:-mt-8 2xl:-mt-10 text-glow-green leading-none">
          {slide.headline.line2}
        </span>
      </h1>

      {/* Subtext */}
      <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl leading-relaxed drop-shadow-2xl hero-text-item">
        {slide.subtext}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-6 justify-start items-center hero-text-item">
        <MagneticElement intensity={0.25}>
          <Link href={slide.ctas.primary.href}>
            <GlowButton 
              className="bg-white text-zru-green hover:bg-gray-100 px-12 py-5 text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 rounded-full transition-all duration-500 min-w-[240px] justify-center shadow-2xl cursor-none"
              glowColor="rgba(255, 255, 255, 0.4)"
            >
              {slide.ctas.primary.iconName && iconMap[slide.ctas.primary.iconName] && (() => {
                const Icon = iconMap[slide.ctas.primary.iconName];
                return <Icon className="w-5 h-5" />;
              })()}
              {slide.ctas.primary.label}
            </GlowButton>
          </Link>
        </MagneticElement>
        
        {slide.ctas.secondary && (
          <MagneticElement intensity={0.25}>
            <Link href={slide.ctas.secondary.href}>
              <button 
                className="bg-white/5 backdrop-blur-xl border border-white/20 text-white px-12 py-5 text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 rounded-full hover:bg-white/10 transition-all duration-500 min-w-[240px] justify-center cursor-none"
              >
                {slide.ctas.secondary.iconName && iconMap[slide.ctas.secondary.iconName] && (() => {
                  const Icon = iconMap[slide.ctas.secondary.iconName];
                  return <Icon className="w-5 h-5" />;
                })()}
                {slide.ctas.secondary.label}
              </button>
            </Link>
          </MagneticElement>
        )}
      </div>
    </div>
  );
}

export default function HeroCarousel({ slides }: { slides: HeroSlideData[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-play functionality
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    setIsLoaded(false);
    const animTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    return () => clearTimeout(animTimer);
  }, [currentSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 10000); // 10 seconds per slide for "marinating"

    return () => clearInterval(timer);
  }, [currentSlide]);

  const activeSlide = slides[currentSlide];

  return (
    <section ref={containerRef} className="relative w-full h-[100svh] md:h-[85vh] md:min-h-[600px] md:max-h-[1000px] bg-rich-black overflow-hidden flex items-center justify-center cursor-none">
      
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
                      onLoad={() => setIsLoaded(true)}
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
                      onLoadedData={() => setIsLoaded(true)}
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
                    onLoad={() => setIsLoaded(true)}
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
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-start pt-24 lg:pt-32">
        <div className="text-left w-full max-w-5xl mr-auto">
          <AnimatePresence mode="wait">
            <div key={currentSlide}>
              <SlideContent slide={activeSlide} />
            </div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Navigation Hints */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-8">
          <button 
            onClick={prevSlide} 
            className="text-white/30 hover:text-white transition-colors cursor-none"
            aria-label="Previous Slide"
            title="Previous Slide"
          >
              <ChevronLeft size={32} />
          </button>
          <div className="flex gap-3">
             {slides.map((_, i) => (
               <div key={i} className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-16 bg-zru-gold' : 'w-6 bg-white/40'}`} />
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

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-linear-to-t from-rich-black via-rich-black/50 to-transparent pointer-events-none z-10" />

    </section>
  );
}
