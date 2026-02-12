"use client";

import MatchCard from "./MatchCard";
import { motion } from "framer-motion";

interface Match {
  id: string | number;
  competition: string;
  round: string;
  date: string;
  time: string;
  venue: string;
  homeTeam: {
    name: string;
    score?: number;
    logo?: string;
  };
  awayTeam: {
    name: string;
    score?: number;
    logo?: string;
  };
  status?: "upcoming" | "live" | "completed";
}

interface MatchListProps {
  matches: Match[];
}

export default function MatchList({ matches }: MatchListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match, index) => (
        <motion.div
           key={match.id}
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: index * 0.1 }}
        >
            <MatchCard {...match} />
        </motion.div>
      ))}
    </div>
  );
}
