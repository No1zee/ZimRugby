import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zru-admin-2026";
const COOKIE_NAME = "zru_admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

// Simple HMAC-like token using SubtleCrypto
async function createToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(password + "_salt_zru");
  const data = encoder.encode(COOKIE_NAME);

  const key = await crypto.subtle.importKey(
    "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, data);

  return Buffer.from(signature).toString("base64url");
}

// POST /api/admin/auth — sign in
export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await createToken(password);

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}

// DELETE /api/admin/auth — sign out
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return response;
}
