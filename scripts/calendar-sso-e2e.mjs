// Calendar SSoT E2E â€” event_occurrences stream (WS-Calendar)
// Covers: create event + occurrence â†’ ICS zoned DTSTART â†’ /events shows it â†’
// detail page â†’ cancel (STATUS:CANCELLED + SEQUENCE) â†’ cleanup.
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

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` â€” ${detail}` : ""}`);
}

const probeTitle = `Calendar SSoT Probe ${Date.now()}`;
let eventId = null;
let occId = null;

try {
  // 1. Create the probe event (published, public)
  const eventRes = await api("/items/events", {
    method: "POST",
    body: JSON.stringify({
      title: probeTitle,
      subtitle: "E2E occurrence stream probe",
      page_type: "general",
      category: "National Team",
      tags: ["National"],
      status: "published",
      event_type: "event",
      visibility: "public",
    }),
  });
  check("create probe event", eventRes.ok, `http=${eventRes.status}`);
  eventId = (await eventRes.json()).data.id;

  // 2. Create one occurrence: 2026-09-01 18:00 UTC (= 20:00 CAT)
  const occRes = await api("/items/event_occurrences", {
    method: "POST",
    body: JSON.stringify({
      event_id: eventId,
      starts_at: "2026-09-01T18:00:00.000Z",
      all_day: false,
      status: "confirmed",
      sequence: 0,
    }),
  });
  check("create occurrence for event", occRes.ok, `http=${occRes.status}`);
  occId = (await occRes.json()).data.id;

  // 3. ICS feed: UID present, zoned DTSTART in CAT local wall time (20:00)
  let ics = "";
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    ics = await (await fetch(`${SITE}/api/calendar?cb=${Date.now()}`)).text();
    if (ics.includes(`zru-event-${occId}@zimrugby.org`)) break;
  }
  const hasUid = ics.includes(`zru-event-${occId}@zimrugby.org`);
  check("ICS contains occurrence UID", hasUid);
  const occBlock = ics.split("END:VEVENT").find((b) => b.includes(`zru-event-${occId}@zimrugby.org`)) || "";
  check("ICS DTSTART zoned CAT 20:00", occBlock.includes("DTSTART;TZID=Africa/Harare:20260901T200000"), occBlock.match(/DTSTART[^\r\n]*/)?.join(""));
  check("ICS STATUS CONFIRMED", occBlock.includes("STATUS:CONFIRMED"));
  check("ICS SEQUENCE 0", occBlock.includes("SEQUENCE:0"));

  // 4. /events page shows the probe (occurrence-first: appears with a date)
  let onEvents = false;
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const page = await (await fetch(`${SITE}/events`)).text();
    if (page.includes(probeTitle)) { onEvents = true; break; }
  }
  check("/events shows probe event", onEvents);

  // 5. Detail page renders CMS data + time
  let detail = "";
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    detail = await (await fetch(`${SITE}/events/${eventId}`)).text();
    if (detail.includes(probeTitle)) break;
  }
  check("detail page renders CMS event", detail.includes(probeTitle));
  check("detail page shows time 20:00", detail.includes("20:00"));
  check("detail page shows venue TBC", detail.includes("TBC"));

  // 6. Cancel the occurrence (audit standard: keep row, STATUS:CANCELLED + SEQUENCE)
  const cancelRes = await api(`/items/event_occurrences/${occId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "cancelled", sequence: 1 }),
  });
  check("cancel occurrence", cancelRes.ok, `http=${cancelRes.status}`);

  ics = "";
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    ics = await (await fetch(`${SITE}/api/calendar?cb=${Date.now()}`)).text();
    const block = ics.split("END:VEVENT").find((b) => b.includes(`zru-event-${occId}@zimrugby.org`)) || "";
    if (block.includes("STATUS:CANCELLED")) break;
  }
  const cancelledBlock = ics.split("END:VEVENT").find((b) => b.includes(`zru-event-${occId}@zimrugby.org`)) || "";
  check("ICS STATUS:CANCELLED after cancel", cancelledBlock.includes("STATUS:CANCELLED"));
  check("ICS SEQUENCE bumped to 1", cancelledBlock.includes("SEQUENCE:1"));

  // 7. Detail page shows CANCELLED badge (kept on calendar, flagged)
  let detailCancelled = false;
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const d = await (await fetch(`${SITE}/events/${eventId}`)).text();
    if (d.includes("CANCELLED")) { detailCancelled = true; break; }
  }
  check("detail page shows CANCELLED state", detailCancelled);

  // 8. Read token can still list occurrences (grant id=38 works)
  const listRes = await readFetch("/items/event_occurrences?fields=id,event_id,starts_at,status,sequence&limit=500");
  check("read token lists occurrences", listRes.ok, `http=${listRes.status}`);
} catch (e) {
  check("probe run", false, e.message);
} finally {
  // 9. Cleanup: hard-delete probe occurrence + event
  if (occId != null) {
    const delOcc = await api(`/items/event_occurrences/${occId}`, { method: "DELETE" });
    check("cleanup occurrence deleted", delOcc.status === 204, `http=${delOcc.status}`);
  }
  if (eventId != null) {
    const delEv = await api(`/items/events/${eventId}`, { method: "DELETE" });
    check("cleanup event deleted", delEv.status === 204, `http=${delEv.status}`);
  }
  let cleanIcs = "";
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    cleanIcs = await (await fetch(`${SITE}/api/calendar?cb=${Date.now()}`)).text();
    if (!cleanIcs.includes("Calendar SSoT Probe")) break;
  }
  check("no probe leftovers in ICS", !cleanIcs.includes("Calendar SSoT Probe"));
}

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
