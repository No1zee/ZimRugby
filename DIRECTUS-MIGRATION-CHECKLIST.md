# Directus Migration Checklist

Everything a content manager needs to change, mapped to Directus collections.

---

## ALREADY WIRED TO DIRECTUS (working)

| Collection | What it controls | Status |
|---|---|---|
| `hero_slides` | Homepage carousel slides | Empty, falls back to mock |
| `partners` | Sponsor logos & info | Empty, falls back to mock |
| `rankings` | World/Africa ranking position | Empty, falls back to mock |
| `ranking_rivals` | Rival nation flags & positions | Empty, falls back to mock |
| `matches` | Fixtures & results | Empty, falls back to mock |
| `announcements` | Pinned announcements / banner | Has admin permissions |
| `teams` | Team data, squads, crests | Has admin permissions |
| `opponents` | Opponent team data | Has admin permissions |
| `competitions` | Competition data | Has admin permissions |
| `venues` | Venue data | Has admin permissions |
| `photos` | Gallery photos | Empty |
| `videos` | Video content | Empty |
| `events` | Competitions & events | Empty |
| `navigation_items` | Main nav links | Has admin permissions |
| `pages` | Page content blocks | Has admin permissions |
| `page_sections` | Page layout sections | Has admin permissions |
| `global_settings` | Site-wide settings | Has admin permissions |
| `match_centre_settings` | Match centre config | Has admin permissions |

---

## NEEDS MIGRATION (hardcoded in code)

### TIER 1: Content Manager Critical (what they edit daily)

#### Homepage
| File | Line(s) | What | New Collection |
|---|---|---|---|
| `UnifiedHubGrid.tsx` | 45-47 | Section heading "MATCHDAY, MEDIA & MERCHANDISE" | `global_settings` |
| `UnifiedHubGrid.tsx` | 128-140 | Fallback match info (date, venue, time) | `matches` (already exists) |
| `UnifiedHubGrid.tsx` | 150 | CTA "MATCH CENTRE" | `global_settings` |
| `UnifiedHubGrid.tsx` | 194-238 | 4 fallback news articles | `news` (new) |
| `UnifiedHubGrid.tsx` | 263-295 | "Match Tickets" column (price, copy, CTA) | `global_settings` |
| `RoadToWorldCup.tsx` | 15 | Countdown target date "2027-10-01" | `global_settings` |
| `RoadToWorldCup.tsx` | 34-39, 94-99 | "ROAD TO AUSTRALIA / 2027 RUGBY WORLD CUP" | `global_settings` |
| `RoadToWorldCup.tsx` | 71, 82 | Player cutout images | `global_settings` |
| `GrassrootsInitiativeSection.tsx` | 6-46 | 3 initiative cards (title, description, image, link, stat) | `grassroots_initiatives` (new) |
| `GrassrootsInitiativeSection.tsx` | 127-167 | 4 impact stats (15000+, 120+, 10, 45%) | `global_settings` |
| `SponsorGrid.tsx` | 61 | "POWERING ZIMBABWEAN RUGBY" | `global_settings` |
| `SponsorGrid.tsx` | 95 | "BECOME AN OFFICIAL PARTNER" CTA | `global_settings` |
| `ShopCardShowcase.tsx` | 8-21 | 3 product images | `shop_products` (new) |
| `page.tsx` | 6-7 | Page title & description metadata | `pages` (already exists) |
| `page.tsx` | 22-26 | 3 featured players | `teams` (already exists) |

#### Teams
| File | Line(s) | What | New Collection |
|---|---|---|---|
| `teams/page.tsx` | 20-141 | 4 team objects (all data) | `teams` (already exists) |
| `teams/page.tsx` | 149-152 | PageHero title/subtitle/tag | `pages` |
| `teams/page.tsx` | 180-188 | "Development & Pathways" CTA section | `pages` |

#### Events
| File | Line(s) | What | New Collection |
|---|---|---|---|
| `EventsClient.tsx` | 12-108 | 4 competitions + 4 events | `events` (already exists) |
| `EventsClient.tsx` | 110-117 | 6 filter levels | `events` |
| `EventsClient.tsx` | 152-155 | PageHero | `pages` |
| `[id]/page.tsx` | 17-86 | 4 event detail objects | `events` |

#### Tickets
| File | Line(s) | What | New Collection |
|---|---|---|---|
| `tickets/page.tsx` | 30-89 | 5 fixture objects | `matches` (already exists) |
| `tickets/page.tsx` | 181 | Category filter list | `global_settings` |
| `tickets/page.tsx` | 215-221 | Hero heading & paragraph | `pages` |
| `tickets/page.tsx` | 349-374 | 4 "how it works" steps | `global_settings` |
| `tickets/page.tsx` | 417-422 | 5 ticket type descriptions | `ticket_types` (new) |
| `tickets/page.tsx` | 435-451 | Campaign CTA section | `pages` |
| `tickets/page.tsx` | 471-494 | 6 FAQ items | `faqs` (new) |

#### Media
| File | Line(s) | What | New Collection |
|---|---|---|---|
| `MediaPageClient.tsx` | 30-66 | Fallback videos + news archive | `videos`, `news` |
| `MediaPageClient.tsx` | 106-110 | PageHero | `pages` |
| `gallery/page.tsx` | 32 | Folder names | `gallery_folders` (new) |
| `gallery/page.tsx` | 48-63 | Folder metadata | `gallery_folders` |

#### About
| File | Line(s) | What | New Collection |
|---|---|---|---|
| `about/page.tsx` | 10-77 | Stats, mission, vision, contact | `pages` |
| `about/layout.tsx` | 15-30 | Nav menu + PageHero | `pages` |
| `about/governance/page.tsx` | 10-58 | Documents list | `documents` (new) |
| `about/history/page.tsx` | 7-48 | Milestones | `milestones` (new) |
| `about/safeguarding/page.tsx` | 10-73 | Policies, contacts | `pages` |
| `about/careers/page.tsx` | 10-48 | Job listings | `jobs` (new) |
| `about/board/page.tsx` | 11-73 | Leaders, memorial | `leadership` (new) |

#### Fan Zone
| File | Line(s) | What | New Collection |
|---|---|---|---|
| `fan-zone/page.tsx` | 28-46 | Country & team lists | `global_settings` |
| `fan-zone/page.tsx` | 81-109 | PageHero, benefits list | `pages` |
| `fan-zone/page.tsx` | 142-249 | Form labels, success message | `global_settings` |

#### Play Rugby
| File | Line(s) | What | New Collection |
|---|---|---|---|
| `play-rugby/page.tsx` | 11-39 | 4 programme objects | `programmes` (new) |
| `play-rugby/page.tsx` | 42-49 | 6 club objects | `clubs` (new) |
| `play-rugby/page.tsx` | 61-153 | All headings, copy, CTAs | `pages` |

### TIER 2: Layout (changed rarely but needs CMS access)

#### Navigation
| File | Line(s) | What | Collection |
|---|---|---|---|
| `navConfig.ts` | 23-90 | Entire nav tree (5 categories, ~20 links) | `navigation_items` (exists) |
| `Navigation.tsx` | 192 | Live score ticker text | `global_settings` |
| `Navigation.tsx` | 274-304 | Logo image, brand name | `global_settings` |

#### Footer
| File | Line(s) | What | Collection |
|---|---|---|---|
| `Footer.tsx` | 11-48 | 4 footer columns, 16 links | `footer_navigation` (new) |
| `Footer.tsx` | 62-76 | JSON-LD schema (org name, URL, socials) | `global_settings` |
| `Footer.tsx` | 86-103 | Logo, brand name, tagline | `global_settings` |
| `Footer.tsx` | 146-153 | Legal links | `global_settings` |

#### Mobile Dock
| File | Line(s) | What | Collection |
|---|---|---|---|
| `MobileDock.tsx` | 10-17 | 6 dock items | `navigation_items` (exists) |

#### Login
| File | Line(s) | What | Collection |
|---|---|---|---|
| `login/page.tsx` | 9-14 | 4 benefit items | `global_settings` |
| `login/page.tsx` | 98-107 | All branding copy | `global_settings` |

### TIER 3: Newsletter / CTA copy

| File | Line(s) | What | Collection |
|---|---|---|---|
| `FanZoneSignup.tsx` | 71-272 | All fan zone copy (headings, benefits, CTAs) | `global_settings` |
| `HomeNewsletterBanner.tsx` | N/A | Wrapper only (delegates to FanZoneSignup) | - |

---

## NEW COLLECTIONS NEEDED

| Collection | Purpose | Fields |
|---|---|---|
| `news` | News articles for hub grid | title, slug, excerpt, image, category, date, url |
| `grassroots_initiatives` | Homepage grassroots cards | title, badge, subtitle, description, stat, stat_label, image, link, cta, sort |
| `shop_products` | Featured shop items | name, image, price, url, sort |
| `ticket_types` | Ticket category descriptions | name, description, sort |
| `faqs` | FAQ items | question, answer, category, sort |
| `documents` | Governance docs | title, type, size, file_url, sort |
| `milestones` | History milestones | year, title, description, sort |
| `jobs` | Career vacancies | title, department, location, type, email, sort |
| `leadership` | Board members | name, role, image, bio, sort, is_memorial, memorial_text |
| `programmes` | Play Rugby programmes | title, description, icon, link, stat, stat_label, color, sort |
| `clubs` | Registered clubs | name, location, league, sort |
| `gallery_folders` | Photo gallery folders | name, description, date, cover_image, sort |
| `footer_navigation` | Footer link columns | column_title, links (JSON), sort |
| `page_metadata` | SEO metadata per page | page_slug, title, description, og_image |

---

## PRIORITY ORDER

1. **hero_slides** — populate with real slides (already wired)
2. **partners** — populate with real sponsors (already wired)
3. **rankings + ranking_rivals** — populate with real data (already wired)
4. **matches** — populate with real fixtures (already wired)
5. **teams** — populate with real team data (already wired)
6. **announcements** — populate with real announcements (already wired)
7. **events** — populate with real competitions (already wired)
8. **photos** — populate with real gallery (already wired)
9. **videos** — populate with real videos (already wired)
10. **Create `news` collection** — for hub grid news
11. **Create `grassroots_initiatives` collection** — for homepage
12. **Create `faqs` collection** — for tickets page
13. **Create `footer_navigation` collection** — for footer
14. **Migrate `navConfig.ts`** to `navigation_items`
15. **Migrate page copy** to `pages` / `global_settings`
