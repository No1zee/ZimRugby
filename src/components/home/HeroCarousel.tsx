'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Play, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useAdaptivePerformance } from '@/context/AdaptivePerformanceContext'

export interface HeroSlideData {
  id: string | number
  headline: string | { line1: string; line2: string }
  headlineHighlight?: string
  subheadline?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  image: string
  video?: string
  badgeText?: string
  badgeVariant?: 'accent' | 'green' | 'dark'
  imagePosition?: string
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

function SlideContent({ slide, isMobile, onPrev, onNext, slides, currentIndex, onSelect, progress }: SlideContentProps) {
  return (
    <motion.div
      key={slide.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-3xl"
    >
      {/* Badge */}
      {slide.badgeText && (
        <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider bg-zru-green/90 text-white rounded-full">
          {slide.badgeText}
        </span>
      )}

      {/* Headline */}
      <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none">
        {typeof slide.headline === 'string' ? slide.headline : (
          <>
            {slide.headline.line1} <span className="text-zru-green">{slide.headline.line2}</span>
          </>
        )}
      </h1>

      {/* Subheadline */}
      {slide.subheadline && (
        <p className="text-lg sm:text-xl text-white/80 max-w-2xl font-light">
          {slide.subheadline}
        </p>
      )}

      {/* CTAs + Controls Row - Navigation bar ALWAYS positioned between the primary and secondary buttons */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
        {/* Primary CTA Button */}
        {slide.ctaText && slide.ctaHref && (
          <Link
            href={slide.ctaHref}
            className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 bg-zru-green text-white font-bold text-sm uppercase tracking-wider overflow-hidden rounded-sm transition-all duration-300 shadow-[0_4px_20px_rgba(0,107,63,0.4)] hover:shadow-[0_6px_28px_rgba(0,107,63,0.6)] hover:-translate-y-0.5 active:translate-y-0"
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
            className="p-1 text-white/70 hover:text-white transition-colors"
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
                  className={`relative h-2 rounded-full transition-all duration-300 ${
                    isActive ? 'w-10 bg-zru-green' : 'w-6 bg-white/30 hover:bg-white/50'
                  }`}
                  style={{ clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}
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
            className="p-1 text-white/70 hover:text-white transition-colors"
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
    ctaHref: '/media',
    secondaryCtaText: 'Match Centre',
    secondaryCtaHref: '/matches',
    image: '/images/campaign/hero.png',
    badgeText: 'Featured',
  },
  {
    id: '2',
    headline: { line1: 'JUNIOR SABLES', line2: 'AFRICA BART' },
    subheadline: 'U20 squad defends title in Harare. Experience high-octane African rugby.',
    ctaText: 'Fixtures & Tickets',
    ctaHref: '/tickets',
    secondaryCtaText: 'Squad List',
    secondaryCtaHref: '/teams/junior-sables',
    image: '/images/campaign/youth.png',
    badgeText: 'Matchday',
  },
]

export default function HeroCarousel({ slides = DEFAULT_SLIDES }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [slideProgress, setSlideProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { isSlowConnection, saveDataEnabled, prefersReducedMotion } = useAdaptivePerformance()
  const shouldAutoPlayVideo = !isSlowConnection && !saveDataEnabled

  const activeSlide = slides[currentSlide] || slides[0]

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length, prefersReducedMotion])

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacityBg = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const opacityText = useTransform(scrollYProgress, [0, 0.6], [1, 0])

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
          style={isMobile ? undefined : { y: yBg, opacity: opacityBg }}
          className="relative w-full h-full hero-bg-media will-change-transform filter-[brightness(var(--hero-brightness,1))]"
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
              poster={activeSlide.image}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {(!activeSlide.video || (!isMobile && !shouldAutoPlayVideo)) && (
            <Image
              src={activeSlide.image}
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

      {/* Content Layer */}
      <motion.div style={{ y: yText, opacity: opacityText }} className="relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end justify-start pb-24 lg:pb-32">
        <div className="text-left w-full mr-auto">
          <SlideContent 
            slide={activeSlide} 
            isMobile={isMobile}
            onPrev={handlePrev}
            onNext={handleNext}
            slides={slides}
            currentIndex={currentSlide}
            onSelect={goToSlide}
            progress={slideProgress}
          />
        </div>
      </motion.div>
    </section>
  )
}
