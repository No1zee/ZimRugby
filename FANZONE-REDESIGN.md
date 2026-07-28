# Fan Zone Redesign Plan (v2)

## Purpose
Fan Zone is a **conversion landing page**. Goal: make visitors want to sign up by showcasing exclusive benefits. Must feel complete and premium — not like a half-built form page.

## Current State
- 3D flip card auto-cycles every 2.8s — hostile UX, user can't control pace
- framer-motion adds ~30KB gzipped for layout transitions
- `transition-all` on form inputs and buttons
- 600+ lines across 2 components

## Redesign Goals
1. **Conversion-first** — Every element drives toward sign-up
2. **Exclusivity** — Benefits feel premium, members-only
3. **Complete page** — Not just a form, but a full landing experience
4. **Simplify** — Kill the flip card, remove framer-motion
5. **Hallmark compliance** — No scale hover, no glow, no transition-all

---

## Proposed Layout

### Desktop (≥1024px)
```
┌─────────────────────────────────────────────────────────────┐
│                      PageHero                               │
│  "Fan Zone" / "The heartbeat of Zimbabwe Rugby..."         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  EXCLUSIVE MEMBER BENEFITS                                  │
│  Join thousands of global Sables supporters                 │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │   🎫    │ │    %    │ │    ✉    │ │    🏆   │         │
│  │PRIORITY │ │ EXCLUSIVE│ │ INSIDER │ │   VIP   │         │
│  │TICKETS  │ │ MERCH   │ │ NEWS    │ │ FAN     │         │
│  │PRESALE  │ │DISCOUNTS│ │LETTER   │ │COMPETE  │         │
│  │         │ │         │ │         │ │         │         │
│  │48hr head│ │10% off  │ │Team news│ │Win signed│        │
│  │start on │ │jerseys &│ │lineups, │ │balls &  │         │
│  │test     │ │gear at  │ │injury   │ │VIP      │         │
│  │matches  │ │Clubhouse│ │updates  │ │passes   │         │
│  │         │ │store    │ │first    │ │         │         │
│  │PRESALE  │ │10% STORE│ │PRESS    │ │VIP      │         │
│  │ACCESS   │ │OFF      │ │INSIDER  │ │ACCESS   │         │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌──────────────────────────────┐    │
│  │                  │  │                              │    │
│  │  JOIN THE        │  │  Full Name                   │    │
│  │  FANZONE         │  │  ─────────────────────────── │    │
│  │                  │  │  Email Address               │    │
│  │  No cost.        │  │  ─────────────────────────── │    │
│  │  Premium         │  │  Country of Residence        │    │
│  │  experience.     │  │  ─────────────────────────── │    │
│  │  Globally        │  │  Favorite National Squad     │    │
│  │  connected.      │  │  ─────────────────────────── │    │
│  │                  │  │  ☐ I agree to join...        │    │
│  │  ────────────    │  │                              │    │
│  │                  │  │  [REGISTER SUPPORTERS CARD]  │    │
│  │  ✓ Priority      │  │                              │    │
│  │    ticket access │  │                              │    │
│  │  ✓ 10% merch     │  │                              │    │
│  │    discount      │  │                              │    │
│  │  ✓ Insider       │  │                              │    │
│  │    newsletter    │  │                              │    │
│  │  ✓ VIP           │  │                              │    │
│  │    competitions  │  │                              │    │
│  │                  │  │                              │    │
│  └──────────────────┘  └──────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

(After submit):
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           DIGITAL SUPPORTER PASS                    │   │
│  │  ZRU Crest | MEMBER NAME | SQUAD | COUNTRY          │   │
│  │  MEMBER ID: ZRU-XXXXXX | STATUS: ACTIVE             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  WELCOME TO THE FANZONE!                                   │
│  Your membership is active. Confirmation sent to email.    │
│  10% Clubhouse discount activated.                         │
│                                                             │
│  [Create Another Supporter Account]                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Mobile (<1024px)
Single column stacking:
1. PageHero
2. Benefits heading
3. Benefits cards (2-column grid on mobile)
4. Registration section (heading + form, full-width)
5. Success state

---

## Component Specs

### `FanzoneBenefits.tsx` (NEW — ~100 lines)
Static benefits grid. No animations, no auto-cycle, no flip.

**Props:** None (self-contained)

**Structure:**
```tsx
<section>
  <h2>EXCLUSIVE MEMBER BENEFITS</h2>
  <p>Join thousands of global Sables supporters</p>
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {benefits.map(benefit => (
      <BenefitCard key={benefit.title} {...benefit} />
    ))}
  </div>
</section>
```

**BenefitCard anatomy:**
```
<div className="bg-white border border-black/5 rounded-2xl p-5 group">
  [Icon container] — 48x48, bg-zru-green/10, rounded-xl, icon in zru-green
  [Category badge] — text-[9px] font-black uppercase tracking-widest text-zru-green
  [Title] — text-sm font-black uppercase tracking-tight text-rich-black
  [Description] — text-xs text-black/60 font-normal leading-relaxed
  [Bottom badge] — text-[9px] font-black uppercase tracking-widest text-zru-green
                   bg-zru-green/10 px-2 py-0.5 rounded
```

**Hover:** `group-hover:text-zru-green` on title, `group-hover:bg-zru-green/15` on icon bg

### `page.tsx` (REWRITTEN — ~200 lines)
Linear flow, no framer-motion, no layout transitions.

**State:** name, email, country, favTeam, agreed, submitted, isSubmitting, submitError (same as current)

**Layout:**
1. EdgyGradient background (keep — it's subtle and on-brand)
2. PageHero (keep — same props)
3. Benefits section (new FanzoneBenefits component)
4. Registration section (two-column: left = heading + checklist, right = form)
5. Success state (conditional render, no AnimatePresence)

**Registration section left column:**
```tsx
<div className="space-y-4">
  <h2>JOIN THE FANZONE</h2>
  <p>No cost. Premium experience. Globally connected.</p>
  <div className="space-y-2">
    <CheckItem icon={CheckCircle2} text="Priority ticket presale access" />
    <CheckItem icon={CheckCircle2} text="10% official merchandise discount" />
    <CheckItem icon={CheckCircle2} text="Insider squad newsletter" />
    <CheckItem icon={CheckCircle2} text="VIP fan competitions" />
  </div>
</div>
```

**CheckItem component (inline):**
```tsx
<div className="flex items-center gap-2 text-xs text-black/60">
  <Icon className="w-4 h-4 text-zru-green shrink-0" />
  <span>{text}</span>
</div>
```

### `FanzoneFlipShowcase.tsx` (DELETED)
Replaced by FanzoneBenefits. No longer needed.

---

## Anti-Patterns to Remove

| Pattern | Location | Fix |
|---------|----------|-----|
| framer-motion AnimatePresence | page.tsx:110 | Delete — conditional render |
| framer-motion motion.div | page.tsx:112,134,246 | Delete — plain div |
| framer-motion layout animation | page.tsx:135-136 | Delete — CSS only |
| transition-all | page.tsx:94 | transition-[background-color,color] |
| transition-all | page.tsx:103 | transition-[max-width,grid-template-columns] |
| transition-all | page.tsx:137 | transition-[border-color,box-shadow,ring] |
| 3D flip transforms | FanzoneFlipShowcase (entire) | N/A — deleted |
| Auto-cycling timer | FanzoneFlipShowcase useEffect | N/A — deleted |
| AnimatePresence exit | FanzoneFlipShowcase:110 | N/A — deleted |

---

## Design Tokens Used

- `bg-milk-white` — Page background
- `text-rich-black` — Primary text
- `bg-white` — Card backgrounds
- `border-black/5` — Card borders
- `zru-green` / `#006747` — Accent color
- `font-heading` — Unison Pro (headings only)
- `font-body` — Helvetica Neue (body/UI)
- `rounded-2xl` — Card radius
- `text-[9px]` — Micro labels
- `text-[10px]` — Form labels
- `text-xs` — Body text
- `font-black uppercase tracking-tight` — Card titles
- `font-black uppercase tracking-widest` — Micro labels

---

## Migration Plan

1. Create `FanzoneBenefits.tsx` — static grid
2. Rewrite `page.tsx` — remove framer-motion, new layout
3. Delete `FanzoneFlipShowcase.tsx`
4. Build and verify
5. Commit and push
