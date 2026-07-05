"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { StripedBackground } from "./StripedBackground";
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
    month: "long",
    year: "numeric",
  }).toUpperCase().replace(/ /g, "–");
  
  const isClient = mounted;

  return (
    <section className={`relative py-section bg-transparent overflow-hidden ${className}`}>
      
      {/* Visual Background Accent */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-zru-green/5 z-0" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,96,57,0.1),transparent_70%)]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
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
            <div className="relative z-10 aspect-4/3 overflow-hidden clip-slanted-lg group shadow-2xl">
              {image ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={image} 
                    alt={title}
                    fill
                    priority
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
            <p className="font-heading tracking-widest text-xl text-white/50 mb-4">
              {isClient ? formattedDate : "\u00A0"}
            </p>
            
            {/* Title - Standardized */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-1 bg-white/40" />
              <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em]">{title}</span>
            </div>
            
            {/* Subtitle */}
            {subtitle && (
              <h2 className="font-heading text-6xl md:text-8xl tracking-wider text-white mb-6 uppercase">
                {subtitle}
              </h2>
            )}
            
            {/* Description */}
            {description && (
              <p className="font-body text-white/70 mb-10 max-w-md">
                {description}
              </p>
            )}

            {/* Countdown */}
            <div className="mb-8">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">
                {countdownLabel}
              </p>
              <div className="flex flex-wrap justify-start gap-x-6 gap-y-4 md:gap-8 min-w-0">
                {[
                  { value: timeLeft.days, label: "DAYS" },
                  { value: timeLeft.hours, label: "HOURS" },
                  { value: timeLeft.minutes, label: "MINUTES" },
                  { value: timeLeft.seconds, label: "SECONDS" },
                ].map((unit) => (
                  <div key={unit.label} className="text-center min-w-[70px]">
                    <motion.span
                      key={`${unit.label}-${unit.value}`}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="block font-heading text-6xl md:text-8xl text-zru-green leading-none tracking-wider"
                    >
                      {isClient ? String(unit.value).padStart(2, "0") : "00"}
                    </motion.span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] block mt-2">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            {location && (
              <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
                <MapPin className="w-4 h-4" />
                {location}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              {ctas.map((cta, i) => (
               cta.variant === "outline" ? (
                 <SlantedButton key={i} href={cta.href} variant="outline" size="sm">
                   {cta.label}
                 </SlantedButton>
               ) : (
                 <SlantedButton key={i} href={cta.href} variant="primary" size="md">
                   {cta.label}
                 </SlantedButton>
               )
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CountdownPromo;
