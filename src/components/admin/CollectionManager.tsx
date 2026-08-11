"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusChip from "./ui/StatusChip";
import ImagePicker, { toAssetUrl } from "./ui/ImagePicker";
import RichTextEditor from "./ui/RichTextEditor";
import { SearchBox, Pagination } from "./ui/ListTools";

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "textarea" | "richtext" | "select" | "image" | "date" | "number" | "boolean";
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
  searchable?: string[];
  pageSize?: number;
  singularLabel?: string;
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
  return type === "date";
}

function isBooleanValue(v: unknown): boolean {
  return typeof v === "boolean" || v === "true" || v === "false" || v === "1" || v === "0";
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
  searchable,
  pageSize = 8,
  singularLabel,
}: CollectionManagerProps) {
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const router = useRouter();

  const term = (v: unknown) => (v === null || v === undefined ? "" : String(v));

  const filtered = useMemo(() => {
    const keys = searchable?.length ? searchable : [displayField, subtitleField ?? ""].filter(Boolean);
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      keys.some((k) => term(it[k]).toLowerCase().includes(q))
    );
  }, [items, query, searchable, displayField, subtitleField]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function setField(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(item: Record<string, unknown>) {
    const data: Record<string, string> = {};
    fields.forEach((f) => {
      const raw = item[f.key];
      if (f.type === "boolean") {
        data[f.key] = raw === true || raw === "true" || raw === 1 ? "1" : "0";
      } else if (isDateFieldType(f.type)) {
        data[f.key] = raw ? String(raw).slice(0, 10) : "";
      } else {
        data[f.key] = raw !== null && raw !== undefined ? String(raw) : "";
      }
    });
    setFormData(data);
    setEditingId(String(item.id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setFormData({});
    setEditingId(null);
    setMessage(null);
  }

  function emptyForm() {
    const data: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.type === "boolean") data[f.key] = "0";
      else if (f.type === "select" && f.options?.[0]) data[f.key] = f.options[0];
      else data[f.key] = "";
    });
    return data;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const payload: Record<string, unknown> = {};
    fields.forEach((f) => {
      let v: unknown = formData[f.key] ?? "";
      if (f.type === "number") v = v === "" ? null : Number(v);
      else if (f.type === "boolean") v = v === "1";
      else if (isDateFieldType(f.type)) v = v || null;
      else if (v === "") v = null;
      payload[f.key] = v;
    });
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
        setMessage({ text: editingId !== null ? "Saved changes." : "Created successfully.", ok: true });
        resetForm();
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        setMessage({ text: `Failed to save: ${err?.error || res.statusText}`, ok: false });
      }
    } catch (err) {
      setMessage({ text: `Error: ${err instanceof Error ? err.message : err}`, ok: false });
    }
  }

  async function handleDelete(id: string | number) {
    if (!window.confirm(`Delete this item? This cannot be undone.`)) return;
    setMessage(null);
    try {
      const res = await fetch("/api/admin/directus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, id }),
      });
      if (res.ok) {
        setMessage({ text: "Item deleted.", ok: true });
        setEditingId(null);
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        setMessage({ text: `Delete failed: ${err?.error || res.statusText}`, ok: false });
      }
    } catch (err) {
      setMessage({ text: `Error: ${err instanceof Error ? err.message : err}`, ok: false });
    }
  }

  async function toggleStatus(item: Record<string, unknown>, statusFieldName: string) {
    const raw = item[statusFieldName];
    if (typeof raw === "boolean" || raw === "true" || raw === "1" || raw === "false" || raw === "0") {
      const next = !(raw === true || raw === "true" || raw === "1");
      const res = await fetch("/api/admin/directus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, id: item.id, data: { [statusFieldName]: next } }),
      });
      if (res.ok) {
        setMessage({ text: next ? "Turned on." : "Turned off.", ok: true });
        router.refresh();
      } else {
        setMessage({ text: "Could not update.", ok: false });
      }
      return;
    }
    const current = term(item[statusFieldName]);
    const next = current === "published" || current === "active" ? "draft" : "published";
    const res = await fetch("/api/admin/directus", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, id: item.id, data: { [statusFieldName]: next } }),
    });
    if (res.ok) {
      setMessage({ text: next === "published" ? "Published." : "Moved back to draft.", ok: true });
      router.refresh();
    } else {
      setMessage({ text: "Could not update status.", ok: false });
    }
  }

  const label = singularLabel || "item";

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
            <Plus className="h-5 w-5 text-zru-green" /> {title}
          </h2>
          {description && <p className="mt-1 text-xs text-black/50">{description}</p>}
        </div>
      </div>

      {message && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-xl border p-3 text-xs font-bold ${
            message.ok
              ? "border-zru-green/40 bg-zru-green/10 text-zru-green"
              : "border-red-400 bg-red-50 text-red-700"
          }`}
        >
          {message.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Create / Edit form */}
      <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-black/10 bg-black/[0.03] p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const full = field.colSpan === "full" || field.type === "richtext" || field.type === "textarea";
            return (
              <div key={field.key} className={full ? "md:col-span-2" : ""}>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    value={formData[field.key] || ""}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
                  />
                ) : field.type === "richtext" ? (
                  <RichTextEditor value={formData[field.key] || ""} onChange={(html) => setField(field.key, html)} />
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => setField(field.key, e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
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
                    type="date"
                    value={formData[field.key] || ""}
                    onChange={(e) => setField(field.key, e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
                  />
                ) : field.type === "number" ? (
                  <input
                    type="number"
                    step="any"
                    value={formData[field.key] || ""}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
                  />
                ) : field.type === "boolean" ? (
                  <div className="flex items-center gap-3 pt-1.5">
                    <button
                      type="button"
                      onClick={() => setField(field.key, formData[field.key] === "1" ? "0" : "1")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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
                    type="text"
                    value={formData[field.key] || ""}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-zru-green px-6 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800"
          >
            {editingId !== null ? "Save changes" : `Add ${label}`}
          </button>
          {editingId !== null && (
            <>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg bg-black/5 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/10"
              >
                Cancel
              </button>
              <span className="rounded bg-zru-green/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-zru-green">
                Editing #{editingId}
              </span>
            </>
          )}
          {editingId === null && (
            <button
              type="button"
              onClick={() => { setFormData(emptyForm()); setEditingId(null); }}
              className="rounded-lg bg-black/5 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/10"
            >
              Clear form
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="mb-3">
        <SearchBox value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder={`Search ${title.toLowerCase()}…`} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/10 py-12 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-black/40">
            {query ? "No matches found" : "Nothing here yet"}
          </p>
          <p className="mt-1 text-[11px] text-black/30">
            {query ? "Try a different search." : `Use the form above to add the first ${label}.`}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-black/5 rounded-xl border border-black/5">
          {visible.map((item) => {
            const display = String(item[displayField] ?? `#${item.id}`);
            const subtitle = subtitleField ? formatDisplay(item[subtitleField]) : "";
            const badge = badgeField ? String(item[badgeField] ?? "") : "";
            const status = statusField ? String(item[statusField] ?? "") : "";
            const img = item.image ? toAssetUrl(String(item.image)) : "";
            return (
              <div key={String(item.id)} className="flex flex-col justify-between gap-3 px-4 py-4 md:flex-row md:items-center">
                <div className="flex min-w-0 items-center gap-3">
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
                    </div>
                    {subtitle && <p className="mt-0.5 truncate text-xs text-black/50">{subtitle}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {statusField && (
                    <button
                      onClick={() => toggleStatus(item, statusField)}
                      className="flex items-center gap-1 rounded-lg bg-black/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/10"
                    >
                      {isBooleanValue(item[statusField])
                        ? term(item[statusField]) === "true" || term(item[statusField]) === "1"
                          ? "Hide"
                          : "Show"
                        : term(item[statusField]) === "published"
                          ? "Unpublish"
                          : "Publish"}
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(item)}
                    className="flex items-center gap-1 rounded-lg bg-zru-green/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zru-green transition-colors hover:bg-zru-green/20"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(String(item.id))}
                    className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-600 transition-colors hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
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
  );
}
