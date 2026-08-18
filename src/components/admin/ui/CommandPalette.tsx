"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Trophy, Radio, BookOpen, Layers, Handshake, Users, ShieldAlert, Sparkles, FolderOpen, CalendarDays, Sprout, ArrowRight, Plus, Database } from "lucide-react";
import { setAdminTab } from "@/lib/admin/tab-events";

interface CommandItem {
  id: string;
  title: string;
  category: "Squads & Teams" | "Match Centre" | "Content & Media" | "Navigation" | "Quick Actions";
  icon: React.ElementType;
  tabTarget?: string;
  action?: () => void;
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command Palette Index
  const commands: CommandItem[] = useMemo(() => [
    // Squads & Teams
    {
      id: "squad-sables",
      title: "Senior Men's Sables (15s Roster)",
      category: "Squads & Teams",
      icon: Trophy,
      tabTarget: "teams",
      keywords: ["sables", "senior", "men", "15s", "roster", "squad", "rugby africa cup", "players"],
    },
    {
      id: "squad-lady-sables",
      title: "Women's Lady Sables (15s Roster)",
      category: "Squads & Teams",
      icon: Trophy,
      tabTarget: "teams",
      keywords: ["lady sables", "women", "15s", "roster", "squad", "female"],
    },
    {
      id: "squad-cheetahs",
      title: "Zimbabwe Cheetahs (Men's 7s)",
      category: "Squads & Teams",
      icon: Trophy,
      tabTarget: "teams",
      keywords: ["cheetahs", "sevens", "7s", "challenger series", "dubai", "montevideo"],
    },
    {
      id: "squad-lady-cheetahs",
      title: "Lady Cheetahs (Women's 7s)",
      category: "Squads & Teams",
      icon: Trophy,
      tabTarget: "teams",
      keywords: ["lady cheetahs", "women sevens", "7s", "olympic qualifiers"],
    },
    {
      id: "squad-junior-sables",
      title: "Junior Sables (U20 Men's Roster)",
      category: "Squads & Teams",
      icon: Trophy,
      tabTarget: "teams",
      keywords: ["junior sables", "u20", "barthes trophy", "under 20", "academy", "youth"],
    },

    // Navigation Items
    {
      id: "nav-today",
      title: "Today Overview & Mission Control",
      category: "Navigation",
      icon: Sparkles,
      tabTarget: "overview",
      keywords: ["today", "home", "dashboard", "kpi", "overview", "analytics"],
    },
    {
      id: "nav-hero",
      title: "Hero Banner, Layout & Breaking Ticker",
      category: "Navigation",
      icon: Layers,
      tabTarget: "hero_layout",
      keywords: ["hero", "banner", "carousel", "homepage", "marquee", "ticker", "slides"],
    },
    {
      id: "nav-match-centre",
      title: "Match Centre: Fixtures, Scores & Standings",
      category: "Navigation",
      icon: Radio,
      tabTarget: "fixtures",
      keywords: ["fixtures", "matches", "scores", "standings", "results", "live", "referee"],
    },
    {
      id: "nav-news",
      title: "News, Press Releases & Match Reports",
      category: "Navigation",
      icon: BookOpen,
      tabTarget: "media",
      keywords: ["news", "articles", "press release", "media", "editor", "blog"],
    },
    {
      id: "nav-events",
      title: "Events, Festivals & Competitions",
      category: "Navigation",
      icon: CalendarDays,
      tabTarget: "events",
      keywords: ["events", "calendar", "dairibord", "cottco", "festivals", "competitions"],
    },
    {
      id: "nav-sponsors",
      title: "Sponsors & Commercial Partners (Nedbank, Macron)",
      category: "Navigation",
      icon: Handshake,
      tabTarget: "sponsors",
      keywords: ["sponsors", "partners", "nedbank", "macron", "delta", "commercial", "logos"],
    },
    {
      id: "nav-resources",
      title: "Resources: Laws, Handbooks & Circulars",
      category: "Navigation",
      icon: FolderOpen,
      tabTarget: "resources",
      keywords: ["resources", "vault", "laws", "constitution", "handbook", "pdf", "documents"],
    },
    {
      id: "nav-grassroots",
      title: "Clubs & Development (Schools, Grassroots, Programmes)",
      category: "Navigation",
      icon: Sprout,
      tabTarget: "grassroots",
      keywords: ["grassroots", "schools", "development", "pathways", "community"],
    },
    {
      id: "nav-backups",
      title: "Backups & Restore",
      category: "Navigation",
      icon: Database,
      tabTarget: "backups",
      keywords: ["backup", "snapshot", "restore", "disaster", "export", "json", "recovery"],
    },
    {
      id: "nav-announcements",
      title: "Emergency Matchday Banner & Alerts",
      category: "Navigation",
      icon: ShieldAlert,
      tabTarget: "hero_layout",
      keywords: ["alert", "emergency", "banner", "warning", "announcements", "weather", "notice"],
    },

    // Quick Action Shortcuts
    {
      id: "action-new-article",
      title: "Compose New Article or Press Release",
      category: "Quick Actions",
      icon: Plus,
      tabTarget: "media",
      keywords: ["new", "create", "article", "press", "write", "publish"],
    },
    {
      id: "action-schedule-match",
      title: "Schedule Sables / League Fixture",
      category: "Quick Actions",
      icon: Plus,
      tabTarget: "fixtures",
      keywords: ["schedule", "fixture", "new match", "game", "versus"],
    },
    {
      id: "action-add-partner",
      title: "Add Commercial Partner or Sponsor Logo",
      category: "Quick Actions",
      icon: Plus,
      tabTarget: "sponsors",
      keywords: ["add sponsor", "partner", "logo", "tier", "commercial"],
    }
  ], []);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase().trim();
    return commands.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.category.toLowerCase().includes(q) ||
      c.keywords.some(k => k.toLowerCase().includes(q))
    );
  }, [query, commands]);

  // Keyboard navigation inside palette
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const executeCommand = (cmd: CommandItem) => {
    if (cmd.action) {
      cmd.action();
    } else if (cmd.tabTarget) {
      setAdminTab(cmd.tabTarget);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#090d16] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/[0.02]">
          <Search className="w-5 h-5 text-[#006B3F] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Sables squads, fixtures, articles, sponsors, or quick actions..."
            className="w-full bg-transparent text-white text-base outline-none placeholder:text-white/40 font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono bg-white/10 text-white/60 rounded border border-white/10">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-white/5">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-white/40 text-sm">
              No matching ZRU records found for "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => executeCommand(cmd)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-[#006B3F]/20 text-white border border-[#006B3F]/40 shadow-sm" 
                      : "text-white/80 hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-[#006B3F] text-white" : "bg-white/5 text-white/60"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white flex items-center gap-2">
                        {cmd.title}
                      </div>
                      <div className="text-[11px] text-white/40 font-medium">
                        {cmd.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <span className="text-[11px] font-medium text-[#006B3F] bg-[#006B3F]/10 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                        Jump <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div className="px-5 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] text-white/40">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-white/60">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-white/60">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-white/60">ENTER</kbd> to select</span>
          </div>
          <span className="font-mono text-[#006B3F]">THE TOUCHLINE · ZRU Digital</span>
        </div>
      </div>
    </div>
  );
}
