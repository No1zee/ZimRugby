import type { RolePermissions } from "./iam";

/**
 * Legacy default actors — mirrors the seeded `admin_roles` rows from
 * supabase/migrations/20260810100000_create_admin_roles.sql.
 *
 * Used ONLY as a fallback when the Supabase service-role client is unavailable
 * (e.g. local dev without SUPABASE_SERVICE_ROLE_KEY). In production the DB is
 * always authoritative.
 */
export const LEGACY_ROLE_DEFAULTS: Record<string, RolePermissions> = {
  super_admin: { all: true },
  editor: {
    tabs: ["overview", "media", "fixtures"],
    collections: {
      news: { create: true, read: true, update: true },
      matches: { create: true, read: true, update: true },
      matches_results: { create: false, read: true, update: true },
    },
    pages_builder: false,
    ai_assistant: false,
    media_upload: true,
    fanzone_pii: false,
  },
  media_manager: {
    tabs: ["overview", "media"],
    collections: {
      news: { create: true, read: true, update: true, delete: false },
    },
    pages_builder: false,
    ai_assistant: false,
    media_upload: true,
    fanzone_pii: false,
  },
  viewer: {
    tabs: ["overview", "fanzone", "onboarding"],
    collections: {},
    pages_builder: false,
    ai_assistant: false,
    media_upload: false,
    fanzone_pii: true,
  },
};

export function isLegacyRole(role: string): boolean {
  return role in LEGACY_ROLE_DEFAULTS;
}
