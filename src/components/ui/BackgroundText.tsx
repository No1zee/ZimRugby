"use client";

import { motion } from "framer-motion";

interface BackgroundTextProps {
  /** Text to repeat */
  text: string;
  /** Number of repetitions */
  repeat?: number;
  /** Orientation */
  orientation?: "horizontal" | "diagonal";
  /** Color theme */
  color?: "navy" | "gray" | "green";
  /** Additional className */
  className?: string;
}

/**
 * Oversized repeated background text like "WHAT'S ON?" / "A GAME FOR ALL"
 * from World Rugby / HK Rugby design.
 */
export function BackgroundText({
  text,
  repeat = 2,
  orientation = "horizontal",
  color = "gray",
  className = "",
}: BackgroundTextProps) {
  
  const colorMap = {
    navy: "rgba(9, 31, 64, 0.15)",
    gray: "rgba(128, 128, 128, 0.08)",
    green: "rgba(0, 96, 57, 0.2)",
  };

  const repeatedText = Array(repeat).fill(text).join(" ");

  return (
    <motion.div
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div
        className="whitespace-nowrap select-none"
        style={{
          fontFamily: "var(--font-heading), sans-serif",
          fontSize: "clamp(100px, 18vw, 250px)",
          fontWeight: 900,
          letterSpacing: "0.05em",
          color: colorMap[color],
          transform: orientation === "diagonal" ? "rotate(-5deg)" : "none",
          lineHeight: 1.1,
        }}
      >
        {/* First line */}
        <div className="overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ x: "0%" }}
            animate={{ x: "-10%" }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop" 
            }}
          >
            {repeatedText} {repeatedText}
          </motion.span>
        </div>
        
        {/* Second line offset */}
        <div className="overflow-hidden -mt-4">
          <motion.span
            className="inline-block"
            initial={{ x: "-10%" }}
            animate={{ x: "0%" }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop" 
            }}
          >
            {repeatedText} {repeatedText}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

export default BackgroundText;
