"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, Copy, CheckSquare, Square, Loader2, AlertCircle, Archive, RotateCcw, ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusChip from "./ui/StatusChip";
import ImagePicker, { toAssetUrl } from "./ui/ImagePicker";
import RichTextEditor from "./ui/RichTextEditor";
import { SearchBox, Pagination } from "./ui/ListTools";
import { useToast } from "./ui/ToastProvider";
import { useConfirm, usePrompt } from "./ui/ConfirmProvider";

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "textarea" | "richtext" | "select" | "image" | "date" | "datetime" | "number" | "boolean" | "csv";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  colSpan?: "full";
}

interface CollectionManagerProps {
  collection: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  items: Record<string, unknown>[];
  displayField: string;
  subtitleField?: string;
  badgeField?: string;
  statusField?: string;
  /** Date-window fields (e.g. announcement starts_at/ends_at). Enables upcoming/active/expired chips + purge-expired. */
  scheduleField?: { starts: string; ends: string };
  searchable?: string[];
  pageSize?: number;
  singularLabel?: string;
  onDirtyChange?: (dirty: boolean) => void;
  /** External request to open the editor for a specific item id. */
  focusId?: string | number | null;
  onFocusHandled?: () => void;
  /** Per-action grants (role-gated UI). Absent = full access (all allowed). */
  grants?: { create?: boolean; update?: boolean; delete?: boolean };
  /** Whether the actor may permanently purge trashed items (super admin). */
  canPurge?: boolean;
  /** Enables the approval pipeline (Draft → In review → Approved → Live) for this collection. */
  reviewable?: boolean;
  /** Whether the actor can approve/reject in-review items (editor, super admin). */
  canReview?: boolean;
}

function formatDisplay(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(str) && !isNaN(new Date(str).getTime())) {
    return new Date(str).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  return str;
}

function isDateFieldType(type?: string): boolean {
  return type === "date" || type === "datetime";
}

function isBooleanValue(v: unknown): boolean {
  return typeof v === "boolean" || v === "true" || v === "false" || v === "1" || v === "0";
}

/** Normalised status label for filtering: boolean fields → shown/hidden, strings → lowercase value. */
function statusValue(item: Record<string, unknown>, statusField?: string): string {
  if (!statusField) return "";
  const raw = item[statusField];
  if (isBooleanValue(raw)) return raw === true || raw === "true" || raw === "1" ? "shown" : "hidden";
  return String(raw ?? "").toLowerCase();
}

function itemSortKey(item: Record<string, unknown>): string {
  const d = item.created_at || item.date_created || item.date || item.updated_at;
  if (d) return String(d);
  return String(item.id ?? "");
}

/** Window lifecycle of a dated item: "upcoming" | "active" | "expired" | "" (no window set). */
function scheduleValue(item: Record<string, unknown>, schedule?: { starts: string; ends: string }): string {
  if (!schedule) return "";
  const now = Date.now();
  const starts = item[schedule.starts] ? new Date(String(item[schedule.starts])).getTime() : null;
  const ends = item[schedule.ends] ? new Date(String(item[schedule.ends])).getTime() : null;
  const hasStarts = starts !== null && !isNaN(starts);
  const hasEnds = ends !== null && !isNaN(ends);
  if (hasStarts && now < starts) return "upcoming";
  if (hasEnds && now > ends) return "expired";
  if (hasStarts || hasEnds) return "active";
  return "";
}

function formatWindowRange(item: Record<string, unknown>, schedule?: { starts: string; ends: string }): string {
  if (!schedule) return "";
  const fmt = (v: unknown) => {
    if (!v) return "";
    const d = new Date(String(v));
    return isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
        (String(v).length > 10 ? ` ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : "");
  };
  const s = fmt(item[schedule.starts]);
  const e = fmt(item[schedule.ends]);
  if (s && e) return `${s} → ${e}`;
  return s || e;
}

export default function CollectionManager({
  collection,
  title,
  description,
  fields,
  items,
  displayField,
  subtitleField,
  badgeField,
  statusField,
  scheduleField,
  searchable,
  pageSize = 8,
  singularLabel,
  onDirtyChange,
  focusId,
  onFocusHandled,
  grants,
  canPurge = false,
  reviewable = false,
  canReview = false,
}: CollectionManagerProps) {
  const canCreate = grants?.create !== false;
  const canUpdate = grants?.update !== false;
  const canDelete = grants?.delete !== false;
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scheduleFilter, setScheduleFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);
  const [page, setPage] = useState(1);
  const [showTrash, setShowTrash] = useState(false);
  const [trashItems, setTrashItems] = useState<Record<string, unknown>[]>([]);
  const [trashBusy, setTrashBusy] = useState(false);
  const deletedBackup = useRef<{ id: string | number; item: Record<string, unknown> } | null>(null);
  const publishedBackup = useRef<{ id: string | number; prev: unknown }[] | null>(null);
  const dirtyRef = useRef(false);

  const router = useRouter();
  const { toast } = useToast();
  const confirm = useConfirm();
  const prompt = usePrompt();

  const term = (v: unknown) => (v === null || v === undefined ? "" : String(v));

  useEffect(() => {
    const dirty = touched;
    if (dirty !== dirtyRef.current) {
      dirtyRef.current = dirty;
      onDirtyChange?.(dirty);
    }
  }, [touched, onDirtyChange]);

  // Deep-link: open the editor for a requested item once it's available.
  const openedFocus = useRef<string | number | null>(null);
  useEffect(() => {
    if (focusId === null || focusId === undefined || focusId === openedFocus.current) return;
    const item = items.find((it) => String(it.id) === String(focusId));
    if (!item) return;
    openedFocus.current = focusId;
    startEdit(item);
    onFocusHandled?.();
    // startEdit is intentionally omitted: it changes every render and the
    // openedFocus ref already guards against re-opening the same item.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId, items]);

  const statusOptions = useMemo(() => {
    if (!statusField) return [] as string[];
    const seen = new Set<string>();
    items.forEach((it) => seen.add(statusValue(it, statusField)));
    const order = ["published", "draft", "active", "shown", "hidden"];
    return [...seen].sort((a, b) => order.indexOf(a) - order.indexOf(b) || a.localeCompare(b));
  }, [items, statusField]);

  const filtered = useMemo(() => {
    const keys = searchable?.length ? searchable : [displayField, subtitleField ?? ""].filter(Boolean);
    const q = query.trim().toLowerCase();
    let list = items;
    if (q) list = list.filter((it) => keys.some((k) => term(it[k]).toLowerCase().includes(q)));
    if (statusFilter !== "all") list = list.filter((it) => statusValue(it, statusField) === statusFilter);
    if (scheduleFilter !== "all") list = list.filter((it) => scheduleValue(it, scheduleField) === scheduleFilter);
    list = [...list].sort((a, b) => {
      const cmp = itemSortKey(a).localeCompare(itemSortKey(b));
      return sortNewest ? -cmp : cmp;
    });
    return list;
  }, [items, query, searchable, displayField, subtitleField, sortNewest, statusFilter, statusField, scheduleFilter, scheduleField]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const selectedIds = useMemo(() => {
    const ids = new Set(selected);
    filtered.forEach((it) => {
      if (!ids.has(String(it.id))) return;
      const s = statusValue(it, statusField);
      if (statusFilter !== "all" && s !== statusFilter) ids.delete(String(it.id));
    });
    return ids;
  }, [selected, filtered, statusFilter, statusField]);

  function setField(key: string, value: string) {
    setTouched(true);
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(item: Record<string, unknown>, duplicate = false) {
    const data: Record<string, string> = {};
    fields.forEach((f) => {
      const raw = item[f.key];
      if (f.type === "boolean") {
        data[f.key] = raw === true || raw === "true" || raw === 1 ? "1" : "0";
      } else if (isDateFieldType(f.type)) {
        data[f.key] = f.type === "datetime" ? (raw ? String(raw).slice(0, 16) : "") : raw ? String(raw).slice(0, 10) : "";
      } else if (duplicate && f.key === "slug") {
        data[f.key] = "";
      } else if (duplicate && f.key === displayField) {
        data[f.key] = `${raw !== null && raw !== undefined ? String(raw) : ""} (copy)`;
      } else if (f.type === "csv") {
        data[f.key] = Array.isArray(raw) ? String(raw.join(", ")) : raw !== null && raw !== undefined ? String(raw) : "";
      } else {
        data[f.key] = raw !== null && raw !== undefined ? String(raw) : "";
      }
    });
    if (duplicate && statusField && statusOptions.includes("draft")) data[statusField] = "draft";
    setFormData(data);
    setEditingId(duplicate ? null : String(item.id));
    setFormOpen(true);
    setErrors({});
    setTouched(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setFormData({});
    setEditingId(null);
    setFormOpen(false);
    setTouched(false);
    setErrors({});
  }

  function openCreate() {
    const data: Record<string, string> = {};
    const today = new Date().toISOString().slice(0, 10);
    fields.forEach((f) => {
      if (f.type === "boolean") data[f.key] = "0";
      else if (f.type === "select" && f.options?.[0]) data[f.key] = f.options[0];
      else if (isDateFieldType(f.type)) data[f.key] = today;
      else data[f.key] = "";
    });
    setFormData(data);
    setEditingId(null);
    setFormOpen(true);
    setErrors({});
    setTouched(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      if (!f.required) return;
      if (f.type === "boolean") return;
      const v = formData[f.key] ?? "";
      if (!v.trim()) next[f.key] = `${f.label} is required.`;
    });
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = fields.find((f) => next[f.key]);
      if (first) {
        const el = document.getElementById(`cm-field-${collection}-${first.key}`);
        el?.focus();
      }
    }
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!validate()) return;
    const payload: Record<string, unknown> = {};
    fields.forEach((f) => {
      let v: unknown = formData[f.key] ?? "";
      if (f.type === "number") v = v === "" ? null : Number(v);
      else if (f.type === "boolean") v = v === "1";
      else if (f.type === "datetime") v = v ? new Date(String(v)).toISOString() : null;
      else if (f.type === "csv") v = String(v).split(",").map((s) => s.trim()).filter(Boolean);
      else if (isDateFieldType(f.type)) v = v || null;
      else if (v === "") v = null;
      payload[f.key] = v;
    });
    setSaving(true);
    try {
      const res = await fetch("/api/admin/directus", {
        method: editingId !== null ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId !== null
            ? { collection, id: editingId, data: payload }
            : { collection, data: payload }
        ),
      });
      if (res.ok) {
        toast(editingId !== null ? "Saved changes." : "Created successfully.");
        resetForm();
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        toast(`Failed to save: ${err?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Error: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setSaving(false);
    }
  }

  async function restoreDeleted() {
    const backup = deletedBackup.current;
    if (!backup) return;
    deletedBackup.current = null;
    try {
      const res = await fetch("/api/admin/directus/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, action: "restore", id: backup.id }),
      });
      if (res.ok) {
        toast("Item restored.");
        setShowTrash(false);
        setTrashItems([]);
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        toast(`Restore failed: ${err?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Restore failed: ${err instanceof Error ? err.message : err}`, "error");
    }
  }

  async function loadTrash() {
    if (showTrash) {
      setShowTrash(false);
      return;
    }
    setShowTrash(true);
    setTrashBusy(true);
    try {
      const res = await fetch(`/api/admin/directus/trash?collection=${encodeURIComponent(collection)}`);
      const json = await res.json().catch(() => null);
      if (res.ok) {
        setTrashItems(json?.data || []);
      } else {
        toast(`Could not load trash: ${json?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Error: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setTrashBusy(false);
    }
  }

  async function restoreTrashRow(id: string | number) {
    if (!canUpdate || trashBusy) return;
    setTrashBusy(true);
    try {
      const res = await fetch("/api/admin/directus/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, action: "restore", id }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || res.statusText);
      toast("Item restored.");
      setTrashItems((prev) => prev.filter((it) => String(it.id) !== String(id)));
      router.refresh();
    } catch (err) {
      toast(`Restore failed: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setTrashBusy(false);
    }
  }

  async function purgeTrashRow(id: string | number) {
    if (!canPurge || trashBusy) return;
    const ok = await confirm({
      title: "Permanently delete this item?",
      message: "This permanently removes the item from the CMS. It cannot be recovered.",
      confirmLabel: "Purge",
      danger: true,
    });
    if (!ok) return;
    setTrashBusy(true);
    try {
      const res = await fetch("/api/admin/directus/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, action: "purge", id }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || res.statusText);
      toast("Item permanently deleted.");
      setTrashItems((prev) => prev.filter((it) => String(it.id) !== String(id)));
      router.refresh();
    } catch (err) {
      toast(`Purge failed: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setTrashBusy(false);
    }
  }

  async function purgeAllTrash() {
    if (!canPurge || trashBusy || trashItems.length === 0) return;
    const ok = await confirm({
      title: `Permanently delete ${trashItems.length} trashed item(s)?`,
      message: "This permanently removes every trashed item in this collection. It cannot be recovered.",
      confirmLabel: "Purge all",
      danger: true,
    });
    if (!ok) return;
    setTrashBusy(true);
    try {
      const res = await fetch("/api/admin/directus/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, action: "purge-all" }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || res.statusText);
      toast(`Purged ${trashItems.length} item(s).`);
      setTrashItems([]);
      router.refresh();
    } catch (err) {
      toast(`Purge failed: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setTrashBusy(false);
    }
  }

  async function handleDelete(id: string | number) {
    const ok = await confirm({
      title: `Delete this ${singularLabel || "item"}?`,
      message: "The item moves to the trash (removed from the website). You can restore it from the Trash panel.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    const backup = { id, item: items.find((it) => String(it.id) === String(id)) ?? {} };
    try {
      const res = await fetch("/api/admin/directus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, id }),
      });
      if (res.ok) {
        deletedBackup.current = backup;
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(String(id));
          return next;
        });
        setEditingId((prev) => (prev === id ? null : prev));
        toast("Item deleted. Click Undo to bring it back.", "success", {
          label: "Undo",
          onClick: restoreDeleted,
        });
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        toast(`Delete failed: ${err?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Error: ${err instanceof Error ? err.message : err}`, "error");
    }
  }

  /** Audience-naming publish gate: "Post" is always a confirm that names who sees it. */
  const publishConfirm = async (): Promise<boolean> => {
    return confirm({
      title: "Post to the website?",
      message: "This will be visible to everyone on zimrugby.co.zw within about a minute. You'll get an Undo button if you change your mind.",
      confirmLabel: "Post it",
    });
  };

  async function toggleStatus(item: Record<string, unknown>, statusFieldName: string) {
    const raw = item[statusFieldName];
    try {
      if (isBooleanValue(raw)) {
        const next = !(raw === true || raw === "true" || raw === "1");
        const res = await fetch("/api/admin/directus", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collection, id: item.id, data: { [statusFieldName]: next } }),
        });
        if (res.ok) {
          toast(next ? "Turned on." : "Turned off.");
          router.refresh();
        } else {
          toast("Could not update.", "error");
        }
        return;
      }
      const current = term(item[statusFieldName]);
      let next: string;
      if (reviewable) {
        if (current === "published" || current === "active" || current === "approved") next = "draft";
        else if (current === "in_review" || current === "draft") next = current === "in_review" ? "draft" : "in_review";
        else next = "published";
      } else {
        next = current === "published" || current === "active" ? "draft" : "published";
      }
      if (next === "published" && !(await publishConfirm())) return;
      const res = await fetch("/api/admin/directus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, id: item.id, data: { [statusFieldName]: next } }),
      });
      if (res.ok) {
        if (next === "published") {
          publishedBackup.current = [{ id: item.id as string | number, prev: current }];
          toast("Posted to the website. Click Undo to take it down.", "success", {
            label: "Undo",
            onClick: undoPublish,
            durationMs: 5000,
          });
        } else if (next === "in_review") {
          toast("Sent for review — waiting on the editor.");
        } else {
          toast(next === "draft" ? "Moved back to draft." : "Marked as approved.");
        }
        router.refresh();
      } else {
        toast("Could not update status.", "error");
      }
    } catch (err) {
      toast(`Error: ${err instanceof Error ? err.message : err}`, "error");
    }
  }

  async function approveItem(item: Record<string, unknown>, statusFieldName: string) {
    const res = await fetch("/api/admin/directus", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, id: item.id, data: { [statusFieldName]: "approved", review_note: null } }),
    });
    if (res.ok) {
      toast("Approved — ready to post.");
      router.refresh();
    } else {
      toast("Could not approve.", "error");
    }
  }

  async function requestChanges(item: Record<string, unknown>, statusFieldName: string) {
    const note = await prompt({
      title: "Request changes",
      message: "The author will see your note and can fix it before re-submitting.",
      label: "What should the author change?",
      placeholder: "e.g. Please add the team line-up and a final score.",
      confirmLabel: "Send back",
    });
    if (!note) return;
    const res = await fetch("/api/admin/directus", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, id: item.id, data: { [statusFieldName]: "draft", review_note: note } }),
    });
    if (res.ok) {
      toast("Sent back to the author with your note.");
      router.refresh();
    } else {
      toast("Could not send back.", "error");
    }
  }

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    const visibleIds = visible.map((it) => String(it.id));
    const allSelected = visibleIds.every((id) => selectedIds.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      visibleIds.forEach((id) => {
        if (allSelected) next.delete(id);
        else next.add(id);
      });
      return next;
    });
  }

  async function undoPublish() {
    const backup = publishedBackup.current;
    if (!backup || backup.length === 0) return;
    publishedBackup.current = null;
    const ids = backup.map((b) => b.id);
    const prevByKey = new Map(backup.map((b) => [String(b.id), b.prev]));
    try {
      const res = await fetch("/api/admin/directus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection,
          ids,
          data: { [statusField ?? ""]: prevByKey.get(String(ids[0])) ?? "draft" },
        }),
      });
      if (res.ok) {
        toast(`Unpublished ${ids.length} item(s) — back to draft.`);
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        toast(`Undo failed: ${err?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Undo failed: ${err instanceof Error ? err.message : err}`, "error");
    }
  }

  async function bulkSetStatus(publish: boolean) {
    if (bulkBusy || selectedIds.size === 0) return;
    const ok = await confirm({
      title: publish ? `Publish ${selectedIds.size} ${label}?` : `Move ${selectedIds.size} ${label} to draft?`,
      message: publish
        ? `These will be visible to everyone on zimrugby.co.zw within about a minute. You'll get an Undo button if you change your mind.`
        : "Selected items will be hidden from the website.",
      confirmLabel: publish ? "Post it" : "Move to draft",
    });
    if (!ok) return;
    setBulkBusy(true);
    try {
      const ids = [...selectedIds];
      if (publish && statusField) {
        publishedBackup.current = items
          .filter((it) => ids.includes(String(it.id)))
          .map((it) => ({ id: it.id as string | number, prev: it[statusField] }));
      }
      const res = await fetch("/api/admin/directus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, ids, data: { [statusField ?? ""]: publish ? "published" : "draft" } }),
      });
      if (res.ok) {
        toast(publish ? `Published ${ids.length} items.` : `Moved ${ids.length} items to draft.`, "success",
          publish && publishedBackup.current
            ? { label: "Undo", onClick: undoPublish, durationMs: 5000 }
            : undefined);
        setSelected(new Set());
        router.refresh();
      } else {
        publishedBackup.current = null;
        const err = await res.json().catch(() => null);
        toast(`Failed: ${err?.error || res.statusText}`, "error");
      }
    } catch (err) {
      publishedBackup.current = null;
      toast(`Error: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setBulkBusy(false);
    }
  }

  async function bulkDelete() {
    if (bulkBusy || selectedIds.size === 0) return;
    const ok = await confirm({
      title: `Move ${selectedIds.size} ${label} to trash?`,
      message: "The selected items will be removed from the website and can be restored from the Trash panel.",
      confirmLabel: "Move to trash",
      danger: true,
    });
    if (!ok) return;
    setBulkBusy(true);
    try {
      const ids = [...selectedIds];
      const res = await fetch("/api/admin/directus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, ids }),
      });
      if (res.ok) {
        toast(`Deleted ${ids.length} items.`);
        setSelected(new Set());
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        toast(`Failed: ${err?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Error: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setBulkBusy(false);
    }
  }

  const label = singularLabel || "item";
  const statusIsBoolean = !!statusField && (items.length === 0 || isBooleanValue(items[0][statusField]));

  // Only reachable when super-admin (canPurge). Moves every date-window-expired
  // row to the trash (recoverable), mirroring the phased soft-delete model.
  async function purgeExpired() {
    if (!canPurge || !scheduleField || bulkBusy) return;
    const expired = items.filter((it) => scheduleValue(it, scheduleField) === "expired");
    if (expired.length === 0) return;
    const ok = await confirm({
      title: `Move ${expired.length} expired to trash?`,
      message: "Expired announcements are no longer shown on the site. They will be moved to the Trash panel where you can restore or permanently purge them.",
      confirmLabel: "Move expired to trash",
      danger: true,
    });
    if (!ok) return;
    setBulkBusy(true);
    try {
      const ids = expired.map((it) => String(it.id));
      const res = await fetch("/api/admin/directus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, ids }),
      });
      if (res.ok) {
        toast(`Moved ${ids.length} expired item(s) to trash.`);
        if (scheduleFilter === "expired") setScheduleFilter("all");
        setSelected(new Set());
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        toast(`Failed: ${err?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Error: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setBulkBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 px-6 py-4">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-lg font-black uppercase text-rich-black">
            {title}
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-black text-black/50">{items.length}</span>
          </h2>
          {description && <p className="mt-0.5 text-xs text-black/50">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadTrash}
            title="Trashed items (soft-deleted)"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
              showTrash ? "bg-amber-100 text-amber-800" : "bg-black/5 text-black/60 hover:bg-black/10"
            }`}
          >
            <Archive className="h-3 w-3" />
            Trash
          </button>
          <label className="flex items-center gap-1.5 rounded-lg bg-black/5 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-black/60">
            <ChevronDown className="h-3 w-3" />
            <select
              value={sortNewest ? "newest" : "oldest"}
              onChange={(e) => setSortNewest(e.target.value === "newest")}
              className="cursor-pointer bg-transparent font-black uppercase tracking-wider outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
          {!formOpen && canCreate && (
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 rounded-lg bg-zru-green px-4 py-2 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800"
            >
              <Plus className="h-3.5 w-3.5" /> Add {label}
            </button>
          )}
        </div>
      </div>

      {/* Trash panel: soft-deleted rows, restored with the SAME id (links survive). */}
      {showTrash && (
        <div className="border-b border-black/5 bg-amber-50/50 p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-amber-900">
              <Archive className="h-4 w-4" /> Trash — {collection}
              <span className="rounded-full bg-amber-200/70 px-2 py-0.5 text-[10px] text-amber-900">{trashItems.length}</span>
            </h3>
            {canPurge && trashItems.length > 0 && (
              <button
                onClick={purgeAllTrash}
                disabled={trashBusy}
                className="flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white transition-colors hover:bg-red-800 disabled:opacity-50"
              >
                <ShieldX className="h-3 w-3" /> Purge all ({trashItems.length})
              </button>
            )}
          </div>
          {trashBusy && !trashItems.length ? (
            <p className="flex items-center gap-2 text-xs text-amber-800"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading trashed items…</p>
          ) : trashItems.length === 0 ? (
            <p className="text-xs text-amber-800/70">Trash is empty. Deleted items appear here and stay until purged.</p>
          ) : (
            <ul className="space-y-2">
              {trashItems.map((it) => (
                <li key={String(it.id)} className="flex items-center justify-between gap-3 rounded-lg border border-amber-200/70 bg-white px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-rich-black">{String(it[displayField] ?? it.id)}</p>
                    <p className="text-[10px] text-black/40">
                      {String(it.id)} · trashed {it.deleted_at ? new Date(String(it.deleted_at)).toLocaleString() : "?"}
                      {it.deleted_by ? ` by ${it.deleted_by}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {canUpdate && (
                      <button
                        onClick={() => restoreTrashRow(it.id as string | number)}
                        disabled={trashBusy}
                        className="flex items-center gap-1 rounded-lg bg-zru-green px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800 disabled:opacity-50"
                      >
                        <RotateCcw className="h-3 w-3" /> Restore
                      </button>
                    )}
                    {canPurge && (
                      <button
                        onClick={() => purgeTrashRow(it.id as string | number)}
                        disabled={trashBusy}
                        className="flex items-center gap-1 rounded-lg bg-black/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" /> Purge
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Create / Edit form */}
      {formOpen && (
        <form onSubmit={handleSubmit} className="border-b border-black/5 bg-black/[0.02] p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((field) => {
              const full = field.colSpan === "full" || field.type === "richtext" || field.type === "textarea";
              const fieldError = errors[field.key];
              const fieldId = `cm-field-${collection}-${field.key}`;
              return (
                <div key={field.key} className={full ? "md:col-span-2" : ""}>
                  <label htmlFor={fieldId} className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">
                    {field.label}
                    {field.required && field.type !== "boolean" && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={fieldId}
                      rows={4}
                      value={formData[field.key] || ""}
                      onChange={(e) => setField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={saving}
                      className={`w-full rounded-lg border bg-white p-2.5 text-sm disabled:opacity-60 ${fieldError ? "border-red-400" : "border-black/10"}`}
                    />
                  ) : field.type === "richtext" ? (
                    <RichTextEditor value={formData[field.key] || ""} onChange={(html) => setField(field.key, html)} />
                  ) : field.type === "select" ? (
                    <select
                      id={fieldId}
                      value={formData[field.key] || ""}
                      onChange={(e) => setField(field.key, e.target.value)}
                      disabled={saving}
                      className={`w-full rounded-lg border bg-white p-2.5 text-sm font-bold disabled:opacity-60 ${fieldError ? "border-red-400" : "border-black/10"}`}
                    >
                      <option value="">— Select —</option>
                      {(field.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "image" ? (
                    <ImagePicker
                      value={formData[field.key] || ""}
                      onChange={(id) => setField(field.key, id)}
                      hint="Upload or reuse an image."
                    />
                  ) : field.type === "date" ? (
                    <input
                      id={fieldId}
                      type="date"
                      value={formData[field.key] || ""}
                      onChange={(e) => setField(field.key, e.target.value)}
                      disabled={saving}
                      className={`w-full rounded-lg border bg-white p-2.5 text-sm disabled:opacity-60 ${fieldError ? "border-red-400" : "border-black/10"}`}
                    />
                  ) : field.type === "datetime" ? (
                    <input
                      id={fieldId}
                      type="datetime-local"
                      value={formData[field.key] || ""}
                      onChange={(e) => setField(field.key, e.target.value)}
                      disabled={saving}
                      className={`w-full rounded-lg border bg-white p-2.5 text-sm disabled:opacity-60 ${fieldError ? "border-red-400" : "border-black/10"}`}
                    />
                  ) : field.type === "number" ? (
                    <input
                      id={fieldId}
                      type="number"
                      step="any"
                      value={formData[field.key] || ""}
                      onChange={(e) => setField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={saving}
                      className={`w-full rounded-lg border bg-white p-2.5 text-sm disabled:opacity-60 ${fieldError ? "border-red-400" : "border-black/10"}`}
                    />
                  ) : field.type === "boolean" ? (
                    <div className="flex items-center gap-3 pt-1.5">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setField(field.key, formData[field.key] === "1" ? "0" : "1")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-60 ${
                          formData[field.key] === "1" ? "bg-zru-green" : "bg-black/20"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            formData[field.key] === "1" ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="text-sm text-black/60">{formData[field.key] === "1" ? "Yes" : "No"}</span>
                    </div>
                  ) : (
                    <input
                      id={fieldId}
                      type="text"
                      value={formData[field.key] || ""}
                      onChange={(e) => setField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={saving}
                      className={`w-full rounded-lg border bg-white p-2.5 text-sm font-bold disabled:opacity-60 ${fieldError ? "border-red-400" : "border-black/10"}`}
                    />
                  )}
                  {fieldError && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-red-600">
                      <AlertCircle className="h-3 w-3" /> {fieldError}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-zru-green px-6 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saving ? "Saving…" : editingId !== null ? "Save changes" : `Add ${label}`}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="rounded-lg bg-black/5 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/10 disabled:opacity-60"
            >
              {editingId !== null ? "Cancel" : "Close"}
            </button>
            {editingId !== null && (
              <span className="rounded bg-zru-green/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-zru-green">
                Editing {term(items.find((it) => String(it.id) === String(editingId))?.[displayField]) || `#${String(editingId)}`}
              </span>
            )}
          </div>
        </form>
      )}

      {/* List */}
      <div className="p-6">
        <div className="mb-3">
          <SearchBox value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder={`Search ${title.toLowerCase()}…`} />
        </div>

        {statusOptions.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => { setStatusFilter("all"); setPage(1); }}
              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
                statusFilter === "all" ? "bg-rich-black text-white" : "bg-black/5 text-black/60 hover:bg-black/10"
              }`}
            >
              All ({items.length})
            </button>
            {statusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { setStatusFilter(opt); setPage(1); }}
                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
                  statusFilter === opt
                    ? opt === "draft" || opt === "hidden"
                      ? "bg-amber-500 text-white"
                      : "bg-zru-green text-white"
                    : "bg-black/5 text-black/60 hover:bg-black/10"
                }`}
              >
                {opt} ({items.filter((it) => statusValue(it, statusField) === opt).length})
              </button>
            ))}
          </div>
        )}

        {scheduleField && (
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => { setScheduleFilter("all"); setPage(1); }}
              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
                scheduleFilter === "all" ? "bg-rich-black text-white" : "bg-black/5 text-black/60 hover:bg-black/10"
              }`}
            >
              All windows ({items.length})
            </button>
            {(["upcoming", "active", "expired"] as const).map((opt) => {
              const count = items.filter((it) => scheduleValue(it, scheduleField) === opt).length;
              const active = scheduleFilter === opt;
              const tone = opt === "active" ? "bg-zru-green text-white" : opt === "upcoming" ? "bg-blue-600 text-white" : "bg-red-600 text-white";
              return (
                <button
                  key={opt}
                  onClick={() => { setScheduleFilter(active ? "all" : opt); setPage(1); }}
                  className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
                    active ? tone : "bg-black/5 text-black/60 hover:bg-black/10"
                  }`}
                >
                  {opt} ({count})
                </button>
              );
            })}
            <span className="mx-1 h-4 w-px bg-black/10" />
            {canPurge && (
              <button
                onClick={purgeExpired}
                disabled={bulkBusy || items.filter((it) => scheduleValue(it, scheduleField) === "expired").length === 0}
                className="flex items-center gap-1 rounded-full bg-red-600/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-700 transition-colors hover:bg-red-600/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Archive className="h-3 w-3" />
                Purge expired ({items.filter((it) => scheduleValue(it, scheduleField) === "expired").length})
              </button>
            )}
          </div>
        )}

        {selectedIds.size > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl bg-rich-black px-4 py-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-white">
              {selectedIds.size} selected
            </span>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {statusField && !statusIsBoolean && canUpdate && (
                <>
                  <button
                    onClick={() => bulkSetStatus(true)}
                    disabled={bulkBusy}
                    className="rounded-lg bg-zru-green px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white transition-colors hover:bg-green-700 disabled:opacity-60"
                  >
                    {bulkBusy ? "Working…" : "Publish"}
                  </button>
                  <button
                    onClick={() => bulkSetStatus(false)}
                    disabled={bulkBusy}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white transition-colors hover:bg-white/20 disabled:opacity-60"
                  >
                    Move to draft
                  </button>
                </>
              )}
              {canDelete && (
                <button
                  onClick={bulkDelete}
                  disabled={bulkBusy}
                  className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              )}
              <button
                onClick={() => setSelected(new Set())}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white/70 transition-colors hover:bg-white/20"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/10 py-12 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-black/40">
              {query || statusFilter !== "all" ? "No matches found" : "Nothing here yet"}
            </p>
            <p className="mt-1 text-[11px] text-black/30">
              {query || statusFilter !== "all"
                ? "Try a different search or filter."
                : `Click "Add ${label}" above to create the first ${label}.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/5 rounded-xl border border-black/5">
            {visible.length > 1 && (
              <button
                type="button"
                onClick={toggleSelectAll}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider text-black/40 transition-colors hover:bg-black/[0.03]"
              >
                {visible.every((it) => selectedIds.has(String(it.id))) ? (
                  <CheckSquare className="h-4 w-4 text-zru-green" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                Select all {visible.length} on this page
              </button>
            )}
            {visible.map((item) => {
              const display = String(item[displayField] ?? `#${item.id}`);
              const subtitle = subtitleField ? formatDisplay(item[subtitleField]) : "";
              const badge = badgeField ? String(item[badgeField] ?? "") : "";
              const status = statusField ? String(item[statusField] ?? "") : "";
              const img = item.image ? toAssetUrl(String(item.image)) : "";
              const itemKey = String(item.id);
              const isSelected = selectedIds.has(itemKey);
              return (
                <div key={itemKey} className={`flex flex-col justify-between gap-3 px-4 py-4 transition-colors md:flex-row md:items-center ${isSelected ? "bg-zru-green/5" : "hover:bg-black/[0.02]"}`}>
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleSelected(itemKey)}
                      aria-label={isSelected ? "Deselect" : "Select"}
                      className={`shrink-0 rounded-md p-0.5 transition-colors ${isSelected ? "text-zru-green" : "text-black/30 hover:text-black/60"}`}
                    >
                      {isSelected ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                    </button>
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt="" className="h-12 w-16 shrink-0 rounded-md object-cover" />
                    ) : null}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {badge && (
                          <span className="inline-block rounded bg-zru-green/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-zru-green">
                            {badge}
                          </span>
                        )}
                        <h4 className="truncate font-heading text-sm font-black uppercase text-rich-black">{display}</h4>
                        {status && statusField && <StatusChip status={status} />}
                        {scheduleField && scheduleValue(item, scheduleField) && (
                          <>
                            <StatusChip status={scheduleValue(item, scheduleField)} />
                            <span className="rounded bg-black/5 px-1.5 py-0.5 text-[10px] font-bold text-black/50">
                              {formatWindowRange(item, scheduleField)}
                            </span>
                          </>
                        )}
                      </div>
                      {subtitle && <p className="mt-0.5 truncate text-xs text-black/50">{subtitle}</p>}
                      {reviewable && term(item["review_note"]) && (
                        <p className="mt-0.5 flex items-start gap-1 text-[11px] text-amber-600">
                          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                          <span className="line-clamp-1">Reviewer note: {term(item["review_note"])}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {statusField && canUpdate && (
                      <button
                        onClick={() => toggleStatus(item, statusField)}
                        className="flex items-center gap-1 rounded-lg bg-black/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/10"
                      >
                        {isBooleanValue(item[statusField])
                          ? term(item[statusField]) === "true" || term(item[statusField]) === "1"
                            ? "Hide"
                            : "Show"
                          : reviewable
                            ? term(item[statusField]) === "published" || term(item[statusField]) === "active" || term(item[statusField]) === "approved"
                              ? "Unpublish"
                              : term(item[statusField]) === "in_review"
                                ? "Back to draft"
                                : "Send for review"
                            : term(item[statusField]) === "published"
                              ? "Unpublish"
                              : "Publish"}
                      </button>
                    )}
                    {reviewable && canReview && statusField && term(item[statusField]) === "in_review" && (
                      <>
                        <button
                          onClick={() => approveItem(item, statusField!)}
                          className="flex items-center gap-1 rounded-lg bg-zru-green/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zru-green transition-colors hover:bg-zru-green/20"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => requestChanges(item, statusField!)}
                          className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600 transition-colors hover:bg-amber-500/20"
                        >
                          Request changes
                        </button>
                      </>
                    )}
                    {canUpdate && (
                      <button
                        onClick={() => startEdit(item)}
                        className="flex items-center gap-1 rounded-lg bg-zru-green/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zru-green transition-colors hover:bg-zru-green/20"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                    )}
                    {canCreate && (
                      <button
                        onClick={() => startEdit(item, true)}
                        title="Duplicate this item"
                        className="flex items-center gap-1 rounded-lg bg-black/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/10"
                      >
                        <Copy className="h-3 w-3" /> Duplicate
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(String(item.id))}
                        className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-600 transition-colors hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4">
          <Pagination page={safePage} pageCount={pageCount} total={filtered.length} onPage={setPage} />
        </div>
      </div>
    </div>
  );
}
