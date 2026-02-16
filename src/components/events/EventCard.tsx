"use client";

import { motion } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import Button from "@/components/common/Button";

interface EventCardProps {
  id: string | number;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  category: string;
  color: string;
}

export default function EventCard({
  id,
  title,
  date,
  time,
  description,
  location,
  category,
  color,
}: EventCardProps) {
  return (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-zru-green/50 transition-all duration-300 group flex flex-col h-full"
    >
        {/* Date Banner */}
        <div className="bg-white/5 p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2 text-white font-bold tracking-wider">
            <CalendarIcon className="w-4 h-4 text-white" />
            <span>{date}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded text-white ${color}`}>
            {category}
        </span>
        </div>

        <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-heading text-white mb-4 group-hover:text-zru-green transition-colors leading-tight">
            {title}
        </h3>
        
        <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{time}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
            </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
            {description}
        </p>

        <Button variant="outline" className="w-full justify-center border-white/10 hover:bg-white hover:text-rich-black text-sm py-2">
            EVENT DETAILS
        </Button>
        </div>
    </motion.div>
  );
}
