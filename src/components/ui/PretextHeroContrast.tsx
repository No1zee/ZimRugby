"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { computePretextLayout, type PretextLineLayout } from "@/lib/pretext/measure";

export interface PretextHeroContrastProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  font?: string;
  lineHeight?: number;
  backdropColor?: string;
  backdropPaddingX?: number;
  backdropPaddingY?: number;
  borderRadius?: number;
  showBackdrop?: boolean;
  className?: string;
}

export function PretextHeroContrast({
  text,
  as: Component = "h1",
  font = "700 32px 'Montserrat', sans-serif",
  lineHeight = 40,
  backdropColor = "rgba(0, 45, 25, 0.88)",
  backdropPaddingX = 8,
  backdropPaddingY = 2,
  borderRadius = 6,
  showBackdrop = true,
  className = "",
}: PretextHeroContrastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const layout: PretextLineLayout = useMemo(() => {
    if (!isClient || containerWidth <= 0 || !text) {
      return {
        lines: [],
        lineCount: 1,
        maxLineWidth: 0,
        totalHeight: lineHeight,
      };
    }
    return computePretextLayout(text, font, containerWidth, lineHeight);
  }, [text, font, containerWidth, lineHeight, isClient]);

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {showBackdrop && isClient && layout.lines.length > 0 && (
        <svg
          className="pointer-events-none absolute inset-0 -z-10 overflow-visible"
          width={containerWidth}
          height={layout.totalHeight}
          aria-hidden="true"
        >
          <defs>
            <filter id="pretext-subtle-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4" floodColor="#000" />
            </filter>
          </defs>
          {layout.lines.map((line, idx) => {
            const rectWidth = line.width + backdropPaddingX * 2;
            const rectHeight = lineHeight - backdropPaddingY * 2;
            const yPos = idx * lineHeight + backdropPaddingY;
            const xPos = 0;

            return (
              <rect
                key={idx}
                x={xPos}
                y={yPos}
                width={rectWidth}
                height={rectHeight}
                rx={borderRadius}
                ry={borderRadius}
                fill={backdropColor}
                filter="url(#pretext-subtle-shadow)"
              />
            );
          })}
        </svg>
      )}
      <Component className="relative z-0 leading-tight m-0 text-white font-black tracking-tight">
        {text}
      </Component>
    </div>
  );
}