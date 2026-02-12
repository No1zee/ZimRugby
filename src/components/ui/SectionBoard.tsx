"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { StripedBackground } from "./StripedBackground";
import { BackgroundText } from "./BackgroundText";

interface SectionBoardProps {
  /** Section title (e.g., "WHAT'S ON?") */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Description text */
  description?: string;
  /** CTA button */
  cta?: {
    label: string;
    href: string;
  };
  /** Background text to show */
  backgroundText?: string;
  /** Show stripes */
  showStripes?: boolean;
  /** Children content (carousel, cards, etc.) */
  children: React.ReactNode;
  /** Color theme for the title block */
  theme?: "navy" | "red" | "green";
  /** Layout direction */
  layout?: "left" | "right";
  /** Additional className */
  className?: string;
}

/**
 * Two-column section layout inspired by HK Rugby "WHAT'S ON?" section.
 * Dark title block on one side + content/carousel on the other.
 */
export function SectionBoard({
  title,
  subtitle,
  description,
  cta,
  backgroundText,
  showStripes = true,
  children,
  theme = "navy",
  layout = "left",
  className = "",
}: SectionBoardProps) {
  
  const themeColors = {
    navy: {
      bg: "bg-[#091F40]",
      text: "text-white",
      accent: "text-zru-gold",
      button: "bg-zru-red hover:bg-red-700 text-white",
    },
    red: {
      bg: "bg-zru-red",
      text: "text-white",
      accent: "text-zru-gold",
      button: "bg-white hover:bg-gray-100 text-zru-red",
    },
    green: {
      bg: "bg-zru-green",
      text: "text-white",
      accent: "text-zru-gold",
      button: "bg-zru-gold hover:bg-yellow-500 text-rich-black",
    },
  };

  const colors = themeColors[theme];

  return (
    <section className={`relative py-16 lg:py-24 overflow-hidden ${className}`}>
      
      {/* Background text */}
      {backgroundText && (
        <BackgroundText text={backgroundText} color="gray" />
      )}

      {/* Stripes */}
      {showStripes && (
        <StripedBackground 
          variant="accent" 
          position="right" 
          color="red" 
        />
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${layout === "right" ? "lg:flex-row-reverse" : ""}`}>
          
          {/* Title Block */}
          <motion.div
            initial={{ opacity: 0, x: layout === "left" ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`lg:col-span-3 ${colors.bg} p-8 lg:p-10 rounded-lg lg:rounded-none lg:rounded-l-lg flex flex-col justify-center`}
          >
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black ${colors.text} uppercase leading-tight mb-4`}>
              {title}
            </h2>
            
            {subtitle && (
              <p className={`${colors.accent} text-sm font-bold uppercase tracking-wider mb-4`}>
                {subtitle}
              </p>
            )}
            
            {description && (
              <p className={`${colors.text}/80 text-sm leading-relaxed mb-6`}>
                {description}
              </p>
            )}
            
            {cta && (
              <Link href={cta.href}>
                <motion.button
                  className={`${colors.button} px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded transition-all`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cta.label}
                  <Plus className="w-4 h-4" />
                </motion.button>
              </Link>
            )}
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-9"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SectionBoard;
