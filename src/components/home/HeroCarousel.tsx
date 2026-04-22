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

// Slide Data Interface
interface SlideData {
  id: number;
  image: string;
  video?: string; // Optional video background
  headline: {
    line1: string;
    line2: string;
  };
  subtext: string;
  tag?: string; // e.g. "AFRICAN CHAMPIONS"
  ctas: {
    primary: { label: string; href: string; icon?: LucideIcon };
    secondary: { label: string; href: string; icon?: LucideIcon };
  };
  alignment?: "center" | "left"; // For future flexibility
}

const slides: SlideData[] = [
  {
    id: 1,
    image: "/images/hero/campaign-victoria-falls.png",
    headline: {
      line1: "BATTLE OF",
      line2: "MOSI OA TUNYA",
    },
    subtext: "Experience the pride of Harare and Bulawayo as the Sables clash in the Victoria Falls Domestic Series.",
    ctas: {
      primary: { label: "Book Tickets", href: "https://zru.co.zw/tickets", icon: Ticket },
      secondary: { label: "Match Info", href: "/events", icon: Play },
    },
  },
  {
    id: 2,
    image: "/images/hero/campaign-denver-tour.png",
    headline: {
      line1: "NATIONS",
      line2: "CUP",
    },
    subtext: "The Sables head to Denver at DICK'S Sporting Goods Park for a high-stakes showdown on July 4th.",
    ctas: {
      primary: { label: "Tour Details", href: "https://go.usa.rugby/nations-cup-2026-presale", icon: ArrowRight },
      secondary: { label: "Watch Live", href: "/live", icon: Play },
    },
  },
  {
    id: 3,
    image: "/images/hero/campaign-springboks-match.png",
    headline: {
      line1: "LEGENDS",
      line2: "COLLIDE",
    },
    subtext: "A historic battle in Port Elizabeth as the Sables face the Springboks 'A' on June 20, 2026.",
    ctas: {
      primary: { label: "Get Tickets", href: "https://springboks.tmtickets.co.za/", icon: Ticket },
      secondary: { label: "Sables Squad", href: "/teams/sables", icon: ArrowRight },
    },
  },
  {
    id: 4,
    image: "/images/teams/sables.jpg",
    headline: {
      line1: "THE SABLES",
      line2: "ARE HOME",
    },
    subtext: "Experience the roar of the National Sports Stadium as Zimbabwe defends the Africa Cup title.",
    ctas: {
      primary: { label: "Book Tickets", href: "/tickets", icon: Ticket },
      secondary: { label: "Match Centre", href: "/match-centre", icon: Play },
    },
  },
  {
    id: 5,
    image: "/images/teams/african-champions-2025.jpg", 
    headline: {
      line1: "AFRICAN",
      line2: "CHAMPIONS",
    },
    subtext: "Celebrating the victorious journey of the Zimbabwe Sables as they conquer the continent.",
    ctas: {
      primary: { label: "Celebrate With Us", href: "/sables", icon: Ticket },
      secondary: { label: "View Gallery", href: "/gallery", icon: ArrowRight },
    },
  },
  {
    id: 6,
    tag: "AFRICAN CHAMPIONS",
    image: "/images/media/vid1.jpg", 
    video: "/images/zim-rugby-slow-mo-2.mp4",
    headline: {
      line1: "A CUT ABOVE",
      line2: "THE COMPETITION",
    },
    subtext: "Witness the elite athleticism of Zimbabwe's finest. Precision, power, and the pursuit of excellence.",
    ctas: {
      primary: { label: "Secure Your Seat", href: "/tickets", icon: Ticket },
      secondary: { label: "Watch Highlights", href: "/media", icon: Play },
    },
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Use GSAP for the "Bloom" reveal and text transitions
  useGSAP(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline();
    
    // Initial Focus reveal (using CSS variables for property stability)
    tl.fromTo(".hero-bg-media", 
      { "--hero-brightness": 1.5, scale: 1.05 },
      { "--hero-brightness": 1, scale: 1, duration: 1.5, ease: "power3.out" }
    );

    // Text reveal sequence
    tl.from(".hero-text-item", {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: "power4.out",
    }, "-=1.2");

  }, { scope: containerRef, dependencies: [currentSlide, isLoaded] });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-play functionality
  const nextSlide = () => {
    setIsLoaded(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsLoaded(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 10000); // 10 seconds per slide for "marinating"

    return () => clearInterval(timer);
  }, [currentSlide]);

  const activeSlide = slides[currentSlide];

  return (
    <section ref={containerRef} className="relative h-screen bg-rich-black overflow-hidden flex items-center justify-center cursor-none">
      
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
                    priority
                    sizes="100vw"
                    quality={60}
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
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 h-full flex items-center justify-center pt-[5vh]">
        <div className="text-center w-full max-w-5xl mx-auto">
            
            <AnimatePresence mode="wait">
                <div key={currentSlide}>


                    {/* Headline */}
                    <h1 
                        ref={headlineRef}
                        className="font-black text-white uppercase tracking-tight leading-[0.8] mb-8 relative hero-text-item"
                    >
                        {/* Spotlights */}
                        <div className="absolute -inset-x-32 -top-64 bottom-0 pointer-events-none z-0 opacity-40">
                            <div className="absolute top-0 left-0 w-0 h-0 border-l-120 border-l-transparent border-r-120 border-r-transparent border-t-400 border-t-zru-green/20 -rotate-12 blur-3xl origin-top" />
                            <div className="absolute top-0 right-0 w-0 h-0 border-l-120 border-l-transparent border-r-120 border-r-transparent border-t-400 border-t-zru-green/20 rotate-12 blur-3xl origin-top" />
                        </div>
                        
                        {activeSlide.tag && (
                          <span className="block text-zru-gold text-sm md:text-xl font-black uppercase tracking-[0.4em] mb-4 sm:mb-8">
                             {activeSlide.tag}
                          </span>
                        )}

                        <span 
                            className="block relative z-20 text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] text-glow-heavy"
                        >
                            {activeSlide.headline.line1}
                        </span>
                        <span 
                            className="block text-white italic relative z-20 text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem] -mt-2 sm:-mt-4 lg:-mt-10 text-glow-green"
                        >
                            {activeSlide.headline.line2}
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p 
                        className="text-white/80 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-2xl hero-text-item"
                    >
                    {activeSlide.subtext}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center hero-text-item">
                        <MagneticElement intensity={0.25}>
                           <Link href={activeSlide.ctas.primary.href}>
                              <GlowButton 
                                className="bg-white text-zru-green hover:bg-gray-100 px-12 py-5 text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 rounded-full transition-all duration-500 min-w-[240px] justify-center shadow-2xl cursor-none"
                                glowColor="rgba(255, 255, 255, 0.4)"
                              >
                                {activeSlide.ctas.primary.icon && <activeSlide.ctas.primary.icon className="w-5 h-5" />}
                                {activeSlide.ctas.primary.label}
                              </GlowButton>
                           </Link>
                        </MagneticElement>
                        
                        <MagneticElement intensity={0.25}>
                           <Link href={activeSlide.ctas.secondary.href}>
                              <button 
                                className="bg-white/5 backdrop-blur-xl border border-white/20 text-white px-12 py-5 text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 rounded-full hover:bg-white/10 transition-all duration-500 min-w-[240px] justify-center cursor-none"
                              >
                                {activeSlide.ctas.secondary.icon && <activeSlide.ctas.secondary.icon className="w-5 h-5" />}
                                {activeSlide.ctas.secondary.label}
                              </button>
                           </Link>
                        </MagneticElement>
                    </div>
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
