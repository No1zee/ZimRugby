# Visual Page Builder — Directus + Next.js /admin

## Problem
Content editors can't update the website without understanding Directus collections, slugs, section_keys, or status fields. They need a visual tool where they see the page, click sections, edit text, swap images, drag to reorder, and publish.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    /admin/login                      │
│              Supabase email+password auth            │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                    /admin                            │
│            Dashboard: list of pages                  │
│     ┌──────────┬──────────┬──────────┬────────┐     │
│     │ teams    │ events   │ tickets  │ about  │ ... │
│     └──────────┴──────────┴──────────┴────────┘     │
└──────────────────────┬──────────────────────────────┘
                       │ click page
┌──────────────────────▼──────────────────────────────┐
│               /admin/[slug]                          │
│          Split-panel visual builder                  │
│  ┌─────────────────────┬───────────────────────┐    │
│  │                     │  Section Panel         │    │
│  │   Live Preview      │  ┌─────────────────┐  │    │
│  │   (iframe or         │  │ ☰ Hero          │  │    │
│  │    rendered          │  │ ☰ Overview      │  │    │
│  │    components)       │  │ ☰ Mission       │  │    │
│  │                     │  │ ☰ Contact       │  │    │
│  │   Click section →   │  │                 │  │    │
│  │   highlights it      │  │ [+ Add Section] │  │    │
│  │                     │  └─────────────────┘  │    │
│  │                     │                       │    │
│  │                     │  Field Editor          │    │
│  │                     │  ┌─────────────────┐  │    │
│  │                     │  │ Title: [______] │  │    │
│  │                     │  │ Body:  [______] │  │    │
│  │                     │  │ Image: [Upload] │  │    │
│  │                     │  └─────────────────┘  │    │
│  └─────────────────────┴───────────────────────┘    │
│                                                      │
│  [Save Draft]  [Publish]  [Preview Live]             │
└─────────────────────────────────────────────────────┘
```

## Data Flow

```
Editor clicks "Publish"
        │
        ▼
POST /api/admin/pages/[slug]/publish
        │
        ├──→ Directus: set page.status = "published"
        ├──→ Directus: set all sections.status = "published"
        └──→ Revalidate Next.js cache (revalidateTag)
                │
                ▼
        Live site shows updated content
```

## Implementation Plan

### Phase 1: Auth Infrastructure (3 files)

**1.1 Create `src/middleware.ts`** — Wire Supabase auth middleware
- Import `updateSession` from `@/lib/supabase/middleware`
- Protect `/admin/*` routes (redirect to `/admin/login` if not authenticated)
- Protect `/api/admin/*` routes (return 401 if not authenticated)
- Refresh Supabase session on every request

**1.2 Create `src/app/admin/login/page.tsx`** — Admin login page
- Simple email+password form (reuse Supabase auth)
- Redirect to `/admin` on success
- Minimal UI — just a login box, no fan-zone branding

**1.3 Create `src/app/admin/layout.tsx`** — Admin layout
- Dark sidebar with page list
- Top bar with user info + logout button
- Check auth session, redirect to `/admin/login` if unauthenticated

### Phase 2: Admin Dashboard (2 files)

**2.1 Rewrite `src/app/admin/page.tsx`** — Page listing
- Fetch all pages from Directus `pages` collection
- Display as cards: title, slug, status (draft/published), last updated
- Click card → navigate to `/admin/[slug]`
- "Create New Page" button

**2.2 Create `src/app/admin/AdminSidebar.tsx`** — Navigation sidebar
- List of pages with status indicators
- Active page highlighted
- Logout button at bottom

### Phase 3: API Routes (4 files)

**3.1 Create `src/app/api/admin/pages/route.ts`** — List/create pages
- GET: fetch all pages from Directus
- POST: create new page in Directus

**3.2 Create `src/app/api/admin/pages/[slug]/route.ts`** — Read/update page
- GET: fetch page + sections by slug
- PUT: update page fields (title, hero, seo, etc.)

**3.3 Create `src/app/api/admin/pages/[slug]/sections/route.ts`** — Manage sections
- GET: fetch sections for page
- POST: create new section
- PUT: reorder sections (accept sorted array of section IDs)

**3.4 Create `src/app/api/admin/pages/[slug]/sections/[id]/route.ts`** — Section CRUD
- PUT: update section fields
- DELETE: remove section

**3.5 Create `src/app/api/admin/pages/[slug]/publish/route.ts`** — Publish
- POST: set page + all sections status to "published"
- Revalidate Next.js cache

**3.6 Create `src/app/api/admin/upload/route.ts`** — Image upload
- POST: upload image to Directus media library
- Return public URL

### Phase 4: Visual Builder UI (6 files)

**4.1 Create `src/app/admin/[slug]/page.tsx`** — Builder page (server component)
- Fetch page + sections from Directus
- Pass to `PageBuilderClient`

**4.2 Create `src/app/admin/[slug]/PageBuilderClient.tsx`** — Main builder (client component)
- Split panel layout: preview (left) + editor panel (right)
- State: selected section, sections array, page metadata
- Save/publish buttons in top bar

**4.3 Create `src/app/admin/[slug]/PagePreview.tsx`** — Live preview
- Renders the actual page components using the same code as the live site
- Each section has a clickable overlay
- Selected section gets a green border highlight
- Uses the same page components but in "edit mode"

**4.4 Create `src/app/admin/[slug]/SectionPanel.tsx`** — Section list + reorder
- List of sections with drag handles (use `@dnd-kit/core` + `@dnd-kit/sortable`)
- Each section shows: title, type, drag handle, delete button
- Click section → opens field editor
- "+ Add Section" button at bottom

**4.5 Create `src/app/admin/[slug]/FieldEditor.tsx`** — Dynamic field editor
- Renders input fields based on section type
- Text fields: title, body, eyebrow, cta_label, cta_url
- Image field: upload button + preview
- JSON items field: add/remove/reorder items (for stats, benefits, FAQ, etc.)
- Auto-saves on blur (debounced)

**4.6 Create `src/app/admin/[slug]/AddSectionModal.tsx`** — Section template picker
- Modal with section templates: Hero, Overview, Stats, FAQ, CTA, etc.
- Click template → creates new section with default content
- Section templates based on existing page section patterns

### Phase 5: Dependencies + Polish

**5.1 Install `@dnd-kit/core` + `@dnd-kit/sortable`** — Drag and drop

**5.2 Update `src/lib/supabase/middleware.ts`** — Add `/admin` protection

**5.3 Create `src/lib/admin/auth.ts`** — Admin auth helper
- `requireAdmin()` — checks session, throws if not admin role
- Used by all API routes

## File Count
- New files: ~15
- Modified files: ~3 (middleware.ts, package.json, admin/page.tsx)
- Total scope: ~1500-2000 lines of new code

## Key Decisions
1. **Split panel UX** — preview left, editor right. Clean separation.
2. **`@dnd-kit`** for drag-and-drop — modern, maintained, accessible
3. **Same components** for preview and live site — WYSIWYG accuracy
4. **Supabase auth** — already exists, just needs middleware wiring
5. **Directus as source of truth** — all edits go through Directus API
6. **Draft/publish workflow** — edits save as draft, explicit publish action goes live
7. **Image upload via Directus** — reuse existing media library

## What This Unlocks
- Content editors see the page they're editing
- Click a section → edit its fields
- Drag to reorder sections
- Add new sections from templates
- Upload images directly
- Save drafts, publish when ready
- No Directus knowledge required
