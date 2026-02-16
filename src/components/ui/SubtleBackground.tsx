"use client";

import { motion } from "framer-motion";

interface SubtleBackgroundProps {
  variant?: "flow" | "pulse";
  className?: string;
  intensity?: "low" | "medium" | "high";
}

const variants = {
  flow: {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
    },
    transition: {
      duration: 20,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "linear",
    },
  },
};

export default function SubtleBackground({ 
  variant = "flow", 
  className = "",
  intensity = "low" 
}: SubtleBackgroundProps) {
  
  const opacity = intensity === "low" ? 0.03 : intensity === "medium" ? 0.05 : 0.08;

  if (variant === "pulse") {
    return (
      <motion.div
        className={`absolute inset-0 pointer-events-none ${className}`}
        initial={{ opacity: 0.02 }}
        animate={{ opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-zru-green" />
      </motion.div>
    );
  }

  // "Flow" variant - drifting gradients
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Primary drifting blob */}
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-transparent via-zru-green/5 to-transparent rounded-full blur-3xl"
        animate={{
          transform: [
            "translate(0%, 0%) rotate(0deg)",
            "translate(-10%, -5%) rotate(5deg)",
            "translate(5%, 10%) rotate(-5deg)",
            "translate(0%, 0%) rotate(0deg)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Secondary drifting blob (counter-movement) */}
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] bg-gradient-to-tl from-transparent via-zru-green/5 to-transparent rounded-full blur-3xl"
        animate={{
          transform: [
            "translate(0%, 0%) scale(1)",
            "translate(10%, 5%) scale(1.1)",
            "translate(-5%, -10%) scale(0.9)",
            "translate(0%, 0%) scale(1)",
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Optional: subtle grain overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
}
