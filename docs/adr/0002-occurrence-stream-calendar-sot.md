# ADR 0002 — The occurrence stream is the calendar's single source of truth

- Status: **Accepted** (2026-08-18)
- Context: Events & calendar domain grilling (grill-with-docs, round 2) after the admin
  domain-model round (ADR 0001). An explore-agent fact sheet surfaced ~30 naming
  collisions across the events/calendar surface.
- Related: `CONTEXT.md` glossary terms "Occurrence", "Event", "Calendar feed", "CAT".

## Decision

The calendar has exactly one source of truth: the occurrence stream in
`src/lib/calendar/occurrences.ts`, which normalizes four source kinds into one
`CalendarOccurrence` shape:

1. `event_occurrences` rows (published events, `visibility != internal`),
2. raw `matches` rows (via `kickoff_at`, CAT wall time),
3. announcement schedule windows (non-ticker),
4. campaign schedule windows.

Consequences for the rest of the codebase:

- **Status and time come from the occurrence**, never from the legacy `events.date` /
  `events.time` fields. `getEvents()` derives each event's status with
  `deriveEventStatusFromOccurrence(startsAt, endsAt, now)` and its `isAllDay` from the
  primary occurrence.
- The admin Events panel writes through to the occurrence and **preserves** an
  occurrence's `status`/`sequence` on patch; `confirmed`/`0` are only set at create.
- A campaign appears on the calendar **only when `published` or `running`** — a draft
  campaign must never leak to the public feed.
- `/api/calendar.ics` is the only public calendar artifact (RFC 5545); `/api/calendar`
  is a 301 redirect to it.
- Every wall time is CAT (`Africa/Harare`, UTC+2, no DST). Naive stored times (match
  `kickoff_at`) are interpreted as CAT, never `+00:00`.
- The public calendar UI vocabulary is "event"; "fixture" means a match, and only where
  matches are shown as matches.

## Why

The collisions produced wrong output and wrong copy:

- Events derived their status from the legacy event date/time, so a cancelled or moved
  occurrence was mislabeled ("Today"/"Ended") and events without occurrences could
  render phantom entries.
- Two feed endpoints existed (`/api/calendar` and `/api/calendar.ics`); the one that
  served consumers was ambiguous, and both carried `s-maxage=3600`, which parked
  hour-old content on the Vercel edge cache that `revalidateTag` cannot reach for a
  force-dynamic route — cancels and schedule changes lingered for up to an hour
  (verified `x-vercel-cache: HIT`, `age: 688`).
- Campaign drafts appeared in the public feed (no status gate).
- A dead `occurrencesOnDay` helper implied a second, unmaintained stream.
- "Fixture" and "event" were used interchangeably in public UI copy.

## Consequences

- Dead code removed (`occurrencesOnDay`); legacy event date/time fields no longer drive
  any calendar behavior (kept in schema for history).
- Cancellations propagate: occurrence `status: cancelled` + `sequence: +1` →
  `STATUS:CANCELLED` in the feed, bounded by the 60s `s-maxage` (down from 3600) plus
  the Directus revalidate flow.
- New calendar sources (e.g. tournaments) join the stream as a fifth kind rather than
  spawning a parallel endpoint.
- The 301 keeps old `/api/calendar` consumers working; new consumers use
  `/api/calendar.ics`.
- Live-verified 2026-08-18: E2E probe 14/14 (feed shows event + `STATUS:CONFIRMED` with
  `TZID=Africa/Harare` wall time, campaign slug links, all-day `VALUE=DATE`, cancel →
  `STATUS:CANCELLED`, draft campaign leaves the feed, `/events` 200, probes cleaned).
