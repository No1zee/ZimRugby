"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight, Newspaper, Video, Sparkles, ChevronRight, X } from "lucide-react";
import type { Report } from "@/lib/data-fetcher";
import CmsHero from "@/components/cms/CmsHero";
import PageAnnouncements from "@/components/ui/PageAnnouncements";
import MatchdayVideoHighlights from "@/components/media/MatchdayVideoHighlights";
import FanZoneSignup from "@/components/fanzone/FanZoneSignup";

interface MediaPageClientProps {
  cmsPage?: any;
  initialNews?: Report[];
}

const CATEGORIES = [
  "ALL",
  "SABLES",
  "LADY SABLES",
  "JUNIOR SABLES",
  "ZRU",
  "DOMESTIC",
  "WOMEN'S RUGBY",
  "GRASSROOTS"
] as const;

const ITEMS_PER_PAGE = 9;

export default function MediaPageClient({ cmsPage, initialNews = [] }: MediaPageClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "news" | "videos">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter articles based on category and search query
  const filteredArticles = useMemo(() => {
    return initialNews.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedCategory === "ALL") return true;

      const target = selectedCategory.toLowerCase();
      const cats = article.categories || (article.category ? [article.category] : []);
      return cats.some((c) => c.toLowerCase() === target || c.toLowerCase().includes(target));
    });
  }, [initialNews, searchQuery, selectedCategory]);

  // Magazine layout segregation (Lead + 2 Featured + Grid)
  const isDefaultView = selectedCategory === "ALL" && searchQuery === "" && currentPage === 1;

  const leadHeroStory = isDefaultView && filteredArticles.length > 0 ? filteredArticles[0] : null;
  const secondaryFeatured = isDefaultView && filteredArticles.length > 2 ? filteredArticles.slice(1, 3) : [];
  
  // Articles for the paginated grid
  const gridArticles = useMemo(() => {
    if (isDefaultView) {
      // Skip the top 3 featured articles on page 1 of default view
      const remaining = filteredArticles.slice(3);
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return remaining.slice(start, start + ITEMS_PER_PAGE);
    } else {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
    }
  }, [filteredArticles, isDefaultView, currentPage]);

  const totalGridItems = isDefaultView ? Math.max(0, filteredArticles.length - 3) : filteredArticles.length;
  const totalPages = Math.ceil(totalGridItems / ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#fcfaf7] text-neutral-900 min-h-screen">
      <CmsHero
        kicker={cmsPage?.hero_badge || "MEDIA & PRESS"}
        title={cmsPage?.hero_title || "LATEST NEWS & STORIES"}
        intro={cmsPage?.hero_intro || "Official match reports, team selections, union governance, and stories from across Zimbabwe rugby."}
      />
      <PageAnnouncements scope="media" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Navigation, Tab & Filter Bar */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-neutral-200 pb-6">
            {/* View Modes (All / News / Videos) */}
            <div className="flex items-center gap-2 p-1 bg-neutral-200/60 rounded-xl w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-5 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all whitespace-nowrap ${
                  activeTab === "all" ? "bg-zru-green text-white shadow-sm" : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                All Media
              </button>
              <button
                onClick={() => setActiveTab("news")}
                className={`px-5 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "news" ? "bg-zru-green text-white shadow-sm" : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                Latest News
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`px-5 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "videos" ? "bg-zru-green text-white shadow-sm" : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                Video Highlights
              </button>
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search articles & stories..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-zru-green transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Slanted Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`clip-slanted-sm px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-zru-green text-white shadow-md shadow-zru-green/20 scale-[1.02]"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-zru-green/50 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 1: News & Magazine Feed */}
        {(activeTab === "all" || activeTab === "news") && (
          <div className="space-y-10">
            {/* Top Magazine Lead Grid (Page 1 Default Only) */}
            {leadHeroStory && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-zru-green rounded-full" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900">
                    Featured Coverage
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Lead Hero 16:9 Banner (Span 8) */}
                  <Link
                    href={leadHeroStory.url}
                    className="lg:col-span-8 group relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200 aspect-[16/10] sm:aspect-[16/9] flex flex-col justify-end p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <Image
                      src={leadHeroStory.image}
                      alt={leadHeroStory.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
                      unoptimized={leadHeroStory.image.startsWith("/images/legacy-articles/")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                    
                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-zru-green text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                          {leadHeroStory.category}
                        </span>
                        {leadHeroStory.date && (
                          <span className="text-white/70 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zru-green" />
                            {leadHeroStory.date}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight group-hover:text-emerald-300 transition-colors line-clamp-3">
                        {leadHeroStory.title}
                      </h2>

                      {leadHeroStory.excerpt && (
                        <p className="text-white/80 text-sm line-clamp-2 sm:line-clamp-3 font-normal max-w-2xl">
                          {leadHeroStory.excerpt.replace(/<[^>]+>/g, " ")}
                        </p>
                      )}
                    </div>
                  </Link>

                  {/* Secondary Featured Side Cards (Span 4) */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    {secondaryFeatured.map((article) => (
                      <Link
                        key={article.id}
                        href={article.url}
                        className="group flex-1 bg-white rounded-3xl border border-neutral-200 p-5 flex flex-col justify-between hover:border-zru-green/40 hover:shadow-md transition-all duration-300"
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100">
                            <Image
                              src={article.image}
                              alt={article.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized={article.image.startsWith("/images/legacy-articles/")}
                            />
                            <div className="absolute top-3 left-3 bg-zru-green text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                              {article.category}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            {article.date && (
                              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-zru-green" />
                                {article.date}
                              </div>
                            )}
                            <h3 className="font-black text-base uppercase tracking-tight text-neutral-900 leading-snug group-hover:text-zru-green transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-black text-zru-green uppercase tracking-wider">
                          <span>Read Story</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Standard 3-Column Chronological Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-5 bg-zru-green rounded-full" />
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-neutral-900">
                    {selectedCategory === "ALL" && searchQuery === "" ? "All Articles & Dispatches" : `Search Results (${filteredArticles.length})`}
                  </h3>
                </div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Page {currentPage} of {totalPages || 1}
                </span>
              </div>

              {gridArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridArticles.map((article) => {
                    const categories = article.categories && article.categories.length > 0
                      ? article.categories
                      : [article.category || "ZRU"];

                    return (
                      <Link
                        key={article.id}
                        href={article.url}
                        className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-zru-green/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[16/10] relative overflow-hidden bg-neutral-100">
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                unoptimized={article.image.startsWith("/images/legacy-articles/")}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                                <Newspaper className="w-10 h-10 text-neutral-300" />
                              </div>
                            )}
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                              {categories.map((cat, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-zru-green text-white shadow-sm"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-5 space-y-2.5">
                            {article.date && (
                              <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
                                <Calendar className="w-3 h-3 text-zru-green" />
                                {article.date}
                              </div>
                            )}
                            <h4 className="font-black text-base text-neutral-900 leading-snug uppercase tracking-tight group-hover:text-zru-green transition-colors line-clamp-2">
                              {article.title}
                            </h4>
                            <p className="text-neutral-600 text-xs leading-relaxed line-clamp-3">
                              {(article.excerpt || article.content || "").replace(/<[^>]+>/g, " ")}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-black text-zru-green uppercase tracking-wider">
                          <span>Read Full Story</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-500 font-bold text-sm">
                  No articles found matching "{searchQuery || selectedCategory}".
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-neutral-200 bg-white text-neutral-700 hover:border-zru-green disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-xl text-xs font-black uppercase transition-all ${
                            currentPage === page
                              ? "bg-zru-green text-white shadow-sm"
                              : "bg-white border border-neutral-200 text-neutral-700 hover:border-zru-green"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-neutral-200 bg-white text-neutral-700 hover:border-zru-green disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 2: Video Highlights */}
        {(activeTab === "all" || activeTab === "videos") && (
          <div className="pt-6">
            <MatchdayVideoHighlights />
          </div>
        )}

        {/* Fan Zone CTA Banner */}
        <div className="pt-6">
          <FanZoneSignup />
        </div>
      </div>
    </div>
  );
}
