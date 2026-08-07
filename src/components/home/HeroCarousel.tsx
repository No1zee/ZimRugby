'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Play, ChevronLeft, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAdaptivePerformance } from '@/context/AdaptivePerformanceContext'

export interface HeroSlideData {
  id?: string | number
  badgeText?: string
  headline: string | { line1?: string; line2?: string }
  subheadline?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  image: string
  video?: string
}

interface SlideContentProps {
  slide: HeroSlideData
  isMobile: boolean
  onPrev: () => void
  onNext: () => void
  slides: HeroSlideData[]
  currentIndex: number
  onSelect: (index: number) => void
  progress: number
}

function SlideContent({
  slide,
  isMobile,
  onPrev,
  onNext,
  slides,
  currentIndex,
  onSelect,
  progress,
}: SlideContentProps) {
  const line1 = typeof slide.headline === 'string' ? slide.headline : slide.headline?.line1
  const line2 = typeof slide.headline === 'string' ? '' : slide.headline?.line2

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-4xl space-y-6"
    >
      {/* Badge */}
      {slide.badgeText && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zru-green text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-md">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>{slide.badgeText}</span>
        </div>
      )}

      {/* Headline */}
      <div className="space-y-1">
        {line1 && (
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight font-heading leading-none drop-shadow-lg">
            {line1}
          </h1>
        )}
        {line2 && (
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zru-green uppercase tracking-tight font-heading leading-none drop-shadow-md">
            {line2}
          </h2>
        )}
      </div>

      {/* Subheadline */}
      {slide.subheadline && (
        <p className="text-white/80 text-base sm:text-lg max-w-2xl font-light leading-relaxed drop-shadow">
          {slide.subheadline}
        </p>
      )}

      {/* CTA Buttons & Navigation Controls Bar */}
      <div className="flex flex-wrap items-center gap-4 pt-4">
        {/* Primary CTA Button */}
        {slide.ctaText && slide.ctaHref && (
          <Link
            href={slide.ctaHref}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-zru-green hover:bg-zru-green/90 text-white font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(0,107,63,0.5)] hover:shadow-[0_0_35px_rgba(0,107,63,0.8)] overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)' }}
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            <Play className="w-4 h-4 fill-current text-white relative z-10 transition-transform group-hover:scale-110" />
            <span className="relative z-10">{slide.ctaText}</span>
          </Link>
        )}

        {/* Carousel Progress & Navigation Controls Bar - Always centered between buttons */}
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-lg">
          <button
            onClick={onPrev}
            className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => {
              const isActive = idx === currentIndex
              return (
                <button
                  key={s.id || idx}
                  onClick={() => onSelect(idx)}
                  className={`relative h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive ? 'w-10 bg-zru-green' : 'w-6 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-zru-green rounded-full origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 5, ease: 'linear' }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <button
            onClick={onNext}
            className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Secondary CTA Button */}
        {slide.secondaryCtaText && slide.secondaryCtaHref && (
          <Link
            href={slide.secondaryCtaHref}
            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm tracking-wide rounded-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>{slide.secondaryCtaText}</span>
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        )}
      </div>
    </motion.div>
  )
}

interface HeroCarouselProps {
  slides?: HeroSlideData[]
}

const DEFAULT_SLIDES: HeroSlideData[] = [
  {
    id: '1',
    headline: { line1: 'SABLES VICTORY', line2: 'ROAD TO 2027' },
    subheadline: 'Zimbabwe Rugby Union launches campaign for Australia 2027 World Cup qualification.',
    ctaText: 'Watch Highlights',
    ctaHref: '/video-hub',
    secondaryCtaText: 'Match Centre',
    secondaryCtaHref: '/match-centre',
    image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Featured',
  },
  {
    id: '2',
    headline: { line1: 'JUNIOR SABLES', line2: 'AFRICA BARTHES TROPHY' },
    subheadline: 'U20 squad defends title in Harare. Experience high-octane African rugby.',
    ctaText: 'Fixtures & Tickets',
    ctaHref: '/tickets',
    secondaryCtaText: 'Squad List',
    secondaryCtaHref: '/teams/junior-sables',
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1920&q=85',
    badgeText: 'Matchday',
  },
]

export default function HeroCarousel({ slides = DEFAULT_SLIDES }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [slideProgress, setSlideProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES
  const activeSlide = activeSlides[currentSlide] || activeSlides[0]

  const { isSlowConnection, saveDataEnabled, prefersReducedMotion } = useAdaptivePerformance()
  const shouldAutoPlayVideo = !isSlowConnection && !saveDataEnabled

  const heroImageSrc =
    activeSlide.image &&
    activeSlide.image.startsWith('http') &&
    !activeSlide.image.includes('placeholder')
      ? activeSlide.image
      : DEFAULT_SLIDES[currentSlide % DEFAULT_SLIDES.length].image

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
    }, 5000)

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

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-[600px] h-[85vh] max-h-[900px] bg-rich-black overflow-hidden select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id || currentSlide}
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.8 }}
          className="relative w-full h-full hero-bg-media will-change-transform"
        >
          {activeSlide.video && isMobile && (
            <Image
              src={activeSlide.video.replace('.mp4', '.webp')}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
          {activeSlide.video && !isMobile && shouldAutoPlayVideo && (
            <video
              src={activeSlide.video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroImageSrc}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {(!activeSlide.video || (!isMobile && !shouldAutoPlayVideo)) && (
            <Image
              src={heroImageSrc}
              alt={typeof activeSlide.headline === 'string' ? activeSlide.headline : `${(activeSlide.headline as any)?.line1 || ''} ${(activeSlide.headline as any)?.line2 || ''}`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-rich-black/90 via-rich-black/30 to-black/30 z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer - GUARANTEED 100% VISIBLE ON LOAD */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end justify-start pb-24 lg:pb-32">
        <div className="text-left w-full mr-auto">
          <SlideContent 
            slide={activeSlide} 
            isMobile={isMobile}
            onPrev={handlePrev}
            onNext={handleNext}
            slides={activeSlides}
            currentIndex={currentSlide}
            onSelect={goToSlide}
            progress={slideProgress}
          />
        </div>
      </div>
    </section>
  )
}
