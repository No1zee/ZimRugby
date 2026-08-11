#!/usr/bin/env node
/**
 * Production smoke test for ZRU (ZimRugby).
 *
 * Verifies, against live prod:
 *   1. Site routes respond (/, /admin-login, /admin)
 *   2. Directus read: teams/opponents/competitions/venues full records
 *   3. Directus write round-trip: venue create -> patch -> delete (uuid PK)
 *   4. News admin fetch supports limit 500
 *   5. Admin role drift (OPTIONAL): editor login returns the "teams" tab —
 *      skips silently when EDITOR_EMAIL/EDITOR_PASSWORD are not available.
 *
 * Exit code: 0 = all PASS, 1 = any FAIL. Skips never fail.
 *
 * Usage:
 *   node scripts/smoke-test.mjs
 *   EDITOR_EMAIL=editor@zimrugby.co.zw EDITOR_PASSWORD=... node scripts/smoke-test.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function env(key) {
  if (process.env[key]) return process.env[key];
  const local = join(root, ".env.local");
  if (existsSync(local)) {
    const m = new RegExp(`^${key}=(.*)$`, "m").exec(readFileSync(local, "utf8"));
    if (m) return m[1].trim().replace(/^"|"$/g, "");
  }
  return undefined;
}

const SITE = process.env.SMOKE_SITE || "https://zimrugby.vercel.app";
const CMS = process.env.SMOKE_CMS || "https://zru-directus-cms-production.up.railway.app";
const TOKEN = env("DIRECTUS_TOKEN");

const results = [];
function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function get(url, opts = {}) {
  const res = await fetch(url, opts);
  return { status: res.status, json: await res.json().catch(() => null) };
}

async function cms(path, { method = "GET", body } = {}) {
  return get(CMS + path, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function main() {
  if (!TOKEN) {
    console.error("SKIP  DIRECTUS_TOKEN not found (env or .env.local)");
  } else {
    // 1. Site routes
    for (const [path, expected] of [
      ["/", 200],
      ["/admin-login", 200],
      ["/admin", 307],
    ]) {
      const res = await fetch(SITE + path, { redirect: "manual" }).catch(() => null);
      record(`site ${path} -> ${expected}`, res?.status === expected, res ? `got ${res.status}` : "unreachable");
    }

    // 2. Read round-trip
    for (const [coll, min] of [["teams", 1], ["opponents", 1], ["competitions", 1], ["venues", 1]]) {
      const { status, json } = await cms(`/items/${coll}?fields=*&limit=200`);
      const n = json?.data?.length ?? 0;
      record(`cms read ${coll}`, status === 200 && n >= min, `status ${status}, ${n} rows`);
    }

    // 3. Write round-trip on a text-PK collection
    const vid = randomUUID();
    const name = `Smoke Test Venue ${vid.slice(0, 8)}`;
    let ok = true, detail = "";
    let s, j;
    ({ status: s, json: j } = await cms("/items/venues", { method: "POST", body: { id: vid, name, status: "draft" } }));
    if (s !== 200) { ok = false; detail = `create ${s}`; }
    else {
      ({ status: s, json: j } = await cms(`/items/venues/${vid}`, { method: "PATCH", body: { city: "Harare" } }));
      if (s !== 200) { ok = false; detail = `patch ${s}`; }
      else {
        ({ status: s, json: j } = await cms(`/items/venues/${vid}`, { method: "DELETE" }));
        if (s !== 204) { ok = false; detail = `delete ${s}`; }
      }
    }
    record("cms write round-trip (venue)", ok, ok ? "create/patch/delete OK" : detail);

    // 4. News cap
    const news = await cms("/items/news?fields=*&limit=500");
    record("cms news limit 500", news.status === 200, `status ${news.status}, ${news.json?.data?.length ?? 0} rows`);
  }

  // 5. Role drift (optional)
  const editorEmail = env("EDITOR_EMAIL");
  const editorPassword = env("EDITOR_PASSWORD");
  if (editorEmail && editorPassword) {
    const loginRes = await fetch(`${SITE}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: editorEmail, password: editorPassword }),
    });
    const login = await loginRes.json().catch(() => null);
    if (login?.mfaRequired) {
      record("admin role drift (editor -> teams tab)", false, "MFA required — cannot verify without TOTP");
    } else if (!login?.success) {
      record("admin role drift (editor -> teams tab)", false, `login failed: ${login?.error || loginRes.status}`);
    } else {
      const cookies = (loginRes.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
      const checkRes = await fetch(`${SITE}/api/admin/auth/check`, { headers: { Cookie: cookies } });
      const json = await checkRes.json().catch(() => null);
      const tabs = json?.user?.permissions?.tabs ?? [];
      record("admin role drift (editor -> teams tab)", Array.isArray(tabs) && tabs.includes("teams"), `tabs=${JSON.stringify(tabs)}`);
    }
  } else {
    console.log("SKIP  editor role drift check (set EDITOR_EMAIL/EDITOR_PASSWORD to enable)");
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length > 0) {
    console.error(`FAILED: ${failed.map((f) => f.name).join(", ")}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("FATAL", err);
  process.exit(1);
});
