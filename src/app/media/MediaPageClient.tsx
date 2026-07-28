/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Play, Search, Facebook, ArrowRight, Calendar } from "lucide-react";
import Button from "@/components/common/Button";
import VideoCard from "@/components/media/VideoCard";
import { useState, useEffect } from "react";
import JournalStrip from "@/components/home/JournalStrip";
import PageHero from "@/components/ui/PageHero";
import PageAnnouncements from "@/components/ui/PageAnnouncements";
import MatchdayVideoHighlights from "@/components/media/MatchdayVideoHighlights";
import Image from "next/image";
import Link from "next/link";
import FanZoneSignup from "@/components/fanzone/FanZoneSignup";

interface MediaPageClientProps {
  initialSocialPosts: any[];
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

const newsArchive = [
  {
    id: 1,
    title: "ZRU announces new partnership with Nedbank",
    category: "PARTNERSHIP",
    date: "15 JUL 2025",
    excerpt: "A landmark deal that will see sustained investment in grassroots development and high-performance programs.",
  },
  {
    id: 2,
    title: "Schools Rugby Festival: Fixtures confirmed",
    category: "SCHOOLS",
    date: "12 JUL 2025",
    excerpt: "The country&apos;s top schools descend on Prince Edward for a week of exhilarating schoolboy rugby.",
  },
  {
    id: 3,
    title: "Cheetahs squad named for Sevens World Cup",
    category: "CHEETAHS",
    date: "10 JUL 2025",
    excerpt: "Experienced campaigners return to the fold as the Cheetahs look to make an impact on the global stage.",
  },
  {
    id: 4,
    title: "Community Rugby: Growing the game in Matabeleland",
    category: "DEVELOPMENT",
    date: "08 JUL 2025",
    excerpt: "New initiatives launched to increase participation and improve facilities in Bulawayo and surrounds.",
  },
];

export default function MediaPageClient({ initialSocialPosts }: MediaPageClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "news" | "social">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS);

  useEffect(() => {
    fetch("/api/videos/youtube")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setVideos(data);
      })
      .catch(() => {});
  }, []);

  const allNews = [...newsArchive, ...initialSocialPosts.map(p => ({
    ...p,
    slug: p.url,
    source: 'facebook' as const
  }))].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredNews = allNews.filter(n => {
    // Search filter
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (n.excerpt && n.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    // Tab filter
    if (activeTab === "all") return true;
    if (activeTab === "news") return n.source !== 'facebook';
    if (activeTab === "social") return n.source === 'facebook';
    return false;
  });

  return (
    <main className="bg-milk-white min-h-screen pb-12 relative overflow-hidden text-rich-black">
      {/* PageHero header */}
      <PageHero
        title="Media Hub"
        subtitle="Watch highlights, interviews, and full matches. Stay up to date with the latest news and social updates."
        tag="Latest Content"
        backgroundImage="/images/media/vid1.jpg"
        breadcrumb={[{ label: "Media", href: "/media" }]}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Page Announcements */}
        <PageAnnouncements scope="media" className="mb-8" />

        {/* Nations Cup Matchday Media & Video Highlights */}
        <div className="mb-16">
          <MatchdayVideoHighlights />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div className="flex p-1 bg-black/5 rounded-xl border border-black/10 w-fit overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setActiveTab("all")}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase transition-[background-color,color,box-shadow] whitespace-nowrap ${activeTab === "all" ? "bg-zru-green text-white shadow-lg" : "text-black/60 hover:text-black"}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setActiveTab("videos")}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase transition-[background-color,color,box-shadow] whitespace-nowrap ${activeTab === "videos" ? "bg-zru-green text-white shadow-lg" : "text-black/60 hover:text-black"}`}
                >
                    Videos
                </button>
                <button 
                    onClick={() => setActiveTab("news")}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase transition-[background-color,color,box-shadow] whitespace-nowrap ${activeTab === "news" ? "bg-zru-green text-white shadow-lg" : "text-black/60 hover:text-black"}`}
                >
                    Official
                </button>
                <button 
                    onClick={() => setActiveTab("social")}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase transition-[background-color,color,box-shadow] whitespace-nowrap flex items-center gap-2 ${activeTab === "social" ? "bg-zru-green text-white shadow-lg" : "text-black/60 hover:text-black"}`}
                >
                    Social <Facebook className={`w-3 h-3 ${activeTab === "social" ? "text-white" : "text-black/40"}`} />
                </button>
            </div>

            <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/45" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news & videos… e.g. Sables" 
                    className="w-full bg-black/5 border border-black/10 rounded-lg pl-10 pr-4 py-3 text-rich-black placeholder-black/45 focus:outline-none focus:border-zru-green text-sm transition-[border-color]"
                />
            </div>
        </div>

        {/* Featured Video Section */}
        {(activeTab === "all" || activeTab === "videos") && (
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-24"
            >
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-heading text-rich-black flex items-center gap-3 uppercase">
                        <Play className="w-6 h-6 text-zru-green" fill="currentColor" />
                        Latest Videos
                    </h2>
                    <div className="h-px flex-1 bg-black/10" />
                    {activeTab === "all" && (
                        <button onClick={() => setActiveTab("videos")} className="text-zru-green text-[10px] font-black tracking-[0.2em] hover:text-black transition-colors uppercase">
                            View All
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <VideoCard
                                title={video.title}
                                duration=""
                                date={video.publishedAt}
                                thumbnail={video.thumbnail}
                                category={video.category}
                                videoId={video.videoId}
                            />
                        </motion.div>
                    ))}
                </div>
                
                {activeTab === "videos" && (
                     <div className="mt-12 text-center flex justify-center">
                        <Button variant="outline" className="text-rich-black border-black/20 hover:bg-black/5 px-12">
                            LOAD MORE VIDEOS
                        </Button>
                    </div>
                )}
            </motion.section>
        )}

        {/* News & Social Archive */}
        {(activeTab === "all" || activeTab === "news" || activeTab === "social") && (
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-heading text-rich-black uppercase">
                        {activeTab === "social" ? "Social Feed" : activeTab === "news" ? "Official News" : "Recent Updates"}
                    </h2>
                    <div className="h-px flex-1 bg-black/10" />
                     {activeTab === "all" && (
                        <div className="flex gap-4">
                            <button onClick={() => setActiveTab("news")} className="text-zru-green text-[10px] font-black tracking-[0.2em] hover:text-black transition-colors uppercase">
                                News
                            </button>
                            <button onClick={() => setActiveTab("social")} className="text-zru-green text-[10px] font-black tracking-[0.2em] hover:text-black transition-colors uppercase">
                                Social
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Animated Interactive News Grid */}
                <div className="mb-12">
                  {filteredNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredNews.map((item, index) => (
                        <motion.div
                          key={item.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.url || item.slug || '#'}
                            target={item.source === 'facebook' ? '_blank' : '_self'}
                            rel={item.source === 'facebook' ? 'noopener noreferrer' : ''}
                            className="block bg-white border border-black/5 rounded-2xl overflow-hidden hover:shadow-lg hover:border-zru-green/30 transition-[box-shadow,border-color] group"
                          >
                            {item.image && item.image !== '/images/media/fb_placeholder.jpg' && (
                              <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  className="object-cover group-hover:brightness-110 transition-[filter] duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                              </div>
                            )}
                            <div className="p-5">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-[10px] font-black tracking-[0.15em] uppercase text-zru-green bg-zru-green/10 px-2.5 py-1 rounded-md">
                                  {item.category || 'SOCIAL'}
                                </span>
                                {item.source === 'facebook' && (
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 bg-zru-green rounded-full flex items-center justify-center">
                                      <Facebook className="w-3 h-3 text-white fill-current" />
                                    </div>
                                    <span className="text-[10px] font-bold text-black/40 uppercase">Facebook</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5 ml-auto text-black/40">
                                  <Calendar className="w-3 h-3" />
                                  <span className="text-[10px] font-bold uppercase">{item.date}</span>
                                </div>
                              </div>
                              <h3 className="text-base font-heading font-bold text-rich-black mb-2 group-hover:text-zru-green transition-colors leading-snug line-clamp-2">
                                {item.title}
                              </h3>
                              <p className="text-black/60 text-sm leading-relaxed line-clamp-2 mb-3">
                                {item.excerpt}
                              </p>
                              <span className="text-zru-green text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 group-hover:gap-2.5 transition-[gap]">
                                {item.source === 'facebook' ? 'View on Facebook' : 'Read More'}
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 md:py-12 text-black/40">
                      <p className="text-sm font-normal">No updates found matching your search.</p>
                    </div>
                  )}
                </div>

                <div className="mt-12 flex justify-center">
                     <Button variant="primary" className="bg-zru-green text-white hover:bg-zru-green/90 px-12">
                        LOAD MORE UPDATES
                     </Button>
                </div>
            </motion.section>
        )}

      </div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FanZoneSignup />
      </div>

      <section className="mt-12 border-t border-black/5 pt-12 md:pt-16">
        <JournalStrip />
      </section>
    </main>
  );
}
