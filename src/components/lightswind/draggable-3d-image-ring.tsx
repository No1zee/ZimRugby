"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Camera, MoveHorizontal, Maximize2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ImageRingItem {
  id: string;
  image: string;
  title: string;
  photographer?: string;
  date?: string;
  category?: string;
}

interface ThreeDImageRingProps {
  items: ImageRingItem[];
  onSelectItem?: (item: ImageRingItem) => void;
}

export function ThreeDImageRing({ items, onSelectItem }: ThreeDImageRingProps) {
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startRotation, setStartRotation] = useState(0);
  const [activeItem, setActiveItem] = useState<ImageRingItem | null>(items[0] || null);
  const [showToast, setShowToast] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss Drag Toast after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Default to 8 slots or items.length
  const totalItems = items.length > 0 ? items.length : 8;
  const radius = typeof window !== "undefined" && window.innerWidth < 640 ? 170 : 420;
  const angleStep = 360 / totalItems;

  // Auto-rotate slowly when not dragging (bypassed on mobile to prevent scroll jank)
  useEffect(() => {
    if (isDragging) return;
    const isMobileDevice = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobileDevice) return; // Disable continuous 3D rotation loop on mobile

    const interval = setInterval(() => {
      setRotationY((prev) => prev - 0.3);
    }, 30);

    return () => clearInterval(interval);
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setStartRotation(rotationY);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    setRotationY(startRotation + deltaX * 0.4);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full space-y-6 select-none">
      
      {/* 3D Stage Section */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className="relative w-full h-[380px] sm:h-[460px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing rounded-3xl bg-gradient-to-b from-[#010C07] via-[#00170E] to-[#010704] border border-[#006747]/30 shadow-2xl"
        style={{ perspective: "1200px" }}
      >
        {/* Ambient Radial Floodlight Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,103,71,0.35)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
          <span className="px-3 py-1 bg-black/60 border border-[#006747]/40 text-white rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 backdrop-blur-md">
            <Camera className="w-3.5 h-3.5 text-[#006747]" />
            <span>3D MATCHDAY GALLERY RING</span>
          </span>

          <AnimatePresence>
            {showToast && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                transition={{ duration: 0.3 }}
                className="px-3 py-1 bg-[#006747] border border-white/20 text-white rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 backdrop-blur-md shadow-lg"
              >
                <MoveHorizontal className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>DRAG TO ROTATE</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* 3D Rotating Ring Container */}
        <div
          className="relative w-[180px] sm:w-[220px] h-[240px] sm:h-[290px] transition-transform duration-75 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotationY}deg)`,
          }}
        >
          {items.map((item, index) => {
            const itemAngle = index * angleStep;
            return (
              <div
                key={item.id || index}
                onClick={() => {
                  setActiveItem(item);
                  if (onSelectItem) onSelectItem(item);
                }}
                className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-white/15 hover:border-[#006747] shadow-2xl transition-all duration-300 group hover:scale-105 cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Image */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="220px"
                />

                {/* Dark Gradient Overlay & Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <div className="w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5 text-[#006747]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    {item.category && (
                      <span className="text-[8px] font-black text-white/80 uppercase tracking-widest block">
                        {item.category}
                      </span>
                    )}
                    <h4 className="text-xs font-heading font-black text-white uppercase line-clamp-2 leading-tight">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stage Base Reflection Shadow */}
        <div className="absolute bottom-2 inset-x-12 h-6 bg-[#006747]/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Selected Active Photo Bar in Milk White */}
      {activeItem && (
        <div className="bg-white border border-black/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#006747]/30 shadow-sm">
              <Image src={activeItem.image} alt={activeItem.title} fill sizes="56px" className="object-cover" />
            </div>
            <div>
              <span className="text-[9px] font-black text-[#006747] tracking-widest uppercase block">SELECTED FEATURED SHOT</span>
              <h3 className="text-sm sm:text-base font-heading font-black text-rich-black uppercase leading-tight">{activeItem.title}</h3>
              {activeItem.photographer && (
                <span className="text-xs text-black/60 font-normal block">Credit: {activeItem.photographer}</span>
              )}
            </div>
          </div>

          <button
            onClick={() => onSelectItem && onSelectItem(activeItem)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#006747] text-white hover:bg-black transition-colors rounded-xl font-heading font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg"
          >
            <Maximize2 className="w-4 h-4" />
            <span>OPEN LIGHTBOX</span>
          </button>
        </div>
      )}

    </div>
  );
}
