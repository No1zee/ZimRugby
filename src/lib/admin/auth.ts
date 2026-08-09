import { createClient } from "@/lib/supabase/server";
import { hasPermission, isAdminRole, type UserRole } from "./iam";

export interface AdminSession {
  email: string;
  role: UserRole;
}

export type AdminPermission = "EDIT" | "PUBLISH" | "DELETE" | "MEDIA" | "AUDIT";

/**
 * Server-side authorization gate. Validates the Supabase session cookie and
 * requires an admin role in `app_metadata.role`. Throws when unauthenticated
 * or when the signed-in Supabase user has no admin role.
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

  const role = user.app_metadata?.role;
  if (!isAdminRole(role)) {
    throw new Error("Forbidden");
  }

  return { email: user.email, role };
}

/**
 * Server-side authorization gate for role-scoped actions. Requires an admin
 * session AND the given permission. Throws "Forbidden" when the admin role
 * lacks the permission.
 */
export async function requirePermission(permission: AdminPermission): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!hasPermission(session.role, permission)) {
    throw new Error("Forbidden");
  }
  return session;
}
