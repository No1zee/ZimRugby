import { createClient } from "@/lib/supabase/server";
import {
  canUseFeature,
  hasPermission,
  isSuperAdmin,
  type AdminPermission,
  type CollectionAction,
  type RolePermissions,
  type UserRole,
} from "./iam";
import { resolveRolePermissions } from "@/lib/supabase/admin";
import { isLegacyRole, LEGACY_ROLE_DEFAULTS } from "./legacy-roles";

export interface AdminSession {
  email: string;
  role: UserRole;
  permissions: RolePermissions;
}

/**
 * Resolve an actor's permissions from the DB. Falls back to the legacy default
 * matrix ONLY when the Supabase service-role client is unavailable (local dev
 * without SUPABASE_SERVICE_ROLE_KEY). Unknown/missing roles always resolve to
 * null (fail closed).
 */
async function resolvePermissions(role: UserRole): Promise<RolePermissions | null> {
  const dbPerms = await resolveRolePermissions(role);
  if (dbPerms) return dbPerms;
  if (isLegacyRole(role)) return LEGACY_ROLE_DEFAULTS[role];
  return null;
}

/**
 * Server-side authorization gate. Validates the Supabase session cookie and
 * requires an admin role in `app_metadata.role` that resolves to a permission
 * set. Throws when unauthenticated or when the role is unknown.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    throw new Error("Unauthorized");
  }

  const role = user.app_metadata?.role as UserRole | undefined;
  if (typeof role !== "string" || !role) {
    throw new Error("Forbidden");
  }

  const permissions = await resolvePermissions(role);
  if (!permissions) {
    throw new Error("Forbidden");
  }

  return { email: user.email, role, permissions };
}

/**
 * Server-side authorization gate for role-scoped actions. Requires an admin
 * session AND the given permission. Throws "Forbidden" when the actor lacks it.
 */
export async function requirePermission(permission: AdminPermission): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!hasPermission(session.permissions, permission)) {
    throw new Error("Forbidden");
  }
  return session;
}

/**
 * Server-side gate for super_admin-only areas (Roles & Permissions, user
 * management, role assignment). Throws "Forbidden" for anyone without full
 * (all:true) permission set.
 */
export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!isSuperAdmin(session.permissions)) {
    throw new Error("Forbidden");
  }
  return session;
}

/**
 * Server-side gate for collection-level grant (e.g. can this actor update
 * `news`?). Throws "Forbidden" when the actor has no grant for the collection.
 */
export async function requireCollectionAction(
  collection: string,
  action: CollectionAction
): Promise<AdminSession> {
  const session = await requireAdmin();
  const granted =
    isSuperAdmin(session.permissions) ||
    session.permissions.collections?.[collection]?.[action] === true;
  if (!granted) {
    throw new Error("Forbidden");
  }
  return session;
}

/**
 * Server-side gate for an advanced feature flag (pages_builder / ai_assistant
 * / media_upload / fanzone_pii).
 */
export async function requireFeature(
  feature: "pages_builder" | "ai_assistant" | "media_upload" | "fanzone_pii"
): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!canUseFeature(session.permissions, feature)) {
    throw new Error("Forbidden");
  }
  return session;
}
