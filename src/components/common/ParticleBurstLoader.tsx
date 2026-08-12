"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

interface ParticleBurstLoaderProps {
  isExiting?: boolean;
}

export default function ParticleBurstLoader({ isExiting = false }: ParticleBurstLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = typeof window !== "undefined" && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    if (isMobile) return;

    let animationFrameId: number;

    // Measure exact bounding rect to prevent window vs client size mismatch
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || window.innerWidth;
      canvas.height = rect.height || window.innerHeight;
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Official ZRU & Zimbabwe Flag Brand Colors (Green, Emerald Glow, Mint, Gold, Red, White)
    const colors = [
      "#006747", // ZRU Official Green
      "#00FF87", // Dynamic Emerald Glow
      "#34D399", // Mint Accent
      "#FFC72C", // Zimbabwe Gold
      "#E4002B", // Chevron Red
      "#FFFFFF", // Pure White
    ];

    const particleCount = 90;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      decay: number;
    }

    const createParticle = (isInitial = false): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const mult = isExiting ? 3.5 : 1.0;
      const speed = (Math.random() * 5.0 + 1.6) * mult;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // If initial spawn, pre-distribute particles along trajectory to avoid double burst on t=0
      const distanceOffset = isInitial ? Math.random() * 120 : 0;

      return {
        x: centerX + Math.cos(angle) * distanceOffset,
        y: centerY + Math.sin(angle) * distanceOffset,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: isInitial ? Math.random() * 0.8 + 0.2 : 1,
        decay: isExiting ? 0.03 : Math.random() * 0.012 + 0.006,
      };
    };

    const particles: Particle[] = Array.from({ length: particleCount }).map(() => createParticle(true));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles[i] = createParticle(false);
        }

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = isExiting ? 24 : 14;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isExiting]);

  return (
    <div className="fixed inset-0 w-full h-full z-50 flex flex-col items-center justify-center bg-[#010904] text-white overflow-hidden select-none">
      {/* Stadium Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(0, 107, 63, 0.42) 0%, rgba(1, 20, 10, 0.9) 55%, #010804 100%)`,
          opacity: isExiting ? 0.2 : 1,
        }}
      />

      {/* Dynamic Radial Canvas Burst */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-90" />

      {/* Emblem & Ambient Backlight Stage */}
      <div className="relative z-20 flex items-center justify-center">
        {/* Pulsing Emerald Backlight Aura */}
        <div 
          className={`absolute rounded-full bg-[#006B3F]/40 blur-3xl pointer-events-none transition-all duration-500 ${
            isExiting ? "w-[500px] h-[500px] bg-emerald-400/60 scale-125" : "w-72 h-72 sm:w-96 sm:h-96 animate-[auraPulse_3s_ease-in-out_infinite]"
          }`}
        />

        {/* Animated ZRU Emblem Crest (Rock-solid centered breathing animation) */}
        <div 
          className={`relative flex items-center justify-center transition-all duration-600 ease-out ${
            isExiting
              ? "w-64 h-64 sm:w-80 sm:h-80 scale-110"
              : "w-56 h-56 sm:w-72 sm:h-72 animate-[cinematicEmblem_3.2s_ease-in-out_infinite]"
          }`}
        >
          <Image
            src="/images/logos/zru-logo-white-text.svg"
            alt="Zimbabwe Rugby Union Emblem"
            fill
            sizes="320px"
            className={`object-contain transition-all duration-500 ${
              isExiting
                ? "filter drop-shadow-[0_0_65px_rgba(0,255,137,1)] opacity-90"
                : "filter drop-shadow-[0_0_35px_rgba(0,255,135,0.75)]"
            }`}
            priority
            unoptimized
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes auraPulse {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.85;
          }
        }
        @keyframes cinematicEmblem {
          0%, 100% {
            transform: translateY(0px) scale(1);
            filter: drop-shadow(0 0 35px rgba(0, 255, 137, 0.6));
          }
          50% {
            transform: translateY(-6px) scale(1.04);
            filter: drop-shadow(0 0 50px rgba(0, 255, 137, 0.9));
          }
        }
      `}</style>
    </div>
  );
}
