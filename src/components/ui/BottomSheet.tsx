"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Bottom Sheet wrapper */}
          <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none pb-[max(env(safe-area-inset-bottom),0px)]">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 600) {
                  onClose();
                }
              }}
              className="w-full max-w-xl bg-linear-to-b from-neutral-900 to-black border-t border-white/10 rounded-t-3xl p-6 pointer-events-auto relative shadow-[0_-20px_50px_rgba(0,0,0,0.8)] focus:outline-none"
            >
              {/* Drag Handle Indicator */}
              <div className="flex justify-center mb-4 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors" />
              </div>

              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading text-2xl text-white uppercase tracking-wider">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="max-h-[70vh] overflow-y-auto overscroll-contain pr-1 scrollbar-hide text-white/80 text-sm">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
