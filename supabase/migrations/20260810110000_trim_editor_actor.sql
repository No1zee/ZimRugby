-- Trim the editor actor to least privilege (spec §8b).
-- Editors keep News + Matches writes only — no deletes, no pages builder / AI
-- assistant, no fan PII. The DB is authoritative in production.
UPDATE admin_roles
SET permissions = '{"tabs":["overview","media","fixtures"],"collections":{"news":{"create":true,"read":true,"update":true},"matches":{"create":true,"read":true,"update":true},"matches_results":{"create":false,"read":true,"update":true}},"pages_builder":false,"ai_assistant":false,"media_upload":true,"fanzone_pii":false}'::jsonb
WHERE name = 'editor';
