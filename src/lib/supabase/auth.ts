import { supabase } from "./client";

export interface FanProfile {
  id?: string;
  email: string;
  name: string;
  handle: string;
  favoriteTeam: string;
  registeredAt?: string;
}

const LOCAL_STORAGE_KEY = "zru_supa_fan_session";
const COOKIE_NAME = "zru_user_session";

function setSessionCookie(profile: FanProfile) {
  if (typeof document === "undefined") return;
  try {
    const val = encodeURIComponent(JSON.stringify(profile));
    document.cookie = `${COOKIE_NAME}=${val}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  } catch {}
}

function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function getCookieFanProfile(): FanProfile | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    if (!match || !match[1]) return null;
    return JSON.parse(decodeURIComponent(match[1])) as FanProfile;
  } catch {
    return null;
  }
}

/** Generate a unique @handle from the user's name: @edward4821 */
function generateHandle(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .split(" ")[0]
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `@${base || "fan"}${suffix}`;
}

function persistSession(profile: FanProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    setSessionCookie(profile);
  }
}

export async function signInWithOAuth(provider: 'google' | 'apple', nextTarget?: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || 'https://zimrugby.vercel.app';
  const callbackUrl = nextTarget ? `${origin}/auth/callback?next=${encodeURIComponent(nextTarget)}` : `${origin}/auth/callback`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callbackUrl,
    },
  });
  if (error) throw error;
  return data;
}

export async function signUpFan(data: {
  email: string;
  name: string;
  favoriteTeam: string;
  password?: string;
  handle?: string;
}): Promise<{ success: boolean; profile: FanProfile; message?: string }> {
  const email = data.email.trim().toLowerCase();
  const name = data.name.trim();
  const favoriteTeam = data.favoriteTeam;
  const password = data.password || "ZRU-Fan-Default2026!";
  const handle = data.handle ? `@${data.handle.replace(/^@/, "")}` : generateHandle(name);

  const profile: FanProfile = {
    email,
    name,
    handle,
    favoriteTeam,
    registeredAt: new Date().toISOString(),
  };

  try {
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          handle,
          favorite_team: favoriteTeam,
        },
      },
    });

    if (authError && !authError.message.includes("already registered")) {
      console.warn("Supabase signUp error:", authError.message);
    }

    // Upsert into fan_zone_members
    try {
      await supabase.from("fan_zone_members").upsert(
        [{
          email,
          name,
          handle,
          favorite_team: favoriteTeam,
          cdpa_consent: true,
          registered_at: new Date().toISOString(),
        }],
        { onConflict: "email" }
      );
    } catch {}
  } catch (err) {
    console.warn("Supabase unreachable, using resilient fallback.");
  }

  persistSession(profile);
  return { success: true, profile };
}

export async function signInFanWithPassword(data: {
  email: string;
  password?: string;
}): Promise<{ success: boolean; profile: FanProfile; message?: string }> {
  const email = data.email.trim().toLowerCase();
  const password = data.password || "ZRU-Fan-Default2026!";

  let profile: FanProfile = {
    email,
    name: email.split("@")[0],
    handle: generateHandle(email.split("@")[0]),
    favoriteTeam: "Sables",
    registeredAt: new Date().toISOString(),
  };

  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Wrong password or not found
      return { success: false, profile, message: error.message };
    }

    if (authData?.user) {
      const meta = authData.user.user_metadata || {};
      profile = {
        email,
        name: meta.full_name || meta.name || email.split("@")[0],
        handle: meta.handle || generateHandle(meta.full_name || email.split("@")[0]),
        favoriteTeam: meta.favorite_team || "Sables",
        registeredAt: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn("Supabase remote login unavailable, checking local session.");
    // Try to retrieve local session
    const local = getLocalFanProfile();
    if (local && local.email === email) {
      persistSession(local);
      return { success: true, profile: local };
    }
    return { success: false, profile, message: "Unable to connect. Please check your connection." };
  }

  persistSession(profile);
  return { success: true, profile };
}

export async function signOutFan(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {}
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    clearSessionCookie();
  }
}

export function getLocalFanProfile(): FanProfile | null {
  const cookieProfile = getCookieFanProfile();
  if (cookieProfile) return cookieProfile;
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FanProfile;
  } catch {
    return null;
  }
}
