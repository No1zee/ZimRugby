"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Newspaper, Send, Eye, EyeOff, Calendar, Smartphone, Monitor, Clock, X } from "lucide-react";
import ImagePicker, { toAssetUrl } from "./ui/ImagePicker";
import RichTextEditor from "./ui/RichTextEditor";
import CollapsibleSection from "./ui/CollapsibleSection";
import { useToast } from "./ui/ToastProvider";

const CATEGORIES = ["NEWS", "PRESS RELEASE", "SABLES", "LADY SABLES", "JUNIORS", "CLUB RUGBY", "ANNOUNCEMENT", "SPONSORSHIP"];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ArticleComposer({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("NEWS");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [publishAt, setPublishAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const hasInput = title.trim() !== "" || excerpt.trim() !== "" || body.trim() !== "" || slug.trim() !== "";

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showPreview) {
        setShowPreview(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPreview]);

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function handleSubmit(e: React.FormEvent, saveStatus: string) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/directus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "news",
          data: {
            title,
            slug: slug || slugify(title),
            excerpt,
            body,
            category,
            image: image || null,
            status: saveStatus,
            date: publishAt ? new Date(publishAt).toISOString() : new Date().toISOString(),
          },
        }),
      });
      if (res.ok) {
        toast(saveStatus === "published" ? `'${title}' is now live on the website.` : `'${title}' saved as a draft.`);
        setTitle(""); setExcerpt(""); setBody(""); setImage(""); setSlug("");
        setSlugTouched(false); setStatus("draft"); setPublishAt("");
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

  const previewImageUrl = toAssetUrl(image);

  return (
    <>
      {/* 📱 ARTICLE LIVE PREVIEW MODAL */}
      {showPreview && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className={`bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-black/10 transition-all duration-300 ${
              previewDevice === "mobile" ? "w-[390px] h-[780px]" : "w-full max-w-4xl h-[85vh]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0d131a] text-white px-5 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">
                  Live Article Preview {status === "draft" ? "(Draft Mode)" : "(Live)"}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      previewDevice === "desktop" ? "bg-[#006B3F] text-white" : "text-white/60 hover:text-white"
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      previewDevice === "mobile" ? "bg-[#006B3F] text-white" : "text-white/60 hover:text-white"
                    }`}
                    title="Mobile Viewport"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Live Article View */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 bg-milk-white">
              {/* Category & Date */}
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#006B3F] text-white text-[10px] font-black uppercase font-mono tracking-widest">
                  {category}
                </span>
                <span className="text-xs text-black/50 font-mono">
                  {publishAt ? new Date(publishAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-2xl md:text-3xl font-black uppercase text-rich-black leading-tight">
                {title || "Untitled Article Headline"}
              </h1>

              {/* Excerpt */}
              {excerpt && (
                <p className="text-sm md:text-base font-semibold text-black/70 italic border-l-4 border-[#006B3F] pl-4 py-1">
                  {excerpt}
                </p>
              )}

              {/* Hero Image */}
              {previewImageUrl ? (
                <div className="rounded-xl overflow-hidden border border-black/10 aspect-video relative bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewImageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-black/10 p-8 text-center text-xs text-black/40">
                  No hero image attached
                </div>
              )}

              {/* Body Content */}
              <div className="prose prose-sm max-w-none text-black/80 font-sans leading-relaxed">
                {body ? (
                  <div dangerouslySetInnerHTML={{ __html: body }} />
                ) : (
                  <p className="text-black/40 italic">Article body will appear here...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPOSER FORM */}
      <CollapsibleSection
        title="Write a news article"
        icon={<Newspaper className="h-5 w-5" />}
        description="Articles appear in the homepage Latest News panel and the media archive. Add a hero image and write the body."
        defaultOpen={false}
        onDirtyChange={onDirtyChange}
        dirty={hasInput}
      >
        <form onSubmit={(e) => handleSubmit(e, status)} className="space-y-4">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Sables squad named for Rugby Africa Cup"
              required
              className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Summary (shown in lists)</label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="One or two sentences to hook readers."
              className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Article body</label>
            <RichTextEditor value={body} onChange={setBody} placeholder="Write your article here — bold, headings, lists and links supported." />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Scheduled / Embargo Date</label>
              <input
                type="datetime-local"
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-mono"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Web address (slug)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
                placeholder="auto-generated from headline"
                className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
              />
              <p className="mt-0.5 text-[10px] text-black/40">Live link: /media/{slug || slugify(title) || "…"}</p>
            </div>
            
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
              >
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published (live)</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-3">
            <ImagePicker value={image} onChange={setImage} label="Hero image" hint="Recommended: landscape, ~1200px wide (Directus Asset)." />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-zru-green px-6 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              {saving ? "Saving…" : status === "published" ? "Publish article" : "Save as draft"}
            </button>

            {/* Live Preview Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/15 bg-white px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-rich-black hover:bg-black/5 transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-[#006B3F]" />
              <span>Side-by-Side Preview</span>
            </button>

            {status === "draft" && (
              <button
                type="button"
                disabled={saving}
                onClick={() => setStatus("published")}
                className="rounded-lg bg-black/5 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/10 disabled:opacity-50 cursor-pointer"
              >
                Switch to publish
              </button>
            )}
          </div>
        </form>
      </CollapsibleSection>
    </>
  );
}
