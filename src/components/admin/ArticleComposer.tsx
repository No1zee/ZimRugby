"use client";

import React, { useState, useEffect, useRef, useTransition, useCallback } from "react";
import {
  FileText,
  Save,
  Send,
  Eye,
  Loader2,
  Trash2,
  Sparkles,
  HelpCircle,
  Clock,
  BookOpen,
  Lock,
  Unlock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import RichTextEditor from "@/components/admin/ui/RichTextEditor";
import ImagePicker from "@/components/admin/ui/ImagePicker";
import StatusChip from "@/components/admin/ui/StatusChip";
import { useToast } from "@/components/admin/ui/ToastProvider";
import { useConfirm } from "@/components/admin/ui/ConfirmProvider";
import { ArticleLivePreview } from "@/components/admin/ArticleLivePreview";

const CATEGORIES = [
  "Match Report",
  "Squad Announcement",
  "Press Release",
  "Interview",
  "Feature",
  "Grassroots",
  "Women's Rugby",
  "Sevens",
  "Academy",
  "Governance",
  "General",
] as const;

export interface ArticleData {
  id?: number | string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  featured_image?: string;
  image_caption?: string;
  author: string;
  status: "published" | "draft" | "archived";
  is_featured?: boolean;
  published_at?: string;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
}

interface ArticleComposerProps {
  initialData?: Partial<ArticleData>;
  onSave?: (data: ArticleData) => Promise<{ success: boolean; error?: string }>;
  onCancel?: () => void;
  onDelete?: (id: number | string) => Promise<{ success: boolean; error?: string }>;
  isSubmitting?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calculateReadingTime(text: string): { words: number; minutes: number } {
  const clean = text.replace(/<[^>]*>/g, " ").trim();
  const words = clean ? clean.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, minutes };
}

export default function ArticleComposer({
  initialData,
  onSave,
  onCancel,
  onDelete,
  isSubmitting = false,
  onDirtyChange,
}: ArticleComposerProps) {
  const isEdit = Boolean(initialData?.id);
  const storageKey = `zru_draft_${initialData?.id || "new"}`;

  // Form State
  const [formData, setFormData] = useState<ArticleData>({
    id: initialData?.id,
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "Match Report",
    summary: initialData?.summary || "",
    content: initialData?.content || "",
    featured_image: initialData?.featured_image || "",
    image_caption: initialData?.image_caption || "",
    author: initialData?.author || "ZRU Media",
    status: initialData?.status || "draft",
    is_featured: initialData?.is_featured ?? false,
    published_at:
      initialData?.published_at || new Date().toISOString().split("T")[0],
    tags: initialData?.tags || [],
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",
  });

  const [tagInput, setTagInput] = useState("");
  const [autoSlugLocked, setAutoSlugLocked] = useState<boolean>(Boolean(initialData?.slug));
  const [showLivePreview, setShowLivePreview] = useState<boolean>(false);
  const [hasRestorableDraft, setHasRestorableDraft] = useState<boolean>(false);
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const confirm = useConfirm();

  // Metrics
  const { words, minutes } = calculateReadingTime(
    `${formData.title} ${formData.summary} ${formData.content}`
  );

  // Track dirty state
  useEffect(() => {
    const isDirty = Boolean(
      formData.title !== (initialData?.title || "") ||
        formData.content !== (initialData?.content || "") ||
        formData.summary !== (initialData?.summary || "")
    );
    onDirtyChange?.(isDirty);
  }, [formData, initialData, onDirtyChange]);

  // Check for restorable local draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          parsed.updatedAt &&
          (!initialData?.id || parsed.title !== initialData?.title || parsed.content !== initialData?.content)
        ) {
          setHasRestorableDraft(true);
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, [storageKey, initialData]);

  // Debounced Auto-Save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || formData.content || formData.summary) {
        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              ...formData,
              updatedAt: new Date().toISOString(),
            })
          );
          setLastAutoSavedTime(
            new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
          );
        } catch {
          // localStorage full or unavailable
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, storageKey]);

  // Handle Restore Draft
  const handleRestoreDraft = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
        setHasRestorableDraft(false);
        toast("Restored unsaved draft changes from local storage.", "success");
      }
    } catch {
      toast("Could not read local draft snapshot.", "error");
    }
  };

  // Discard Local Draft Snapshot
  const handleDiscardLocalDraft = () => {
    localStorage.removeItem(storageKey);
    setHasRestorableDraft(false);
  };

  // Handle Title change & intelligent slug generation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: autoSlugLocked ? prev.slug : slugify(title),
      meta_title: prev.meta_title ? prev.meta_title : title.slice(0, 60),
    }));
  };

  // Handle Tag Addition
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, "");
      if (val && !formData.tags?.includes(val)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), val],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tagToRemove),
    }));
  };

  // Submission handler
  const executeSave = useCallback(
    async (statusOverride?: "published" | "draft") => {
      if (!formData.title.trim()) {
        toast("Please enter an article title before saving.", "error");
        return;
      }

      const payload: ArticleData = {
        ...formData,
        status: statusOverride || formData.status,
        slug: formData.slug || slugify(formData.title),
      };

      startTransition(async () => {
        let res: { success: boolean; error?: string };

        if (onSave) {
          res = await onSave(payload);
        } else {
          // Direct Directus news collection save
          try {
            const method = payload.id ? "PATCH" : "POST";
            const response = await fetch("/api/admin/directus", {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                collection: "news",
                id: payload.id,
                data: {
                  title: payload.title,
                  slug: payload.slug,
                  category: payload.category,
                  summary: payload.summary,
                  content: payload.content,
                  featured_image: payload.featured_image,
                  image_caption: payload.image_caption,
                  author: payload.author,
                  status: payload.status,
                  is_featured: payload.is_featured,
                  date_created: payload.published_at,
                  tags: payload.tags,
                },
              }),
            });
            const json = await response.json();
            if (response.ok) {
              res = { success: true };
            } else {
              res = { success: false, error: json.error || "Save failed" };
            }
          } catch (e) {
            res = { success: false, error: e instanceof Error ? e.message : "Network error" };
          }
        }

        if (res.success) {
          // Clear local autosave snapshot
          localStorage.removeItem(storageKey);
          setHasRestorableDraft(false);
          onDirtyChange?.(false);
          toast(
            statusOverride === "published"
              ? `"${payload.title}" published successfully.`
              : `"${payload.title}" saved successfully.`,
            "success"
          );
        } else {
          toast(
            res.error || "Failed to save article. Your local draft is preserved.",
            "error"
          );
        }
      });
    },
    [formData, onSave, storageKey, toast, onDirtyChange]
  );

  // Keyboard Shortcuts: Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        executeSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [executeSave]);

  const handleDelete = async () => {
    if (!initialData?.id || !onDelete) return;
    const ok = await confirm({
      title: "Delete Article",
      message: `Are you sure you want to move "${formData.title}" to trash?`,
      confirmLabel: "Move to Trash",
      danger: true,
    });
    if (!ok) return;

    startTransition(async () => {
      const res = await onDelete(initialData.id!);
      if (res.success) {
        localStorage.removeItem(storageKey);
        toast("Article moved to trash successfully.", "success");
      } else {
        toast(res.error || "Failed to delete article.", "error");
      }
    });
  };

  const busy = isSubmitting || isPending;

  return (
    <div className="relative flex flex-col gap-6">
      {/* Restorable Draft Crash Banner */}
      {hasRestorableDraft && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Unsaved Local Draft Detected:</strong> An unsaved copy of this article was found from your previous session.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDiscardLocalDraft}
              className="px-3 py-1.5 rounded-lg border border-amber-600/30 text-amber-800 hover:bg-amber-600/10 transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors shadow-xs"
            >
              Restore Draft
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-black flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#006B3F]" />
              {isEdit ? "Edit Article" : "Compose New Article"}
            </h2>
            <StatusChip status={formData.status} />
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-black/50">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {words} words
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{minutes} min read
            </span>
            {lastAutoSavedTime && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Auto-saved locally {lastAutoSavedTime}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Live Preview Toggle */}
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              showLivePreview
                ? "bg-black text-white shadow-sm"
                : "bg-white border border-black/15 text-black/80 hover:bg-black/5"
            }`}
          >
            <Eye className="w-4 h-4 text-[#006B3F]" />
            {showLivePreview ? "Hide Preview" : "Live Preview"}
          </button>

          {/* Delete (if edit) */}
          {isEdit && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              title="Move to trash"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => executeSave("draft")}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/20 text-xs font-bold text-black/80 hover:bg-black/5 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            title="Save as Draft (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>

          {/* Publish / Update Button */}
          <button
            type="button"
            onClick={() => executeSave(formData.status === "draft" ? "published" : undefined)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006B3F] text-xs font-black text-white hover:bg-green-800 transition-colors disabled:opacity-50 cursor-pointer shadow-md"
          >
            {busy ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : formData.status === "published" ? (
              <Save className="w-3.5 h-3.5" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {formData.status === "published" ? "Update Article" : "Publish Now"}
          </button>
        </div>
      </div>

      {/* Main Composer Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content Inputs */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Article Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-black/80">
                Article Title <span className="text-red-500">*</span>
              </label>
              <span
                className={`text-[10px] font-mono ${
                  formData.title.length > 70
                    ? "text-red-500 font-bold"
                    : formData.title.length >= 40
                    ? "text-emerald-600"
                    : "text-black/40"
                }`}
              >
                {formData.title.length}/70 chars
              </span>
            </div>
            <input
              type="text"
              placeholder="e.g. Zimbabwe Sables Announce 2026 Africa Cup Squad..."
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2.5 text-base font-bold bg-white border border-black/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006B3F] shadow-xs"
            />
          </div>

          {/* Permalinks / Slug */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-black/70 flex items-center gap-1.5">
                Permalink Slug
                <button
                  type="button"
                  onClick={() => setAutoSlugLocked(!autoSlugLocked)}
                  className="text-black/40 hover:text-black transition-colors"
                  title={autoSlugLocked ? "Slug is locked. Click to auto-generate from title." : "Slug updates with title. Click to lock."}
                >
                  {autoSlugLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-[#006B3F]" />}
                </button>
              </label>
              <span className="text-[10px] text-black/40">/media/{formData.slug || "slug"}</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlugLocked(true);
                  setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }));
                }}
                placeholder="article-url-slug"
                className="w-full px-3.5 py-1.5 text-xs font-mono bg-white border border-black/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
              />
            </div>
          </div>

          {/* Summary / Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-black/80">
                Summary / Lead Excerpt
              </label>
              <span
                className={`text-[10px] font-mono ${
                  formData.summary.length > 180
                    ? "text-red-500 font-bold"
                    : formData.summary.length >= 120
                    ? "text-emerald-600"
                    : "text-black/40"
                }`}
              >
                {formData.summary.length}/160 chars (SEO recommended)
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Brief introductory summary for social previews, search engines, and media cards..."
              value={formData.summary}
              onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
              className="w-full px-3.5 py-2 text-xs bg-white border border-black/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006B3F] shadow-xs leading-relaxed"
            />
          </div>

          {/* Full Rich Body */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black/80 mb-1.5">
              Article Content & Story
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
              placeholder="Write the full match report or press release..."
            />
          </div>
        </div>

        {/* Right Col: Metadata, Hero Media & Category */}
        <div className="flex flex-col gap-5">
          {/* Hero Image Picker */}
          <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/10">
            <label className="block text-xs font-bold uppercase tracking-wider text-black/80 mb-2">
              Featured Hero Media
            </label>
            <ImagePicker
              value={formData.featured_image || ""}
              onChange={(val) => setFormData((prev) => ({ ...prev, featured_image: val }))}
              hint="Recommended: 16:9 WebP or JPG (1200x675px)"
            />
            {formData.featured_image ? (
              <div className="mt-3">
                <label className="block text-[11px] font-semibold text-black/60 mb-1">
                  Image Caption & Photo Credit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Photo: ZRU / Media Hub"
                  value={formData.image_caption || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_caption: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-black/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
                />
              </div>
            ) : null}
          </div>

          {/* Category & Status */}
          <div className="p-4 rounded-2xl bg-white border border-black/10 flex flex-col gap-4 shadow-xs">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/80 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F] font-semibold cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/80 mb-1.5">
                Author Byline
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="e.g. ZRU Communications"
                className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/80 mb-1.5">
                Publication Date
              </label>
              <input
                type="date"
                value={formData.published_at?.split("T")[0] || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, published_at: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-black/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-black/10">
              <input
                type="checkbox"
                id="is_featured"
                checked={Boolean(formData.is_featured)}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                className="rounded border-black/20 text-[#006B3F] focus:ring-[#006B3F] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="is_featured" className="text-xs font-bold text-black/80 cursor-pointer">
                Feature on Homepage Hub
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-black/80 mb-1.5">
              Tags & Taxonomy
            </label>
            <input
              type="text"
              placeholder="Add tag and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-3 py-1.5 text-xs bg-white border border-black/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B3F] mb-2"
            />
            <div className="flex flex-wrap gap-1.5">
              {formData.tags?.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/5 text-black/70"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-red-500 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Live Responsive Preview Drawer */}
      <ArticleLivePreview
        isOpen={showLivePreview}
        onClose={() => setShowLivePreview(false)}
        title={formData.title}
        category={formData.category}
        author={formData.author}
        publishDate={formData.published_at}
        summary={formData.summary}
        content={formData.content}
        imageUrl={formData.featured_image}
        imageCaption={formData.image_caption}
        readTimeMinutes={minutes}
      />
    </div>
  );
}
