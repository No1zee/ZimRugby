import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// The ICS feed lives at /api/calendar.ics (canonical, "zimrugby-calendar.ics").
// /api/calendar previously served the same ICS under a different filename and
// error shape — redirect so existing subscribers keep working and there's one
// endpoint to point people at.
export async function GET(req: Request) {
  return NextResponse.redirect(new URL("/api/calendar.ics", req.url), 301);
}
