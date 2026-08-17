// Create missing collections footer_navigation + referee_resources on prod
// (Postgres migration gap — both were empty in the old SQLite backup, and
// they were never created on Postgres. Site code + admin panels reference
// them; directusFetch 403s at build → local fallback. This restores parity.)
const BASE = "https://zru-directus-cms-production.up.railway.app";
const ADMIN = "zru-directus-admin-bd92e3c6572c02320b494e2bfa5f9d888d780879debdae60";
const api = (path, opts = {}) =>
  fetch(`${BASE}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${ADMIN}`, "Content-Type": "application/json", ...(opts.headers || {}) },
  });

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function createCollection(name) {
  const res = await api("/collections", {
    method: "POST",
    body: JSON.stringify({
      collection: name,
      meta: { collection: name, note: "Site content collection", accountability: "all" },
      schema: { name },
      fields: [
        { field: "id", type: "integer", meta: { hidden: true, interface: "input", readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
        { field: "status", type: "string", meta: { interface: "select", options: { choices: [{ text: "Published", value: "published" }, { text: "Draft", value: "draft" }] } }, schema: { default_value: "published" } },
        { field: "sort", type: "integer", meta: { interface: "input", hidden: true } },
        { field: "deleted_at", type: "timestamp", meta: { hidden: true, special: ["date-cast"] }, schema: { nullable: true } },
        { field: "deleted_by", type: "uuid", meta: { hidden: true, special: ["m2o"], interface: "select-dropdown-m2o" }, schema: { nullable: true } },
      ],
    }),
  });
  check(`create collection ${name}`, res.ok, `http=${res.status}`);
  return res.ok;
}

const FOOTER_FIELDS = [
  { field: "column_title", type: "string", meta: { interface: "input", required: true, note: "Footer column heading (e.g. About ZRU)" } },
  { field: "links", type: "json", meta: { interface: "input-multiline", note: 'JSON array: [{"label":"Governance","href":"/about/governance"}]' } },
];

const REFEREE_FIELDS = [
  { field: "title", type: "string", meta: { interface: "input", required: true } },
  { field: "category", type: "string", meta: { interface: "select", options: { choices: [{ text: "Laws", value: "laws" }, { text: "Guides", value: "guides" }, { text: "Forms", value: "forms" }, { text: "Safeguarding", value: "safeguarding" }] } }, schema: { default_value: "laws" } },
  { field: "description", type: "text", meta: { interface: "input-multiline" } },
  { field: "size", type: "string", meta: { interface: "input", note: "File size label (e.g. 1.2 MB)" } },
  { field: "download_url", type: "string", meta: { interface: "input", note: "Document URL or /api/assets/{uuid}" } },
  { field: "file", type: "string", meta: { interface: "input", hidden: true }, schema: { nullable: true } },
];

async function addFields(collection, fields) {
  for (const f of fields) {
    const res = await api(`/fields/${collection}`, { method: "POST", body: JSON.stringify(f) });
    if (!res.ok) {
      const body = await res.text();
      check(`add field ${collection}.${f.field}`, false, `http=${res.status} ${body.slice(0, 120)}`);
      return false;
    }
  }
  check(`fields added for ${collection} (${fields.length})`, true);
  return true;
}

try {
  if (await createCollection("footer_navigation")) await addFields("footer_navigation", FOOTER_FIELDS);
  if (await createCollection("referee_resources")) await addFields("referee_resources", REFEREE_FIELDS);

  // Verify admin + read-token reads now 200
  for (const coll of ["footer_navigation", "referee_resources"]) {
    const adminRes = await api(`/items/${coll}?limit=5`);
    check(`admin reads ${coll}`, adminRes.ok, `http=${adminRes.status}`);
    const readRes = await fetch(`${BASE}/items/${coll}?limit=5`, {
      headers: { Authorization: "Bearer zru-directus-readonly-0e5e7a2e04f64c9b847ad2b9c7c0b5e6" },
    });
    check(`read-token reads ${coll}`, readRes.ok, `http=${readRes.status}`);
  }
} catch (e) {
  check("collection creation run", false, e.message);
}

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
