"use client";

import { useEffect, useState, useMemo } from "react";
import { Shield, Search, RefreshCw, Check, Pencil, FileText, Trash2, KeyRound } from "lucide-react";
import { resolveActorName, roleToName, type UserRole } from "@/lib/admin/iam";

interface AuditLogEntry {
  id: number;
  timestamp: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  resource: string;
  details?: string;
  ipAddress?: string;
}

export default function AuditLogsPanel() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/audit-logs");
      if (!res.ok) {
        throw new Error(res.status === 401 ? "Unauthorized" : "Failed to load audit logs");
      }
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter((l) =>
      [l.actorEmail, l.action, l.resource, l.ipAddress, l.details]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [logs, query]);

  const getActivityBadge = (action: string, resource: string) => {
    const act = (action || "").toLowerCase();
    const res = (resource || "").toLowerCase();
    if (act.includes("create") || act.includes("publish")) {
      return {
        bg: "bg-emerald-100 border-emerald-300 text-emerald-700",
        icon: Check,
      };
    }
    if (act.includes("delete") || act.includes("purge")) {
      return {
        bg: "bg-rose-100 border-rose-300 text-rose-700",
        icon: Trash2,
      };
    }
    if (res.includes("role") || res.includes("auth") || act.includes("mfa") || act.includes("login")) {
      return {
        bg: "bg-amber-100 border-amber-300 text-amber-700",
        icon: KeyRound,
      };
    }
    if (res.includes("doc") || res.includes("compliance") || res.includes("report") || res.includes("resource")) {
      return {
        bg: "bg-blue-100 border-blue-300 text-blue-700",
        icon: FileText,
      };
    }
    return {
      bg: "bg-slate-100 border-slate-300 text-slate-700",
      icon: Pencil,
    };
  };

  // Convert raw audit log entries into clean, conversational headlines
  const getHumanReadableLog = (log: AuditLogEntry) => {
    const action = (log.action || "").toLowerCase();
    const rawRes = (log.resource || "").toLowerCase();
    
    // Strip IDs, UUIDs, and paths from resource string (e.g. "announcements:6c39c421..." -> "announcements")
    const resourceKey = rawRes.split(":")[0].replace(/\/admin\//g, "").trim();

    const actor = resolveActorName(log.actorEmail, log.actorRole);

    const resourceFriendly: Record<string, string> = {
      news: "Article",
      matches: "Match fixture",
      hero_slides: "Homepage hero banner",
      events: "Community event",
      players: "Player profile",
      teams: "Squad roster",
      partners: "Partner sponsorship",
      referee_resources: "Compliance document",
      grassroots_initiatives: "Grassroots programme",
      campaigns: "Campaign",
      announcements: "Announcement",
      faqs: "Help FAQ",
      footer_navigation: "Footer link",
      auth: "Authentication session",
      roles: "Staff permissions",
      backup: "System backup",
      audit_log: "Audit log",
      signups: "Fan registrations",
      onboarding: "Enquiries",
    };

    const cleanRes = resourceFriendly[resourceKey] || (resourceKey ? resourceKey.replace(/_/g, " ") : "Content");

    if (action.includes("create") || action.includes("publish")) {
      return {
        title: `${cleanRes} published`,
        byline: `by ${actor}`,
      };
    }
    if (action.includes("delete") || action.includes("purge")) {
      return {
        title: `${cleanRes} deleted`,
        byline: `by ${actor}`,
      };
    }
    if (action.includes("restore")) {
      return {
        title: `${cleanRes} restored from trash`,
        byline: `by ${actor}`,
      };
    }
    if (action.includes("update") || action.includes("edit")) {
      return {
        title: `${cleanRes} updated`,
        byline: `by ${actor}`,
      };
    }
    if (action.includes("mfa")) {
      return {
        title: `MFA 2-Factor security configured`,
        byline: `by ${actor}`,
      };
    }
    if (action.includes("login") || action.includes("authenticate")) {
      return {
        title: `Admin session authenticated`,
        byline: `for ${actor}`,
      };
    }

    return {
      title: `${cleanRes} ${action}`,
      byline: `by ${actor}`,
    };
  };

  const formatLogTime = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "Recently";
    
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (isYesterday) {
      return `Yesterday ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      {/* Header plate */}
      <section className="rounded-2xl border border-[#eae8de] bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#006c4a] font-bold bg-[#b2f0ca]/40 px-2 py-0.5 rounded border border-[#006c4a]/20">
                Audit Trail
              </span>
            </div>
            <h2 className="text-xl font-black text-[#1b1c1c] tracking-tight flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#006c4a]" /> Activity & Compliance Log
            </h2>
            <p className="mt-1 text-xs text-[#707972]">
              Traceability logs for administrative edits, permissions changes, and authentication requests (ISO 27001 & NIST compliant).
            </p>
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#eae8de] hover:border-[#006c4a] rounded-xl text-xs font-bold text-[#1b1c1c] shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#006c4a] ${loading ? "animate-spin" : ""}`} />
            <span>Reload Logs</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707972]" />
          <input
            type="text"
            placeholder="Search by actor, action, resource, or IP address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8f7f0] border border-[#eae8de] rounded-xl text-xs text-[#1b1c1c] focus:outline-none focus:border-[#006c4a] transition-colors"
          />
        </div>
      </section>

      {/* Alternating Timeline Section */}
      <section className="rounded-2xl border border-[#eae8de] bg-white p-6 shadow-xs">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-[#707972]">
            <RefreshCw className="h-6 w-6 animate-spin text-[#006c4a]" />
            <p className="text-xs font-medium">Loading audit history...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            {error}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-[#707972] text-xs">
            No audit events matched your search query.
          </div>
        ) : (
          <div className="relative max-w-2xl mx-auto py-6">
            {/* Central Spine */}
            <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-[#eae8de] -translate-x-1/2" />

            <div className="space-y-8 relative">
              {filteredLogs.map((log, idx) => {
                const isLeft = idx % 2 === 0;
                const badge = getActivityBadge(log.action, log.resource);
                const BadgeIcon = badge.icon;
                const timeText = formatLogTime(log.timestamp);
                const human = getHumanReadableLog(log);

                return (
                  <div key={log.id || idx} className="relative flex items-center min-h-[64px]">
                    {/* Left Card Column */}
                    <div className={`w-[calc(50%-24px)] ${isLeft ? "pr-4 text-right" : "opacity-0 pointer-events-none"}`}>
                      {isLeft && (
                        <div className="p-3 bg-[#f8f7f0] border border-[#eae8de] rounded-xl shadow-2xs hover:border-[#006c4a]/40 transition-colors">
                          <span className="text-[10px] font-mono text-[#707972] block">
                            {timeText}
                          </span>
                          <h4 className="text-xs font-bold text-[#1b1c1c] capitalize mt-0.5">
                            {human.title}
                          </h4>
                          <p className="text-[11px] text-[#006c4a] font-medium mt-0.5 truncate">
                            {human.byline} ({roleToName(log.actorRole as UserRole)})
                          </p>
                          {log.details && (
                            <p className="text-[10px] text-[#707972] mt-1 line-clamp-2 italic">
                              {log.details}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Centered Node Badge */}
                    <div className="absolute left-1/2 -translate-x-1/2 z-10">
                      <div className={`w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center shadow-xs transition-transform hover:scale-110 ${badge.bg}`}>
                        <BadgeIcon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Right Card Column */}
                    <div className={`w-[calc(50%-24px)] ml-auto ${!isLeft ? "pl-4 text-left" : "opacity-0 pointer-events-none"}`}>
                      {!isLeft && (
                        <div className="p-3 bg-[#f8f7f0] border border-[#eae8de] rounded-xl shadow-2xs hover:border-[#006c4a]/40 transition-colors">
                          <span className="text-[10px] font-mono text-[#707972] block">
                            {timeText}
                          </span>
                          <h4 className="text-xs font-bold text-[#1b1c1c] capitalize mt-0.5">
                            {human.title}
                          </h4>
                          <p className="text-[11px] text-[#006c4a] font-medium mt-0.5 truncate">
                            {human.byline} ({roleToName(log.actorRole as UserRole)})
                          </p>
                          {log.details && (
                            <p className="text-[10px] text-[#707972] mt-1 line-clamp-2 italic">
                              {log.details}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}


