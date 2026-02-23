"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FloatingParticles, GlowButton } from "../ui/animations";
import Button from "../common/Button";

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
  ctas: {
    primary: { label: string; href: string; icon?: any };
    secondary: { label: string; href: string; icon?: any };
  };
  alignment?: "center" | "left"; // For future flexibility
}

const slides: SlideData[] = [
  {
    id: 1,
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
    id: 2,
    image: "/images/teams/african-champions-2025.jpg", 
    headline: {
      line1: "AFRICAN",
      line2: "CHAMPIONS",
    },
    subtext: "Celebrating the victorious journey of the Zimbabwe Sables.",
    ctas: {
      primary: { label: "Celebrate With Us", href: "/sables", icon: Ticket },
      secondary: { label: "View Gallery", href: "/gallery", icon: ArrowRight },
    },
  },
  {
    id: 3,
    image: "/images/media/vid1.jpg", 
    video: "/images/zim-rugby-slow-mo-2.mp4",
    headline: {
      line1: "A CUT ABOVE",
      line2: "THE COMPETITION",
    },
    subtext: "Join the African Champions on their first world cup campaign since 1991.",
    ctas: {
      primary: { label: "Support the Team", href: "/tickets", icon: Ticket },
      secondary: { label: "Learn More", href: "/about", icon: ArrowRight },
    },
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 10000); // 10 seconds per slide for "marinating"

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const setSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const activeSlide = slides[currentSlide];

  return (
    <section className="relative h-screen bg-rich-black overflow-hidden flex items-center justify-center">
      
      {/* Background & Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 z-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Image/Video Background with Ken Burns Effect */}
          <div className="relative w-full h-full overflow-hidden">
             <div className={`absolute inset-0 bg-rich-black z-10 transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
            <motion.div
                className="relative w-full h-full"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1.0 }}
                transition={{ duration: 10, ease: "linear" }}
            >
                {activeSlide.video ? (
                  <video
                    src={activeSlide.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                    onLoadedData={() => setIsLoaded(true)}
                  />
                ) : (
                  <Image
                    src={activeSlide.image}
                    alt={`${activeSlide.headline.line1} ${activeSlide.headline.line2}`}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                    onLoad={() => setIsLoaded(true)}
                  />
                )}
            </motion.div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/50 to-rich-black z-10" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Particles (Global) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
          <FloatingParticles count={20} />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 h-full flex items-center justify-center pt-[10vh]">
        <div className="text-center w-full max-w-5xl mx-auto">
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { 
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.3,
                                delayChildren: 0.5 
                            }
                        }
                    }}
                >
                    {/* Headline */}
                    <motion.h1 
                        className="font-black text-white uppercase tracking-tight leading-[0.9] mb-8 relative"
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                        }}
                    >
                        {/* Spotlights for Slide 1 mainly, but can apply to all for effect */}
                        <div className="absolute -inset-x-32 -top-64 bottom-0 pointer-events-none z-0 opacity-50">
                            <div className="absolute top-0 left-0 w-0 h-0 border-l-120 border-l-transparent border-r-120 border-r-transparent border-t-400 border-t-zru-green/20 -rotate-12 blur-xl origin-top" />
                            <div className="absolute top-0 right-0 w-0 h-0 border-l-120 border-l-transparent border-r-120 border-r-transparent border-t-400 border-t-zru-green/20 rotate-12 blur-xl origin-top" />
                        </div>

                        <span 
                            className="block relative z-20 text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-2"
                            style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}
                        >
                            {activeSlide.headline.line1}
                        </span>
                        <span 
                            className="block text-white italic relative z-20 text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
                            style={{ 
                                textShadow: '0 0 40px rgba(0, 150, 70, 0.5), 0 4px 20px rgba(0, 0, 0, 0.5)',
                            }}
                        >
                            {activeSlide.headline.line2}
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p 
                        className="text-white/90 text-lg md:text-2xl font-medium mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                        }}
                    >
                    {activeSlide.subtext}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                        }}
                    >
                        <Link href={activeSlide.ctas.primary.href}>
                            <GlowButton 
                            className="bg-zru-green hover:bg-green-800 text-white px-10 py-5 text-base font-bold uppercase tracking-widest flex items-center gap-3 rounded transition-all duration-300 min-w-[220px] justify-center shadow-lg hover:shadow-zru-green/50"
                            glowColor="rgba(0, 96, 57, 0.5)"
                            >
                            {activeSlide.ctas.primary.icon && <activeSlide.ctas.primary.icon className="w-5 h-5" />}
                            {activeSlide.ctas.primary.label}
                            </GlowButton>
                        </Link>
                        
                        <Link href={activeSlide.ctas.secondary.href}>
                            <motion.button 
                            className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-5 text-base font-bold uppercase tracking-widest flex items-center gap-3 rounded hover:bg-white/20 transition-all duration-300 min-w-[220px] justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            >
                            {activeSlide.ctas.secondary.icon && <activeSlide.ctas.secondary.icon className="w-5 h-5" />}
                            {activeSlide.ctas.secondary.label}
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-between px-4 sm:px-8 pointer-events-none">
        <button 
            onClick={prevSlide}
            aria-label="Previous slide"
            className="pointer-events-auto p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/30 group"
        >
            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
            onClick={nextSlide}
            aria-label="Next slide"
            className="pointer-events-auto p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/30 group"
        >
            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        {slides.map((slide, index) => (
            <button
                key={slide.id}
                onClick={() => setSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    currentSlide === index 
                    ? "bg-zru-green w-10 scale-110 shadow-[0_0_10px_rgba(0,100,50,0.8)]" 
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
            />
        ))}
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-rich-black to-transparent pointer-events-none z-10" />

    </section>
  );
}
