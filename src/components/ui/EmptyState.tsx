"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  Icon?: LucideIcon;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({
  title,
  description,
  Icon,
  action,
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-2xl mx-auto py-16 px-6 border border-white/5 bg-white/2 rounded-3xl text-center overflow-hidden flex flex-col items-center justify-center min-h-[300px]"
    >
      {/* 1. Large SVG Watermark in the background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          className="w-72 h-72 text-white fill-none stroke-current stroke-[1.5]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized shield outline resembling ZRU shield logo */}
          <path d="M50,10 L80,25 C80,60 50,90 50,90 C50,90 20,60 20,25 Z" />
          <path d="M50,22 L72,33 C72,58 50,80 50,80 C50,80 28,58 28,33 Z" />
          <circle cx="50" cy="50" r="10" />
        </svg>
      </div>

      {/* 2. Content */}
      <div className="relative z-10 space-y-6 max-w-md">
        {Icon ? (
          <div className="mx-auto w-12 h-12 rounded-full bg-zru-green/10 flex items-center justify-center text-zru-green border border-zru-green/20">
            <Icon className="w-5 h-5" />
          </div>
        ) : (
          <div className="mx-auto w-14 h-14 opacity-25">
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full text-white fill-none stroke-current stroke-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-heading font-black uppercase tracking-wide text-white leading-tight">
            {title}
          </h3>
          <p className="text-white/50 font-subheading text-xs sm:text-sm font-medium leading-relaxed">
            {description}
          </p>
        </div>

        {action && (
          <div className="pt-2">
            <Link 
              href={action.href}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-zru-green text-white hover:bg-zru-green/80 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg shadow-zru-green/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{action.label}</span>
            </Link>
          </div>
        )}
      </div>

    </motion.div>
  );
}
