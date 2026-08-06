"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Trash2, Upload, X, Plus } from "lucide-react";

interface Section {
  id: string;
  section_key: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  content?: string;
  cta_label?: string;
  cta_url?: string;
  display_variant?: string;
  image?: string;
  items?: any;
  status?: string;
}

export default function FieldEditor({
  section,
  onSave,
  onDelete,
  onDeselect,
}: {
  section: Section;
  onSave: (data: Partial<Section>) => void;
  onDelete: () => void;
  onDeselect: () => void;
}) {
  const [fields, setFields] = useState({
    eyebrow: section.eyebrow || "",
    title: section.title || "",
    body: section.body || "",
    content: section.content || "",
    cta_label: section.cta_label || "",
    cta_url: section.cta_url || "",
    image: section.image || "",
  });
  const [items, setItems] = useState<any[]>(section.items || []);
  const [uploading, setUploading] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save on field change (debounced)
  const scheduleSave = (updatedFields: typeof fields, updatedItems?: any[]) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      onSave({ ...updatedFields, items: updatedItems ?? items });
    }, 800);
  };

  const updateField = (key: keyof typeof fields, value: string) => {
    const updated = { ...fields, [key]: value };
    setFields(updated);
    scheduleSave(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const { url } = await res.json();
      updateField("image", url);
    } finally {
      setUploading(false);
    }
  };

  const addItem = () => {
    const newItems = [...items, { title: "", description: "" }];
    setItems(newItems);
    scheduleSave(fields, newItems);
  };

  const updateItem = (index: number, key: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    setItems(newItems);
    scheduleSave(fields, newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    setItems(newItems);
    scheduleSave(fields, newItems);
  };

  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between relative">
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#006B3F]/50 to-transparent" />
        <div className="flex items-center gap-3">
          <button
            onClick={onDeselect}
            className="text-white/40 hover:text-[#00A85A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-white font-heading text-sm uppercase tracking-wider">Edit Section</h3>
            <span className="text-white/25 text-[9px] font-subheading uppercase tracking-[0.3em]">
              {section.section_key}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Delete this section?")) onDelete();
          }}
          className="text-white/30 hover:text-[#FF4444] transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Eyebrow */}
        <Field
          label="Eyebrow"
          value={fields.eyebrow}
          onChange={(v) => updateField("eyebrow", v)}
          placeholder="e.g. Official Supporters Club"
        />

        {/* Title */}
        <Field
          label="Title"
          value={fields.title}
          onChange={(v) => updateField("title", v)}
          placeholder="Section heading"
        />

        {/* Body */}
        <Field
          label="Body"
          value={fields.body}
          onChange={(v) => updateField("body", v)}
          placeholder="Main text content"
          multiline
        />

        {/* Content (extended) */}
        <Field
          label="Content"
          value={fields.content}
          onChange={(v) => updateField("content", v)}
          placeholder="Additional content or HTML"
          multiline
        />

        {/* Image */}
        <div>
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 font-subheading">
            Image
          </label>
          {fields.image && (
            <div className="relative mb-2 rounded-lg overflow-hidden border border-white/10">
              <img src={fields.image} alt="" className="w-full h-32 object-cover" />
              <button
                onClick={() => updateField("image", "")}
                className="absolute top-2 right-2 w-6 h-6 bg-[#FF4444]/80 rounded-full flex items-center justify-center text-white hover:bg-[#FF4444] transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full py-3 border border-dashed border-[#006B3F]/30 rounded-lg text-[#00A85A]/60 hover:text-[#00A85A] hover:border-[#006B3F]/50 hover:bg-[#006B3F]/10 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading…" : "Upload Image"}
          </button>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="CTA Label"
            value={fields.cta_label}
            onChange={(v) => updateField("cta_label", v)}
            placeholder="e.g. Learn More"
          />
          <Field
            label="CTA URL"
            value={fields.cta_url}
            onChange={(v) => updateField("cta_url", v)}
            placeholder="e.g. /contact"
          />
        </div>

        {/* Items (JSON array) */}
        {items.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] font-subheading">
                Items ({items.length})
              </label>
              <button
                onClick={addItem}
                className="text-[#00A85A] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/20 text-[9px] font-subheading uppercase tracking-[0.3em]">#{i + 1}</span>
                    <button
                      onClick={() => removeItem(i)}
                      className="text-white/30 hover:text-[#FF4444] transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  {Object.keys(item).filter(k => k !== "icon").map((key) => (
                    <input
                      key={key}
                      value={item[key] || ""}
                      onChange={(e) => updateItem(i, key, e.target.value)}
                      placeholder={key}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-[#006B3F]/50 transition-colors"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && section.section_key && (
          <button
            onClick={addItem}
            className="w-full py-2 border border-dashed border-white/10 rounded-lg text-white/25 hover:text-white/50 hover:border-white/20 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            + Add Items
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 font-subheading">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#006B3F]/50 resize-none transition-colors"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#006B3F]/50 transition-colors"
        />
      )}
    </div>
  );
}
