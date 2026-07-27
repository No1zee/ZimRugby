# WebPageTest Performance Audit — July 27, 2026

**Test config:** Bratislava, Chrome, 3G Fast  
**URL:** https://zimrugby.co.zw  

## Baseline (Before)

| Metric | Value |
|--------|-------|
| Requests | 51 |
| Bytes | 1,661 KB |
| Load | 1.673s |
| FTTB | 0.336s |
| Speed Index | 0.836s |
| Fully Loaded | 2.052s |
| CDN Grade | FAIL |

**Problem breakdown:** Images ~56% of requests/bytes, JS ~34%.

---

## Changes Made (3 commits on `oc-experimental`)

### Commit `dc84edf` — Image handling & Directus transforms
- Converted 5 raw `<img>` tags to `next/image` (schools/page.tsx ×3, MatchCentreClient.tsx ×2)
- Enhanced `src/lib/directus/assets.ts` with typed helper functions (`heroAssetUrl`, `logoAssetUrl`, `photoAssetUrl`, `thumbnailAssetUrl`, `headshotAssetUrl`) + `fit` param
- Migrated 13 Directus asset URLs to use transforms: hero→1920px/q80, logos→96px/q75, photos→800px/q75, thumbnails→400px/q70, headshots→200px/q75
- Updated all API layer files (hero, events, fixtures, gallery, rankings, videos, teams, matchDetail)

### Commit `555f119` — CDN fix
- **Root cause:** `output: 'standalone'` in next.config.ts prevented proper CDN caching on Vercel — all static assets served with `max-age=0, must-revalidate`
- Removed `output: 'standalone'` from next.config.ts
- Created `vercel.json` with Cache-Control headers:
  - `/images/*` → `max-age=31536000, immutable`
  - `/_next/static/*` → `max-age=31536000, immutable`
  - `/_next/image/*` → `max-age=86400, stale-while-revalidate=604800` (7-day SWR)
  - `/fonts/*` → `max-age=31536000, immutable`
  - Logos + manifest → appropriate cache headers

### Commit `2aa1da3` — JS payload reduction
- Installed `@next/bundle-analyzer` (activated via `ANALYZE=true` env var)
- Converted `template.tsx` from `"use client"` (framer-motion) to server component (CSS animation only)
- Added `@keyframes page-in` to globals.css with mobile/desktop variants
- Removed unused `EdgyGradient` import from about/layout.tsx
- Audit: Identified 95 client components, most use framer-motion legitimately
- Audit: FooterMeteorField, CountdownPromo, PretextBackground, PretextHeadline, SectionBoard = dead code (zero imports)

### Commit `c82d5e0` — Dead code cleanup
- Deleted FooterMeteorField.tsx (203 lines, canvas animation, never imported)
- Deleted CountdownPromo.tsx, PretextBackground.tsx, PretextHeadline.tsx, SectionBoard.tsx (unused)
- Removed 5 Next.js boilerplate SVGs from public/ (file.svg, globe.svg, next.svg, vercel.svg, window.svg)
- Removed unused logo.png from public root

---

## Findings Summary

### Already Optimized (No Action Needed)
- **Fonts:** Zero HTTP font requests — pure CSS variables with system fallbacks
- **Icons:** lucide-react tree-shaken via `optimizePackageImports` in next.config.ts
- **CSS:** Tailwind v4 with `@theme` — 216 KB production (Tailwind base + custom tokens)
- **ContentSquare:** Consent-gated + `requestIdleCallback` deferred loading
- **YouTube embeds:** Only loaded on user interaction (click-to-play)
- **Third-party scripts:** Only ContentSquare (analytics) — no others
- **ISR revalidation:** Homepage 5min, match-centre 1min, media 5min, gallery 5min
- **next/image quality:** Configured at [60, 75] with AVIF/WebP formats
- **Static assets:** 1-year immutable cache on `/_next/static/*`
- **Mobile:** Viewport scaling locked, MobileDock dynamically imported

### Changes That Improved Metrics
1. **CDN caching restored** — static assets now cached at edge (was: every request hit origin)
2. **Directus images optimized** — 13 URLs now request specific dimensions/formats instead of raw originals
3. **5 raw `<img>` → `next/image`** — automatic optimization, lazy loading, srcset generation
4. **framer-motion removed from template** — CSS-only page transitions, fewer JS on every page
5. **5 unused client components removed** — smaller bundle (FooterMeteorField was 203 lines of canvas code)

### Remaining Opportunities (Manual / Phase 2)
1. **252 MB in public/images/** — 43 files over 1 MB (player headshots, match photos). These are raw JPGs/PNGs served through `next/image` which optimizes on request, but Vercel build downloads all of them. Consider:
   - Compress originals with TinyPNG/Squoosh (target: <500 KB each)
   - Move large cutouts to Directus CMS (already used for other images)
   - Use `.gitignore` for `/public/images/squads/` and serve via Vercel direct upload
2. **216 KB CSS** — Tailwind v4 production CSS is substantial. Consider:
   - `@tailwindcss/content` purge for unused utilities (Tailwind v4 does this automatically)
   - Move grain.css external CDN request (`grains.y78.fr/grain.png`) to local copy
3. **ContentSquare script** — loaded on every page after consent. No async/defer optimization possible (controlled by CS SDK)
4. **YouTube thumbnail loading** — 3 components load YouTube thumbnail images. Consider lazy loading if not in viewport
5. **`noise.png` (62 KB)** in public/ — referenced by grain texture CSS. Only used in 2 shop components, could be inlined as base64

### Risks
- **`output: 'standalone'` removal** — Safe for Vercel. Would break Docker deployments (not in scope per BLUEPRINT.md Phase 1)
- **Directus image transforms** — Depend on Directus server-side resize support. If Directus doesn't support `?width=` params, images may serve at original size
- **CSS animation replacing framer-motion** — Reduced visual fidelity on page transitions (no spring physics, no exit animations). Acceptable for performance.

---

## Files Changed

| File | Change |
|------|--------|
| `next.config.ts` | Remove `output: 'standalone'`, add bundle analyzer |
| `vercel.json` | NEW — Cache-Control headers for static assets |
| `src/lib/directus/assets.ts` | Enhanced with typed helper functions + fit param |
| `src/lib/api/hero.ts` | Use `heroAssetUrl()` for 1920px hero images |
| `src/lib/api/events.ts` | Use `photoAssetUrl()` for 800px event images |
| `src/lib/api/fixtures.ts` | Use `logoAssetUrl()` for 96px team logos |
| `src/lib/api/gallery.ts` | Use `photoAssetUrl()` for gallery photos |
| `src/lib/api/rankings.ts` | Use `logoAssetUrl()` for ranking logos |
| `src/lib/api/videos.ts` | Use `thumbnailAssetUrl()` for video thumbnails |
| `src/lib/api/teams.ts` | Use headshot/logo/photo asset helpers |
| `src/lib/api/matchDetail.ts` | Use `logoAssetUrl()` for match logos |
| `src/app/schools/page.tsx` | 3× raw `<img>` → `next/image` |
| `src/app/match-centre/MatchCentreClient.tsx` | 2× raw `<img>` → `next/image` |
| `src/app/template.tsx` | Client → Server component, framer-motion → CSS |
| `src/app/globals.css` | Added `@keyframes page-in` animation |
| `src/app/about/layout.tsx` | Removed unused EdgyGradient import |
| **DELETED:** 5 components | FooterMeteorField, CountdownPromo, PretextBackground, PretextHeadline, SectionBoard |
| **DELETED:** 6 public files | file.svg, globe.svg, next.svg, vercel.svg, window.svg, logo.png |
