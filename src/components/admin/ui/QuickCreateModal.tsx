"use client";

import React from "react";
import { BookOpen, Radio, CalendarDays, Layers, X, PlusCircle, Sparkles } from "lucide-react";
import { setAdminTab } from "@/lib/admin/tab-events";

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickCreateModal({ isOpen, onClose }: QuickCreateModalProps) {
  if (!isOpen) return null;

  const actions = [
    {
      id: "media",
      title: "New News Article",
      desc: "Draft a match report, breaking update, or feature article",
      icon: BookOpen,
      badge: "Editorial",
    },
    {
      id: "fixtures",
      title: "New Fixture / Match",
      desc: "Schedule an upcoming match, tournament game, or score",
      icon: Radio,
      badge: "Match Ops",
    },
    {
      id: "events",
      title: "New Event / Festival",
      desc: "Publish an upcoming grassroots or community event",
      icon: CalendarDays,
      badge: "Audience",
    },
    {
      id: "hero_layout",
      title: "New Hero Slide",
      desc: "Add a high-impact visual banner to the site homepage",
      icon: Layers,
      badge: "Site Layout",
    },
    {
      id: "directus_ai",
      title: "Draft with AI Assistant",
      desc: "Generate structured articles and press releases in seconds",
      icon: Sparkles,
      badge: "AI Copilot",
    },
  ];

  const handleSelect = (tabId: string) => {
    setAdminTab(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#0d131a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006B3F] flex items-center justify-center text-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Quick Create</h3>
              <p className="text-xs text-white/50">Select a content type to start drafting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleSelect(action.id)}
                className="w-full text-left p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-[#006B3F]/50 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-[#006B3F] flex items-center justify-center text-white/70 group-hover:text-white transition-colors shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-[#006B3F] transition-colors">
                        {action.title}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/5">
                        {action.badge}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 line-clamp-1">{action.desc}</p>
                  </div>
                </div>
                <span className="text-white/20 group-hover:text-[#006B3F] font-bold text-sm transform group-hover:translate-x-0.5 transition-all">
                  &rarr;
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-mono">
          <span>Tip: Press Ctrl+K anytime for fast commands</span>
          <button
            onClick={onClose}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
