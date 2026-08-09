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
 * Roles are assigned in Supabase Auth (`app_metadata.role`) — no credentials
 * are stored in source code.
 *
 *   admin@zimrugby.co.zw   -> super_admin
 *   editor@zimrugby.co.zw  -> editor
 *   media@zimrugby.co.zw   -> media_manager
 *   auditor@zimrugby.co.zw -> viewer
 *
 * A role is only honored if it exists in the allowlist (fail closed).
 */
const ALLOWED_ROLES: UserRole[] = ["super_admin", "editor", "media_manager", "viewer"];

export function isAdminRole(role: unknown): role is UserRole {
  return typeof role === "string" && (ALLOWED_ROLES as string[]).includes(role);
}

export function roleToName(role: UserRole): string {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "editor":
      return "Content Editor";
    case "media_manager":
      return "Media Manager";
    case "viewer":
      return "Security Compliance Officer";
    default:
      return "Administrator";
  }
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
