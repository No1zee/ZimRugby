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