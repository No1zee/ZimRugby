"use client";

import { Shield, Trophy, Users, Activity, Layers, Award, FileText, Megaphone, Landmark, Sparkles, Filter } from "lucide-react";

export interface CategoryFilterItem {
  id: string;
  name: string;
  code: string;
  icon: any;
}

export const font_levels = [
  { id: "National", name: "National Teams", code: "NAT", icon: Shield },
  { id: "Clubs", name: "Club Rugby", code: "CLB", icon: Trophy },
  { id: "Schools", name: "Schools Rugby", code: "SCH", icon: Users },
  { id: "Squad", name: "Squad Drops", code: "SQD", icon: FileText },
  { id: "Campaign", name: "Campaigns", code: "CMPG", icon: Megaphone },
  { id: "Clinic", name: "Clinics & Refs", code: "CLN", icon: Award },
  { id: "Governance", name: "Governance", code: "GOV", icon: Landmark },
  { id: "Youth", name: "Camps & Youth", code: "CMP", icon: Layers },
  { id: "Sponsor", name: "Sponsor Events", code: "SPN", icon: Sparkles }
];

interface CalendarFiltersProps {
  selectedCategories: string[];
  onToggleCategory: (catId: string) => void;
  onClearCategories: () => void;
}

export default function CalendarFilters({
  selectedCategories,
  onToggleCategory,
  onClearCategories,
}: CalendarFiltersProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zru-green" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/50 font-subheading">
            Faceted Multi-Select Filters
          </span>
          {selectedCategories.length > 0 && (
            <span className="text-[10px] font-black font-mono bg-zru-green text-white px-2 py-0.5 rounded-full">
              {selectedCategories.length} Active
            </span>
          )}
        </div>

        {selectedCategories.length > 0 && (
          <button
            onClick={onClearCategories}
            className="text-[10px] font-black uppercase tracking-wider text-zru-green hover:underline"
          >
            Clear Selected ({selectedCategories.length})
          </button>
        )}
      </div>

      {/* Horizontally scrollable multi-select chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {font_levels.map((level) => {
          const Icon = level.icon;
          const isSelected = selectedCategories.includes(level.id);
          return (
            <button
              key={level.id}
              onClick={() => onToggleCategory(level.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 border shrink-0 ${
                isSelected
                  ? "bg-zru-green text-white border-zru-green shadow-md"
                  : "bg-white border-black/10 text-black/70 hover:border-black/30 hover:text-black shadow-2xs"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-zru-green"}`} />
              <span>{level.name}</span>
              <span
                className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded ${
                  isSelected ? "bg-white/20 text-white" : "bg-black/5 text-black/40"
                }`}
              >
                {level.code}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
