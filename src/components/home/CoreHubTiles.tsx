"use client";

import { motion } from "framer-motion";
import { Calendar, PlayCircle, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tiles = [
  {
    key: "match_centre",
    label: "MATCH CENTRE",
    description: "Fixtures, results, tables and live scores.",
    icon: Trophy,
    href: "/match-centre",
    color: "bg-zru-green",
  },
  {
    key: "media",
    label: "MEDIA HUB",
    description: "Highlights, full match replays, and interviews.",
    icon: PlayCircle,
    href: "/media",
    color: "bg-zru-orange",
  },
  {
    key: "whats_on",
    label: "WHAT&apos;S ON",
    description: "Upcoming matches, events, and programmes.",
    icon: Calendar,
    href: "/events",
    color: "bg-zru-gold",
  },
  {
    key: "play_rugby",
    label: "PLAY RUGBY",
    description: "Pathways, clubs, schools and community rugby.",
    icon: Users,
    href: "/play-rugby",
    color: "bg-white",
    textColor: "text-rich-black",
  },
];

export default function CoreHubTiles() {
  return (
    <section className="bg-rich-black relative z-20 -mt-20 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiles.map((tile, index) => (
            <motion.div
              key={tile.key}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 h-64 flex flex-col justify-between p-6 cursor-pointer"
            >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${tile.color}`} />

                <div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${tile.color} ${tile.textColor || "text-white"}`}>
                        <tile.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-heading text-white mb-2 tracking-wide group-hover:text-zru-gold transition-colors">
                        {tile.label}
                    </h3>
                    <p className="text-gray-400 text-sm font-body leading-relaxed">
                        {tile.description}
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold tracking-widest text-white/60 group-hover:text-white transition-colors uppercase mt-4">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
