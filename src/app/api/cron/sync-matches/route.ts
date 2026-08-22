import { NextRequest, NextResponse } from "next/server";
import { ApiSportsRugbyAdapter } from "@/lib/sync/adapters/api-sports";
import { WorldRugbyAdapter } from "@/lib/sync/adapters/world-rugby";
import { DirectusMatchSyncEngine } from "@/lib/sync/directus-sync";
import { MatchProviderAdapter, NormalizedMatch } from "@/lib/sync/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return handleSync(req);
}

export async function POST(req: NextRequest) {
  return handleSync(req);
}

async function handleSync(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const adminSecret = process.env.REVALIDATE_SECRET;

  // Fail-closed authentication verification
  if (!cronSecret && !adminSecret) {
    return NextResponse.json(
      { error: "Server configuration error: Cron secret not set" },
      { status: 500 }
    );
  }

  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader?.trim();
  const querySecret = searchParams.get("secret")?.trim();
  const provided = bearerToken || querySecret;

  if (!provided || (provided !== cronSecret && provided !== adminSecret)) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing authorization token" },
      { status: 401 }
    );
  }

  const provider = searchParams.get("provider") || "api_sports";
  const dryRun = searchParams.get("dryRun") === "true";
  const teamName = searchParams.get("team") || "Zimbabwe";
  const season = searchParams.get("season") ? parseInt(searchParams.get("season")!, 10) : undefined;

  let adapter: MatchProviderAdapter;
  if (provider === "world_rugby") {
    adapter = new WorldRugbyAdapter();
  } else {
    adapter = new ApiSportsRugbyAdapter();
  }

  try {
    const fixtures: NormalizedMatch[] = await adapter.fetchFixtures({
      teamName,
      season,
    });

    if (dryRun) {
      return NextResponse.json({
        mode: "dry-run",
        provider,
        count: fixtures.length,
        fixtures,
      });
    }

    const syncEngine = new DirectusMatchSyncEngine();
    const result = await syncEngine.syncMatches(fixtures, adapter.name);

    return NextResponse.json({
      success: true,
      provider,
      result,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        provider,
        error: msg,
      },
      { status: 500 }
    );
  }
}
