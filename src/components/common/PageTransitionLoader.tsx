"use client";

import { useEffect, useState } from "react";
import ParticleBurstLoader from "@/components/common/ParticleBurstLoader";

export default function PageTransitionLoader() {
  const [loading, setLoading] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if initial session loading screen has already run
    const hasLoaded = typeof window !== "undefined" && sessionStorage.getItem("zru_initial_loader_shown");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    // First visit: trigger 3-second initial loading screen
    setLoading(true);
    setFading(false);
    sessionStorage.setItem("zru_initial_loader_shown", "true");

    const duration = 3000;
    const fadeTimer = setTimeout(() => setFading(true), duration - 600);
    const hideTimer = setTimeout(() => {
      setLoading(false);
      setFading(false);
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Lock body scrollbar during loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-[9999] overflow-hidden bg-[#010904]"
      style={{
        opacity: fading ? 0 : 1,
        transform: fading ? "scale(1.05)" : "scale(1)",
        clipPath: fading ? "polygon(0 0, 100% 0, 100% 0, 0 0)" : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        transition: "clip-path 600ms cubic-bezier(0.76, 0, 0.24, 1), opacity 600ms cubic-bezier(0.76, 0, 0.24, 1), transform 600ms cubic-bezier(0.76, 0, 0.24, 1)",
        pointerEvents: fading ? "none" : "all",
        willChange: "transform, opacity, clip-path",
      }}
    >
      <ParticleBurstLoader isExiting={fading} />
    </div>
  );
}
