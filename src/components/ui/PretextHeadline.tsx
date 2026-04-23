"use client";

import React, { useEffect, useRef } from 'react';
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

interface PretextHeadlineProps {
  text: string;
  className?: string;
  maxFontSize?: number;
  minFontSize?: number;
}

export const PretextHeadline: React.FC<PretextHeadlineProps> = ({ 
  text, 
  className = "", 
  maxFontSize = 120,
  minFontSize = 40
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (width?: number) => {
      const targetWidth = width || container.offsetWidth;
      if (targetWidth === 0) return;
      
      // Binary search for the perfect font size to fill width
      let low = minFontSize;
      let high = maxFontSize;
      let bestSize = minFontSize;
      
      const fontName = 'ui-sans-serif, system-ui, -apple-system, sans-serif';
      
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const font = `900 ${mid}px ${fontName}`;
        const prepared = prepareWithSegments(text.toUpperCase(), font);
        const layout = layoutWithLines(prepared, 5000, mid * 1.5); // Large width to prevent wrap during measurement
        
        // Find max line width
        const maxWidth = Math.max(...layout.lines.map(l => l.width));
        
        if (maxWidth <= targetWidth) {
          bestSize = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      // Final Render
      const dpr = window.devicePixelRatio || 1;
      const finalFont = `900 ${bestSize}px ${fontName}`;
      const prepared = prepareWithSegments(text.toUpperCase(), finalFont);
      const layout = layoutWithLines(prepared, targetWidth, bestSize * 1.1);
      
      canvas.width = targetWidth * dpr;
      canvas.height = (layout.lines.length * bestSize * 1.1) * dpr;
      ctx.scale(dpr, dpr);
      
      ctx.clearRect(0, 0, targetWidth, canvas.height);
      ctx.font = finalFont;
      ctx.fillStyle = 'white';
      ctx.textBaseline = 'top';
      ctx.letterSpacing = '-0.05em'; // Tracking-tighter

      layout.lines.forEach((line, i) => {
        ctx.fillText(line.text, 0, i * bestSize * 0.9); // Leading-none (tight)
      });
    };

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        render(entry.contentRect.width);
      }
    });
    ro.observe(container);
    render();

    return () => ro.disconnect();
  }, [text, maxFontSize, minFontSize]);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <canvas ref={canvasRef} className="w-full h-auto block" />
    </div>
  );
};
