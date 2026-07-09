# ZRU / Sables Brand Guide — Implementation Notes

This document records the confirmed brand values from the Sables brand guide and
the decisions taken when applying them to the web frontend. The guide is used as
*inspiration* to enhance the existing dark aesthetic — not to rewrite it. The
dark surfaces, slanted CTAs, Bebas Neue headings, HeroCarousel, StripedBackground,
and bento cards are all retained.

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

The repo currently ships two crest assets (full-colour `main.svg`, monotone
`monotone.svg`); the approved variations are mapped onto those two files in
`Logo.tsx` until dedicated reversed lockups are supplied.

## Colour decisions

### Brand green correction

The brand green was previously `#006B3F` (and older `#006039` hardcodes). It has
been corrected to the confirmed `#036936` (Pantone 349C):

- `--color-green-primary` in `src/app/globals.css` (drives `--color-zru-green`
  and the other mapped tokens)
- the hardcoded green in `src/components/ui/StripedBackground.tsx`
- the hardcoded green in `src/app/fan-zone/page.tsx`

Near-black UI surface values (`#0A0A0A`, `#050505`, `#121212`, `#1A1A1A`) are
**not** brand green and were left unchanged. `--color-green-dark` (`#00452A`) is
retained as the deliberate darker depth shade.

### Palette is intentionally green-only (gold removed)

Per the current design direction of this branch, the palette is collapsed to
green: the legacy accent tokens (`--color-zru-gold`, `--color-zru-orange`,
`--color-zru-red`, `--color-red`, `--color-clubhouse-gold`) are all mapped to
`--color-green-primary`. Gold is intentionally **not** used as a secondary
accent. These mappings are deliberate — not bugs — so components like
`MatchCentre` and `common/Button` resolve to brand green rather than colliding
accents.

### Near-black surfaces vs. pure black

Near-black (`#0A0A0A` / `#050505` / `#121212`) is retained as the UI surface
colour for the dark aesthetic. Pure `#000000` is reserved for logo contexts per
the guide.

## Typography

Three display faces coexist:

- **`--font-heading` (Bebas Neue)** — the **default** for all existing headings.
  Nothing changes here.
- **`--font-subheading` (Outfit)** — used for subheadings, unchanged.
- **`--font-display` (Unison Pro)** — an **optional** brand display face applied
  only to select brand moments (logo wordmark lockups, section eyebrows) via the
  `font-display` utility.

Unison Pro is a **licensed** font, so the files are not committed. Add the
licensed files under `public/fonts/` and activate the `next/font/local` loader
in `src/app/layout.tsx` (see `public/fonts/README.md`). Until then,
`--font-display` gracefully falls back to Bebas Neue, so `font-display` is safe
to use before the font is present.
