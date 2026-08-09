export type UserRole = "super_admin" | "editor" | "media_manager" | "viewer";

export interface IAMUser {
  email: string;
  name: string;
  role: UserRole;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: UserRole;
  action: "LOGIN_SUCCESS" | "LOGIN_FAILED" | "LOGOUT" | "PAGE_UPDATE" | "PAGE_PUBLISH" | "MEDIA_UPLOAD" | "SECTION_REORDER";
  resource: string;
  details?: string;
  ipAddress?: string;
}

/**
 * IAM users are configured exclusively through environment variables —
 * no credentials are stored in source code.
 *
 *   ADMIN_PASSWORD   -> admin@zimrugby.co.zw (super_admin)
 *   EDITOR_PASSWORD  -> editor@zimrugby.co.zw (editor)
 *   MEDIA_PASSWORD   -> media@zimrugby.co.zw (media_manager)
 *   AUDITOR_PASSWORD -> auditor@zimrugby.co.zw (viewer)
 *
 * A role is only available when its password env var is set (fail closed).
 */
const ROLE_BY_ENV: Array<{ envVar: string; user: IAMUser }> = [
  {
    envVar: "ADMIN_PASSWORD",
    user: { email: "admin@zimrugby.co.zw", name: "Super Admin", role: "super_admin" },
  },
  {
    envVar: "EDITOR_PASSWORD",
    user: { email: "editor@zimrugby.co.zw", name: "Content Editor", role: "editor" },
  },
  {
    envVar: "MEDIA_PASSWORD",
    user: { email: "media@zimrugby.co.zw", name: "Media Manager", role: "media_manager" },
  },
  {
    envVar: "AUDITOR_PASSWORD",
    user: { email: "auditor@zimrugby.co.zw", name: "Security Compliance Officer", role: "viewer" },
  },
];

function passwordFor(email: string): string | undefined {
  const normalized = email.trim().toLowerCase();
  const entry = ROLE_BY_ENV.find((e) => e.user.email === normalized);
  return entry ? process.env[entry.envVar] : undefined;
}

export function findUserByEmail(email: string): IAMUser | null {
  const normalized = email.trim().toLowerCase();
  const entry = ROLE_BY_ENV.find((e) => e.user.email === normalized);
  if (!entry) return null;
  // Only expose the user if their password is configured.
  return process.env[entry.envVar] ? entry.user : null;
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  let diff = 0;
  for (let i = 0; i < aBuf.length; i++) {
    diff |= aBuf[i] ^ bBuf[i];
  }
  return diff === 0;
}

export function validateCredentials(email: string, password: string): IAMUser | null {
  const user = findUserByEmail(email);
  if (!user) return null;

  const expected = passwordFor(user.email);
  if (!expected) return null;
  if (typeof password !== "string" || password.length === 0) return null;

  return timingSafeEqual(password, expected) ? user : null;
}

// Global Audit Log Memory Store (Accountability)
const AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-init-1",
    timestamp: new Date().toISOString(),
    actorEmail: "admin@zimrugby.co.zw",
    actorRole: "super_admin",
    action: "LOGIN_SUCCESS",
    resource: "/admin-login",
    details: "Security System Initialized",
    ipAddress: "127.0.0.1",
  },
];

export function logAuditEvent(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  AUDIT_LOGS.unshift(newEntry);
  if (AUDIT_LOGS.length > 500) {
    AUDIT_LOGS.pop();
  }
  return newEntry;
}

export function getAuditLogs(limit: number = 50): AuditLogEntry[] {
  return AUDIT_LOGS.slice(0, limit);
}

// Role Permission Checker (Authorization / AuthZ - NIST AC-3)
export function hasPermission(role: UserRole, requiredPermission: "EDIT" | "PUBLISH" | "DELETE" | "MEDIA" | "AUDIT"): boolean {
  switch (role) {
    case "super_admin":
      return true;
    case "editor":
      return requiredPermission === "EDIT" || requiredPermission === "PUBLISH" || requiredPermission === "MEDIA";
    case "media_manager":
      return requiredPermission === "MEDIA";
    case "viewer":
      return requiredPermission === "AUDIT";
    default:
      return false;
  }
}
