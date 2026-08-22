import fs from "fs";
import path from "path";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.substring(0, eqIdx).trim();
      let val = trimmed.substring(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const DIRECTUS_URL = process.env.DIRECTUS_API_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://zru-directus-cms-production.up.railway.app";
const ADMIN_TOKEN = process.env.DIRECTUS_TOKEN || "zru-directus-admin-bd92e3c6572c02320b494e2bfa5f9d888d780879debdae60";

async function fetchDirectus(apiPath, options = {}) {
  const url = `${DIRECTUS_URL}${apiPath}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ADMIN_TOKEN}`,
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Directus API error [${res.status}] ${apiPath}: ${errText}`);
  }

  const data = await res.json();
  return data.data;
}

function normalizeStr(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function run() {
  console.log("1. Fetching matches from Directus...");
  const directusMatches = await fetchDirectus("/items/matches?fields=*.*&limit=100");
  console.log(`Found ${directusMatches.length} matches in Directus.`);

  console.log("\n2. Fetching World Rugby matches (PulseLive)...");
  const sablesRes = await fetch("https://api.wr-rims-prod.pulselive.com/rugby/v3/match?teams=57&sort=desc&pageSize=50", {
    headers: { Accept: "application/json", "User-Agent": "ZRU-Sync-Worker/1.0" },
  });
  const sablesData = await sablesRes.json();
  const wrMatches = sablesData.content || [];

  console.log(`Found ${wrMatches.length} World Rugby matches to process.\n`);

  let updatedStatsCount = 0;

  for (const wrMatch of wrMatches) {
    const matchId = wrMatch.matchId;
    const dateStr = wrMatch.time ? new Date(wrMatch.time.millis).toISOString().substring(0, 10) : "";
    const homeTeam = wrMatch.teams?.[0]?.name || "";
    const awayTeam = wrMatch.teams?.[1]?.name || "";
    const isHome = homeTeam.toLowerCase().includes("zimbabwe");
    const oppName = isHome ? awayTeam : homeTeam;
    const normOpp = normalizeStr(oppName);

    // Find in Directus
    const matched = directusMatches.find((dm) => {
      const dmDate = dm.kickoff_at ? dm.kickoff_at.substring(0, 10) : "";
      const dmTitleNorm = normalizeStr(dm.title);
      return dmTitleNorm.includes(normOpp) && (dmDate === dateStr || Math.abs(new Date(dmDate).getTime() - new Date(dateStr).getTime()) <= 2 * 86400000);
    });

    if (!matched) {
      continue;
    }

    try {
      // Fetch stats payload from World Rugby
      const statsRes = await fetch(`https://api.wr-rims-prod.pulselive.com/rugby/v3/match/${matchId}/stats`, {
        headers: { Accept: "application/json", "User-Agent": "ZRU-Sync-Worker/1.0" },
      });

      if (!statsRes.ok) continue;

      const statsPayload = await statsRes.json();
      const teamStatsArray = statsPayload.teamStats;

      if (!teamStatsArray || teamStatsArray.length < 2) {
        continue;
      }

      // Map team 1 vs team 2 stats
      const t1Stats = teamStatsArray[0]?.stats || {};
      const t2Stats = teamStatsArray[1]?.stats || {};

      const zruStats = isHome ? t1Stats : t2Stats;
      const oppStats = isHome ? t2Stats : t1Stats;

      const normalizedStats = {
        possession: {
          team: zruStats.Possession ?? zruStats.PcPossessionFirst ?? null,
          opponent: oppStats.Possession ?? oppStats.PcPossessionFirst ?? null,
        },
        territory: {
          team: zruStats.Territory ?? zruStats.PcTerritoryFirst ?? null,
          opponent: oppStats.Territory ?? oppStats.PcTerritoryFirst ?? null,
        },
        attack: {
          carries: { team: zruStats.Carries ?? 0, opponent: oppStats.Carries ?? 0 },
          metres: { team: zruStats.Metres ?? zruStats.CarriesMetres ?? 0, opponent: oppStats.Metres ?? oppStats.CarriesMetres ?? 0 },
          cleanBreaks: { team: zruStats.CleanBreaks ?? 0, opponent: oppStats.CleanBreaks ?? 0 },
          defendersBeaten: { team: zruStats.DefendersBeaten ?? 0, opponent: oppStats.DefendersBeaten ?? 0 },
          offloads: { team: zruStats.Offload ?? 0, opponent: oppStats.Offload ?? 0 },
          passes: { team: zruStats.Passes ?? 0, opponent: oppStats.Passes ?? 0 },
        },
        defense: {
          tackles: { team: zruStats.Tackles ?? 0, opponent: oppStats.Tackles ?? 0 },
          missedTackles: { team: zruStats.MissedTackles ?? 0, opponent: oppStats.MissedTackles ?? 0 },
          tackleSuccess: { team: zruStats.TackleSuccess ?? null, opponent: oppStats.TackleSuccess ?? null },
          turnoversWon: { team: zruStats.TurnoversWon ?? zruStats.TurnoverWon ?? 0, opponent: oppStats.TurnoversWon ?? oppStats.TurnoverWon ?? 0 },
        },
        setPiece: {
          scrumsWon: { team: zruStats.ScrumsWon ?? 0, opponent: oppStats.ScrumsWon ?? 0 },
          scrumsTotal: { team: zruStats.ScrumsTotal ?? 0, opponent: oppStats.ScrumsTotal ?? 0 },
          lineoutsWon: { team: zruStats.LineoutsWon ?? 0, opponent: oppStats.LineoutsWon ?? 0 },
          lineoutsTotal: { team: zruStats.TotalLineouts ?? 0, opponent: oppStats.TotalLineouts ?? 0 },
          lineoutSteals: { team: zruStats.LineoutWonSteal ?? 0, opponent: oppStats.LineoutWonSteal ?? 0 },
        },
        discipline: {
          penaltiesConceded: { team: zruStats.PenaltiesConceded ?? 0, opponent: oppStats.PenaltiesConceded ?? 0 },
          yellowCards: { team: zruStats.YellowCards ?? 0, opponent: oppStats.YellowCards ?? 0 },
        },
        rawOptaStats: {
          team: zruStats,
          opponent: oppStats,
        },
      };

      // Save to Directus
      await fetchDirectus(`/items/matches/${matched.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          stats: normalizedStats,
        }),
      });

      console.log(`✓ Attached 132 Opta Stats to [${dateStr}] "${matched.title}" (Match ID: ${matched.id})`);
      updatedStatsCount++;
    } catch (err) {
      console.error(`Failed to attach stats for ${matched.title}:`, err.message);
    }
  }

  // Trigger site revalidation
  const revalSecret = process.env.REVALIDATE_SECRET || "zru-revalidate-secret-2026";
  try {
    await fetch("https://zimrugby.vercel.app/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${revalSecret}`,
      },
      body: JSON.stringify({ collection: "matches" }),
    });
    console.log("\n⚡ Next.js ISR Cache Revalidated successfully (`matches` tag purged).");
  } catch {}

  console.log("\n==========================================");
  console.log("MATCH STATS INGESTION SUMMARY:");
  console.log(`Total Matches Enriched with Opta Stats: ${updatedStatsCount}`);
  console.log("==========================================");
}

run().catch((err) => {
  console.error("Sync match stats failed:", err);
  process.exit(1);
});
