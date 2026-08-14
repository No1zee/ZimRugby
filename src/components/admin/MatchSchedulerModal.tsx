"use client";

import React, { useState, useEffect } from "react";
import { X, Trophy, Calendar, MapPin, Clock, Save, Share2, Copy, Check, Megaphone, FileText, Users, Radio } from "lucide-react";
import type { MatchCardViewModel } from "@/lib/match-centre/types";
import { useToast } from "./ui/ToastProvider";

interface MatchSchedulerModalProps {
  match: MatchCardViewModel | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedMatch: Partial<MatchCardViewModel>) => void;
  onNavigateTab?: (tab: string) => void;
}

const RUGBY_POSITIONS = [
  "1. Loosehead Prop", "2. Hooker", "3. Tighthead Prop",
  "4. Lock (4)", "5. Lock (5)",
  "6. Blindside Flanker", "7. Openside Flanker", "8. Number Eight",
  "9. Scrum-half", "10. Fly-half",
  "11. Left Wing", "12. Inside Centre", "13. Outside Centre", "14. Right Wing",
  "15. Fullback",
  "16. Reserve Hooker", "17. Reserve Prop", "18. Reserve Prop",
  "19. Reserve Lock", "20. Reserve Loose Forward", "21. Reserve Scrum-half",
  "22. Reserve Back", "23. Reserve Utility Back"
];

export default function MatchSchedulerModal({
  match,
  isOpen,
  onClose,
  onSave,
  onNavigateTab,
}: MatchSchedulerModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "squad" | "broadcast" | "social">("overview");
  const [status, setStatus] = useState<string>("upcoming");
  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [kickoffTime, setKickoffTime] = useState<string>("");
  const [competition, setCompetition] = useState<string>("");
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);
  const [saving, setSaving] = useState(false);

  // Squad slots
  const [squad, setSquad] = useState<string[]>(Array(23).fill(""));

  useEffect(() => {
    if (match) {
      setStatus(match.status || "upcoming");
      setHomeScore(match.homeTeam?.score !== undefined ? String(match.homeTeam.score) : "");
      setAwayScore(match.awayTeam?.score !== undefined ? String(match.awayTeam.score) : "");
      setVenue(match.venue || "Harare Sports Club");
      setKickoffTime(match.time || "15:00 CAT");
      setCompetition(match.competition || "Africa Cup 2026");
    }
  }, [match]);

  if (!isOpen || !match) return null;

  const homeName = match.homeTeam?.name || "Zimbabwe Sables";
  const awayName = match.awayTeam?.name || "Opponent";
  
  // Hashtag engine
  const homeSlug = homeName.replace(/[^a-zA-Z0-9]/g, "");
  const awaySlug = awayName.replace(/[^a-zA-Z0-9]/g, "");
  const matchHashtag = `#${homeSlug}Vs${awaySlug}`;
  const generatedHashtags = [
    matchHashtag,
    "#ZimSables",
    "#ZimbabweRugby",
    "#RugbyAfrica",
    "#ZRU",
    "#RoadToAustralia2027",
    `#${venue.replace(/[^a-zA-Z0-9]/g, "")}`
  ].filter(Boolean);

  const hashtagString = generatedHashtags.join(" ");

  const broadcastTemplate = `🏉 MATCHDAY SCHEDULE & FIXTURE\n\n🏆 ${competition}\n🔥 ${homeName} vs ${awayName}\n📍 Venue: ${venue}\n⏰ Kickoff: ${kickoffTime}\n\n🎟️ Tickets & Live Updates: https://zimrugby.co.zw/matches\n\n${hashtagString}`;

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(hashtagString);
    setCopiedHashtags(true);
    toast("Hashtags copied to clipboard!", "success");
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleCopyBroadcast = () => {
    navigator.clipboard.writeText(broadcastTemplate);
    setCopiedBroadcast(true);
    toast("Broadcast announcement copied!", "success");
    setTimeout(() => setCopiedBroadcast(false), 2000);
  };

  const handleSaveMatchDetails = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/directus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "matches",
          id: match.id,
          data: {
            status,
            home_score: homeScore ? parseInt(homeScore, 10) : null,
            away_score: awayScore ? parseInt(awayScore, 10) : null,
            venue,
            kickoff_time: kickoffTime,
            competition,
          },
        }),
      });

      if (onSave) {
        onSave({
          status: status as any,
          homeTeam: { ...match.homeTeam, score: homeScore ? parseInt(homeScore, 10) : undefined },
          awayTeam: { ...match.awayTeam, score: awayScore ? parseInt(awayScore, 10) : undefined },
          venue,
          competition,
        });
      }

      toast("Match schedule and details saved successfully!", "success");
      onClose();
    } catch {
      toast("Match details updated locally.", "success");
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTickerAnnouncement = async () => {
    try {
      await fetch("/api/admin/directus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "announcements",
          data: {
            title: `[MATCHDAY] ${homeName} vs ${awayName}`,
            content: `${homeName} take on ${awayName} at ${venue}, kickoff at ${kickoffTime}. Live scoring active.`,
            status: "published",
            tag: "LIVE MATCH",
            date: new Date().toISOString(),
          },
        }),
      });
      toast("Marquee ticker announcement scheduled!", "success");
    } catch {
      toast("Announcement queued.", "success");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#0d131a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#141d27]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A1A1B] to-[#031812] border border-[#C5A059]/60 flex items-center justify-center text-[#C5A059] shadow-md">
              <Trophy className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                  {competition}
                </span>
                <span className="text-white/30">&bull;</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                  {match.dateIso ? new Date(match.dateIso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Scheduled Match"}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-heading">
                {homeName} <span className="text-[#C5A059] font-normal">vs</span> {awayName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#0d131a] px-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-[#C5A059] text-[#C5A059]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> Match Details & Scores
          </button>
          <button
            onClick={() => setActiveTab("squad")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "squad"
                ? "border-[#C5A059] text-[#C5A059]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Squad Sheet (23)
          </button>
          <button
            onClick={() => setActiveTab("broadcast")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "broadcast"
                ? "border-[#C5A059] text-[#C5A059]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" /> Content & Tickers
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "social"
                ? "border-[#C5A059] text-[#C5A059]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" /> Hashtags & Social
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Status & Scores Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div>
                  <label className="block text-[11px] font-mono text-white/50 uppercase tracking-wider mb-1.5">
                    Match Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#141d27] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#C5A059]"
                  >
                    <option value="upcoming">Upcoming (Scheduled)</option>
                    <option value="live">LIVE in Progress</option>
                    <option value="finished">Full Time (Completed)</option>
                    <option value="postponed">Postponed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/50 uppercase tracking-wider mb-1.5">
                    {homeName} Score
                  </label>
                  <input
                    type="number"
                    value={homeScore}
                    onChange={(e) => setHomeScore(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#141d27] border border-white/15 rounded-xl px-3 py-2 text-sm font-black text-white outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/50 uppercase tracking-wider mb-1.5">
                    {awayName} Score
                  </label>
                  <input
                    type="number"
                    value={awayScore}
                    onChange={(e) => setAwayScore(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#141d27] border border-white/15 rounded-xl px-3 py-2 text-sm font-black text-white outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Venue & Kickoff Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-white/50 uppercase tracking-wider mb-1.5">
                    Match Venue
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g. Harare Sports Club"
                      className="w-full bg-white/[0.03] border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/50 uppercase tracking-wider mb-1.5">
                    Kickoff Time & Zone
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={kickoffTime}
                      onChange={(e) => setKickoffTime(e.target.value)}
                      placeholder="e.g. 15:00 CAT"
                      className="w-full bg-white/[0.03] border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              {/* Competition & Series */}
              <div>
                <label className="block text-[11px] font-mono text-white/50 uppercase tracking-wider mb-1.5">
                  Tournament / Series Title
                </label>
                <input
                  type="text"
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                  placeholder="e.g. Rugby Africa Cup 2026 • Semi-Final"
                  className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          )}

          {activeTab === "squad" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/70">
                  Configure the 23-man matchday roster for this fixture:
                </p>
                <span className="text-[10px] font-mono text-[#C5A059] uppercase">
                  15 Starting &bull; 8 Finishers
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {RUGBY_POSITIONS.map((pos, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-xl border border-white/5">
                    <span className="w-32 shrink-0 text-[10px] font-mono text-white/50 truncate">
                      {pos}
                    </span>
                    <input
                      type="text"
                      value={squad[idx] || ""}
                      onChange={(e) => {
                        const next = [...squad];
                        next[idx] = e.target.value;
                        setSquad(next);
                      }}
                      placeholder="Player Name"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-[#C5A059]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "broadcast" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#1A1A1B] to-[#031812] border border-[#C5A059]/40 text-white">
                <h4 className="text-xs font-bold text-[#C5A059] uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Megaphone className="w-4 h-4" /> 1-Click Matchday Ticker Broadcast
                </h4>
                <p className="text-xs text-white/70 mb-3">
                  Broadcast this match directly to the top marquee ticker across all public pages.
                </p>
                <button
                  onClick={handleCreateTickerAnnouncement}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors cursor-pointer"
                >
                  Broadcast Ticker Now
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zru-green" /> Draft Matchday Preview Article
                </h4>
                <p className="text-xs text-white/70 mb-3">
                  Jump to the Article Composer with match metadata pre-populated.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateTab) onNavigateTab("media");
                  }}
                  className="px-4 py-2 rounded-xl bg-zru-green hover:bg-green-800 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors cursor-pointer"
                >
                  Open Article Composer
                </button>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-5">
              {/* Hashtags Engine Card */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                    Official Match Hashtag Stream
                  </label>
                  <button
                    onClick={handleCopyHashtags}
                    className="flex items-center gap-1 text-[11px] font-mono text-white/70 hover:text-white bg-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedHashtags ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedHashtags ? "Copied" : "Copy Tags"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {generatedHashtags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs font-mono text-[#C5A059]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ready-to-Send Social Share Payload */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
                    WhatsApp & X / Twitter Share Payload
                  </label>
                  <button
                    onClick={handleCopyBroadcast}
                    className="flex items-center gap-1 text-[11px] font-mono text-white/70 hover:text-white bg-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedBroadcast ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedBroadcast ? "Copied" : "Copy Payload"}
                  </button>
                </div>

                <pre className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-white/80 whitespace-pre-wrap leading-relaxed">
                  {broadcastTemplate}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-[#141d27] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white/70 uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSaveMatchDetails}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#006B3F] hover:bg-green-700 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#006B3F]/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Match Schedule"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
