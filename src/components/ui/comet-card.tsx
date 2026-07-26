"use client";

import { useRef, useCallback } from "react";

interface CometCardProps {
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * 3D mouse-tracking card — pure CSS transform approach.
 * Uses CSS custom properties + onMouseMove for zero-dependency 3D tilt.
 * Works reliably inside overflow-hidden containers.
 */
export function CometCard({
  rotateDepth = 17.5,
  translateDepth = 20,
  className = "",
  children,
}: CometCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      el.style.setProperty("--rx", `${-normY * rotateDepth}deg`);
      el.style.setProperty("--ry", `${normX * rotateDepth}deg`);
      el.style.setProperty("--tx", `${normX * translateDepth}px`);
      el.style.setProperty("--ty", `${normY * translateDepth}px`);
      el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
    },
    [rotateDepth, translateDepth],
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--tx", "0px");
    el.style.setProperty("--ty", "0px");
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`comet-card group relative ${className}`}
      style={{
        transform:
          "perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateX(var(--tx, 0px)) translateY(var(--ty, 0px))",
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease-out",
      }}
    >
      {/* Mouse-following spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          borderRadius: "inherit",
          background:
            "radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(0,103,71,0.12), transparent 60%)",
        }}
      />
      <div className="relative z-20">{children}</div>
    </div>
  );
}
