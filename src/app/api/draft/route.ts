import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function sanitizeRedirect(target: string | null): string {
  if (!target || typeof target !== "string") return "/";
  const trimmed = target.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return "/";
  }
  if (trimmed.includes(":") || trimmed.includes("\n") || trimmed.includes("\r")) {
    return "/";
  }
  return trimmed;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const redirect = sanitizeRedirect(searchParams.get("redirect"));

  if (!process.env.DIRECTUS_PREVIEW_SECRET || secret !== process.env.DIRECTUS_PREVIEW_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(redirect, request.url));
}
