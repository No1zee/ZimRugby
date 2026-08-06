"use client";

import { useState, useEffect, useRef } from "react";
import { X, Save, Check, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { useEditMode } from "./EditContext";

interface EditableField {
  key: string;
  label: string;
  value: string;
  multiline?: boolean;
  type?: "text" | "image" | "select";
  options?: { label: string; value: string }[];
}

export default function InlineEditor() {
  const { editingTarget, stopEditing, saveField } = useEditMode();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTarget) {
      const initial: Record<string, string> = {};
      editingTarget.fields.forEach((f) => {
        initial[f.key] = f.value;
      });
      setValues(initial);
      setSaved(false);
      setError("");
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [editingTarget]);

  useEffect(() => {
    if (!editingTarget) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopEditing();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [editingTarget, stopEditing]);

  if (!editingTarget) return null;

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const success = await saveField(editingTarget.collection, editingTarget.id, values);
    setSaving(false);
    if (success) {
      setSaved(true);
      setTimeout(() => {
        stopEditing();
        window.location.reload();
      }, 600);
    } else {
      setError("Failed to save. Please try again.");
    }
  };

  const handleImageUpload = async (fieldKey: string, file: File) => {
    setUploading(fieldKey);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url, id } = await res.json();
      // Save UUID for file-reference fields, full URL as fallback
      setValues((v) => ({ ...v, [fieldKey]: id || url }));
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      stopEditing();
    }
  };

  const renderField = (field: EditableField, idx: number) => {
    if (field.type === "select" && field.options) {
      return (
        <div key={field.key}>
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 font-subheading">
            {field.label}
          </label>
          <select
            value={values[field.key] || ""}
            onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#006B3F]/50 transition-colors appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            <option value="" className="bg-[#002D1A] text-white/50">Select...</option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#002D1A] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === "image") {
      return (
        <div key={field.key}>
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 font-subheading">
            {field.label}
          </label>
          {values[field.key] && (
            <div className="relative mb-3 rounded-lg overflow-hidden border border-white/10">
              <img
                src={values[field.key]}
                alt=""
                className="w-full h-40 object-cover"
              />
              <button
                onClick={() => setValues((v) => ({ ...v, [field.key]: "" }))}
                className="absolute top-2 right-2 w-7 h-7 bg-[#FF4444]/80 rounded-full flex items-center justify-center text-white hover:bg-[#FF4444] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <label className="flex items-center justify-center gap-2 w-full py-8 border border-dashed border-[#006B3F]/30 rounded-lg text-[#00A85A]/60 hover:text-[#00A85A] hover:border-[#006B3F]/50 hover:bg-[#006B3F]/10 transition-all text-[10px] font-bold uppercase tracking-widest cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(field.key, file);
              }}
            />
            {uploading === field.key ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading === field.key ? "Uploading..." : "Upload Image"}
          </label>
        </div>
      );
    }

    if (field.multiline) {
      return (
        <div key={field.key}>
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 font-subheading">
            {field.label}
          </label>
          <textarea
            value={values[field.key] || ""}
            onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#006B3F]/50 resize-none transition-colors"
          />
        </div>
      );
    }

    return (
      <div key={field.key}>
        <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 font-subheading">
          {field.label}
        </label>
        <input
          ref={idx === 0 ? firstInputRef : undefined}
          type="text"
          value={values[field.key] || ""}
          onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#006B3F]/50 transition-colors"
        />
      </div>
    );
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-[#002D1A] border border-white/10 rounded-2xl w-full max-w-lg mx-4 shadow-2xl relative">
        {/* Green accent at top */}
        <div className="h-1 bg-gradient-to-r from-[#006B3F] via-[#00A85A] to-[#006B3F] rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h3 className="text-white font-heading text-sm uppercase tracking-wider">
              Edit Content
            </h3>
            <span className="text-white/25 text-[9px] font-subheading uppercase tracking-[0.3em]">
              {editingTarget.collection} / {editingTarget.id}
            </span>
          </div>
          <button
            onClick={stopEditing}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fields */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {editingTarget.fields.map((field, idx) => renderField(field, idx))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10">
          {error && (
            <span className="text-[#FF4444] text-xs">{error}</span>
          )}
          {saved && (
            <span className="text-[#00A85A] text-xs flex items-center gap-1">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
          {!error && !saved && <span />}

          <div className="flex items-center gap-3">
            <button
              onClick={stopEditing}
              className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white bg-[#006B3F] rounded-lg hover:bg-[#00A85A] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,107,63,0.3)]"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
