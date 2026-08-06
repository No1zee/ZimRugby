"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface VideoCardProps {
  title: string;
  duration: string;
  date: string;
  thumbnail: string;
  category: string;
  videoId?: string;
}

export default function VideoCard({
  title,
  duration,
  date,
  thumbnail,
  category,
  videoId,
}: VideoCardProps) {
  const [playing, setPlaying] = useState(false);

  const [minimized, setMinimized] = useState(false);

  return (
    <>
      <div
        onClick={() => videoId && setPlaying(true)}
        className={`group ${videoId ? 'cursor-pointer' : ''} card-green p-4 rounded-2xl border`}
      >
        <div className="relative aspect-video bg-white/10 rounded-xl overflow-hidden mb-4">
          <div className="absolute inset-0 bg-gray-800">
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover opacity-90 group-hover:opacity-100 group-hover:brightness-110 transition-[filter,opacity] duration-700"
            />
          </div>

          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/45 transition-colors" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-zru-green transition-[background-color] duration-300 shadow-lg">
              <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
            </div>
          </div>

          <div className="absolute top-3 left-3 bg-zru-green text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
            {category}
          </div>
          <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
            {duration}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-heading text-white leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
            {title}
          </h3>
          <span className="text-zinc-300 text-xs font-bold uppercase">{date}</span>
        </div>
      </div>

      {/* Floating Picture-in-Picture Draggable Video Player */}
      <AnimatePresence>
        {playing && videoId && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed ${
              minimized
                ? "bottom-6 right-6 w-80 z-[99999]"
                : "top-[20%] left-[50%] -ml-[170px] sm:-ml-[280px] md:-ml-[320px] w-[340px] sm:w-[560px] md:w-[640px] z-[99999]"
            } bg-black rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-2 border-zru-green cursor-move group select-none`}
          >
            {/* Control Bar */}
            <div className="bg-[#010B07] px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between text-white select-none">
              <span className="text-[10px] font-black uppercase tracking-widest text-zru-green flex items-center gap-1.5 truncate max-w-[240px]">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                {minimized ? title : "Playing • Drag Anywhere"}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMinimized(!minimized);
                  }}
                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold text-white transition-colors"
                  title={minimized ? "Expand Player" : "Minimize Player"}
                >
                  {minimized ? "▲ Expand" : "▼ Minimize"}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlaying(false);
                    setMinimized(false);
                  }}
                  className="w-6 h-6 bg-white/10 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                  title="Close Player"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!minimized && (
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={title}
                  className="w-full h-full border-0 pointer-events-auto"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
