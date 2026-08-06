import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "zru_admin_auth";

// GET /api/admin/auth/check — check if user is authenticated
export async function GET(req: NextRequest) {
  const rawCookie = req.headers.get("cookie") || "";
  const match = rawCookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const value = match?.[1];

  if (value && value.length >= 10) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false, rawCookie }, { status: 401 });
}
