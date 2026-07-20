"use client";

import { motion } from "framer-motion";
import type { LeagueTableRow } from "@/types";

interface LeagueTableProps {
  data: LeagueTableRow[];
}

export default function LeagueTable({ data }: LeagueTableProps) {
  if (!data.length) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-white/60 text-xs font-bold uppercase tracking-widest border-b border-white/10">
            <th className="p-4 w-12 text-center">Pos</th>
            <th className="p-4">Team</th>
            <th className="p-4 w-12 text-center">P</th>
            <th className="p-4 w-12 text-center">W</th>
            <th className="p-4 w-12 text-center">D</th>
            <th className="p-4 w-12 text-center">L</th>
            <th className="p-4 w-12 text-center text-white">PTS</th>
            <th className="p-4 hidden md:table-cell text-center">Form</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <motion.tr 
                key={row.team}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
            >
              <td className="p-4 text-center font-heading text-xl text-white/60 group-hover:text-zru-green">{row.position}</td>
              <td className="p-4 font-heading text-xl text-white group-hover:text-zru-green transition-colors">{row.team}</td>
              <td className="p-4 text-center text-white/80">{row.played}</td>
              <td className="p-4 text-center text-white/80">{row.won}</td>
              <td className="p-4 text-center text-white/80">{row.drawn}</td>
              <td className="p-4 text-center text-white/80">{row.lost}</td>
              <td className="p-4 text-center font-bold text-zru-green text-lg">{row.points}</td>
              <td className="p-4 hidden md:flex items-center justify-center gap-1">
                {row.form.map((result, i) => (
                    <span 
                        key={i} 
                        className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                            result === "W" ? "bg-green-500/20 text-green-500" : 
                            result === "L" ? "bg-red-500/20 text-red-500" : 
                            "bg-gray-500/20 text-gray-400"
                        }`}
                    >
                        {result}
                    </span>
                ))}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
