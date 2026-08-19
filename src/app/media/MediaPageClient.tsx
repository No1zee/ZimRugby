"use client";

import { motion } from "framer-motion";
import { Play, Search, ArrowRight, Calendar, Newspaper, Video } from "lucide-react";
import Button from "@/components/common/Button";
import VideoCard from "@/components/media/VideoCard";
import { useState } from "react";
import CmsHero from "@/components/cms/CmsHero";
import PageAnnouncements from "@/components/ui/PageAnnouncements";
import MatchdayVideoHighlights from "@/components/media/MatchdayVideoHighlights";
import Image from "next/image";
import Link from "next/link";
import type { Report } from "@/lib/data-fetcher";
import FanZoneSignup from "@/components/fanzone/FanZoneSignup";

interface MediaPageClientProps {
  cmsPage?: any;
  initialNews?: Report[];
}

const NEWS_CATEGORIES = ["ALL", "SABLES", "ZRU", "LADY SABLES", "JUNIOR SABLES"] as const;

export default function MediaPageClient({ cmsPage, initialNews = [] }: MediaPageClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "news" | "videos">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNews = initialNews.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedCategory === "ALL") return true;

    const target = selectedCategory.toLowerCase();
    const cats = article.categories || (article.category ? [article.category] : []);
    return cats.some((c) => c.toLowerCase() === target || c.toLowerCase().includes(target));
  });

  return (
    <div className="bg-milk-white text-black min-h-screen">
      <CmsHero
        kicker={cmsPage?.hero_badge || "MEDIA & PRESS"}
        title={cmsPage?.hero_title || "LATEST NEWS & STORIES"}
        intro={cmsPage?.hero_intro || "Official updates, squad announcements, match reports, and media coverage from Zimbabwe Rugby."}
      />
      <PageAnnouncements scope="media" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Navigation / Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-black/10 pb-6">
          <div className="flex items-center gap-2 p-1.5 bg-black/5 rounded-xl border border-black/5 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all whitespace-nowrap ${
                activeTab === "all" ? "bg-zru-green text-white shadow-md" : "text-black/60 hover:text-black"
              }`}
            >
              All Media
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={`px-5 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "news" ? "bg-zru-green text-white shadow-md" : "text-black/60 hover:text-black"
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              Latest News
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`px-5 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "videos" ? "bg-zru-green text-white shadow-md" : "text-black/60 hover:text-black"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Video Highlights
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input
              type="text"
              placeholder="Search news & media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-black/10 text-xs font-bold text-black focus:outline-none focus:border-zru-green transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Section 1: Official News & Press */}
        {(activeTab === "all" || activeTab === "news") && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-6 bg-zru-green rounded-full" />
                <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-black tracking-tight">
                  Latest News & Articles
                </h2>
              </div>

              {/* Category Filter Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                {NEWS_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? "bg-zru-green text-white shadow-sm"
                        : "bg-black/5 text-black/70 hover:bg-black/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((article) => {
                  const categories = article.categories && article.categories.length > 0
                    ? article.categories
                    : [article.category || "ZRU"];

                  return (
                    <Link
                      key={article.id}
                      href={article.url}
                      className="group bg-white rounded-2xl border border-black/10 overflow-hidden hover:border-zru-green/40 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[16/10] relative overflow-hidden bg-rich-black/40">
                          {article.image ? (
                            <Image
                              src={article.image}
                              alt={article.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                              <Newspaper className="w-10 h-10 text-black/20" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                            {categories.map((cat, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-zru-green text-white shadow"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-5 space-y-2.5">
                          {article.date && (
                            <div className="flex items-center gap-1.5 text-black/50 text-[11px] font-bold uppercase tracking-wider">
                              <Calendar className="w-3 h-3 text-zru-green" />
                              {article.date}
                            </div>
                          )}
                          <h3 className="font-heading font-black text-lg text-black leading-snug group-hover:text-zru-green transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-black/70 text-xs leading-relaxed line-clamp-3">
                            {article.excerpt || article.content}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-2 border-t border-black/5 flex items-center justify-between text-xs font-black text-zru-green uppercase tracking-wider">
                        <span>Read Full Story</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-black/10 p-12 text-center text-black/60 font-bold text-sm">
                No news articles found matching your criteria.
              </div>
            )}
          </div>
        )}

        {/* Section 2: Video Highlights */}
        {(activeTab === "all" || activeTab === "videos") && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-6 bg-accent-teal rounded-full" />
                <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-black tracking-tight">
                  Featured Match Highlights
                </h2>
              </div>
              <Link
                href="/video-hub"
                className="text-xs font-black uppercase tracking-wider text-zru-green hover:underline flex items-center gap-1"
              >
                Full Video Hub <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-rich-black rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/10">
              <MatchdayVideoHighlights />
            </div>
          </div>
        )}

        {/* Fan Zone CTA banner */}
        <div className="pt-6">
          <FanZoneSignup />
        </div>
      </div>
    </div>
  );
}
