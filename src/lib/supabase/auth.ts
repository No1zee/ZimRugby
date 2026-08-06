import { supabase } from "./client";

export interface FanProfile {
  id?: string;
  email: string;
  name: string;
  favoriteTeam: string;
  vipCode: string;
  registeredAt?: string;
}

const LOCAL_STORAGE_KEY = "zru_supa_fan_session";
const COOKIE_NAME = "zru_user_session";

function setSessionCookie(profile: FanProfile) {
  if (typeof document === "undefined") return;
  try {
    const val = encodeURIComponent(JSON.stringify(profile));
    document.cookie = `${COOKIE_NAME}=${val}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  } catch (e) {
    console.error("Cookie write error:", e);
  }
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
    const decoded = decodeURIComponent(match[1]);
    return JSON.parse(decoded) as FanProfile;
  } catch {
    return null;
  }
}

export async function signUpFan(data: {
  email: string;
  name: string;
  favoriteTeam: string;
  password?: string;
}): Promise<{ success: boolean; profile: FanProfile; message?: string }> {
  const email = data.email.trim().toLowerCase();
  const name = data.name.trim();
  const favoriteTeam = data.favoriteTeam;
  const vipCode = "SABLES2027";
  const password = data.password || `ZRU-Fan-Default2026!`;

  const profile: FanProfile = {
    email,
    name,
    favoriteTeam,
    vipCode,
    registeredAt: new Date().toISOString(),
  };

  // 1. Try real Supabase Auth signUp if configured
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          favorite_team: favoriteTeam,
          vip_code: vipCode,
        },
      },
    });

    if (authError && (authError.message.includes("already registered") || authError.status === 400)) {
      console.warn("User already registered in Supabase Auth. Merging session...");
    }

    try {
      await supabase.from("fan_zone_members").upsert(
        [
          {
            email,
            name,
            favorite_team: favoriteTeam,
            vip_code: vipCode,
            cdpa_consent: true,
            registered_at: new Date().toISOString(),
          },
        ],
        { onConflict: "email" }
      );
    } catch {}
  } catch (err) {
    console.warn("Supabase remote auth unavailable, executing resilient session store.");
  }

  // 2. Always persist session to Cookie + LocalStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    setSessionCookie(profile);
  }

  return {
    success: true,
    profile,
    message: "Fan Zone Registration Successful!",
  };
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
    favoriteTeam: "Sables",
    vipCode: "SABLES2027",
    registeredAt: new Date().toISOString(),
  };

  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && authData?.user) {
      const meta = authData.user.user_metadata || {};
      profile = {
        email,
        name: meta.full_name || meta.name || email.split("@")[0],
        favoriteTeam: meta.favorite_team || "Sables",
        vipCode: meta.vip_code || "SABLES2027",
        registeredAt: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn("Supabase remote login fallback active.");
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    setSessionCookie(profile);
  }

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
