"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { StripedBackground } from "./StripedBackground";

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

/**
 * Hero-style countdown promo inspired by HK Rugby "HONG KONG SEVENS" section.
 * Features clipped image, diagonal stripes, and live countdown.
 */
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
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Format date for display
  const dateObj = new Date(targetDate);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase().replace(/ /g, "–");

  return (
    <section className={`relative py-16 lg:py-24 bg-gray-50 overflow-hidden ${className}`}>
      
      {/* Stripes */}
      <StripedBackground variant="accent" position="right" color="green" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                className="h-full"
                style={{
                  background: `repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 8px,
                    rgba(215, 25, 32, 0.15) 8px,
                    rgba(215, 25, 32, 0.15) 12px
                  )`,
                }}
              />
            </div>
            
            {/* Image with clip-path */}
            <div
              className="relative z-10 aspect-4/3 rounded-lg overflow-hidden"
              style={{
                clipPath: "polygon(0 10%, 100% 0%, 100% 90%, 0% 100%)",
              }}
            >
              {image ? (
                <img 
                  src={image} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-zru-green via-green-700 to-green-900 flex items-center justify-center">
                  <span className="text-white/20 text-6xl font-black">ZRU</span>
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
            <p className="text-3xl md:text-4xl font-black text-rich-black italic mb-2">
              {formattedDate}
            </p>
            
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-black text-zru-red uppercase mb-2">
              {title}
            </h2>
            
            {/* Subtitle */}
            {subtitle && (
              <p className="text-xl md:text-2xl font-black text-[#091F40] uppercase mb-4">
                {subtitle}
              </p>
            )}
            
            {/* Description */}
            {description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">
                {description}
              </p>
            )}

            {/* Countdown */}
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                {countdownLabel}
              </p>
              <div className="flex gap-4">
                {[
                  { value: timeLeft.days, label: "DAYS" },
                  { value: timeLeft.hours, label: "HOURS" },
                  { value: timeLeft.minutes, label: "MINUTES" },
                  { value: timeLeft.seconds, label: "SECONDS" },
                ].map((unit) => (
                  <div key={unit.label} className="text-center">
                    <motion.span
                      key={`${unit.label}-${unit.value}`}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="block text-4xl md:text-5xl font-black text-[#091F40] leading-none"
                    >
                      {String(unit.value).padStart(2, "0")}
                    </motion.span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            {location && (
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                <MapPin className="w-4 h-4" />
                {location}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              {ctas.map((cta, i) => (
                <Link key={i} href={cta.href}>
                  <motion.button
                    className={`
                      px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded transition-all
                      ${cta.variant === "outline" 
                        ? "border-2 border-gray-300 text-gray-700 hover:border-zru-red hover:text-zru-red bg-transparent" 
                        : "bg-zru-red hover:bg-red-700 text-white"
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {cta.label}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CountdownPromo;
