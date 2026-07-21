"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      initial={isMobile ? { opacity: 0, x: 20 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Premium easing curve (fast out, slow in)
      }}
      className="min-h-[calc(100vh-80px)]"
    >
      {children}
    </motion.div>
  );
}
