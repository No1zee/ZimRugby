"use client";

import { motion } from "framer-motion";
import { Play, Search, Filter } from "lucide-react";
import Button from "@/components/common/Button";
import VideoCard from "@/components/media/VideoCard";
import NewsCard from "@/components/media/NewsCard";
import { useState } from "react";

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

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "news">("all");

  return (
    <main className="bg-rich-black min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            >
            <h1 className="text-5xl md:text-7xl font-heading text-white mb-4">MEDIA HUB</h1>
            <p className="text-xl text-gray-400 max-w-2xl">
                Watch highlights, interviews, and full matches. Stay up to date with the latest news from Zimbabwean rugby.
            </p>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
                    <button 
                        onClick={() => setActiveTab("all")}
                        className={`px-6 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition-all ${activeTab === "all" ? "bg-zru-gold text-rich-black shadow-lg" : "text-gray-400 hover:text-white"}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setActiveTab("videos")}
                        className={`px-6 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition-all ${activeTab === "videos" ? "bg-zru-gold text-rich-black shadow-lg" : "text-gray-400 hover:text-white"}`}
                    >
                        Videos
                    </button>
                    <button 
                        onClick={() => setActiveTab("news")}
                        className={`px-6 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition-all ${activeTab === "news" ? "bg-zru-gold text-rich-black shadow-lg" : "text-gray-400 hover:text-white"}`}
                    >
                        News
                    </button>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search news & videos..." 
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-zru-gold text-sm"
                    />
                </div>
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
                    <h2 className="text-2xl font-heading text-white flex items-center gap-3">
                        <Play className="w-6 h-6 text-zru-orange" fill="currentColor" />
                        LATEST VIDEOS
                    </h2>
                    <div className="h-px flex-1 bg-white/10" />
                    {activeTab === "all" && (
                        <button onClick={() => setActiveTab("videos")} className="text-zru-orange text-xs font-bold tracking-widest hover:text-white transition-colors">
                            VIEW ALL
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
                     <div className="mt-8 text-center flex justify-center">
                        <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                            LOAD MORE VIDEOS
                        </Button>
                    </div>
                )}
            </motion.section>
        )}

        {/* News Archive */}
        {(activeTab === "all" || activeTab === "news") && (
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-heading text-white">LATEST NEWS</h2>
                    <div className="h-px flex-1 bg-white/10" />
                     {activeTab === "all" && (
                        <button onClick={() => setActiveTab("news")} className="text-zru-orange text-xs font-bold tracking-widest hover:text-white transition-colors">
                            VIEW ALL
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {newsArchive.map((news, index) => (
                        <motion.div 
                            key={news.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <NewsCard {...news} />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                     <Button variant="primary" className="bg-white text-rich-black hover:bg-gray-200">
                        LOAD MORE NEWS
                     </Button>
                </div>
            </motion.section>
        )}

      </div>
    </main>
  );
}

import { ArrowRight } from "lucide-react";
