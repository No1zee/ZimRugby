export type UserRole = string;

export interface CollectionGrant {
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
}

/**
 * Data-driven actor permissions (stored in Supabase `admin_roles.permissions`).
 * `all: true` = full access (super_admin). Everything else is additive and
 * enforced server-side against this object.
 */
export interface RolePermissions {
  all?: boolean;
  tabs?: string[];
  collections?: Record<string, CollectionGrant>;
  pages_builder?: boolean;
  ai_assistant?: boolean;
  media_upload?: boolean;
  fanzone_pii?: boolean;
}

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
  action: "LOGIN_SUCCESS" | "LOGIN_FAILED" | "LOGOUT" | "PAGE_UPDATE" | "PAGE_PUBLISH" | "MEDIA_UPLOAD" | "SECTION_REORDER" | "ROLE_UPDATE" | "USER_INVITE";
  resource: string;
  details?: string;
  ipAddress?: string;
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
      return role
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
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
// Operates on the resolved RolePermissions object — pure, client-safe.
export type AdminPermission = "EDIT" | "PUBLISH" | "DELETE" | "MEDIA" | "AUDIT";

export function hasPermission(
  perms: RolePermissions | null | undefined,
  requiredPermission: AdminPermission
): boolean {
  if (!perms) return false;
  if (perms.all) return true;
  switch (requiredPermission) {
    case "EDIT":
    case "PUBLISH":
      return (
        perms.pages_builder === true ||
        Object.values(perms.collections || {}).some(
          (c) => c.create === true || c.update === true
        )
      );
    case "DELETE":
      return Object.values(perms.collections || {}).some((c) => c.delete === true);
    case "MEDIA":
      return perms.media_upload === true;
    case "AUDIT":
      return perms.fanzone_pii === true;
    default:
      return false;
  }
}

// Per-collection grant checks (MM-4: canEditCollection, canCreateCollection, ...)
export type CollectionAction = "create" | "read" | "update" | "delete";

export function canOnCollection(
  perms: RolePermissions | null | undefined,
  collection: string,
  action: CollectionAction
): boolean {
  if (!perms) return false;
  if (perms.all) return true;
  return perms.collections?.[collection]?.[action] === true;
}

export function canEditCollection(perms: RolePermissions | null | undefined, collection: string): boolean {
  return canOnCollection(perms, collection, "update");
}

export function canCreateCollection(perms: RolePermissions | null | undefined, collection: string): boolean {
  return canOnCollection(perms, collection, "create");
}

// Feature-flag gate for the advanced surfaces (Pages builder / AI assistant)
export function canUseFeature(
  perms: RolePermissions | null | undefined,
  feature: "pages_builder" | "ai_assistant" | "media_upload" | "fanzone_pii"
): boolean {
  if (!perms) return false;
  if (perms.all) return true;
  return perms[feature] === true;
}

// Admin tab -> visible iff the resolved permissions list it (or full access).
export type AdminTabId =
  | "overview"
  | "directus_ai"
  | "pages"
  | "events"
  | "media"
  | "grassroots"
  | "faq-footer"
  | "fixtures"
  | "teams"
  | "campaigns"
  | "fanzone"
  | "onboarding"
  | "roles";

export function canAccessTab(
  perms: RolePermissions | null | undefined,
  tab: string
): boolean {
  if (!perms) return false;
  if (perms.all) return true;
  return Array.isArray(perms.tabs) && perms.tabs.includes(tab);
}

export function isSuperAdmin(perms: RolePermissions | null | undefined): boolean {
  return perms?.all === true;
}
