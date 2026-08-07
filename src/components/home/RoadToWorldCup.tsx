'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Trophy, Globe, ArrowRight, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react'

const CAMPAIGN_FALLBACK_IMAGES: Record<string, string> = {
  "road-to-australia-2027": "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1200&q=80",
  "africa-cup-tour-2026": "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1200&q=80",
  "schools-festival-2026": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
};

const GLOBAL_DEFAULT_IMAGE = "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1200&q=80";

const defaultCampaigns = [
  {
    id: 'road-to-australia-2027',
    title: 'Sables Road to Australia 2027',
    subtitle: 'RWC 2027 Qualification Campaign',
    description: 'Support the Zimbabwe Sables in their quest to qualify for the 2027 Rugby World Cup in Australia. Track fixtures, squad selection, and campaign progress.',
    image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1200&q=80',
    stats: [
      { label: 'Ranking', value: '28th' },
      { label: 'RWC App.', value: '2 (1987, 1991)' },
      { label: 'Target', value: 'Top 2 Africa' },
    ],
    ctaText: 'Explore Australia 2027 Campaign',
    ctaLink: '/campaigns/road-to-australia-2027',
  },
  {
    id: 'africa-cup-tour-2026',
    title: 'Rugby Africa Nations Cup 2026',
    subtitle: 'Continental Championship Tour',
    description: 'The Sables compete against Africa’s elite national XV teams in the pinnacle continental championship tournament.',
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1200&q=80',
    stats: [
      { label: 'Defending', value: 'Champions' },
      { label: 'Matches', value: '5 Fixtures' },
      { label: 'Host', value: 'Kampala / Harare' },
    ],
    ctaText: 'Nations Cup Tour Hub',
    ctaLink: '/campaigns/africa-cup-tour-2026',
  },
  {
    id: 'schools-festival-2026',
    title: 'National Schools Rugby Festival 2026',
    subtitle: 'Grassroots Talent Showcase',
    description: 'Over 120 school teams competing in Zimbabwe’s legendary annual rugby showcase at Prince Edward & St George’s College.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    stats: [
      { label: 'Teams', value: '120+' },
      { label: 'Players', value: '2,500+' },
      { label: 'Venue', value: 'Harare' },
    ],
    ctaText: 'Schools Festival Hub',
    ctaLink: '/campaigns/schools-festival-2026',
  },
]

export default function RoadToWorldCup() {
  const [activeIndex, setActiveIndex] = useState(0)
  const current = defaultCampaigns[activeIndex]

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % defaultCampaigns.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + defaultCampaigns.length) % defaultCampaigns.length)
  }

  return (
    <section className="bg-rich-black py-16 relative overflow-hidden border-t border-b border-white/10">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-zru-green/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zru-green/20 border border-zru-green/40 text-zru-green text-[10px] font-black uppercase tracking-wider rounded-md mb-2">
              <Trophy className="w-3 h-3" />
              <span>Flagship Campaigns & Nations Cup</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-heading">
              Road To Australia 2027 & Nations Cup
            </h2>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous Campaign"
              className="p-3 bg-white/5 hover:bg-zru-green/20 border border-white/10 hover:border-zru-green/50 text-white rounded-xl transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Campaign"
              className="p-3 bg-white/5 hover:bg-zru-green/20 border border-white/10 hover:border-zru-green/50 text-white rounded-xl transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Campaign Hero Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl"
          >
            {/* Image Side */}
            <div className="lg:col-span-7 relative aspect-[16/9] rounded-xl overflow-hidden group shadow-lg bg-black/60">
              <Image
                src={current.image}
                alt={current.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 bg-zru-green text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow">
                  FEATURED CAMPAIGN
                </span>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-zru-green text-xs font-bold uppercase tracking-wider block mb-1">
                  {current.subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight font-heading">
                  {current.title}
                </h3>
              </div>

              <p className="text-white/70 text-sm leading-relaxed font-light">
                {current.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {current.stats.map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-white/50 uppercase font-bold block">{stat.label}</span>
                    <span className="text-sm font-black text-zru-green uppercase tracking-tight">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href={current.ctaLink}
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-zru-green hover:bg-zru-green/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-zru-green/20 group"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
