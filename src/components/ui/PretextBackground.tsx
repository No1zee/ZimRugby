"use client";

import { useEffect, useRef } from "react";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

interface PretextBackgroundProps {
  className?: string;
  text?: string;
}

export function PretextBackground({ 
  className = "", 
  text = "WHAT'S ON?  " 
}: PretextBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    let dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prepared: any = null;
    let lastFontSize = 0;
    let cachedTextWidth = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const resize = (width?: number, height?: number) => {
      w = width || container.offsetWidth;
      h = height || container.offsetHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX, clientY;
      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else return;

      targetX = (clientX / window.innerWidth) * 2 - 1;
      targetY = (clientY / window.innerHeight) * 2 - 1;
    };

    const render = (time: number) => {
      if (w === 0 || h === 0) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      // 1. Dynamic Font Calculation
      const fontSize = Math.max(80, Math.min(w * 0.15, 250));
      const fontString = `900 ${fontSize}px Inter, "Inter Fallback", ui-sans-serif, sans-serif`;

      if (!prepared || lastFontSize !== fontSize) {
        prepared = prepareWithSegments(text, fontString);
        lastFontSize = fontSize;
        
        // Measure and cache layout only when font size changes (huge performance saving on older devices)
        const layoutData = layoutWithLines(prepared, 8000, fontSize * 1.5);
        cachedTextWidth = (layoutData.lines[0]?.width || w) * 1.2;
      }

      const textWidth = cachedTextWidth;

      // 2. Interaction Physics (Lerp)
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      const baseScrollSpeed = time * 0.03;
      const numLayers = 2;
      const layerSpacingY = fontSize * 1.5;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Apply global tilt
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-4 * Math.PI / 180);
      ctx.translate(-w / 2, -h / 2);

      const startY = -layerSpacingY * 6;
      const rowsNeeded = Math.ceil(h / layerSpacingY) + 12;

      for (let rowIdx = 0; rowIdx < rowsNeeded; rowIdx++) {
        const layerIdx = rowIdx % numLayers;
        const depth = (layerIdx + 1) / numLayers;
        const isGreen = rowIdx % 2 === 0;

        const rowY = startY + (currentY * 20) + (rowIdx * layerSpacingY);

        // Calculate dynamic edge fade based on vertical position to prevent clashing with other sections
        const rowCenterY = rowY + fontSize / 2;
        const normalizedY = rowCenterY / h;
        
        let edgeFade = 1;
        if (normalizedY < 0.25) {
          edgeFade = normalizedY / 0.25; // fade to 0 at top edge
        } else if (normalizedY > 0.75) {
          edgeFade = (1 - normalizedY) / 0.25; // fade to 0 at bottom edge
        }
        edgeFade = Math.max(0, Math.min(1, edgeFade));

        const baseOpacity = isGreen ? 0.15 : 0.12;
        const finalOpacity = baseOpacity * (depth + 0.3) * edgeFade;

        ctx.fillStyle = isGreen
          ? `rgba(0, 200, 100, ${finalOpacity})`
          : `rgba(255, 255, 255, ${finalOpacity})`;

        ctx.font = fontString;
        ctx.textBaseline = "top";

        const mouseXOffset = currentX * (depth * 60);
        const horizontalStride = textWidth * 1.5;
        const scrollAmount = (baseScrollSpeed * depth) % horizontalStride;

        let txStart = mouseXOffset + (isGreen ? -scrollAmount : scrollAmount);
        txStart = ((txStart % horizontalStride) + horizontalStride) % horizontalStride - horizontalStride;

        for (let tx = txStart; tx < w + horizontalStride; tx += horizontalStride) {
          ctx.fillText(text, tx, rowY);
        }
      }
      ctx.restore();

      animFrameId = requestAnimationFrame(render);
    };

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        resize(entry.contentRect.width, entry.contentRect.height);
      }
    });
    ro.observe(container);

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    animFrameId = requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      cancelAnimationFrame(animFrameId);
    };
  }, [text]);

  const isCustomPositioning = className.includes("absolute") || className.includes("fixed") || className.includes("inset-");
  const hasZIndex = className.includes("z-");
  const wrapperClass = isCustomPositioning 
    ? `pointer-events-none ${hasZIndex ? "" : "z-0"} ${className}` 
    : `absolute inset-0 pointer-events-none overflow-hidden ${hasZIndex ? "" : "z-0"} ${className}`;

  return (
    <div ref={containerRef} className={wrapperClass}>
      <canvas
        key={text}
        ref={canvasRef}
        className="block absolute w-full h-full left-0 top-0 pointer-events-none"
      />
    </div>
  );
}
