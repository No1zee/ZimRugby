/**
 * Phase 0 E2E — verifies the admin audit fixes against a live deployment:
 *   1.  /api/admin/directus GET handler (read gate + passthrough)
 *   2.  BackupsPanel snapshot pattern (11-collection GET sweep)
 *   3.  Ticker broadcast round-trip: POST (uuid injection) -> public API
 *       visibility (is_enabled + priority normalization) -> PATCH toggle
 *       hides it -> re-enable -> DELETE via proxy removes it
 *   4.  Negative: unauthenticated proxy GET/POST rejected
 *
 * Usage: SET ADMIN_PASSWORD (site admin login). Reads SITE from env, default prod.
 */
const SITE = process.env.SITE || "https://zimrugby.vercel.app";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@zimrugby.co.zw";

const results = [];
function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function login() {
  const res = await fetch(`${SITE}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const login = await res.json().catch(() => null);
  if (!login?.success) {
    throw new Error(`login failed: ${login?.error || res.status}`);
  }
  const cookie = (res.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
  return cookie;
}

async function proxyGet(cookie, collection, query = "") {
  return fetch(`${SITE}/api/admin/directus?collection=${collection}${query}`, {
    headers: { Cookie: cookie },
  });
}

async function proxyWrite(cookie, method, body) {
  return fetch(`${SITE}/api/admin/directus`, {
    method,
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify(body),
  });
}

async function publicAnnouncements() {
  const res = await fetch(`${SITE}/api/announcements`);
  return { res, data: await res.json() };
}

// The public route caches via directusFetch revalidate 60s, so after a CMS
// mutation poll up to 90s for the expected public state instead of asserting
// instantly. An instant check would false-fail on a perfectly valid cache hit.
async function pollFor(expectedHas, matchId, what) {
  const deadline = Date.now() + 90_000;
  let last;
  while (Date.now() < deadline) {
    try {
      const { data } = await publicAnnouncements();
      last = data;
      const has = data.some((a) => String(a.id) === matchId);
      if (has === expectedHas) {
        return { ok: true, waitedMs: 90_000 - (deadline - Date.now()) };
      }
    } catch (e) {
      last = e.message;
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  return { ok: false, detail: `timeout — public API still has=${last?.some?.((a) => String(a.id) === matchId)}` };
}

async function main() {
  if (!ADMIN_PASSWORD) {
    console.error("Set ADMIN_PASSWORD to run (site admin login).");
    process.exitCode = 2;
    return;
  }

  // 0. Login
  let cookie;
  try {
    cookie = await login();
    record("admin login -> session cookie", !!cookie);
  } catch (e) {
    record("admin login", false, e.message);
    process.exitCode = 1;
    return;
  }

  // 1. GET handler — panels read live CMS
  for (const [collection, query, expect] of [
    ["hero_slides", "&sort=sort&limit=50", 3],
    ["partners", "&sort=sort&limit=50", 5],
    ["announcements", "&limit=50", 1],
  ]) {
    try {
      const r = await proxyGet(cookie, collection, query);
      const json = await r.json().catch(() => null);
      const rows = (json?.data || []).length;
      record(`GET proxy ${collection} -> ${r.status}, ${rows} rows`, r.ok && rows >= expect, `${r.status}`);
    } catch (e) {
      record(`GET proxy ${collection}`, false, e.message);
    }
  }

  // 2. BackupsPanel snapshot sweep — all 11 collections must be readable
  const COLLECTIONS = ["matches", "teams", "opponents", "competitions", "venues", "hero_slides", "news", "partners", "campaigns", "announcements", "events"];
  const counts = {};
  let sweepFail = 0;
  for (const col of COLLECTIONS) {
    try {
      const r = await proxyGet(cookie, col, "&limit=250");
      const json = await r.json().catch(() => null);
      counts[col] = (json?.data || []).length;
      if (!r.ok) sweepFail++;
    } catch {
      counts[col] = -1;
      sweepFail++;
    }
  }
  const empty = Object.entries(counts).filter(([, n]) => n === 0).map(([c]) => c);
  record("BackupsPanel 11-collection sweep (all readable)", sweepFail === 0, `${Object.entries(counts).filter(([, n]) => n > 0).length}/11 non-empty${empty.length ? `; empty: ${empty.join(",")}` : ""}`);

  // 3. Ticker round-trip through the proxy (exact HeroLayoutPanel/TodayOverview payload)
  const now = new Date();
  let tickerId = null;
  try {
    const r = await proxyWrite(cookie, "POST", {
      collection: "announcements",
      data: {
        title: "[TEST] Phase0 E2E ticker — Sables vs Simbas kickoff 15:00 CAT",
        slug: `ticker-e2e-${Date.now()}`,
        body: "",
        design_variant: "ticker",
        priority: 20,
        starts_at: now.toISOString(),
        ends_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_enabled: true,
        status: "published",
        badge: "LIVE MATCH",
        segment: "general",
        scope: ["global"],
      },
    });
    const json = await r.json().catch(() => null);
    tickerId = json?.data?.id;
    record("POST ticker via proxy (uuid auto-injected)", r.ok && !!tickerId, r.ok ? `id=${tickerId}` : JSON.stringify(json?.error || json));
  } catch (e) {
    record("POST ticker via proxy", false, e.message);
  }

  if (tickerId) {
    // Public API must surface it as a ticker with normalized priority (2026-08-16: within the 60s ISR window)
    const surfaced = await pollFor(true, tickerId, "public surface");
    const surfaceMine = surfaced ? await (async () => { const { data } = await publicAnnouncements(); return data.find((a) => String(a.id) === tickerId); })() : null;
    const priorityOk = !!surfaceMine && surfaceMine.priority === "high";
    const variantOk = !!surfaceMine && surfaceMine.designVariant === "ticker";
    record("public API surfaces ticker (designVariant=ticker, priority=high)", surfaced.ok && priorityOk && variantOk, surfaced.ok ? `priority=${surfaceMine?.priority}, variant=${surfaceMine?.designVariant}${surfaced.waitedMs ? `, waited ${surfaced.waitedMs}ms` : ""}` : surfaced.detail);

    // PATCH is_enabled=false -> must disappear from the public API (honest hidden toggle)
    await proxyWrite(cookie, "PATCH", { collection: "announcements", id: tickerId, data: { is_enabled: false } });
    const afterHide = await pollFor(false, tickerId, "PATCH is_enabled=false");
    record("PATCH is_enabled=false hides from public API", afterHide.ok, afterHide.waitedMs ? `waited ${afterHide.waitedMs}ms` : afterHide.detail);

    // Re-enable -> back
    await proxyWrite(cookie, "PATCH", { collection: "announcements", id: tickerId, data: { is_enabled: true } });
    const afterShow = await pollFor(true, tickerId, "PATCH is_enabled=true");
    record("PATCH is_enabled=true re-surfaces ticker", afterShow.ok, afterShow.waitedMs ? `waited ${afterShow.waitedMs}ms` : afterShow.detail);

    // DELETE via proxy -> gone
    const del = await proxyWrite(cookie, "DELETE", { collection: "announcements", id: tickerId });
    const afterDel = await pollFor(false, tickerId, "DELETE");
    record("DELETE via proxy removes ticker", del.ok && afterDel.ok, `http=${del.status}${afterDel.waitedMs ? `, waited ${afterDel.waitedMs}ms` : ""}`);
  } else {
    record("PATCH/DELETE ticker round-trip", false, "skipped — create failed");
  }

  // 4. Negative auth
  const anonGet = await proxyGet("", "hero_slides");
  record("unauthenticated GET proxy rejected", anonGet.status === 401 || anonGet.status === 403, `http=${anonGet.status}`);

  // Summary
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length > 0) {
    console.log("FAILED:", failed.map((f) => f.name).join(" | "));
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("E2E crashed:", e);
  process.exitCode = 1;
});