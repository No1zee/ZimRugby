'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Calendar, Trophy, ChevronLeft, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react'
import SlantedButton from '../ui/SlantedButton'

export interface HeroSlideData {
  id: string | number
  badge?: string
  headline: string | { line1?: string; line2?: string }
  subheadline?: string
  ctaPrimary?: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
  image?: string
  videoUrl?: string
}

interface HeroCarouselProps {
  slides?: HeroSlideData[]
  autoplayInterval?: number
}

const DEFAULT_SLIDES: HeroSlideData[] = [
  {
    id: 'sables-2027',
    badge: 'OFFICIAL ROAD TO AUSTRALIA 2027',
    headline: { line1: 'SABLES VICTORY IN KAMPALA', line2: '2026 NATIONS CUP CAMPAIGN' },
    subheadline: 'Zimbabwe Sables overpower competitors in a thrilling continental showcase as World Cup 2027 qualification intensifies.',
    ctaPrimary: { label: 'Watch Highlights', href: '/video-hub' },
    ctaSecondary: { label: 'Match Centre', href: '/match-centre' },
    image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'cheetahs-7s',
    badge: 'SEVENS WORLD SERIES',
    headline: { line1: 'CHEETAHS EXPEDITION', line2: 'GLOBAL SEVENS TOUR' },
    subheadline: 'High-speed, high-intensity rugby as Zimbabwe Cheetahs take on international powerhouses on the global stage.',
    ctaPrimary: { label: 'View Fixtures', href: '/matches' },
    ctaSecondary: { label: 'Cheetahs Squad', href: '/teams/cheetahs' },
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'grassroots-dev',
    badge: 'NATIONAL SCHOOLS FESTIVAL 2026',
    headline: { line1: 'NURTURING FUTURE SABLES', line2: 'GRASSROOTS EXCELLENCE' },
    subheadline: 'Over 120 school teams competing in Zimbabwe’s premier youth rugby festival at Prince Edward School.',
    ctaPrimary: { label: 'Explore Festival', href: '/campaigns/schools-festival-2026' },
    ctaSecondary: { label: 'Development Hub', href: '/play-rugby' },
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=85',
  },
]

export default function HeroCarousel({ slides = DEFAULT_SLIDES, autoplayInterval = 7000 }: HeroCarouselProps) {
  const activeSlides = slides.length > 0 ? slides : DEFAULT_SLIDES
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
    }, autoplayInterval)
    return () => clearInterval(timer)
  }, [activeSlides.length, autoplayInterval])

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)

  const currentSlide = activeSlides[currentIndex] || DEFAULT_SLIDES[0]

  // Extract headline strings
  const line1 = typeof currentSlide.headline === 'object' ? currentSlide.headline.line1 : currentSlide.headline
  const line2 = typeof currentSlide.headline === 'object' ? currentSlide.headline.line2 : ''

  // Fallback image if Directus returns empty or invalid URL
  const heroImageSrc =
    currentSlide.image &&
    currentSlide.image.startsWith('http') &&
    !currentSlide.image.includes('placeholder')
      ? currentSlide.image
      : DEFAULT_SLIDES[currentIndex % DEFAULT_SLIDES.length].image

  return (
    <section className="relative w-full h-[85vh] min-h-[580px] max-h-[820px] bg-rich-black overflow-hidden flex items-center">
      {/* Background Image Carousel with Overlay Gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={heroImageSrc!}
            alt={line1 || 'Zimbabwe Rugby Union'}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          {/* Multi-stage Gradient for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-rich-black/95 via-rich-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-rich-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Main Hero Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="max-w-3xl space-y-6">
          {/* Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${currentIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zru-green/30 border border-zru-green/60 text-zru-green text-xs font-black uppercase tracking-widest rounded-md backdrop-blur-md shadow-[0_0_20px_rgba(0,107,63,0.4)]">
                <Trophy className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{currentSlide.badge || 'ZIMBABWE RUGBY UNION'}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Main Headline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`headline-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-1"
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight font-heading leading-none drop-shadow-lg">
                {line1}
              </h1>
              {line2 && (
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zru-green uppercase tracking-tight font-heading leading-none drop-shadow-md">
                  {line2}
                </h2>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Subheadline */}
          {currentSlide.subheadline && (
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${currentIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-white/80 text-sm sm:text-base lg:text-lg max-w-2xl font-light leading-relaxed drop-shadow"
              >
                {currentSlide.subheadline}
              </motion.p>
            </AnimatePresence>
          )}

          {/* CTA Buttons & Slide Indicator Navigation Bar Centered Between Buttons */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`cta-${currentIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              {/* Primary CTA */}
              <Link
                href={currentSlide.ctaPrimary?.href || '/video-hub'}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-zru-green hover:bg-zru-green/90 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-zru-green/30 cursor-pointer group"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{currentSlide.ctaPrimary?.label || 'Watch Highlights'}</span>
              </Link>

              {/* Progress & Slide Controls (Centered Between Buttons) */}
              <div className="flex items-center gap-2 px-3 py-2 bg-black/50 border border-white/10 rounded-xl backdrop-blur-md">
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="p-1.5 text-white/70 hover:text-zru-green hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 px-2">
                  {activeSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex ? 'w-6 bg-zru-green' : 'w-2 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="p-1.5 text-white/70 hover:text-zru-green hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Secondary CTA */}
              <Link
                href={currentSlide.ctaSecondary?.href || '/match-centre'}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                <span>{currentSlide.ctaSecondary?.label || 'Match Centre'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
