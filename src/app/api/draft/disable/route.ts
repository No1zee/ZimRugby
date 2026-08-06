import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();
  const redirect = request.nextUrl.searchParams.get("redirect") || "/";
  return NextResponse.redirect(new URL(redirect, request.url));
}
