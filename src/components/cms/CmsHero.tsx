"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import EditableWrapper from "@/lib/edit-mode/EditableWrapper";
import { useEditMode } from "@/lib/edit-mode/EditContext";

interface CmsHeroProps {
  kicker?: string;
  title?: string;
  intro?: string;
  image?: string;
  breadcrumb?: { label: string; href: string }[];
  pageId?: string | number;
}

export default function CmsHero({
  kicker,
  title,
  intro,
  image,
  breadcrumb,
  pageId,
}: CmsHeroProps) {
  const { isEditMode } = useEditMode();
  const titleParts = (title || "").split(" ");
  const accentWord = titleParts.pop() || "";
  const mainTitle = titleParts.join(" ") || "";

  const editableFields = [
    { key: "hero_kicker", label: "Kicker", value: kicker || "", type: "select" as const, options: [
      { label: "National Teams", value: "National Teams" },
      { label: "Competitions & Events", value: "Competitions & Events" },
      { label: "News & Media", value: "News & Media" },
      { label: "Fan Zone", value: "Fan Zone" },
      { label: "Play Rugby", value: "Play Rugby" },
      { label: "About ZRU", value: "About ZRU" },
      { label: "Match Centre", value: "Match Centre" },
      { label: "Tickets", value: "Tickets" },
    ]},
    { key: "hero_title", label: "Title", value: title || "" },
    { key: "hero_intro", label: "Intro", value: intro || "", multiline: true },
    { key: "hero_image", label: "Background Image", value: image || "", type: "image" as const },
  ];

  const heroContent = (
    <div className="max-w-4xl space-y-6">
      {/* Breadcrumbs */}
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
          <Link href="/" className="text-white/40 hover:text-zru-green transition-colors">
            HOME
          </Link>
          {breadcrumb.map((item, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-white/20" />
              {idx === breadcrumb.length - 1 ? (
                <span className="text-zru-green">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-white/40 hover:text-zru-green transition-colors">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-heading font-black not-italic text-white tracking-tight uppercase leading-[1.05]">
        {mainTitle}{" "}
        {accentWord && <span className="text-accent-teal">{accentWord}</span>}
      </h1>

      {/* Intro */}
      {intro && (
        <p className="text-base md:text-lg text-white/60 font-body font-normal leading-relaxed max-w-2xl">
          {intro}
        </p>
      )}
    </div>
  );

  return (
    <section className="relative min-h-[30vh] md:min-h-[35vh] flex items-end pt-20 pb-10 bg-rich-black rounded-b-[40px] overflow-hidden">
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {image ? (
          <>
            <Image
              src={image}
              alt={title || ""}
              fill
              sizes="100vw"
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rich-black/90 via-rich-black/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,107,63,0.12),transparent_60%)]" />
        )}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-15" />
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-zru-green/50 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {isEditMode && pageId ? (
          <EditableWrapper
            collection="pages"
            id={pageId}
            fields={editableFields}
            label="Hero"
          >
            {heroContent}
          </EditableWrapper>
        ) : (
          heroContent
        )}
      </div>
    </section>
  );
}
