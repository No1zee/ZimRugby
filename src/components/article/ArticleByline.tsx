"use client";

import { Share2, Copy, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ArticleBylineProps {
  author?: string;
  author_role?: string;
  date: string;
  readingMinutes: number;
  articleTitle: string;
  articleUrl?: string;
}

export default function ArticleByline({
  author,
  author_role,
  date,
  readingMinutes,
  articleTitle,
  articleUrl,
}: ArticleBylineProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url =
      articleUrl ??
      (typeof window !== "undefined" ? window.location.href : "");
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: articleTitle, url: articleUrl ?? window.location.href }).catch(() => {});
    } else {
      handleCopy();
    }
  }

  const displayAuthor = author || "ZRU Media";
  const displayRole = author_role || "Zimbabwe Rugby Union";

  return (
    <div className="flex items-center justify-between py-6 border-y border-neutral-200 mb-10">
      {/* Author block */}
      <div className="flex items-center gap-4">
        {/* ZRU logomark */}
        <div className="w-10 h-10 rounded-xl border border-neutral-200 bg-white flex items-center justify-center shrink-0 overflow-hidden p-1">
          <Image
            src="/images/zru-logo.png"
            alt="Zimbabwe Rugby Union"
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.15em] text-neutral-900">
            {displayAuthor}
          </p>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            {displayRole}
          </p>
        </div>
      </div>

      {/* Meta + Share */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hidden sm:block">
          {date} · {readingMinutes} min read
        </span>
        {/* Copy link */}
        <button
          onClick={handleCopy}
          className="w-9 h-9 rounded-full border border-neutral-200 bg-white hover:border-zru-green/40 hover:bg-neutral-50 transition-all flex items-center justify-center group"
          aria-label="Copy article link"
          title="Copy link"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-zru-green" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-neutral-400 group-hover:text-zru-green transition-colors" />
          )}
        </button>
        {/* Share (native or fallback) */}
        <button
          onClick={handleNativeShare}
          className="w-9 h-9 rounded-full border border-neutral-200 bg-white hover:border-zru-green/40 hover:bg-neutral-50 transition-all flex items-center justify-center group"
          aria-label="Share article"
          title="Share"
        >
          <Share2 className="w-3.5 h-3.5 text-neutral-400 group-hover:text-zru-green transition-colors" />
        </button>
      </div>
    </div>
  );
}
