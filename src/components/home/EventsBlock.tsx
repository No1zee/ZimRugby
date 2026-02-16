"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Plus, Trophy, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { StaggerContainer, staggerItemVariants } from "../ui/animations";
import { StripedBackground } from "../ui/StripedBackground";
import { BackgroundText } from "../ui/BackgroundText";
import SubtleBackground from "../ui/SubtleBackground";

const events = [
  {
    id: 1,
    title: "ZIMBABWE SUPER LEAGUE",
    subtitle: "2025/26 SEASON",
    date: "10 OCT 2025 - 14 MAR 2026",
    location: "NATIONWIDE",
    description: "The premier domestic rugby competition featuring Zimbabwe's top clubs.",
    tags: ["Domestic", "Super League"],
    icon: Trophy,
    color: "from-zru-green to-black",
    image: "/images/events/super-league.jpg"
  },
  {
    id: 2,
    title: "AFRICA CUP 2025",
    subtitle: "DEFENDING CHAMPIONS",
    date: "20 MAR - 29 MAR 2025",
    location: "HARARE, ZIMBABWE",
    description: "The Sables host the continent's premier tournament on home soil.",
    tags: ["Sables", "International"],
    icon: Trophy,
    color: "from-gray-900 to-black",
    image: "/images/media/vid1.jpg"
  },
  {
    id: 3,
    title: "SCHOOLS RUGBY FESTIVAL",
    subtitle: "ANNUAL SHOWCASE",
    date: "15 AUG - 18 AUG 2025",
    location: "HARARE",
    description: "The next generation of Sables compete in Zimbabwe's biggest schools event.",
    tags: ["Youth", "Schools"],
    icon: GraduationCap,
    color: "from-zru-green to-gray-900",
    image: "/images/events/schools-fest.jpg"
  }
];

export default function EventsBlock() {
  return (
    <section className="relative bg-gray-50 py-16 lg:py-24 overflow-hidden">
      
      {/* Background text - "WHAT'S ON? A GAME FOR ALL" style */}
      <BackgroundText text="WHAT'S ON?" repeat={3} color="green" className="mt-32" />
      

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Title Block (Navy blue like HK Rugby) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 bg-[#091F40] p-8 lg:p-10 rounded-lg flex flex-col justify-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-tight mb-4">
              WHAT'S<br />ON?
            </h2>
            
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Want to watch action-packed rugby matches? Or be a part of our wide range of community and corporate events? Our What's On listings have you covered!
            </p>
            
            <Link href="/events">
              <motion.button
                className="bg-zru-green hover:bg-green-800 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Listings
                <Plus className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Right: Events Cards */}
          <StaggerContainer 
            className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6" 
            staggerDelay={0.1}
          >
            {events.slice(0, 2).map((event) => (
              <motion.div key={event.id} variants={staggerItemVariants}>
                <Link href={`/events/${event.id}`} className="block h-full group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col relative group">
                    <SubtleBackground variant="flow" intensity="low" />
                    
                    {/* Image Placeholder or Actual Image */}
                    <div className={`h-48 relative overflow-hidden group`}>
                      <Image 
                        src={event.image || ""} 
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-linear-to-br ${event.color} opacity-60 mix-blend-multiply group-hover:opacity-40 transition-opacity duration-300`} />
                      
                      {/* Tags */}
                      <div className="absolute top-3 left-3 z-10 flex gap-1">
                        {event.tags.map(tag => (
                          <span 
                            key={tag}
                            className="bg-white/90 text-gray-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Icon */}
                      <div className="absolute top-3 right-3 z-10">
                         <div className="bg-white/20 backdrop-blur-xs p-2 rounded-full">
                            <event.icon className="w-5 h-5 text-white" />
                         </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-black text-gray-900 uppercase mb-1 group-hover:text-zru-green transition-colors">
                        {event.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {event.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
