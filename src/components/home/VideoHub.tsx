"use client";

import { motion } from "framer-motion";
import { Play, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Button from "../common/Button";

// Mock Data
const videos = [
  {
    id: 1,
    title: "Sables vs Kenya: Highlights",
    duration: "10:32",
    date: "2 days ago",
    thumbnail: "/images/media/vid1.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Player Profile: T. Musingwini",
    duration: "3:45",
    date: "5 days ago",
    thumbnail: "/images/media/vid2.jpg",
  },
  {
    id: 3,
    title: "Road to World Cup 2027",
    duration: "15:20",
    date: "1 week ago",
    thumbnail: "/images/media/vid3.jpg",
  },
  {
    id: 4,
    title: "Training Camp: Behind Scenes",
    duration: "5:10",
    date: "2 weeks ago",
    thumbnail: "/images/media/vid4.jpg",
  },
];

export default function VideoHub() {
  const featuredVideo = videos.find((v) => v.featured) || videos[0];
  const secondaryVideos = videos.filter((v) => v.id !== featuredVideo.id);

  return (
    <section className="py-20 bg-rich-black relative border-t border-white/10 overflow-hidden" id="video-hub">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/events/africa-cup.jpg" 
          alt="Background" 
          fill 
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-b from-rich-black via-rich-black/90 to-rich-black" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-white font-heading text-xl tracking-widest mb-2">
              WATCH
            </h2>
            <h3 className="text-4xl md:text-5xl font-heading text-white">
              VIDEO HIGHLIGHTS
            </h3>
          </div>
          <Button variant="ghost" rightIcon={<ArrowRight className="w-5 h-5" />} className="hidden md:flex">
            GO TO VIDEO HUB
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Video */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="lg:col-span-2 relative group rounded-2xl overflow-hidden aspect-video bg-gray-900 shadow-2xl cursor-pointer"
            >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80 z-10" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <motion.div
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.95 }}
                       className="w-20 h-20 bg-zru-green rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,150,70,0.4)] group-hover:shadow-[0_0_50px_rgba(0,150,70,0.6)] transition-shadow"
                    >
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                    <span className="bg-zru-green text-white text-xs font-bold px-2 py-1 rounded inline-block mb-3">
                        FEATURED
                    </span>
                    <h3 className="text-2xl md:text-4xl font-heading text-white mb-2 leading-tight">
                        {featuredVideo.title}
                    </h3>
                    <div className="flex items-center gap-4 text-gray-300 text-sm font-bold">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {featuredVideo.duration}</span>
                        <span>&bull;</span>
                        <span>{featuredVideo.date}</span>
                    </div>
                </div>
            </motion.div>

            {/* Secondary Videos Rail */}
            <div className="flex flex-col gap-4">
                {secondaryVideos.map((video, index) => (
                    <motion.div
                       key={video.id}
                       initial={{ opacity: 0, x: 20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.4, delay: index * 0.1 }}
                       whileHover={{ x: -5 }}
                       className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                        <div className="w-32 h-20 bg-gray-800 rounded-lg overflow-hidden relative shrink-0">
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                           <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-zru-green group-hover:text-white transition-colors">
                                   <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                               </div>
                           </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h4 className="text-white font-heading text-lg leading-tight mb-1 group-hover:text-zru-green transition-colors line-clamp-2">
                                {video.title}
                            </h4>
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                                <span>{video.duration}</span>
                                <span>&bull;</span>
                                <span>{video.date}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
                
                <Button variant="outline" className="mt-auto w-full md:hidden">
                    VIEW ALL VIDEOS
                </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
