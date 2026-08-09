import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getAdminClient() {
  if (!url || !serviceKey) return null;
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface AdminFanMember {
  id: number;
  name: string;
  email: string;
  favorite_team?: string;
  vip_code?: string;
  cdpa_consent: boolean;
  registered_at?: string;
}

export interface AdminOnboardingSubmission {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  organization?: string;
  submitted_at?: string;
}

// Read-only admin views. Returns [] when SUPABASE_SERVICE_ROLE_KEY is not
// configured (anonymous reads are blocked by RLS).
export async function listFanZoneMembers(limit = 100): Promise<AdminFanMember[]> {
  const client = getAdminClient();
  if (!client) return [];

  try {
    const { data } = await client
      .from("fan_zone_members")
      .select("id, name, email, favorite_team, vip_code, cdpa_consent, registered_at")
      .order("registered_at", { ascending: false })
      .limit(limit);

    return (data || []) as AdminFanMember[];
  } catch {
    return [];
  }
}

export async function listOnboardingSubmissions(limit = 100): Promise<AdminOnboardingSubmission[]> {
  const client = getAdminClient();
  if (!client) return [];

  try {
    const { data } = await client
      .from("onboarding_submissions")
      .select("*")
      .order("submittedAt", { ascending: false })
      .order("submitted_at", { ascending: false })
      .limit(limit);

    const rows = (data || []) as Record<string, unknown>[];
    return rows.map((r) => ({
      id: Number(r.id ?? 0),
      full_name: String(r.full_name ?? r.fullName ?? ""),
      email: String(r.email ?? ""),
      phone: r.phone !== undefined && r.phone !== null ? String(r.phone) : undefined,
      role: String(r.role ?? ""),
      organization:
        r.organization !== undefined && r.organization !== null ? String(r.organization) : undefined,
      submitted_at: String(r.submitted_at ?? r.submittedAt ?? r.timestamp ?? ""),
    }));
  } catch {
    return [];
  }
}
