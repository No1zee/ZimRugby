'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Play, ChevronLeft, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAdaptivePerformance } from '@/context/AdaptivePerformanceContext'

export interface HeroSlideData {
  id?: string | number
  badgeText?: string
  headline?: string | { line1?: string; line2?: string }
  subheadline?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  image?: string
  video?: string
}

interface HeroCarouselProps {
  slides?: HeroSlideData[]
}

const DEFAULT_SLIDES: HeroSlideData[] = [
  {
    id: '1',
    headline: { line1: 'SABLES VICTORY', line2: 'ROAD TO AUSTRALIA 2027' },
    subheadline: 'Zimbabwe Rugby Union launches official campaign for Australia 2027 World Cup qualification.',
    ctaText: 'Watch Highlights',
    ctaHref: '/video-hub',
    secondaryCtaText: 'Match Centre',
    secondaryCtaHref: '/match-centre',
    image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Featured Campaign',
  },
  {
    id: '2',
    headline: { line1: 'CHEETAHS 7S', line2: 'WORLD SERIES TOUR' },
    subheadline: 'High-speed, high-intensity rugby as Zimbabwe Cheetahs take on international powerhouses.',
    ctaText: 'Fixtures & Tickets',
    ctaHref: '/tickets',
    secondaryCtaText: 'Squad List',
    secondaryCtaHref: '/teams/cheetahs',
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Sevens Tour',
  },
  {
    id: '3',
    headline: { line1: 'JUNIOR SABLES', line2: 'AFRICA BARTHES TROPHY' },
    subheadline: 'Under 20 squad defends title in Harare. Experience high-octane African youth rugby.',
    ctaText: 'Explore Festival',
    ctaHref: '/campaigns/schools-festival-2026',
    secondaryCtaText: 'Development Hub',
    secondaryCtaHref: '/play-rugby',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Grassroots',
  },
]

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Ensure active slides always have complete, valid data
  const rawSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES
  const activeSlides = rawSlides.map((s, idx) => {
    const fallback = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length]
    return {
      id: s.id || fallback.id,
      badgeText: s.badgeText || fallback.badgeText,
      headline: s.headline || fallback.headline,
      subheadline: s.subheadline || fallback.subheadline,
      ctaText: s.ctaText || fallback.ctaText,
      ctaHref: s.ctaHref || fallback.ctaHref,
      secondaryCtaText: s.secondaryCtaText || fallback.secondaryCtaText,
      secondaryCtaHref: s.secondaryCtaHref || fallback.secondaryCtaHref,
      image:
        s.image && s.image.startsWith('http') && !s.image.includes('placeholder')
          ? s.image
          : fallback.image,
      video: s.video,
    }
  })

  const activeSlide = activeSlides[currentSlide] || activeSlides[0]

  const { isSlowConnection, saveDataEnabled, prefersReducedMotion } = useAdaptivePerformance()
  const shouldAutoPlayVideo = !isSlowConnection && !saveDataEnabled

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [activeSlides.length, prefersReducedMotion])

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const line1 =
    typeof activeSlide.headline === 'string'
      ? activeSlide.headline
      : activeSlide.headline?.line1 || 'SABLES VICTORY'
  const line2 =
    typeof activeSlide.headline === 'string'
      ? ''
      : activeSlide.headline?.line2 || 'ROAD TO 2027'

  return (
    <section className="relative w-full min-h-[600px] h-[85vh] max-h-[900px] bg-rich-black overflow-hidden select-none flex items-end pb-16 lg:pb-24">
      {/* Background Media */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id || currentSlide}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          {activeSlide.video && !isMobile && shouldAutoPlayVideo ? (
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
          ) : (
            <Image
              src={activeSlide.image!}
              alt={`${line1} ${line2}`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
          {/* Overlays for readable text */}
          <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/50 to-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-rich-black/90 via-transparent to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer - GUARANTEED 100% VISIBLE */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-4xl space-y-6"
        >
          {/* Badge */}
          {activeSlide.badgeText && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zru-green text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-md">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>{activeSlide.badgeText}</span>
            </div>
          )}

          {/* Headline */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight font-heading leading-none drop-shadow-lg">
              {line1}
            </h1>
            {line2 && (
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zru-green uppercase tracking-tight font-heading leading-none drop-shadow-md">
                {line2}
              </h2>
            )}
          </div>

          {/* Subheadline */}
          {activeSlide.subheadline && (
            <p className="text-white/90 text-base sm:text-lg max-w-2xl font-light leading-relaxed drop-shadow">
              {activeSlide.subheadline}
            </p>
          )}

          {/* CTA Buttons & Navigation Controls Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {/* Primary CTA Button */}
            <Link
              href={activeSlide.ctaHref || '/video-hub'}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-zru-green hover:bg-zru-green/90 text-white font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(0,107,63,0.5)] hover:shadow-[0_0_35px_rgba(0,107,63,0.8)] overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              <Play className="w-4 h-4 fill-current text-white relative z-10 transition-transform group-hover:scale-110" />
              <span className="relative z-10">{activeSlide.ctaText || 'Watch Highlights'}</span>
            </Link>

            {/* Carousel Navigation Bar - Centered Between Buttons */}
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-lg">
              <button
                onClick={handlePrev}
                className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {activeSlides.map((_, idx) => {
                  const isActive = idx === currentSlide
                  return (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`relative h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive ? 'w-10 bg-zru-green' : 'w-6 bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  )}
                )}
              </div>

              <button
                onClick={handleNext}
                className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Secondary CTA Button */}
            <Link
              href={activeSlide.secondaryCtaHref || '/match-centre'}
              className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm tracking-wide rounded-md border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>{activeSlide.secondaryCtaText || 'Match Centre'}</span>
              <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
