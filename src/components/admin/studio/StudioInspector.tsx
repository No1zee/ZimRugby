"use client";

import React, { useState } from "react";
import { 
  Sliders, X, Sparkles, Send, Megaphone, Trophy, Newspaper, Award, 
  CheckCircle2, Plus, Minus, Hash, Image as ImageIcon, ExternalLink, Flame
} from "lucide-react";
import { useStudioLive } from "@/lib/admin/studio-context";
import { useToast } from "../ui/ToastProvider";

export default function StudioInspector() {
  const { 
    selectedSection, setSelectedSection,
    isInspectorOpen, setIsInspectorOpen,
    heroSlides, updateHeroSlide,
    announcements, updateAnnouncement,
    matches, updateMatch,
    news, updateNewsItem,
    sponsors, updateSponsor
  } = useStudioLive();

  const { toast } = useToast();

  if (!isInspectorOpen || !selectedSection) return null;

  const currentHero = heroSlides[0];
  const currentAnnouncement = announcements[0];
  const currentMatch = matches[0];
  const currentNews = news[0];

  return (
    <aside className="w-full lg:w-96 bg-[#0D1117] border-l border-[#C5A059]/30 text-white shadow-2xl flex flex-col h-[calc(100vh-60px)] shrink-0 overflow-hidden">
      {/* Inspector Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#161B22]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#C5A059]" />
          <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white">
            Live Property Inspector
          </h3>
        </div>
        <button
          onClick={() => setIsInspectorOpen(false)}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Block Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 bg-[#090D12] border-b border-white/10 overflow-x-auto text-[11px] font-mono">
        <button
          onClick={() => setSelectedSection("hero")}
          className={`px-3 py-1 rounded-lg uppercase font-bold shrink-0 transition-colors ${
            selectedSection === "hero" ? "bg-[#C5A059] text-black" : "text-white/60 hover:text-white"
          }`}
        >
          01 Hero
        </button>
        <button
          onClick={() => setSelectedSection("ticker")}
          className={`px-3 py-1 rounded-lg uppercase font-bold shrink-0 transition-colors ${
            selectedSection === "ticker" ? "bg-[#C5A059] text-black" : "text-white/60 hover:text-white"
          }`}
        >
          02 Ticker
        </button>
        <button
          onClick={() => setSelectedSection("fixtures")}
          className={`px-3 py-1 rounded-lg uppercase font-bold shrink-0 transition-colors ${
            selectedSection === "fixtures" ? "bg-[#C5A059] text-black" : "text-white/60 hover:text-white"
          }`}
        >
          03 Match
        </button>
        <button
          onClick={() => setSelectedSection("news")}
          className={`px-3 py-1 rounded-lg uppercase font-bold shrink-0 transition-colors ${
            selectedSection === "news" ? "bg-[#C5A059] text-black" : "text-white/60 hover:text-white"
          }`}
        >
          04 News
        </button>
        <button
          onClick={() => setSelectedSection("sponsors")}
          className={`px-3 py-1 rounded-lg uppercase font-bold shrink-0 transition-colors ${
            selectedSection === "sponsors" ? "bg-[#C5A059] text-black" : "text-white/60 hover:text-white"
          }`}
        >
          05 Partners
        </button>
      </div>

      {/* Inspector Form Body */}
      <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
        {/* === 01 HERO SECTION === */}
        {selectedSection === "hero" && currentHero && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#C5A059] font-mono font-bold uppercase text-[10px]">
              <Sparkles className="w-3.5 h-3.5" />
              Hero Banner Configuration
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/70">Main Headline</label>
              <textarea
                value={currentHero.title}
                onChange={(e) => updateHeroSlide(currentHero.id, { title: e.target.value })}
                rows={2}
                className="w-full bg-[#161B22] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#C5A059] outline-none font-heading font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/70">Subtitle / Tagline</label>
              <textarea
                value={currentHero.subtitle || ""}
                onChange={(e) => updateHeroSlide(currentHero.id, { subtitle: e.target.value })}
                rows={3}
                className="w-full bg-[#161B22] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#C5A059] outline-none font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/70">Button Label</label>
                <input
                  type="text"
                  value={currentHero.cta_text || ""}
                  onChange={(e) => updateHeroSlide(currentHero.id, { cta_text: e.target.value })}
                  className="w-full bg-[#161B22] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C5A059] outline-none font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/70">Button URL</label>
                <input
                  type="text"
                  value={currentHero.cta_url || ""}
                  onChange={(e) => updateHeroSlide(currentHero.id, { cta_url: e.target.value })}
                  className="w-full bg-[#161B22] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C5A059] outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/70">Hero Background Image</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentHero.image_url || ""}
                  onChange={(e) => updateHeroSlide(currentHero.id, { image_url: e.target.value })}
                  className="flex-1 bg-[#161B22] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C5A059] outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => toast("Directus Asset Vault linked.", "success")}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === 02 LIVE TICKER === */}
        {selectedSection === "ticker" && currentAnnouncement && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#C5A059] font-mono font-bold uppercase text-[10px]">
              <Megaphone className="w-3.5 h-3.5" />
              Marquee Ticker & Breaking Notice
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/70">Alert Tag</label>
              <select
                value={currentAnnouncement.tag || "BREAKING"}
                onChange={(e) => updateAnnouncement(currentAnnouncement.id, { tag: e.target.value })}
                className="w-full bg-[#161B22] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C5A059] outline-none font-bold"
              >
                <option value="BREAKING">BREAKING</option>
                <option value="LIVE MATCH">LIVE MATCH</option>
                <option value="TICKETS">TICKETS</option>
                <option value="NOTICE">NOTICE</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/70">Ticker Text Content</label>
              <textarea
                value={currentAnnouncement.title}
                onChange={(e) => updateAnnouncement(currentAnnouncement.id, { title: e.target.value })}
                rows={4}
                className="w-full bg-[#161B22] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#C5A059] outline-none font-sans"
              />
            </div>
          </div>
        )}

        {/* === 03 MATCH CENTRE === */}
        {selectedSection === "fixtures" && currentMatch && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#C5A059] font-mono font-bold uppercase text-[10px]">
              <Trophy className="w-3.5 h-3.5" />
              Matchday Scoreboard & Status
            </div>

            <div className="p-3.5 rounded-xl bg-[#161B22] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>{currentMatch.homeTeam.name}</span>
                <span className="font-mono text-lg font-black text-[#C5A059]">{currentMatch.homeTeam.score ?? 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateMatch(currentMatch.id, { homeTeam: { ...currentMatch.homeTeam, score: (currentMatch.homeTeam.score ?? 0) + 3 } })}
                  className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-mono text-[10px] font-bold text-white"
                >
                  +3 Pen
                </button>
                <button
                  onClick={() => updateMatch(currentMatch.id, { homeTeam: { ...currentMatch.homeTeam, score: (currentMatch.homeTeam.score ?? 0) + 5 } })}
                  className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-mono text-[10px] font-bold text-white"
                >
                  +5 Try
                </button>
                <button
                  onClick={() => updateMatch(currentMatch.id, { homeTeam: { ...currentMatch.homeTeam, score: (currentMatch.homeTeam.score ?? 0) + 2 } })}
                  className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-mono text-[10px] font-bold text-white"
                >
                  +2 Con
                </button>
              </div>

              <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs font-bold text-white">
                <span>{currentMatch.awayTeam.name}</span>
                <span className="font-mono text-lg font-black text-[#C5A059]">{currentMatch.awayTeam.score ?? 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateMatch(currentMatch.id, { awayTeam: { ...currentMatch.awayTeam, score: (currentMatch.awayTeam.score ?? 0) + 3 } })}
                  className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-mono text-[10px] font-bold text-white"
                >
                  +3 Pen
                </button>
                <button
                  onClick={() => updateMatch(currentMatch.id, { awayTeam: { ...currentMatch.awayTeam, score: (currentMatch.awayTeam.score ?? 0) + 5 } })}
                  className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-mono text-[10px] font-bold text-white"
                >
                  +5 Try
                </button>
                <button
                  onClick={() => updateMatch(currentMatch.id, { awayTeam: { ...currentMatch.awayTeam, score: (currentMatch.awayTeam.score ?? 0) + 2 } })}
                  className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-mono text-[10px] font-bold text-white"
                >
                  +2 Con
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/70">Match Status</label>
              <select
                value={currentMatch.status}
                onChange={(e) => updateMatch(currentMatch.id, { status: e.target.value as any })}
                className="w-full bg-[#161B22] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C5A059] outline-none font-bold uppercase"
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live Now</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        )}

        {/* === 04 NEWS === */}
        {selectedSection === "news" && currentNews && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#C5A059] font-mono font-bold uppercase text-[10px]">
              <Newspaper className="w-3.5 h-3.5" />
              Featured News Article
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/70">Article Headline</label>
              <textarea
                value={currentNews.title}
                onChange={(e) => updateNewsItem(currentNews.id, { title: e.target.value })}
                rows={3}
                className="w-full bg-[#161B22] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#C5A059] outline-none font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/70">Category</label>
              <input
                type="text"
                value={currentNews.category || ""}
                onChange={(e) => updateNewsItem(currentNews.id, { category: e.target.value })}
                className="w-full bg-[#161B22] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C5A059] outline-none font-bold"
              />
            </div>
          </div>
        )}

        {/* === 05 SPONSORS === */}
        {selectedSection === "sponsors" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#C5A059] font-mono font-bold uppercase text-[10px]">
              <Award className="w-3.5 h-3.5" />
              Partners & Commercial Tiers
            </div>

            <div className="space-y-2">
              {sponsors.map((sp) => (
                <div key={sp.id} className="p-3 rounded-xl bg-[#161B22] border border-white/10 space-y-1.5">
                  <input
                    type="text"
                    value={sp.name}
                    onChange={(e) => updateSponsor(sp.id, { name: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-bold"
                  />
                  <input
                    type="text"
                    value={sp.tier}
                    onChange={(e) => updateSponsor(sp.id, { tier: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] font-mono text-white/70"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
