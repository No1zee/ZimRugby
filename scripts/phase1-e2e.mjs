/**
 * Phase 1 E2E — soft delete, trash/restore, purge gating, and CRUD audit.
 * Runs against a live deployment.
 *
 * Flow: create ticker (uuid) -> public surface -> PATCH diff -> audit rows
 * (CREATE + UPDATE) -> soft DELETE (trash) -> public hidden -> trash lists
 * row with SAME id -> restore -> public back -> editor hard-delete 403 ->
 * super_admin hard-delete (purge) -> trash empty.
 */
const SITE = process.env.SITE || "https://zimrugby.vercel.app";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const EDITOR_PASSWORD = process.env.EDITOR_PASSWORD;

const results = [];
function record(name, ok, detail = "") {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function login(email, password) {
  const res = await fetch(`${SITE}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const login = await res.json().catch(() => null);
  if (!login?.success) throw new Error(`login failed: ${login?.error || res.status}`);
  return (res.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
}

async function proxyJson(cookie, method, body) {
  return fetch(`${SITE}/api/admin/directus`, {
    method,
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function trashGet(cookie, collection) {
  return fetch(`${SITE}/api/admin/directus/trash?collection=${encodeURIComponent(collection)}`, { headers: { Cookie: cookie } });
}

async function trunkPost(cookie, body) {
  return fetch(`${SITE}/api/admin/directus/trash`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify(body),
  });
}

async function publicAnn() {
  return (await (await fetch(`${SITE}/api/announcements`)).json());
}

async function pollFor(expectedHas, matchId) {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    const data = await publicAnn();
    const has = data.some((a) => String(a.id) === matchId);
    if (has === expectedHas) return true;
    await new Promise((r) => setTimeout(r, 5000));
  }
  return false;
}

async function auditLogs(cookie) {
  const res = await fetch(`${SITE}/api/admin/audit-logs`, { headers: { Cookie: cookie } });
  const json = await res.json().catch(() => null);
  return (json?.logs || []);
}

async function main() {
  if (!ADMIN_PASSWORD || !EDITOR_PASSWORD) {
    console.error("Set ADMIN_PASSWORD and EDITOR_PASSWORD");
    process.exitCode = 2;
    return;
  }

  let admin, editor;
  try {
    admin = await login("admin@zimrugby.co.zw", ADMIN_PASSWORD);
    record("super_admin login", !!admin);
  } catch (e) {
    record("super_admin login", false, e.message);
    return;
  }
  try {
    editor = await login("editor@zimrugby.co.zw", EDITOR_PASSWORD);
    record("editor login", !!editor);
  } catch (e) {
    record("editor login", false, e.message);
    return;
  }

  const now = new Date();
  let id = null;
  const slug = `phase1-e2e-${Date.now()}`;

  // 1. Create
  try {
    const r = await proxyJson(admin, "POST", {
      collection: "announcements",
      data: {
        title: "[TEST] Phase1 E2E soft-delete round trip",
        slug,
        body: "",
        design_variant: "ticker",
        priority: 20,
        starts_at: now.toISOString(),
        ends_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_enabled: true,
        status: "published",
        badge: "TEST",
        segment: "general",
        scope: ["global"],
      },
    });
    const json = await r.json().catch(() => null);
    id = json?.data?.id;
    record("POST create (uuid injected)", r.ok && !!id, r.ok ? `id=${id}` : JSON.stringify(json));
  } catch (e) {
    record("POST create", false, e.message);
    return;
  }

  // 2. Public surface (within ISR window)
  record("public API shows created item", await pollFor(true, id));

  // 3. PATCH + diff in audit
  try {
    const r = await proxyJson(admin, "PATCH", { collection: "announcements", id, data: { badge: "UPDATED" } });
    record("PATCH update", r.ok);
  } catch (e) {
    record("PATCH update", false, e.message);
  }

  // 4. Audit rows for CREATE + UPDATE on this item
  try {
    const logs = await auditLogs(admin);
    const mine = logs.filter((l) => l.resource && String(l.resource).includes(String(id)));
    const hasCreate = mine.some((l) => l.action === "CREATE" && l.actorEmail === "admin@zimrugby.co.zw");
    const hasUpdate = mine.some((l) => l.action === "UPDATE");
    record("audit trail: CREATE + UPDATE logged with actor", hasCreate && hasUpdate, `found ${mine.length} row(s)`);
  } catch (e) {
    record("audit trail read", false, e.message);
  }

  // 5. Soft delete -> public hidden + trash has SAME id
  let softOk = false;
  try {
    const r = await proxyJson(admin, "DELETE", { collection: "announcements", id });
    softOk = r.ok && (await pollFor(false, id)) === true;
  } catch (e) {
    record("soft delete", false, e.message);
  }
  record("soft DELETE hides from public", softOk);
  try {
    const r = await trashGet(admin, "announcements");
    const rows = (await r.json().catch(() => ({ data: [] }))).data || [];
    const mine = rows.find((row) => String(row.id) === String(id));
    record("trash lists row with SAME id", r.ok && !!mine && !!mine.deleted_at, mine ? `deleted_at=${mine.deleted_at ? "set" : "null"}` : "not in trash");
  } catch (e) {
    record("trash list", false, e.message);
  }

  // 6. Restore -> public back (same id, links survive)
  try {
    const r = await trunkPost(admin, { collection: "announcements", action: "restore", id });
    const back = await pollFor(true, id);
    record("restore: same row live again (links survive)", r.ok && back, `http=${r.status}`);
  } catch (e) {
    record("restore", false, e.message);
  }

  // 7. Editor cannot hard-delete (403)
  try {
    const r = await proxyJson(editor, "DELETE", { collection: "announcements", id, hard: true });
    record("editor hard-delete blocked (403)", r.status === 403, `http=${r.status}`);
  } catch (e) {
    record("editor hard-delete", false, e.message);
  }

  // 8. Super admin purge (hard delete) -> trash empty + public gone
  try {
    const r = await proxyJson(admin, "DELETE", { collection: "announcements", id, hard: true });
    const trash = await trashGet(admin, "announcements");
    const rows = (await trash.json().catch(() => ({ data: [] }))).data || [];
    record("super_admin hard-delete (purge) works", r.ok && !rows.some((row) => String(row.id) === String(id)), `http=${r.status}, trash rows now=${rows.length}`);
  } catch (e) {
    record("super_admin purge", false, e.message);
  }

  // 9. Negative auth
  try {
    const r = await trashGet("", "announcements");
    record("unauthenticated trash GET rejected", r.status === 401, `http=${r.status}`);
  } catch (e) {
    record("neg auth trash", false, e.message);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    console.log("FAILED:", failed.map((f) => f.name).join(" | "));
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("Phase 1 E2E crashed:", e);
  process.exitCode = 1;
});