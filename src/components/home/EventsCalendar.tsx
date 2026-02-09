"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Button from "../common/Button";

// Mock Data
const events = [
  {
    id: 1,
    title: "RUGBY AFRICA CUP",
    dateRange: "1 MAY - 15 MAY",
    day: "01",
    month: "MAY",
    location: "Various Venues",
    category: "RUGBY AFRICA CUP",
    image: "/images/events/africa-cup.jpg",
  },
  {
    id: 2,
    title: "SCHOOLS RUGBY CHAMPIONSHIPS",
    dateRange: "10 JUN - 12 JUN",
    day: "10",
    month: "JUN",
    location: "Prince Edward School",
    category: "SCHOOLS RUGBY",
    image: "/images/events/schools.jpg",
  },
  {
    id: 3,
    title: "SABLES VS NAMIBIA",
    dateRange: "05 JUL",
    day: "05",
    month: "JUL",
    location: "Harare Sports Club",
    category: "SABLES",
    image: "/images/events/sables.jpg",
  },
  {
    id: 4,
    title: "INTER-PROVINCIAL DERBY",
    dateRange: "15 JUL",
    day: "15",
    month: "JUL",
    location: "Hartsfield, Bulawayo",
    category: "SABLES",
    image: "/images/events/derby.jpg",
  },
];

export default function EventsCalendar() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "SABLES":
        return "bg-sables-green text-white";
      case "SCHOOLS RUGBY":
        return "bg-zru-gold text-rich-black";
      case "RUGBY AFRICA CUP":
        return "bg-zru-orange text-white";
      default:
        return "bg-gray-700 text-white";
    }
  };

  return (
    <section className="py-20 bg-rich-black relative border-t border-white/10" id="events-calendar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-zru-orange font-heading text-xl tracking-widest mb-2">
              UPCOMING EVENTS
            </h2>
            <h3 className="text-4xl md:text-5xl font-heading text-white">
              WHAT&apos;S HAPPENING
            </h3>
          </div>
          <div className="flex gap-4">
            <button className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {events.map((event) => (
            <motion.div
              key={event.id}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -5 }}
              className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden group shadow-lg hover:shadow-[0_0_20px_rgba(255,140,0,0.15)] transition-all duration-300"
            >
              <div className="h-48 bg-gray-800 relative overflow-hidden">
                {/* Image Placeholder */}
                <motion.div 
                    className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" 
                    whileHover={{ scale: 1.1 }}
                >
                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${getCategoryColor(event.category)}`}>
                            {event.category}
                        </span>
                    </div>
                </motion.div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="text-3xl font-heading text-white mb-1">{event.day}</span>
                    <span className="text-gray-400 text-xs font-bold uppercase">{event.month}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-heading text-xl text-white mb-2 line-clamp-2 group-hover:text-zru-orange transition-colors">
                  {event.title}
                </h4>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                  <MapPin className="w-4 h-4 text-zru-orange" />
                  <span>{event.location}</span>
                </div>
                
                <Button variant="outline" className="w-full text-sm h-10 group-hover:bg-white group-hover:text-rich-black transition-colors">
                  EVENT DETAILS
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center">
           <Button variant="ghost" rightIcon={<ArrowRight className="w-5 h-5" />}>
               VIEW FULL CALENDAR
           </Button>
        </div>
      </div>
    </section>
  );
}
