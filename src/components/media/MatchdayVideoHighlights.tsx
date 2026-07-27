"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Play, ExternalLink, X, CircleDot, LayoutGrid, MoveHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface YouTubeVideoItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  category?: string;
  publishedAt?: string;
}

const DEFAULT_HIGHLIGHTS: YouTubeVideoItem[] = [
  {
    id: "yt-canada-v-zim-2026",
    videoId: "kf33dibu7f0",
    title: "Canada v Zimbabwe | Nations Cup 2026 Extended Highlights",
    thumbnail: "https://img.youtube.com/vi/kf33dibu7f0/hqdefault.jpg",
    category: "WORLD RUGBY | NATIONS CUP",
    publishedAt: "JULY 2026",
  },
  {
    id: "yt-usa-v-zim-2026",
    videoId: "2koQbsHjg14",
    title: "USA v Zimbabwe | Nations Cup 2026 Extended Highlights",
    thumbnail: "https://img.youtube.com/vi/2koQbsHjg14/hqdefault.jpg",
    category: "WORLD RUGBY | NATIONS CUP",
    publishedAt: "JULY 2026",
  },
  {
    id: "yt-tonga-v-zim-2026",
    videoId: "h3iy3mTIhs4",
    title: "Tonga v Zimbabwe | Nations Cup 2026 Extended Highlights",
    thumbnail: "https://img.youtube.com/vi/h3iy3mTIhs4/hqdefault.jpg",
    category: "WORLD RUGBY | NATIONS CUP",
    publishedAt: "JULY 2026",
  },
  {
    id: "yt-canada-replay",
    videoId: "kf33dibu7f0",
    title: "Sables Nations Cup Opener | Canada v Zimbabwe Full Match Replay",
    thumbnail: "https://img.youtube.com/vi/kf33dibu7f0/hqdefault.jpg",
    category: "MATCHDAY REPLAY",
    publishedAt: "JULY 2026",
  },
  {
    id: "yt-usa-tries",
    videoId: "2koQbsHjg14",
    title: "Top Sables Tries & Match Reaction | USA v Zimbabwe",
    thumbnail: "https://img.youtube.com/vi/2koQbsHjg14/hqdefault.jpg",
    category: "TRIES & REACTION",
    publishedAt: "JULY 2026",
  },
  {
    id: "yt-tonga-analysis",
    videoId: "h3iy3mTIhs4",
    title: "Tactical Breakdown & Big Hits | Tonga v Zimbabwe",
    thumbnail: "https://img.youtube.com/vi/h3iy3mTIhs4/hqdefault.jpg",
    category: "TACTICAL BREAKDOWN",
    publishedAt: "JULY 2026",
  },
];

interface MatchdayVideoHighlightsProps {
  title?: React.ReactNode;
  subtitle?: string;
  showChannelLink?: boolean;
}

export default function MatchdayVideoHighlights({
  title,
  subtitle = "MATCH HIGHLIGHTS",
  showChannelLink = true,
}: MatchdayVideoHighlightsProps) {
  const videos = DEFAULT_HIGHLIGHTS;
  const [activeVideo, setActiveVideo] = useState<YouTubeVideoItem | null>(null);
  const [viewMode, setViewMode] = useState<"ring" | "grid">("ring");
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startRotation, setStartRotation] = useState(0);
  const [showDragToast, setShowDragToast] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const ringContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [isMobile, setIsMobile] = useState(false);

  // Viewport + visibility refs for pausing rAF
  const inViewRef = useRef(false);
  const hiddenRef = useRef(false);
  const rafRef = useRef<number>(0);

  // Mobile intro spin: runs once on mount, then stops
  const introDoneRef = useRef(false);

  // Measure container width + detect mobile
  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      setContainerWidth(w);
      setIsMobile(w < 640);
    }
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // IntersectionObserver + visibility for pausing rAF
  useEffect(() => {
    const el = ringContainerRef.current;
    const observer = el
      ? new IntersectionObserver(([entry]) => {
          inViewRef.current = entry.isIntersecting;
        }, { threshold: 0 })
      : null;
    if (el && observer) observer.observe(el);

    function handleVisibility() {
      hiddenRef.current = document.hidden;
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Auto-rotate via requestAnimationFrame
  // Desktop: continuous rotation at 8°/sec
  // Mobile: single intro spin (~20° over 1.5s) then stops to signal draggability
  useEffect(() => {
    if (viewMode !== "ring") return;

    let lastTime = 0;
    const DESKTOP_SPEED = 8;
    const MOBILE_INTRO_ANGLE = 20;
    const MOBILE_INTRO_DURATION = 1.5;

    function tick(now: number) {
      if (!inViewRef.current || hiddenRef.current || isDragging) {
        lastTime = 0;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (isMobile) {
        // Mobile: one-time intro spin, then stop
        if (!introDoneRef.current) {
          if (lastTime === 0) lastTime = now;
          const elapsed = (now - lastTime) / 1000;
          const progress = Math.min(elapsed / MOBILE_INTRO_DURATION, 1);
          // Ease-out curve for smooth deceleration
          const eased = 1 - Math.pow(1 - progress, 3);
          setRotationY(-MOBILE_INTRO_ANGLE * eased);

          if (progress >= 1) {
            introDoneRef.current = true;
          }
        }
        // Mobile: no more rotation after intro — rAF stops scheduling itself
      } else {
        // Desktop: continuous rotation
        if (lastTime) {
          const dt = (now - lastTime) / 1000;
          setRotationY((prev) => prev - DESKTOP_SPEED * dt);
        }
        lastTime = now;
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isDragging, viewMode, isMobile]);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    introDoneRef.current = true; // stop intro spin if user drags during it
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setStartRotation(rotationY);
  }, [rotationY]);

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    setRotationY(startRotation + deltaX * 0.4);
  }, [isDragging, startX, startRotation]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Auto-dismiss drag toast
  useEffect(() => {
    if (viewMode === "ring" && videos.length > 1) {
      setShowDragToast(true);
      const timer = setTimeout(() => setShowDragToast(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [viewMode, videos.length]);

  // ── Dynamic Ring Math (responsive) ──
  const count = videos.length;
  const cardWidth = isMobile
    ? Math.min(160, containerWidth * 0.55)
    : Math.min(260, containerWidth * 0.22);
  const cardGap = cardWidth * 0.08;

  const minRadius = count <= 1
    ? 0
    : (cardWidth + cardGap) * count / (2 * Math.PI);

  const maxRadius = isMobile
    ? containerWidth * 0.38
    : containerWidth * 0.42;
  const radius = Math.min(minRadius, maxRadius);

  const angleStep = count > 0 ? 360 / count : 0;

  // Only render cards within ±150° of front-facing (virtualization)
  const VISIBLE_ARC = 150;

  // ── 0 cards: empty state ──
  if (count === 0) {
    return (
      <section className="py-4 sm:py-6 bg-milk-white border-t border-black/5 select-none overflow-visible">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <HeaderStrip subtitle={subtitle} title={title} showChannelLink={showChannelLink} viewMode={viewMode} setViewMode={setViewMode} />
          <div className="flex items-center justify-center h-[280px] sm:h-[340px] text-neutral-mid text-sm">
            No highlight videos available yet.
          </div>
        </div>
      </section>
    );
  }

  // ── 1 card: centered, no ring ──
  if (count === 1) {
    return (
      <section className="py-4 sm:py-6 bg-milk-white border-t border-black/5 select-none overflow-visible">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <HeaderStrip subtitle={subtitle} title={title} showChannelLink={showChannelLink} viewMode={viewMode} setViewMode={setViewMode} />
          <div className="flex items-center justify-center py-6">
            <VideoCard video={videos[0]} isDragging={isDragging} onClick={() => setActiveVideo(videos[0])} />
          </div>
        </div>
        <VideoModal activeVideo={activeVideo} onClose={() => setActiveVideo(null)} />
      </section>
    );
  }

  return (
    <section className="py-4 sm:py-6 bg-milk-white border-t border-black/5 select-none overflow-visible">
      <div ref={containerRef} className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <HeaderStrip subtitle={subtitle} title={title} showChannelLink={showChannelLink} viewMode={viewMode} setViewMode={setViewMode} />

        {viewMode === "ring" ? (
          <div className="relative w-full py-6 select-none overflow-visible" ref={ringContainerRef}>
            {/* Drag Toast */}
            <AnimatePresence>
              {showDragToast && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="absolute top-0 right-4 z-20 flex items-center gap-1.5 text-[10px] font-extrabold text-[#006747] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/10 shadow-md pointer-events-none"
                >
                  <MoveHorizontal className="w-3.5 h-3.5 text-[#006747] animate-pulse" />
                  <span className="uppercase tracking-wider">DRAG TO ROTATE</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="relative w-full h-[220px] sm:h-[280px] md:h-[340px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible"
              style={{ perspective: isMobile ? "800px" : "1200px" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              <div
                className="relative w-full h-full flex items-center justify-center transition-transform duration-75"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${rotationY}deg)`,
                }}
              >
                {videos.map((video, idx) => {
                  const itemAngle = idx * angleStep;
                  const netAngle = ((itemAngle + rotationY) % 360 + 360) % 360;
                  const cosVal = Math.cos((netAngle * Math.PI) / 180);

                  // Virtualization: skip cards far behind the ring
                  if (cosVal < -0.8) return null;

                  const cardOpacity = Math.max(0.3, (cosVal + 0.4) / 1.4);
                  const zIndexVal = Math.round(1000 + cosVal * 500);
                  const scale = 0.85 + cosVal * 0.15;

                  return (
                    <div
                      key={video.id}
                      onClick={() => !isDragging && setActiveVideo(video)}
                      className="absolute rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] border border-black/10 bg-white cursor-pointer group transition-all duration-300 flex flex-col justify-between pointer-events-auto"
                      style={{
                        width: `${cardWidth}px`,
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        transform: `rotateY(${itemAngle}deg) translateZ(${radius}px) scale(${scale})`,
                        zIndex: zIndexVal,
                        opacity: cardOpacity,
                      }}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                          sizes={`${cardWidth}px`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#006747] text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-black transition-all duration-300 border-2 border-white/40">
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5 text-white" />
                          </div>
                        </div>
                        {video.category && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 bg-black/70 text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/20">
                              {video.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="p-4 space-y-1 bg-white border-t border-black/5">
                        <span className="text-[9px] font-bold text-[#006747] uppercase tracking-widest block">
                          {video.publishedAt || "JULY 2026"}
                        </span>
                        <p className="font-heading font-black text-xs sm:text-sm text-rich-black uppercase tracking-wide line-clamp-1 group-hover:text-[#006747] transition-colors">
                          {video.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Grid View (default on mobile) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="bg-white rounded-2xl sm:rounded-3xl border border-black/10 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#006747] text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-black transition-all duration-300 border-2 border-white/40">
                      <Play className="w-6 h-6 fill-current translate-x-0.5 text-white" />
                    </div>
                  </div>
                  {video.category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-black/70 border border-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                        {video.category}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5 space-y-1.5 bg-white">
                  <span className="text-[10px] font-bold text-[#006747] uppercase tracking-widest block">
                    {video.publishedAt || "WORLD RUGBY MATCH HIGHLIGHTS"}
                  </span>
                  <p className="font-heading font-black text-sm sm:text-base md:text-lg text-rich-black uppercase leading-snug group-hover:text-[#006747] transition-colors line-clamp-2">
                    {video.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <VideoModal activeVideo={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
}

// ── Header Strip (extracted) ──
function HeaderStrip({
  subtitle,
  title,
  showChannelLink,
  viewMode,
  setViewMode,
}: {
  subtitle: string;
  title: React.ReactNode;
  showChannelLink: boolean;
  viewMode: "ring" | "grid";
  setViewMode: (m: "ring" | "grid") => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-rich-black not-italic">
          {title ?? <>NATIONS <span className="text-accent-teal">CUP</span></>}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-black/5 p-1 rounded-xl border border-black/10 shadow-xs">
          <button
            onClick={() => setViewMode("ring")}
            title="3D Stage View"
            aria-label="3D Stage View"
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${
              viewMode === "ring"
                ? "bg-[#006747] text-white shadow-md scale-105"
                : "text-black/60 hover:text-black hover:bg-black/5"
            }`}
          >
            <CircleDot className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            title="Grid View"
            aria-label="Grid View"
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${
              viewMode === "grid"
                ? "bg-[#006747] text-white shadow-md scale-105"
                : "text-black/60 hover:text-black hover:bg-black/5"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        {showChannelLink && (
          <a
            href="https://www.youtube.com/@ZimbabweRugbyUnion"
            target="_blank"
            rel="noopener noreferrer"
            title="Watch ZRU on YouTube"
            aria-label="Watch ZRU on YouTube"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#006747] hover:bg-[#005238] text-white rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-md border border-[#006747] hover:scale-105 active:scale-95 group/yt shrink-0"
          >
            <svg className="w-5 h-3.5 shrink-0 group-hover/yt:scale-110 transition-transform" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 2.622a3.008 3.008 0 0 0-2.116-2.126C19.513 0 12 0 12 0S4.487 0 2.618.496A3.008 3.008 0 0 0 .502 2.622C0 4.504 0 8.423 0 8.423s0 3.919.502 5.801a3.008 3.008 0 0 0 2.116 2.126C4.487 16.846 12 16.846 12 16.846s7.513 0 9.882-.496a3.008 3.008 0 0 0 2.116-2.126C24 12.342 24 8.423 24 8.423s0-3.919-.502-5.801z" fill="#FF0000"/>
              <path d="M9.545 12.016V4.83l6.273 3.593-6.273 3.593z" fill="#FFFFFF"/>
            </svg>
            <span className="whitespace-nowrap font-heading tracking-widest text-white">YOUTUBE</span>
          </a>
        )}
      </div>
    </div>
  );
}

// ── Single Video Card (reused for 1-card layout) ──
function VideoCard({ video, isDragging, onClick }: { video: YouTubeVideoItem; isDragging: boolean; onClick: () => void }) {
  return (
    <div
      onClick={() => !isDragging && onClick()}
      className="w-[280px] sm:w-[360px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] border border-black/10 bg-white cursor-pointer group transition-all duration-300 flex flex-col justify-between hover:scale-105"
    >
      <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
          sizes="360px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#006747] text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-black transition-all duration-300 border-2 border-white/40">
            <Play className="w-6 h-6 fill-current translate-x-0.5 text-white" />
          </div>
        </div>
        {video.category && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-black/70 text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/20">
              {video.category}
            </span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-1 bg-white border-t border-black/5">
        <span className="text-[9px] font-bold text-[#006747] uppercase tracking-widest block">
          {video.publishedAt || "JULY 2026"}
        </span>
        <p className="font-heading font-black text-xs sm:text-sm text-rich-black uppercase tracking-wide line-clamp-1 group-hover:text-[#006747] transition-colors">
          {video.title}
        </p>
      </div>
    </div>
  );
}

// ── Video Modal ──
function VideoModal({
  activeVideo,
  onClose,
}: {
  activeVideo: YouTubeVideoItem | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-[#010B07]/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
        >
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-5xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 hover:bg-[#006747] text-white border border-white/20 transition-all shadow-lg"
              aria-label="Close Video Player"
              title="Close Video"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-5 sm:p-6 bg-milk-white border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black text-[#006747] uppercase tracking-widest block">
                  ZIMBABWE RUGBY UNION &bull; IN-SITE MATCHDAY MEDIA
                </span>
                <p className="font-heading font-black text-lg sm:text-xl text-rich-black uppercase italic">
                  {activeVideo.title}
                </p>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black/5 hover:bg-black text-rich-black hover:text-white rounded-xl text-xs font-heading font-black tracking-widest uppercase transition-all"
              >
                <span>WATCH ON YOUTUBE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
