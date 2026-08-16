# ZimRugby Admin Portal — Audit & Improvement Plan

**Date:** 2026-08-15
**Status:** Planning only — no code written
**Scope:** Next.js app (`ZimRugby`) + Directus CMS + Supabase auth/audit

---

## 1. Audit summary: the root pattern

The admin portal has one systemic disease with three symptoms:

| Symptom | Files | What's really happening |
|---|---|---|
| **Fake panels** (changes don't persist) | `HeroLayoutPanel.tsx`, `SponsorsPanel.tsx`, TodayOverview broadcast | Local React state only. "Saved!" toasts fire with **zero API calls**. Everything resets on refresh. "Deleted slide persisted" — the delete never happened. |
| **Data-model drift** (admin form ≠ public reader) | `announcements` collection: 3 conflicting field sets (stale `src/lib/directus/schema.ts`, admin form, public mapper `src/lib/api/announcements.ts`) | Admin-created announcements have no `starts_at`/`ends_at`, so the public API's date filter **silently excludes them** — the site only ever shows hardcoded mock data. |
| **Missing lifecycle** (no soft-delete, no audit, no versions) | `/api/admin/directus` proxy, all deletes | Every delete is permanent. "Undo" on text-PK collections re-creates the row **with a new UUID**, orphaning links. CRUD writes are never audit-logged. |

**~60% of the portal works**: CollectionManager generic CRUD (news, teams, opponents, competitions, venues, campaigns, FAQs), Match Centre panel, Events panel, Page Builder, Roles/MFA, Signups (PII-masked). Broken parts concentrated in ~8 places.

---

## 2. Findings by area

### Architecture & stack
- Next.js 16.1.6 App Router, React 19, TypeScript, Tailwind v4; Vercel deploy
- Directus 12.2 (Railway, Postgres 18); plain `fetch` REST — no ORM
- Supabase Auth (roles in `app_metadata.role`, MFA/AAL2), `admin_roles`, `audit_logs`, `fan_zone_members`, `onboarding_submissions`, `article_views`
- Upstash Redis (KV cache), QStash (queue worker), Vercel Blob, Resend (email), OpenAI (AI writer), node-ical (ICS feeds)
- **PK type split** (CRUD-critical): text/UUID (server-injected) for announcements, matches, pages, teams, opponents, competitions, venues; integer auto-increment for news, events, campaigns, faqs, programmes, grassroots, footer_navigation, players, partners, hero_slides, standings_tables, page_sections

### Data access
- `src/lib/directus/`: `fetch.ts` (directusFetch + ISR tags + Upstash last-known-good fallback + bundled static fallback), `admin-write.ts` (PATCH/POST/DELETE with admin token), `assets.ts` (assetUrl → `/api/assets/{id}`), `client.ts` (@directus/sdk), `cache.ts`
- **Security issue:** public asset proxy `/api/assets/[id]` uses `DIRECTUS_TOKEN || DIRECTUS_ADMIN_TOKEN` (privileged), never the read-only token

### Auth & RBAC
- Supabase email+password, roles: super_admin / editor / media_manager / viewer; middleware protects `/admin`, `/dashboard`, `/portal`
- Server gates: `requireAdmin` (session + role + MFA AAL2), `requireSuperAdmin`, `requirePermission`, `requireCollectionAction`, `requireFeature` — fail-closed
- **Hardcoded backdoor:** `edwardmagejo@gmail.com` auto-promotes to super_admin in `requireAdmin`
- Rate limiter in-memory (resets on cold start, per-instance)
- Admin users created only via `/api/admin/users` (super_admin); public signups → `onboarding_submissions` only — never admin users

### CRUD / API surface
- Generic proxy `/api/admin/directus` (POST/PATCH/DELETE, role-gated) — **no GET handler (405)**; single + bulk; **no audit logging**
- `CollectionManager.tsx` (~36KB) — the workhorse: FieldConfig-driven generic CRUD, bulk ops, undo, duplicate, status toggles, richtext, image picker
- Per-resource routes: pages (`[slug]`, sections), roles, users, upload, audit-logs, ai, edit/[collection]/[id] (legacy)

### Delete inventory (all hard delete, no soft-delete/archive anywhere)
CollectionManager (single+bulk), MatchCentrePanel, EventsPanel, ResourcesPanel, PageBuilderClient (sections), RolesPanel, AuthPanel logout, admin_roles delete. Undo = re-POST (new UUID for text-PK collections).

---

## 3. User questions → findings

| Question | Finding |
|---|---|
| How does the breaking ticker work? | `AnnouncementsTicker.tsx` is **never mounted** (1 import = its own definition). Reads `announcements` with `designVariant === "ticker"` + date window. Both admin ticker managers are fake or write incompatible records. |
| Hero carousel admin images | Public carousel works (Directus-first + local fallback). Admin panel is local-state only; admin fields (`image_url`, `video_url`, `imagePosition`) partially mismatch public mapper (`image`, `video`, `headline_line1`, `context_pill`, `cta1_label`). |
| Pages: only Match Centre, 0 blocks | `pages` collection has **1 row in prod** (`page_sections`: 2). Page Builder is functional. **No catch-all `/[slug]` route** — CMS pages can't go live without code deploy. |
| Banners/announcements broken + timer idea | 3 conflicting field sets; admin form never sets `starts_at`/`ends_at` → public API excludes records → global bar/ticker/page cards render only hardcoded MOCK items. Homepage `PinnedAnnouncements` (uses `is_enabled`) is the exception and works. Timer fields already exist in schema — no UI exposes them. |
| Calendar as single source of truth | Today: `events`, `matches`, `announcements` are separate collections; public calendar merges events + matches at render. Standard = one Event model + Occurrence records; surfaces subscribe. |
| Resource vault purpose | `referee_resources` (laws/safeguarding/governance/applications). Gap: "Document path" is plain text — **no real file upload**; public referees consumption needs verification/wiring. |
| Partners/sponsors tiers | Tiers drive homepage `SponsorGrid` logo wall + `/partners` page (**hardcoded static list**, not CMS). SponsorsPanel is a stub (local state). Bug: click-tracking route queries `sponsors` (doesn't exist; prod has `partners`). |
| Mailing list | **No newsletter exists.** Closest: Fan Zone signup → Supabase + optional Resend welcome + localStorage mock. `crm.ts` and `mockStorage.ts` are mocks. |
| Signups appearing in admin users | Public signups → `onboarding_submissions`/`fan_zone_members` (Fans & Operations), never admin users (invite-only). Labeling confusion — make staff/fan boundary explicit. |
| Deleted slide persisted | HeroLayoutPanel delete is local-state only — nothing was ever deleted. |
| Ticketing | No admin UI; public-only tickets page reads Directus `tickets` (unverified/absent), Ticketmaster adapter uses `countryCode=CA`, "register interest" → localStorage mock. |
| CRUD | Generic proxy + CollectionManager; works broadly. Gaps: no GET, no audit, undo breaks UUID-PK links, hard deletes. |
| Auditing/accounting/auth | audit_logs table exists but CRUD never logged (only login/logout, publish, uploads, role ops, PII events, exports). Accounting absent — derive from events-as-source-of-truth. |
| Opponents categorization | `opponents` ALREADY has `team_type` (international/club/province/tour) + country/crest/notes; `teams` has age_grade. Needs UI refinement + u20/u18 categories + fixtures filtering. |
| Delete/undo/archive | Root causes: stubs + hard deletes + undo-new-UUID. Fix = soft delete + trash + restore + retention. |
| "More info = richer site" term | **Content modeling / structured content** ("create once, publish everywhere"). Content strategy = editorial plan; IA = site structure; content modeling = data design. |
| Live preview of site | Standard: draft/published states + secret-gated Draft Mode + per-entity preview + View Site button (WordPress, Sanity, Strapi). Next.js Draft Mode + Vercel Draft Mode are the mechanism. |
| Snapshots & recovery | BackupsPanel broken: GET 405 (no proxy GET), drift check hardcoded "CLEAN", rollback can't undo create/delete, fake collection names (`sponsors`/`resources`), "7-day PITR" copy vs 14-day actual cron. |
| Security & audit logs empty | audit_logs exists; CRUD events never written; Directus `/activity` feeds the stat. |
| Fans & operations | SignupsPanel functional (read-only, PII masking, CSV export, search/pagination). No status workflow, no notes, no follow-up. |
| Volunteer | `/volunteer` is **mailto-only** — no form, no storage, no confirmation. |
| Mailing list | See above — none. |

---

## 4. Industry standards snapshot (research)

| Topic | Standard | References |
|---|---|---|
| Live preview | Draft/Publish states; secret-gated `/api/draft` route; cookie + banner + exit; per-entity Preview button | Next.js Draft Mode, Vercel Draft Mode, Sanity Visual Editing, Strapi 5 Preview, Storyblok |
| Deletion | Soft delete (`deleted_at`, `deleted_by`, retention) + trash UI + restore + scheduled purge; hard delete admin/GDPR-only; partial indexes | WordPress Trash (30-day EMPTY_TRASH_DAYS), Payload CMS Trash, Strapi recycle bin |
| Audit logs | Append-only, before/after diff (not snapshots), same-transaction write (outbox), retention tiers, CSV export, alerts, GDPR-safe (hash actor) | GitHub audit log, WP Activity Log, Jetpack Activity Log |
| Scheduled content | UTC publish windows (`starts_at`/`ends_at`), timezone selector, concurrent items normal, query-time windowing | WordPress `future` status, Contentful scheduled actions (publish/unpublish stacks) |
| Content modeling | Typed content types, reference fields, reusable components, version-controlled schemas | Sanity schema-as-code, Contentful content models, Storyblok components/stories |
| Calendar SSoT | Event model (title/type/visibility/timezone) + Occurrence (start/end/venue/status); one .ics feed; all surfaces subscribe; cancelled = keep row + STATUS:CANCELLED + SEQUENCE | Statamic Events, Manifesto CMS, Adobe AEM |
| Mailing lists | Transactional vs marketing split; double opt-in (pending → confirm link → subscribed); List-Unsubscribe header (RFC 8058); tags/segments; export; GDPR erasure | Resend/SES + Brevo/Mailchimp patterns |
| Internal ticketing | Lifecycle Open → In Progress → Pending → Resolved → Closed; priority; assignee; internal notes vs public comments; attachments; notifications | Jira Service Management (lite), GitHub Issues, Zendesk |
| RBAC | Roles as data; **check permissions, not roles**; least privilege; staff-only admin identity (separate from public users) | WordPress capabilities, WorkOS RBAC guide, Sirv role matrix |
| Admin preview | "View site" header link + "Preview" (iframe or new tab) wired to draft mode; desktop/mobile toggles | WordPress View/Preview, Strapi 5 preview handler, Sanity Presentation |

---

## 5. Workstreams (grouped fixes)

### WS1 — Content modeling foundation
- Single canonical field schema per collection (kill 3 conflicting announcement schemas; source of truth: `src/types/directus-generated.ts`)
- `announcements`: expose `starts_at`/`ends_at`, `scope`, `design_variant`, `cta_label`/`cta_url`, `is_sticky`, `badge` in admin form
- **Calendar as single source of truth**: Event model with `type` (match / event / announcement window / campaign); matches stay in `matches` but events/announcements/fixtures all feed the calendar surface; banners/ticker = views over scheduled events
- Opponents taxonomy: extend `team_type` with age-grade categories (u20s/u18s); surface in fixtures filtering
- Add `deleted_at`/`deleted_by` to all content collections (soft delete foundation)

### WS2 — CRUD engine refactor
- Add GET to `/api/admin/directus` (fixes 405; unlocks snapshots)
- **Audit logging inside the proxy** — every POST/PATCH/DELETE writes actor/action/before-after diff to `audit_logs` in the same request (outbox pattern)
- Soft delete everywhere: proxy DELETE → `deleted_at`; trash/restore endpoints; Undo restores same row (fixes new-UUID bug)
- Scheduled publish: status transitions (draft → scheduled → published) via UTC timestamps, checked at query time
- Replace stub panels with CollectionManager instances (hero_slides, partners)

### WS3 — Fix the fake panels (highest-impact bugs)
- Hero & Layout: real CRUD on `hero_slides` using public mapper field names; ticker manager writes real `announcements` (`design_variant: "ticker"` + dates)
- Sponsors: real CRUD on `partners` with tier dropdown; fix `sponsors` → `partners` in click-tracking route
- TodayOverview broadcast: correct payload + honest toasts
- Delete dead legacy `/admin/matches` page (Save button has no handler)
- Mount `AnnouncementsTicker` on the site so the ticker renders

### WS4 — Banners & announcements with timers
- Admin form: start/end datetime (UTC + timezone selector), scope (global/page), variant (banner/ticker), priority, sticky, CTA, badge
- Multiple concurrent announcements; per-strip precedence (priority → date); expired auto-hide
- "Scheduled" view in admin: upcoming / active / expired with status chips
- Announcements surface on calendar as scheduled items (single source of truth)

### WS5 — Preview & publishing
- View Site button in admin header
- Per-entity Preview → Next.js Draft Mode (`/api/draft?secret=…&slug=…`), cookie-gated, banner + exit
- Draft vs published states per collection; publish = status transition
- Later: Vercel Draft Mode toolbar

### WS6 — Identity, RBAC & security
- Explicit staff vs fan boundary (labeling; admin = invite-only staff)
- Complete role tab grants (13/18 — missing events, teams, audit_logs, backups, roles)
- Replace hardcoded super_admin backdoor with env-configured bootstrap
- Public asset proxy → read-only token
- Fix InactivityLock (password field decorative)

### WS7 — Audit, accounting & export
- Full CRUD audit trail (via WS2), diff-based, filters, CSV export, retention
- "Export all" per collection + working full JSON export
- Accounting: derive reports from calendar-as-source-of-truth (events, tickets, campaigns); exportable

### WS8 — Snapshots & recovery (honest overhaul)
- Fix proxy GET (root cause); correct collection names (`sponsors`/`resources` → `partners`/`referee_resources`)
- Real drift check (report real diffs; no hardcoded "CLEAN")
- Restore = full diff apply (create/update/delete) with dry-run preview
- Honest copy: Railway Postgres 14-day backup (real) vs client-side snapshots (separate tool) + restore runbook

### WS9 — Fans & operations + volunteer + mailing + ticketing
- **Volunteer**: real form → submissions table → admin panel (status: new/contacted/converted/closed) → email notification → thank-you page
- **Mailing list**: newsletter signup with double opt-in + unsubscribe + tags via Resend/SES; admin list management + CSV export; fan-zone signup feeds same list
- **Ticketing** (pinned): MVP = tickets table (Open → In Progress → Pending → Resolved → Closed, priority, assignee, internal notes, screenshot attachments via existing upload endpoint, notifications) — modeled on GitHub Issues
- SignupsPanel: add status workflow + notes (currently read-only)

### WS10 — Usability pass
- One consistent sidebar/nav (two navs today; audit_logs + backups unreachable from top nav)
- Media library panel (browse/reuse assets)
- Honest toasts everywhere; dead-code removal
- Consistent confirm dialogs (replace `window.confirm`); undo everywhere deletes exist
- Resource vault: real file upload + wire public consumption

---

## 6. Phased roadmap

| Phase | Workstreams | Effort | Value |
|---|---|---|---|
| **Phase 0 — Bug kills** | WS3 + WS8 fixes + mount ticker | 2-3 sessions | Everything persists; toasts honest |
| **Phase 1 — Foundation** | WS1 + WS2 | 3-4 sessions | Content model, soft delete, CRUD audit |
| **Phase 2 — Features** | WS4, WS5, WS6, WS8 overhaul | 4-6 sessions | Timers, preview, RBAC, snapshots |
| **Phase 3 — Community** | WS9, WS7, WS10 | 3-4 sessions | Volunteer, mailing, tickets, accounting, polish |

Each workstream is independently shippable — no big-bang rewrite.

---

## 7. Key decisions for Ed (approval gates)

1. **Ticker placement** — mount `AnnouncementsTicker` in the global header (below nav) vs only on match-centre?
2. **Calendar SSoT scope** — full Event+Occurrence model refactor now, or incremental (keep separate collections, add cross-links + unified admin calendar view first)?
3. **Mailing provider** — Resend API (self-hosted list) vs Brevo (managed platform, GDPR-friendly) vs both (transactional=Resend, marketing=Brevo)?
4. **Ticket attachments** — store via existing Directus `/files` upload (recommended) vs Vercel Blob?
5. **Deletion policy** — retention window (e.g., 30 days in trash) + purge cron; super_admin-only hard delete; GDPR erasure path for PII collections
6. **Hardcoded super_admin backdoor** — remove in favor of env bootstrap (recommended) or keep for convenience?
7. **/partners page** — migrate hardcoded tier list to Directus `partners` data (recommended)
