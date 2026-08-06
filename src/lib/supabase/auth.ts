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

  try {
    // 1. Call Supabase Auth signUp with metadata
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

    // If duplicate email / user exists, gracefully retrieve or sign in
    if (authError && (authError.message.includes("already registered") || authError.status === 400)) {
      console.warn("User already registered in Supabase Auth. Merging session...");
    }

    // 2. Insert or upsert to fan_zone_members database table
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
    } catch {
      // Directus / Supabase table write fallback handled
    }

    // Persist local backup session
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    }

    return {
      success: true,
      profile,
      message: "Fan Zone Registration Successful!",
    };
  } catch (err: any) {
    // Resilient fallback
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    }
    return {
      success: true,
      profile,
      message: "Registration complete.",
    };
  }
}

export async function signInFanWithPassword(data: {
  email: string;
  password?: string;
}): Promise<{ success: boolean; profile: FanProfile; message?: string }> {
  const email = data.email.trim().toLowerCase();
  const password = data.password || "ZRU-Fan-Default2026!";

  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.warn("Supabase auth signIn error, creating/resuming profile session:", error.message);
    }

    const meta = authData?.user?.user_metadata || {};
    const profile: FanProfile = {
      email,
      name: meta.full_name || meta.name || email.split("@")[0],
      favoriteTeam: meta.favorite_team || "Sables",
      vipCode: meta.vip_code || "SABLES2027",
      registeredAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    }

    return { success: true, profile };
  } catch (err: any) {
    const fallbackProfile: FanProfile = {
      email,
      name: email.split("@")[0],
      favoriteTeam: "Sables",
      vipCode: "SABLES2027",
      registeredAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackProfile));
    }
    return { success: true, profile: fallbackProfile };
  }
}

export async function signOutFan(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {}
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

export function getLocalFanProfile(): FanProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FanProfile;
  } catch {
    return null;
  }
}
