"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Camera, X, Calendar, Eye, Folder, ChevronLeft, Info, ShieldAlert } from "lucide-react";
import EdgyGradient from "@/components/ui/EdgyGradient";
import { Photo } from "@/types";
import PageHero from "@/components/ui/PageHero";
import { ThreeDImageRing, ImageRingItem } from "@/components/lightswind/draggable-3d-image-ring";
import ArchiveFolderCard from "@/components/gallery/ArchiveFolderCard";
import SlantedButton from "@/components/ui/SlantedButton";

interface FolderMetaData {
  name: string;
  description: string;
  image: string;
  images: string[];
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

    // Up to 4 images for the fanned stack
    const images = items.slice(0, 4).map((p) => p.image || image);
    if (images.length === 0) images.push(image);

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

    return { name, description, image, images, date, count };
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
    <main className="bg-milk-white min-h-screen pb-16 text-rich-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <EdgyGradient opacity={0.05} />
      </div>

      {/* Header section with Dynamic Titles */}
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
              {/* 3D Draggable Image Ring Showcase */}
              <div className="mb-12">
                <ThreeDImageRing
                  items={initialPhotos.slice(0, 10).map((photo) => ({
                    id: photo.id,
                    image: photo.image,
                    title: photo.title,
                    photographer: photo.photographer || "ZRU Media Team",
                    date: photo.date,
                    category: photo.folder || "SABLES ARCHIVE",
                  }))}
                  onSelectItem={(item) => {
                    const match = initialPhotos.find((p) => p.id === item.id);
                    if (match) setActivePhoto(match);
                  }}
                />
              </div>

              <div className="flex items-center gap-2 mb-2 pt-4 border-t border-black/10">
                <Folder className="w-5 h-5 text-zru-green" />
                <h2 className="text-sm font-black uppercase tracking-widest text-zru-green">Select Archive Folder</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center gap-10 py-4">
                {folders.map((folder) => (
                  <ArchiveFolderCard
                    key={folder.name}
                    name={folder.name}
                    images={folder.images}
                    date={folder.date}
                    count={folder.count}
                    description={folder.description}
                    onClick={() => {
                      setActiveFolder(folder.name);
                      setActiveAlbum("All");
                    }}
                  />
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
              <div className="flex justify-between items-center pb-4 border-b border-black/5">
                <SlantedButton
                  onClick={() => setActiveFolder(null)}
                  variant="chip"
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Back to Archives
                </SlantedButton>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-rich-black/30 uppercase tracking-widest block">Viewing Archive</span>
                  <span className="text-xs font-black uppercase text-zru-green">{activeFolder}</span>
                </div>
              </div>

              {/* Album filter options inside the folder */}
              <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                {albums.map((album) => (
                  <SlantedButton
                    key={album}
                    onClick={() => setActiveAlbum(album)}
                    variant="chip"
                    active={activeAlbum === album}
                  >
                    {album}
                  </SlantedButton>
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
                    className="break-inside-avoid mb-6 bg-white border border-black/5 rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
                    onClick={() => setActivePhoto(photo)}
                  >
                    <div
                      className={`relative w-full overflow-hidden bg-neutral-100 ${
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
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-md border border-white/40 flex items-center justify-center text-rich-black">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                      <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider text-zru-green border border-zru-green/20">
                        {photo.album}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-black uppercase tracking-tight text-rich-black line-clamp-1 group-hover:text-zru-green transition-colors duration-300">
                        {photo.title}
                      </h3>
                      <p className="text-rich-black/50 text-xs leading-relaxed line-clamp-2">
                        {photo.description}
                      </p>
                      <div className="pt-2.5 border-t border-black/5 flex justify-between items-center text-[9px] text-rich-black/40 font-bold uppercase">
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
                <div className="text-center py-24 border-2 border-dashed border-black/10 rounded-2xl bg-black/5">
                  <Camera className="w-12 h-12 text-rich-black/20 mx-auto mb-4" />
                  <p className="text-rich-black/40 font-black uppercase tracking-wider">No photos found in this sub-album</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LIGHTBOX ZOOM MODAL (Milk White Theme Alignment) */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#00170E]/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          >
            <div className="absolute inset-0" onClick={() => setActivePhoto(null)} />

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-4xl bg-milk-white border border-black/10 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-[#006747] text-rich-black hover:text-white border border-black/10 shadow-lg transition-all"
                aria-label="Close Lightbox"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video w-full bg-[#030E09] border-b border-black/10">
                <Image
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Archival metadata and details in Milk White */}
              <div className="p-6 md:p-8 bg-white space-y-4 text-rich-black">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-zru-green text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {activePhoto.album}
                  </span>
                  <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest">{activePhoto.date}</span>
                  <span className="text-black/20">|</span>
                  <span className="text-[10px] font-bold text-[#006747] uppercase tracking-widest">
                    FOLDER: {activePhoto.folder}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-heading font-black uppercase tracking-tight text-rich-black">{activePhoto.title}</h2>
                
                <p className="text-black/70 text-xs sm:text-sm font-normal leading-relaxed">{activePhoto.description}</p>

                {/* Legal compliance fields - Photographer credits & licensing details */}
                <div className="pt-4 border-t border-black/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2 text-black/60 font-bold">
                    <Info className="w-4 h-4 text-[#006747]" />
                    <span>
                      Photo Credit: <strong className="text-rich-black font-bold">{activePhoto.photographer || "ZRU Official Media"}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-black/60 font-bold">
                    <ShieldAlert className="w-4 h-4 text-[#006747]" />
                    <span>
                      Licence: <strong className="text-rich-black font-bold">{activePhoto.license || "Official Editorial Rights"}</strong>
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
