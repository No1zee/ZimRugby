/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Play, Search, Facebook } from "lucide-react";
import Button from "@/components/common/Button";
import VideoCard from "@/components/media/VideoCard";
import NewsCard from "@/components/media/NewsCard";
import { useState } from "react";
import JournalStrip from "@/components/home/JournalStrip";
import PageHero from "@/components/ui/PageHero";
import PageAnnouncements from "@/components/ui/PageAnnouncements";
import { NewsCards } from "@/components/ui/news-cards";

interface MediaPageClientProps {
  initialSocialPosts: any[];
}

const latestVideos = [
  {
    id: 1,
    title: "HIGHLIGHTS: Sables vs Namibia | Africa Cup Final",
    duration: "12:45",
    date: "22 JUL 2025",
    thumbnail: "/images/media/vid1.jpg",
    category: "HIGHLIGHTS",
  },
  {
    id: 2,
    title: "INTERVIEW: Piet Benade on Squad Selection",
    duration: "05:30",
    date: "20 JUL 2025",
    thumbnail: "/images/media/vid2.jpg",
    category: "INTERVIEW",
  },
  {
    id: 3,
    title: "TRAINING: Inside Camp with the Lady Sables",
    duration: "08:15",
    date: "18 JUL 2025",
    thumbnail: "/images/media/vid3.jpg",
    category: "FEATURE",
  },
  {
    id: 4,
    title: "FULL MATCH: Zimbabwe vs Uganda | Africa Cup Semi-Final",
    duration: "1:45:00",
    date: "15 JUL 2025",
    thumbnail: "/images/media/vid4.jpg",
    category: "FULL MATCH",
  },
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
    <main className="bg-milk-white min-h-screen pb-24 relative overflow-hidden text-rich-black">
      {/* PageHero header */}
      <div className="pt-24">
        <PageHero
          title="Media Hub"
          subtitle="Watch highlights, interviews, and full matches. Stay up to date with the latest news and social updates."
          tag="Latest Content"
          backgroundImage="/images/media/vid1.jpg"
          breadcrumb={[{ label: "Media", href: "/media" }]}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">

        {/* Page Announcements */}
        <PageAnnouncements scope="media" className="mb-12" />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div className="flex p-1 bg-black/5 rounded-xl border border-black/10 w-fit overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setActiveTab("all")}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap ${activeTab === "all" ? "bg-zru-green text-white shadow-lg" : "text-black/60 hover:text-black"}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setActiveTab("videos")}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap ${activeTab === "videos" ? "bg-zru-green text-white shadow-lg" : "text-black/60 hover:text-black"}`}
                >
                    Videos
                </button>
                <button 
                    onClick={() => setActiveTab("news")}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap ${activeTab === "news" ? "bg-zru-green text-white shadow-lg" : "text-black/60 hover:text-black"}`}
                >
                    Official
                </button>
                <button 
                    onClick={() => setActiveTab("social")}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === "social" ? "bg-zru-green text-white shadow-lg" : "text-black/60 hover:text-black"}`}
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
                    className="w-full bg-black/5 border border-black/10 rounded-lg pl-10 pr-4 py-3 text-rich-black placeholder-black/45 focus:outline-none focus:border-zru-green text-sm transition-all"
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
                    {latestVideos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <VideoCard {...video} />
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
                  <NewsCards enableAnimations={true} />
                </div>

                <div className="mt-12 flex justify-center">
                     <Button variant="primary" className="bg-zru-green text-white hover:bg-zru-green/90 px-12">
                        LOAD MORE UPDATES
                     </Button>
                </div>
            </motion.section>
        )}

      </div>
      
      <section className="mt-24 border-t border-black/5 pt-24">
        <JournalStrip />
      </section>
    </main>
  );
}
