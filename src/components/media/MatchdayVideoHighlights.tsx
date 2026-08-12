"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Play, ExternalLink, X, CircleDot, LayoutGrid, MoveHorizontal } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { VideoPlayer } from "./VideoPlayer";
import SectionTitle from "@/components/ui/SectionTitle";

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
                      className="absolute rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] border border-black/10 bg-white cursor-pointer group transition-[box-shadow] duration-300 flex flex-col justify-between pointer-events-auto"
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
                          className="object-cover group-hover:brightness-110 transition-[filter] duration-500 opacity-95"
                          sizes={`${cardWidth}px`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#006747] text-white flex items-center justify-center shadow-xl group-hover:bg-black transition-[background-color] duration-300 border-2 border-white/40">
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
                className="bg-white rounded-2xl sm:rounded-3xl border border-black/10 overflow-hidden shadow-lg hover:shadow-2xl transition-[box-shadow] duration-500 group cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:brightness-110 transition-[filter] duration-700 opacity-95"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#006747] text-white flex items-center justify-center shadow-xl group-hover:bg-black transition-[background-color] duration-300 border-2 border-white/40">
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
      <SectionTitle
        title={title}
        text={!title ? "NATIONS" : typeof title === "string" ? title : undefined}
        accent={!title ? "CUP" : undefined}
        variant="dark"
        size="md"
      />

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-black/5 p-1 rounded-xl border border-black/10 shadow-xs">
          <button
            onClick={() => setViewMode("ring")}
            title="3D Stage View"
            aria-label="3D Stage View"
            className={`p-2 rounded-lg transition-[background-color,color,box-shadow] flex items-center justify-center ${
              viewMode === "ring"
                ? "bg-[#006747] text-white shadow-md"
                : "text-black/60 hover:text-black hover:bg-black/5"
            }`}
          >
            <CircleDot className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            title="Grid View"
            aria-label="Grid View"
            className={`p-2 rounded-lg transition-[background-color,color,box-shadow] flex items-center justify-center ${
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
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#006747] hover:bg-[#005238] text-white rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-[background-color,box-shadow] duration-300 shadow-xs hover:shadow-md border border-[#006747] group/yt shrink-0"
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
      className="w-[280px] sm:w-[360px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] border border-black/10 bg-white cursor-pointer group transition-[box-shadow] duration-300 flex flex-col justify-between"
    >
      <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:brightness-110 transition-[filter] duration-500 opacity-95"
          sizes="360px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#006747] text-white flex items-center justify-center shadow-xl group-hover:bg-black transition-[background-color] duration-300 border-2 border-white/40">
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

// ── Viewport-Centered Floating Resizable Video Modal ──
function VideoModal({
  activeVideo,
  onClose,
}: {
  activeVideo: YouTubeVideoItem | null;
  onClose: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <AnimatePresence>
      {activeVideo && (
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999999] pointer-events-auto w-[90vw] max-w-2xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col group select-none resize aspect-video min-w-[320px] max-h-[85vh]"
        >
          {/* Header Drag Bar - ONLY area that initiates drag */}
            <div
              onPointerDown={(e) => {
                dragControls.start(e);
              }}
              className="bg-[#010B07] px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between text-white select-none cursor-grab active:cursor-grabbing shrink-0"
            >
              <span className="text-[11px] font-bold tracking-wide text-white/80 truncate max-w-[70%] pointer-events-none">
                {activeVideo.title}
              </span>

              <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Watch on YouTube"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-red-600/80 transition-colors"
                  aria-label="Close Video Player"
                  title="Close Video"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Body */}
            <div className="flex-1 w-full bg-black relative min-h-0">
              <VideoPlayer videoId={activeVideo.videoId} title={activeVideo.title} autoPlay />
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
