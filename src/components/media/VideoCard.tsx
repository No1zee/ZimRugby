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

      {/* YouTube Embed Modal */}
      <AnimatePresence>
        {playing && videoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              <button
                onClick={() => setPlaying(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-[background-color]"
              >
                <X className="w-5 h-5" />
              </button>

              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 z-10 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-[background-color]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                YouTube
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
