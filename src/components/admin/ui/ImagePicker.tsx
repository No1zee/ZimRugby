"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  Loader2,
  X,
  UploadCloud,
  FolderOpen,
  Search,
  Check,
  FileImage,
  Target,
  Sparkles,
  Zap,
} from "lucide-react";

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

export interface FocalPoint {
  x: number; // 0 to 100%
  y: number; // 0 to 100%
}

/**
 * Fast, 100% Client-Side WebP Image Compressor ($0 Cloud Compute).
 * Converts 10MB-20MB photographer JPEGs to ~300KB WebP before upload.
 */
async function compressImageToWebP(
  file: File,
  maxDimension = 2000,
  quality = 0.85
): Promise<{ file: File; originalSize: number; newSize: number; durationMs: number }> {
  const startTime = performance.now();
  const originalSize = file.size;

  // Don't compress SVGs or already small images (<80KB)
  if (file.type === "image/svg+xml" || file.size < 80 * 1024) {
    return { file, originalSize, newSize: originalSize, durationMs: 0 };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve({ file, originalSize, newSize: originalSize, durationMs: 0 });
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const durationMs = Math.round(performance.now() - startTime);
            if (!blob) {
              return resolve({ file, originalSize, newSize: originalSize, durationMs });
            }
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, "") + ".webp",
              { type: "image/webp" }
            );
            resolve({
              file: compressedFile,
              originalSize,
              newSize: compressedFile.size,
              durationMs,
            });
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => resolve({ file, originalSize, newSize: originalSize, durationMs: 0 });
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve({ file, originalSize, newSize: originalSize, durationMs: 0 });
    reader.readAsDataURL(file);
  });
}

export default function ImagePicker({
  value,
  onChange,
  focalPoint = { x: 50, y: 50 },
  onFocalChange,
  label = "Image",
  hint,
  disabled = false,
}: {
  value: string;
  onChange: (assetId: string) => void;
  focalPoint?: FocalPoint;
  onFocalChange?: (point: FocalPoint) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewImgRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    newSize: number;
    durationMs: number;
  } | null>(null);
  const [isCalibratingFocal, setIsCalibratingFocal] = useState(false);

  // Media Gallery Modal State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [files, setFiles] = useState<DirectusFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const resolvedUrl = toAssetUrl(value);

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

  const upload = useCallback(
    async (rawFile: File) => {
      if (!rawFile.type.startsWith("image/")) {
        setError("Please select a valid image file (JPEG, PNG, WebP).");
        return;
      }
      setUploading(true);
      setError(null);
      setCompressionStats(null);

      try {
        // Run Client-Side WebP Transcoding
        const { file, originalSize, newSize, durationMs } = await compressImageToWebP(rawFile);
        setCompressionStats({ originalSize, newSize, durationMs });

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
    },
    [onChange, isGalleryOpen, fetchFiles, searchQuery]
  );

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      upload(e.dataTransfer.files[0]);
    }
  };

  const handleFocalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewImgRef.current) return;
    const rect = previewImgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    onFocalChange?.({ x, y });
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            upload(e.target.files[0]);
          }
        }}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col sm:flex-row gap-4 p-4 rounded-xl border transition-all ${
          isDragOver
            ? "border-[#00452a] bg-[#e6f4ea]/40 ring-2 ring-[#00452a]/20"
            : "border-[#eae8de] bg-white hover:border-[#00452a]/40"
        }`}
      >
        {/* Preview Box & Focal Target */}
        <div
          ref={previewImgRef}
          onClick={resolvedUrl ? handleFocalClick : undefined}
          className={`relative aspect-video sm:w-48 sm:h-28 rounded-lg overflow-hidden border border-[#eae8de] bg-[#fcfaef] flex items-center justify-center shrink-0 group ${
            resolvedUrl ? "cursor-crosshair" : ""
          }`}
          title={resolvedUrl ? "Click anywhere on the photo to set the Focal Point target" : ""}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-1 text-[#00452a]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-[10px] font-bold font-mono">Transcoding WebP...</span>
            </div>
          ) : resolvedUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvedUrl}
                alt="Preview"
                className="h-full w-full object-cover"
                style={{ objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }}
              />

              {/* Focal Target Reticle */}
              <div
                className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#00C88C]/80 shadow-md flex items-center justify-center pointer-events-none transition-all duration-150"
                style={{ left: `${focalPoint.x}%`, top: `${focalPoint.y}%` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Hover Overlay Hint */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold tracking-wider uppercase p-2 text-center pointer-events-none">
                🎯 Click to set Focal Point ({focalPoint.x}%, {focalPoint.y}%)
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-[#707972]">
              <ImagePlus className="h-6 w-6 stroke-[1.5]" />
              <span className="text-[10px] font-medium">No Image</span>
            </div>
          )}
        </div>

        {/* Info & Action Controls */}
        <div className="flex flex-col justify-between flex-1 min-w-0 space-y-2">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider">{label}</span>
              {resolvedUrl && onFocalChange && (
                <span className="text-[10px] font-mono text-[#006c4a] font-bold bg-[#e6f4ea] px-2 py-0.5 rounded border border-[#b2f0ca]">
                  🎯 Focal: {focalPoint.x}% {focalPoint.y}%
                </span>
              )}
            </div>

            {/* Compression Telemetry Pill */}
            {compressionStats && (
              <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md">
                <Zap className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>
                  WebP: {(compressionStats.originalSize / 1024 / 1024).toFixed(1)}MB ➡️{" "}
                  {(compressionStats.newSize / 1024).toFixed(0)}KB (
                  {(
                    (1 - compressionStats.newSize / compressionStats.originalSize) *
                    100
                  ).toFixed(0)}
                  % smaller in {compressionStats.durationMs}ms)
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading || disabled}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00452a] hover:bg-[#002d19] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload Photo</span>
            </button>

            <button
              type="button"
              onClick={openGallery}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#eae8de] hover:bg-[#fcfaef] text-xs font-bold text-[#1b1c1c] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <FolderOpen className="h-3.5 w-3.5 text-[#00452a]" />
              <span>CMS Library</span>
            </button>

            {resolvedUrl ? (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setCompressionStats(null);
                }}
                disabled={disabled}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded hover:bg-rose-50 cursor-pointer disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            ) : null}
          </div>

          <p className="text-[11px] text-[#707972] truncate">
            {hint || "Click photo to calibrate focal point. Transcodes to WebP client-side ($0 compute)."}
          </p>
          {error ? <p className="text-xs text-rose-600 font-bold">{error}</p> : null}
        </div>
      </div>

      {/* Directus Media Library Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="flex flex-col bg-white rounded-2xl shadow-2xl border border-[#eae8de] w-full max-w-4xl max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eae8de] bg-[#002d19] text-white">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-[#00C88C]" />
                  Directus Media Library
                </h3>
                <p className="text-xs text-white/70">Select an existing image or upload a new asset to your CMS volume.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 px-6 py-3 bg-[#fcfaef] border-b border-[#eae8de]">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707972]" />
                <input
                  type="text"
                  placeholder="Search filenames / titles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchFiles(e.target.value);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#eae8de] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00452a]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#00452a] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#002d19] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                  Upload to CMS
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingFiles ? (
                <div className="flex flex-col items-center justify-center h-48 gap-2 text-[#707972]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#00452a]" />
                  <span className="text-xs">Loading media assets...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-2 text-[#707972]">
                  <FileImage className="w-8 h-8 text-[#707972]/40" />
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
                            ? "border-[#00452a] ring-2 ring-[#00452a]/30 shadow-md bg-[#e6f4ea]/40"
                            : "border-[#eae8de] hover:border-[#00452a]/40 bg-white hover:shadow-xs"
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
                            <div className="absolute top-2 right-2 bg-[#00452a] text-white p-1 rounded-full shadow-md">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-[11px] font-bold text-[#1b1c1c] truncate">
                            {file.title || file.filename_download}
                          </p>
                          <p className="text-[10px] text-[#707972] truncate">
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#eae8de] bg-[#fcfaef]">
              <div className="text-xs text-[#707972]">
                {selectedFileId ? (
                  <span>
                    Selected ID:{" "}
                    <code className="bg-black/5 px-1.5 py-0.5 rounded font-mono text-[10px]">
                      {selectedFileId}
                    </code>
                  </span>
                ) : (
                  <span>Select an image to use</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#404942] hover:bg-black/5 transition-colors cursor-pointer"
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
                  className="px-4 py-2 rounded-lg bg-[#00452a] text-xs font-bold text-white hover:bg-[#002d19] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
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
