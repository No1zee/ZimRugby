"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import EventCard from "@/components/events/EventCard";

// Mock Data
const events = [
  {
    id: 1,
    title: "ZRU Annual General Meeting",
    date: "15 AUG 2025",
    time: "10:00 - 13:00",
    description: "The Annual General Meeting of the Zimbabwe Rugby Union involves all stakeholders and provincial boards.",
    location: "ZRU Offices, Harare Sports Club",
    category: "ADMINISTRATION",
    color: "bg-gray-600",
  },
  {
    id: 2,
    title: "Level 1 Coaching Course (World Rugby)",
    date: "20 AUG 2025",
    time: "09:00 - 16:00",
    description: "A foundational course for aspiring rugby coaches. Covers safety, laws of the game, and basic drills.",
    location: "Hartsfield, Bulawayo",
    category: "EDUCATION",
    color: "bg-zru-gold",
  },
  {
    id: 3,
    title: "Summer Sevens Series: Round 1",
    date: "02 SEP 2025",
    time: "08:00 - 17:00",
    description: "The kick-off of the national summer sevens series featuring top clubs from across the country.",
    location: "Machipisa, Highfields",
    category: "TOURNAMENT",
    color: "bg-zru-green",
  },
  {
    id: 4,
    title: "Sables Fundraising Dinner",
    date: "10 SEP 2025",
    time: "18:30 - 22:00",
    description: "A gala dinner to support the Sables' World Cup qualification campaign. Guest speaker: Tendai 'Beast' Mtawarira.",
    location: "Meikles Hotel, Harare",
    category: "SOCIAL",
    color: "bg-zru-orange",
  },
  {
    id: 5,
    title: "Girls Rugby Festival",
    date: "17 SEP 2025",
    time: "09:00 - 14:00",
    description: "Promoting women in rugby. Open to all girls aged 10-16. No experience required.",
    location: "Prince Edward School",
    category: "DEVELOPMENT",
    color: "bg-purple-600",
  },
];

export default function EventsPage() {
  return (
    <main className="bg-rich-black min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-12"
        >
           <h1 className="text-5xl md:text-7xl font-heading text-white mb-4">WHAT&apos;S ON</h1>
           <p className="text-xl text-gray-400 max-w-2xl">
              From high-performance fixtures to grassroots festivals and coaching clinics. Find out what&apos;s happening in Zimbabwe Rugby.
           </p>
        </motion.div>

        {/* Month Selector / Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white/5 p-4 rounded-xl border border-white/10">
           
           {/* Simple Month Nav */}
           <div className="flex items-center gap-4">
              <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                 <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-2xl font-heading text-white min-w-[150px] text-center">AUGUST 2025</h2>
              <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                 <ChevronRight className="w-5 h-5" />
              </button>
           </div>

           {/* Category Filters */}
           <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
               <span className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-widest hidden md:block">Filter:</span>
               {["All", "Tournaments", "Education", "Social", "Admin"].map((filter, i) => (
                   <button 
                      key={i}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors border border-transparent ${i === 0 ? "bg-white text-rich-black" : "bg-white/5 text-gray-400 hover:text-white hover:border-white/20"}`}
                    >
                      {filter}
                   </button>
               ))}
           </div>
        </div>

         {/* Events Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
               <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
               >
                  <EventCard {...event} />
               </motion.div>
            ))}
         </div>

      </div>
    </main>
  );
}
