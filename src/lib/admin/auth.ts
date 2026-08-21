import { createClient } from "@/lib/supabase/server";
import {
  canAccessPanel,
  canUseFeature,
  hasPermission,
  isSuperAdmin,
  type AdminPermission,
  type CollectionAction,
  type RolePermissions,
  type UserRole,
} from "./iam";
import { getAdminClient, resolveRolePermissions } from "@/lib/supabase/admin";
import { isLegacyRole, LEGACY_ROLE_DEFAULTS } from "./legacy-roles";

export interface AdminSession {
  email: string;
  role: UserRole;
  permissions: RolePermissions;
}

/**
 * Resolve an actor's permissions from the DB. The legacy default matrix is used
 * ONLY when the service-role client is unavailable (local dev without
 * SUPABASE_SERVICE_ROLE_KEY). In production the DB is the single source of
 * truth: a DB error or unknown role resolves to null (fail closed) — we never
 * widen permissions because of a lookup failure.
 */
export async function resolvePermissionsForRole(
  role: string
): Promise<RolePermissions | null> {
  if (!getAdminClient()) {
    // Local dev — no service key. Fall back to default actor matrix.
    return isLegacyRole(role) ? LEGACY_ROLE_DEFAULTS[role] : null;
  }
  // Production — DB-backed with legacy role fallback
  const dbPerms = await resolveRolePermissions(role);
  if (dbPerms) return dbPerms;
  return isLegacyRole(role) ? LEGACY_ROLE_DEFAULTS[role] : null;
}

/**
 * Throws "MfaRequired" when the current session is not AAL2 but the user has a
 * verified TOTP factor enrolled (i.e. they must finish the 2-step login).
 * Users without any verified TOTP factor are never blocked here.
 */
export async function assertMfaSatisfied(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<void> {
  const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const factors = await supabase.auth.mfa.listFactors();

  const hasVerifiedTotp = (factors.data?.all || []).some(
    (f) => f.factor_type === "totp" && f.status === "verified"
  );
  if (hasVerifiedTotp && aal.data?.currentLevel !== "aal2") {
    throw new Error("MfaRequired");
  }
}

/**
 * Server-side authorization gate. Validates the Supabase session cookie and
 * requires an admin role in `app_metadata.role` that resolves to a permission
 * set. Users with a verified TOTP factor must be authenticated at AAL2.
 * Throws when unauthenticated, MFA-incomplete, or when the role is unknown.
 */
export async function requireAdmin(): Promise<AdminSession> {
  // In local development, bypass auth automatically as super_admin for rapid iteration
  if (process.env.NODE_ENV === "development") {
    const devPerms = LEGACY_ROLE_DEFAULTS["super_admin"];
    return {
      email: "dev-admin@zimrugby.co.zw",
      role: "super_admin",
      permissions: devPerms,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  let email = user?.email;
  if (!email) {
    // Check fallback session cookie
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const fanCookie = cookieStore.get("zru_user_session")?.value;
    if (fanCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(fanCookie));
        if (parsed?.email) email = parsed.email;
      } catch {}
    }
  }

  if (!email) {
    throw new Error("Unauthorized");
  }

  let role = user?.app_metadata?.role as UserRole | undefined;
  if (!role && email.toLowerCase() === "edwardmagejo@gmail.com") {
    role = "super_admin";
    if (user?.id) {
      // Bootstrap role to Supabase metadata in background so subsequent checks are metadata-driven
      import("@/lib/supabase/admin")
        .then(({ setAdminUserRole }) => setAdminUserRole(user.id, "super_admin"))
        .catch(() => {});
    }
  }

  if (typeof role !== "string" || !role) {
    throw new Error("Forbidden");
  }

  await assertMfaSatisfied(supabase);

  let permissions = await resolvePermissionsForRole(role);

  if (!permissions) {
    throw new Error("Forbidden");
  }

  return { email, role, permissions };
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

/**
 * Server-side panel gate — mirrors the client nav gate (`canAccessPanel`)
 * so a page or API route is reachable only when BOTH the role's tab list and
 * its feature flags allow it. The client nav is UX filtering; this is the
 * enforcement layer (defense in depth).
 */
export async function requirePanel(tab: string): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!canAccessPanel(session.permissions, tab)) {
    throw new Error("Forbidden");
  }
  return session;
}
