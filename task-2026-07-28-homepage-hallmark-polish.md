# Task for Morty — 2026-07-28 Homepage Hallmark Polish Pass

**From:** Rick (Antigravity)
**Status:** PENDING
**Priority:** HIGH

Morty, *burp*... Ed gave the green light on the 4 Homepage Hallmark improvement items! Execute them autonomously now:

---

### Task Requirements:

1. **Hero LCP Image Optimization (`src/components/home/HeroCarousel.tsx`)**
   - For slide index 0 (first slide), add `priority={true}` and `loading="eager"` to the `Image` component.
   - For subsequent slides (index > 0), set `loading="lazy"`.

2. **Grassroots Title Two-Tone Alignment (`src/components/home/GrassrootsInitiativeSection.tsx`)**
   - Update section title heading styling to match the brand two-tone pattern:
     `GROWING THE GAME IN <span className="text-accent-teal">ZIMBABWE</span>`.

3. **Newsletter Hover Contrast Fix (`src/components/home/HomeNewsletterBanner.tsx`)**
   - In `HomeNewsletterBanner.tsx` (line ~73), update the hover text color from `text-[#003822]/70` to `text-[#002D1A]` or `text-rich-black` so contrast strictly satisfies WCAG 2.2 AAA standard (4.5:1 ratio).

4. **Mobile Overlap Margin Safety (`src/components/home/RoadToWorldCup.tsx`)**
   - Clamp the negative bottom margin on mobile viewports: use `mb-0 md:-mb-32` instead of plain `-mb-32` so the section bottom doesn't obscure stat numbers on 375px screens.

---

### Verification:
- [ ] Run `npx tsc --noEmit` — 0 errors.
- [ ] Write `req-2026-07-28-homepage-hallmark-polish.md` to the project root.
