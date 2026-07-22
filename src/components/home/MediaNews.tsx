"use client";

import { ExternalLink, Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "../ui/animations";
import { motion } from "framer-motion";

const ZRU_ARTICLES = [
  {
    id: 1,
    title: "Sables Name Match-Day 23 for Nations Cup Opener Against Tonga",
    excerpt: "Zimbabwe Sables head coach Pieter Benade has named his match-day 23 for the opening fixture of the Nations Cup against Tonga at Dicks Sporting Goods Park, Denver.",
    date: "July 1, 2026",
    image: "https://zru.co.zw/wp-content/uploads/2026/07/Copy-of-starting-xi-768x660.png",
    url: "https://zru.co.zw/2026/07/01/sables-name-match-day-23-for-nations-cup-opener-against-tonga/",
    category: "Team News",
  },
  {
    id: 2,
    title: "Zero Tolerance Towards Violence",
    excerpt: "The Zimbabwe Rugby Union condemns any acts of violence after an incident between a parent and a referee at Eaglesvale School during a match between CBC and Eaglesvale.",
    date: "June 15, 2026",
    image: "https://zru.co.zw/wp-content/uploads/2026/06/zru-hd-768x660.jpeg",
    url: "https://zru.co.zw/2026/06/15/zero-tolerance-towards-violence/",
    category: "Statement",
  },
  {
    id: 3,
    title: "Zambia Arrive in Zimbabwe for Two-Match Series",
    excerpt: "The Zambia national rugby team has touched down in Zimbabwe ahead of a highly anticipated two-match series against the Sables.",
    date: "April 24, 2026",
    image: "https://zru.co.zw/wp-content/uploads/2026/04/WhatsApp-Image-2026-04-24-at-14.42.43-768x660.jpeg",
    url: "https://zru.co.zw/2026/04/24/zambia-arrive-in-zimbabwe-for-two-match-series/",
    category: "Fixtures",
  },
  {
    id: 4,
    title: "Sables to Face SA 'A' in Nelson Mandela Bay",
    excerpt: "The Zimbabwe Sables will kick off a blockbuster day of international rugby when they face the South Africa 'A' side at the iconic Nelson Mandela Bay Stadium.",
    date: "April 14, 2026",
    image: "https://zru.co.zw/wp-content/uploads/2026/04/PHOTO-2026-04-13-12-38-33-768x660.jpg",
    url: "https://zru.co.zw/2026/04/14/sables-to-launch-international-double-header-against-sa-a-in-nelson-mandela-bay/",
    category: "International",
  },
];

const MATCH_VIDEOS = [
  {
    id: "kf33dibu7f0",
    title: "Canada v Zimbabwe | Nations Cup 2026",
    subtitle: "Match Highlights",
    channel: "World Rugby",
    thumbnail: "https://i.ytimg.com/vi/kf33dibu7f0/hqdefault.jpg",
  },
  {
    id: "2koQbsHjg14",
    title: "USA v Zimbabwe | Nations Cup 2026",
    subtitle: "Match Highlights",
    channel: "World Rugby",
    thumbnail: "https://i.ytimg.com/vi/2koQbsHjg14/hqdefault.jpg",
  },
  {
    id: "h3iy3mTIhs4",
    title: "Tonga v Zimbabwe | Nations Cup 2026",
    subtitle: "Match Highlights",
    channel: "World Rugby",
    thumbnail: "https://i.ytimg.com/vi/h3iy3mTIhs4/hqdefault.jpg",
  },
];

export default function MediaNews() {
  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">

        {/* ===== HEADER ===== */}
        <ScrollReveal className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-zru-green/40" />
              <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.5em]">Media &amp; News</span>
            </div>
            <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-rich-black uppercase">
              LATEST <span className="text-stroke-black text-transparent">UPDATES</span>
            </h2>
          </div>
          <a
            href="https://zru.co.zw/latest-news/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-heading tracking-widest uppercase text-zru-green hover:text-rich-black transition-colors"
          >
            Visit ZRU Website <ExternalLink className="w-4 h-4" />
          </a>
        </ScrollReveal>

        {/* ===== NEWS ARTICLES GRID ===== */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20" staggerDelay={0.06}>
          {ZRU_ARTICLES.map((article) => (
            <motion.div key={article.id} variants={staggerItemVariants}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full group"
              >
                <div className="card-dark overflow-hidden h-full flex flex-col hover:border-zru-green/30 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-zru-green text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 clip-slanted-sm">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-rich-black/40 mb-2 block">
                      {article.date}
                    </span>
                    <h3 className="font-heading text-base tracking-wide text-rich-black line-clamp-2 leading-tight mb-2 group-hover:text-zru-green transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-rich-black/60 font-body leading-relaxed line-clamp-3 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="pt-3 mt-3 border-t border-black/5">
                      <span className="inline-flex items-center gap-2 text-[10px] font-heading tracking-widest uppercase text-rich-black/50 group-hover:text-zru-green transition-colors">
                        Read More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* ===== VIDEO HIGHLIGHTS ===== */}
        <div>
          <ScrollReveal className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-px bg-zru-green/40" />
                  <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.5em]">Match Highlights</span>
                </div>
                <h2 className="font-heading text-3xl md:text-5xl tracking-wider text-rich-black uppercase">
                  NATIONS CUP <span className="text-stroke-black text-transparent">2026</span>
                </h2>
              </div>
              <a
                href="https://www.youtube.com/@ZimRugby/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-heading tracking-widest uppercase text-zru-green hover:text-rich-black transition-colors"
              >
                ZRU YouTube Channel <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.08}>
            {MATCH_VIDEOS.map((video) => (
              <motion.div key={video.id} variants={staggerItemVariants}>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="card-dark overflow-hidden hover:border-zru-green/30 transition-all duration-300">
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-zru-green/90 flex items-center justify-center shadow-lg shadow-zru-green/30 group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-zru-green block mb-1">
                        {video.channel}
                      </span>
                      <h3 className="font-heading text-sm tracking-wide text-rich-black group-hover:text-zru-green transition-colors leading-tight">
                        {video.title}
                      </h3>
                      <p className="text-[11px] text-rich-black/50 font-body mt-1">
                        {video.subtitle}
                      </p>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>

      </div>
    </section>
  );
}
