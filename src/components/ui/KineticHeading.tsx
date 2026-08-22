"use client";
import React, { useEffect, useRef, useState } from "react";
export interface KineticHeadingProps {
  text: string;
  accentText?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  className?: string;
  accentClassName?: string;
  delayMs?: number;
  staggerMs?: number;
  threshold?: number;
}

export function KineticHeading({
  text,
  accentText,
  as: Component = "h2",
  className = "",
  accentClassName = "text-zru-green ml-2 sm:ml-3",
  delayMs = 0,
  staggerMs = 40,
  threshold = 0.15,
}: KineticHeadingProps) {
  const ref = useRef<HTMLElement>(null);
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
          observer.unobserve(element);
        }
      },
      { threshold }
    );


    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, prefersReducedMotion]);


  const words = text.split(" ");

  return (
    <Component
      ref={ref as any}
      className={`${className} space-x-[0x1px]`}
    >
      {words.map((word, idx) => {
        const isReduced = prefersReducedMotion;
        const style: React.CSSProperties = isReduced
          ? {}
          : {
              transform: isVisible
                ? "translateY(0px) rotateX0deg)"
                : "translateY(100%) rotateX(25deg)",
              opacity: isVisible ? 1 : 0,
              transition: `opacity 450ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs + idx * staggerMs}ms, transform 550ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs + idx * staggerMs}ms`,
            };

        return (
          <span key={idx} className="inline-block overflow-hidden vertical-align-top">
            <span
              className="inline-block origin-bottom-left will-change-transform"
              style={style}
            >
              {word}&nbsp;
            </span>
          </span>
        );
      })}
      {accentText && (
        <span className="inline-block overflow-hidden vertical-align-top">
          <span
            className={`inline-block origin-bottom-left will-change-transform ${accentClassName}`}
            style={
              prefersReducedMotion
                ? {}
                : {
                    transform: isVisible
                      ? "translateY(0px) rotateX0deg)"
                      : "translateY(100%) rotateX(25deg)",
                    opacity: isVisible ? 1 : 0,
                    transition: `opacity 450ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs + words.length * staggerMs}ms, transform 550ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs + words.length * staggerMs}ms`,
                  }
            }
          >
            {accentText}
          </span>
        </span>
      )}
    </Component>
  );
}
