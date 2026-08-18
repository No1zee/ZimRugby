# ZimRugby

The Zimbabwe Rugby Union's digital presence: a public website plus a staff-facing admin
portal, collectively the ZRU Digital Hub. This context covers the concepts the admin
portal and public site share.

## Language

**ZRU Digital Hub**:
The collective name for the union's digital systems — the ZRU website and the Admin portal.
_Avoid_: CMS (architecture docs only), "the digital stuff"

**ZRU website**:
The public-facing site (currently deployed at zimrugby.vercel.app; zimrugby.co.zw is the
canonical domain). What fans and the public see.
_Avoid_: the app, the front-end (architecture docs only)

**Admin portal**:
The staff-facing backend where ZRU staff manage the website's content, fixtures, fans and
team. Branded "The Touchline" in the UI and "THE TOUCHLINE" in the sidebar.
_Avoid_: admin, dashboard (when meaning the whole portal), the CMS (architecture docs only)

**The Touchline**:
The product brand of the Admin portal's user interface. Not a separate system — the Admin
portal, presented as The Touchline.

**Role**:
A named set of permissions a staff member holds (Content Editor, Media Manager, super admin,
...). The single word for who-can-do-what. Never "actor".
_Avoid_: actor, role/permissions split

**Status**:
An item's place in the editorial workflow: `draft` → `in_review` → `approved` → `published`
(→ `archived`). One axis. Applies to anything staff create and publish.
_Avoid_: conflating with schedule (below); "active" as an editorial state

**Schedule**:
When an item is live to the public: a start/end window (`publish_at`/`expire_at`,
`start_date`/`end_date`). The other axis. An item can be approved but not yet live, or live
inside a window and in review for the next one.
_Avoid_: "scheduled" as an editorial status; window vs status mixing in copy

**Match status**:
Stored values `upcoming` | `live` | `final` | `cancelled`. Display label for `final` is
**Completed**. There is no "finished" variant — public-facing values are `upcoming` |
`live` | `completed`. Results live in `result_outcome`, never in the status.
_Avoid_: "finished", mixing result_outcome into status

**Reviewer**:
The content manager — the editor role (and super admin) — approves the work of everyone
else. No one approves their own work: an item you created shows "Waiting for another
reviewer" to you. Authorship is tracked via `created_by_email` (server-set on create).
_Avoid_: self-approval, "the system approves", anonymous review

**Safe point**:
A session-scoped undo state in the Backups panel — lives in this browser tab, gone when
you leave. It undoes your own editing session; it is NOT a backup.
_Avoid_: calling safe points backups, implying they survive the browser

**Backup**:
A durable copy that survives anything: the nightly dump, or the downloaded copy from the
Backups panel. Restores data from outside the session.
_Avoid_: calling session undo state a backup

**Occurrence**:
A concrete instance of something on the calendar — an `event_occurrences` row, a `matches`
row (its `kickoff_at`), an announcement window, or a campaign window. The occurrence
stream is the calendar's single source of truth for "what is on, and when"; status lives
on the occurrence (`confirmed` | `tentative` | `cancelled`), and an event's time/status
are derived from its primary occurrence.
_Avoid_: deriving calendar state from the legacy `events.date`/`time` fields

**Event**:
A standalone calendar entry in the Events collection, or the public word for anything on
the calendar. Public calendar UI says "event", never "fixture".
_Avoid_: "fixture" in public calendar copy

**Fixture**:
A match, specifically. The public calendar shows matches under the calendar, not as
"fixtures".
_Avoid_: using "fixture" for non-match calendar items

**Calendar feed**:
The RFC 5545 file at `/api/calendar.ics` — the only public calendar artifact.
`/api/calendar` redirects (301) to it.
_Avoid_: maintaining two feed endpoints; calling the redirect the feed

**CAT (Central Africa Time)**:
Zimbabwe local time, `Africa/Harare`, UTC+2, no DST. Every wall time on the calendar is
CAT; naive stored times (e.g. match `kickoff_at`) are interpreted as CAT.
_Avoid_: `+00:00` interpretations of naive kickoff times

**Campaign running**:
A campaign whose schedule window is live (`status` `running` + `start_date`/`end_date`).
Only `published` or `running` campaigns appear on the calendar.
_Avoid_: "active", draft campaigns leaking onto the calendar