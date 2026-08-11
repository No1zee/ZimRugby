-- Grant the editor actor the Teams & Squads tab (spec: teams, opponents,
-- competitions, venues CRUD — no deletes, consistent with least privilege).
-- The DB is authoritative in production; apply with psql against the Supabase
-- project, then verify the live admin_roles row.
UPDATE admin_roles
SET permissions = '{"tabs":["overview","media","fixtures","teams"],"collections":{"news":{"create":true,"read":true,"update":true},"matches":{"create":true,"read":true,"update":true},"matches_results":{"create":false,"read":true,"update":true},"teams":{"create":true,"read":true,"update":true},"opponents":{"create":true,"read":true,"update":true},"competitions":{"create":true,"read":true,"update":true},"venues":{"create":true,"read":true,"update":true}},"pages_builder":false,"ai_assistant":false,"media_upload":true,"fanzone_pii":false}'::jsonb
WHERE name = 'editor';
