# Unison Pro (optional brand display font)

Unison Pro is the ZRU / Sables brand display face (uppercase). It is a **licensed**
font, so the font files are **not** committed to this repository. Add the licensed
files here to activate the `font-display` utility across the site.

## Required files

Drop the licensed web font files into this directory, e.g.:

```
public/fonts/UnisonPro-Regular.woff2
public/fonts/UnisonPro-Bold.woff2   (optional additional weights)
```

`.woff2` is preferred; `.otf` / `.ttf` also work with `next/font/local`.

## Activation

The loader in `src/app/layout.tsx` is already wired. Uncomment the
`next/font/local` block there and make sure the `src` paths match the file names
you added. The loader exposes the `--font-unison-pro` CSS variable, which
`--font-display` (see `src/app/globals.css`) consumes.

Until the files are present, `font-display` gracefully falls back to the default
heading face (Bebas Neue), so nothing breaks.

## Usage

Apply the `font-display` utility only on select brand moments (logo wordmark
lockups, section eyebrows) — `font-heading` (Bebas Neue) remains the default for
all existing headings.
