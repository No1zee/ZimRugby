/**
 * Adds deleted_at / deleted_by to every non-system Directus collection.
 * Idempotent: skips collections that already have both fields.
 * Usage: node scripts/add-soft-delete-fields.mjs
 */
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://zru-directus-cms-production.up.railway.app";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

async function api(path, options = {}) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok && res.status !== 400) {
    throw new Error(`${options.method || "GET"} ${path} -> ${res.status}: ${await res.text()}`);
  }
  return res.json().catch(() => null);
}

async function main() {
  if (!DIRECTUS_TOKEN) {
    console.error("DIRECTUS_TOKEN required");
    process.exit(2);
  }

  const { data: collections } = await api("/collections");
  const targets = collections
    .map((c) => c.collection)
    .filter((name) => !name.startsWith("directus_") && !name.startsWith("supabase"));

  const added = [];
  const skipped = [];

  for (const name of targets) {
    if (name === "folders" || name === "roles" || name === "users" || name === "shares" || name === "presets" || name === "operations" || name === "flows" || name === "notifications" || name === "panels" || name === "dashboards" || name === "permissions" || name === "policies" || name === "access" || name === "versions" || name === "revisions" || name === "activity" || name === "comments") {
      skipped.push(`${name} (system-ish)`);
      continue;
    }
    let existing = [];
    try {
      const fieldsRes = await api(`/fields/${name}`);
      existing = (fieldsRes.data || []).map((f) => f.field);
    } catch {
      skipped.push(`${name} (fields unreadable)`);
      continue;
    }
    if (existing.includes("deleted_at") && existing.includes("deleted_by")) {
      skipped.push(name);
      continue;
    }
    if (!existing.includes("deleted_at")) {
      await api(`/fields/${name}`, {
        method: "POST",
        body: JSON.stringify({ field: "deleted_at", type: "timestamp", meta: { hidden: true, readonly: false }, schema: { nullable: true, default: null } }),
      });
    }
    if (!existing.includes("deleted_by")) {
      await api(`/fields/${name}`, {
        method: "POST",
        body: JSON.stringify({ field: "deleted_by", type: "string", meta: { hidden: true, readonly: false }, schema: { nullable: true, default: null } }),
      });
    }
    added.push(name);
  }

  console.log(`ADDED soft-delete fields to ${added.length} collections:`);
  console.log(added.join(", "));
  console.log(`SKIPPED ${skipped.length}: ${skipped.join(", ")}`);
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});