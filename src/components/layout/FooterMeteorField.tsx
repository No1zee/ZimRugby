"use client";

import React, { useEffect, useRef, useState } from "react";

interface MeteorParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotation: number;
  rotSpeed: number;
  baseSize: number;
  baseAlpha: number;
  trailLength: number;
}

export default function FooterMeteorField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = false;
    let burstStartTime: number | null = null;
    const BURST_DURATION_MS = 3800; // 3.8 seconds total burst lifecycle

    // Track Image Load State for SVG Canvas Compatibility
    let isImgLoaded = false;
    const img = new Image();
    img.onload = () => {
      isImgLoaded = true;
    };
    img.src = "/images/logos/zru-logo.svg";
    if (img.complete && (img.naturalWidth > 0 || img.width > 0)) {
      isImgLoaded = true;
    }

    const updateSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || window.innerWidth;
      canvas.height = rect.height || 500;
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Create 40 3D ZRU Crest Meteor Particles
    const particleCount = 40;
    const perspective = 400;

    const createMeteor = (isInitial = false): MeteorParticle => {
      return {
        x: Math.random() * (canvas.width * 1.3) - canvas.width * 0.1,
        y: Math.random() * (canvas.height * 1.3) - canvas.height * 0.1,
        z: isInitial ? Math.random() * 850 + 50 : 950,
        vx: -(Math.random() * 1.8 + 0.6), // Dynamic diagonal meteor trajectory
        vy: Math.random() * 1.2 + 0.4,
        vz: (Math.random() - 0.5) * 2.5, // Oscillating 3D depth movement
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025,
        baseSize: Math.random() * 75 + 35,
        baseAlpha: Math.random() * 0.35 + 0.2,
        trailLength: Math.random() * 50 + 25,
      };
    };

    let meteors: MeteorParticle[] = Array.from({ length: particleCount }).map(() => createMeteor(true));

    const render = (timestamp: number) => {
      if (!isVisible || !canvas || !ctx) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (!burstStartTime) {
        burstStartTime = timestamp;
      }

      const elapsed = timestamp - burstStartTime;

      // Compute Transient Fade Envelope (Fade In -> Burst -> Fade Out to 0)
      let burstFadeAlpha = 0;
      if (elapsed < 400) {
        burstFadeAlpha = elapsed / 400; // Fade in (0 -> 1)
      } else if (elapsed < 2800) {
        burstFadeAlpha = 1.0; // Peak active shower
      } else if (elapsed < BURST_DURATION_MS) {
        burstFadeAlpha = 1.0 - (elapsed - 2800) / 1000; // Fade out (1 -> 0)
      } else {
        // Burst finished: clear canvas completely & halt rendering until next trigger
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      meteors.forEach((m, i) => {
        // Update 3D position
        m.x += m.vx;
        m.y += m.vy;
        m.z += m.vz;
        m.rotation += m.rotSpeed;

        // Reverse Z velocity if reaching depth boundaries
        if (m.z < 40 || m.z > 960) {
          m.vz = -m.vz;
        }

        // Respawn if meteor drifts off canvas boundaries
        if (m.x < -100 || m.y > canvas.height + 100) {
          meteors[i] = createMeteor(false);
        }

        // 3D Perspective Projection Sizing & Combined Burst Opacity
        const scale = perspective / (perspective + m.z);
        const drawSize = m.baseSize * scale;
        const depthAlpha = m.baseAlpha * Math.max(0.15, Math.min(1, (1000 - m.z) / 800)) * burstFadeAlpha;

        ctx.save();
        ctx.globalAlpha = depthAlpha;

        // 1. Draw Meteor Glowing Light Trail Streak
        const tailX = m.x - m.vx * (m.trailLength * scale);
        const tailY = m.y - m.vy * (m.trailLength * scale);
        const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        gradient.addColorStop(0, "rgba(0, 255, 137, 0.85)");
        gradient.addColorStop(0.5, "rgba(0, 103, 71, 0.4)");
        gradient.addColorStop(1, "rgba(0, 103, 71, 0)");

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.lineWidth = Math.max(1.5, 3.5 * scale);
        ctx.strokeStyle = gradient;
        ctx.stroke();

        // 2. Draw 3D Rotating ZRU Crest Emblem Meteor Head
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rotation);

        if (isImgLoaded) {
          ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        } else {
          // Fallback glowing meteor head while image finishes loading
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(2, 6 * scale), 0, Math.PI * 2);
          ctx.fillStyle = "#00FF87";
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#00FF87";
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // IntersectionObserver triggers burst on scroll into footer & resets on exit
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
            burstStartTime = null; // Re-trigger burst when scrolling back into view
            // Re-distribute meteors for a fresh burst
            meteors = Array.from({ length: particleCount }).map(() => createMeteor(true));
          } else {
            isVisible = false;
            burstStartTime = null;
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateSize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-90 transition-opacity duration-700"
    />
  );
}
