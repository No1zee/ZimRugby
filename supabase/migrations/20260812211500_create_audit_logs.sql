-- Create audit_logs table to persist accountability trail (NIST AC-3 Compliance)
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null default now(),
  actor_email text not null,
  actor_role text not null,
  action text not null,
  resource text not null,
  details text,
  ip_address text
);

alter table public.audit_logs enable row level security;

-- Only service_role client has access to read/write audit logs for security
create policy "audit_logs_service_role_all"
  on public.audit_logs
  for all
  to service_role
  using (true)
  with check (true);
