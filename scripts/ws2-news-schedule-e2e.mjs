const BASE = "https://zru-directus-cms-production.up.railway.app";
const SITE = "https://zimrugby.vercel.app";
const ADMIN = process.env.ZRU_ADMIN_TOKEN;
const READ = process.env.ZRU_READ_TOKEN;

const readFetch = (path) =>
  fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${READ}` } });

const api = (path, opts = {}) =>
  fetch(`${BASE}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${ADMIN}`, "Content-Type": "application/json", ...(opts.headers || {}) },
  });

const slug = `ws2-schedule-probe-${Date.now()}`;
const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

try {
  // 1. Create article scheduled for the FUTURE (should be hidden from public)
  const future = new Date(Date.now() + 2 * 3600 * 1000).toISOString();
  const createRes = await api("/items/news", {
    method: "POST",
    body: JSON.stringify({
      title: "WS2 Schedule Probe",
      slug,
      excerpt: "E2E probe for publish_at/expire_at",
      body: "<p>probe</p>",
      category: "NEWS",
      date: new Date().toISOString().slice(0, 10),
      status: "published",
      publish_at: future,
    }),
  });
  check("create scheduled article (publish_at future)", createRes.ok, `http=${createRes.status}`);
  const created = await createRes.json();
  const id = created.data.id;

  // 2. Public site must NOT show it (media page + RSS are the real surfaces)
  const mediaBefore = await (await fetch(`${SITE}/media`)).text();
  check("media page hides future-scheduled article", !mediaBefore.includes(slug));
  const rssBefore = await (await fetch(`${SITE}/feed.xml`)).text();
  check("RSS feed excludes scheduled article", !rssBefore.includes(slug));

  // 5. Patch publish_at to the past -> should become visible
  const patchRes = await api(`/items/news/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ publish_at: new Date(Date.now() - 3600 * 1000).toISOString() }),
  });
  check("patch publish_at to past", patchRes.ok, `http=${patchRes.status}`);

  let visibleOnMedia = false;
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const media = await (await fetch(`${SITE}/media`)).text();
    if (media.includes(slug)) { visibleOnMedia = true; break; }
  }
  check("media page shows article after go-live", visibleOnMedia);

  // 6. Now expire it -> hidden again
  const expireRes = await api(`/items/news/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ expire_at: new Date(Date.now() - 60 * 1000).toISOString() }),
  });
  check("set expire_at in the past", expireRes.ok, `http=${expireRes.status}`);

  let hiddenFromMedia = false;
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const media = await (await fetch(`${SITE}/media`)).text();
    if (!media.includes(slug)) { hiddenFromMedia = true; break; }
  }
  check("media page hides expired article", hiddenFromMedia);

  // 7. Admin list still shows it (admins manage all rows) — BEFORE cleanup
  const adminList = await api("/items/news?limit=500&fields=id,title,publish_at,expire_at");
  const adminRows = await adminList.json();
  const row = adminRows.data.find((n) => String(n.id) === String(id));
  check("admin API still lists scheduled/expired row", !!row, row ? `publish_at=${row.publish_at} expire_at=${row.expire_at}` : "row missing");

  // Also confirm the visible-check window held: article was hidden BEFORE expire patch
  const stillVisibleBeforeExpire = visibleOnMedia && hiddenFromMedia;
  check("article visible while active, hidden after expire", stillVisibleBeforeExpire);

  // 8. Cleanup: hard delete probe
  const delRes = await api(`/items/news/${id}`, { method: "DELETE" });
  check("cleanup probe deleted", delRes.status === 204, `http=${delRes.status}`);
} catch (e) {
  check("probe run", false, e.message);
}

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);