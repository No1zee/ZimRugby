"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronLeft, ChevronRight, List, MapPin, Pencil, Plus, Trash2, CalendarPlus } from "lucide-react";
import ImagePicker from "./ui/ImagePicker";
import { EmptyState } from "./ui/StatusChip";
import { deriveEventStatus } from "@/lib/events/status";
import { useToast } from "./ui/ToastProvider";
import { useConfirm } from "./ui/ConfirmProvider";

export interface AdminEventRow {
  id: number;
  title?: string;
  subtitle?: string;
  date?: string;
  time?: string;
  date_label?: string;
  location?: string;
  description?: string;
  content?: string;
  image?: string;
  image_url?: string;
  ticket_url?: string;
  sort?: number;
  status?: string;
  page_type?: string;
  category?: string;
  tags?: string[] | string | null;
  score?: string;
  is_match?: boolean;
}

interface EventsPanelProps {
  initialEvents: AdminEventRow[];
  onDirtyChange?: (dirty: boolean) => void;
}

type ViewMode = "month" | "list";

interface FormState {
  entry_kind: "event" | "news" | "campaign";
  title: string;
  subtitle: string;
  page_type: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  content: string;
  image: string;
  ticket_url: string;
  sort: string;
  status: string;
  score: string;
}

const EMPTY_FORM: FormState = {
  entry_kind: "event",
  title: "",
  subtitle: "",
  page_type: "general",
  category: "",
  date: "",
  time: "",
  location: "",
  description: "",
  content: "",
  image: "",
  ticket_url: "",
  sort: "",
  status: "published",
  score: "",
};

const LOCATION_PRESETS = [
  "Harare Sports Club, Harare",
  "Hartsfield Rugby Stadium, Bulawayo",
  "Police Grounds, Harare",
  "Old Georgians Sports Club, Harare",
  "Prince Edward School Fields, Harare",
  "Jubilee Field, St. George's College, Harare",
  "Peterhouse Boys, Marondera",
  "National Sports Stadium, Harare",
  "Mutare Sports Club, Mutare",
];

const CATEGORY_PRESETS = [
  "National Team",
  "Club Rugby",
  "Schools Rugby",
  "Squad Drop",
  "Campaign",
  "Coaching / Ref Clinic",
  "Union Governance",
  "Youth Camp",
  "Sponsor Activation",
  "Women's Rugby",
  "Sevens Rugby",
];

const TITLE_PRESETS = [
  "Zimbabwe Sables vs Namibia",
  "Zimbabwe Sables vs Kenya",
  "Zimbabwe Sables vs Uganda",
  "Zimbabwe Lady Sables vs Zambia",
  "Zimbabwe Cheetahs 7s Tournament",
  "Junior Sables (U20) vs Kenya U20",
  "Harare Sports Club vs Old Georgians",
  "Old Hararians vs Pitbulls",
  "Prince Edward vs St. George's College",
  "Peterhouse vs St. John's College",
  "ZRU Annual General Meeting",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateStr(iso?: string): string {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : "";
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function statusTone(status: "upcoming" | "ongoing" | "completed"): string {
  switch (status) {
    case "ongoing":
      return "bg-zru-green text-white";
    case "completed":
      return "bg-black/10 text-black/50";
    default:
      return "bg-blue-600/10 text-blue-800";
  }
}

export default function EventsPanel({ initialEvents, onDirtyChange }: EventsPanelProps) {
  const router = useRouter();
  const { toast } = useToast();
  const confirm = useConfirm();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [form, setForm] = useState<FormState | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const dirtyRef = useRef(false);

  useEffect(() => {
    const dirty = form !== null;
    if (dirty !== dirtyRef.current) {
      dirtyRef.current = dirty;
      onDirtyChange?.(dirty);
    }
  }, [form, onDirtyChange]);

  const byDate = useMemo(() => {
    const map = new Map<string, AdminEventRow[]>();
    for (const ev of initialEvents) {
      const key = toDateStr(ev.date);
      if (!key) continue;
      const list = map.get(key) || [];
      list.push(ev);
      map.set(key, list);
    }
    return map;
  }, [initialEvents]);

  const derivedStatus = (ev: AdminEventRow) => deriveEventStatus(ev.date, ev.time);

  const calendar = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const sortedEvents = useMemo(() => {
    return [...initialEvents]
      .filter((e) => toDateStr(e.date))
      .sort((a, b) => (toDateStr(a.date) || "").localeCompare(toDateStr(b.date) || "") || (a.time || "").localeCompare(b.time || ""));
  }, [initialEvents]);

  function openCreate(dateStr?: string) {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, date: dateStr || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEdit(ev: AdminEventRow) {
    setEditingId(ev.id);
    setForm({
      entry_kind: "event",
      title: ev.title || "",
      subtitle: ev.subtitle || "",
      page_type: ev.page_type || "general",
      category: ev.category || "",
      date: toDateStr(ev.date),
      time: ev.time || "",
      location: ev.location || "",
      description: ev.description || "",
      content: ev.content || "",
      image: ev.image || "",
      ticket_url: ev.ticket_url || "",
      sort: ev.sort != null ? String(ev.sort) : "",
      status: ev.status || "published",
      score: ev.score || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setForm(null);
    setEditingId(null);
  }

  function slugify(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      if (form.entry_kind === "news") {
        const newsPayload = {
          title: form.title,
          slug: form.subtitle ? slugify(form.subtitle) : slugify(form.title),
          excerpt: form.description,
          body: form.content,
          category: form.category || "NEWS",
          image: form.image || null,
          status: form.status || "published",
          date: form.date ? `${form.date}T${form.time || '10:00'}:00.000Z` : new Date().toISOString(),
        };
        const res = await fetch("/api/admin/directus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collection: "news", data: newsPayload }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.error || res.statusText);
        }
        toast(`Scheduled news article '${form.title}' for ${form.date}.`);
      } else if (form.entry_kind === "campaign") {
        const campaignPayload = {
          title: form.title,
          subtitle: form.subtitle || "Official ZRU Campaign",
          page_type: "general",
          category: "Campaign",
          tags: ["Campaign"],
          date: form.date || null,
          time: form.time || null,
          location: form.location || "National Digital & Stadium",
          description: form.description || null,
          content: form.content || null,
          image: form.image || null,
          ticket_url: form.ticket_url || null,
          status: form.status || "published",
        };
        const res = await fetch("/api/admin/directus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collection: "events", data: campaignPayload }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.error || res.statusText);
        }
        toast(`Scheduled campaign '${form.title}' on the Master Calendar for ${form.date}.`);
      } else {
        const payload: Record<string, unknown> = {
          title: form.title || null,
          subtitle: form.subtitle || null,
          page_type: form.page_type || "general",
          category: form.category || "National Team",
          tags: [form.category || "National Team"],
          date: form.date || null,
          time: form.time || null,
          location: form.location || null,
          description: form.description || null,
          content: form.content || null,
          image: form.image || null,
          ticket_url: form.ticket_url || null,
          sort: form.sort === "" ? null : Number(form.sort),
          status: form.status || "published",
          score: form.score || null,
        };
        const res = await fetch("/api/admin/directus", {
          method: editingId !== null ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            editingId !== null
              ? { collection: "events", id: editingId, data: payload }
              : { collection: "events", data: payload }
          ),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.error || res.statusText);
        }
        toast(editingId !== null ? "Event saved." : "Event created.");
      }
      setForm(null);
      setEditingId(null);
      router.refresh();
    } catch (err) {
      toast(`Failed to save: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(ev: AdminEventRow) {
    const ok = await confirm({
      title: "Delete event?",
      message: `"${ev.title || "this event"}" will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete event",
      danger: true,
    });
    if (!ok) return;
    try {
      const res = await fetch("/api/admin/directus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "events", id: ev.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || res.statusText);
      }
      if (editingId === ev.id) {
        setForm(null);
        setEditingId(null);
      }
      toast("Event deleted.");
      router.refresh();
    } catch (err) {
      toast(`Delete failed: ${err instanceof Error ? err.message : err}`, "error");
    }
  }

  const todayKey = dayKey(new Date());

  return (
    <div className="space-y-6">
      {/* Create / Edit form */}
      {form && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
            <div>
              <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
                <CalendarPlus className="h-5 w-5 text-zru-green" />
                {editingId !== null 
                  ? "Edit Event" 
                  : form.entry_kind === "news" 
                  ? "Schedule News Article" 
                  : form.entry_kind === "campaign"
                  ? "Schedule Campaign Drop"
                  : "New Event / Fixture / Clinic"}
              </h2>
              <p className="mt-1 text-xs text-black/50">
                {form.entry_kind === "news" 
                  ? "Schedule a news post to publish on the chosen date." 
                  : form.entry_kind === "campaign"
                  ? "Schedule a supporters or sponsor campaign on the Master Calendar."
                  : "Events, matches, squad drops, clinics, and meetings appear on the Master Calendar."}
              </p>
            </div>

            {/* Entry Kind Switcher */}
            {editingId === null && (
              <div className="flex p-1 bg-black/5 rounded-xl border border-black/10">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, entry_kind: "event" })}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    form.entry_kind === "event" ? "bg-zru-green text-white shadow font-black" : "text-black/60 hover:text-black"
                  }`}
                >
                  🏉 Match / Event
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, entry_kind: "news" })}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    form.entry_kind === "news" ? "bg-rich-black text-white shadow font-black" : "text-black/60 hover:text-black"
                  }`}
                >
                  📰 News Post
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, entry_kind: "campaign" })}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    form.entry_kind === "campaign" ? "bg-rose-600 text-white shadow font-black" : "text-black/60 hover:text-black"
                  }`}
                >
                  🚀 Campaign
                </button>
              </div>
            )}
          </div>

          {/* Datalists for quick dropdown selection or custom typing */}
          <datalist id="title-presets">
            {TITLE_PRESETS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
          <datalist id="category-presets">
            {CATEGORY_PRESETS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <datalist id="location-presets">
            {LOCATION_PRESETS.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {form.entry_kind === "event" ? (
              <>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">
                    Match / Event Title * (Select dropdown preset or type custom)
                  </label>
                  <input
                    type="text"
                    list="title-presets"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="e.g. Sables vs Namibia"
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Subtitle / Competition Round</label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="e.g. Rugby Africa Gold Cup Round 3"
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">
                    Level / Category (Select dropdown or type)
                  </label>
                  <input
                    type="text"
                    list="category-presets"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. National Team, Schools Rugby"
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Event Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Kickoff / Start Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">
                    Venue / Location (Select dropdown or type)
                  </label>
                  <input
                    type="text"
                    list="location-presets"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Harare Sports Club, Harare"
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">
                    Score (For completed matches e.g. ZIM 32 - 10 KEN)
                  </label>
                  <input
                    type="text"
                    value={form.score}
                    onChange={(e) => setForm({ ...form, score: e.target.value })}
                    placeholder="e.g. ZIM 32 - 10 KEN"
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">
                    Article Headline *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="e.g. Sables Squad Announced for Africa Cup Finals"
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">
                    News Category
                  </label>
                  <select
                    value={form.category || "NEWS"}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
                  >
                    {["NEWS", "PRESS RELEASE", "SABLES", "LADY SABLES", "JUNIORS", "CLUB RUGBY", "ANNOUNCEMENT", "SPONSORSHIP"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">
                    Scheduled Publish Date *
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
              >
                <option value="published">Published (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">
                {form.entry_kind === "news" ? "Article Hook / Summary" : "Short Description"}
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={form.entry_kind === "news" ? "One or two sentences to hook readers." : "One or two lines shown on calendar card."}
                className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">
                {form.entry_kind === "news" ? "Full Article Content (Rich HTML / Text)" : "Full Details"}
              </label>
              <textarea
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder={form.entry_kind === "news" ? "Write or paste article text here..." : "Full match / event details."}
                className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Hero Image</label>
              <ImagePicker value={form.image} onChange={(id) => setForm({ ...form, image: id })} hint="Upload or select photo." />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-zru-green px-6 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800 disabled:opacity-50"
            >
              {saving ? "Savingâ€¦" : editingId !== null ? "Save changes" : "Create event"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-lg bg-black/5 px-6 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/70 transition-colors hover:bg-black/10"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Header + view toggle */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
            <CalendarDays className="h-5 w-5 text-zru-green" /> Events calendar
          </h2>
          <p className="mt-1 text-xs text-black/50">
            {initialEvents.length} event{initialEvents.length === 1 ? "" : "s"} â€” status updates automatically as dates pass.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-black/10 bg-black/5 p-1">
            <button
              onClick={() => setViewMode("month")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${viewMode === "month" ? "bg-black text-white" : "text-black/60 hover:text-black"}`}
            >
              <CalendarDays className="h-4 w-4" /> Month
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${viewMode === "list" ? "bg-black text-white" : "text-black/60 hover:text-black"}`}
            >
              <List className="h-4 w-4" /> List
            </button>
          </div>
          <a
            href="/api/calendar"
            target="_blank"
            className="flex items-center gap-2 rounded-lg bg-black/5 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/70 transition-colors hover:bg-black/10"
            title="Download or subscribe to the .ics calendar feed"
          >
            <CalendarPlus className="h-4 w-4" /> Subscribe ICS
          </a>
          <button
            onClick={() => openCreate()}
            className="flex items-center gap-2 rounded-lg bg-zru-green px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800"
          >
            <Plus className="h-4 w-4" /> New event
          </button>
        </div>
      </div>

      {viewMode === "month" ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-black uppercase text-rich-black">{monthLabel(cursor)}</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                className="rounded-lg border border-black/10 bg-white p-2 text-black/70 transition-colors hover:bg-black/5"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
                }}
                className="rounded-lg border border-black/10 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-black/70 transition-colors hover:bg-black/5"
              >
                Today
              </button>
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                className="rounded-lg border border-black/10 bg-white p-2 text-black/70 transition-colors hover:bg-black/5"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-black/10 bg-black/5">
            {WEEKDAYS.map((d) => (
              <div key={d} className="bg-black/[0.03] px-2 py-2 text-center text-[10px] font-black uppercase tracking-wider text-black/50">
                {d}
              </div>
            ))}
            {calendar.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} className="min-h-[110px] bg-white" />;
              const key = dayKey(date);
              const dayEvents = byDate.get(key) || [];
              const isToday = key === todayKey;
              return (
                <div key={key} className={`min-h-[110px] bg-white p-1.5 ${isToday ? "bg-zru-green/[0.06]" : ""}`}>
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isToday ? "bg-zru-green text-white" : "text-black/60"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    <button
                      onClick={() => openCreate(key)}
                      className="rounded p-0.5 text-black/30 transition-colors hover:bg-zru-green/10 hover:text-zru-green"
                      aria-label={`Add event on ${key}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => {
                          if (ev.is_match) {
                            toast("Matches must be managed in the Match Centre panel.", "info");
                          } else {
                            openEdit(ev);
                          }
                        }}
                        title={ev.is_match ? `[MATCH] ${ev.title}` : ev.title}
                        className={`block w-full truncate rounded-md px-1.5 py-1 text-left text-[10px] font-bold leading-tight transition-opacity hover:opacity-80 ${ev.is_match ? "bg-green-100 text-green-800 border border-green-200/50" : statusTone(derivedStatus(ev))}`}
                      >
                        {ev.is_match ? `🏉 ${ev.title}` : ev.title}
                      </button>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="block px-1.5 text-[9px] font-bold text-black/40">
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          {sortedEvents.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="h-8 w-8" />}
              title="No events yet"
              hint="Click â€œNew eventâ€ to add the first one â€” it will appear here and on the public /events page."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-black/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 bg-black/[0.02] text-left text-[10px] font-black uppercase tracking-wider text-black/50">
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Event</th>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Location</th>
                    <th className="px-4 py-2.5">State</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEvents.map((ev) => {
                    const st = derivedStatus(ev);
                    return (
                      <tr key={ev.id} className="border-b border-black/5 last:border-0">
                        <td className="whitespace-nowrap px-4 py-2.5 font-bold">
                          {ev.date ? new Date(toDateStr(ev.date) + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "â€”"}
                          {ev.time ? <span className="ml-1.5 text-black/40">Â· {ev.time}</span> : null}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="font-bold">{ev.title || "Untitled"}</div>
                          {ev.subtitle ? <div className="text-xs text-black/50">{ev.subtitle}</div> : null}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${ev.page_type === "competition" ? "bg-amber-100 text-amber-800" : "bg-zru-green/10 text-zru-green"}`}>
                            {ev.page_type === "competition" ? "Competition" : "Event"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-black/60">
                          {ev.location ? (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-zru-green" /> {ev.location}
                            </span>
                          ) : "â€”"}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusTone(st)}`}>
                              {st === "ongoing" ? "Today" : st === "completed" ? "Completed" : "Upcoming"}
                            </span>
                            {ev.status === "draft" && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
                                Draft
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-end gap-1">
                            {ev.is_match ? (
                              <span className="text-[10px] font-bold text-zru-green/70 bg-zru-green/5 px-2.5 py-0.5 rounded uppercase tracking-wider">
                                Match Centre
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => openEdit(ev)}
                                  className="rounded-lg p-2 text-black/50 transition-colors hover:bg-zru-green/10 hover:text-zru-green"
                                  aria-label={`Edit ${ev.title}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(ev)}
                                  className="rounded-lg p-2 text-black/50 transition-colors hover:bg-red-50 hover:text-red-600"
                                  aria-label={`Delete ${ev.title}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
