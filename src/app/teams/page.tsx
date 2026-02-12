"use client";

import { motion } from "framer-motion";
import TeamCard from "../../components/teams/TeamCard";

const teams = [
  {
    id: "sables",
    name: "Sables",
    description: "The pride of the nation. Zimbabwe&apos;s senior men&apos;s XV team, reigning Africa Cup champions.",
    image: "/images/teams/sables.jpg", // Replace with real image
    color: "bg-zru-green",
    href: "/teams/sables",
  },
  {
    id: "lady-sables",
    name: "Lady Sables",
    description: "Breaking barriers and making history. Our senior women&apos;s XV team competing on the continental stage.",
    image: "/images/teams/lady-sables.jpg",
    color: "bg-zru-orange",
    href: "/teams/lady-sables",
  },
  {
    id: "cheetahs",
    name: "Cheetahs",
    description: "Fast, furious, and fearless. The national men&apos;s sevens team competing on the World Series circuit.",
    image: "/images/teams/cheetahs.jpg",
    color: "bg-zru-gold",
    href: "/teams/cheetahs",
  },
  {
    id: "lady-cheetahs",
    name: "Lady Cheetahs",
    description: "Speed and skill combined. The national women&apos;s sevens team inspiring the next generation.",
    image: "/images/teams/lady-cheetahs.jpg",
    color: "bg-purple-700",
    href: "/teams/lady-cheetahs",
  },
  {
    id: "junior-sables",
    name: "Junior Sables (U20)",
    description: "The future is bright. Our U20 team, consistently one of the top performing sides in Africa.",
    image: "/images/teams/junior-sables.jpg",
    color: "bg-blue-700",
    href: "/teams/junior-sables",
  },
];

export default function TeamsPage() {
  return (
    <main className="bg-rich-black min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-16"
        >
           <h1 className="text-5xl md:text-7xl font-heading text-white mb-6">OUR TEAMS</h1>
           <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From the flagship Sables to the rising stars of the Junior Sables, discover the teams that carry our nation&apos;s hopes and dreams.
           </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {teams.map((team, index) => (
              <motion.div
                 key={team.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
              >
                 <TeamCard {...team} />
              </motion.div>
           ))}
        </div>

      </div>
    </main>
  );
}
