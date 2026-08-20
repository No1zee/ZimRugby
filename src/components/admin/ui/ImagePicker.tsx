"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, X, UploadCloud, FolderOpen, Search, Check, FileImage } from "lucide-react";

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

interface DirectusFile {
  id: string;
  title: string | null;
  filename_download: string;
  type: string;
  filesize: number;
  width?: number;
  height?: number;
  uploaded_on: string;
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

  // Media Gallery Modal State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [files, setFiles] = useState<DirectusFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const fetchFiles = useCallback(async (search = "") => {
    setLoadingFiles(true);
    try {
      const res = await fetch(`/api/admin/files?limit=50&search=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error("Failed to fetch library assets");
      const json = await res.json();
      setFiles(json.data || []);
    } catch (e) {
      console.warn("Could not load media library files:", e);
    } finally {
      setLoadingFiles(false);
    }
  }, []);

  const openGallery = () => {
    setIsGalleryOpen(true);
    setSelectedFileId(value || null);
    fetchFiles(searchQuery);
  };

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
      const chosen = data.id || data.url;
      onChange(chosen);
      if (isGalleryOpen) {
        fetchFiles(searchQuery);
        setSelectedFileId(chosen);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [onChange, isGalleryOpen, fetchFiles, searchQuery]);

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
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={openGallery}
              className="inline-flex items-center gap-1.5 rounded-lg bg-black/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition-colors shadow-sm cursor-pointer"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Library
            </button>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#006B3F] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              {uploading ? "Uploading..." : "Upload New"}
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
            {hint || "Browse Directus Media Library, drop a file, or upload a new asset."}
          </p>
          {error ? <p className="text-xs text-red-600 font-medium">{error}</p> : null}
        </div>
      </div>

      {/* Directus Media Library Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="flex flex-col bg-white rounded-2xl shadow-2xl border border-black/10 w-full max-w-4xl max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
              <div>
                <h3 className="text-base font-bold text-black flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-[#006B3F]" />
                  Directus Media Library
                </h3>
                <p className="text-xs text-black/50">Select an existing image or upload a new asset to your CMS volume.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="p-1 rounded-lg text-black/40 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 px-6 py-3 bg-black/[0.02] border-b border-black/10">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                <input
                  type="text"
                  placeholder="Search filenames / titles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchFiles(e.target.value);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-black/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#006B3F] px-3 py-1.5 text-xs font-bold text-white hover:bg-green-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                  Upload to CMS
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingFiles ? (
                <div className="flex flex-col items-center justify-center h-48 gap-2 text-black/40">
                  <Loader2 className="w-6 h-6 animate-spin text-[#006B3F]" />
                  <span className="text-xs">Loading media assets...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-2 text-black/40">
                  <FileImage className="w-8 h-8 text-black/20" />
                  <span className="text-xs font-medium">No media files found in CMS</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {files.map((file) => {
                    const isSelected = selectedFileId === file.id || selectedFileId === toAssetUrl(file.id);
                    const fileUrl = toAssetUrl(file.id);
                    return (
                      <div
                        key={file.id}
                        onClick={() => setSelectedFileId(file.id)}
                        className={`group relative flex flex-col rounded-xl border overflow-hidden cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#006B3F] ring-2 ring-[#006B3F]/30 shadow-md bg-[#006B3F]/5"
                            : "border-black/10 hover:border-black/30 bg-white hover:shadow-sm"
                        }`}
                      >
                        <div className="relative aspect-video w-full overflow-hidden bg-black/5 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={fileUrl}
                            alt={file.title || file.filename_download}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-[#006B3F] text-white p-1 rounded-full shadow-md">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-[11px] font-bold text-black/80 truncate">
                            {file.title || file.filename_download}
                          </p>
                          <p className="text-[10px] text-black/40 truncate">
                            {file.width && file.height ? `${file.width}×${file.height} • ` : ""}
                            {(file.filesize / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-black/10 bg-black/[0.01]">
              <div className="text-xs text-black/50">
                {selectedFileId ? (
                  <span>Selected ID: <code className="bg-black/5 px-1.5 py-0.5 rounded font-mono text-[10px]">{selectedFileId}</code></span>
                ) : (
                  <span>Select an image to use</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-black/70 hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedFileId}
                  onClick={() => {
                    if (selectedFileId) {
                      onChange(selectedFileId);
                      setIsGalleryOpen(false);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-[#006B3F] text-xs font-bold text-white hover:bg-green-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  Apply Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

