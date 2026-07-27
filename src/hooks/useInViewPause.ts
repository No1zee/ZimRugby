"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns true when the element is visible in viewport AND the document is not hidden.
 * Attach the returned ref to the element you want to track.
 * Use this to pause intervals/RAFs when off-screen to save battery on mobile.
 */
export function useInViewPause(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && !document.hidden);
      },
      { threshold: 0, ...options },
    );

    observer.observe(el);

    function handleVisibility() {
      setIsActive((prev) => {
        const visible = observer.takeRecords().some((r) => r.isIntersecting) ?? false;
        return visible && !document.hidden;
      });
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [options?.threshold, options?.rootMargin]);

  return { ref, isActive };
}
