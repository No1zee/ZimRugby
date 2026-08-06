# Directus Content Management Plan — ZimRugby

**Date:** 2026-07-29
**Status:** APPROVED — Ready for execution

---

## Executive Summary

Directus is running locally with **16 content collections** already defined. The backend structure is solid — the problem is that **the frontend doesn't fully connect to it**. Several collections are empty, code still reads from static JSON, and the page-builder system (`pages` + `page_sections`) exists in Directus but the frontend ignores it.

**Goal:** A content manager can sit in the Directus admin panel and:
1. Change any picture on the site (hero banners, team crests, match photos, gallery)
2. Edit matches (create, update scores, set status, feature matches)
3. Reorder and configure page sections (layout control)

---

## Phase 1: Fix the Data Layer (Foundation)

### 1A. Consolidate fixtures → matches

**Problem:** Two collections exist — `fixtures` (simple) and `matches` (30+ fields). The code uses both. Confusing for content managers.

**Plan:**
- Delete `fixtures` collection from Directus (it's redundant)
- Update `src/lib/fixtures.ts` to read from `matches` collection only
- Update `src/app/api/fixtures/route.ts` to use the consolidated source
- Keep the World Rugby / Ticketmaster external feeds as supplementary sources

**Files to change:**
- `src/lib/fixtures.ts` — remove `fixtures` collection reads, use `matches` only
- `src/app/api/fixtures/route.ts` — update imports

### 1B. Fix ISR revalidation

**Problem:** `directusFetch()` accepts `revalidateSeconds` but always uses `cache: "no-store"`.

**Plan:**
- Update `src/lib/directus/fetch.ts` to actually use `next: { revalidate }` instead of `cache: "no-store"`
- Set appropriate revalidation: matches = 60s, content = 300s, settings = 600s

**Files to change:**
- `src/lib/directus/fetch.ts`

### 1C. Remove hardcoded credentials from AdminClient

**Problem:** Admin token is hardcoded in client-side code — security hole.

**Plan:**
- Move admin API calls to a server-side API route (`/api/admin/*`)
- AdminClient.tsx calls the API route, not Directus directly
- API route reads token from env vars server-side

**Files to change:**
- `src/app/admin/AdminClient.tsx`
- New: `src/app/api/admin/[...slug]/route.ts`

### 1D. Wire up empty collections

**Collections that exist in Directus but have no data or fetch code:**

| Collection | Action |
|-----------|--------|
| `hero_slides` | Populate with 3 slides, wire to `src/lib/api/hero.ts` |
| `photos` | Populate gallery, update `src/lib/api/gallery.ts` to prefer Directus |
| `videos` | Populate, wire to `src/lib/api/videos.ts` |
| `events` | Populate, wire to `src/lib/api/events.ts` |
| `rankings` | Populate, wire to `src/lib/api/rankings.ts` |
| `ranking_rivals` | Populate, wire to `src/lib/api/rankings.ts` |
| `navigation_items` | Populate or remove (currently hardcoded nav) |

---

## Phase 2: Image Management (Change Pictures)

### 2A. Hero Banner Images

**Current:** `hero_slides` collection exists but is empty. `HeroCarousel.tsx` reads from `src/lib/api/hero.ts` which tries Directus first, falls back to hardcoded slides.

**Plan:**
- Add `image` field (asset relation) to `hero_slides` in Directus
- Add `video` field (asset relation) for video backgrounds
- Add `imagePosition` field (select: center, top, bottom) for focal point
- Populate with 3 real hero slides via Directus admin
- Content manager uploads image → selects focal point → publishes

**Directus schema additions for `hero_slides`:**
```
image:          file (required)
video:          file (optional)
headline_line1: string (required)
headline_line2: string (required)
subtext:        string
tag:            string
imagePosition:  string (enum: center, top, bottom)
cta1_label:     string
cta1_href:      string
cta1_icon:      string
cta2_label:     string
cta2_href:      string
cta2_icon:      string
is_active:      boolean
sort:           integer
```

### 2B. Team Crests & Photos

**Current:** `teams` collection has `crest` field (asset). Works but needs population.

**Plan:**
- Upload team crests as Directus assets
- Set `crest` field on each team record
- Update `FlagshipTeamHero.tsx` and other team components to use `team.crest` from Directus

**Files to change:**
- `src/components/teams/FlagshipTeamHero.tsx` — use `activeTeam.crest` instead of hardcoded images
- `src/components/teams/TeamHero.tsx` — same

### 2C. Match Hero Images

**Current:** `matches` collection has `hero_image` field. Content manager can upload per-match heroes.

**Plan:**
- Ensure `hero_image` is an asset relation field in Directus
- Wire `MatchDetail` page and `NextUnionMatchHero` to use `match.hero_image`
- Fallback to team crest → default stadium image

**Files to change:**
- `src/lib/api/matchDetail.ts` — pass `hero_image` through
- `src/components/match-centre/NextUnionMatchHero.tsx` — use `hero_image`

### 2D. Gallery Photos

**Current:** `photos` collection exists but is empty. Gallery reads from `public/data/media-manifest.json` first.

**Plan:**
- Populate `photos` collection with images
- Update `src/lib/api/gallery.ts` to prefer Directus over local manifest
- Add fields: `image` (asset), `caption`, `tags`, `taken_at`, `photographer`

**Files to change:**
- `src/lib/api/gallery.ts` — flip priority: Directus first, local fallback

### 2E. Sponsor Logos

**Current:** `partners` collection is declared in SDK type but has NO fetch code. Sponsors are hardcoded in `SponsorGrid.tsx`.

**Plan:**
- Create `partners` collection in Directus (or use existing if present)
- Fields: `name`, `logo` (asset), `role`, `blurb`, `href`, `badge`, `sort`, `is_active`
- Populate with 5 current sponsors
- Update `SponsorGrid.tsx` to fetch from Directus

**Files to change:**
- `src/components/home/SponsorGrid.tsx` — async, fetch from Directus
- New: `src/lib/api/partners.ts`

---

## Phase 3: Match Management (Edit Matches)

### 3A. Match CRUD in Directus

**Current:** `matches` collection has 30+ fields. Well-structured but content managers need a clear workflow.

**Plan:**
- Create a Directus **module extension** or **custom interface** for match management (optional — can start with standard Directus admin)
- Content manager workflow:
  1. Go to Matches collection
  2. Click "Add Match"
  3. Select: Team (Sables/Lady Sables/etc), Opponent, Competition, Venue
  4. Set: Date, Time, Status (upcoming/live/finished)
  5. Upload: Hero image (optional)
  6. Toggle: Show on homepage, Show on match centre, Is featured
  7. After match: Enter scores, result outcome, summary

### 3B. Match Centre Integration

**Current:** `src/lib/match-centre/api.ts` fetches from 8+ Directus collections.

**Plan:**
- Ensure `show_on_match_centre` and `show_on_homepage` flags work correctly
- Test that live matches appear in the match centre UI
- Verify standings tables pull from Directus `standings_tables` + `standings_rows`

### 3C. Remove Static Match JSON

**Current:** `public/data/matches.json` is used by `getLiveMatches()` as a fallback.

**Plan:**
- After all matches are in Directus, remove `matches.json`
- Update `src/lib/data-fetcher.ts` to fetch from Directus `matches` collection
- Keep `reports.json` and `social.json` as fallbacks until those are also CMS-managed

---

## Phase 4: Layout Control (Move Things Around)

### 4A. Page Builder System

**Current:** `pages` and `page_sections` collections exist in Directus with good fields.

**How it works:**
- `pages` = a route (e.g., `/about`, `/events`)
- `page_sections` = modular blocks within that page (hero, text block, CTA, gallery, etc.)

**Plan:**
- Define standard `section_key` values:
  - `hero` — page hero banner
  - `text_block` — rich text content
  - `cta_banner` — call-to-action strip
  - `gallery` — photo grid
  - `sponsors` — partner logos
  - `newsletter` — email signup
  - `match_card` — featured match
  - `team_grid` — team cards
  - `video_embed` — YouTube/Vimeo embed
  - `custom_html` — raw HTML block

- Define `display_variant` values per section_key:
  - `hero`: `full`, `split`, `minimal`
  - `text_block`: `left`, `center`, `right`, `two-column`
  - `cta_banner`: `green`, `dark`, `white`

### 4B. Frontend Section Renderer

**New component:** `src/components/dynamic/PageSectionRenderer.tsx`

- Reads `page_sections` for the current page
- Sorts by `sort` field
- Renders each section based on `section_key` + `display_variant`
- Only renders sections where `is_enabled = true`
- Respects `start_at` / `end_at` scheduling

### 4C. Page Routing Integration

**Current:** Routes are hardcoded in `src/app/`.

**Plan:**
- For content-managed pages (about, events, etc.), add a catch-all route or modify existing pages to read from Directus `pages` + `page_sections`
- Keep hard-coded pages for complex interactive pages (match-centre, fan-zone)
- Simple pages (about, contact, partners) can be fully CMS-driven

**Files to create/modify:**
- New: `src/components/dynamic/PageSectionRenderer.tsx`
- New: `src/components/dynamic/sections/*.tsx` (one per section type)
- Modify: `src/app/about/page.tsx` — read from Directus
- Modify: `src/app/events/page.tsx` — read from Directus
- Modify: `src/app/partners/page.tsx` — read from Directus

### 4D. Navigation Management

**Current:** `navigation_items` collection exists in Directus but has no fields. Nav is hardcoded in `navConfig.ts`.

**Plan:**
- Add fields to `navigation_items`: `label`, `href`, `parent_id` (self-referencing for dropdowns), `sort`, `is_active`, `icon`
- Update `src/app/api/navigation/route.ts` to fetch from `navigation_items`
- Content manager can add/reorder/hide nav items

---

## Phase 5: Content Manager Workflow

### 5A. Daily Operations

| Task | Where | How |
|------|-------|-----|
| Update hero banner | Directus → Hero Slides | Upload image, set headline, publish |
| Edit match | Directus → Matches | Set scores, status, hero image |
| Add news article | Directus → Announcements | Title, body, category, CTA |
| Change sponsor logo | Directus → Partners | Upload logo, set name/role |
| Reorder page sections | Directus → Page Sections | Change `sort` field |
| Add gallery photo | Directus → Photos | Upload image, add caption/tags |
| Edit navigation | Directus → Navigation Items | Add/reorder/hide items |
| Update social links | Directus → Global Settings | Single record, edit URLs |

### 5B. Admin Panel Access

**Current:** `/admin` route exists but has no auth and hardcoded credentials.

**Plan:**
- Add Supabase auth check to `/admin` page
- Only ZRU admins can access
- Admin panel shows Directus link + quick stats

---

## Execution Order

| Step | What | Est. Effort |
|------|------|-------------|
| 1 | Fix ISR revalidation in `directusFetch()` | Small |
| 2 | Remove hardcoded credentials from AdminClient | Small |
| 3 | Consolidate fixtures → matches | Medium |
| 4 | Populate `hero_slides` + wire to HeroCarousel | Medium |
| 5 | Populate `partners` + wire to SponsorGrid | Medium |
| 6 | Populate `photos` + flip gallery priority | Medium |
| 7 | Wire team crests from Directus | Small |
| 8 | Wire match hero images from Directus | Small |
| 9 | Build PageSectionRenderer component | Large |
| 10 | Wire page routing to Directus pages | Medium |
| 11 | Populate `navigation_items` + wire nav | Medium |
| 12 | Remove static JSON fallbacks | Small |
| 13 | Admin panel auth + cleanup | Small |

---

## Collections Quick Reference

| Collection | Records | Content Manager Edits |
|-----------|---------|----------------------|
| `matches` | TBD | Scores, status, hero images, featured flags |
| `teams` | 5+ | Crests, colors, display order |
| `hero_slides` | 0 → 3 | Hero images, headlines, CTAs |
| `announcements` | 5+ | News, banners, alerts |
| `competitions` | TBD | Competition names, logos |
| `opponents` | TBD | Opponent crests, country |
| `venues` | TBD | Venue info, maps |
| `photos` | 0 → 10+ | Gallery images, captions |
| `videos` | 0 → 5+ | Video links, thumbnails |
| `events` | 0 → 4+ | Event details |
| `partners` | 0 → 5 | Sponsor logos, links |
| `pages` | 5+ | Page hero, SEO |
| `page_sections` | 20+ | Section content, order, visibility |
| `global_settings` | 1 | Social links, site config |
| `navigation_items` | 0 → 10+ | Nav labels, order, links |
