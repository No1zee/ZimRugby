"use client";

import { Trophy, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const milestones = [
    { 
      year: "1895", 
      title: "Union Founded", 
      desc: "The first rugby union matches are played in Bulawayo and Salisbury (Harare), and the Rhodesia Rugby Football Union (now ZRU) is officially formed." 
    },
    { 
      year: "1987", 
      title: "Inaugural World Cup Participation", 
      desc: "Zimbabwe is invited to participate in the first-ever Rugby World Cup held in New Zealand and Australia, representing African rugby." 
    },
    { 
      year: "1991", 
      title: "Second World Cup Campaign", 
      desc: "Clad in the iconic green and white hoops, the Sables qualify and compete in the 1991 Rugby World Cup in Europe, battling Scotland, Ireland, and Japan." 
    },
    { 
      year: "2024", 
      title: "Africa Cup Champions", 
      desc: "The Sables reclaim continental supremacy, defeating Algeria 29-3 in the final to lift the Rugby Africa Cup and launch a new era of competitiveness." 
    }
  ];

  return (
    <div className="space-y-12">
      
      {/* Overview header */}
      <div className="border-l-4 border-zru-green pl-4">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">HISTORY & HERITAGE</h2>
        <p className="text-sm text-white/50 mt-1">Revisiting 130 years of rugby tradition and Sables milestones.</p>
      </div>

      {/* Narrative */}
      <p className="text-white/80 leading-relaxed text-sm font-medium">
        Rugby has been played in Zimbabwe since the late 19th century. From the historic tours of the early 1900s to competing in the first two Rugby World Cups in 1987 and 1991, the Sables have consistently represented the highest standards of athleticism and passion. We celebrate our rugby heritage, honoring the veterans who paved the way and the rising talent writing the next chapters of our story.
      </p>

      {/* Timeline list */}
      <div className="pt-6 border-t border-white/5 space-y-8">
        <h3 className="text-lg font-black uppercase tracking-wide text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-zru-green" />
          <span>HISTORICAL MILESTONES</span>
        </h3>

        <div className="relative border-l-2 border-zru-green/20 pl-6 ml-4 space-y-10 py-2">
          {/* Animated Green Line Overlay */}
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-[-2px] top-0 w-[2px] bg-zru-green origin-top"
          />

          {milestones.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              whileHover={{ x: 4 }}
              className="relative group cursor-pointer"
            >
              {/* Dot */}
              <motion.div 
                whileHover={{ scale: 1.3 }}
                className="absolute -left-[32px] top-1 w-4 h-4 rounded-full bg-zru-green border-4 border-rich-black transition-colors duration-300 group-hover:bg-emerald-400 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.8)] z-10" 
              />
              
              <div className="card-green border p-5 rounded-xl space-y-2 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-zru-green/5">
                <div className="flex items-center gap-3">
                  <span className="text-zru-green text-xl font-black italic tracking-tighter block">{item.year}</span>
                  <Award className="w-4 h-4 text-zru-green/40 group-hover:text-zru-green transition-colors duration-300" />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-zru-green transition-colors duration-300">{item.title}</h4>
                <p className="text-white/60 text-xs leading-relaxed font-medium max-w-2xl">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
