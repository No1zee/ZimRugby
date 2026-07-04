"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, Search, X, Clock, Calendar, Film } from "lucide-react";
import { getVideos, type VideoItem } from "@/lib/api/videos";
import { GlowButton } from "@/components/ui/animations";

export default function VideoHubPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    getVideos().then(setVideos);
  }, []);

  const categories = ["All", "Match Highlights", "Press Conferences", "Player Features", "Rugby Explained"];

  // Filter logic
  const filteredVideos = videos.filter((video) => {
    const matchesCategory = activeCategory === "All" || video.category === activeCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredVideo = videos[0];

  return (
    <main className="bg-rich-black min-h-screen pt-24 pb-24 text-white">
      
      {/* 1. Widescreen Cinematic Header / Hero Video */}
      {featuredVideo && (
        <div className="relative w-full h-[65vh] min-h-[450px] overflow-hidden flex items-end">
          {/* Cover/Thumbnail */}
          <div className="absolute inset-0 z-0">
            <Image
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-linear-to-t from-rich-black via-rich-black/50 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-3xl space-y-6">
              <span className="bg-zru-gold text-rich-black px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider w-fit block">
                FEATURED VIDEO
              </span>
              <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-glow-green leading-none">
                {featuredVideo.title}
              </h1>
              <p className="text-white/70 text-base md:text-lg font-medium leading-relaxed">
                {featuredVideo.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <GlowButton 
                  onClick={() => setActiveVideo(featuredVideo)}
                  className="bg-white text-rich-black px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2 cursor-none"
                  glowColor="rgba(255, 255, 255, 0.3)"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Highlights</span>
                </GlowButton>
                <div className="flex items-center gap-4 text-xs text-white/50 font-bold uppercase">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zru-gold" />
                    <span>{featuredVideo.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-zru-gold" />
                    <span>{featuredVideo.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Navigation Filters & Search */}
      <div className="border-y border-white/10 bg-rich-black/80 sticky top-16 z-30 backdrop-blur-md py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Category tabs */}
            <div className="flex overflow-x-auto py-1 gap-2 no-scrollbar w-full lg:w-auto">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                      isActive 
                        ? "bg-zru-gold text-rich-black shadow-lg" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-zru-gold text-sm transition-all"
              />
            </div>

          </div>
        </div>
      </div>

      {/* 3. Video Grid Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
            <Film className="w-5 h-5 text-zru-gold" />
            <span>VIDEO ARCHIVE ({filteredVideos.length})</span>
          </h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                whileHover={{ y: -5 }}
                className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer shadow-xl glow-green-card"
                onClick={() => setActiveVideo(video)}
              >
                {/* Thumbnail container */}
                <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                      <Play className="w-5 h-5 ml-1 fill-current" />
                    </div>
                  </div>
                  {/* Duration badge */}
                  <span className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white">
                    {video.duration}
                  </span>
                </div>

                {/* Video Info */}
                <div className="p-6 space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zru-gold">{video.category}</span>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white line-clamp-2 group-hover:text-zru-gold transition-colors duration-300">
                    {video.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                    {video.description}
                  </p>
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40 font-bold uppercase">
                    <span>ZIM RUGBY MEDIA</span>
                    <span>{video.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-2xl">
            <Film className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 font-black uppercase tracking-wider">No videos found matching the criteria</p>
          </div>
        )}
      </section>

      {/* 4. Interactive Video Player Modal (Lightroom embed with strict sandbox) */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setActiveVideo(null)} />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-5xl bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 bg-white/5 border-b border-white/10">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zru-gold block">{activeVideo.category}</span>
                  <h2 className="text-base md:text-lg font-black uppercase tracking-tight text-white line-clamp-1 mt-0.5">{activeVideo.title}</h2>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  aria-label="Close Video"
                  title="Close Video"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Secure Sandboxed Video Player */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={activeVideo.embedUrl}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              </div>

              {/* Footer / Description */}
              <div className="p-6 md:p-8 bg-white/5 space-y-4">
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  {activeVideo.description}
                </p>
                <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase border-t border-white/5 pt-4">
                  <span>DUR: {activeVideo.duration}</span>
                  <span>PUBLISHED: {activeVideo.date}</span>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
