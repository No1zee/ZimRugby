"use client";

import React from "react";
import { motion } from "framer-motion";

interface EdgyGradientProps {
  className?: string;
  opacity?: number;
}

export default function EdgyGradient({ className = "", opacity = 0.65 }: EdgyGradientProps) {
  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      {/* 
        GPU-Accelerated Container: 
        Uses CSS blur + translate3d to force hardware (GPU) rendering,
        preventing the CPU from re-rasterizing on every animation frame.
      */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          filter: "blur(100px)",
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden"
        }}
      >
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1000 1000" 
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Solid dark jade base layer */}
          <rect width="1000" height="1000" fill="#000e08" />
          
          {/* 1. Neon Violet & Indigo crescent at bottom-left */}
          <motion.path 
            d="M -150,550 C 50,450 150,750 350,650 C 550,550 650,850 850,750 C 1050,650 1150,1050 1150,1050 L -150,1050 Z" 
            fill="url(#violet-glow-opt)"
            initial={{ d: "M -150,550 C 50,450 150,750 350,650 C 550,550 650,850 850,750 C 1050,650 1150,1050 1150,1050 L -150,1050 Z" }}
            animate={{
              d: [
                "M -150,550 C 50,450 150,750 350,650 C 550,550 650,850 850,750 C 1050,650 1150,1050 1150,1050 L -150,1050 Z",
                "M -150,600 C 100,430 130,780 370,630 C 530,580 680,820 830,780 C 1030,670 1150,1050 1150,1050 L -150,1050 Z",
                "M -150,550 C 50,450 150,750 350,650 C 550,550 650,850 850,750 C 1050,650 1150,1050 1150,1050 L -150,1050 Z"
              ]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* 2. Soft Warm Coral wave expanding from center-right */}
          <motion.path 
            d="M 1150,150 C 950,100 750,350 600,400 C 450,450 350,250 250,400 C 150,550 50,500 -50,650 L -50,1050 L 1150,1050 Z" 
            fill="url(#coral-glow-opt)"
            opacity={0.8}
            initial={{ d: "M 1150,150 C 950,100 750,350 600,400 C 450,450 350,250 250,400 C 150,550 50,500 -50,650 L -50,1050 L 1150,1050 Z" }}
            animate={{
              d: [
                "M 1150,150 C 950,100 750,350 600,400 C 450,450 350,250 250,400 C 150,550 50,500 -50,650 L -50,1050 L 1150,1050 Z",
                "M 1150,180 C 930,130 770,320 620,370 C 470,420 330,280 230,430 C 130,580 50,480 -50,630 L -50,1050 L 1150,1050 Z",
                "M 1150,150 C 950,100 750,350 600,400 C 450,450 350,250 250,400 C 150,550 50,500 -50,650 L -50,1050 L 1150,1050 Z"
              ]
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* 3. High-intensity Gold wave floating near top-right */}
          <motion.path 
            d="M 600,0 C 750,100 900,-50 1050,50 C 1200,150 1150,400 1150,400 L 700,400 Z"
            fill="url(#gold-glow-opt)"
            opacity={0.6}
            initial={{ d: "M 600,0 C 750,100 900,-50 1050,50 C 1200,150 1150,400 1150,400 L 700,400 Z" }}
            animate={{
              d: [
                "M 600,0 C 750,100 900,-50 1050,50 C 1200,150 1150,400 1150,400 L 700,400 Z",
                "M 550,20 C 720,80 880,-20 1020,70 C 1170,160 1150,370 1150,370 L 650,420 Z",
                "M 600,0 C 750,100 900,-50 1050,50 C 1200,150 1150,400 1150,400 L 700,400 Z"
              ]
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* 4. Small glowing apricot accent circle in center-right */}
          <motion.circle 
            cx={750} 
            cy={400} 
            r={160} 
            fill="#ffedd5" 
            opacity={0.35} 
            initial={{ cx: 750, cy: 400, r: 160 }}
            animate={{
              cx: [750, 720, 780, 750],
              cy: [400, 430, 370, 400],
              r: [160, 180, 150, 160]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <defs>
            {/* Premium Athletic Violet & Royal Blue */}
            <linearGradient id="violet-glow-opt" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="50%" stopColor="#5b21b6" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            
            {/* Luminous Warm Coral & Peach */}
            <linearGradient id="coral-glow-opt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#fdba74" />
            </linearGradient>
            
            {/* ZRU Brand Green Glow */}
            <linearGradient id="gold-glow-opt" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#00452a" />
              <stop offset="50%" stopColor="#006b3f" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Dark Vignette Overlay - Concentrates glow in center/sides, fades to pure black at edges */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 60% 40%, transparent 20%, rgba(10, 10, 10, 0.35) 55%, rgba(10, 10, 10, 0.75) 80%, #0a0a0a 96%)"
        }}
      />
    </div>
  );
}
