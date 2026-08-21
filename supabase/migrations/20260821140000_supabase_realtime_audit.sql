-- Enable Postgres Realtime on audit_logs and key tables for 0-latency admin collaboration
-- All features execute natively within Supabase Free Tier ($0 policy)

-- 1. Enable Realtime Replication for audit_logs
alter publication supabase_realtime add table public.audit_logs;

-- 2. Add an index to speed up real-time audit querying by timestamp
create index if not exists idx_audit_logs_timestamp_desc on public.audit_logs (timestamp desc);

-- 3. Custom Access Token Hook function for instant JWT Claims (Zero-Cost Optimization)
-- Injects app_metadata.role and user permissions directly into the JWT claims payload
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_role text;
  role_perms jsonb;
begin
  claims := event->'claims';
  user_role := claims->'app_metadata'->>'role';

  if user_role is not null then
    -- Fetch permissions from admin_roles if exists
    select permissions into role_perms from public.admin_roles where id = user_role;
    if role_perms is not null then
      claims := jsonb_set(claims, '{user_permissions}', role_perms);
    end if;
  end if;

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

-- Grant execution permission to supabase_auth_admin
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;
