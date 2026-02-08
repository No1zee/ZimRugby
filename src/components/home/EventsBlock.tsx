"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Button from "../common/Button";

const events = [
  {
    id: 1,
    title: "AGM: Zimbabwe Rugby Union",
    date: "15 AUG, 2025",
    time: "10:00 AM",
    location: "ZRU Offices, Harare",
    category: "MEETING",
    categoryColor: "text-gray-400",
  },
  {
    id: 2,
    title: "Level 1 Coaching Course",
    date: "20 AUG, 2025",
    time: "09:00 AM",
    location: "Bulawayo (Hartsfield)",
    category: "EDUCATION",
    categoryColor: "text-zru-gold",
  },
  {
    id: 3,
    title: "Summer Sevens Series: Round 1",
    date: "02 SEP, 2025",
    time: "08:00 AM",
    location: "Machipisa, Highfields",
    category: "TOURNAMENT",
    categoryColor: "text-zru-green",
  },
  {
    id: 4,
    title: "Sables Fundraising Dinner",
    date: "10 SEP, 2025",
    time: "18:30 PM",
    location: "Meikles Hotel",
    category: "SOCIAL",
    categoryColor: "text-zru-orange",
  },
];

export default function EventsBlock() {
  return (
    <section className="bg-rich-black py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
           <div className="max-w-2xl">
              <h2 className="text-zru-gold text-sm font-bold tracking-[0.2em] uppercase mb-4">WHAT'S ON</h2>
              <h3 className="text-3xl md:text-4xl font-heading text-white">UPCOMING EVENTS & PROGRAMMES</h3>
           </div>
           
           <Button variant="outline" className="border-white/20 hover:bg-white hover:text-rich-black text-white">
              VIEW FULL CALENDAR
           </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {events.map((event, index) => (
              <motion.div
                 key={event.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
                 whileHover={{ y: -5 }}
                 className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-zru-gold/50 transition-all duration-300 group cursor-pointer flex flex-col h-full"
              >
                 <div className={`text-xs font-bold tracking-widest uppercase mb-4 ${event.categoryColor}`}>
                    {event.category}
                 </div>
                 
                 <h4 className="text-xl font-heading text-white mb-auto group-hover:text-zru-gold transition-colors">
                    {event.title}
                 </h4>

                 <div className="mt-6 space-y-3 border-t border-white/5 pt-6">
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                       <Calendar className="w-4 h-4" />
                       <span className="font-bold text-white">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                       <MapPin className="w-4 h-4" />
                       <span>{event.location}</span>
                    </div>
                 </div>
              </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
