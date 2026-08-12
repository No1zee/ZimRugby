/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Play, Search, Facebook, ArrowRight, Calendar } from "lucide-react";
import Button from "@/components/common/Button";
import VideoCard from "@/components/media/VideoCard";
import { useState, useEffect } from "react";

import CmsHero from "@/components/cms/CmsHero";
import PageAnnouncements from "@/components/ui/PageAnnouncements";
import MatchdayVideoHighlights from "@/components/media/MatchdayVideoHighlights";
import Image from "next/image";
import Link from "next/link";
import type { Report } from "@/lib/data-fetcher";
import FanZoneSignup from "@/components/fanzone/FanZoneSignup";

interface MediaPageClientProps {
  initialSocialPosts: any[];
  cmsPage?: any;
  initialNews?: Report[];
}

interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  category: string;
  publishedAt: string;
}

const FALLBACK_VIDEOS: YouTubeVideo[] = [
  { id: "yt-canada-v-zim-2026", videoId: "kf33dibu7f0", title: "Canada v Zimbabwe | Nations Cup 2026 Extended Highlights", thumbnail: "https://img.youtube.com/vi/kf33dibu7f0/hqdefault.jpg", category: "NATIONS CUP", publishedAt: "JULY 2026" },
  { id: "yt-usa-v-zim-2026", videoId: "2koQbsHjg14", title: "USA v Zimbabwe | Nations Cup 2026 Extended Highlights", thumbnail: "https://img.youtube.com/vi/2koQbsHjg14/hqdefault.jpg", category: "NATIONS CUP", publishedAt: "JULY 2026" },
  { id: "yt-tonga-v-zim-2026", videoId: "h3iy3mTIhs4", title: "Tonga v Zimbabwe | Nations Cup 2026 Extended Highlights", thumbnail: "https://img.youtube.com/vi/h3iy3mTIhs4/hqdefault.jpg", category: "NATIONS CUP", publishedAt: "JULY 2026" },
  { id: "yt-canada-replay", videoId: "kf33dibu7f0", title: "Sables Nations Cup Opener | Canada v Zimbabwe Full Match Replay", thumbnail: "https://img.youtube.com/vi/kf33dibu7f0/hqdefault.jpg", category: "MATCHDAY REPLAY", publishedAt: "JULY 2026" },
];

export default function MediaPageClient({ initialSocialPosts, cmsPage, initialNews = [] }: MediaPageClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "news" | "social">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS);
  const [selectedArticle, setSelectedArticle] = useState<Report | null>(null);

  useEffect(() => {
    fetch("/api/videos/youtube")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setVideos(data);
      })
      .catch(() => {});
  }, []);

  const authenticArticles = initialNews.map((n) => ({
    ...n,
    slug: n.url,
    source: n.source || ('website' as const),
  }));

  const socialPosts = initialSocialPosts.map((p) => ({
    ...p,
    slug: p.url,
    source: 'facebook' as const,
  }));

  return (
    <main className="bg-milk-white min-h-screen pb-12 relative overflow-hidden text-rich-black">
      {/* PageHero header */}
      <CmsHero
        kicker={cmsPage?.hero_kicker || "Latest Content"}
        title={cmsPage?.hero_title || "Media Hub"}
        intro={cmsPage?.hero_intro || "Watch highlights, interviews, and full matches. Stay up to date with the latest news and social updates."}
        image={cmsPage?.hero_image || "/images/media/vid1.jpg"}
        breadcrumb={[{ label: "Media", href: "/media" }]}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Page Announcements */}
        <PageAnnouncements scope="media" className="mb-8" />

        {/* Nations Cup Matchday Media & Video Highlights */}
        <div className="mb-14">
          <MatchdayVideoHighlights />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div className="flex p-1 bg-black/5 rounded-xl border border-black/10 w-fit overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setActiveTab("all")}
                    className={`px-5 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase transition-[background-color,color,box-shadow] whitespace-nowrap ${activeTab === "all" ? "bg-zru-green text-white shadow-md" : "text-black/60 hover:text-black"}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setActiveTab("videos")}
                    className={`px-5 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase transition-[background-color,color,box-shadow] whitespace-nowrap ${activeTab === "videos" ? "bg-zru-green text-white shadow-md" : "text-black/60 hover:text-black"}`}
                >
                    Videos
                </button>
                <button 
                    onClick={() => setActiveTab("news")}
                    className={`px-5 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase transition-[background-color,color,box-shadow] whitespace-nowrap ${activeTab === "news" ? "bg-zru-green text-white shadow-md" : "text-black/60 hover:text-black"}`}
                >
                    Official News
                </button>
                <button 
                    onClick={() => setActiveTab("social")}
                    className={`px-5 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase transition-[background-color,color,box-shadow] whitespace-nowrap ${activeTab === "social" ? "bg-zru-green text-white shadow-md" : "text-black/60 hover:text-black"}`}
                >
                    Social Media Feed
                </button>
            </div>

            <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                <input 
                    type="text" 
                    placeholder="Search media..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/5 border border-black/10 rounded-xl text-xs text-rich-black placeholder:text-black/40 focus:outline-none focus:border-zru-green/50 transition-colors"
                />
            </div>
        </div>

        {/* Section 1: Video Highlights */}
        {(activeTab === "all" || activeTab === "videos") && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-black/10">
              <h2 className="text-xl font-heading font-bold text-rich-black uppercase tracking-wider flex items-center gap-2">
                <Play className="w-5 h-5 text-zru-green fill-zru-green" />
                Featured Video Highlights
              </h2>
              <span className="text-xs text-black/40 font-bold uppercase">{videos.length} Videos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos
                .filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((video) => (
                  <VideoCard
                    key={video.id}
                    video={{
                      id: video.id,
                      title: video.title,
                      duration: "HIGHLIGHTS",
                      date: video.publishedAt,
                      thumbnail: video.thumbnail,
                      category: video.category,
                      embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId || video.id}`,
                    }}
                  />
                ))}
            </div>
          </section>
        )}

        {/* Section 2: Official News & Press */}
        {(activeTab === "all" || activeTab === "news") && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-black/10">
              <h2 className="text-xl font-heading font-bold text-rich-black uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zru-green" />
                Official News & Press Releases
              </h2>
              <span className="text-xs text-black/40 font-bold uppercase">{authenticArticles.length} Articles</span>
            </div>

            {authenticArticles.filter(n => 
              n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              (n.excerpt && n.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
            ).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {authenticArticles
                  .filter(n => 
                    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    (n.excerpt && n.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((item, index) => (
                    <motion.div
                      key={item.id || index}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedArticle(item)}
                      className="cursor-pointer group bg-white border border-black/10 rounded-xl overflow-hidden hover:shadow-xl hover:border-zru-green/50 transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 flex flex-col h-full"
                    >
                      {item.image && (
                        <div className="relative h-44 w-full overflow-hidden bg-black/5">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-108 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                          <span className="absolute bottom-2.5 left-3 text-[9px] font-black tracking-[0.18em] uppercase text-white bg-zru-green/95 px-2.5 py-0.5 rounded shadow-sm">
                            {item.category || 'PRESS'}
                          </span>
                        </div>
                      )}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-black/40 text-[10px] font-bold uppercase mb-2">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </div>
                          <h3 className="text-base font-heading font-bold text-rich-black mb-2 group-hover:text-zru-green transition-colors leading-snug line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-black/60 text-xs leading-relaxed line-clamp-2 mb-3">
                            {item.excerpt}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                          <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-1 group-hover:gap-2 transition-[gap]">
                            Quick View
                            <ArrowRight className="w-3 h-3" />
                          </span>
                          <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest">
                            ZRU Press
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-black/40 text-sm">
                No official news articles found matching your search.
              </div>
            )}
          </section>
        )}

        {/* Section 3: Social Media Feed */}
        {(activeTab === "all" || activeTab === "social") && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-black/10">
              <h2 className="text-xl font-heading font-bold text-rich-black uppercase tracking-wider flex items-center gap-2">
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                Official Facebook Feed
              </h2>
              <span className="text-xs text-black/40 font-bold uppercase">{socialPosts.length} Updates</span>
            </div>

            {socialPosts.filter(p => (p.content || '').toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialPosts
                  .filter(p => (p.content || '').toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((post, index) => (
                    <motion.div
                      key={post.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between"
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/20 flex items-center justify-center font-bold text-[#1877F2] text-sm">
                              ZRU
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-rich-black">Zimbabwe Rugby Union</h4>
                              <span className="text-[10px] text-black/40 font-bold uppercase">{post.date}</span>
                            </div>
                          </div>
                          <Facebook className="w-4 h-4 text-[#1877F2]" />
                        </div>

                        {post.image && (
                          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-4 bg-black/5">
                            <Image
                              src={post.image}
                              alt="Social Post"
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        )}

                        <p className="text-black/80 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                          {post.content}
                        </p>
                      </div>

                      <Link
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3.5 bg-black/5 hover:bg-[#1877F2] text-black/60 hover:text-white border-t border-black/5 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-between group"
                      >
                        <span>View Post on Facebook</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-black/40 text-sm">
                No social media posts found matching your search.
              </div>
            )}
          </section>
        )}
      </div>

      {/* Article Detail Full-Screen Immersive Kindle-Style Modal Popup */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FBF9F5] text-[#222222] border border-[#E5E0D5] rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl relative font-sans"
          >
            {/* Kindle Header Toolbar */}
            <div className="bg-[#F3EFE6] border-b border-[#E3DCD0] px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase bg-[#006747] text-white px-3 py-1 rounded shadow-sm">
                  {selectedArticle.category || 'OFFICIAL PRESS'}
                </span>
                <span className="text-xs text-[#666053] font-bold uppercase tracking-wider">
                  {selectedArticle.date}
                </span>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-[#E5DFD3] hover:bg-[#D9D1C3] text-[#443E33] w-9 h-9 rounded-full flex items-center justify-center transition-colors text-sm font-bold shadow-xs cursor-pointer"
                aria-label="Close article modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Container (Kindle Reader Canvas) */}
            <div className="p-6 sm:p-10 md:p-12 overflow-y-auto space-y-6 flex-1 bg-[#FBF9F5] selection:bg-[#006747]/20">
              {/* Article Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black leading-tight text-[#1A1A1A] tracking-tight">
                {selectedArticle.title}
              </h1>

              {/* Optional Lead Image */}
              {selectedArticle.image && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#EFEAE1] border border-[#E3DCD0] my-4 shadow-xs">
                  <Image
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Byline */}
              <div className="flex items-center justify-between text-[#777063] text-xs font-semibold pb-4 border-b border-[#E5E0D5]">
                <span className="text-[#006747] font-black tracking-wider uppercase">Zimbabwe Rugby Union Official Media</span>
                <span>• Read In Place</span>
              </div>

              {/* Full Kindle Reader Text Formatting */}
              <div className="text-[#2C2925] text-base sm:text-lg leading-[1.8] font-normal space-y-5 tracking-[0.01em]">
                {selectedArticle.content ? (
                  selectedArticle.content.startsWith('<') ? (
                    <div
                      className="prose max-w-none text-[#2C2925] leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                    />
                  ) : (
                    selectedArticle.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    ))
                  )
                ) : (
                  <p className="leading-relaxed italic">
                    {selectedArticle.excerpt}
                  </p>
                )}
              </div>
            </div>

            {/* Kindle Footer */}
            <div className="bg-[#F3EFE6] border-t border-[#E3DCD0] px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-xs text-[#777063] font-bold">End of Article</span>

              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-[#006747] hover:bg-[#005238] text-white text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Finished Reading
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FanZoneSignup />
      </div>
    </main>
  );
}
