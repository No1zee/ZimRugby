# ADR 0001 — Editorial status and schedule are orthogonal axes

- Status: **Accepted** (2026-08-18)
- Context: Domain-modeling session (grill-with-docs) on the admin domain model.
- Related: `CONTEXT.md` glossary terms "Status", "Schedule", "Match status".

## Decision

Two independent axes describe any staff-managed item, and the codebase must not conflate
them:

1. **Status** — the editorial workflow: `draft` → `in_review` → `approved` → `published`
   (→ `archived`).
2. **Schedule** — the public visibility window: `publish_at`/`expire_at` (news),
   `start_date`/`end_date` (campaigns, announcements).

Additionally:

- Campaign status value `active` was renamed to `running` (a campaign in its schedule
  window is *running*, not "active" as if it were an editorial state).
- Match stored statuses are `upcoming | live | final | cancelled`; the UI label for
  `final` is "Completed"; the public-facing vocabulary is `upcoming | live | completed`
  with no "finished" variant. Results live in `result_outcome`, never in the status.
- No one approves their own work. The reviewer is the editor role (plus super admin);
  authorship is tracked with `created_by_email` (server-set on create, hidden from the
  client).

## Why

The grilling surfaced three model collisions that produced wrong copy and wrong behavior:

- "active" appeared in both axes (a status option *and* a live-window state) — one value,
  two meanings.
- "finished" duplicated "completed" in match vocabulary while the stored value was
  `final` — three names for one state.
- Reviewers could approve their own items — the stated rule "the content manager approves
  all work done by everyone else" was not enforced.

These are surprising to future editors (naming) and hard to reverse once data accumulates
(renaming stored values), so they are recorded here.

## Consequences

- Renaming `active` → `running` was safe: prod campaigns collection was empty at the time.
  Any future collection using `active` as an editorial status should be migrated to the
  canonical status set.
- `final` stays the stored value (matches Directus/API consumers); only display labels and
  the public `MatchCard` vocabulary change.
- New items can be approved-but-not-yet-live (status `approved` + future schedule window)
  or live-while-being-revised (status `in_review` + active window). UI copy must always
  render status and window separately.