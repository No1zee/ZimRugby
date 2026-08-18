"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, Loader2, X, UploadCloud } from "lucide-react";

export function toAssetUrl(idOrUrl?: string | null): string {
  if (!idOrUrl) return "";
  if (idOrUrl.startsWith("http://") || idOrUrl.startsWith("https://") || idOrUrl.startsWith("/")) {
    return idOrUrl;
  }
  if (/^[a-f0-9-]{36}$/i.test(idOrUrl)) {
    const directusBase = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://zru-directus-cms-production.up.railway.app";
    return `${directusBase}/assets/${idOrUrl}`;
  }
  return idOrUrl;
}

export default function ImagePicker({
  value,
  onChange,
  label = "Image",
  hint,
}: {
  value: string;
  onChange: (assetId: string) => void;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.id || data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [onChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const preview = toAssetUrl(value);

  return (
    <div>
      {label ? (
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/60">{label}</span>
      ) : null}
      
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all ${
          isDragOver 
            ? "border-[#006B3F] bg-[#006B3F]/5 ring-2 ring-[#006B3F]/20" 
            : "border-dashed border-black/15 bg-black/[0.02] hover:border-black/30"
        }`}
      >
        <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Asset Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-black/30 text-[10px]">
              <UploadCloud className="w-5 h-5" />
              <span>Drop file</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#006B3F] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              {uploading ? "Uploading..." : "Browse / Drop"}
            </button>

            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded hover:bg-red-50 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            ) : null}
          </div>

          <p className="text-[11px] text-black/50 truncate">
            {hint || "Drag & drop image here or browse from device (Directus Asset)"}
          </p>
          {error ? <p className="text-xs text-red-600 font-medium">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
