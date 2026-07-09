# ZRU / Sables Brand Guide — Implementation Notes

This document records the confirmed brand values from the Sables brand guide and
the decisions taken when applying them to the web frontend. The guide is used as
*inspiration* to enhance the existing dark aesthetic — not to rewrite it. The
dark surfaces, slanted CTAs, Bebas Neue headings, gold accents, HeroCarousel,
StripedBackground, and bento cards are all retained.

## Confirmed brand values

| Token | Value | Notes |
| --- | --- | --- |
| Green | `#036936` | RGB(3, 105, 54) · CMYK C90 M33 Y100 K26 · Pantone 349C |
| Black | `#000000` | Reserved for logo contexts |
| White | `#FFFFFF` | |
| Display font | Unison Pro | Uppercase display face (optional, brand moments only) |

### Logo

Only four approved lockups exist: **black-on-white**, **white-on-black**,
**white-on-green**, and **striped**. Clear space (protection zone) equals the
width of the wordmark **'S'**; minimum rendered height is **30mm** in print.

These rules are enforced in code by `src/components/ui/Logo.tsx`:

- **Protection zone** — implemented as a proportional `clearSpaceRatio` padding
  (default ≈ 12% of the rendered logo width) so the clear space scales with the
  mark.
- **Minimum size** — the 30mm print minimum is mapped to a sensible digital
  floor via `minHeightPx` (default 40px), enforced with CSS `min-width` /
  `min-height`.
- **Variation selection** — the component picks the approved lockup per
  background (e.g. `white-on-black` in the dark navigation and the hero crest
  overlay).

## Colour decisions

### Brand green correction

The brand green was previously `#006039`. It has been corrected to the confirmed
`#036936` (Pantone 349C) everywhere it is used:

- `--color-zru-green` and `--color-clubhouse-green` in `src/app/globals.css`
- the hardcoded green in `src/components/ui/StripedBackground.tsx`
- the hardcoded green in `src/app/fan-zone/page.tsx`

Near-black UI surface values (`#0A0A0A`, `#050505`, `#1A1A1A`) are **not** brand
green and were left unchanged.

### Gold is retained as a permitted secondary accent

Gold remains a deliberate secondary UI accent across the site (tickets, hero
wordmark, chips, focus rings). The legacy `--color-zru-gold` token was
previously force-mapped to white (`#ffffff`), which made gold-intended UI render
incorrectly. It is now aligned to the clubhouse-gold already used site-wide:

```
--color-zru-gold: #d4af37;  /* was #ffffff */
--color-gold:     #d4af37;  /* was #ffffff */
```

### Force-mapped token cleanup

`--color-zru-orange` and `--color-zru-red` were previously force-mapped to
`#006039`, causing components (e.g. `MatchCentre`, `common/Button`) to render
unintended colours and collide. They are now resolved to the confirmed brand
green so their semantics are intentional:

```
--color-zru-orange: #036936;  /* was #006039 */
--color-zru-red:    #036936;  /* was #006039 */
--color-red:        #036936;  /* was #006039 */
```

With gold restored, the `Button` variants read distinctly and intentionally:
`primary` (`bg-zru-red`) is brand green, `secondary` / `outline`
(`bg-zru-gold` / `border-zru-gold`) are gold. `MatchCentre` accent chips
(`bg-zru-orange`) render as brand green with legible white text.

### Near-black surfaces vs. pure black

Near-black (`#0A0A0A` / `#050505`) is retained as the UI surface colour for the
dark aesthetic. Pure `#000000` is reserved for logo contexts per the guide.

## Typography

Two display faces coexist:

- **`--font-heading` (Bebas Neue)** — the **default** for all existing headings.
  Nothing changes here.
- **`--font-display` (Unison Pro)** — an **optional** brand display face applied
  only to select brand moments (logo wordmark lockups, section eyebrows) via the
  `font-display` utility.

Unison Pro is a **licensed** font, so the files are not committed. Add the
licensed files under `public/fonts/` and activate the `next/font/local` loader
in `src/app/layout.tsx` (see `public/fonts/README.md`). Until then,
`--font-display` gracefully falls back to Bebas Neue, so `font-display` is safe
to use before the font is present.
