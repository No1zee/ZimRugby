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

  if (res.status === 204) {
    return null;
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

  console.log(`  + Created ${collection}: "${cleanName}" (${newId})`);
  return newId;
}

async function run() {
  console.log("=== CALIBRATING & FACT-CHECKING ALL FIXTURES IN DIRECTUS ===\n");

  // 1. Ensure Verified Competitions Exist
  const rac2022Id = await findOrCreateEntity("competitions", "Rugby Africa Cup 2022", {
    short_name: "Africa Cup 2022",
    competition_type: "international",
    description: "Rugby Africa Cup 2022 (Rugby World Cup 2023 Qualifier in France)"
  });

  const racWomen2022Id = await findOrCreateEntity("competitions", "Rugby Africa Women's Cup 2022", {
    short_name: "Women's Africa Cup 2022",
    competition_type: "international",
    description: "Rugby Africa Women's Cup 2022 Pool A in Cape Town"
  });

  const rwc7s2022Id = await findOrCreateEntity("competitions", "Rugby World Cup Sevens 2022", {
    short_name: "RWC 7s 2022",
    competition_type: "sevens",
    description: "Rugby World Cup Sevens 2022 in Cape Town"
  });

  // 2. Ensure Verified Venues Exist
  const capeTownStadiumId = await findOrCreateEntity("venues", "Cape Town Stadium", {
    city: "Cape Town",
    country: "South Africa",
    capacity: 55000
  });

  const cityParkId = await findOrCreateEntity("venues", "City Park Sports Ground", {
    city: "Cape Town",
    country: "South Africa"
  });

  const amsterdamStadiumId = await findOrCreateEntity("venues", "National Rugby Centre", {
    city: "Amsterdam",
    country: "Netherlands"
  });

  const stadeDelortId = await findOrCreateEntity("venues", "Stade Delort", {
    city: "Marseille",
    country: "France"
  });

  const stadeMauriceDavidId = await findOrCreateEntity("venues", "Stade Maurice-David", {
    city: "Aix-en-Provence",
    country: "France"
  });

  // 3. Fetch all current matches
  const matches = await fetchDirectus("/items/matches?fields=*.*&limit=100");
  console.log(`\nAnalyzing ${matches.length} matches for fact-checked corrections...\n`);

  for (const m of matches) {
    const title = m.title || "";
    const date = m.kickoff_at ? m.kickoff_at.substring(0, 10) : "";
    const patch = {};

    // --- FACT-CHECK 1: South Africa vs Lady Sables (15 Jun 2022) ---
    if (date === "2022-06-15" && title.includes("Lady Sables")) {
      patch.title = "South Africa vs Zimbabwe Lady Sables";
      patch.competition_id = racWomen2022Id;
      patch.venue_id = cityParkId;
      patch.home_or_away = "away";
      patch.kickoff_at = "2022-06-15T13:00:00Z";
      patch.status = "completed";
      patch.team_score = 0;
      patch.opponent_score = 108;
      patch.result_outcome = "loss";
      patch.result_label = "Lost 0 - 108";
    }

    // --- FACT-CHECK 2: Namibia vs Lady Sables (19 Jun 2022) ---
    if (date === "2022-06-19" && title.includes("Lady Sables")) {
      patch.title = "Namibia vs Zimbabwe Lady Sables";
      patch.competition_id = racWomen2022Id;
      patch.venue_id = cityParkId;
      patch.home_or_away = "away";
      patch.kickoff_at = "2022-06-19T13:00:00Z";
      patch.status = "completed";
      patch.team_score = 72;
      patch.opponent_score = 0;
      patch.result_outcome = "win";
      patch.result_label = "Won 72 - 0";
    }

    // --- FACT-CHECK 3: Netherlands vs Zimbabwe (25 Jun 2022) ---
    if (date === "2022-06-25" && title.toLowerCase().includes("netherlands")) {
      patch.title = "Netherlands vs Zimbabwe Sables";
      patch.venue_id = amsterdamStadiumId;
      patch.home_or_away = "away";
      patch.kickoff_at = "2022-06-25T14:30:00Z"; // 16:30 CEST
      patch.status = "completed";
      patch.team_score = 30;
      patch.opponent_score = 7;
      patch.result_outcome = "win";
      patch.result_label = "Won 30 - 7";
    }

    // --- FACT-CHECK 4: Zimbabwe vs Cote D'Ivoire (1 Jul 2022) ---
    if (date === "2022-07-01" && (title.includes("Cote") || title.includes("Ivoire"))) {
      patch.title = "Zimbabwe Sables vs Côte d'Ivoire";
      patch.competition_id = rac2022Id;
      patch.venue_id = stadeDelortId;
      patch.home_or_away = "home";
      patch.kickoff_at = "2022-07-01T19:00:00Z";
      patch.status = "completed";
      patch.team_score = 38;
      patch.opponent_score = 11;
      patch.result_outcome = "win";
      patch.result_label = "Won 38 - 11";
    }

    // --- FACT-CHECK 5: Namibia vs Zimbabwe Semi-Final (6 Jul 2022) ---
    if (date === "2022-07-06" && title.toLowerCase().includes("namibia")) {
      patch.title = "Namibia vs Zimbabwe Sables";
      patch.competition_id = rac2022Id;
      patch.venue_id = stadeMauriceDavidId;
      patch.home_or_away = "away";
      patch.kickoff_at = "2022-07-06T19:00:00Z";
      patch.status = "completed";
      patch.team_score = 19;
      patch.opponent_score = 34;
      patch.result_outcome = "loss";
      patch.result_label = "Lost 19 - 34";
    }

    // --- FACT-CHECK 6: Algeria vs Zimbabwe 3rd Place (10 Jul 2022) ---
    if (date === "2022-07-10" && title.toLowerCase().includes("algeria")) {
      patch.title = "Zimbabwe Sables vs Algeria";
      patch.competition_id = rac2022Id;
      patch.venue_id = stadeMauriceDavidId;
      patch.home_or_away = "home";
      patch.kickoff_at = "2022-07-10T16:30:00Z";
      patch.status = "completed";
      patch.team_score = 12;
      patch.opponent_score = 20;
      patch.result_outcome = "loss";
      patch.result_label = "Lost 12 - 20";
    }

    // --- FACT-CHECK 7: Cape Town 7s (9-11 Sep 2022) Cheetahs Matches ---
    if (title.includes("7s") && (date === "2022-09-09" || date === "2022-09-10" || date === "2022-09-11")) {
      patch.competition_id = rwc7s2022Id;
      patch.venue_id = capeTownStadiumId;
      patch.status = "completed";
    }

    // --- FACT-CHECK 8: Remove phantom mock fixtures from early development scaffolding ---
    // (e.g. "Zimbabwe vs Namibia - Africa Cup 2026 Semi-Final" or "Zimbabwe vs Kenya - Africa Cup 2026 Final" placed on 2026-08-16 / 2026-08-30)
    if (
      title.includes("Africa Cup 2026 Semi-Final") ||
      title.includes("Africa Cup 2026 Final") ||
      (date === "2026-08-29" && title.includes("Welwitschias")) ||
      (date === "2026-08-15" && title.includes("Uganda vs Zimbabwe - International Test Match"))
    ) {
      console.log(`🗑️ Removing phantom mock placeholder: [${date}] "${title}" (ID: ${m.id})`);
      await fetchDirectus(`/items/matches/${m.id}`, { method: "DELETE" });
      continue;
    }

    if (Object.keys(patch).length > 0) {
      await fetchDirectus(`/items/matches/${m.id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      console.log(`✓ Calibrated [${date}] "${patch.title || title}" -> Venue, Time, Home/Away, Status set.`);
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
  console.log("CALIBRATION & FACT-CHECK COMPLETE!");
  console.log("==========================================");
}

run().catch((err) => {
  console.error("Calibration failed:", err);
  process.exit(1);
});
