"use client";
import React, { useEffect, useRef, useState, type ReactNode } from "react";

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  durationMs?: number;
  yOffset?: number;
  scaleOffset?: number;
  as?: "div" | "section" | "article" | "li" | "header";
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
  durationMs = 400,
  yOffset = 12,
  scaleOffset = 0.98,
  as: Component = "div",
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mq.matches);

      const listener = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches);
      };
      if (mq.addEventListener) {
        mq.addEventListener("change", listener);
        return () => mq.removeEventListener("change", listener);
      }
    }
  }, []);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) {
      setIsVisible(true);
      return;
    }


    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once, prefersReducedMotion]);

  const style: React.CSSProperties = prefersReducedMotion
    ? {}
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0px) scale(1)"
          : `translateY(${yOffset}px) scale(${scaleOffset})`,
        transition: `opacity ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: isVisible ? "auto" : "opacity, transform",
      };

  return (
    <Component
      ref={ref as any}
      className={`${className}`}
      style={style}
    >
      {children}
    </Component>
  );
}
