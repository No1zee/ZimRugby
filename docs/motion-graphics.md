# ZimRugby Motion Graphics & Micro-interactions Documentation

This document describes the lightweight motion graphics and micro-interactions added to improve the visual design and interactive quality of the ZimRugby platform without degrading page performance.

---

## 1. Implemented Enhancements

### A. Infinite Sponsors Marquee
- **Component**: `SponsorGrid.tsx`
- **Animation Details**:
  - Continuous horizontal infinite scrolling marquee driven by standard CSS translation keyframes (`transform: translate3d`).
  - Automatically pauses on hover so users can easily view or click a partner's logo.
  - Generous grayscale filter transitions to full brand color on hover.
  - Falls back to static layout when `prefers-reduced-motion: reduce` is active.

### B. Road to World Cup Scroll Reveals
- **Component**: `RoadToWorldCup.tsx`
- **Animation Details**:
  - Integrates scrolling viewport entries for the left and right player graphic cutouts.
  - Utilizes Framer Motion's `whileInView` prop with custom spring dynamics (`y: 80` to `y: 0`).
  - Staggered timing (`delay: 0.15s` on the right cutout) creates visual depth.

### C. Grassroots Staggered Cards & Count-Ups
- **Component**: `GrassrootsInitiativeSection.tsx`
- **Animation Details**:
  - Cards slide-up on entry with sequential stagger delay.
  - Stat counters dynamically count up from `0` to the actual value using a custom high-performance `requestAnimationFrame` loop that fires when the section intersects the viewport.
  - Complete integration with the standard `useReducedMotion` hook.

---

## 2. Reduced Motion Fallback

All custom animations conform to the operating system's standard accessibility setting `prefers-reduced-motion`. 
- **In Framer Motion elements**: Checked using `useReducedMotion()` to bypass translation offsets.
- **In Marquee / Pulse elements**: Overridden via CSS media queries:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
  }
}
```
