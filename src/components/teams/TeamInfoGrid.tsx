"use client";

import { motion } from "framer-motion";
import {
  Layers,
  LayoutGrid,
  Globe2,
  Users,
  History,
  TrendingUp,
  Star,
} from "lucide-react";
import type { Team } from "@/types/team";
import { formatRanking } from "@/lib/team-formatters";
import InfoCell from "@/components/ui/InfoCell";
import RecordDots from "@/components/ui/RecordDots";

export default function TeamInfoGrid({
  team,
  reduceMotion,
}: {
  team: Team;
  reduceMotion: boolean;
}) {
  const variants = reduceMotion
    ? { initial: {}, animate: {} }
    : { initial: { opacity: 0 }, animate: { opacity: 1 } };

  return (
    <motion.section
      {...variants}
      transition={{ duration: 0.4 }}
      className="bg-milk-white py-10 md:py-12 px-4 sm:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading not-italic text-3xl sm:text-4xl font-black mb-8">
          <span className="text-rich-black">
            {team.shortName.split(" ").slice(0, -1).join(" ")}{" "}
          </span>
          <span className="text-accent-teal">
            {team.shortName.split(" ").slice(-1)}
          </span>
        </h2>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <InfoCell icon={Layers} label="Format" value={team.formatLabel} />
          <InfoCell
            icon={LayoutGrid}
            label="Category"
            value={team.worldRankingTier}
          />
          <InfoCell
            icon={Globe2}
            label="World Ranking"
            value={team.rankingValue}
            highlighted
          />
          <InfoCell
            icon={Users}
            label="Squad Size"
            value={`${team.squadSize} Players`}
          />
          <InfoCell
            icon={History}
            label="Recent Record"
            value={<RecordDots record={team.recentRecord} />}
          />
          <InfoCell
            icon={TrendingUp}
            label="Pathway"
            value={team.pathway}
          />
        </div>

        {/* Last major honour banner */}
        <div className="rounded-2xl bg-rich-black px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="w-11 h-11 rounded-full bg-green-primary/20 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-accent-teal" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">
                Last Major Honour
              </p>
              <p className="font-heading not-italic text-xl font-black text-white">
                {team.keyHonour}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
