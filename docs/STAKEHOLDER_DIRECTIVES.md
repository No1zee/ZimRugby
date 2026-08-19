# Zimbabwe Rugby Union (ZRU) Stakeholder Directives & Decision Log

> **Source of Truth for Stakeholder Feedback, Directives & Project Requirements**  
> **Stakeholders**: Naeema / Zimbabwe Rugby Union Executive  
> **Repository**: `ZimRugby` (`https://github.com/No1zee/ZimRugby`)

---

## 📌 Master Directives & Permanent Rules

| Ref ID | Category | Stakeholder Directive | Implementation Target | Status |
|---|---|---|---|---|
| **ZRU-DIR-001** | **Branding & Theme** | Footer background canvas MUST be Milk White (`#FDFBF0`) with ZRU Green navigation accents. Never pure black. | `src/components/layout/Footer.tsx` | ✅ Implemented |
| **ZRU-DIR-002** | **Typography** | Universal Two-Tone Heading Plate (`.heading-plate`) on section titles: Line 1 Black/White, Line 2 ZRU Green/Teal over a slanted translucent plate. | `design.md`, `src/app/globals.css`, Sections | ✅ Implemented |
| **ZRU-DIR-003** | **Announcements** | Single signature Red-Green gradient ribbon (`#4A0808` → `#004D2C` → `#4A0808`). No mock/fallback banners if Directus is empty. | `GlobalAnnouncementBar.tsx`, `announcements.ts` | ✅ Implemented |
| **ZRU-DIR-004** | **Footer Navigation** | Simplify footer links to clean, approved pages only (About, Contact, Partners, National Teams, Fixtures/Tickets, GIR, Schools, Referees). | `src/components/layout/Footer.tsx` | ✅ Implemented |
| **ZRU-DIR-005** | **Match Centre** | Fixtures, live scores, and occurrences must dynamically sync from the Calendar occurrences engine & Directus without hardcoded locks. | `src/lib/match-centre/api.ts` | ✅ Implemented |
| **ZRU-DIR-006** | **Admin Teams & Squads** | Visual squad selector cards for national teams (Sables, Lady Sables, U20, Cheetahs) with dedicated player roster managers and profile photo uploads. | `VisualTeamsManager.tsx`, `AdminClient.tsx` | ✅ Implemented |

---

## 🗂️ Intake & Changelog Entries

### [2026-08-19] Session Directives: Visual Squads, Two-Tone Plates & Footer Cleanup
- **Received From**: Naeema / User
- **Items**:
  1. *Footer Trim*: Removed redundant sub-links (Sables Trust, High Performance, Safeguarding, Live Hub) per Naeema's review.
  2. *Two-Tone Typography Standard*: Codified the angled green plate system into `design.md`.
  3. *Visual Team Cards*: Added interactive cards for Sables, Lady Sables, U20, and Cheetahs in `/admin` with player management.
- **Verification**: Verified via `npx tsc --noEmit` and deployed to `main` & `preview`.

---

## 📝 How to Log New Stakeholder Feedback

Whenever you receive a note, screenshot, WhatsApp message, voice memo summary, or email from Naeema / ZRU:
1. Paste it into the chat and say: *"Log this from Naeema: [Details]"*
2. The `zru-stakeholder-intake` skill will automatically categorize it, assign a `ZRU-DIR-XXX` identifier, add it to this log, and update the implementation checklist.
