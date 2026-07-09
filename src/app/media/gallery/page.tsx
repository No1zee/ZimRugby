"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Camera, X, Calendar, Eye } from "lucide-react";
import { getPhotos } from "@/lib/api/gallery";
import { Photo } from "@/types";
import PageHero from "@/components/ui/PageHero";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeAlbum, setActiveAlbum] = useState<string>("All");
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  useEffect(() => {
    getPhotos().then(setPhotos);
  }, []);

  const albums = ["All", "Match Day", "Historical Collections", "Community Rugby", "Training Camps"];

  const filteredPhotos = photos.filter(
    (photo) => activeAlbum === "All" || photo.album === activeAlbum
  );

  return (
    <main className="bg-rich-black min-h-screen pb-24 text-white">

      {/* PageHero header */}
      <div className="pt-24">
        <PageHero
          title="Photo Gallery"
          subtitle="Relive the historic matches, training campaigns, and community milestones that shape Zimbabwe rugby."
          tag="Visual Heritage"
          backgroundImage="/images/media/vid1.jpg"
          breadcrumb={[{ label: "Gallery", href: "/gallery" }]}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">

        {/* Album Tabs Filter */}
        <div className="flex overflow-x-auto pb-6 border-b border-white/10 mb-12 gap-2 no-scrollbar">
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setActiveAlbum(album)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                activeAlbum === album
                  ? "bg-zru-green text-white shadow-lg shadow-zru-green/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {album}
            </button>
          ))}
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer shadow-xl glow-green-card"
              onClick={() => setActivePhoto(photo)}
            >
              {/* Photo container */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-900">
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                {/* Eye Icon Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
                {/* Album tag */}
                <span className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider text-zru-green border border-zru-green/20">
                  {photo.album}
                </span>
              </div>

              {/* Photo details */}
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-black uppercase tracking-tight text-white line-clamp-1 group-hover:text-zru-green transition-colors duration-300">
                  {photo.title}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                  {photo.description}
                </p>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[9px] text-white/40 font-bold uppercase">
                  <div className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>ZR ARCHIVE</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{photo.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-2xl">
            <Camera className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 font-black uppercase tracking-wider">No photos found in this album</p>
          </div>
        )}

      </div>

      {/* Lightbox / Zoom Overlay */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setActivePhoto(null)} />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/60 hover:text-white transition-colors"
                aria-label="Close Lightbox"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Large Image */}
              <div className="relative aspect-video w-full bg-black">
                <Image
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Captions / Details */}
              <div className="p-6 md:p-8 bg-white/5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="bg-zru-green text-white px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider">
                    {activePhoto.album}
                  </span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{activePhoto.date}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">{activePhoto.title}</h2>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  {activePhoto.description}
                </p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
