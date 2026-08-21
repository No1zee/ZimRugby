-- Migration: IAM, Security, RLS & CDPA 2021 / GDPR Compliance
-- Created: 2026-08-21

-- 1. Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. User Consents Table (CDPA 2021 / GDPR)
CREATE TABLE IF NOT EXISTS public.user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    consent_type TEXT NOT NULL, -- 'cookies_analytics', 'newsletter', 'fan_zone', 'marketing', 'parental_consent'
    is_granted BOOLEAN NOT NULL DEFAULT true,
    consent_version TEXT NOT NULL DEFAULT '1.0',
    ip_hash TEXT, -- SHA-256 hashed IP for audit verification without storing raw IP
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Consents Policy: Users can insert their own consent records
CREATE POLICY "Users can insert their own consent"
    ON public.user_consents
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

-- Consents Policy: Users can view their own consents; admins can view all
CREATE POLICY "Users view own consent / Admins view all"
    ON public.user_consents
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id 
        OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'auditor')
    );

-- 3. Data Subject Requests Table (Right to Erasure / Access / Portability)
CREATE TABLE IF NOT EXISTS public.data_subject_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    request_type TEXT NOT NULL, -- 'export', 'erasure', 'rectification', 'restriction'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'rejected'
    notes TEXT,
    completed_at TIMESTAMPTZ,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.data_subject_requests ENABLE ROW LEVEL SECURITY;

-- DSR Policy: Authenticated users can submit DSR requests
CREATE POLICY "Users submit DSR"
    ON public.data_subject_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = email);

-- DSR Policy: Super Admins and Auditors manage DSR requests
CREATE POLICY "Admins manage DSR requests"
    ON public.data_subject_requests
    FOR ALL
    TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'auditor'))
    WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'auditor'));

-- 4. Hardened Append-Only Admin Audit Logs with RLS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_email TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit Logs Policy: Append-only for admin operations
CREATE POLICY "Admins can insert audit logs"
    ON public.admin_audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'editor', 'media_manager', 'auditor')
    );

-- Audit Logs Policy: Read-only for Super Admin and Auditor roles
CREATE POLICY "Super Admins and Auditors can view audit logs"
    ON public.admin_audit_logs
    FOR SELECT
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'auditor')
    );
