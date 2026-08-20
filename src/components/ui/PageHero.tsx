"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import EditableWrapper from "@/lib/edit-mode/EditableWrapper";
import { useEditMode } from "@/lib/edit-mode/EditContext";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface PageHeroProps {
  title?: string;
  accentTitle?: string;
  subtitle?: string;
  intro?: string;
  tag?: string;
  kicker?: string;
  image?: string;
  backgroundImage?: string;
  breadcrumb?: BreadcrumbItem[];
  pageId?: string | number;
  children?: React.ReactNode;
  className?: string;
}

export default function PageHero({
  title = "",
  accentTitle,
  subtitle,
  intro,
  tag,
  kicker,
  image,
  backgroundImage,
  breadcrumb,
  pageId,
  children,
  className = "",
}: PageHeroProps) {
  const { isEditMode } = useEditMode();

  const finalSubtitle = subtitle || intro || "";
  const finalTag = tag || kicker || "";
  const finalImage = image || backgroundImage || "";

  const editableFields = [
    {
      key: "hero_kicker",
      label: "Kicker",
      value: finalTag,
      type: "select" as const,
      options: [
        { label: "National Teams", value: "National Teams" },
        { label: "Competitions & Events", value: "Competitions & Events" },
        { label: "News & Media", value: "News & Media" },
        { label: "Fan Zone", value: "Fan Zone" },
        { label: "Play Rugby", value: "Play Rugby" },
        { label: "About ZRU", value: "About ZRU" },
        { label: "Match Centre", value: "Match Centre" },
        { label: "Tickets", value: "Tickets" },
      ],
    },
    { key: "hero_title", label: "Title", value: title },
    { key: "hero_intro", label: "Intro", value: finalSubtitle, multiline: true },
    { key: "hero_image", label: "Background Image", value: finalImage, type: "image" as const },
  ];

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-4xl space-y-4"
    >
      {/* Breadcrumbs & Kicker */}
      {Boolean(breadcrumb?.length || finalTag) && (
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em]">
          {finalTag && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase bg-zru-green/15 text-zru-green border border-zru-green/30 backdrop-blur-sm shadow-sm">
              {finalTag}
            </span>
          )}
          {breadcrumb && breadcrumb.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="text-white/50 hover:text-zru-green transition-colors"
              >
                HOME
              </Link>
              {breadcrumb.map((item, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3 h-3 text-white/30 shrink-0" />
                  {idx === breadcrumb.length - 1 ? (
                    <span className="text-zru-green font-bold">{item.label}</span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-white/50 hover:text-zru-green transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black not-italic text-white tracking-tight uppercase leading-[1.08]">
        {title}
        {accentTitle && (
          <span className="text-zru-green ml-2 sm:ml-3">{accentTitle}</span>
        )}
      </h1>

      {/* Subtitle / Intro */}
      {finalSubtitle && (
        <p className="text-sm sm:text-base md:text-lg text-white/70 font-body font-normal leading-relaxed max-w-2xl pt-1">
          {finalSubtitle}
        </p>
      )}

      {children}
    </motion.div>
  );

  return (
    <section
      className={`relative min-h-[35vh] md:min-h-[40vh] flex items-end pt-36 sm:pt-40 md:pt-48 pb-12 sm:pb-16 bg-rich-black rounded-b-[32px] sm:rounded-b-[44px] overflow-hidden ${className}`}
    >
      {/* Background Image / Overlay Gradients */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {finalImage ? (
          <>
            <Image
              src={finalImage}
              alt={title || "Background"}
              fill
              sizes="100vw"
              className="object-cover opacity-35"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/75 to-rich-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#006747]/20 via-rich-black to-rich-black" />
        )}
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-15" />
        {/* Bottom accent glow line in Zimbabwe green */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-zru-green/60 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {isEditMode && pageId ? (
          <EditableWrapper
            collection="pages"
            id={pageId}
            fields={editableFields}
            label="Hero Section"
          >
            {content}
          </EditableWrapper>
        ) : (
          content
        )}
      </div>
    </section>
  );
}

