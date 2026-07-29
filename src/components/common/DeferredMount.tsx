"use client";

import React, { useState, useEffect, useRef } from "react";

interface DeferredMountProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}

export default function DeferredMount({
  children,
  fallback = null,
  rootMargin = "200px 0px",
}: DeferredMountProps) {
  const [shouldMount, setShouldMount] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldMount) return;
    const el = containerRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setShouldMount(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldMount, rootMargin]);

  return (
    <div ref={containerRef}>
      {shouldMount ? children : fallback}
    </div>
  );
}
