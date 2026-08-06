import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "zru_admin_auth";

// GET /api/admin/auth/check — check if user is authenticated & return role
export async function GET(req: NextRequest) {
  const rawCookie = req.headers.get("cookie") || "";
  const match = rawCookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const value = match?.[1];

  if (!value || value.length < 10) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const parts = value.split(".");
    if (parts.length === 2) {
      const payloadStr = Buffer.from(parts[0], "base64url").toString("utf-8");
      const payload = JSON.parse(payloadStr);
      return NextResponse.json({
        authenticated: true,
        user: {
          email: payload.email || "admin@zimrugby.co.zw",
          role: payload.role || "super_admin",
        },
      });
    }
  } catch {
    // Fallback if basic token
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: "admin@zimrugby.co.zw",
      role: "super_admin",
    },
  });
}
