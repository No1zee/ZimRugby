"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, ExternalLink, Database } from "lucide-react";

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
  required?: boolean;
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
}

function formatDisplay(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(str) && !isNaN(new Date(str).getTime())) {
    return new Date(str).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  return str;
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
}: CollectionManagerProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

  function setField(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(item: Record<string, unknown>) {
    const data: Record<string, string> = {};
    fields.forEach((f) => {
      data[f.key] = item[f.key] !== null && item[f.key] !== undefined ? String(item[f.key]) : "";
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch("/api/admin/directus", {
        method: editingId !== null ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId !== null
            ? { collection, id: editingId, data: { ...formData } }
            : { collection, data: { ...formData } }
        ),
      });

      if (res.ok) {
        setMessage(
          editingId !== null
            ? `Item updated in "${collection}". Refreshing...`
            : `Item created in "${collection}". Refreshing...`
        );
        setTimeout(() => window.location.reload(), 1200);
      } else {
        const err = await res.json().catch(() => null);
        setMessage(`❌ Failed to save: ${err?.error || res.statusText}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err}`);
    }
  }

  async function handleDelete(id: string | number) {
    if (!window.confirm(`Delete item #${id} from "${collection}"? This cannot be undone.`)) return;
    setMessage(null);
    try {
      const res = await fetch("/api/admin/directus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, id }),
      });

      if (res.ok) {
        setMessage(`Item #${id} deleted from "${collection}". Refreshing...`);
        setTimeout(() => window.location.reload(), 1200);
      } else {
        const err = await res.json().catch(() => null);
        setMessage(`❌ Delete failed: ${err?.error || res.statusText}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err}`);
    }
  }

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="font-heading text-xl font-black uppercase text-rich-black flex items-center gap-2">
            <Plus className="w-5 h-5 text-zru-green" /> {title}
          </h2>
          {description && <p className="text-xs text-black/50 mt-1">{description}</p>}
        </div>
        <a
          href={`${directusUrl}/admin/content/${collection}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 bg-black/5 text-black/50 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-black/10 transition-colors shrink-0"
        >
          <Database className="w-3 h-3" /> Directus <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {message && (
        <div className="mb-4 bg-zru-green/10 border border-zru-green/40 p-3 rounded-xl text-zru-green font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Create / Edit Form */}
      <form onSubmit={handleSubmit} className="bg-black/[0.03] border border-black/10 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <label className="block text-[10px] font-bold uppercase text-black/60 mb-1">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  rows={4}
                  value={formData[field.key] || ""}
                  onChange={(e) => setField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-white border border-black/10 rounded-lg p-2.5 text-sm"
                />
              ) : field.type === "select" ? (
                <select
                  value={formData[field.key] || ""}
                  onChange={(e) => setField(field.key, e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-lg p-2.5 text-sm font-bold"
                >
                  <option value="">— Select —</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData[field.key] || ""}
                  onChange={(e) => setField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full bg-white border border-black/10 rounded-lg p-2.5 text-sm font-bold"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-zru-green text-white font-heading font-black text-xs uppercase tracking-wider rounded-lg hover:bg-green-800 transition-colors"
          >
            {editingId !== null ? "UPDATE IN DIRECTUS" : "SAVE TO DIRECTUS"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 bg-black/5 text-black/60 font-heading font-black text-xs uppercase tracking-wider rounded-lg hover:bg-black/10 transition-colors"
            >
              Cancel Edit
            </button>
          )}
          {editingId !== null && (
            <span className="text-[10px] font-black uppercase tracking-wider text-zru-green bg-zru-green/10 px-2 py-1 rounded">
              Editing item #{editingId}
            </span>
          )}
        </div>
      </form>

      {/* Item List */}
      <h3 className="font-heading text-sm font-black uppercase text-black/50 mb-3">
        {items.length} item{items.length === 1 ? "" : "s"}
      </h3>

      {items.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-black/10 rounded-xl">
          <Database className="w-8 h-8 text-black/10 mx-auto mb-2" />
          <p className="text-xs font-bold text-black/40 uppercase tracking-wider">No items yet</p>
          <p className="text-[11px] text-black/30 mt-1">Use the form above to create the first entry</p>
        </div>
      ) : (
        <div className="divide-y divide-black/5 border border-black/5 rounded-xl">
          {items.map((item) => {
            const display = String(item[displayField] ?? `#${item.id}`);
            const subtitle = subtitleField ? formatDisplay(item[subtitleField]) : "";
            const badge = badgeField ? String(item[badgeField] ?? "") : "";
            return (
              <div key={String(item.id)} className="py-4 px-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="min-w-0">
                  {badge && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-zru-green bg-zru-green/10 px-2 py-0.5 rounded inline-block mb-1">
                      {badge}
                    </span>
                  )}
                  <h4 className="font-heading text-sm font-black text-rich-black uppercase truncate">{display}</h4>
                  {subtitle && <p className="text-xs text-black/50 mt-0.5">{subtitle}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-zru-green/10 text-zru-green rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-zru-green/20 transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(String(item.id))}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
