"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Copy,
  CheckSquare,
  Square,
  Loader2,
  AlertCircle,
  Archive,
  RotateCcw,
  ShieldX,
  Table,
  LayoutGrid,
  Layers,
  ArrowUpDown,
  Minimize2,
  Maximize2,
  Download,
  Upload,
  Eye,
  X,
  Check,
  FileSpreadsheet,
  Keyboard,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import StatusChip from "./ui/StatusChip";
import ImagePicker, { toAssetUrl } from "./ui/ImagePicker";
import RichTextEditor from "./ui/RichTextEditor";
import { getFlagUrl } from "@/lib/flags";
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
  scheduleField?: { starts: string; ends: string };
  searchable?: string[];
  pageSize?: number;
  singularLabel?: string;
  onDirtyChange?: (dirty: boolean) => void;
  focusId?: string | number | null;
  onFocusHandled?: () => void;
  grants?: { create?: boolean; update?: boolean; delete?: boolean };
  canPurge?: boolean;
  reviewable?: boolean;
  canReview?: boolean;
  currentUserEmail?: string;
  initialValues?: Record<string, string>;
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

function itemSortKey(item: Record<string, unknown>): string {
  const v = item.date_created || item.created_at || item.kickoff_at || item.date || item.id || "";
  return String(v);
}

function statusValue(item: Record<string, unknown>, statusField?: string): string {
  if (!statusField) return "";
  const v = item[statusField];
  if (typeof v === "boolean") return v ? "published" : "draft";
  return String(v ?? "draft").toLowerCase();
}

function scheduleValue(item: Record<string, unknown>, schedule?: { starts: string; ends: string }): "upcoming" | "active" | "expired" | "" {
  if (!schedule) return "";
  const starts = item[schedule.starts] ? new Date(String(item[schedule.starts])).getTime() : null;
  const ends = item[schedule.ends] ? new Date(String(item[schedule.ends])).getTime() : null;
  const now = Date.now();
  if (starts && now < starts) return "upcoming";
  if (ends && now > ends) return "expired";
  return "active";
}

function formatWindowRange(item: Record<string, unknown>, schedule?: { starts: string; ends: string }): string {
  if (!schedule) return "";
  const s = item[schedule.starts] ? new Date(String(item[schedule.starts])).toLocaleDateString("en-GB") : "";
  const e = item[schedule.ends] ? new Date(String(item[schedule.ends])).toLocaleDateString("en-GB") : "";
  if (s && e) return `${s} → ${e}`;
  if (s) return `From ${s}`;
  if (e) return `Until ${e}`;
  return "";
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
  pageSize = 20,
  singularLabel,
  onDirtyChange,
  focusId,
  onFocusHandled,
  grants,
  canPurge = false,
  reviewable = false,
  canReview = false,
  currentUserEmail,
  initialValues,
}: CollectionManagerProps) {
  const canCreate = grants?.create !== false;
  const canUpdate = grants?.update !== false;
  const canDelete = grants?.delete !== false;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scheduleFilter, setScheduleFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [density, setDensity] = useState<"compact" | "comfortable">("compact");
  const [viewLayout, setViewLayout] = useState<"table" | "cards">("table");
  const [sortColumn, setSortColumn] = useState<"display" | "date" | "status" | "id">("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [groupBy, setGroupBy] = useState<"none" | "status" | "badge">("none");
  const [page, setPage] = useState(1);
  const [showTrash, setShowTrash] = useState(false);
  const [trashItems, setTrashItems] = useState<Record<string, unknown>[]>([]);
  const [trashBusy, setTrashBusy] = useState(false);

  // Advanced features state
  const [inlineEditing, setInlineEditing] = useState<{ id: string | number; field: string } | null>(null);
  const [inlineValue, setInlineValue] = useState("");
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCsvText, setImportCsvText] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [activeRowIndex, setActiveRowIndex] = useState<number>(-1);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    thumbnail: true,
    display: true,
    badge: true,
    status: true,
    date: true,
    id: true,
    actions: true,
  });

  const deletedBackup = useRef<{ id: string | number; item: Record<string, unknown> } | null>(null);
  const dirtyRef = useRef(false);

  const router = useRouter();
  const { toast } = useToast();
  const confirm = useConfirm();
  const prompt = usePrompt();

  const term = (v: unknown) => (v === null || v === undefined ? "" : String(v));
  const label = singularLabel || title.replace(/s$/, "");

  useEffect(() => {
    const dirty = touched;
    if (dirty !== dirtyRef.current) {
      dirtyRef.current = dirty;
      onDirtyChange?.(dirty);
    }
  }, [touched, onDirtyChange]);

  const startEdit = useCallback(
    (item: Record<string, unknown>, duplicate = false) => {
      const data: Record<string, string> = {};
      fields.forEach((f) => {
        const val = item[f.key];
        data[f.key] = term(val);
      });
      if (duplicate) {
        if (displayField && data[displayField]) {
          data[displayField] = `${data[displayField]} (Copy)`;
        }
        if (data["slug"]) data["slug"] = "";
        if (statusField) data[statusField] = "draft";
        setEditingId(null);
      } else {
        setEditingId(item.id as string | number);
      }
      setFormData(data);
      setErrors({});
      setTouched(false);
      setFormOpen(true);
      setDrawerOpen(true);
    },
    [fields, displayField, statusField]
  );

  const openNewForm = () => {
    const data: Record<string, string> = {};
    fields.forEach((f) => {
      data[f.key] = initialValues?.[f.key] || "";
    });
    setFormData(data);
    setEditingId(null);
    setErrors({});
    setTouched(false);
    setFormOpen(true);
    setDrawerOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setDrawerOpen(false);
    setEditingId(null);
    setFormData({});
    setTouched(false);
    setErrors({});
  };

  // Deep-link: open the editor for a requested item once it's available.
  const openedFocus = useRef<string | number | null>(null);
  useEffect(() => {
    if (focusId === null || focusId === undefined || focusId === openedFocus.current) return;
    const item = items.find((it) => String(it.id) === String(focusId));
    if (!item) return;
    openedFocus.current = focusId;
    startEdit(item);
    onFocusHandled?.();
  }, [focusId, items, onFocusHandled, startEdit]);

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
      let cmp = 0;
      if (sortColumn === "display") {
        const valA = term(a[displayField]).toLowerCase();
        const valB = term(b[displayField]).toLowerCase();
        cmp = valA.localeCompare(valB);
      } else if (sortColumn === "status") {
        const valA = statusValue(a, statusField);
        const valB = statusValue(b, statusField);
        cmp = valA.localeCompare(valB);
      } else if (sortColumn === "id") {
        cmp = String(a.id).localeCompare(String(b.id));
      } else {
        cmp = itemSortKey(a).localeCompare(itemSortKey(b));
      }
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [items, query, searchable, displayField, subtitleField, sortColumn, sortAsc, statusFilter, statusField, scheduleFilter, scheduleField]);

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
  }, [selected, filtered, statusField, statusFilter]);

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const allVisibleSelected = visible.every((it) => selectedIds.has(String(it.id)));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visible.forEach((it) => next.delete(String(it.id)));
      } else {
        visible.forEach((it) => next.add(String(it.id)));
      }
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        if (e.key === "Escape") {
          setInlineEditing(null);
        }
        return;
      }

      if (e.key === "Escape") {
        if (drawerOpen) closeForm();
        if (showColumnMenu) setShowColumnMenu(false);
        if (showImportModal) setShowImportModal(false);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveRowIndex((prev) => Math.min(prev + 1, visible.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveRowIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && activeRowIndex >= 0 && activeRowIndex < visible.length) {
        e.preventDefault();
        startEdit(visible[activeRowIndex]);
      } else if (e.key === " " && activeRowIndex >= 0 && activeRowIndex < visible.length) {
        e.preventDefault();
        toggleSelected(String(visible[activeRowIndex].id));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, activeRowIndex, drawerOpen, showColumnMenu, showImportModal, startEdit]);

  // Inline edit save handler
  const handleSaveInline = async (id: string | number, field: string, value: string) => {
    try {
      const res = await fetch("/api/admin/directus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, id, data: { [field]: value } }),
      });
      if (!res.ok) throw new Error("Failed to save inline edit");
      toast("Saved cell change.", "success");
      router.refresh();
    } catch (err) {
      toast(`Inline save failed: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setInlineEditing(null);
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast("No records to export.", "info");
      return;
    }

    const headers = fields.map((f) => f.key);
    const csvRows = [
      ["id", ...headers].join(","),
      ...filtered.map((row) => {
        const values = ["id", ...headers].map((h) => {
          const val = row[h] === null || row[h] === undefined ? "" : String(row[h]);
          return `"${val.replace(/"/g, '""')}"`;
        });
        return values.join(",");
      }),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${collection}-export-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast(`Exported ${filtered.length} rows to CSV.`, "success");
  };

  // CSV Import Handler
  const handleImportCSV = async () => {
    if (!importCsvText.trim()) return;
    setImportBusy(true);
    try {
      const lines = importCsvText.trim().split("\n");
      if (lines.length < 2) throw new Error("CSV must have a header row and at least 1 data row.");

      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
      const itemsToCreate = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (cols.length === 0 || cols.every((c) => !c)) continue;
        const rowData: Record<string, string> = {};
        headers.forEach((h, idx) => {
          if (h !== "id") rowData[h] = cols[idx] || "";
        });
        itemsToCreate.push(rowData);
      }

      for (const item of itemsToCreate) {
        await fetch("/api/admin/directus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collection, data: item }),
        });
      }

      toast(`Imported ${itemsToCreate.length} items successfully.`, "success");
      setShowImportModal(false);
      setImportCsvText("");
      router.refresh();
    } catch (err) {
      toast(`Import failed: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setImportBusy(false);
    }
  };

  // Standard CRUD Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate && editingId === null) return;
    if (!canUpdate && editingId !== null) return;

    setSaving(true);
    try {
      const method = editingId !== null ? "PATCH" : "POST";
      const payload: Record<string, unknown> = {
        collection,
        data: formData,
      };
      if (editingId !== null) {
        payload.id = editingId;
      }

      const res = await fetch("/api/admin/directus", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Save operation failed.");
      }

      toast(editingId !== null ? "Changes saved." : `Created ${label}.`, "success");
      closeForm();
      router.refresh();
    } catch (err) {
      toast(`Error: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    const ok = await confirm({
      title: `Delete this ${label}?`,
      message: "The item will be moved to the trash and hidden from the website.",
      confirmLabel: "Move to Trash",
      danger: true,
    });
    if (!ok) return;

    try {
      const res = await fetch("/api/admin/directus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      toast(`Moved to trash.`, "info");
      router.refresh();
    } catch (err) {
      toast(`Delete failed: ${err instanceof Error ? err.message : err}`, "error");
    }
  };

  const toggleStatus = async (item: Record<string, unknown>, sField: string) => {
    const current = statusValue(item, sField);
    const next = current === "published" ? "draft" : "published";
    await handleSaveInline(item.id as string | number, sField, next);
  };

  const setField = (key: string, val: string) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
    setTouched(true);
  };

  return (
    <div className="rounded-2xl border border-[#eae8de] bg-white shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-[#eae8de] bg-milk-white/40">
        <div>
          <h2 className="text-xl font-heading font-black uppercase text-rich-black">{title}</h2>
          {description && <p className="text-xs text-charcoal-gray mt-0.5">{description}</p>}
        </div>

        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#eae8de] text-xs font-bold text-rich-black hover:bg-milk-white hover:border-black/20 transition-all shadow-2xs"
            title="Export list to CSV"
          >
            <Download className="w-3.5 h-3.5 text-zru-green" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Import CSV */}
          {canCreate && (
            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#eae8de] text-xs font-bold text-rich-black hover:bg-milk-white hover:border-black/20 transition-all shadow-2xs"
              title="Import from CSV"
            >
              <Upload className="w-3.5 h-3.5 text-zru-green" />
              <span className="hidden sm:inline">Import</span>
            </button>
          )}

          {/* Add New Item */}
          {canCreate && (
            <button
              type="button"
              onClick={openNewForm}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zru-green text-white text-xs font-black uppercase tracking-wider hover:bg-forest-green transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add {label}
            </button>
          )}
        </div>
      </div>

      {/* Main List Area */}
      <div className="p-6 space-y-4">
        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1">
            <SearchBox
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder={`Search ${title.toLowerCase()}... (Press '/' to focus)`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Column Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-milk-white border border-[#eae8de] text-xs font-bold text-charcoal-gray hover:text-rich-black transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-zru-green" />
                Columns
              </button>

              {showColumnMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#eae8de] p-2 z-40 space-y-1">
                  <span className="block text-[10px] font-black uppercase text-black/40 px-2 py-1">Visible Columns</span>
                  {Object.entries(visibleColumns).map(([col, isVis]) => (
                    <label
                      key={col}
                      className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-rich-black hover:bg-milk-white rounded-lg cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isVis}
                        onChange={() => setVisibleColumns((prev) => ({ ...prev, [col]: !isVis }))}
                        className="rounded accent-zru-green"
                      />
                      <span className="capitalize">{col}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Density Toggle */}
            <div className="flex items-center bg-milk-white p-1 rounded-xl border border-[#eae8de] text-xs">
              <button
                type="button"
                onClick={() => setDensity("compact")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-colors ${
                  density === "compact" ? "bg-white text-zru-green shadow-xs" : "text-black/50 hover:text-black"
                }`}
                title="Windows Details / Apple Compact Mode"
              >
                <span className="flex items-center gap-1">
                  <Minimize2 className="w-3 h-3" /> Compact
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDensity("comfortable")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-colors ${
                  density === "comfortable" ? "bg-white text-zru-green shadow-xs" : "text-black/50 hover:text-black"
                }`}
              >
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" /> Cozy
                </span>
              </button>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center bg-milk-white p-1 rounded-xl border border-[#eae8de]">
              <button
                type="button"
                onClick={() => setViewLayout("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewLayout === "table" ? "bg-white text-zru-green shadow-xs" : "text-black/40 hover:text-black"
                }`}
                title="Table view"
              >
                <Table className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewLayout("cards")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewLayout === "cards" ? "bg-white text-zru-green shadow-xs" : "text-black/40 hover:text-black"
                }`}
                title="Cards view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Status filter chips */}
        {statusOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                setStatusFilter("all");
                setPage(1);
              }}
              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
                statusFilter === "all" ? "bg-rich-black text-white" : "bg-black/5 text-black/60 hover:bg-black/10"
              }`}
            >
              All ({items.length})
            </button>
            {statusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setStatusFilter(opt);
                  setPage(1);
                }}
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

        {/* Table / Cards Render */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#eae8de] py-16 text-center">
            <FileSpreadsheet className="w-10 h-10 text-charcoal-gray/30 mx-auto mb-3" />
            <p className="text-sm font-black uppercase tracking-wider text-rich-black">No matches found</p>
            <p className="mt-1 text-xs text-charcoal-gray">Try adjusting your search query or status filter.</p>
          </div>
        ) : viewLayout === "table" ? (
          /* ========================================================= */
          /* COMPACT / SPREADSHEET TABLE (Windows Details / macOS List) */
          /* ========================================================= */
          <div className="overflow-x-auto rounded-xl border border-[#eae8de] bg-white shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eae8de] bg-milk-white/80 text-[10px] font-black uppercase tracking-wider text-black/60 select-none">
                  <th className="w-10 px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="inline-flex items-center justify-center p-0.5 rounded text-black/40 hover:text-black"
                    >
                      {visible.every((it) => selectedIds.has(String(it.id))) ? (
                        <CheckSquare className="h-4 w-4 text-zru-green" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  {visibleColumns.display && (
                    <th
                      className="px-3 py-2 cursor-pointer hover:bg-black/5"
                      onClick={() => {
                        setSortColumn("display");
                        setSortAsc(!sortAsc);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>{displayField.replace(/_/g, " ")}</span>
                        {sortColumn === "display" && <ArrowUpDown className="h-3 w-3 text-zru-green" />}
                      </div>
                    </th>
                  )}
                  {visibleColumns.badge && badgeField && <th className="px-3 py-2 w-28">{badgeField.replace(/_/g, " ")}</th>}
                  {visibleColumns.status && statusField && (
                    <th
                      className="px-3 py-2 w-28 cursor-pointer hover:bg-black/5"
                      onClick={() => {
                        setSortColumn("status");
                        setSortAsc(!sortAsc);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        {sortColumn === "status" && <ArrowUpDown className="h-3 w-3 text-zru-green" />}
                      </div>
                    </th>
                  )}
                  {visibleColumns.date && (
                    <th
                      className="px-3 py-2 w-32 cursor-pointer hover:bg-black/5"
                      onClick={() => {
                        setSortColumn("date");
                        setSortAsc(!sortAsc);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Date / Schedule</span>
                        {sortColumn === "date" && <ArrowUpDown className="h-3 w-3 text-zru-green" />}
                      </div>
                    </th>
                  )}
                  {visibleColumns.id && (
                    <th
                      className="px-3 py-2 w-20 cursor-pointer hover:bg-black/5"
                      onClick={() => {
                        setSortColumn("id");
                        setSortAsc(!sortAsc);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>ID</span>
                        {sortColumn === "id" && <ArrowUpDown className="h-3 w-3 text-zru-green" />}
                      </div>
                    </th>
                  )}
                  {visibleColumns.actions && <th className="px-3 py-2 w-28 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs">
                {visible.map((item, idx) => {
                  const display = String(item[displayField] ?? `#${item.id}`);
                  const subtitle = subtitleField ? formatDisplay(item[subtitleField]) : "";
                  const badge = badgeField ? String(item[badgeField] ?? "") : "";
                  const status = statusField ? String(item[statusField] ?? "") : "";
                  const img = item.image ? toAssetUrl(String(item.image)) : "";
                  const itemKey = String(item.id);
                  const isSelected = selectedIds.has(itemKey);
                  const isCompact = density === "compact";
                  const isRowActive = activeRowIndex === idx;
                  const isEditingDisplay = inlineEditing?.id === item.id && inlineEditing?.field === displayField;

                  return (
                    <tr
                      key={itemKey}
                      onClick={() => {
                        setActiveRowIndex(idx);
                        startEdit(item);
                      }}
                      className={`group cursor-pointer transition-colors ${
                        isRowActive
                          ? "ring-1 ring-zru-green bg-zru-green/10"
                          : isSelected
                          ? "bg-zru-green/10"
                          : "hover:bg-zru-green/5 odd:bg-white even:bg-milk-white/30"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className={`px-3 ${isCompact ? "py-1.5" : "py-3"} text-center`} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleSelected(itemKey)}
                          className={`rounded p-0.5 transition-colors ${isSelected ? "text-zru-green" : "text-black/30 hover:text-black/60"}`}
                        >
                          {isSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                        </button>
                      </td>

                      {/* Display / Title (Inline Editable) */}
                      {visibleColumns.display && (
                        <td
                          className={`px-3 ${isCompact ? "py-1.5" : "py-3"} font-medium`}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            setInlineEditing({ id: item.id as string | number, field: displayField });
                            setInlineValue(display);
                          }}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {(collection === "opponents" || collection === "teams") && (
                              <img
                                src={getFlagUrl(display)}
                                alt=""
                                className={`${isCompact ? "h-6 w-6" : "h-7 w-7"} rounded-full object-cover border border-black/10 shadow-xs shrink-0 bg-white`}
                              />
                            )}
                            {visibleColumns.thumbnail && img && collection !== "opponents" && collection !== "teams" && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={img}
                                alt=""
                                className={`${isCompact ? "h-6 w-8" : "h-10 w-14"} shrink-0 rounded object-cover border border-[#eae8de]`}
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              {isEditingDisplay ? (
                                <input
                                  type="text"
                                  autoFocus
                                  value={inlineValue}
                                  onChange={(e) => setInlineValue(e.target.value)}
                                  onBlur={() => handleSaveInline(item.id as string | number, displayField, inlineValue)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveInline(item.id as string | number, displayField, inlineValue);
                                    if (e.key === "Escape") setInlineEditing(null);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full bg-white border border-zru-green px-2 py-0.5 rounded text-xs font-heading font-black uppercase text-rich-black outline-none shadow-xs"
                                />
                              ) : (
                                <>
                                  <span
                                    className="font-heading font-black uppercase text-rich-black text-xs truncate block group-hover:text-zru-green transition-colors"
                                    title="Double-click to inline edit"
                                  >
                                    {display}
                                  </span>
                                  {subtitle && !isCompact && (
                                    <span className="text-[11px] text-black/50 truncate block mt-0.5">{subtitle}</span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Badge */}
                      {visibleColumns.badge && badgeField && (
                        <td className={`px-3 ${isCompact ? "py-1.5" : "py-3"}`}>
                          {badge ? (
                            <span className="inline-block rounded bg-zru-green/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-zru-green">
                              {badge}
                            </span>
                          ) : (
                            <span className="text-black/30 text-[10px]">—</span>
                          )}
                        </td>
                      )}

                      {/* Status */}
                      {visibleColumns.status && statusField && (
                        <td className={`px-3 ${isCompact ? "py-1.5" : "py-3"}`} onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            {status && <StatusChip status={status} />}
                            {canUpdate && (
                              <button
                                onClick={() => toggleStatus(item, statusField)}
                                className="opacity-0 group-hover:opacity-100 text-[9px] font-black uppercase text-black/40 hover:text-black transition-opacity px-1 py-0.5 rounded bg-black/5"
                                title="Toggle Status"
                              >
                                Toggle
                              </button>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Date */}
                      {visibleColumns.date && (
                        <td className={`px-3 ${isCompact ? "py-1.5" : "py-3"} text-[11px] font-medium text-black/60`}>
                          <span>
                            {item.date_created
                              ? new Date(String(item.date_created)).toLocaleDateString("en-GB")
                              : item.date
                              ? String(item.date)
                              : "—"}
                          </span>
                        </td>
                      )}

                      {/* ID */}
                      {visibleColumns.id && (
                        <td
                          className={`px-3 ${isCompact ? "py-1.5" : "py-3"} font-mono text-[10px] text-black/40 truncate max-w-[80px]`}
                          title={String(item.id)}
                        >
                          {String(item.id).substring(0, 8)}
                        </td>
                      )}

                      {/* Actions */}
                      {visibleColumns.actions && (
                        <td className={`px-3 ${isCompact ? "py-1.5" : "py-3"} text-right`} onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEdit(item)}
                              className="p-1 rounded text-black/50 hover:text-zru-green hover:bg-black/5 transition-colors"
                              title="Edit in inspector"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            {canCreate && (
                              <button
                                onClick={() => startEdit(item, true)}
                                className="p-1 rounded text-black/50 hover:text-rich-black hover:bg-black/5 transition-colors"
                                title="Duplicate"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(item.id as string | number)}
                                className="p-1 rounded text-black/50 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards view */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visible.map((item) => (
              <div
                key={String(item.id)}
                onClick={() => startEdit(item)}
                className="p-4 rounded-xl border border-[#eae8de] bg-white hover:border-zru-green transition-all cursor-pointer space-y-2 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-heading font-black uppercase text-sm text-rich-black">
                    {String(item[displayField] ?? `#${item.id}`)}
                  </h4>
                  {statusField && <StatusChip status={statusValue(item, statusField)} />}
                </div>
                {subtitleField && <p className="text-xs text-charcoal-gray">{formatDisplay(item[subtitleField])}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <Pagination page={safePage} pageCount={pageCount} total={filtered.length} onPage={setPage} />
        </div>
      </div>

      {/* ========================================================= */}
      {/* SIDE-DRAWER INSPECTOR (Notion / Linear Style Slide-Over)  */}
      {/* ========================================================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={closeForm} />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-[#eae8de] flex flex-col animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#eae8de] bg-milk-white/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-zru-green bg-zru-green/10 px-2.5 py-1 rounded-lg">
                    {editingId !== null ? `Edit ${label}` : `New ${label}`}
                  </span>
                  {editingId !== null && (
                    <span className="font-mono text-xs text-charcoal-gray/60">#{String(editingId).substring(0, 8)}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="p-1.5 rounded-lg text-charcoal-gray hover:text-rich-black hover:bg-black/5 transition-colors"
                    title="Close (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Body Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field) => {
                    const full = field.colSpan === "full" || field.type === "richtext" || field.type === "textarea";
                    const fieldError = errors[field.key];
                    const fieldId = `cm-drawer-${collection}-${field.key}`;

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
                            className={`w-full rounded-lg border bg-white p-2.5 text-sm disabled:opacity-60 ${
                              fieldError ? "border-red-400" : "border-[#eae8de]"
                            }`}
                          />
                        ) : field.type === "richtext" ? (
                          <RichTextEditor value={formData[field.key] || ""} onChange={(html) => setField(field.key, html)} />
                        ) : field.type === "select" ? (
                          <select
                            id={fieldId}
                            value={formData[field.key] || ""}
                            onChange={(e) => setField(field.key, e.target.value)}
                            disabled={saving}
                            className={`w-full rounded-lg border bg-white p-2.5 text-sm font-bold disabled:opacity-60 ${
                              fieldError ? "border-red-400" : "border-[#eae8de]"
                            }`}
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
                            className={`w-full rounded-lg border bg-white p-2.5 text-sm disabled:opacity-60 ${
                              fieldError ? "border-red-400" : "border-[#eae8de]"
                            }`}
                          />
                        ) : field.type === "datetime" ? (
                          <input
                            id={fieldId}
                            type="datetime-local"
                            value={formData[field.key] || ""}
                            onChange={(e) => setField(field.key, e.target.value)}
                            disabled={saving}
                            className={`w-full rounded-lg border bg-white p-2.5 text-sm disabled:opacity-60 ${
                              fieldError ? "border-red-400" : "border-[#eae8de]"
                            }`}
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
                            className={`w-full rounded-lg border bg-white p-2.5 text-sm disabled:opacity-60 ${
                              fieldError ? "border-red-400" : "border-[#eae8de]"
                            }`}
                          />
                        ) : field.type === "boolean" ? (
                          <div className="flex items-center gap-3 pt-1.5">
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => setField(field.key, formData[field.key] === "1" ? "0" : "1")}
                              className={`rounded-lg px-3 py-1.5 text-xs font-black uppercase transition-colors ${
                                formData[field.key] === "1"
                                  ? "bg-zru-green text-white"
                                  : "bg-black/5 text-black/60 hover:bg-black/10"
                              }`}
                            >
                              {formData[field.key] === "1" ? "Enabled / True" : "Disabled / False"}
                            </button>
                          </div>
                        ) : (
                          <input
                            id={fieldId}
                            type="text"
                            value={formData[field.key] || ""}
                            onChange={(e) => setField(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            disabled={saving}
                            className={`w-full rounded-lg border bg-white p-2.5 text-sm disabled:opacity-60 ${
                              fieldError ? "border-red-400" : "border-[#eae8de]"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Drawer Footer Actions */}
                <div className="pt-6 border-t border-[#eae8de] flex items-center justify-between sticky bottom-0 bg-white py-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-black/5 text-rich-black text-xs font-bold hover:bg-black/10 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zru-green text-white text-xs font-black uppercase tracking-wider hover:bg-forest-green transition-all shadow-xs"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {saving ? "Saving..." : editingId !== null ? "Save Changes" : `Create ${label}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CSV IMPORT MODAL                                          */}
      {/* ========================================================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowImportModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black uppercase text-rich-black">Import {title} from CSV</h3>
              <button onClick={() => setShowImportModal(false)} className="text-charcoal-gray hover:text-rich-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-charcoal-gray">
              Paste CSV data with column headers matching your collection fields (e.g. <code>{fields.map((f) => f.key).join(", ")}</code>).
            </p>

            <textarea
              rows={8}
              value={importCsvText}
              onChange={(e) => setImportCsvText(e.target.value)}
              placeholder={`title,status,season_year\n"Sample Title","published","2026"`}
              className="w-full font-mono text-xs p-3 rounded-xl border border-[#eae8de] focus:border-zru-green outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-black/5 text-xs font-bold text-rich-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportCSV}
                disabled={importBusy || !importCsvText.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-zru-green text-white text-xs font-black uppercase tracking-wider hover:bg-forest-green transition-colors disabled:opacity-50"
              >
                {importBusy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {importBusy ? "Importing..." : "Run Import"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
