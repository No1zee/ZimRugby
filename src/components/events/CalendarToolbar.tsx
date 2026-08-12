"use client";

import { Search, CalendarDays, List, RefreshCw, X } from "lucide-react";

interface CalendarToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: "calendar" | "agenda";
  onViewModeChange: (mode: "calendar" | "agenda") => void;
  activeShortcut: string | null;
  onShortcutClick: (shortcut: string | null) => void;
  onResetAll: () => void;
  hasActiveFilters: boolean;
}

const SHORTCUTS = [
  { id: "today", label: "Today" },
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "This Month" },
  { id: "sables-window", label: "Sables Window" },
  { id: "schools-season", label: "Schools Season" },
];

export default function CalendarToolbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  activeShortcut,
  onShortcutClick,
  onResetAll,
  hasActiveFilters,
}: CalendarToolbarProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-black/10 shadow-sm space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search team, venue, competition..."
            className="w-full pl-10 pr-9 py-2.5 bg-milk-white border border-black/10 rounded-xl text-sm font-bold text-rich-black placeholder:text-black/40 focus:outline-none focus:border-zru-green focus:ring-1 focus:ring-zru-green"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Switcher: Calendar Grid vs Agenda List */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex p-1 bg-black/5 rounded-xl border border-black/10">
            <button
              onClick={() => onViewModeChange("calendar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                viewMode === "calendar" ? "bg-zru-green text-white shadow font-black" : "text-black/60 hover:text-black"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Month Grid</span>
              <span className="sm:hidden">Grid</span>
            </button>
            <button
              onClick={() => onViewModeChange("agenda")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                viewMode === "agenda" ? "bg-zru-green text-white shadow font-black" : "text-black/60 hover:text-black"
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Agenda List</span>
              <span className="sm:hidden">Agenda</span>
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetAll}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Date Shortcuts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-black/5 no-scrollbar">
        <span className="text-[9px] font-black uppercase tracking-widest text-black/40 shrink-0 font-subheading">
          Quick Range:
        </span>
        {SHORTCUTS.map((s) => {
          const isActive = activeShortcut === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onShortcutClick(isActive ? null : s.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all ${
                isActive
                  ? "bg-rich-black text-white shadow-sm"
                  : "bg-black/5 text-black/60 hover:bg-black/10 hover:text-black"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
