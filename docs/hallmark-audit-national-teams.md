# Hallmark Audit — National Teams Pages

**Tool:** Hallmark v1.1.0 (Nutlope/hallmark)
**Installed via:** `npx skills add nutlope/hallmark`
**Audit date:** 2026-07-25
**Scope:** `/teams` index page, `/teams/[slug]` detail page, and all shared components under `src/components/teams/` and `src/components/ui/` used by these routes.
**design.md detected:** Yes — audit checks pages against the declared design system.

---

## Pre-flight context

- **Font stack:** Unison Pro (headings, `var(--font-heading)`) + Helvetica Neue LT Std (body, `var(--font-body)`)
- **Palette:** ZRU Green `#006747`, Milk White `#FDFBF0`, Rich Black `#0E0E0E`, Accent Teal `#00C88C`
- **Motion:** framer-motion 11 installed
- **Framework:** Next.js 15 (App Router)
- **Genre:** Editorial (athletic/institutional)
- **Hallmark stamp:** None — no prior Hallmark run on these files.

---

## Findings

### Critical (ships as slop)

**C1. The 3-column feature grid**
`src/components/teams/FeaturedPlayersGrid.tsx:16`
Fixed `grid-cols-3` layout rendering three identical `FeaturedPlayerCard` components in a symmetric row. Each card follows the same structure: image → position badge → name → stats → CTA. This is the canonical AI-generated feature grid pattern.
→ **Fix:** Break the symmetry. Vary card sizes (one featured large + two smaller), or switch to an asymmetric bento layout. Remove one card and use negative space. Alternatively, drop the grid entirely and use a horizontal scroll rail with varied card widths.

**C2. Side-stripe section headers (repeated)**
`src/components/teams/TeamPageClient.tsx:187, 224, 298, 314`
Every tab panel (Coaching, Fixtures, History, Gallery) opens with the identical pattern: `border-l-4 border-zru-green pl-4` wrapping a heading and subtitle. Four repetitions of the same thick left-border stripe is the most-recognised AI section-header fingerprint.
→ **Fix:** Use a single heading with no left border. If you want a green accent, place a small inline square or dot beside the heading — not a 4px edge stripe. Vary the header treatment across sections (e.g., Coaching uses a bold type-only header, Fixtures uses a date-led header, Gallery uses an image-led header).

---

### Major (looks AI-generated)

**M1. Italic headers on every heading**
`src/components/teams/TeamHero.tsx:64`, `TeamRailCard.tsx:55`, `TeamInfoGrid.tsx:43`, `InfoCell.tsx:43`, `TeamPageClient.tsx:80, 128, 212, 250, 259, 362`
Every heading across the teams pages uses `font-heading italic`. Hallmark flags italic display type as a reliable AI tell — it reads as "trying to look editorial." The project's design system sets `font-style: italic` on headings globally in `globals.css`, which is a deliberate brand choice. However, the anti-pattern is specifically about *relying on italic for emphasis* rather than weight, colour, or scale. The italic is doing zero structural work here — every heading is italic, so none of them stand out.
→ **Fix:** Make headings roman (`font-style: normal`). Carry emphasis with weight (900), accent colour (`text-accent-teal` on key words), or scale contrast. Reserve italic for body-copy emphasis only. If the design system must keep italic headings, at least vary the treatment — some headings roman, some italic — to break the monotony.

**M2. Eyebrows on multiple sections**
`src/components/teams/TeamRailShell.tsx:19` ("NATIONAL TEAMS"), `src/components/teams/TeamInfoGrid.tsx:39` ("Team Intelligence")
Two sections use uppercase mono-cap eyebrows. Eyebrows are default OFF per Hallmark — they're ordinal devices, not decoration. When every section has one, the hierarchy collapses.
→ **Fix:** Remove both eyebrows. Let the heading text ("Choose a squad to explore", team name) do the work. If numbering is needed (e.g., "01 — Squad"), limit to 1–2 per page max.

**M3. Shadow-glow on dark background**
`src/components/teams/TeamLogo.tsx:43`
Active team logo gets `boxShadow: 0 0 24px ${accent}55` — a coloured halo on the rich-black background. Coloured drop-shadows on dark surfaces read as AI-generated depth.
→ **Fix:** On dark surfaces, use lightness for elevation (brighter surface = higher). Replace the glow with a brighter ring stroke or a subtle background highlight (`bg-white/[0.08]`).

**M4. Universal hover:scale-105 on images**
`src/components/teams/FeaturedPlayerCard.tsx:46`, `PlayerCardGrid.tsx:97`, `TeamPageClient.tsx:198, 328`
Every image-bearing element scales 105% on hover. Coach avatars, player photos, gallery thumbnails — all identical. The uniform scale signal is a microinteraction tell.
→ **Fix:** Pick one signal per element type. Player cards: subtle translateY(-2px) + shadow. Gallery: opacity shift on overlay. Coach cards: border-colour change. Never the same scale on everything.

**M5. `transition-all` used everywhere**
`src/components/teams/TeamRailCard.tsx:38`, `FeaturedPlayerCard.tsx:22`, `PlayerCardGrid.tsx:73`, `TeamPageClient.tsx:153, 354, 369`
At least 6 components use `transition-all duration-300`, animating every CSS property including ones that should be instant (visibility, focus rings, z-index).
→ **Fix:** Specify properties. `transition: background-color 300ms ease, box-shadow 300ms ease, transform 200ms ease`. Never `transition-all`.

**M6. Clickable text wraps to two lines**
`src/components/teams/TeamPageClient.tsx:150-163`
Tab buttons ("FIXTURES & RESULTS", "COACHING & MANAGEMENT") use `flex` with no `white-space: nowrap`. At 320px viewport with 6 tabs, these labels will wrap onto two lines, breaking the button affordance.
→ **Fix:** Add `whitespace-nowrap` to tab buttons, or shorten labels ("FIXTURES", "COACHES"). On mobile, allow horizontal scroll for the tab strip (already has `overflow-x-auto`) but keep each button single-line.

**M7. Glassmorphism without purpose**
`src/components/teams/TeamPageClient.tsx:143`
The sticky tab bar uses `bg-milk-white/90 backdrop-blur-md` on a white background — frosted glass over nothing. The dropdown at line 94 uses `backdrop-blur-md` with `card-green`, which is semi-purposeful (overlays content). The tab bar blur is decorative.
→ **Fix:** Remove `backdrop-blur-md` from the tab bar. Use solid `bg-milk-white` with a `border-b` for separation.

**M8. Card-in-card nesting**
`src/components/teams/TeamHero.tsx:118`
The promo card (`.card-surface`) is a full card component nested inside the hero section, which itself is a contained card with `rounded-3xl`. Two containment layers with no semantic reason.
→ **Fix:** Remove the outer hero container's card treatment, or flatten the promo card into the hero's content grid (e.g., a side-by-side layout without the nested card wrapper).

---

### Minor (small taste issues)

**m1. Tabular data without tabular-nums**
`src/components/teams/TeamHero.tsx:91`, `TeamInfoGrid.tsx`, `InfoCell.tsx:43`
Stats (rankings, squad sizes, caps) use proportional figures. Numbers in columns don't align vertically.
→ **Fix:** Add `font-variant-numeric: tabular-nums` to stat containers.

**m2. Predictable section rhythm**
All sections follow a similar padding pattern (`py-16` or `py-20`). The page rhythm is hero → rail → hero → divider → info grid → pathway banner. Every transition is a full-width section break with equal whitespace.
→ **Fix:** Vary section padding. Tighten one section, expand another. Break the full-width rhythm with an inset or asymmetric layout.

**m3. `accent-teal` not in design.md**
`#00C88C` (accent-teal) is used extensively across the teams pages (eyebrows, badges, highlights) but is not declared in `design.md`'s palette. `design.md` states: "No gold or other accents are permitted" — teal is an undeclared accent.
→ **Fix:** Either add `accent-teal` to `design.md` as an official secondary accent, or replace teal usages with ZRU Green `#006747` to stay within the declared system.

---

## Summary

```
2 critical · 8 major · 3 minor
```

**Verdict — reads as AI-generated.** The 3-column symmetric grid and repeated side-stripe headers are critical slop. The italic-everywhere, universal hover-scale, and transition-all patterns compound the AI fingerprint. The pages have strong brand identity (ZRU Green, Unison Pro, slanted buttons) but the structural patterns are the default AI template underneath.

---

## Recommendations (code-level, for future implementation)

1. **FeaturedPlayersGrid:** Replace `grid-cols-3` with an asymmetric layout — e.g., one large featured card spanning 2 columns + two smaller cards stacked, or a horizontal scroll rail with varied widths.

2. **Section headers in TeamPageClient:** Drop the `border-l-4` stripe. Use type-only headers with weight/scale variation per section. Coaching: bold name-first. Fixtures: date-led. Gallery: image-led.

3. **Italic → Roman headings:** Change `font-style: italic` to `font-style: normal` on headings. Emphasise with `font-weight: 900` + `text-accent-teal` on key words.

4. **Hover effects:** Replace universal `scale-105` with per-element treatments: translateY on cards, opacity on overlays, border-colour on interactive elements.

5. **Transition properties:** Replace every `transition-all` with explicit property lists: `transition: background-color 300ms ease, box-shadow 300ms ease`.

6. **Tab strip mobile:** Add `whitespace-nowrap` to tab buttons. Shorten labels for mobile.

7. **Glassmorphism:** Remove `backdrop-blur-md` from the sticky tab bar. Solid background + border is enough.

8. **Hero card-in-card:** Flatten the promo card into the hero grid. Remove the outer `card-surface` wrapper.

---

## How to rerun

```bash
# Reinstall or update Hallmark
npx skills add nutlope/hallmark --yes

# The audit is a manual process — load the skill, then invoke:
# "hallmark audit src/app/teams/page.tsx src/components/teams/"
```

Hallmark is installed as a skill at `.agents/skills/hallmark/`. To run the audit, load the skill in your AI assistant session and use the `audit` verb. The anti-patterns reference is at `.agents/skills/hallmark/references/anti-patterns.md`.
