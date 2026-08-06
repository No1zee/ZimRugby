import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const redirect = searchParams.get("redirect") || "/";

  if (secret !== process.env.DIRECTUS_PREVIEW_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(redirect, request.url));
}
