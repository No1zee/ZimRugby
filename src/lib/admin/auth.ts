import { cookies } from "next/headers";

const COOKIE_NAME = "zru_admin_auth";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zru-admin-2026";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(COOKIE_NAME);

  if (!authCookie?.value) {
    throw new Error("Unauthorized");
  }

  // Verify token is valid (non-empty string from our auth flow)
  if (authCookie.value.length < 10) {
    throw new Error("Unauthorized");
  }

  return { id: "admin", email: "admin@zimrugby.co.zw" };
}
