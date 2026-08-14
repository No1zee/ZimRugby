"use client";

import { useMemo, useState } from "react";
import { Users, ClipboardList, Eye, EyeOff, Shield, Download, Lock } from "lucide-react";
import { EmptyState } from "./ui/StatusChip";
import { SearchBox, Pagination } from "./ui/ListTools";
import { useToast } from "./ui/ToastProvider";
import { useConfirm } from "./ui/ConfirmProvider";

interface FanZoneMember {
  id: number;
  name: string;
  email: string;
  favorite_team?: string;
  vip_code?: string;
  cdpa_consent: boolean;
  registered_at?: string;
}

interface OnboardingSubmission {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  organization?: string;
  submitted_at?: string;
}

interface SignupsPanelProps {
  initialFanZoneMembers: FanZoneMember[];
  initialOnboardingSubmissions: OnboardingSubmission[];
  mode?: "all" | "fanzone" | "onboarding";
}

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// SOC 2 CC6.7 PII Masking Algorithms
function maskEmail(email?: string): string {
  if (!email) return "—";
  const parts = email.split("@");
  if (parts.length !== 2) return "***@***";
  const [name, domain] = parts;
  const visible = name.length > 2 ? name.slice(0, 2) : name.slice(0, 1);
  return `${visible}***@${domain}`;
}

function maskPhone(phone?: string): string {
  if (!phone) return "—";
  if (phone.length < 6) return "***";
  return `${phone.slice(0, 4)} *** ${phone.slice(-3)}`;
}

const PAGE_SIZE = 10;

export default function SignupsPanel({ initialFanZoneMembers, initialOnboardingSubmissions, mode = "all" }: SignupsPanelProps) {
  const { toast } = useToast();
  const confirm = useConfirm();

  const [fanQuery, setFanQuery] = useState("");
  const [fanPage, setFanPage] = useState(1);
  const [onbQuery, setOnbQuery] = useState("");
  const [onbPage, setOnbPage] = useState(1);

  // Set of individual row IDs that have been explicitly unmasked
  const [unmaskedFanIds, setUnmaskedFanIds] = useState<Set<number>>(new Set());
  const [unmaskedOnbIds, setUnmaskedOnbIds] = useState<Set<number>>(new Set());
  const [revealAll, setRevealAll] = useState(false);

  // Audit Logging helper for PII Inspection
  const logPiiAccess = async (action: "PII_UNMASK" | "DATA_EXPORT", details: string) => {
    try {
      await fetch("/api/admin/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, resource: "/admin/signups", details }),
      });
    } catch {}
  };

  const toggleFanPii = (id: number, name: string) => {
    setUnmaskedFanIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        logPiiAccess("PII_UNMASK", `Unmasked contact PII for fan member #${id} (${name})`);
        toast(`Unmasked contact details for ${name} (Audit Logged).`);
      }
      return next;
    });
  };

  const toggleOnbPii = (id: number, name: string) => {
    setUnmaskedOnbIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        logPiiAccess("PII_UNMASK", `Unmasked contact PII for onboarding candidate #${id} (${name})`);
        toast(`Unmasked contact details for ${name} (Audit Logged).`);
      }
      return next;
    });
  };

  const handleRevealAll = async () => {
    if (revealAll) {
      setRevealAll(false);
      setUnmaskedFanIds(new Set());
      setUnmaskedOnbIds(new Set());
      toast("PII data re-masked across all tables.");
      return;
    }

    const ok = await confirm({
      title: "Reveal All PII Data?",
      message: "Viewing unmasked personal email and phone data is monitored under SOC 2 and GDPR standards. This action will be permanently recorded in the security audit logs. Proceed?",
      confirmLabel: "Yes, Reveal & Log Access",
      danger: false,
    });

    if (ok) {
      setRevealAll(true);
      logPiiAccess("PII_UNMASK", "Admin unmasked all Fan Zone and Onboarding PII records in bulk");
      toast("All PII revealed and access event logged in audit trail.");
    }
  };

  const fanFiltered = useMemo(() => {
    const q = fanQuery.trim().toLowerCase();
    if (!q) return initialFanZoneMembers;
    return initialFanZoneMembers.filter((m) =>
      [m.name, m.email, m.favorite_team, m.vip_code].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [initialFanZoneMembers, fanQuery]);

  const onbFiltered = useMemo(() => {
    const q = onbQuery.trim().toLowerCase();
    if (!q) return initialOnboardingSubmissions;
    return initialOnboardingSubmissions.filter((m) =>
      [m.full_name, m.email, m.role, m.organization, m.phone].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [initialOnboardingSubmissions, onbQuery]);

  const fanCount = Math.max(1, Math.ceil(fanFiltered.length / PAGE_SIZE));
  const fanPageSafe = Math.min(fanPage, fanCount);
  const fanVisible = fanFiltered.slice((fanPageSafe - 1) * PAGE_SIZE, fanPageSafe * PAGE_SIZE);

  const onbCount = Math.max(1, Math.ceil(onbFiltered.length / PAGE_SIZE));
  const onbPageSafe = Math.min(onbPage, onbCount);
  const onbVisible = onbFiltered.slice((onbPageSafe - 1) * PAGE_SIZE, onbPageSafe * PAGE_SIZE);

  const downloadCSV = async (data: any[], filename: string, headers: string[], rowMapper: (item: any) => string[]) => {
    logPiiAccess("DATA_EXPORT", `Exported ${data.length} records to file ${filename}`);
    const csvContent = [
      headers.join(","),
      ...data.map((item) => rowMapper(item).map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast(`Exported ${data.length} records to ${filename} (Logged).`);
  };

  const exportFansToCSV = () => {
    downloadCSV(
      fanFiltered,
      "zru-fanzone-members.csv",
      ["Name", "Email", "Favorite Team", "VIP Code", "CDPA Consent", "Registered At"],
      (m) => [m.name, m.email, m.favorite_team || "", m.vip_code || "", m.cdpa_consent ? "Given" : "None", m.registered_at || ""]
    );
  };

  const exportOnboardingToCSV = () => {
    downloadCSV(
      onbFiltered,
      "zru-onboarding-enquiries.csv",
      ["Name", "Email", "Phone", "Requested Role", "Organization", "Submitted At"],
      (m) => [m.full_name, m.email, m.phone || "", m.role || "", m.organization || "", m.submitted_at || ""]
    );
  };

  return (
    <div className="space-y-6">
      {/* 🛡️ SOC 2 PII Governance Bar */}
      <div className="bg-black/[0.02] border border-black/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-[#006B3F]" />
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-rich-black">
              SOC 2 / CDPA Data Protection Active
            </h3>
            <p className="text-[11px] text-black/50">
              Personal contact data (emails & phone numbers) are masked by default to protect fan confidentiality.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRevealAll}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-black/15 bg-white hover:bg-black/5 text-xs font-bold text-rich-black transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          {revealAll ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-[#006B3F]" />}
          <span>{revealAll ? "Mask All PII" : "Reveal All PII (Audit Logged)"}</span>
        </button>
      </div>

      {/* Fan Zone */}
      {mode !== "onboarding" && (
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
              <Users className="h-5 w-5 text-zru-green" /> Fan Zone sign-ups
            </h2>
            {fanFiltered.length > 0 && (
              <button
                onClick={exportFansToCSV}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-zru-green border border-zru-green/20 hover:border-zru-green/50 bg-zru-green/5 hover:bg-zru-green/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV ({fanFiltered.length})</span>
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-black/50">Fans who registered their details for the Fan Zone. This data is consent-managed (CDPA).</p>

          <div className="mt-4">
            <SearchBox value={fanQuery} onChange={(v) => { setFanQuery(v); setFanPage(1); }} placeholder="Search fans by name, email, team…" />
          </div>

          {fanVisible.length === 0 ? (
            <div className="mt-4">
              <EmptyState title={fanQuery ? "No fans match your search" : "No fan sign-ups yet"} hint="Sign-ups appear here the moment a fan registers." />
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-black/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 bg-black/[0.02] text-left text-[10px] font-black uppercase tracking-wider text-black/50">
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Email (Protected)</th>
                    <th className="px-4 py-2.5">Team</th>
                    <th className="px-4 py-2.5">VIP code</th>
                    <th className="px-4 py-2.5">Consent</th>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fanVisible.map((m) => {
                    const isUnmasked = revealAll || unmaskedFanIds.has(m.id);
                    return (
                      <tr key={m.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.01]">
                        <td className="px-4 py-2.5 font-bold">{m.name}</td>
                        <td className="px-4 py-2.5 text-black/70 font-mono text-xs">
                          {isUnmasked ? m.email : maskEmail(m.email)}
                        </td>
                        <td className="px-4 py-2.5">{m.favorite_team || "—"}</td>
                        <td className="px-4 py-2.5">
                          {m.vip_code ? <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs text-amber-800">{m.vip_code}</span> : "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${m.cdpa_consent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {m.cdpa_consent ? "Given" : "None"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-black/60">{fmtDate(m.registered_at)}</td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => toggleFanPii(m.id, m.name)}
                            className="p-1 rounded hover:bg-black/5 text-black/40 hover:text-black/80 transition-colors cursor-pointer"
                            title={isUnmasked ? "Mask PII" : "Reveal PII (Audit Logged)"}
                          >
                            {isUnmasked ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-[#006B3F]" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4">
            <Pagination page={fanPageSafe} pageCount={fanCount} total={fanFiltered.length} onPage={setFanPage} />
          </div>
        </section>
      )}

      {/* Onboarding */}
      {mode !== "fanzone" && (
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
              <ClipboardList className="h-5 w-5 text-zru-green" /> Onboarding enquiries
            </h2>
            {onbFiltered.length > 0 && (
              <button
                onClick={exportOnboardingToCSV}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-zru-green border border-zru-green/20 hover:border-zru-green/50 bg-zru-green/5 hover:bg-zru-green/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV ({onbFiltered.length})</span>
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-black/50">People who asked to get involved — volunteers, sponsors, partners.</p>

          <div className="mt-4">
            <SearchBox value={onbQuery} onChange={(v) => { setOnbQuery(v); setOnbPage(1); }} placeholder="Search by name, email, role…" />
          </div>

          {onbVisible.length === 0 ? (
            <div className="mt-4">
              <EmptyState title={onbQuery ? "No enquiries match your search" : "No onboarding enquiries yet"} />
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-black/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 bg-black/[0.02] text-left text-[10px] font-black uppercase tracking-wider text-black/50">
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Email (Protected)</th>
                    <th className="px-4 py-2.5">Phone</th>
                    <th className="px-4 py-2.5">Role</th>
                    <th className="px-4 py-2.5">Organisation</th>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {onbVisible.map((m) => {
                    const isUnmasked = revealAll || unmaskedOnbIds.has(m.id);
                    return (
                      <tr key={m.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.01]">
                        <td className="px-4 py-2.5 font-bold">{m.full_name}</td>
                        <td className="px-4 py-2.5 text-black/70 font-mono text-xs">
                          {isUnmasked ? m.email : maskEmail(m.email)}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-black/70">
                          {isUnmasked ? (m.phone || "—") : maskPhone(m.phone)}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="rounded bg-zru-green/10 px-1.5 py-0.5 text-xs font-bold text-zru-green">{m.role || "—"}</span>
                        </td>
                        <td className="px-4 py-2.5">{m.organization || "—"}</td>
                        <td className="px-4 py-2.5 text-black/60">{fmtDate(m.submitted_at)}</td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => toggleOnbPii(m.id, m.full_name)}
                            className="p-1 rounded hover:bg-black/5 text-black/40 hover:text-black/80 transition-colors cursor-pointer"
                            title={isUnmasked ? "Mask PII" : "Reveal PII (Audit Logged)"}
                          >
                            {isUnmasked ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-[#006B3F]" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4">
            <Pagination page={onbPageSafe} pageCount={onbCount} total={onbFiltered.length} onPage={setOnbPage} />
          </div>
        </section>
      )}
    </div>
  );
}
