"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Center cursor slightly offset
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        duration: 0.15, // Smooth lag
        x: e.clientX,
        y: e.clientY,
        ease: "power2.out"
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If we are over a button, link, or cursor-none element, scale up
      if (
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.cursor-none') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        gsap.to(cursor, { scale: 3, opacity: 0.5, duration: 0.3 });
      } else {
        gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full mix-blend-difference pointer-events-none z-9999 hidden md:block will-change-transform"
    />
  );
}
