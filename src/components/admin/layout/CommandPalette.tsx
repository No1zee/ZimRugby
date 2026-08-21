"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  Command,
  FileText,
  Calendar,
  Users,
  Film,
  Layers,
  History,
  HardDrive,
  Trash2,
  ExternalLink,
  Shield,
  RotateCw,
} from "lucide-react";

export interface SearchableItem {
  id: string;
  title: string;
  category: "news" | "matches" | "events" | "teams" | "players" | "partners" | "action";
  subtitle?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  onQuickCreate?: (collection: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectTab,
  onQuickCreate,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global Cmd+K trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          setQuery("");
          setSelectedIndex(0);
        }
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const defaultActions: SearchableItem[] = [
    // Navigation actions
    { id: "nav-overview", title: "Go to Dashboard Overview", category: "action", subtitle: "Navigation", action: () => { onSelectTab("overview"); onClose(); } },
    { id: "nav-media", title: "Go to News & Media Hub", category: "action", subtitle: "Navigation", action: () => { onSelectTab("media"); onClose(); } },
    { id: "nav-fixtures", title: "Go to Match Centre & Fixtures", category: "action", subtitle: "Navigation", action: () => { onSelectTab("fixtures"); onClose(); } },
    { id: "nav-teams", title: "Go to Teams & Squads Manager", category: "action", subtitle: "Navigation", action: () => { onSelectTab("teams"); onClose(); } },
    { id: "nav-events", title: "Go to Events Calendar", category: "action", subtitle: "Navigation", action: () => { onSelectTab("events"); onClose(); } },
    { id: "nav-hero", title: "Go to Hero & Announcements", category: "action", subtitle: "Navigation", action: () => { onSelectTab("hero"); onClose(); } },
    { id: "nav-sponsors", title: "Go to Commercial & Partners", category: "action", subtitle: "Navigation", action: () => { onSelectTab("sponsors"); onClose(); } },
    { id: "nav-signups", title: "Go to Signups & Submissions", category: "action", subtitle: "Navigation", action: () => { onSelectTab("signups"); onClose(); } },
    { id: "nav-logs", title: "Go to Audit Logs", category: "action", subtitle: "Navigation", action: () => { onSelectTab("logs"); onClose(); } },
    { id: "nav-backups", title: "Go to System & Backups", category: "action", subtitle: "Navigation", action: () => { onSelectTab("backups"); onClose(); } },
    { id: "nav-trash", title: "Go to Trash & Recycle Bin", category: "action", subtitle: "Navigation", action: () => { onSelectTab("trash"); onClose(); } },

    // Quick create shortcuts
    { id: "create-news", title: "Create New Article", category: "action", subtitle: "Quick Create", action: () => { onSelectTab("media"); onQuickCreate?.("news"); onClose(); } },
    { id: "create-fixture", title: "Schedule New Fixture / Match", category: "action", subtitle: "Quick Create", action: () => { onSelectTab("fixtures"); onQuickCreate?.("matches"); onClose(); } },
    { id: "create-event", title: "Add New Event", category: "action", subtitle: "Quick Create", action: () => { onSelectTab("events"); onQuickCreate?.("events"); onClose(); } },
  ];

  const filteredItems = query.trim() === ""
    ? defaultActions
    : defaultActions.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase())
      );

  // Keyboard navigation up/down/enter
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-zinc-950 border border-white/15 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Header */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-zru-green shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="Type a command, page name, or search..."
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 max-h-96">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">
              No matching actions or navigation targets found.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors text-xs
                    ${
                      isSelected
                        ? "bg-zru-green text-white font-medium shadow-md shadow-zru-green/20"
                        : "text-zinc-300 hover:bg-white/5"
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-zinc-500"}`} />
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.subtitle && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                        isSelected ? "bg-black/30 text-white" : "bg-white/5 text-zinc-400"
                      }`}
                    >
                      {item.subtitle}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[10px] text-zinc-600 font-mono">ZRU Admin Command</span>
        </div>
      </div>
    </div>
  );
}
