"use client";

import { useEffect, useState } from "react";

/**
 * Returns true if the user has enabled "prefers-reduced-motion" in their OS.
 * Used to disable CometCard 3D tilt and other animations for accessibility.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    function handler(e: MediaQueryListEvent) {
      setPrefersReduced(e.matches);
    }
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
