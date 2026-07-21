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

    // Dynamic 360-degree radial particle energy burst
    const particleCount = 80;
    const colors = ["#006B3F", "#00FF87", "#34D399", "#FFFFFF"];

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

    const createParticle = (): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5.5 + 1.8;
      return {
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.014 + 0.007,
      };
    };

    const particles: Particle[] = Array.from({ length: particleCount }).map(createParticle);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles[i] = createParticle();
        }

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 16;
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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#010904] text-white overflow-hidden select-none">
      {/* Stadium Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(0, 107, 63, 0.42) 0%, rgba(1, 20, 10, 0.9) 55%, #010804 100%)`
        }}
      />

      {/* Dynamic Radial Canvas Burst */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 opacity-90" />

      {/* Emblem & Ambient Backlight Stage */}
      <div className="relative z-20 flex items-center justify-center">
        {/* Pulsing Emerald Backlight Aura */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#006B3F]/40 blur-3xl pointer-events-none animate-[auraPulse_3s_ease-in-out_infinite]" />

        {/* Animated ZRU Emblem Crest (Floating, Breathing, Shimmering) */}
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center animate-[cinematicEmblem_3.6s_ease-in-out_infinite]">
          <Image
            src="/images/logos/zru-logo.svg"
            alt="Zimbabwe Rugby Union Emblem"
            fill
            className="object-contain filter drop-shadow-[0_0_35px_rgba(0,255,135,0.75)]"
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
            transform: translateY(0px) scale(1) rotate(0deg);
            filter: drop-shadow(0 0 35px rgba(0, 255, 137, 0.6));
          }
          33% {
            transform: translateY(-8px) scale(1.05) rotate(1.5deg);
            filter: drop-shadow(0 0 50px rgba(0, 255, 137, 0.9));
          }
          66% {
            transform: translateY(4px) scale(0.98) rotate(-1.5deg);
            filter: drop-shadow(0 0 30px rgba(0, 107, 63, 0.8));
          }
        }
      `}</style>
    </div>
  );
}
