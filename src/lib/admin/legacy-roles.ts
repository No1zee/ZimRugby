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
    tabs: ["overview", "directus_ai", "pages", "media", "grassroots", "faq-footer", "fixtures", "campaigns"],
    collections: {
      news: { create: true, read: true, update: true, delete: true },
      announcements: { create: true, read: true, update: true, delete: true },
      matches: { create: true, read: true, update: true, delete: true },
      fixtures: { create: true, read: true, update: true, delete: true },
      campaigns: { create: true, read: true, update: true, delete: true },
      pages: { create: true, read: true, update: true, delete: true },
      page_sections: { create: true, read: true, update: true, delete: true },
      grassroots_initiatives: { create: true, read: true, update: true, delete: true },
      programmes: { create: true, read: true, update: true, delete: true },
      faqs: { create: true, read: true, update: true, delete: true },
      footer_navigation: { create: true, read: true, update: true, delete: true },
    },
    pages_builder: true,
    ai_assistant: true,
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
