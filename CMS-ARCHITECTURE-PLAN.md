# ZRU CMS Editorial Product — Architecture Plan

## 1. Executive Summary

The ZRU website has a working Next.js frontend and a Directus backend with 22+ collections, but the editorial experience is fragmented. Only 6 of ~30 public pages consume CMS content via `getPageBySlug()`. The admin page builder exists but covers only 8 pages, has no live preview of the actual site, no workflow, no audit trail, and no role-based permissions. Meanwhile, the Match Centre module (`src/lib/match-centre/`) demonstrates what a proper CMS integration looks like — typed queries across 6+ collections, a settings singleton, and structured match data.

This plan transforms the current rough admin into a proper editorial control plane. It follows a **migration-by-slice** strategy: fix the preview engine first, then migrate pages one-by-one from hardcoded to CMS-driven, then layer on workflow, permissions, and sports-specific publishing flows.

**Design principles:**
- Preserve the existing ZimRugby design language — no generic SaaS look
- Structured content over page-specific hardcoding
- Reusable block/slice architecture for page composition
- Draft → Review → Approve → Publish workflow
- Matchday speed: live content publishing under pressure
- Campaign mode for time-bound initiatives without polluting evergreen content

---

## 2. Current-State Findings

### 2.1 Route Inventory

| Category | Routes | Count |
|----------|--------|-------|
| CMS-driven pages | `/about`, `/play-rugby`, `/teams` (partial), `/media` (partial), `/tickets` (partial), `/match-centre` | 6 |
| Hardcoded pages | `/clubs`, `/schools`, `/contact`, `/partners`, `/faqs`, `/privacy-policy`, `/terms-of-use`, `/accessibility`, `/resources`, `/resources/laws`, `/volunteer`, `/referees` | 12 |
| Hybrid pages (CMS hero + hardcoded body) | `/events`, `/fan-zone`, `/tickets`, `/media` | 4 |
| Feature systems | Match Centre, Announcements, Navigation (dynamic), Partners/Sponsors | 4 |
| Admin/auth | `/admin`, `/admin/[slug]`, `/admin/matches`, `/admin-login`, `/login`, `/auth/callback` | 5 |
| Forms | `/onboarding/coach`, `/onboarding/player`, `/onboarding/referee`, `/clubhouse` | 4 |
| Campaigns | `/world-cup-campaign` | 1 |

### 2.2 Data Flow Pattern

Every API module follows the same pattern:
```
Try Directus → On failure, fall back to hardcoded mock data
```

This is consistent across `src/lib/api/hero.ts`, `announcements.ts`, `events.ts`, `fixtures.ts`, `gallery.ts`, `partners.ts`, `teams.ts`, `videos.ts`, `rankings.ts`, `referees.ts`.

**Problem**: Many pages import mock data directly instead of going through the API layer:
- `/teams` → hardcoded `TEAMS[]` (144 lines) alongside `getPageBySlug("teams")`
- `/tickets` → hardcoded `FIXTURES[]` (60+ lines) alongside `getPageBySlug("tickets")`
- `/clubs` → hardcoded `CLUBS[]` (no CMS at all)
- `/partners` → imports `data/partners.ts` static file, not `src/lib/api/partners.ts`
- Homepage → hardcoded `featuredPlayers[]`

### 2.3 Admin Builder Current State

| Aspect | Status | Detail |
|--------|--------|--------|
| Page coverage | 8 slugs | `AdminSidebar.tsx` hardcodes `PAGE_ROUTES` |
| Section types | 14 | `AddSectionModal.tsx` templates |
| Preview | Generic | `PagePreview.tsx` uses `SectionRenderer` — matches live site per-section |
| Field editing | Basic | Text fields, image upload, JSON items array |
| Reorder | Arrow buttons | Not drag-and-drop |
| Auth | Password-based | `ADMIN_PASSWORD` env var, no roles |
| Workflow | None | Draft/published only, no review/approval |
| Audit | None | No change history |
| Media library | Upload only | No browsing, search, or folders |
| SEO | Not editable | Fields exist in Directus but not in admin UI |
| Rich text | None | Plain textareas only |

### 2.4 What Works Well

- **Match Centre** (`src/lib/match-centre/`) — proper typed queries, settings singleton, structured data
- **Announcement system** — scoped, priority-based, with design variants and scheduling
- **SectionRenderer** — 14 section types render consistently across preview and live site
- **Directus asset pipeline** — `assetUrl()` with transformations, hero/photo/logo/thumbnail helpers
- **Dual API pattern** — `directusFetch()` with ISR revalidation and mock fallback
- **Page sections model** — `page_sections` collection with `section_key`, `items` JSON, `sort` ordering

---

## 3. Architecture Diagnosis

### What Is Weak

| Problem | Impact | Fix Priority |
|---------|--------|-------------|
| No live preview of actual site rendering | Editors can't see what they're publishing | CRITICAL |
| 12+ pages have zero CMS coverage | Most site content is uneditable | CRITICAL |
| No workflow (draft → review → approve) | No editorial control, anyone can publish | HIGH |
| No role-based permissions in admin | Single password = full access | HIGH |
| No audit trail | Can't track who changed what | HIGH |
| Hardcoded data mixed with CMS data | Inconsistent data sources | HIGH |
| No media library | Can't browse/manage uploaded assets | MEDIUM |
| No rich text editing | Plain textareas for content | MEDIUM |
| No SEO field editing in admin | Meta fields exist but aren't editable | MEDIUM |
| No campaign system | No way to run time-bound initiatives | MEDIUM |
| Navigation hardcoded in `navConfig.ts` | Can't add/remove nav items from admin | MEDIUM |
| Footer hardcoded in `Footer.tsx` | Can't edit footer columns/links | LOW |
| Partners page uses static file | Inconsistency with CMS-backed SponsorGrid | LOW |

### What Is Strong

- Match Centre architecture (model for other features)
- Announcement system with scoping and variants
- SectionRenderer component library
- Directus asset pipeline with transformations
- ISR revalidation pattern
- Consistent fallback strategy

---

## 4. CMS Product Goals

### Primary Goals

1. **Every public page editable from admin** — no hardcoded content islands
2. **Live preview shows the real site** — iframe-based, matches published rendering
3. **Editorial workflow** — draft → in_review → approved → published → archived
4. **Role-based access** — super admin, content admin, editor, matchday editor, approver
5. **Reusable content blocks** — not page-specific one-off schemas
6. **Matchday publishing** — fast score/status updates under time pressure
7. **Campaign mode** — time-bound content that doesn't pollute evergreen pages

### Non-Goals

- Replacing the existing frontend design system
- Building a WYSIWYG/word-processor-style editor
- Multi-language support (not needed for ZRU)
- E-commerce functionality (handled by `/clubhouse`)

---

## 5. Proposed Content Architecture

### 5.1 Content Model Philosophy

Every piece of content falls into one of three categories:

| Category | Description | Example |
|----------|-------------|---------|
| **Entity** | Standalone data object with its own identity | Team, Player, Match, Venue, Article |
| **Page** | A routable URL with composed sections | `/about`, `/tickets`, `/play-rugby` |
| **Block** | Reusable content component placed inside a page | Hero, Stats, FAQ, CTA, Gallery Grid |

**Rules:**
- Pages are composed of ordered Blocks (stored in `page_sections`)
- Entities are referenced by Blocks (a "team_list" block references `teams` entities)
- Pages have metadata (slug, title, SEO, breadcrumb)
- Entities have their own CRUD lifecycle

### 5.2 Why Standalone Collections vs Embedded

| Decision | Rationale |
|----------|-----------|
| `teams` is a standalone collection | Teams appear across multiple pages, have their own detail routes (`/teams/[slug]`), and are referenced by Match Centre, Navigation, and Fan Zone |
| `matches` is a standalone collection | Matches feed Match Centre, Tickets, Navigation live score, and Statistics — high reuse |
| `page_sections` is embedded in `pages` | Sections belong to exactly one page and are ordered within that page |
| `announcements` is standalone | Announcements appear globally, per-page, and in tickers — cross-cutting concern |
| `partners` is standalone | Partners appear on homepage SponsorGrid, `/partners` page, and potentially footer |
| `competitions` is standalone | Competitions are referenced by matches, standings, navigation, and events |
| `venues` is standalone | Venues are referenced by matches and events |

### 5.3 Block/Section Template Library

These are the reusable content blocks available in the page builder:

| Block Key | Label | Fields | Used By |
|-----------|-------|--------|---------|
| `hero` | Page Hero | kicker, title, intro, image, breadcrumb | All pages |
| `overview` | Overview | eyebrow, title, content (rich text), stats (items[]) | About, Play Rugby |
| `mission_vision` | Mission & Vision | mission_title, mission_content, vision_title, vision_content | About |
| `contact_info` | Contact Info | title, items[] (label/value pairs) | About, Contact |
| `stats` | Key Statistics | eyebrow, title, items[] (label/value, color) | Any page |
| `faq` | FAQ Accordion | title, items[] (question/answer) | Tickets, FAQs |
| `benefits` | Benefits List | eyebrow, title, items[] (title/description/icon) | Fan Zone, Play Rugby |
| `cta_banner` | CTA Banner | eyebrow, title, body, cta_label, cta_url, variant (green/dark/teal) | Any page |
| `team_list` | Team Grid | eyebrow, title, items[] (team_id refs or inline) | Teams |
| `programmes` | Programme Grid | eyebrow, title, items[] (title/description/link/icon/color) | Play Rugby |
| `clubs_list` | Club Finder | title, content, items[] (name/location/league/contact) | Play Rugby, Clubs |
| `development_pathway` | Development CTA | eyebrow, body, content, buttons[] (label/url) | Teams |
| `article_list` | Article/News Grid | eyebrow, title, source (collection), filter, limit | Media, Home |
| `gallery_grid` | Photo Gallery | eyebrow, title, source (collection/album), layout | Gallery, Media |
| `video_list` | Video Grid | eyebrow, title, source (youtube/channel), limit | Media, Video Hub |
| `event_list` | Event List | eyebrow, title, filter (type/date), limit | Events |
| `ticket_fixture_list` | Ticket Fixtures | eyebrow, title, filter (status/category) | Tickets |
| `partner_grid` | Partner/Sponsor Grid | eyebrow, title, tier (all/platinum/gold/silver), layout | Partners, Home |
| `announcement_list` | Announcements | eyebrow, title, scope, limit | Any page |
| `rankings_table` | Rankings Table | eyebrow, title, ranking_type (senior/u20/sevens) | Rankings |
| `standings_table` | League Table | eyebrow, title, competition_id | Match Centre |
| `custom_html` | Custom HTML | title, content (HTML) | Special cases |
| `campaign_hero` | Campaign Hero | kicker, title, intro, image, countdown, cta | Campaigns |

---

## 6. Proposed Directus Collection Map

### Core Content Collections

| Collection | Type | Purpose | Key Fields |
|------------|------|---------|------------|
| `pages` | Entity | Routable pages | slug, title, page_type, breadcrumb_label, hero_*, seo_*, status, sort |
| `page_sections` | Embedded in pages | Ordered content blocks | page_id, section_key, eyebrow, title, body, content, items(JSON), image, cta_*, display_variant, is_enabled, sort, status |
| `announcements` | Entity | Cross-cutting announcements | title, slug, body, priority, scope(JSON), cta_*, starts_at, ends_at, design_variant, is_sticky, badge, status |
| `hero_slides` | Entity | Homepage carousel | title, subtitle, image, cta_label, cta_url, sort, is_active |
| `partners` | Entity | Sponsors/partners | name, logo, url, tier, category, sort, is_active |
| `global_settings` | Singleton | Site-wide config | site_name, site_description, contact_email, contact_phone, social_links(JSON) |

### Sports Data Collections

| Collection | Type | Purpose | Key Fields |
|------------|------|---------|------------|
| `teams` | Entity | National & club teams | name, slug, short_name, crest, primary_color, secondary_color, team_type, gender, age_grade, is_national_team, display_order |
| `players` | Entity | Player profiles | name, slug, team_id, position, number, photo, bio, stats(JSON) |
| `matches` | Entity | Fixtures & results | title, home_team_id, away_team_id, venue_id, competition_id, kickoff_at, status, home_score, away_score, show_on_match_centre |
| `competitions` | Entity | Leagues/tournaments | name, slug, type, season, is_active |
| `venues` | Entity | Stadiums/grounds | name, city, capacity, address |
| `opponents` | Entity | Non-Zim teams | name, crest, country |
| `standings_tables` | Entity | League tables | competition_id, season, sort |
| `standings_rows` | Entity | Table rows | table_id, team_id, played, won, drawn, lost, points_for, points_against, bonus, points, form(JSON), position |
| `rankings` | Entity | World rankings | team_type, position, points, updated_at |
| `ranking_rivals` | Entity | Ranking rivals | ranking_id, team_name, points, movement |

### Media Collections

| Collection | Type | Purpose | Key Fields |
|------------|------|---------|------------|
| `photos` | Entity | Gallery photos | title, image, album, tags, taken_at, photographer |
| `videos` | Entity | Video content | title, description, youtube_id, thumbnail, category, duration |
| `articles` | Entity | News/editorial | title, slug, excerpt, content(rich text), featured_image, author, category, published_at, status |

### Operational Collections

| Collection | Type | Purpose | Key Fields |
|------------|------|---------|------------|
| `referee_resources` | Entity | Ref docs | title, description, file, category |
| `referee_courses` | Entity | Ref training | title, date, location, instructor, status |
| `referee_notices` | Entity | Ref notices | title, body, priority, date |
| `fan_zone_members` | Entity | Fan registrations | name, email, favorite_team, country, vip_code, cdpa_consent |
| `onboarding_submissions` | Entity | Player/coach/ref registrations | full_name, email, phone, role, organization |
| `match_centre_settings` | Singleton | Match Centre config | show_match_centre, default_view, announcement_strip |

### Workflow Collections

| Collection | Type | Purpose | Key Fields |
|------------|------|---------|------------|
| `content_revisions` | System | Audit trail | collection, item_id, field, old_value, new_value, changed_by, changed_at |
| `approval_queue` | Entity | Pending approvals | collection, item_id, requested_by, approved_by, status, notes |
| `campaigns` | Entity | Time-bound campaigns | name, slug, description, start_at, end_at, status, announcement_config(JSON) |
| `activity_log` | System | Admin action log | user_id, action, collection, item_id, details(JSON), timestamp |

---

## 7. Proposed Relationships Map

```
pages 1──N page_sections
pages 1──N content_revisions

matches N──1 teams (home_team)
matches N──1 teams (away_team)
matches N──1 venues
matches N──1 competitions
matches N──1 opponents

standings_tables N──1 competitions
standings_rows N──1 standings_tables
standings_rows N──1 teams

players N──1 teams
rankings N──1 teams (via team_type matching)

page_sections ──references──> teams (via items JSON with team_id)
page_sections ──references──> competitions (via items JSON with competition_id)
page_sections ──references──> articles (via source/collection)
page_sections ──references──> photos (via source/collection)
page_sections ──references──> videos (via source/collection)

announcements ──scope references──> pages (via scope JSON)
announcements ──scope references──> teams (via scope JSON)

hero_slides ──optional──> pages (via link field)
partners ──independent──> (standalone display)

campaigns 1──N announcements (campaign-scoped announcements)
campaigns ──generates──> page_sections (campaign page blocks)
```

---

## 8. Proposed Workflow State Machine

### Standard Content Lifecycle

```
draft ──> in_review ──> approved ──> scheduled ──> published ──> archived
  │           │              │
  │           v              v
  │     changes_requested  rejected
  │           │
  └───────────┘ (iterate)
```

### State Definitions

| State | Meaning | Who Sets | Next States |
|-------|---------|----------|-------------|
| `draft` | Work in progress, not visible publicly | Editor, on creation | `in_review` |
| `in_review` | Submitted for approval | Editor | `approved`, `changes_requested` |
| `changes_requested` | Returned with feedback | Approver | `in_review` (after fixes) |
| `approved` | Ready to publish | Approver | `published`, `scheduled` |
| `scheduled` | Queued for future publish | Content Admin | `published` (at scheduled time) |
| `published` | Live on site | Content Admin, or auto from scheduled | `archived`, `draft` (for new edits) |
| `archived` | Removed from active, kept in history | Content Admin | `draft` (to re-edit) |

### Matchday Override States

| State | Meaning | Who Sets |
|-------|---------|----------|
| `live_update` | Score/status being updated in real-time | Matchday Editor |
| `halftime` | Half-time state | Matchday Editor |
| `final` | Match completed, awaiting confirmation | Matchday Editor |
| `confirmed` | Final result confirmed, stats frozen | Matchday Editor |

### Edit-After-Publish Behavior

When a published item is edited:
1. A **new draft** is created (clone of published)
2. The published version stays live
3. The draft goes through `draft → in_review → approved → published`
4. On publish, the new version replaces the old
5. The old version is saved in `content_revisions`

This prevents broken content from going live accidentally.

---

## 9. Proposed Permissions Matrix

### Roles

| Role | Description |
|------|-------------|
| `super_admin` | Full access to everything including settings and user management |
| `content_admin` | Can manage all content, approve, publish, manage campaigns |
| `editor` | Can create/edit content but cannot publish without approval |
| `matchday_editor` | Can update live match data (scores, status, lineups) in real-time |
| `approver` | Can review and approve content, cannot create new content |
| `partner_contributor` | Can manage partner/sponsor listings only |
| `read_only` | Can view admin but cannot make changes |

### Permissions Matrix

| Collection | super_admin | content_admin | editor | matchday_editor | approver | partner_contributor |
|------------|:-----------:|:------------:|:------:|:---------------:|:--------:|:-------------------:|
| pages | CRUD+Publish | CRUD+Publish | CR-U | — | Approve | — |
| page_sections | CRUD+Publish | CRUD+Publish | CR-U | — | Approve | — |
| teams | CRUD | CRUD | R | R | R | — |
| players | CRUD | CRUD | CR-U | R | R | — |
| matches | CRUD | CRUD | R | CRU | R | — |
| competitions | CRUD | CRUD | R | R | R | — |
| venues | CRUD | CRUD | R | R | R | — |
| articles | CRUD | CRUD | CR-U | — | Approve | — |
| photos | CRUD | CRUD | CR-U | — | R | — |
| videos | CRUD | CRUD | CR-U | — | R | — |
| announcements | CRUD | CRUD | CR-U | R | Approve | — |
| hero_slides | CRUD | CRUD | CR-U | — | Approve | — |
| partners | CRUD | CRUD | R | — | R | CR-U |
| campaigns | CRUD | CRUD | R | — | Approve | — |
| match_centre_settings | CRUD | R | — | R | — | — |
| global_settings | CRUD | R | — | — | — | — |
| referee_* | CRUD | CRUD | CR-U | — | R | — |
| fan_zone_members | R | R | R | — | — | — |
| onboarding_submissions | R | R | R | — | — | — |
| approval_queue | CRUD | R | Create | — | Approve | — |
| content_revisions | R | R | R | — | R | — |
| activity_log | R | R | R | R | R | R |

**Legend**: C=Create, R=Read, U=Update, D=Delete, Approve=Can approve from review

### Key Permission Rules

- **Editors** can save drafts and submit for review, but cannot publish
- **Matchday Editors** can update match scores/status without approval (time-critical)
- **Approvers** can only approve/reject — they cannot create or edit content
- **Partner Contributors** can only manage their own organization's listing
- All publish actions are logged in `activity_log`

---

## 10. Proposed Preview Architecture

### How Preview Should Work

```
┌─────────────────────────────────────────────────────┐
│ Admin Builder (split panel)                         │
│                                                     │
│ ┌──────────────────┐  ┌──────────────────────────┐  │
│ │ Editor Panel     │  │ Live Preview (iframe)    │  │
│ │                  │  │                          │  │
│ │ [Section list]   │  │ ┌──────────────────────┐ │  │
│ │ [Field editor]   │◄─┤ │ Actual site page     │ │  │
│ │ [Add section]    │  │ │ with draft content   │ │  │
│ │ [Publish btn]    │  │ │ rendered via         │ │  │
│ │                  │  │ │ draftMode()          │ │  │
│ └──────────────────┘  │ └──────────────────────┘ │  │
│                       │                          │  │
│                       │ [Desktop] [Tablet] [Mobile│  │
│                       └──────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Implementation

1. **Preview URL**: `/api/draft?secret={SECRET}&slug={SLUG}&ref={ADMIN_ORIGIN}`
   - Enables Next.js draft mode
   - Redirects to `/{slug}` with draft content
   - The iframe loads this URL

2. **Draft mode in `getPageBySlug()`**: Already implemented
   - Checks `draftMode()`, fetches draft+published content when enabled
   - Returns the latest draft version

3. **Admin iframe**: `PagePreview.tsx` renders an iframe pointing to the preview URL
   - On section save, post a message to the iframe to refresh
   - The iframe shows the real site rendering, not a generic preview

4. **Responsive preview**: Three buttons in the preview toolbar
   - Desktop (100% width)
   - Tablet (768px)
   - Mobile (375px)
   - Changes iframe width via CSS

5. **Click-to-edit** (Phase 2): Overlay system
   - Inject a script into the preview iframe
   - On hover, show blue overlays on editable elements
   - On click, select the corresponding section in the editor panel
   - Uses `data-cms-section` attributes on rendered sections

### Preview Security

- Preview URLs require `DIRECTUS_PREVIEW_SECRET` (already in env)
- Preview cookie `__prerender_bypass` enables draft mode
- Preview is only accessible to authenticated admin users
- Preview URLs expire after 60 minutes

---

## 11. Proposed Admin Information Architecture

### Navigation Structure

```
Dashboard
├── Overview (recent edits, pending approvals, quick stats)
├── Quick Actions (new page, new announcement, new article)
│
Content
├── Pages (list all pages → edit page → section builder)
├── Articles / News
├── Announcements
├── Hero Slides
├── Campaigns
│
Sports
├── Teams
├── Players
├── Matches (list → edit score/status)
├── Competitions
├── Venues
├── Standings
│
Matchday
├── Live Match Panel (real-time score/status editor)
├── Match Centre Settings
│
Media
├── Photo Gallery
├── Videos
│
Tickets
├── Ticket Fixtures (list → edit pricing/links)
├── Ticket FAQ
│
Partners
├── Partner Directory
├── Partner Tiers
│
Site Settings
├── Navigation (edit nav items)
├── Footer
├── Global Settings
├── SEO Defaults
│
Workflow
├── Approval Queue
├── My Submissions
│
Activity
├── Audit Log (who changed what, when)
├── Content Revisions (diff viewer)
│
Admin
├── Users & Roles
├── Directus Backend (link to localhost:8055)
```

### Dashboard Widgets

| Widget | Content | Actions |
|--------|---------|---------|
| **Pending Approvals** | Items in `in_review` status | View, approve, request changes |
| **My Drafts** | Items I've edited recently | Continue editing, submit for review |
| **Recent Activity** | Last 10 admin actions | View details |
| **Quick Stats** | Pages, articles, matches, announcements counts | Navigate to collection |
| **Matchday Status** | Current/upcoming live matches | Quick score update |
| **Scheduled Content** | Items with future publish dates | View, cancel |

### Per-Page Builder Layout

```
┌──────────────────────────────────────────────────────┐
│ [← Back to Pages]  Page: /tickets  [Publish] [Preview]│
├──────────────────────────────────────────────────────┤
│                                                      │
│ ┌────────────────────┐  ┌──────────────────────────┐ │
│ │ Section List       │  │ Live Preview (iframe)    │ │
│ │                    │  │                          │ │
│ │ ▰ Hero             │  │                          │ │
│ │ ▰ Fixtures         │  │                          │ │
│ │ ▰ FAQ              │  │                          │ │
│ │ ▰ CTA              │  │                          │ │
│ │                    │  │                          │ │
│ │ [+ Add Section]    │  │                          │ │
│ │                    │  │                          │ │
│ ├────────────────────┤  │                          │ │
│ │ Field Editor       │  │                          │ │
│ │                    │  │                          │ │
│ │ Eyebrow: [____]    │  │                          │ │
│ │ Title: [____]      │  │                          │ │
│ │ Body: [____]       │  │                          │ │
│ │ Image: [Upload]    │  │                          │ │
│ │ Items: [Edit JSON] │  │                          │ │
│ │                    │  │                          │ │
│ │ [Desktop] [Tablet] [Mobile]                      │ │
│ └────────────────────┘  └──────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 12. Proposed Tickets Pilot Plan

### Why Tickets Is the Right Pilot

1. **Visible weakness**: Tickets has CMS hero + hardcoded fixtures — the gap is obvious
2. **Complex enough**: Involves lists, filtering, CTAs, FAQ, pricing, external links
3. **High value**: Tickets are revenue-generating; editors need to update them frequently
4. **Repeatable patterns**: The ticket editing patterns apply to Events, Media, and Clubs
5. **Existing infrastructure**: `getPageBySlug("tickets")` already works, just needs more sections

### What "Pilot Complete" Means

| Criteria | Detail |
|----------|--------|
| All ticket content in Directus | Fixtures, pricing tiers, FAQ, seating categories, FAQ all in CMS collections |
| Admin builder covers `/tickets` | Sections: Hero, Fixtures List, Pricing, FAQ, CTA — all editable |
| Live preview works | Editor sees real site rendering in iframe when editing ticket page |
| Preview is responsive | Desktop/tablet/mobile toggle works |
| Publish workflow works | Editor saves draft → submits for review → approver approves → publishes |
| Audit trail logs changes | Every edit is logged with timestamp and user |
| No hardcoded data on `/tickets` | `TicketsClient.tsx` reads everything from CMS with fallback |

### What We Learn

- Does the block/slice model work for real editorial use?
- Is the preview fast enough for iterative editing?
- Do editors understand the workflow states?
- What field types need improvement (e.g., do we need a rich text editor for FAQ answers)?
- How does the approval flow feel in practice?

### Generalization After Pilot

- Apply the same patterns to `/events` (similar structure: hero + list + FAQ)
- Apply to `/clubs` (similar structure: hero + grid + search)
- Apply to `/media` (similar structure: hero + video grid + article grid)
- Create reusable `TicketFixtureBlock` component that other pages can reference

---

## 13. Route-by-Route Migration Plan

### Phase 1: Preview Engine + Tickets Pilot (Weeks 1-3)

| Week | Task | Files |
|------|------|-------|
| 1 | Fix preview to use iframe with real site | `PagePreview.tsx`, `PageBuilderClient.tsx` |
| 1 | Add responsive preview toggle | `PagePreview.tsx` |
| 1 | Add all pages to admin sidebar | `AdminSidebar.tsx` |
| 2 | Create Tickets Directus collections | Directus admin |
| 2 | Migrate ticket fixtures to CMS | `TicketsClient.tsx`, `ticket_fixtures` collection |
| 2 | Migrate ticket FAQ to CMS | `TicketsClient.tsx`, `page_sections` |
| 3 | Add approval workflow to admin | `PageBuilderClient.tsx`, `approval_queue` collection |
| 3 | Add audit logging | API routes, `activity_log` collection |

### Phase 2: Core Content Migration (Weeks 4-6)

| Week | Task | Files |
|------|------|-------|
| 4 | Migrate teams to CMS | `teams/page.tsx`, `teams` collection |
| 4 | Migrate clubs to CMS | `clubs/page.tsx`, new `clubs` collection or use `teams` with `team_type=club` |
| 5 | Migrate events to CMS | `events/page.tsx`, `events` collection |
| 5 | Migrate schools content to CMS | `schools/page.tsx`, `page_sections` |
| 6 | Migrate partners page to CMS API | `partners/page.tsx`, use existing `getPartners()` |
| 6 | Migrate homepage hardcoded data | `page.tsx` |

### Phase 3: Editorial Workflow (Weeks 7-8)

| Week | Task | Files |
|------|------|-------|
| 7 | Implement role-based permissions | Directus roles, admin auth middleware |
| 7 | Add approval queue UI | New admin page `/admin/workflow` |
| 8 | Add scheduled publishing | Cron job or Directus flow |
| 8 | Add content revisions / audit viewer | New admin page `/admin/activity` |

### Phase 4: Matchday + Campaigns (Weeks 9-10)

| Week | Task | Files |
|------|------|-------|
| 9 | Build matchday live panel | `/admin/matchday` |
| 9 | Campaign creation flow | `/admin/campaigns` |
| 10 | Campaign announcement integration | `GlobalAnnouncementBar.tsx` |
| 10 | Campaign archive pages | `/world-cup-campaign` |

### Phase 5: Admin UX Polish (Week 11)

| Week | Task | Files |
|------|------|-------|
| 11 | Dashboard with widgets | `admin/page.tsx` |
| 11 | Navigation editor in admin | `navConfig.ts` → CMS |
| 11 | Footer editor in admin | `Footer.tsx` → CMS |

---

## 14. Risks and Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Preview iframe is slow to load | Medium | High | Use ISR revalidation (60s), cache preview HTML, lazy-load iframe |
| Editors find workflow too complex | Medium | High | Start with simple draft/published, add review step after pilot |
| Directus can't handle all field types | Low | Medium | Use JSON `items` field for complex structures, extend via custom interfaces |
| Migration breaks existing pages | Medium | High | Keep mock fallbacks, test each page migration independently |
| Matchday editing too slow in admin | Medium | High | Build dedicated matchday panel, not the generic page builder |
| Permission system too restrictive | Low | Medium | Start with 3 roles (admin, editor, viewer), add granularity later |
| Audit log performance at scale | Low | Medium | Use TTL indexes, archive old logs to cold storage |

---

## 15. Recommended Implementation Sequence

```
1. Preview engine (iframe + responsive)     ← Immediate UX win
2. Tickets pilot (CMS migration + builder)  ← Proves the model
3. Add all pages to admin sidebar           ← Coverage
4. Approval workflow                        ← Editorial control
5. Audit logging                            ← Accountability
6. Teams/Clubs/Events migration             ← Content coverage
7. Roles and permissions                    ← Security
8. Matchday panel                           ← Sports-specific
9. Campaign system                          ← Marketing capability
10. Navigation/Footer editors               ← Full CMS coverage
11. Dashboard polish                        ← Professional feel
```

---

## 16. Acceptance Criteria / Definition of Done

### Tickets Pilot Done When:
- [ ] All ticket page content is editable from admin (no hardcoded data)
- [ ] Preview shows the real site in an iframe
- [ ] Preview has desktop/tablet/mobile toggle
- [ ] Editor can save draft, submit for review, approver can approve
- [ ] Every admin action is logged with timestamp and user
- [ ] TypeScript compiles clean
- [ ] Public `/tickets` page renders identically from CMS data
- [ ] Fallback to mock data works when Directus is offline

### CMS Product Done When:
- [ ] Every public page is editable from admin
- [ ] No hardcoded content remains in public page components
- [ ] Preview covers all page types
- [ ] 3+ roles with appropriate permissions
- [ ] Approval workflow on all content types
- [ ] Audit trail with diff viewer
- [ ] Matchday panel for live score updates
- [ ] Campaign creation and management
- [ ] Dashboard shows meaningful operational data
- [ ] Editors can complete common tasks in <3 clicks
