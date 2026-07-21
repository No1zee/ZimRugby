"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ParticleBurstLoader from "@/components/common/ParticleBurstLoader";

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  const triggerLoad = (duration: number) => {
    setLoading(true);
    setFading(false);
    const fadeTimer = setTimeout(() => setFading(true), duration - 400);
    const hideTimer = setTimeout(() => {
      setLoading(false);
      setFading(false);
    }, duration);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  };

  // Show loader on initial mount (3s so it is clearly visible)
  useEffect(() => {
    const cleanup = triggerLoad(3000);
    return cleanup;
  }, []);

  // Show loader on route change (1.5s)
  useEffect(() => {
    const cleanup = triggerLoad(1500);
    return cleanup;
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999]"
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 400ms ease-out",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <ParticleBurstLoader />
    </div>
  );
}
