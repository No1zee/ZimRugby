import fs from "fs";
import path from "path";
import crypto from "crypto";

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

console.log("Connecting to Directus:", DIRECTUS_URL);

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
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

async function findOrCreateEntity(collection, name, extraFields = {}) {
  const cleanName = name.trim();
  const slug = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Search existing by exact name or slug
  const allExisting = await fetchDirectus(`/items/${collection}?limit=100`);
  const normName = normalizeStr(cleanName);

  const found = allExisting.find((item) => {
    return normalizeStr(item.name) === normName || normalizeStr(item.slug) === normalizeStr(slug);
  });

  if (found) {
    return found.id;
  }

  const newId = crypto.randomUUID();
  const payload = {
    id: newId,
    name: cleanName,
    slug,
    status: "published",
    ...extraFields,
  };

  if (collection === "competitions" && !payload.competition_type) {
    payload.competition_type = "international";
  }

  await fetchDirectus(`/items/${collection}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  console.log(`  + Created new ${collection}: "${cleanName}" (${newId})`);
  return newId;
}

async function run() {
  console.log("\n1. Fetching all existing matches and opponents from Directus...");
  const existingMatches = await fetchDirectus("/items/matches?fields=*.*&limit=200");
  const existingOpponents = await fetchDirectus("/items/opponents?limit=100");
  const existingTeams = await fetchDirectus("/items/teams?limit=100");

  console.log(`Directus currently has ${existingMatches.length} matches, ${existingOpponents.length} opponents.`);

  console.log("\n2. Fetching matches from World Rugby (PulseLive)...");
  const wrUrl = "https://api.wr-rims-prod.pulselive.com/rugby/v3/match?teams=57&sort=desc&pageSize=50";
  const res = await fetch(wrUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent": "ZRU-Sync-Worker/1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`World Rugby API failed: ${res.status} ${res.statusText}`);
  }

  const payload = await res.json();
  const allMatches = payload.content || payload.matches || [];

  // Filter 2022 to present & future
  const filtered = allMatches.filter((m) => {
    if (!m.time?.millis) return false;
    const year = new Date(m.time.millis).getFullYear();
    return year >= 2022;
  });

  console.log(`Found ${filtered.length} World Rugby matches from 2022 to present.\n`);

  // Default senior Sables team
  const sablesTeamId = await findOrCreateEntity("teams", "Zimbabwe Sables", { team_type: "senior" });

  let createdCount = 0;
  let updatedCount = 0;
  let consolidatedCount = 0;

  for (const m of filtered) {
    const dateIso = new Date(m.time.millis).toISOString();
    const dateStr = dateIso.substring(0, 10);
    const homeTeamName = m.teams?.[0]?.name || "Zimbabwe";
    const awayTeamName = m.teams?.[1]?.name || "Opponent";
    const isHome = homeTeamName.toLowerCase().includes("zimbabwe");

    const zruTeamName = isHome ? homeTeamName : awayTeamName;
    const oppName = isHome ? awayTeamName : homeTeamName;

    const homeScore = m.scores?.[0] ?? m.teams?.[0]?.score ?? null;
    const awayScore = m.scores?.[1] ?? m.teams?.[1]?.score ?? null;

    let status = "upcoming";
    if (m.status === "C" || m.status === "COMPLETED" || m.status === "FT") {
      status = "completed";
    } else if (m.status === "L" || m.status === "LIVE") {
      status = "live";
    }

    const competitionName = m.events?.[0]?.label || m.competition || m.description || "International Test Match";
    const venueName = m.venue?.name || (m.venue?.city ? `${m.venue.city}, ${m.venue.country || ""}` : undefined);

    const title = `${homeTeamName} vs ${awayTeamName}`;
    const slug = `${zruTeamName}-vs-${oppName}-${dateStr}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Resolve opponent, competition, and venue
    const opponentId = await findOrCreateEntity("opponents", oppName);
    const competitionId = await findOrCreateEntity("competitions", competitionName, { competition_type: "international" });
    let venueId = null;
    if (venueName) {
      venueId = await findOrCreateEntity("venues", venueName);
    }

    // Check for duplicates/existing records
    const normOpp = normalizeStr(oppName);
    const existingMatch = existingMatches.find((em) => {
      // 1. Check exact slug
      if (em.slug === slug) return true;

      // 2. Check match title similarity & date
      const emDate = em.kickoff_at ? em.kickoff_at.substring(0, 10) : "";
      const emTitleNorm = normalizeStr(em.title);
      const isSameOpp = emTitleNorm.includes(normOpp);

      if (isSameOpp) {
        // Same date or within 2 days
        if (emDate === dateStr) return true;
        if (emDate && dateStr) {
          const diff = Math.abs(new Date(emDate).getTime() - new Date(dateStr).getTime());
          if (diff <= 2 * 24 * 60 * 60 * 1000) return true;
        }
      }

      return false;
    });

    const year = new Date(m.time.millis).getFullYear();
    const zruScore = isHome ? homeScore : awayScore;
    const oppScore = isHome ? awayScore : homeScore;

    let resultOutcome = "na";
    let resultLabel = null;
    if (status === "completed" && zruScore !== null && oppScore !== null) {
      if (zruScore > oppScore) {
        resultOutcome = "win";
        resultLabel = `Won ${zruScore} - ${oppScore}`;
      } else if (zruScore < oppScore) {
        resultOutcome = "loss";
        resultLabel = `Lost ${zruScore} - ${oppScore}`;
      } else {
        resultOutcome = "draw";
        resultLabel = `Draw ${zruScore} - ${oppScore}`;
      }
    }

    if (existingMatch) {
      // Consolidate & update existing match record
      const updatePayload = {};
      if (status !== existingMatch.status) updatePayload.status = status;
      if (zruScore !== null && zruScore !== existingMatch.team_score) updatePayload.team_score = zruScore;
      if (oppScore !== null && oppScore !== existingMatch.opponent_score) updatePayload.opponent_score = oppScore;
      if (resultOutcome !== existingMatch.result_outcome) updatePayload.result_outcome = resultOutcome;
      if (resultLabel && resultLabel !== existingMatch.result_label) updatePayload.result_label = resultLabel;
      if (year && year !== existingMatch.season_year) updatePayload.season_year = year;
      if (venueId && venueId !== existingMatch.venue_id) updatePayload.venue_id = venueId;
      if (competitionId && competitionId !== existingMatch.competition_id) updatePayload.competition_id = competitionId;

      if (Object.keys(updatePayload).length > 0) {
        await fetchDirectus(`/items/matches/${existingMatch.id}`, {
          method: "PATCH",
          body: JSON.stringify(updatePayload),
        });
        console.log(`✓ Consolidate & Update: [${dateStr}] "${title}" (Score: ${zruScore}-${oppScore})`);
        updatedCount++;
      } else {
        console.log(`· Matched Existing: [${dateStr}] "${title}" (Score: ${zruScore}-${oppScore}) — up to date`);
        consolidatedCount++;
      }
    } else {
      // Create new match record
      const newMatchId = crypto.randomUUID();
      const createPayload = {
        id: newMatchId,
        title,
        slug,
        match_type: "international",
        team_id: sablesTeamId,
        opponent_id: opponentId,
        competition_id: competitionId,
        venue_id: venueId,
        kickoff_at: dateIso,
        season_year: year,
        status,
        home_or_away: isHome ? "home" : "away",
        team_score: zruScore,
        opponent_score: oppScore,
        result_outcome: resultOutcome,
        result_label: resultLabel,
        show_on_match_centre: true,
        show_on_team_page: true,
        show_on_homepage: true,
        status_editorial: "published",
      };

      await fetchDirectus("/items/matches", {
        method: "POST",
        body: JSON.stringify(createPayload),
      });

      console.log(`+ Ingest New Match: [${dateStr}] "${title}" (${status}) -> Score: ${zruScore}-${oppScore}`);
      createdCount++;
    }

  }

  // Trigger site revalidation
  const revalSecret = process.env.REVALIDATE_SECRET || "zru-revalidate-secret-2026";
  try {
    const revalRes = await fetch("https://zimrugby.vercel.app/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${revalSecret}`,
      },
      body: JSON.stringify({ collection: "matches" }),
    });
    if (revalRes.ok) {
      console.log("\n⚡ Next.js ISR Cache Revalidated successfully (`matches` tag purged).");
    }
  } catch (err) {
    console.log("\nNote: ISR trigger finished.");
  }

  console.log("\n==========================================");
  console.log("SYNC & CONSOLIDATION SUMMARY:");
  console.log(`Total World Rugby Fixtures Analyzed: ${filtered.length}`);
  console.log(`Newly Ingested Fixtures: ${createdCount}`);
  console.log(`Consolidated / Updated Existing: ${updatedCount}`);
  console.log(`Already In Sync (Skipped Duplicates): ${consolidatedCount}`);
  console.log("==========================================");
}

run().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
