"use client";

import { useEffect, useState, useMemo, Fragment } from "react";
import { Shield, Search, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

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

const ACTION_COLORS: Record<string, string> = {
  login: "bg-purple-100 text-purple-800",
  logout: "bg-zinc-100 text-zinc-800",
  create: "bg-green-100 text-green-800",
  update: "bg-blue-100 text-blue-800",
  delete: "bg-red-100 text-red-800",
  mfa_enroll: "bg-orange-100 text-orange-800",
  role_override: "bg-amber-100 text-amber-800",
};

export default function AuditLogsPanel() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const toggleRow = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const fmtDateTime = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
            <Shield className="h-5 w-5 text-zru-green" /> Activity Log
          </h2>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black/50 hover:text-black transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Reload</span>
          </button>
        </div>
        <p className="mt-1 text-xs text-black/50">
          Traceability logs for administrative edits, permissions changes, and authentication requests (ISO 27001 & NIST compliant).
        </p>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
          <input
            type="text"
            placeholder="Filter logs by actor, action, resource..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-black/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-zru-green placeholder-black/40 text-black"
          />
        </div>

        {loading ? (
          <div className="mt-8 text-center py-10">
            <RefreshCw className="h-8 w-8 text-zru-green animate-spin mx-auto mb-2" />
            <p className="text-xs text-black/40 font-bold uppercase">Loading security trail...</p>
          </div>
        ) : error ? (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl text-center">
            {error}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="mt-6 text-center py-10 border border-dashed border-black/10 rounded-xl">
            <p className="text-sm text-black/40 font-black uppercase">No audit entries found</p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-black/5">
            <table className="w-full text-sm text-black">
              <thead>
                <tr className="border-b border-black/5 bg-black/[0.02] text-left text-[10px] font-black uppercase tracking-wider text-black/50">
                  <th className="w-8 px-4 py-2.5"></th>
                  <th className="px-4 py-2.5">Date & Time</th>
                  <th className="px-4 py-2.5">Actor</th>
                  <th className="px-4 py-2.5">Action</th>
                  <th className="px-4 py-2.5">Resource</th>
                  <th className="px-4 py-2.5">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const isExpanded = expandedId === log.id;
                  const actionColor = ACTION_COLORS[log.action.toLowerCase()] || "bg-zinc-100 text-zinc-800";

                  return (
                    <Fragment key={log.id}>
                      <tr
                        onClick={() => toggleRow(log.id)}
                        className="border-b border-black/5 hover:bg-black/[0.01] transition-colors cursor-pointer last:border-0"
                      >
                        <td className="px-4 py-2.5 text-center">
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-black/40" /> : <ChevronDown className="h-4 w-4 text-black/40" />}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[11px] text-black/60">
                          {fmtDateTime(log.timestamp)}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="font-bold">{log.actorEmail}</div>
                          <div className="text-[10px] uppercase font-black tracking-wider text-black/40">
                            {log.actorRole}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${actionColor}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-medium">{log.resource}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-black/60">
                          {log.ipAddress || "—"}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-black/[0.02] border-b border-black/5">
                          <td colSpan={6} className="px-8 py-4">
                            <div className="space-y-2">
                              <h4 className="text-[10px] font-black uppercase tracking-wider text-black/40">
                                Detailed Event Metadata
                              </h4>
                              <pre className="p-3 bg-black/5 rounded-lg text-xs font-mono text-black/80 overflow-x-auto whitespace-pre-wrap">
                                {log.details ? (
                                  (() => {
                                    try {
                                      return JSON.stringify(JSON.parse(log.details), null, 2);
                                    } catch {
                                      return log.details;
                                    }
                                  })()
                                ) : (
                                  "No extra parameters logged."
                                )}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
