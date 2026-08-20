"use client";

import React, { useState, useEffect } from "react";
import { Monitor, Smartphone, Calendar, User, Clock, Tag, ExternalLink } from "lucide-react";

interface ArticleLivePreviewProps {
  title: string;
  category?: string;
  author?: string;
  publishDate?: string;
  summary?: string;
  content: string;
  imageUrl?: string;
  imageCaption?: string;
  readTimeMinutes?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ArticleLivePreview({
  title,
  category = "NEWS",
  author = "ZRU Media",
  publishDate,
  summary,
  content,
  imageUrl,
  imageCaption,
  readTimeMinutes = 3,
  isOpen,
  onClose,
}: ArticleLivePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [parsedHtml, setParsedHtml] = useState<string>("");

  useEffect(() => {
    // Basic rich HTML sanitization & parsing for markdown/html inputs
    let text = content || "";
    if (text.startsWith("<") && text.endsWith(">")) {
      setParsedHtml(text);
    } else {
      // Basic markdown to formatted HTML
      const html = text
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-2 text-black">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-black mt-8 mb-3 text-black">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black mt-8 mb-4 text-black">$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-black">$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
        .replace(/\n\n/gim, '</p><p class="mb-4 text-black/80 leading-relaxed">')
        .replace(/\n/gim, "<br />");
      setParsedHtml(`<p class="mb-4 text-black/80 leading-relaxed">${html}</p>`);
    }
  }, [content]);

  if (!isOpen) return null;

  const displayDate = publishDate
    ? new Date(publishDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex flex-col bg-stone-900/90 backdrop-blur-md border-l border-white/10 shadow-2xl transition-all duration-300 w-full sm:w-[500px] lg:w-[680px] xl:w-[760px]">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-black/40 border-b border-white/10 text-white">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#006B3F] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-white/90">
            Live Preview
          </span>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              deviceMode === "desktop"
                ? "bg-[#006B3F] text-white shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              deviceMode === "mobile"
                ? "bg-[#006B3F] text-white shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-white/50 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
        >
          Close Preview
        </button>
      </div>

      {/* Main Preview Viewport */}
      <div className="flex-1 overflow-y-auto bg-stone-950 p-4 flex justify-center items-start">
        <div
          className={`bg-white text-black transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-black/10 my-2 ${
            deviceMode === "mobile"
              ? "w-[375px] min-h-[667px] ring-8 ring-stone-800 rounded-3xl"
              : "w-full max-w-2xl min-h-[500px]"
          }`}
        >
          {/* Mock Brand Header */}
          <div className="bg-[#0b1411] px-5 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#006B3F] flex items-center justify-center text-white font-black text-[10px]">
                ZRU
              </div>
              <span className="text-[11px] font-black tracking-widest text-white uppercase">
                ZIMBABWE RUGBY
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono">
              PREVIEW ONLY
            </span>
          </div>

          {/* Hero Media */}
          {imageUrl ? (
            <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={title || "Article preview image"}
                className="w-full h-full object-cover"
              />
              {imageCaption && (
                <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs px-3 py-1.5 text-[10px] text-white/80 italic">
                  {imageCaption}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video w-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-semibold">
              [No Hero Image Selected]
            </div>
          )}

          {/* Article Header & Body */}
          <div className="p-6 md:p-8">
            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#006B3F]/10 text-[#006B3F]">
                <Tag className="w-3 h-3" />
                {category}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                <Calendar className="w-3 h-3 text-stone-400" />
                {displayDate}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                <Clock className="w-3 h-3 text-stone-400" />
                {readTimeMinutes} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-black leading-tight mb-4 tracking-tight">
              {title || "Untitled Match Report or Article"}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-stone-100">
              <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">{author}</p>
                <p className="text-[10px] text-stone-500">Official ZRU Press</p>
              </div>
            </div>

            {/* Summary / Lead Paragraph */}
            {summary ? (
              <div className="mb-6 p-4 rounded-xl bg-stone-50 border-l-4 border-[#006B3F] text-stone-700 text-sm font-medium leading-relaxed italic">
                {summary}
              </div>
            ) : null}

            {/* Formatted Content */}
            <div
              className="prose prose-stone prose-sm max-w-none text-stone-800 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parsedHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
