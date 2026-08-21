"use client";

import React, { useState } from "react";
import { Shield, FileText, CheckCircle2, AlertTriangle, Clock, RefreshCw, UserCheck, Lock } from "lucide-react";
import { sanitizePayload } from "@/lib/compliance/privacy";

interface AuditLog {
  id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress?: string;
  details?: string;
}

interface DSRRequest {
  id: string;
  email: string;
  type: "export" | "erasure" | "rectification";
  status: "pending" | "processing" | "completed";
  requestedAt: string;
}

const MOCK_DSR_REQUESTS: DSRRequest[] = [
  {
    id: "dsr-101",
    email: "fan.member@zimrugby.co.zw",
    type: "export",
    status: "completed",
    requestedAt: "2026-08-19T10:15:00Z"
  },
  {
    id: "dsr-102",
    email: "supporter.zim@gmail.com",
    type: "erasure",
    status: "pending",
    requestedAt: "2026-08-20T14:30:00Z"
  }
];

export function ComplianceAuditPanel() {
  const [activeSubTab, setActiveSubTab] = useState<"audit" | "dsr" | "consents">("audit");
  const [dsrRequests, setDsrRequests] = useState<DSRRequest[]>(MOCK_DSR_REQUESTS);
  const [filterAction, setFilterAction] = useState<string>("ALL");

  const handleResolveDsr = (id: string, newStatus: "completed" | "processing") => {
    setDsrRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-zru-green/10 border border-zru-green/20 text-zru-green">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Compliance & Security Oversight
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-zru-green/20 text-zru-green rounded-full border border-zru-green/30">
                CDPA 2021 / GDPR
              </span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Append-only tamper-evident audit logs, user consent lifecycle, and Data Subject Requests (DSR).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("audit")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "audit"
                ? "bg-zru-green text-white shadow-lg shadow-zru-green/20"
                : "bg-white/5 text-neutral-400 hover:text-white border border-white/5"
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveSubTab("dsr")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "dsr"
                ? "bg-zru-green text-white shadow-lg shadow-zru-green/20"
                : "bg-white/5 text-neutral-400 hover:text-white border border-white/5"
            }`}
          >
            Data Subject Requests ({dsrRequests.filter(r => r.status === "pending").length})
          </button>
          <button
            onClick={() => setActiveSubTab("consents")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "consents"
                ? "bg-zru-green text-white shadow-lg shadow-zru-green/20"
                : "bg-white/5 text-neutral-400 hover:text-white border border-white/5"
            }`}
          >
            Consents & Telemetry
          </button>
        </div>
      </div>

      {/* Subtab 1: Audit Logs */}
      {activeSubTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-400">Filter Action:</span>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="bg-black/60 border border-white/10 text-neutral-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-zru-green"
              >
                <option value="ALL">All Actions</option>
                <option value="LOGIN">Logins & Auth</option>
                <option value="ROLE_UPDATE">Role Modifications</option>
                <option value="PAGE_PUBLISH">Publish Events</option>
              </select>
            </div>
            <span className="text-xs text-neutral-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zru-green" /> PII automatically masked
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/30 backdrop-blur-md">
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Recent Immutable Events</span>
              <span className="text-[11px] text-neutral-500 font-mono">Realtime Postgres Stream</span>
            </div>

            <div className="divide-y divide-white/5 text-xs">
              <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zru-green/10 text-zru-green">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      admin@zimrugby.co.zw
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-mono">super_admin</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] mt-0.5">LOGIN_SUCCESS · /admin-login (IP: 197.***.***.10)</p>
                  </div>
                </div>
                <span className="text-neutral-500 font-mono text-[11px]">Just now</span>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      editor@zimrugby.co.zw
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-mono">editor</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] mt-0.5">PAGE_UPDATE · news: "Sables Squad Announcement" (ID: 22)</p>
                  </div>
                </div>
                <span className="text-neutral-500 font-mono text-[11px]">10 min ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Data Subject Requests */}
      {activeSubTab === "dsr" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dsrRequests.map((req) => (
              <div key={req.id} className="p-5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300 uppercase">
                      {req.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-3">{req.email}</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Submitted on {new Date(req.requestedAt).toLocaleDateString()} under CDPA Right to {req.type === "erasure" ? "Forgotten (Erasure)" : "Data Portability"}.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-[11px] font-mono text-neutral-500">ID: {req.id}</span>
                  {req.status === "pending" ? (
                    <button
                      onClick={() => handleResolveDsr(req.id, "completed")}
                      className="px-3 py-1 bg-zru-green hover:bg-zru-green-light text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Execute & Complete
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Consents & Telemetry */}
      {activeSubTab === "consents" && (
        <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Active Consent Categories & Rationale</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="font-bold text-white mb-1">Analytics & Performance</div>
              <p className="text-neutral-400 text-[11px]">Umami cookieless telemetry. No PII gathered.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="font-bold text-white mb-1">Newsletter & Alerts</div>
              <p className="text-neutral-400 text-[11px]">Explicit opt-in with instant unsubscribe tokens.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="font-bold text-white mb-1">Under-18 Safeguarding</div>
              <p className="text-neutral-400 text-[11px]">Parental consent verification on school programs.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
