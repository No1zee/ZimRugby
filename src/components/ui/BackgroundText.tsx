"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface BackgroundTextProps {
  /** Text to repeat */
  text: string;
  /** Number of repetitions */
  repeat?: number;
  /** Orientation */
  orientation?: "horizontal" | "diagonal";
  /** Color theme */
  color?: "navy" | "gray" | "green";
  /** Animation style */
  animation?: "marquee" | "scroll";
  /** Additional className */
  className?: string;
}

/**
 * Oversized repeated background text like "WHAT'S ON?" / "A GAME FOR ALL"
 * from World Rugby / HK Rugby design.
 */
export function BackgroundText({
  text,
  repeat = 4,
  orientation = "horizontal",
  color = "gray",
  animation = "marquee",
  className = "",
}: BackgroundTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  const colorMap = {
    navy: "rgba(9, 31, 64, 0.5)",
    gray: "rgba(200, 200, 200, 0.12)",
    green: "rgba(0, 150, 80, 0.55)",
  };

  const repeatedText = Array(repeat).fill(text).join(" ");

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
    >
      <div
        className={`whitespace-nowrap select-none font-heading font-black leading-[1.1] tracking-[0.05em] text-[clamp(100px,18vw,250px)] text-color-${color} ${orientation === "diagonal" ? "rotate-diagonal" : ""}`}
      >
        {/* First line */}
        <div className="overflow-hidden">
          <motion.span
            className="inline-block"
            style={{ y: animation === "scroll" ? y1 : 0 }}
            animate={animation === "marquee" ? { x: ["-0%", "-50%"] } : {}}
            transition={animation === "marquee" ? { 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop"
            } : {}}
          >
            {repeatedText} {repeatedText}
          </motion.span>
        </div>
        
        {/* Second line offset */}
        <div className="overflow-hidden -mt-4">
          <motion.span
            className="inline-block"
            style={{ y: animation === "scroll" ? y2 : 0 }}
            animate={animation === "marquee" ? { x: ["-50%", "0%"] } : {}}
            transition={animation === "marquee" ? { 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop"
            } : {}}
          >
            {repeatedText} {repeatedText}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

export default BackgroundText;
