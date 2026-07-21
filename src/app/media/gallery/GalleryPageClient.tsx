"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Camera, X, Calendar, Eye, Folder, ChevronLeft, Info, ShieldAlert } from "lucide-react";
import EdgyGradient from "@/components/ui/EdgyGradient";
import { Photo } from "@/types";
import PageHero from "@/components/ui/PageHero";

interface FolderMetaData {
  name: string;
  description: string;
  image: string;
  date: string;
  count: number;
}

interface GalleryPageClientProps {
  initialPhotos: Photo[];
}

export default function GalleryPageClient({ initialPhotos }: GalleryPageClientProps) {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<string>("All");
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  // Compute clean folders and count items in them
  const folderNames = ["Battle of the Zambezi (2026)", "Sables Women", "Nations Cup (2026)", "General Sables Archive"];

  const getFolderMetadata = (name: string): FolderMetaData => {
    const items = initialPhotos.filter((p) => (p.folder || "General Sables Archive") === name);
    const count = items.length;

    // Pick first image or defaults
    let image = "/images/media/vid1.jpg";
    if (count > 0 && items[0].image) {
      image = items[0].image;
    }

    let date = "2026";
    let description = "Archived squad and campaign photography.";

    if (name === "Battle of the Zambezi (2026)") {
      date = "12 JUL 2026";
      description = "Official matchday archives of the historic battle between the Zimbabwe Sables and Zambia at Harare Sports Club.";
    } else if (name === "Sables Women") {
      date = "JUN-JUL 2026";
      description = "Training matches, team announcements, and official portraits of the Lady Sables national squad.";
    } else if (name === "Nations Cup (2026)") {
      date = "JUN 2026";
      description = "Squad arrivals and preparations during the European high-performance campaign.";
    } else {
      date = "2025 - 2026";
      description = "General collections, historical squad pictures, community festivals, and training camps.";
    }

    return { name, description, image, date, count };
  };

  const folders = folderNames
    .map((name) => getFolderMetadata(name))
    .filter((f) => f.count > 0);

  const albums = ["All", "Match Day", "Historical Collections", "Community Rugby", "Training Camps"];

  const filteredPhotos = initialPhotos.filter(
    (photo) =>
      (!activeFolder || (photo.folder || "General Sables Archive") === activeFolder) &&
      (activeAlbum === "All" || photo.album === activeAlbum)
  );

  return (
    <main className="bg-rich-black min-h-screen pb-24 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <EdgyGradient opacity={0.4} />
      </div>

      {/* Header section with Dynamic Titles */}
      <div className="pt-24">
        <PageHero
          title={activeFolder ? activeFolder : "ZRU Media Archives"}
          subtitle={
            activeFolder
              ? folders.find((f) => f.name === activeFolder)?.description || ""
              : "Access the definitive high-performance matchday logs, campaign histories, and squad galleries."
          }
          tag="Historical Archive"
          backgroundImage="/images/media/vid1.jpg"
          breadcrumb={
            activeFolder
              ? [
                  { label: "Archives", href: "/media/gallery" },
                  { label: activeFolder.substring(0, 20) + "...", href: "#" },
                ]
              : [{ label: "Archives", href: "/media/gallery" }]
          }
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <AnimatePresence mode="wait">
          {!activeFolder ? (
            /* FOLDER DIRECTORY SCREEN */
            <motion.div
              key="folders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <Folder className="w-5 h-5 text-zru-green" />
                <h2 className="text-sm font-black uppercase tracking-widest text-zru-green">Select Archive Folder</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {folders.map((folder) => (
                  <div
                    key={folder.name}
                    onClick={() => {
                      setActiveFolder(folder.name);
                      setActiveAlbum("All");
                    }}
                    className="relative rounded-2xl border border-white/5 bg-neutral-900/60 backdrop-blur-md overflow-hidden group cursor-pointer hover:border-zru-green/30 transition-all duration-500 shadow-2xl flex flex-col h-80 justify-end p-8"
                  >
                    {/* Folder Image Cover */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={folder.image}
                        alt={folder.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                    </div>

                    {/* Metadata tags */}
                    <div className="relative z-10 space-y-4">
                      <div className="flex gap-2 items-center text-[10px] font-black uppercase tracking-widest text-zru-green">
                        <span>{folder.date}</span>
                        <span className="text-white/20">•</span>
                        <span>{folder.count} IMAGES</span>
                      </div>

                      <h3 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-zru-green transition-colors duration-300">
                        {folder.name}
                      </h3>

                      <p className="text-white/50 text-sm leading-relaxed max-w-lg">
                        {folder.description}
                      </p>

                      <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/40 group-hover:text-white transition-colors">
                        <span>Open Folder</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* FOLDER PHOTO BROWSER SCREEN */
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Back to folders navigation row */}
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <button
                  onClick={() => setActiveFolder(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 text-white/80 hover:text-white transition-all text-xs font-bold uppercase tracking-wider bg-white/5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Archives</span>
                </button>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Viewing Archive</span>
                  <span className="text-xs font-black uppercase text-zru-green">{activeFolder}</span>
                </div>
              </div>

              {/* Album filter options inside the folder */}
              <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
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

              {/* Grid Layout of photos inside folder */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-0 w-full [column-fill:_balance]">
                {filteredPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ y: -5 }}
                    className="break-inside-avoid mb-8 card-green border border-white/5 bg-neutral-900/40 backdrop-blur-md rounded-2xl overflow-hidden group cursor-pointer shadow-xl flex flex-col"
                    onClick={() => setActivePhoto(photo)}
                  >
                    <div
                      className={`relative w-full overflow-hidden bg-neutral-950 ${
                        index % 3 === 0 ? "h-64" : index % 3 === 1 ? "h-80" : "h-56"
                      }`}
                    >
                      <Image
                        src={photo.image}
                        alt={photo.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                      <span className="absolute top-4 left-4 bg-black/85 px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider text-zru-green border border-zru-green/20">
                        {photo.album}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-black uppercase tracking-tight text-white line-clamp-1 group-hover:text-zru-green transition-colors duration-300">
                        {photo.title}
                      </h3>
                      <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                        {photo.description}
                      </p>
                      <div className="pt-2.5 border-t border-white/5 flex justify-between items-center text-[9px] text-white/40 font-bold uppercase">
                        <div className="flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-zru-green" />
                          <span>{photo.photographer?.substring(0, 15)}</span>
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
                  <p className="text-white/40 font-black uppercase tracking-wider">No photos found in this sub-album</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LIGHTBOX ZOOM MODAL */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10"
          >
            <div className="absolute inset-0" onClick={() => setActivePhoto(null)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/60 hover:text-white transition-colors"
                aria-label="Close Lightbox"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video w-full bg-black">
                <Image
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Archival metadata and details */}
              <div className="p-6 md:p-8 bg-white/5 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-zru-green text-white px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider">
                    {activePhoto.album}
                  </span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{activePhoto.date}</span>
                  <span className="text-white/20">|</span>
                  <span className="text-[10px] font-bold text-zru-green uppercase tracking-widest">
                    FOLDER: {activePhoto.folder}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">{activePhoto.title}</h2>
                
                <p className="text-white/70 text-sm leading-relaxed">{activePhoto.description}</p>

                {/* Legal compliance fields - Photographer credits & licensing details */}
                <div className="pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2 text-white/50">
                    <Info className="w-4 h-4 text-zru-green" />
                    <span>
                      Photographer: <strong className="text-white">{activePhoto.photographer}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <ShieldAlert className="w-4 h-4 text-zru-green" />
                    <span>
                      Licence: <strong className="text-white">{activePhoto.license}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
