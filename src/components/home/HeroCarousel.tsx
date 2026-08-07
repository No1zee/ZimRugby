'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Play, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

export interface HeroSlideData {
  id?: string | number
  badgeText?: string
  headline?: { line1?: string; line2?: string }
  subheadline?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  image?: string
}

const DEFAULT_SLIDES: HeroSlideData[] = [
  {
    id: '1',
    headline: { line1: 'VICTORY IN', line2: 'THE ZAMBEZI' },
    subheadline: 'Sables secure historic win against Namibia at Harare Sports Club',
    ctaText: 'WATCH HIGHLIGHTS',
    ctaHref: '/video-hub',
    secondaryCtaText: 'MATCH CENTRE',
    secondaryCtaHref: '/match-centre',
    image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: '2',
    headline: { line1: 'CHEETAHS 7S', line2: 'WORLD SERIES TOUR' },
    subheadline: 'High-speed, high-intensity rugby as Zimbabwe Cheetahs take on international powerhouses',
    ctaText: 'WATCH HIGHLIGHTS',
    ctaHref: '/video-hub',
    secondaryCtaText: 'MATCH CENTRE',
    secondaryCtaHref: '/tickets',
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: '3',
    headline: { line1: 'JUNIOR SABLES', line2: 'AFRICA BARTHES TROPHY' },
    subheadline: 'Under 20 squad defends title in Harare. Experience high-octane African youth rugby',
    ctaText: 'WATCH HIGHLIGHTS',
    ctaHref: '/campaigns/schools-festival-2026',
    secondaryCtaText: 'MATCH CENTRE',
    secondaryCtaHref: '/play-rugby',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=85',
  },
]

export default function HeroCarousel({ slides }: { slides?: HeroSlideData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [activeSlides.length])

  const slide = activeSlides[currentIndex] || DEFAULT_SLIDES[0]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
  }

  return (
    <section className="relative w-full h-[85vh] min-h-[620px] max-h-[900px] bg-rich-black overflow-hidden flex items-end pb-12 sm:pb-20 select-none">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id || currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slide.image || DEFAULT_SLIDES[0].image!}
            alt="Hero Background"
            fill
            priority
            className="object-cover object-center brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rich-black/95 via-rich-black/40 to-black/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-rich-black/90 via-transparent to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Main Content Container */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-4"
        >
          {/* Main Headline */}
          <div className="space-y-0">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight font-heading leading-none drop-shadow-xl">
              {slide.headline?.line1 || 'VICTORY IN'}
            </h1>
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#00E676] uppercase tracking-tight font-heading leading-none drop-shadow-xl">
              {slide.headline?.line2 || 'THE ZAMBEZI'}
            </h2>
          </div>

          {/* Subheadline */}
          <p className="text-white/90 text-base sm:text-xl font-normal max-w-2xl pt-2 leading-relaxed drop-shadow-md">
            {slide.subheadline || 'Sables secure historic win against Namibia at Harare Sports Club'}
          </p>

          {/* CTA Buttons & Slanted Controls */}
          <div className="pt-6 flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-5">
              {/* Primary White Slanted Button */}
              <div className="relative group">
                {/* Green Offset Shadow Slash */}
                <div 
                  className="absolute inset-0 bg-[#006B3F] translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"
                  style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)' }}
                />
                <Link
                  href={slide.ctaHref || '/video-hub'}
                  className="relative flex items-center gap-3 px-8 py-4 bg-white text-black font-black text-sm sm:text-base uppercase tracking-wider transition-colors hover:bg-neutral-100 cursor-pointer"
                  style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)' }}
                >
                  <Play className="w-4 h-4 fill-black text-black" />
                  <span>{slide.ctaText || 'WATCH HIGHLIGHTS'}</span>
                </Link>
              </div>

              {/* Secondary Translucent Border Slanted Button */}
              <Link
                href={slide.secondaryCtaHref || '/match-centre'}
                className="relative flex items-center gap-3 px-8 py-4 bg-black/40 hover:bg-black/60 border-y border-white/40 text-white font-black text-sm sm:text-base uppercase tracking-wider transition-all cursor-pointer backdrop-blur-xs"
                style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)' }}
              >
                <ArrowRight className="w-4 h-4 text-white" />
                <span>{slide.secondaryCtaText || 'MATCH CENTRE'}</span>
              </Link>
            </div>

            {/* Slanted Slide Progress Controls */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handlePrev}
                className="text-white/60 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {activeSlides.map((_, idx) => {
                  const isActive = idx === currentIndex
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2.5 transition-all duration-300 transform -skew-x-12 cursor-pointer ${
                        isActive ? 'w-10 bg-[#00E676]' : 'w-7 bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  )}
                )}
              </div>

              <button
                onClick={handleNext}
                className="text-white/60 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
