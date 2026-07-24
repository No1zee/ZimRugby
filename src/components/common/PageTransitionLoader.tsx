"use client";

import { useEffect, useState } from "react";
import ParticleBurstLoader from "@/components/common/ParticleBurstLoader";

export default function PageTransitionLoader() {
  // Initialize loading to true so SSR HTML renders the dark loader overlay instantly, preventing FOUC flash
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if initial session loading screen has already run in this browser session
    const hasLoaded = typeof window !== "undefined" && sessionStorage.getItem("zru_initial_loader_shown");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    // First visit in session: trigger initial loading splash
    setLoading(true);
    setFading(false);
    sessionStorage.setItem("zru_initial_loader_shown", "true");

    const duration = 1800;
    
    const triggerExit = () => {
      setFading(true);
      setTimeout(() => {
        setLoading(false);
        setFading(false);
      }, 600); // 600ms matches the CSS clip-path exit transition duration
    };

    let timer: NodeJS.Timeout;
    if (document.readyState === "complete") {
      timer = setTimeout(triggerExit, duration - 600);
    } else {
      const handleLoad = () => {
        timer = setTimeout(triggerExit, duration - 600);
      };
      window.addEventListener("load", handleLoad);
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(timer);
      };
    }

    return () => {
      clearTimeout(timer);
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
