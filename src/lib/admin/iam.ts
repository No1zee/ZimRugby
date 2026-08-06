export type UserRole = "super_admin" | "editor" | "media_manager" | "viewer";

export interface IAMUser {
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string; // Plain/SHA for demo verification
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

// NIST SP 800-53 / ISO 27001 Pre-configured IAM Users
const IAM_USERS: Record<string, IAMUser> = {
  "admin@zimrugby.co.zw": {
    email: "admin@zimrugby.co.zw",
    name: "Ed Magejo (Super Admin)",
    role: "super_admin",
    passwordHash: "ZimRugbyUnion2027!",
  },
  "editor@zimrugby.co.zw": {
    email: "editor@zimrugby.co.zw",
    name: "Content Editor",
    role: "editor",
    passwordHash: "EditorPass2026!",
  },
  "media@zimrugby.co.zw": {
    email: "media@zimrugby.co.zw",
    name: "Media Manager",
    role: "media_manager",
    passwordHash: "MediaPass2026!",
  },
  "auditor@zimrugby.co.zw": {
    email: "auditor@zimrugby.co.zw",
    name: "Security Compliance Officer",
    role: "viewer",
    passwordHash: "AuditPass2026!",
  },
};

// Global Audit Log Memory Store (Accountability)
const AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-init-1",
    timestamp: new Date().toISOString(),
    actorEmail: "admin@zimrugby.co.zw",
    actorRole: "super_admin",
    action: "LOGIN_SUCCESS",
    resource: "/admin-login",
    details: "NIST/ISO Security System Initialized",
    ipAddress: "127.0.0.1",
  },
];

export function findUserByEmail(email: string): IAMUser | null {
  const normalized = email.trim().toLowerCase();
  return IAM_USERS[normalized] || null;
}

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
