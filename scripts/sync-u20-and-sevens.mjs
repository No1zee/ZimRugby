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
const API_SPORTS_KEY = process.env.API_SPORTS_KEY || "3fc7cca6c85b71cddf7ef9d0e8011420";

const U20_TEAM_ID = "710b9565-d266-4c8c-94c8-596f617d7549";
const CHEETAHS_TEAM_ID = "ace495a6-a663-4ebd-bfdc-72044a0cb7bb";

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

async function findOrCreateEntity(collection, name, extraFields = {}) {
  const cleanName = name.trim();
  const slug = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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
  console.log("1. Fetching existing matches from Directus...");
  const existingMatches = await fetchDirectus("/items/matches?fields=*.*&limit=200");

  let createdCount = 0;
  let updatedCount = 0;

  // --- SYNC U20 MATCHES ---
  console.log("\n2. Syncing Zimbabwe U20 matches (World Rugby U20 Trophy)...");
  const resU20 = await fetch("https://v1.rugby.api-sports.io/games?team=860&season=2023", {
    headers: { "x-apisports-key": API_SPORTS_KEY },
  });
  const dataU20 = await resU20.json();
  const u20Games = dataU20.response || [];

  for (const g of u20Games) {
    const isHome = g.teams.home.id === 860;
    const oppName = isHome ? g.teams.away.name : g.teams.home.name;
    const zruScore = isHome ? g.scores.home : g.scores.away;
    const oppScore = isHome ? g.scores.away : g.scores.home;
    const dateIso = g.date.includes("T") ? g.date : `${g.date}T${g.time || "15:00:00"}Z`;
    const dateStr = dateIso.substring(0, 10);
    const year = 2023;

    let resultOutcome = "na";
    let resultLabel = null;
    if (zruScore !== null && oppScore !== null) {
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

    const title = `${g.teams.home.name} vs ${g.teams.away.name}`;
    const slug = `zimbabwe-u20-vs-${oppName}-${dateStr}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const opponentId = await findOrCreateEntity("opponents", oppName, { team_type: "u20" });
    const competitionId = await findOrCreateEntity("competitions", g.league?.name || "World Rugby U20 Trophy", { competition_type: "international" });

    // Check if match already exists
    const normOpp = normalizeStr(oppName);
    const existing = existingMatches.find((em) => {
      if (em.slug === slug) return true;
      const emDate = em.kickoff_at ? em.kickoff_at.substring(0, 10) : "";
      const emTitleNorm = normalizeStr(em.title);
      return emTitleNorm.includes(normOpp) && emTitleNorm.includes("u20") && emDate === dateStr;
    });

    if (existing) {
      await fetchDirectus(`/items/matches/${existing.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "completed",
          team_score: zruScore,
          opponent_score: oppScore,
          result_outcome: resultOutcome,
          result_label: resultLabel,
          season_year: year,
        }),
      });
      console.log(`✓ Updated U20: [${dateStr}] "${title}" -> Score: ${zruScore}-${oppScore}`);
      updatedCount++;
    } else {
      const newMatchId = crypto.randomUUID();
      await fetchDirectus("/items/matches", {
        method: "POST",
        body: JSON.stringify({
          id: newMatchId,
          title,
          slug,
          match_type: "schools",
          team_id: U20_TEAM_ID,
          opponent_id: opponentId,
          competition_id: competitionId,
          kickoff_at: dateIso,
          season_year: year,
          status: "completed",
          home_or_away: isHome ? "home" : "away",
          team_score: zruScore,
          opponent_score: oppScore,
          result_outcome: resultOutcome,
          result_label: resultLabel,
          show_on_match_centre: true,
          show_on_team_page: true,
          show_on_homepage: true,
          status_editorial: "published",
        }),
      });
      console.log(`+ Created U20: [${dateStr}] "${title}" -> Score: ${zruScore}-${oppScore}`);
      createdCount++;
    }
  }

  // --- SYNC CHEETAHS 7s MATCHES ---
  console.log("\n3. Syncing Zimbabwe Cheetahs 7s matches (Sevens World Cup)...");
  const res7s = await fetch("https://v1.rugby.api-sports.io/games?team=576&season=2022", {
    headers: { "x-apisports-key": API_SPORTS_KEY },
  });
  const data7s = await res7s.json();
  const cheetahGames = data7s.response || [];

  for (const g of cheetahGames) {
    const isHome = g.teams.home.id === 576;
    const oppName = isHome ? g.teams.away.name : g.teams.home.name;
    const zruScore = isHome ? g.scores.home : g.scores.away;
    const oppScore = isHome ? g.scores.away : g.scores.home;
    const dateIso = g.date.includes("T") ? g.date : `${g.date}T${g.time || "15:00:00"}Z`;
    const dateStr = dateIso.substring(0, 10);
    const year = 2022;

    let resultOutcome = "na";
    let resultLabel = null;
    if (zruScore !== null && oppScore !== null) {
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

    const title = `${g.teams.home.name} vs ${g.teams.away.name}`;
    const slug = `cheetahs-vs-${oppName}-${dateStr}-${g.id}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const opponentId = await findOrCreateEntity("opponents", oppName, { team_type: "sevens" });
    const competitionId = await findOrCreateEntity("competitions", g.league?.name || "Rugby World Cup Sevens", { competition_type: "sevens" });

    const normOpp = normalizeStr(oppName);
    const existing = existingMatches.find((em) => {
      if (em.slug === slug) return true;
      const emDate = em.kickoff_at ? em.kickoff_at.substring(0, 10) : "";
      const emTitleNorm = normalizeStr(em.title);
      return emTitleNorm.includes(normOpp) && emTitleNorm.includes("7s") && emDate === dateStr;
    });

    if (existing) {
      await fetchDirectus(`/items/matches/${existing.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "completed",
          team_score: zruScore,
          opponent_score: oppScore,
          result_outcome: resultOutcome,
          result_label: resultLabel,
          season_year: year,
        }),
      });
      console.log(`✓ Updated Cheetahs: [${dateStr}] "${title}" -> Score: ${zruScore}-${oppScore}`);
      updatedCount++;
    } else {
      const newMatchId = crypto.randomUUID();
      await fetchDirectus("/items/matches", {
        method: "POST",
        body: JSON.stringify({
          id: newMatchId,
          title,
          slug,
          match_type: "sevens",
          team_id: CHEETAHS_TEAM_ID,
          opponent_id: opponentId,
          competition_id: competitionId,
          kickoff_at: dateIso,
          season_year: year,
          status: "completed",
          home_or_away: isHome ? "home" : "away",
          team_score: zruScore,
          opponent_score: oppScore,
          result_outcome: resultOutcome,
          result_label: resultLabel,
          show_on_match_centre: true,
          show_on_team_page: true,
          show_on_homepage: true,
          status_editorial: "published",
        }),
      });
      console.log(`+ Created Cheetahs: [${dateStr}] "${title}" -> Score: ${zruScore}-${oppScore}`);
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
  } catch {
    // ignore
  }

  console.log("\n==========================================");
  console.log("U20 & SEVENS SYNC SUMMARY:");
  console.log(`Newly Created: ${createdCount}`);
  console.log(`Updated Existing: ${updatedCount}`);
  console.log("==========================================");
}

run().catch((err) => {
  console.error("U20 & Sevens sync failed:", err);
  process.exit(1);
});
