"use client";

import React from "react";
import { Search, SlidersHorizontal, ArrowUpDown, Layers, Grid, List } from "lucide-react";

export interface SortOption<T = string> {
  label: string;
  value: T;
}

export interface GroupOption<T = string> {
  label: string;
  value: T;
}

interface ListControlToolbarProps<S extends string, G extends string> {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  sortBy: S;
  onSortChange: (sort: S) => void;
  sortOptions: SortOption<S>[];
  groupBy: G;
  onGroupChange: (group: G) => void;
  groupOptions: GroupOption<G>[];
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  totalCount: number;
  filteredCount: number;
  className?: string;
}

export default function ListControlToolbar<S extends string, G extends string>({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  sortBy,
  onSortChange,
  sortOptions,
  groupBy,
  onGroupChange,
  groupOptions,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
  className = "",
}: ListControlToolbarProps<S, G>) {
  return (
    <div className={`bg-white rounded-2xl border border-black/5 p-4 sm:p-5 shadow-sm space-y-4 ${className}`}>
      {/* Top row: Search input + View toggles + Counts */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-gray/50 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-milk-white/70 hover:bg-milk-white focus:bg-white border border-black/10 focus:border-zru-green focus:ring-1 focus:ring-zru-green rounded-xl text-sm font-medium text-rich-black transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-gray/60 hover:text-rich-black px-1.5 py-0.5 rounded bg-black/5"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-gray/80">
            {filteredCount === totalCount ? (
              <span><strong className="text-rich-black">{totalCount}</strong> Total</span>
            ) : (
              <span><strong className="text-zru-green">{filteredCount}</strong> of {totalCount}</span>
            )}
          </span>

          {viewMode && onViewModeChange && (
            <div className="flex items-center bg-milk-white/80 p-1 rounded-xl border border-black/5">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-zru-green shadow-xs font-bold"
                    : "text-charcoal-gray/60 hover:text-rich-black"
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-zru-green shadow-xs font-bold"
                    : "text-charcoal-gray/60 hover:text-rich-black"
                }`}
                title="List view"
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Group By & Sort By pill selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/5 text-xs">
        {/* Grouping Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-black uppercase tracking-wider text-charcoal-gray/60 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-zru-green" />
            Group:
          </span>
          {groupOptions.map((opt) => {
            const isActive = groupBy === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onGroupChange(opt.value)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  isActive
                    ? "bg-zru-green text-white shadow-xs"
                    : "bg-milk-white text-charcoal-gray hover:text-rich-black hover:bg-black/5"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown / Pills */}
        <div className="flex items-center gap-2">
          <span className="font-black uppercase tracking-wider text-charcoal-gray/60 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-zru-green" />
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as S)}
            className="bg-milk-white hover:bg-black/5 border border-black/10 focus:border-zru-green rounded-lg px-2.5 py-1.5 font-bold text-rich-black outline-none cursor-pointer text-xs"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
