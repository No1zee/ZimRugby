-- admin_roles: data-driven admin actors (ZRU Simple Mode §8/§8b)
-- Each row = one actor (role). super_admin has full access; every other
-- actor's capabilities live in `permissions` as JSONB and are enforced
-- server-side by the Next.js admin (hasPermission / canAccessTab).

create table public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_roles enable row level security;

-- Anon/authenticated have no read access via the client SDK (permissions are
-- resolved server-side). Only service_role can read/write.
create policy "admin_roles_service_role_all"
  on public.admin_roles
  for all
  to service_role
  using (true)
  with check (true);

-- Seed the four legacy actors so existing Supabase users keep working.
-- super_admin short-circuits as full access; the others mirror their current
-- hasPermission()/TAB_PERMISSIONS grants from src/lib/admin/iam.ts.

insert into public.admin_roles (name, permissions) values
  (
    'super_admin',
    '{"all": true}'::jsonb
  ),
  (
    'editor',
    '{
      "tabs": ["overview", "directus_ai", "pages", "media", "grassroots", "faq-footer", "fixtures", "campaigns"],
      "collections": {
        "news":             {"create": true,  "read": true,  "update": true,  "delete": true},
        "announcements":    {"create": true,  "read": true,  "update": true,  "delete": true},
        "matches":          {"create": true,  "read": true,  "update": true,  "delete": true},
        "fixtures":         {"create": true,  "read": true,  "update": true,  "delete": true},
        "campaigns":        {"create": true,  "read": true,  "update": true,  "delete": true},
        "pages":            {"create": true,  "read": true,  "update": true,  "delete": true},
        "page_sections":    {"create": true,  "read": true,  "update": true,  "delete": true},
        "grassroots_initiatives": {"create": true,  "read": true,  "update": true,  "delete": true},
        "programmes":       {"create": true,  "read": true,  "update": true,  "delete": true},
        "faqs":             {"create": true,  "read": true,  "update": true,  "delete": true},
        "footer_navigation":{"create": true,  "read": true,  "update": true,  "delete": true}
      },
      "pages_builder": true,
      "ai_assistant": true,
      "media_upload": true,
      "fanzone_pii": false
    }'::jsonb
  ),
  (
    'media_manager',
    '{
      "tabs": ["overview", "media"],
      "collections": {
        "news": {"create": true, "read": true, "update": true, "delete": false}
      },
      "pages_builder": false,
      "ai_assistant": false,
      "media_upload": true,
      "fanzone_pii": false
    }'::jsonb
  ),
  (
    'viewer',
    '{
      "tabs": ["overview", "fanzone", "onboarding"],
      "collections": {},
      "pages_builder": false,
      "ai_assistant": false,
      "media_upload": false,
      "fanzone_pii": true
    }'::jsonb
  );
