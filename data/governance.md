# ZRU Content Governance & Taxonomy System

This document outlines the official content governance rules, date formatting conventions, and taxonomy structures for the Zimbabwe Rugby Union web application.

---

## 1. Editorial Taxonomy Rules

### Team Categories
Every article or news piece must use one of the following exact category strings:
- `"Sables"`: Men's 15s Senior National Team
- `"Lady Sables"`: Women's 15s & 7s Senior National Team
- `"Cheetahs"`: Men's 7s Senior National Team
- `"Junior Sables"`: Men's Under-20 National Team
- `"Grassroots"`: Primary & Secondary Schools, Community Rugby
- `"Union News"`: Administrative, Board, and Sponsorship Announcements

> [!IMPORTANT]
> Women's rugby articles must NEVER be categorized under `"Sables"`. They must strictly use `"Lady Sables"`.

---

## 2. Date Formatting System

All UI surfaces must follow these standardized date representations:

| Context | Format Pattern | Example |
| :--- | :--- | :--- |
| **Fixtures / Match Cards** | `DD MMM YYYY` | `25 Apr 2026` |
| **Editorial News Pieces** | `DD MMM YYYY` | `14 Apr 2026` |
| **Event Date Ranges** | `MMM – MMM YYYY` | `May – Sep 2026` |
| **Countdown Timers** | `DD MMM YYYY` | `01 Oct 2027` |

*Note: Use standard en-dashes (`–`) for date ranges, not hyphens or all-caps pipe separators.*

---

## 3. Fixture Freshness & Status Rules

1. **Upcoming Matches**: `status: "upcoming"`. Must feature valid kick-off times and venue names.
2. **Completed Matches**: `status: "completed"`. Must feature final home and away scorelines.
3. **Cancelled / Postponed**: Must display clear badge status rather than silently hiding the fixture.

---

## 4. Brand Token & Styling Rules

1. **Green-Only Accent**: The one and only brand accent color is `var(--color-zru-green)` (`#006B3F`).
2. **Zero Gold Rule**: Never introduce `zru-gold`, `clubhouse-gold`, or `color-gold` tokens anywhere in the UI or focus rings.
3. **Full Card Tappability**: On mobile viewport displays, cards must wrap their contents inside full `<Link>` containers rather than displaying plain text links.
