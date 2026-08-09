import { cookies } from "next/headers";

const COOKIE_NAME = "zru_admin_auth";

export interface AdminSession {
  email: string;
  role: string;
}

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || secret.length < 12) {
    throw new Error("ADMIN_PASSWORD not configured");
  }
  return secret;
}

async function deriveKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  const a = Buffer.from(aHex, "hex");
  const b = Buffer.from(bHex, "hex");
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

export async function signAdminToken(payload: AdminSession): Promise<string> {
  const secret = getSecret();
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const key = await deriveKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const sigHex = Buffer.from(signature).toString("hex");
  return `${payloadB64}.${sigHex}`;
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sigHex] = parts;
  if (!payloadB64 || !sigHex) return null;

  try {
    const secret = getSecret();
    const key = await deriveKey(secret);
    const expected = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
    const expectedHex = Buffer.from(expected).toString("hex");

    if (!timingSafeEqualHex(expectedHex, sigHex)) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    if (!payload || typeof payload.email !== "string" || typeof payload.role !== "string") {
      return null;
    }
    return { email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(COOKIE_NAME);

  if (!authCookie?.value) {
    throw new Error("Unauthorized");
  }

  const session = await verifyAdminToken(authCookie.value);
  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
