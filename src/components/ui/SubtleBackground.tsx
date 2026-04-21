"use client";

import { motion } from "framer-motion";

interface SubtleBackgroundProps {
  className?: string;
}

export default function SubtleBackground({ 
  className = "",
}: SubtleBackgroundProps) {
  
  // "Flow" variant - drifting gradients
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Primary drifting blob */}
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-linear-to-br from-transparent via-zru-green/5 to-transparent rounded-full blur-3xl"
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
        className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] bg-linear-to-tl from-transparent via-zru-green/5 to-transparent rounded-full blur-3xl"
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
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-pattern-noise"></div>
    </div>
  );
}
