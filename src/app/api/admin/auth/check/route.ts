import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin/auth";

const COOKIE_NAME = "zru_admin_auth";

// GET /api/admin/auth/check — check if user is authenticated & return role
export async function GET(req: NextRequest) {
  const rawCookie = req.headers.get("cookie") || "";
  const match = rawCookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const value = match?.[1];

  if (!value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await verifyAdminToken(value);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.email,
      role: session.role,
    },
  });
}
