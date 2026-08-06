"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, X, Film, Megaphone, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoPlayer } from "../media/VideoPlayer";

interface VideoItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  category?: string;
  publishedAt?: string;
}

interface AnnouncementItem {
  id: string;
  title: string;
  body?: string;
  priority?: string;
  badge?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

interface TeamMediaSectionProps {
  teamName: string;
  teamId: string;
}

const DEFAULT_VIDEOS: VideoItem[] = [
  { id: "yt-canada-v-zim-2026", videoId: "kf33dibu7f0", title: "O Canada | Canada v Zimbabwe | Nations Cup 2026 | Match Highlights", thumbnail: "https://img.youtube.com/vi/kf33dibu7f0/hqdefault.jpg", category: "NATIONS CUP", publishedAt: "JULY 2026" },
  { id: "yt-usa-v-zim-2026", videoId: "2koQbsHjg14", title: "A BIG home win | USA v Zimbabwe | Nations Cup 2026 | Match Highlights", thumbnail: "https://img.youtube.com/vi/2koQbsHjg14/hqdefault.jpg", category: "NATIONS CUP", publishedAt: "JULY 2026" },
  { id: "yt-tonga-v-zim-2026", videoId: "h3iy3mTIhs4", title: "A TOUGH TEST for Tonga | Tonga v Zimbabwe | Nations Cup 2026 | Match Highlights", thumbnail: "https://img.youtube.com/vi/h3iy3mTIhs4/hqdefault.jpg", category: "NATIONS CUP", publishedAt: "JULY 2026" },
];

const MOCK_ANNOUNCEMENTS: AnnouncementItem[] = [
  { id: "ann-1", title: "Sables Victoria Cup Squad Selection Named", body: "Head Coach Piet Benade has named a 32-man training squad for the upcoming camp in Bulawayo.", priority: "high", badge: "SQUAD NEWS", ctaLabel: "READ MORE", ctaUrl: "/media" },
  { id: "ann-2", title: "Official Zimbabwe Sables 2026 Jersey Released", body: "The new heritage-inspired jersey pays homage to the 1991 Rugby World Cup squad.", priority: "normal", badge: "MERCHANDISE", ctaLabel: "VIEW JERSEY", ctaUrl: "/tickets" },
];

export default function TeamMediaSection({ teamName, teamId }: TeamMediaSectionProps) {
  const [videos, setVideos] = useState<VideoItem[]>(DEFAULT_VIDEOS);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [announcements] = useState<AnnouncementItem[]>(MOCK_ANNOUNCEMENTS);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos/youtube");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setVideos(data);
        }
      } catch { /* use defaults */ }
    }
    loadVideos();
  }, []);

  const isSables = teamId === "sables";
  const displayVideos = isSables ? videos : videos.slice(0, 3);
  const displayAnnouncements = teamId === "sables" || teamId === "lady-sables"
    ? announcements
    : announcements.slice(0, 1);

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="pl-0">
        <h2 className="text-2xl font-black uppercase tracking-wider text-rich-black">MEDIA & UPDATES</h2>
        <p className="text-sm text-black/50 mt-1">
          Highlights, press conferences, and the latest from {teamName}.
        </p>
      </div>

      {/* Videos Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-zru-green" />
          <h3 className="text-sm font-black uppercase tracking-widest text-black/60">MATCH HIGHLIGHTS</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-[box-shadow] group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full bg-black">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:brightness-110 transition-[filter] duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-zru-green text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border-2 border-white/40">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>
                {video.category && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/20">
                      {video.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold text-zru-green uppercase tracking-widest block">
                  {video.publishedAt || "WORLD RUGBY"}
                </span>
                <h4 className="font-black text-sm text-rich-black uppercase tracking-wide line-clamp-2 group-hover:text-zru-green transition-colors">
                  {video.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {isSables && (
          <a
            href="https://www.youtube.com/@ZimbabweRugbyUnion"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zru-green hover:bg-[#005238] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-[background-color,box-shadow] shadow-sm hover:shadow-md"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            VIEW ALL ON YOUTUBE
          </a>
        )}
      </div>

      {/* Announcements / News */}
      {displayAnnouncements.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-zru-green" />
            <h3 className="text-sm font-black uppercase tracking-widest text-black/60">LATEST UPDATES</h3>
          </div>

          <div className="space-y-4">
            {displayAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white border border-black/5 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {ann.badge && (
                      <span className="inline-block px-2.5 py-0.5 bg-zru-green/10 text-zru-green text-[9px] font-black uppercase tracking-widest rounded-full mb-3">
                        {ann.badge}
                      </span>
                    )}
                    <h4 className="font-black text-base uppercase tracking-wide text-rich-black group-hover:text-zru-green transition-colors">
                      {ann.title}
                    </h4>
                    {ann.body && (
                      <p className="text-sm text-black/50 mt-2 leading-relaxed">{ann.body}</p>
                    )}
                  </div>
                  {ann.ctaLabel && ann.ctaUrl && (
                    <a
                      href={ann.ctaUrl}
                      className="shrink-0 px-4 py-2 border border-zru-green text-zru-green text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-zru-green hover:text-white transition-[background-color,color]"
                    >
                      {ann.ctaLabel}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#010B07]/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <div className="absolute inset-0" onClick={() => setActiveVideo(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-5xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 hover:bg-zru-green text-white border border-white/20 transition-[background-color] shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative w-full bg-black">
                <VideoPlayer videoId={activeVideo.videoId} title={activeVideo.title} autoPlay />
              </div>
              <div className="p-5 bg-milk-white border-t border-black/10">
                <span className="text-[10px] font-black text-zru-green uppercase tracking-widest block mb-1">
                  {activeVideo.category || "MATCH HIGHLIGHTS"}
                </span>
                <h3 className="font-black text-lg text-rich-black uppercase not-italic">{activeVideo.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
