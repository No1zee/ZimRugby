"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// =============================================================================
// RUGBY BALL SVG - Decorative rugby ball shape
// =============================================================================
interface RugbyBallProps {
  className?: string;
  color?: string;
  size?: number;
}

export function RugbyBallSVG({ className = "", color = "currentColor", size = 100 }: RugbyBallProps) {
  return (
    <svg 
      viewBox="0 0 100 60" 
      width={size} 
      height={size * 0.6}
      className={className}
      fill="none"
    >
      {/* Rugby ball shape */}
      <ellipse 
        cx="50" 
        cy="30" 
        rx="45" 
        ry="25" 
        fill={color}
        opacity="0.15"
      />
      {/* Seam line */}
      <path 
        d="M10 30 Q50 10 90 30" 
        stroke={color}
        strokeWidth="1.5"
        opacity="0.3"
        fill="none"
      />
      <path 
        d="M10 30 Q50 50 90 30" 
        stroke={color}
        strokeWidth="1.5"
        opacity="0.3"
        fill="none"
      />
      {/* Center seam */}
      <line 
        x1="50" y1="5" 
        x2="50" y2="55" 
        stroke={color}
        strokeWidth="1"
        opacity="0.2"
      />
    </svg>
  );
}

// =============================================================================
// GOALPOST SVG - Decorative H-shaped goalpost
// =============================================================================
interface GoalpostProps {
  className?: string;
  color?: string;
  size?: number;
}

export function GoalpostSVG({ className = "", color = "currentColor", size = 80 }: GoalpostProps) {
  return (
    <svg 
      viewBox="0 0 60 100" 
      width={size * 0.6} 
      height={size}
      className={className}
      fill="none"
    >
      {/* Left post */}
      <line x1="10" y1="0" x2="10" y2="100" stroke={color} strokeWidth="3" opacity="0.2" />
      {/* Right post */}
      <line x1="50" y1="0" x2="50" y2="100" stroke={color} strokeWidth="3" opacity="0.2" />
      {/* Crossbar */}
      <line x1="10" y1="30" x2="50" y2="30" stroke={color} strokeWidth="4" opacity="0.3" />
    </svg>
  );
}

// =============================================================================
// FIELD LINES - Dashed rugby field markings
// =============================================================================
interface FieldLinesProps {
  className?: string;
  color?: string;
  direction?: "left" | "right";
}

export function FieldLines({ className = "", color = "#FFD200", direction = "left" }: FieldLinesProps) {
  return (
    <div className={`absolute ${direction === "left" ? "left-0" : "right-0"} ${className}`}>
      <svg 
        viewBox="0 0 100 300" 
        width="100" 
        height="300"
        className="opacity-10"
      >
        {/* Horizontal dashed lines */}
        {[0, 50, 100, 150, 200, 250].map((y, i) => (
          <line 
            key={i}
            x1={direction === "left" ? "0" : "100"} 
            y1={y} 
            x2={direction === "left" ? "80" : "20"} 
            y2={y}
            stroke={color}
            strokeWidth="2"
            strokeDasharray="10 5"
          />
        ))}
        {/* Vertical boundary line */}
        <line 
          x1={direction === "left" ? "80" : "20"} 
          y1="0" 
          x2={direction === "left" ? "80" : "20"} 
          y2="300"
          stroke={color}
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}

// =============================================================================
// DECORATIVE CHEVRONS - Dynamic arrows suggesting motion
// =============================================================================
interface ChevronsProps {
  className?: string;
  color?: string;
  direction?: "left" | "right";
}

export function Chevrons({ className = "", color = "#FFD200", direction = "left" }: ChevronsProps) {
  return (
    <div className={`absolute ${direction === "left" ? "-left-4" : "-right-4"} ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: direction === "left" ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.15 - i * 0.03 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <svg 
              viewBox="0 0 30 60" 
              width="30" 
              height="60"
              className={direction === "right" ? "rotate-180" : ""}
            >
              <path 
                d="M25 5 L5 30 L25 55" 
                stroke={color}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// =============================================================================
// RUGBY DECORATIONS WRAPPER - Full set of decorative elements for a section
// =============================================================================
interface RugbyDecorationsProps {
  variant?: "balls" | "goalposts" | "chevrons" | "mixed";
  className?: string;
}

export function RugbyDecorations({ variant = "mixed", className = "" }: RugbyDecorationsProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-30, 70]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      
      {/* Top gradient fade for seamless blending */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(10, 10, 10, 1) 0%, rgba(10, 10, 10, 0) 100%)'
        }}
      />
      
      {/* Bottom gradient fade for seamless blending */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 z-10"
        style={{
          background: 'linear-gradient(to top, rgba(10, 10, 10, 1) 0%, rgba(10, 10, 10, 0) 100%)'
        }}
      />

      {/* Left side decorations */}
      {(variant === "balls" || variant === "mixed") && (
        <motion.div 
          className="absolute -left-12 top-1/4 opacity-20"
          style={{ y: leftY, rotate }}
        >
          <RugbyBallSVG color="#FFD200" size={150} />
        </motion.div>
      )}

      {(variant === "goalposts" || variant === "mixed") && (
        <motion.div 
          className="absolute -left-6 bottom-1/4 opacity-15"
          style={{ y: rightY }}
        >
          <GoalpostSVG color="#FFD200" size={120} />
        </motion.div>
      )}

      {(variant === "chevrons" || variant === "mixed") && (
        <Chevrons direction="left" className="top-1/3" color="#FFD200" />
      )}

      {/* Right side decorations */}
      {(variant === "balls" || variant === "mixed") && (
        <motion.div 
          className="absolute -right-16 bottom-1/3 opacity-20"
          style={{ y: rightY, rotate: useTransform(scrollYProgress, [0, 1], [0, -15]) }}
        >
          <RugbyBallSVG color="#FFD200" size={180} />
        </motion.div>
      )}

      {(variant === "goalposts" || variant === "mixed") && (
        <motion.div 
          className="absolute -right-4 top-1/4 opacity-15"
          style={{ y: leftY }}
        >
          <GoalpostSVG color="#FFD200" size={100} />
        </motion.div>
      )}

      {(variant === "chevrons" || variant === "mixed") && (
        <Chevrons direction="right" className="bottom-1/3" color="#FFD200" />
      )}
    </div>
  );
}

// =============================================================================
// CORNER ACCENT - Decorative corner element
// =============================================================================
interface CornerAccentProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: string;
}

export function CornerAccent({ position, color = "#FFD200" }: CornerAccentProps) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };

  return (
    <motion.div 
      className={`absolute ${positionClasses[position]} pointer-events-none`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <svg viewBox="0 0 100 100" width="80" height="80" className="opacity-20">
        {/* Corner bracket shape */}
        <path 
          d="M0 0 L0 40 L5 40 L5 5 L40 5 L40 0 Z" 
          fill={color}
        />
        {/* Decorative dots */}
        <circle cx="15" cy="15" r="3" fill={color} opacity="0.5" />
        <circle cx="25" cy="15" r="2" fill={color} opacity="0.3" />
      </svg>
    </motion.div>
  );
}
