"use client";

import { motion } from "framer-motion";

interface TableRow {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  form: string[]; // e.g. ["W", "L", "W", "D", "W"]
}

const mockTableData: TableRow[] = [
  { position: 1, team: "Old Georgians", played: 14, won: 12, drawn: 1, lost: 1, points: 58, form: ["W", "W", "W", "W", "W"] },
  { position: 2, team: "Harare Sports Club", played: 14, won: 10, drawn: 0, lost: 4, points: 48, form: ["W", "L", "W", "L", "W"] },
  { position: 3, team: "Old Hararians", played: 14, won: 9, drawn: 2, lost: 3, points: 45, form: ["L", "W", "W", "D", "W"] },
  { position: 4, team: "Pitbulls", played: 14, won: 7, drawn: 1, lost: 6, points: 35, form: ["W", "L", "L", "W", "L"] },
  { position: 5, team: "Mutare Sports Club", played: 14, won: 5, drawn: 0, lost: 9, points: 25, form: ["L", "L", "W", "L", "L"] },
];

export default function LeagueTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-white/40 text-xs font-bold uppercase tracking-widest border-b border-white/10">
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
          {mockTableData.map((row, index) => (
            <motion.tr 
                key={row.team}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
            >
              <td className="p-4 text-center font-heading text-xl text-white/60 group-hover:text-zru-gold">{row.position}</td>
              <td className="p-4 font-heading text-xl text-white group-hover:text-zru-gold transition-colors">{row.team}</td>
              <td className="p-4 text-center text-white/80">{row.played}</td>
              <td className="p-4 text-center text-white/80">{row.won}</td>
              <td className="p-4 text-center text-white/80">{row.drawn}</td>
              <td className="p-4 text-center text-white/80">{row.lost}</td>
              <td className="p-4 text-center font-bold text-zru-gold text-lg">{row.points}</td>
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
