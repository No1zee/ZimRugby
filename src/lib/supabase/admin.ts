import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { RolePermissions } from "@/lib/admin/iam";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getAdminClient() {
  if (!url || !serviceKey) return null;
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface AdminFanMember {
  id: number;
  name: string;
  email: string;
  favorite_team?: string;
  vip_code?: string;
  cdpa_consent: boolean;
  registered_at?: string;
}

export interface AdminOnboardingSubmission {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  organization?: string;
  submitted_at?: string;
}

// Read-only admin views. Returns [] when SUPABASE_SERVICE_ROLE_KEY is not
// configured (anonymous reads are blocked by RLS).
export async function listFanZoneMembers(limit = 100): Promise<AdminFanMember[]> {
  const client = getAdminClient();
  if (!client) return [];

  try {
    const { data } = await client
      .from("fan_zone_members")
      .select("id, name, email, favorite_team, vip_code, cdpa_consent, registered_at")
      .order("registered_at", { ascending: false })
      .limit(limit);

    return (data || []) as AdminFanMember[];
  } catch {
    return [];
  }
}

export async function listOnboardingSubmissions(limit = 100): Promise<AdminOnboardingSubmission[]> {
  const client = getAdminClient();
  if (!client) return [];

  try {
    const { data } = await client
      .from("onboarding_submissions")
      .select("*")
      .order("submittedAt", { ascending: false })
      .order("submitted_at", { ascending: false })
      .limit(limit);

    const rows = (data || []) as Record<string, unknown>[];
    return rows.map((r) => ({
      id: Number(r.id ?? 0),
      full_name: String(r.full_name ?? r.fullName ?? ""),
      email: String(r.email ?? ""),
      phone: r.phone !== undefined && r.phone !== null ? String(r.phone) : undefined,
      role: String(r.role ?? ""),
      organization:
        r.organization !== undefined && r.organization !== null ? String(r.organization) : undefined,
      submitted_at: String(r.submitted_at ?? r.submittedAt ?? r.timestamp ?? ""),
    }));
  } catch {
    return [];
  }
}

export interface AdminRoleRow {
  id: string;
  name: string;
  permissions: RolePermissions;
  created_at?: string;
}

// ---- admin_roles CRUD (data-driven actors) ----

export async function listAdminRoles(): Promise<AdminRoleRow[]> {
  const client = getAdminClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("admin_roles")
      .select("id, name, permissions, created_at")
      .order("name", { ascending: true });
    if (error) return [];
    
    // Auto-seed default role rows into DB if table is empty
    if (!data || data.length === 0) {
      const { LEGACY_ROLE_DEFAULTS } = await import("@/lib/admin/legacy-roles");
      const defaultRoles = Object.entries(LEGACY_ROLE_DEFAULTS).map(([name, permissions]) => ({
        name,
        permissions,
      }));
      const seeded = await client
        .from("admin_roles")
        .insert(defaultRoles)
        .select("id, name, permissions, created_at");
      if (seeded.data) return seeded.data as AdminRoleRow[];
    }

    return (data || []) as AdminRoleRow[];
  } catch {
    return [];
  }
}

export async function getAdminRole(name: string): Promise<AdminRoleRow | null> {
  const client = getAdminClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("admin_roles")
      .select("id, name, permissions, created_at")
      .eq("name", name)
      .maybeSingle();
    if (error || !data) return null;
    return data as AdminRoleRow;
  } catch {
    return null;
  }
}

export async function createAdminRole(name: string, permissions: RolePermissions): Promise<AdminRoleRow | null> {
  const client = getAdminClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("admin_roles")
      .insert({ name, permissions })
      .select("id, name, permissions, created_at")
      .single();
    if (error) return null;
    return data as AdminRoleRow;
  } catch {
    return null;
  }
}

export async function updateAdminRole(
  id: string,
  patch: { name?: string; permissions?: RolePermissions }
): Promise<AdminRoleRow | null> {
  const client = getAdminClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("admin_roles")
      .update(patch)
      .eq("id", id)
      .select("id, name, permissions, created_at")
      .single();
    if (error) return null;
    return data as AdminRoleRow;
  } catch {
    return null;
  }
}

export async function deleteAdminRole(id: string): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  try {
    const { error } = await client.from("admin_roles").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

// ---- Supabase Auth user management (Roles & Permissions screen) ----

export interface AdminUserRecord {
  id: string;
  email: string;
  role?: string;
  createdAt?: string;
  lastSignInAt?: string;
}

export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  const client = getAdminClient();
  if (!client) return [];

  try {
    const { data, error } = await client.auth.admin.listUsers();
    if (error) return [];

    return (data?.users || []).map((u) => ({
      id: u.id,
      email: u.email ?? "",
      role: (u.app_metadata?.role as string) || undefined,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at || undefined,
    }));
  } catch {
    return [];
  }
}

export async function createAdminUser(
  email: string,
  password: string,
  role: string
): Promise<AdminUserRecord | null> {
  const client = getAdminClient();
  if (!client) return null;

  try {
    const { data, error } = await client.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role },
    });
    if (error) return null;
    const u = data.user;
    return { id: u.id, email: u.email ?? "", role: (u.app_metadata?.role as string) || role };
  } catch {
    return null;
  }
}

export async function setAdminUserRole(userId: string, role: string): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  try {
    const { error } = await client.auth.admin.updateUserById(userId, {
      app_metadata: { role },
    });
    return !error;
  } catch {
    return false;
  }
}

// ---- role -> permissions resolution (server-only, cached briefly) ----

const roleCache = new Map<string, { perms: RolePermissions | null; at: number }>();
const CACHE_TTL_MS = 30_000;

export async function resolveRolePermissions(role: string): Promise<RolePermissions | null> {
  const cached = roleCache.get(role);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.perms;
  }

  const client = getAdminClient();
  if (!client) return null;

  let perms: RolePermissions | null = null;
  try {
    const { data, error } = await client
      .from("admin_roles")
      .select("permissions")
      .eq("name", role)
      .maybeSingle();
    if (!error && data) perms = (data.permissions as RolePermissions) || null;
  } catch {
    perms = null;
  }

  roleCache.set(role, { perms, at: Date.now() });
  return perms;
}

export function clearRoleCache(role?: string) {
  if (role) {
    roleCache.delete(role);
  } else {
    roleCache.clear();
  }
}

export async function persistAuditEvent(entry: {
  actorEmail: string;
  actorRole: string;
  action: string;
  resource: string;
  details?: string;
  ipAddress?: string;
}): Promise<boolean> {
  // Audit trail is backed by the Directus `audit_log` collection (Phase 1 WS2):
  // the Supabase audit_logs migration is not present on the live project, while
  // Directus schema is fully controllable from this app. Same signatures kept.
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const token = process.env.DIRECTUS_TOKEN;
  if (!baseUrl || !token) return false;

  try {
    const res = await fetch(`${baseUrl}/items/audit_log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        actor_email: entry.actorEmail,
        actor_role: entry.actorRole,
        action: entry.action,
        resource: entry.resource,
        details: entry.details,
        ip_address: entry.ipAddress,
        created_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      console.error(`[persistAuditEvent] audit write failed (${res.status}): ${await res.text()}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[persistAuditEvent] unexpected error:", e);
    return false;
  }
}

export async function fetchAuditLogs(limit = 100): Promise<any[]> {
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const token = process.env.DIRECTUS_TOKEN;
  if (!baseUrl || !token) return [];

  try {
    const filter = JSON.stringify({ deleted_at: { _null: true } });
    const res = await fetch(`${baseUrl}/items/audit_log?sort=-created_at&limit=${limit}&fields=*&filter=${encodeURIComponent(filter)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return ((json.data || []) as any[]).map((d: any) => ({
      id: d.id,
      timestamp: d.created_at ?? d.date_created,
      actorEmail: d.actor_email,
      actorRole: d.actor_role,
      action: d.action,
      resource: d.resource,
      details: d.details,
      ipAddress: d.ip_address,
    }));
  } catch {
    return [];
  }
}
