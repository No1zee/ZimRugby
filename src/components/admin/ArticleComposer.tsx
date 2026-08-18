"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Newspaper, Send, Eye, Smartphone, Monitor, X, CheckCircle2, ChevronRight } from "lucide-react";
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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [posted, setPosted] = useState<{ id: string | number; slug: string; wasLive: boolean } | null>(null);

  const hasInput = title.trim() !== "" || excerpt.trim() !== "" || body.trim() !== "" || slug.trim() !== "";

  const reviewChecklist = [
    { label: "Headline is set", ok: title.trim().length >= 5 },
    { label: "Category chosen", ok: category.trim() !== "" },
    { label: "Hero image attached", ok: image.trim() !== "" },
  ];
  const checklistComplete = reviewChecklist.every((c) => c.ok);

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

  async function save(saveStatus: string) {
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
            ...(publishAt ? { publish_at: new Date(publishAt).toISOString() } : {}),
          },
        }),
      });
      const body2 = await res.json().catch(() => null);
      if (res.ok) {
        const createdId = body2?.data?.id;
        setPosted({ id: createdId ?? 0, slug: slug || slugify(title), wasLive: saveStatus === "published" });
        if (saveStatus === "published") {
          toast(`'${title}' is now live on the website. Click Undo to take it down.`, "success", {
            label: "Undo",
            onClick: () => undoPublish(createdId),
            durationMs: 5000,
          });
        } else if (saveStatus === "in_review") {
          toast(`'${title}' sent for review — the editor will see it in their queue.`);
        } else {
          toast(`'${title}' saved as a draft.`);
        }
        setTitle(""); setExcerpt(""); setBody(""); setImage(""); setSlug("");
        setSlugTouched(false); setStatus("draft"); setPublishAt(""); setStep(1);
        router.refresh();
      } else {
        toast(`Failed to save: ${body2?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Error: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setSaving(false);
    }
  }

  function handleSubmit(e: React.FormEvent, saveStatus: string) {
    e.preventDefault();
    return save(saveStatus);
  }

  async function undoPublish(id: string | number | undefined) {
    if (id === undefined || id === 0) return;
    const res = await fetch("/api/admin/directus", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: "news", id, data: { status: "draft" } }),
    });
    if (res.ok) {
      toast("Taken down — back to draft.");
      router.refresh();
    } else {
      toast("Could not take the article down.", "error");
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
        description="Articles appear in the homepage Latest News panel and the media archive. Three quick steps: story, write, post."
        defaultOpen={false}
        onDirtyChange={onDirtyChange}
        dirty={hasInput}
      >
        {posted ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-zru-green/30 bg-zru-green/5 p-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-zru-green" />
              <h3 className="mt-2 font-heading text-lg font-black uppercase text-rich-black">
                {posted.wasLive ? "Posted to the website" : "Saved"}
              </h3>
              <p className="mt-1 text-xs text-black/60">
                {posted.wasLive
                  ? "It's live at /media within about a minute."
                  : "You'll find it in the News articles list below."}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`/media/${posted.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-zru-green px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800"
                >
                  View live page <Eye className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setPosted(null)}
                  className="rounded-lg border border-black/15 bg-white px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-rich-black transition-colors hover:bg-black/5 cursor-pointer"
                >
                  Write another
                </button>
                {posted.wasLive && (
                  <button
                    type="button"
                    onClick={() => undoPublish(posted.id)}
                    className="rounded-lg bg-black/5 px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/10 cursor-pointer"
                  >
                    Undo (unpublish)
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
        <div className="space-y-5">
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {[
              { n: 1 as const, label: "Story" },
              { n: 2 as const, label: "Write" },
              { n: 3 as const, label: "Post" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                {i > 0 && <span className="h-px w-6 bg-black/15" />}
                <button
                  type="button"
                  onClick={() => s.n < step && setStep(s.n)}
                  disabled={s.n > step}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
                    step === s.n
                      ? "bg-zru-green text-white"
                      : s.n < step
                        ? "bg-zru-green/10 text-zru-green cursor-pointer"
                        : "bg-black/5 text-black/40"
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[9px]">{s.n}</span>
                  {s.label}
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={(e) => handleSubmit(e, "published")} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Headline</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="e.g. Sables squad named for Rugby Africa Cup"
                    required
                    autoFocus
                    className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-bold"
                  />
                  {title.trim().length > 0 && title.trim().length < 5 && (
                    <p className="mt-1 text-[10px] text-amber-600">Headlines under 5 characters look weak — try something fuller.</p>
                  )}
                </div>

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

                <ImagePicker value={image} onChange={setImage} label="Hero image" hint="Recommended: landscape, ~1200px wide." />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={title.trim().length < 5}
                    className="inline-flex items-center gap-2 rounded-lg bg-zru-green px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800 disabled:opacity-40 cursor-pointer"
                  >
                    Next: Write <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
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
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">
                    Article body <span className="normal-case text-black/40">({body.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length} words)</span>
                  </label>
                  <RichTextEditor value={body} onChange={setBody} placeholder="Write your article here — bold, headings, lists and links supported." />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-lg border border-black/15 bg-white px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/5 cursor-pointer"
                  >
                    Back
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPreview(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-black/15 bg-white px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-rich-black hover:bg-black/5 transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#006B3F]" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="inline-flex items-center gap-2 rounded-lg bg-zru-green px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800 cursor-pointer"
                    >
                      Next: Post <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Schedule (optional)</label>
                    <input
                      type="datetime-local"
                      value={publishAt}
                      onChange={(e) => setPublishAt(e.target.value)}
                      className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm font-mono"
                    />
                    <p className="mt-0.5 text-[10px] text-black/40">Leave empty to go out immediately.</p>
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
                </div>

                <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-black/50">Ready to post? Checklist</p>
                  <ul className="space-y-1.5">
                    {reviewChecklist.map((c) => (
                      <li key={c.label} className="flex items-center gap-2 text-xs">
                        {c.ok ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-zru-green" />
                        ) : (
                          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500/20 text-[9px] font-black text-amber-600">!</span>
                        )}
                        <span className={c.ok ? "text-black/70" : "text-amber-700"}>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-lg border border-black/15 bg-white px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/5 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => save("draft")}
                    className="rounded-lg bg-black/5 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/10 disabled:opacity-50 cursor-pointer"
                  >
                    Save as draft
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => save("in_review")}
                    className="rounded-lg bg-amber-500/10 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-amber-700 transition-colors hover:bg-amber-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    Send for review
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !checklistComplete}
                    className="inline-flex items-center gap-2 rounded-lg bg-zru-green px-6 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {saving ? "Posting…" : publishAt ? "Schedule post" : "Post now"}
                  </button>
                </div>
                {!checklistComplete && (
                  <p className="text-[10px] text-amber-700">Complete the checklist above to enable posting.</p>
                )}
              </div>
            )}
          </form>
        </div>
        )}
      </CollapsibleSection>
    </>
  );
}
