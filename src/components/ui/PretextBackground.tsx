"use client";

import { useEffect, useRef } from "react";

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
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Use OffscreenCanvas if supported
    let offscreen: OffscreenCanvas | null = null;
    try {
      offscreen = canvas.transferControlToOffscreen();
    } catch (e) {
      console.warn("OffscreenCanvas transfer failed, falling back to basic rendering or no effect", e);
      return;
    }

    const worker = new Worker(new URL("../../workers/pretext.worker.ts", import.meta.url));
    workerRef.current = worker;

    worker.postMessage({
      type: "init",
      canvas: offscreen,
      text: text,
      dpr: window.devicePixelRatio || 1
    }, [offscreen]);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const overscan = 1.2;
      worker.postMessage({
        type: "resize",
        width: rect.width * overscan,
        height: rect.height * overscan,
        dpr: window.devicePixelRatio || 1
      });
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

      worker.postMessage({
        type: "mouseMove",
        x: (clientX / window.innerWidth) * 2 - 1,
        y: (clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      worker.terminate();
      workerRef.current = null;
    };
  }, [text]);

  const isCustomPositioning = className.includes("absolute") || className.includes("fixed") || className.includes("inset-");
  const wrapperClass = isCustomPositioning 
    ? `pointer-events-none z-0 ${className}` 
    : `absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`;

  return (
    <div ref={containerRef} className={wrapperClass}>
      <canvas
        ref={canvasRef}
        className="block absolute w-[150%] h-[150%] -left-1/4 -top-1/4 pointer-events-none"
      />
    </div>
  );
}

