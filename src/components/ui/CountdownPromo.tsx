"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";
import SlantedButton from "./SlantedButton";

interface CountdownPromoProps {
  /** Event title */
  title: string;
  /** Event subtitle */
  subtitle?: string;
  /** Description text */
  description?: string;
  /** Target date (ISO string) */
  targetDate: string;
  /** Countdown label */
  countdownLabel?: string;
  /** Image URL */
  image?: string;
  /** CTAs */
  ctas?: Array<{
    label: string;
    href: string;
    variant?: "primary" | "outline";
  }>;
  /** Location */
  location?: string;
  /** Additional className */
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownPromo({
  title,
  subtitle,
  description,
  targetDate,
  countdownLabel = "COUNTDOWN TO KICK OFF:",
  image,
  ctas = [],
  location,
  className = "",
}: CountdownPromoProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const dateObj = new Date(targetDate);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: 'UTC'
  });
  
  const isClient = mounted;

  return (
    <section className={`relative py-10 md:py-16 bg-transparent overflow-hidden ${className}`}>
      
      {/* Visual Background Accent */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-zru-green/10 z-0" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,96,57,0.1),transparent_70%)]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Clipped Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Diagonal lines behind */}
            <div className="absolute -left-8 -top-8 -bottom-8 w-32">
              <div
                className="h-full bg-[repeating-linear-gradient(-45deg,transparent,transparent_8px,rgba(255,255,255,0.03)_8px,rgba(255,255,255,0.03)_12px)]"
              />
            </div>
            
            {/* Image with clip-path */}
            <div className="relative z-10 aspect-4/3 overflow-hidden clip-slanted-lg group shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              {/* Outer offset frame accent */}
              <div className="absolute inset-0 border border-zru-green/30 clip-slanted-lg translate-x-2 translate-y-2 z-0 pointer-events-none group-hover:border-zru-green/50 transition-colors duration-500" />
              {image ? (
                <div className="relative w-full h-full z-10">
                  <Image 
                    src={image} 
                    alt={title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={60}
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  {/* Premium Cinematic Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-rich-black/80 via-transparent to-rich-black/30" />
                  <div className="absolute inset-0 bg-zru-green/20 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zru-green via-green-700 to-green-900 flex items-center justify-center">
                  <span className="text-white/50 text-4xl font-black">DEBUG: Placeholder</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Date */}
            <p className="font-heading tracking-widest text-xl text-rich-black/50 mb-4">
              {isClient ? formattedDate : "\u00A0"}
            </p>
            
            {/* Title - Standardized */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-[2px] bg-zru-green" />
              <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.3em] font-subheading">{title}</span>
            </div>
            
            {/* Subtitle */}
            {subtitle && (
              <h2 className="font-heading text-[clamp(2rem,7vw,5rem)] tracking-wider text-rich-black mb-6 uppercase font-black drop-shadow-md leading-none">
                {subtitle}
              </h2>
            )}
            
            {/* Description */}
            {description && (
              <p className="font-body text-rich-black/70 mb-10 max-w-md">
                {description}
              </p>
            )}

            {/* Countdown */}
            <div className="mb-8">
              <p className="text-[10px] font-black text-rich-black/40 uppercase tracking-[0.2em] mb-4">
                {countdownLabel}
              </p>
              <div className="flex flex-wrap justify-start gap-4 md:gap-6 min-w-0">
                {[
                  { value: timeLeft.days, label: "DAYS" },
                  { value: timeLeft.hours, label: "HOURS" },
                  { value: timeLeft.minutes, label: "MINUTES" },
                  { value: timeLeft.seconds, label: "SECONDS" },
                ].map((unit) => (
                  <div key={unit.label} className="text-center bg-gradient-to-b from-zru-green/[0.12] via-zru-green/[0.04] to-transparent border border-zru-green/20 rounded-xl px-4 py-3 md:py-5 min-w-[85px] md:min-w-[110px] shadow-lg shadow-black/40 backdrop-blur-md relative group/timer">
                    {/* Inner dividing horizontal strip (clock digit split) */}
                    <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/30 z-20 pointer-events-none" />
                    
                    <div className="relative h-[56px] md:h-[84px] overflow-hidden flex justify-center items-center z-10">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={`${unit.label}-${unit.value}`}
                          initial={{ y: -40, opacity: 0, rotateX: -90 }}
                          animate={{ y: 0, opacity: 1, rotateX: 0 }}
                          exit={{ y: 40, opacity: 0, rotateX: 90 }}
                          transition={{ duration: 0.4, ease: "backOut" }}
                          className="absolute block w-full text-center font-heading text-5xl md:text-7xl text-rich-black font-black leading-none tracking-normal origin-center drop-shadow-[0_4px_10px_rgba(0,107,63,0.4)]"
                          style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                        >
                          {isClient ? String(unit.value).padStart(2, "0") : "00"}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <span className="text-[9px] font-black text-rich-black/50 uppercase tracking-[0.2em] block mt-3 font-subheading">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            {location && (
              <div className="flex items-center gap-2 text-rich-black/40 text-sm mb-6">
                <MapPin className="w-4 h-4" />
                {location}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              {ctas.map((cta, i) => (
                <SlantedButton
                  key={i}
                  href={cta.href}
                  variant={cta.variant === "outline" ? "secondary" : "primary"}
                  size="md"
                >
                  {cta.label}
                </SlantedButton>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CountdownPromo;
