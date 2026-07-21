"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export default function ParticleBurstLoader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 70;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * (Math.random() * 8 + 2),
      vy: (Math.random() - 0.5) * (Math.random() * 8 + 2),
      radius: Math.random() * 3 + 1,
      color: Math.random() > 0.3 ? "#006B3F" : "#ffffff",
      alpha: 1,
      decay: Math.random() * 0.015 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          p.x = width / 2;
          p.y = height / 2;
          p.alpha = 1;
          p.vx = (Math.random() - 0.5) * (Math.random() * 8 + 2);
          p.vy = (Math.random() - 0.5) * (Math.random() * 8 + 2);
        }

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#001c10] text-white">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center animate-pulse">
        <div className="w-24 h-24 relative mb-4 drop-shadow-[0_0_25px_rgba(0,107,63,0.8)]">
          <Image
            src="/images/logos/zru-logo.svg"
            alt="Zimbabwe Rugby Union"
            fill
            className="object-contain"
          />
        </div>
        <span className="font-heading text-lg tracking-[0.3em] uppercase text-white font-bold">
          ZIMBABWE RUGBY
        </span>
        <span className="text-[10px] tracking-[0.4em] uppercase text-zru-green font-semibold mt-1">
          UNITED BY PASSION
        </span>
      </div>
    </div>
  );
}
