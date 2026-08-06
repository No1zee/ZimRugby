export interface FanSession {
  name: string;
  email: string;
  favoriteTeam: string;
  vipCode: string;
  registeredAt: string;
}

const FAN_SESSION_KEY = "zru_fan_member_session";
const EVENT_NAME = "zru_fan_session_updated";

export function getFanSession(): FanSession | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(FAN_SESSION_KEY);
    if (!data) return null;
    return JSON.parse(data) as FanSession;
  } catch {
    return null;
  }
}

export function saveFanSession(session: FanSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAN_SESSION_KEY, JSON.stringify(session));
    // Dispatch custom event for real-time header/dock updates
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error("Failed to save fan session:", err);
  }
}

export function clearFanSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FAN_SESSION_KEY);
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error("Failed to clear fan session:", err);
  }
}

export function subscribeFanSession(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}
