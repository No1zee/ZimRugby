import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionProps {
  title?: string;
  subtitle?: string;
  tag?: string;
  ctaLabel?: string;
  ctaHref?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({
  title,
  subtitle,
  tag,
  ctaLabel,
  ctaHref,
  children,
  className = "",
}: SectionProps) {
  return (
    <section className={`py-16 px-6 lg:px-12 ${className}`}>
      <div className="max-w-[1440px] mx-auto">
        {(title || subtitle || tag) && (
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div className="space-y-3">
              {tag && (
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zru-green">
                  {tag}
                </span>
              )}
              {title && (
                <h2 className="font-heading text-3xl md:text-5xl font-black uppercase text-rich-black tracking-tight leading-[1.0]">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-black/60 text-sm max-w-2xl">{subtitle}</p>
              )}
            </div>
            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zru-green hover:underline shrink-0"
              >
                {ctaLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
