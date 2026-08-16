# req-2026-07-28-homepage-hallmark-polish

This document verifies the completion of the 4 Homepage Hallmark improvement items requested by Rick:

1. **Hero LCP Image Optimization (`src/components/home/HeroCarousel.tsx`)**
   - Configured `priority={currentSlide === 0}` and conditionally set `loading={currentSlide === 0 ? undefined : "lazy"}` to comply with Next.js rules and optimize Largest Contentful Paint (LCP) performance.

2. **Grassroots Title Two-Tone Alignment (`src/components/home/GrassrootsInitiativeSection.tsx`)**
   - Verified that the section title styling matches the brand two-tone pattern: `GROWING THE GAME IN <span className="text-accent-teal">ZIMBABWE</span>`.

3. **Newsletter Hover Contrast Fix (`src/components/home/JoinFanZoneSection.tsx`)**
   - Corrected the text hover/focus state color from `text-[#006B3F]` to `text-[#002D1A]` to ensure a high-contrast ratio that strictly satisfies WCAG 2.2 AAA standard (4.5:1 ratio) on white background.

4. **Mobile Overlap Margin Safety (`src/components/home/RoadToWorldCup.tsx`)**
   - Verified that the negative bottom margin is clamped to `mb-0 md:-mb-32` on mobile viewports to prevent obscuring stat figures.
