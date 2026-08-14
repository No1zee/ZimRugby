"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Save, Shield, Users, Pencil, X, UserPlus, KeyRound } from "lucide-react";
import type { RolePermissions, CollectionGrant } from "@/lib/admin/iam";

interface RoleRow {
  id: string;
  name: string;
  permissions: RolePermissions;
  created_at?: string;
}

interface UserRow {
  id: string;
  email: string;
  role?: string;
  createdAt?: string;
  lastSignInAt?: string;
}

const TAB_OPTIONS: { id: string; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "directus_ai", label: "Directus AI" },
  { id: "hero_layout", label: "Hero & Layout Manager" },
  { id: "pages", label: "Pages & Layouts" },
  { id: "media", label: "News & Media" },
  { id: "resources", label: "Resource Vault" },
  { id: "sponsors", label: "Sponsors & Partners" },
  { id: "grassroots", label: "Grassroots & Programs" },
  { id: "faq-footer", label: "FAQ & Footer" },
  { id: "fixtures", label: "Match Centre & Fixtures" },
  { id: "campaigns", label: "Campaigns" },
  { id: "fanzone", label: "Fan Zone Members" },
  { id: "onboarding", label: "Onboarding Submissions" },
];

const COLLECTIONS = [
  "news",
  "matches",
  "matches_results",
  "campaigns",
  "announcements",
  "players",
  "grassroots_initiatives",
  "pages",
  "page_sections",
];

const FEATURES: { key: keyof RolePermissions; label: string }[] = [
  { key: "pages_builder", label: "Pages Builder" },
  { key: "ai_assistant", label: "AI Assistant" },
  { key: "media_upload", label: "Media Upload" },
  { key: "fanzone_pii", label: "View Fan Zone PII" },
];

const EMPTY_PERMS: RolePermissions = { tabs: [], collections: {} };

// Roles with actual administrative access shown in the Admin Users card.
// Fan/member/user accounts are managed in the Fan Zone tab instead.
const ADMIN_ROLE_IDS = ["super_admin", "editor", "match_official", "staff"];

export default function RolesPanel() {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Account Security (MFA) state
  const [mfaStatus, setMfaStatus] = useState<{ enabled: boolean; factorId?: string } | null>(null);
  const [mfaStep, setMfaStep] = useState<"idle" | "enroll">("idle");
  const [mfaQr, setMfaQr] = useState("");
  const [mfaSecret, setMfaSecret] = useState("");
  const [mfaEnrollFactorId, setMfaEnrollFactorId] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaBusy, setMfaBusy] = useState(false);
  const [mfaMsg, setMfaMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth/mfa/status", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMfaStatus({ enabled: Boolean(d.enabled), factorId: d.factorId }))
      .catch(() => setMfaStatus(null));
  }, []);

  const startEnroll = async () => {
    setMfaBusy(true);
    setMfaMsg(null);
    try {
      const res = await fetch("/api/admin/auth/mfa/enroll", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enrollment failed");
      setMfaQr(data.qr_code || "");
      setMfaSecret(data.secret || "");
      setMfaEnrollFactorId(data.factorId);
      setMfaStep("enroll");
    } catch (e: any) {
      setMfaMsg(e?.message || "Could not start enrollment.");
    } finally {
      setMfaBusy(false);
    }
  };

  const activateMfa = async () => {
    setMfaBusy(true);
    setMfaMsg(null);
    try {
      const res = await fetch("/api/admin/auth/mfa/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factorId: mfaEnrollFactorId, code: mfaCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Activation failed");
      setMfaStatus({ enabled: true });
      setMfaStep("idle");
      setMfaCode("");
      setMfaQr("");
      setMfaSecret("");
      setMfaMsg("Two-step verification is now enabled. You'll be asked for a code at your next sign-in.");
    } catch (e: any) {
      setMfaMsg(e?.message || "Could not activate. Check the code.");
    } finally {
      setMfaBusy(false);
    }
  };

  const disableMfa = async () => {
    if (!window.confirm("Disable two-step verification? Your account will then be protected only by your password.")) return;
    setMfaBusy(true);
    setMfaMsg(null);
    try {
      const res = await fetch("/api/admin/auth/mfa/unenroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factorId: mfaStatus?.factorId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not disable MFA");
      setMfaStatus({ enabled: false });
      setMfaMsg("Two-step verification disabled.");
    } catch (e: any) {
      setMfaMsg(e?.message || "Could not disable MFA.");
    } finally {
      setMfaBusy(false);
    }
  };

  // Actor editor state
  const [editingRole, setEditingRole] = useState<RoleRow | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingPerms, setEditingPerms] = useState<RolePermissions>(EMPTY_PERMS);
  const [isSaving, setIsSaving] = useState(false);

  // New actor state
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  // New user state
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("editor");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/roles", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setRoles(data.roles || []);
      setUsers(data.users || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Only accounts with actual administrative roles (or roles defined in the
  // actors list) belong in the Admin Users card. Fans/members are fan-zone accounts.
  const adminUsers = users.filter((u) => {
    const r = (u.role || "").toLowerCase();
    if (r === "fan" || r === "member" || r === "user" || r === "supporter") return false;
    if (ADMIN_ROLE_IDS.includes(r)) return true;
    return roles.some((role) => role.name.toLowerCase() === r);
  });

  const openEditor = (role: RoleRow) => {
    setEditingRole(role);
    setEditingName(role.name);
    setEditingPerms(JSON.parse(JSON.stringify(role.permissions)));
  };

  const closeEditor = () => {
    setEditingRole(null);
    setEditingPerms(EMPTY_PERMS);
  };

  const toggleTab = (tabId: string) => {
    setEditingPerms((prev) => {
      const tabs = prev.tabs || [];
      return {
        ...prev,
        tabs: tabs.includes(tabId) ? tabs.filter((t) => t !== tabId) : [...tabs, tabId],
      };
    });
  };

  const toggleCollectionAction = (collection: string, action: keyof CollectionGrant) => {
    setEditingPerms((prev) => {
      const cols = prev.collections || {};
      const grants: CollectionGrant = cols[collection] || {};
      return {
        ...prev,
        collections: {
          ...cols,
          [collection]: { ...grants, [action]: grants[action] === true ? false : true },
        },
      };
    });
  };

  const toggleFeature = (key: keyof RolePermissions) => {
    setEditingPerms((prev) => ({ ...prev, [key]: prev[key] === true ? false : true }));
  };

  const saveRole = async () => {
    if (!editingRole || !editingName.trim()) return;
    setIsSaving(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/roles/${editingRole.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName.trim(), permissions: editingPerms }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save role");
      setNotice(`Role "${editingName.trim()}" saved.`);
      closeEditor();
      load();
    } catch (e: any) {
      setError(e?.message || "Failed to save role");
    } finally {
      setIsSaving(false);
    }
  };

  const createRole = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), permissions: EMPTY_PERMS }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create role");
      setNewName("");
      setIsCreating(false);
      setNotice(`Actor "${newName.trim()}" created.`);
      load();
    } catch (e: any) {
      setError(e?.message || "Failed to create role");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRole = async (role: RoleRow) => {
    if (role.name === "super_admin") return;
    if (!confirm(`Delete actor "${role.name}"? Users assigned to it will lose admin access.`)) return;
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/roles/${role.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete role");
      setNotice(`Actor "${role.name}" deleted.`);
      load();
    } catch (e: any) {
      setError(e?.message || "Failed to delete role");
    }
  };

  const assignUserRole = async (userId: string, role: string) => {
    setNotice(null);
    try {
      const res = await fetch("/api/admin/roles/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to assign role");
      setNotice("User role updated.");
      load();
    } catch (e: any) {
      setError(e?.message || "Failed to assign role");
    }
  };

  const createUser = async () => {
    if (!newUserEmail.trim() || !newUserPassword) return;
    setIsSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newUserEmail.trim(), password: newUserPassword, role: newUserRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create user");
      setShowNewUser(false);
      setNewUserEmail("");
      setNewUserPassword("");
      setNotice(`Admin user ${newUserEmail.trim()} created.`);
      load();
    } catch (e: any) {
      setError(e?.message || "Failed to create user");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-black/50">Loading roles & permissions…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Dismiss"><X className="w-4 h-4" /></button>
        </div>
      )}
      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── Account Security (MFA) ────────────────────────────── */}
      <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-heading text-xl font-black uppercase text-rich-black flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-zru-green" /> Account Security
          </h2>
          {mfaStatus?.enabled ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
              Two-Step ON
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-black/5 text-black/40 text-[10px] font-black uppercase tracking-wider">
              Not Enabled
            </span>
          )}
        </div>
        <p className="text-xs text-black/50 mb-4">
          Protect your admin account with a time-based one-time password (TOTP) from Google
          Authenticator, Authy, or 1Password.
        </p>

        {mfaMsg && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl px-4 py-3">
            {mfaMsg}
          </div>
        )}

        {mfaStep === "enroll" ? (
          <div className="space-y-4">
            <p className="text-xs text-black/60">
              Scan the QR code with your authenticator app, or enter the secret manually, then enter the 6-digit code to activate.
            </p>
            {mfaQr && (
              <img src={mfaQr} alt="TOTP QR code" className="w-44 h-44 border border-black/10 rounded-xl bg-white" />
            )}
            {mfaSecret && (
              <p className="text-xs text-black/60">
                Secret:{" "}
                <code className="font-mono text-sm font-bold text-rich-black bg-black/5 px-2 py-0.5 rounded break-all">{mfaSecret}</code>
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="6-digit code"
                className="px-3 py-2 rounded-lg border border-black/10 text-sm font-mono tracking-[0.3em] text-center w-40"
              />
              <button
                onClick={activateMfa}
                disabled={mfaBusy || mfaCode.length !== 6}
                className="px-4 py-2 rounded-lg bg-[#006B3F] text-white text-xs font-bold hover:bg-[#005a34] transition-colors disabled:opacity-50"
              >
                {mfaBusy ? "Activating…" : "Activate"}
              </button>
              <button
                onClick={() => { setMfaStep("idle"); setMfaQr(""); setMfaSecret(""); setMfaCode(""); }}
                className="px-3 py-2 rounded-lg bg-black/5 text-black/60 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : mfaStatus?.enabled ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-emerald-700 font-bold">
              This account is protected by two-step verification.
            </p>
            <button
              onClick={disableMfa}
              disabled={mfaBusy}
              className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {mfaBusy ? "Disabling…" : "Disable MFA"}
            </button>
          </div>
        ) : (
          <button
            onClick={startEnroll}
            disabled={mfaBusy}
            className="px-4 py-2 rounded-lg bg-[#006B3F] text-white text-xs font-bold hover:bg-[#005a34] transition-colors disabled:opacity-50"
          >
            {mfaBusy ? "Preparing…" : "Enable Two-Step Verification"}
          </button>
        )}
      </div>

      {/* ── Actors ─────────────────────────────────────────────── */}
      <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-black uppercase text-rich-black flex items-center gap-2">
            <Shield className="w-5 h-5 text-zru-green" /> Actors (Roles &amp; Permissions)
          </h2>
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#006B3F] text-white text-xs font-bold hover:bg-[#005a34] transition-colors"
            >
              <Plus className="w-4 h-4" /> New Actor
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. match_admin"
                className="px-3 py-2 rounded-lg border border-black/10 text-sm font-mono"
              />
              <button onClick={createRole} disabled={isSaving}
                className="px-3 py-2 rounded-lg bg-zru-green text-white text-xs font-bold disabled:opacity-50">Create</button>
              <button onClick={() => setIsCreating(false)}
                className="px-3 py-2 rounded-lg bg-black/5 text-black/60 text-xs font-bold"><X className="w-4 h-4" /></button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {roles.map((role) => (
            <div key={role.id} className="border border-black/10 rounded-xl p-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-rich-black font-mono text-sm">{role.name}</p>
                <p className="text-[11px] text-black/50 mt-1">
                  {role.permissions?.all
                    ? "Full access (super admin)"
                    : `${(role.permissions?.tabs || []).length} tabs, ${Object.keys(role.permissions?.collections || {}).length} collections`}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEditor(role)} aria-label="Edit role"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/5 hover:bg-black/10 text-black/60 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                {role.name !== "super_admin" && (
                  <button onClick={() => deleteRole(role)} aria-label="Delete role"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Users ──────────────────────────────────────────────── */}
      <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-heading text-xl font-black uppercase text-rich-black flex items-center gap-2">
              <Users className="w-5 h-5 text-zru-green" /> Admin Users
            </h2>
            <p className="text-xs text-black/50 mt-0.5">
              Showing {adminUsers.length} active admin staff (fans managed in Fan Zone).
            </p>
          </div>
          {!showNewUser ? (
            <button
              onClick={() => setShowNewUser(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#006B3F] text-white text-xs font-bold hover:bg-[#005a34] transition-colors self-start sm:self-auto cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> New Admin User
            </button>
          ) : (
            <button onClick={() => setShowNewUser(false)} className="flex items-center gap-1 px-2 py-2 rounded-lg bg-black/5 text-black/60 text-xs font-bold cursor-pointer">
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>

        {showNewUser && (
          <div className="mb-4 border border-black/10 rounded-xl p-4 space-y-3 bg-black/[0.02]">
            <div className="grid sm:grid-cols-3 gap-3">
              <input value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="email@zimrugby.co.zw" className="px-3 py-2 rounded-lg border border-black/10 text-sm" />
              <input value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="Temporary password" type="password" className="px-3 py-2 rounded-lg border border-black/10 text-sm" />
              <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="px-3 py-2 rounded-lg border border-black/10 text-sm">
                {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
            </div>
            <button onClick={createUser} disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-zru-green text-white text-xs font-bold disabled:opacity-50 flex items-center gap-2 cursor-pointer">
              <KeyRound className="w-4 h-4" /> Create &amp; Confirm Email
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/10 text-xs font-black uppercase text-black/50">
                <th className="py-2">Email</th>
                <th className="py-2">Actor Role</th>
                <th className="py-2">Last Sign In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-sm">
              {adminUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 font-bold text-rich-black">{user.email}</td>
                    <td className="py-3">
                      <select
                        value={user.role || ""}
                        onChange={(e) => assignUserRole(user.id, e.target.value)}
                        className="px-2 py-1.5 rounded-lg border border-black/10 text-xs font-mono bg-white"
                      >
                        <option value="">— no access —</option>
                        {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                      </select>
                    </td>
                    <td className="py-3 text-black/50 text-xs">
                      {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : "Never"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Actor editor modal ─────────────────────────────────── */}
      {editingRole && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeEditor}>
          <div className="bg-white border border-black/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-4 sticky top-0 bg-white z-10">
              <h2 className="font-heading text-lg font-black uppercase text-rich-black flex items-center gap-2">
                <Pencil className="w-5 h-5 text-zru-green" /> Edit Actor
              </h2>
              <button onClick={closeEditor} className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/5 hover:bg-black/10 text-black/60 transition-colors" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-black/60 mb-1">Actor Name</label>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm font-mono"
                  disabled={editingRole.name === "super_admin"}
                />
              </div>

              {editingPerms.all ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">
                  super_admin has full access to everything. Permission toggles are not needed.
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-black/60 mb-2">Visible Tabs</label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {TAB_OPTIONS.map((tab) => (
                        <label key={tab.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(editingPerms.tabs || []).includes(tab.id)}
                            onChange={() => toggleTab(tab.id)}
                            className="accent-[#006B3F]"
                          />
                          {tab.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-black/60 mb-2">Collection Access</label>
                    <div className="overflow-x-auto border border-black/10 rounded-xl">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-black/[0.03] text-[10px] font-black uppercase text-black/50">
                            <th className="py-2 px-3">Collection</th>
                            {["create", "read", "update", "delete"].map((a) => (
                              <th key={a} className="py-2 px-2 text-center">{a}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 text-xs">
                          {COLLECTIONS.map((c) => (
                            <tr key={c}>
                              <td className="py-2 px-3 font-mono font-bold text-rich-black">{c}</td>
                              {["create", "read", "update", "delete"].map((a) => (
                                <td key={a} className="py-2 px-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={editingPerms.collections?.[c]?.[a as keyof CollectionGrant] === true}
                                    onChange={() => toggleCollectionAction(c, a as keyof CollectionGrant)}
                                    className="accent-[#006B3F]"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-black/60 mb-2">Advanced Features</label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {FEATURES.map((f) => (
                        <label key={f.key} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingPerms[f.key] === true}
                            onChange={() => toggleFeature(f.key)}
                            className="accent-[#006B3F]"
                          />
                          {f.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-black/10 px-6 py-4">
              <button onClick={closeEditor} className="px-4 py-2 rounded-lg bg-black/5 text-black/60 text-xs font-bold">
                Cancel
              </button>
              <button onClick={saveRole} disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#006B3F] text-white text-xs font-bold hover:bg-[#005a34] transition-colors disabled:opacity-50">
                <Save className="w-4 h-4" /> {isSaving ? "Saving…" : "Save Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
