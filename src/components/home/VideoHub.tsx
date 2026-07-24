"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight, Video } from "lucide-react";
import { motion } from "framer-motion";

const HIGHLIGHTS = [
  {
    id: "nations-cup-final",
    title: "Zimbabwe Sables vs Namibia — Africa Cup Final",
    badge: "WORLD RUGBY | NATIONS CUP",
    tag: "Extended Highlights",
    duration: "12:45",
    thumbnail: "/images/media/vid3.jpg",
    videoUrl: "/media",
  },
  {
    id: "lady-sables-tonga",
    title: "Lady Sables vs Kenya — Africa Women's Cup",
    badge: "RUGBY AFRICA | WOMEN'S CUP",
    tag: "Full Match Replay",
    duration: "80:00",
    thumbnail: "/images/hero/lady-sables.webp",
    videoUrl: "/media",
  },
  {
    id: "cheetahs-7s-dubai",
    title: "Zimbabwe Cheetahs vs Hong Kong — World Rugby 7s",
    badge: "WORLD RUGBY | 7s CHALLENGER",
    tag: "Try Compilation",
    duration: "06:15",
    thumbnail: "/images/events/super-league.jpg",
    videoUrl: "/media",
  },
  {
    id: "u20-barthes-cup",
    title: "Junior Sables vs Kenya U20 — Barthes Trophy Final",
    badge: "RUGBY AFRICA | BARTHES CUP",
    tag: "Match Highlights",
    duration: "10:30",
    thumbnail: "/images/hero/zim-u20s.webp",
    videoUrl: "/media",
  },
];

export default function VideoHub() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <section className="py-20 bg-milk-white border-t border-b border-black/10 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zru-green/10 border border-zru-green/20 mb-2">
              <Video className="w-3.5 h-3.5 text-zru-green" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zru-green">
                MATCH HIGHLIGHTS & MEDIA HUB
              </span>
            </div>
            <h2 className="heading-1 text-black">NATIONS CUP & MATCH REPLAYS</h2>
          </div>

          <Link
            href="/media"
            className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-zru-green hover:text-black transition-colors"
          >
            <span>EXPLORE VIDEO HUB</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal Streaming Media Carousel */}
        <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {HIGHLIGHTS.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="min-w-[290px] sm:min-w-[340px] md:min-w-[380px] max-w-[400px] shrink-0 snap-start bg-white rounded-2xl border border-black/10 hover:border-zru-green/60 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col justify-between"
            >
              {/* Thumbnail Stage with Play Button & Badges */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/5">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 bg-zru-green text-white rounded-full text-[9px] font-extrabold tracking-widest uppercase shadow-sm">
                    {video.badge}
                  </span>
                  <span className="px-2.5 py-1 bg-black/70 text-white rounded-full text-[9px] font-extrabold tracking-wider uppercase backdrop-blur-md">
                    {video.duration}
                  </span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-12 h-12 rounded-full bg-zru-green text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white group-hover:text-zru-green transition-all duration-300">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>

                {/* Bottom Tag */}
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#84d7af]">
                    {video.tag}
                  </span>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <h3 className="heading-3 text-black text-sm sm:text-base uppercase tracking-tight line-clamp-2 group-hover:text-zru-green transition-colors mb-4">
                  {video.title}
                </h3>

                <Link
                  href={video.videoUrl}
                  className="w-full py-2.5 rounded-xl border border-black/10 hover:border-zru-green bg-milk-white hover:bg-zru-green text-black hover:text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>WATCH MATCH</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
