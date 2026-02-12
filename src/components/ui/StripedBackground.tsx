"use client";

import { motion } from "framer-motion";

interface StripedBackgroundProps {
  /** Stripe style variant */
  variant?: "subtle" | "bold" | "accent";
  /** Position of stripes */
  position?: "left" | "right" | "both";
  /** Color theme */
  color?: "red" | "gold" | "green" | "white";
  /** Additional className */
  className?: string;
}

/**
 * Clean diagonal stripe background with just a few lines.
 * Inspired by HK Rugby design.
 */
export function StripedBackground({
  variant = "subtle",
  position = "right",
  color = "gold",
  className = "",
}: StripedBackgroundProps) {
  
  const colorMap = {
    red: "#D71920",
    gold: "#FFD200",
    green: "#006039",
    white: "#FFFFFF",
  };

  const opacityMap = {
    subtle: 0.3,
    bold: 0.5,
    accent: 0.8,
  };

  const strokeColor = colorMap[color];
  const opacity = opacityMap[variant];

  return (
    <>
      {/* Right stripes - Simple clean lines */}
      {(position === "right" || position === "both") && (
        <motion.div
          className={`absolute top-0 right-0 bottom-0 w-32 md:w-48 pointer-events-none z-0 hidden md:block overflow-hidden ${className}`}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* SVG with clean diagonal lines - staggered fade in + floating */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* 3 clean diagonal lines with staggered fade-in */}
            <motion.line 
              x1="40" y1="0" x2="140" y2="100" 
              stroke={strokeColor} strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: opacity * 0.6 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.line 
              x1="60" y1="0" x2="160" y2="100" 
              stroke={strokeColor} strokeWidth="3"
              initial={{ opacity: 0 }}
              animate={{ opacity: opacity * 0.8 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
            <motion.line 
              x1="80" y1="0" x2="180" y2="100" 
              stroke={strokeColor} strokeWidth="4"
              initial={{ opacity: 0 }}
              animate={{ opacity: opacity }}
              transition={{ duration: 0.8, delay: 0.9 }}
            />
          </motion.svg>
        </motion.div>
      )}

      {/* Left stripes */}
      {(position === "left" || position === "both") && (
        <motion.div
          className={`absolute top-0 left-0 bottom-0 w-32 md:w-48 pointer-events-none z-0 hidden md:block overflow-hidden ${className}`}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <line x1="-20" y1="100" x2="80" y2="0" stroke={strokeColor} strokeWidth="2" opacity={opacity * 0.4} />
            <line x1="0" y1="100" x2="100" y2="0" stroke={strokeColor} strokeWidth="2" opacity={opacity * 0.6} />
            <line x1="20" y1="100" x2="120" y2="0" stroke={strokeColor} strokeWidth="3" opacity={opacity * 0.8} />
            <line x1="40" y1="100" x2="140" y2="0" stroke={strokeColor} strokeWidth="4" opacity={opacity} />
          </motion.svg>
        </motion.div>
      )}
    </>
  );
}

export default StripedBackground;
