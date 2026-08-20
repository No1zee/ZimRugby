import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ZruButton from "./ZruButton";

interface HeroBannerProps {
  title: string;
  accentTitle?: string;
  subtitle?: string;
  backgroundImage: string;
  ctaLabel?: string;
  ctaHref?: string;
  overlay?: boolean;
  height?: "full" | "large" | "medium";
}

export default function HeroBanner({
  title,
  accentTitle,
  subtitle,
  backgroundImage,
  ctaLabel,
  ctaHref,
  overlay = true,
  height = "large",
}: HeroBannerProps) {
  const heightClass = height === "full" ? "h-screen" : height === "large" ? "h-[70vh]" : "h-[50vh]";

  return (
    <div className={`relative ${heightClass} w-full overflow-hidden`}>
      <Image
        src={backgroundImage}
        alt={title}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-rich-black/80 via-rich-black/30 to-transparent" />
      )}
      <div className="absolute inset-0 flex items-end pb-16 md:pb-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-[1.0] max-w-4xl">
            {accentTitle ? (
              <>
                {title}{" "}
                <span className="text-zru-green">{accentTitle}</span>
              </>
            ) : title}
          </h1>
          {subtitle && (
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mt-6 font-normal">
              {subtitle}
            </p>
          )}
          {ctaLabel && ctaHref && (
            <div className="mt-8">
              <ZruButton
                href={ctaHref}
                variant="solid-green"
                size="md"
                showArrow
              >
                {ctaLabel}
              </ZruButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
