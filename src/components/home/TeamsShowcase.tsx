"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Button from "../common/Button";

// Mock Data
const players = [
  {
    id: 1,
    name: "SHUMBA MASSON",
    position: "Flanker",
    role: "Captain",
    caps: 45,
    tries: 12,
    image: "/images/players/shumba.jpg",
  },
  {
    id: 2,
    name: "TAKUDZWA MUSINGWINI",
    position: "Fullback",
    role: "Vice Captain",
    caps: 32,
    tries: 18,
    image: "/images/players/takudzwa.jpg",
  },
  {
    id: 3,
    name: "GODFREY MUZANARGWO",
    position: "Lock",
    role: "Senior Player",
    caps: 28,
    tries: 5,
    image: "/images/players/godfrey.jpg",
  },
];

export default function TeamsShowcase() {
  return (
    <section className="py-20 bg-rich-black relative border-t border-white/10 overflow-hidden" id="teams">
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
            <h2 className="text-zru-orange font-heading text-xl tracking-widest mb-2">
              MEET THE SQUAD
            </h2>
            <h3 className="text-4xl md:text-5xl font-heading text-white">
              THE SABLES
            </h3>
          </div>
          <Button variant="ghost" rightIcon={<ArrowRight className="w-5 h-5" />} className="hidden md:flex">
            VIEW FULL SQUAD
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Background Image Placeholder */}
              <div className="absolute inset-0 bg-gray-800 transition-transform duration-700 group-hover:scale-105">
                 <div className="w-full h-full bg-linear-to-t from-black via-gray-900/50 to-gray-800" />
                 {/* <img src={player.image} alt={player.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" /> */}
              </div>
              
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90" />

              <div className="absolute top-6 right-6">
                 <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-md group-hover:border-zru-orange transition-colors">
                    <span className="font-heading text-2xl text-white">15</span>
                 </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8">
                 {player.role && (
                    <span className="bg-zru-gold text-rich-black text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-3 inline-block">
                        {player.role}
                    </span>
                 )}
                 <h4 className="text-3xl md:text-4xl font-heading text-white mb-1 leading-none">
                    {player.name.split(" ")[0]}
                 </h4>
                 <h4 className="text-3xl md:text-4xl font-heading text-zru-orange mb-4 leading-none">
                    {player.name.split(" ").slice(1).join(" ")}
                 </h4>
                 <p className="text-gray-300 font-bold uppercase tracking-widest mb-6 border-l-2 border-zru-orange pl-3">
                    {player.position}
                 </p>

                 {/* Stats Reveal on Hover */}
                 <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 translate-y-4 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div>
                        <span className="block text-2xl font-heading text-white">{player.caps}</span>
                        <span className="text-xs text-gray-500 uppercase font-bold">Caps</span>
                    </div>
                    <div>
                        <span className="block text-2xl font-heading text-white">{player.tries}</span>
                        <span className="text-xs text-gray-500 uppercase font-bold">Tries</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 md:hidden flex justify-center">
            <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
                VIEW FULL SQUAD
            </Button>
        </div>
      </div>
    </section>
  );
}
