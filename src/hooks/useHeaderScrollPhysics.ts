"use client";
import { useState, useEffect, useRef } from "react";

export interface HeaderScrollState {
  scrollY: number;
  progress: number;
  compaction: number;
  isVisible: boolean;
  isScrolled: boolean;
}

export function useHeaderScrollPhysics(compactionDistance = 80): HeaderScrollState {
  const [state, setState] = useState<HeaderScrollState>({
    scrollY: 0,
    progress: 0,
    compaction: 0,
    isVisible: true,
    isScrolled: false,
  });


  const lastScrollYRef = useRef(0);
  const isVisibleRef = useRef(true);


  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId = 0;

    const updateScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, currentY / docHeight)) : 0;

      const rawCompact = Math.min(1, Math.max(0, currentY / compactionDistance));

      const deltaY = currentY - lastScrollYRef.current;
      let nextVisible = isVisibleRef.current;

      if (currentY <= 20) {
        nextVisible = true;
      } else if (deltaY > 12 && currentY > 120) {
        nextVisible = false;
      } else if (deltaY < -8) {
        nextVisible = true;
      }

      lastScrollYRef.current = currentY;
      isVisibleRef.current = nextVisible;

      setState({
        scrollY: currentY,
        progress,
        compaction: rawCompact,
        isVisible: nextVisible,
        isScrolled: currentY > 20,
      });
    };


    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [compactionDistance]);


  return state;
}
