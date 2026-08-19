"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Newspaper,
  Send,
  Eye,
  Smartphone,
  Monitor,
  X,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Clock,
  Globe2,
  FileEdit,
  Tag,
} from "lucide-react";
import ImagePicker, { toAssetUrl } from "./ui/ImagePicker";
import RichTextEditor from "./ui/RichTextEditor";
import CollapsibleSection from "./ui/CollapsibleSection";
import { useToast } from "./ui/ToastProvider";

const CATEGORIES = [
  "NEWS",
  "PRESS RELEASE",
  "SABLES",
  "LADY SABLES",
  "JUNIORS",
  "CLUB RUGBY",
  "ANNOUNCEMENT",
  "SPONSORSHIP",
];

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
  const [category, setCategory] = useState("ZRU");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["ZRU"]);
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

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const exists = prev.includes(cat);
      if (exists) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const hasInput = title.trim() !== "" || excerpt.trim() !== "" || body.trim() !== "" || slug.trim() !== "";

  const reviewChecklist = [
    { label: "Headline is set (min 5 chars)", ok: title.trim().length >= 5 },
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
            category: selectedCategories.join(", "),
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
          toast(`'${title}' is now live on the website.`, "success", {
            label: "Undo",
            onClick: () => undoPublish(createdId),
            durationMs: 6000,
          });
        } else if (saveStatus === "in_review") {
          toast(`'${title}' sent for editorial review.`);
        } else {
          toast(`'${title}' saved as draft.`);
        }
        setTitle("");
        setExcerpt("");
        setBody("");
        setImage("");
        setSlug("");
        setSlugTouched(false);
        setStatus("draft");
        setPublishAt("");
        setStep(1);
        router.refresh();
      } else {
        toast(`Failed to save: ${body2?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Error: ${err instanceof Error ? err.message : String(err)}`, "error");
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
      toast("Article unpublished — returned to draft.");
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
          data-lenis-prevent
        >
          <div
            className={`bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20 transition-all duration-300 ${
              previewDevice === "mobile" ? "w-[390px] h-[780px]" : "w-full max-w-4xl h-[85vh]"
            }`}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            {/* Modal Header */}
            <div className="bg-[#0B1520] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zru-green animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/90">
                  Live Article Preview {status === "draft" ? "(Draft)" : "(Live)"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewDevice === "desktop" ? "bg-zru-green text-white shadow-sm" : "text-white/60 hover:text-white"
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewDevice === "mobile" ? "bg-zru-green text-white shadow-sm" : "text-white/60 hover:text-white"
                    }`}
                    title="Mobile Viewport"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="text-white/60 hover:text-white p-1.5 rounded-xl hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated Live Article View */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 bg-milk-white">
              {/* Category & Date */}
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-zru-green text-white text-[10px] font-black uppercase font-mono tracking-widest">
                  {category}
                </span>
                <span className="text-xs text-black/50 font-mono">
                  {publishAt
                    ? new Date(publishAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : new Date().toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-2xl md:text-4xl font-black uppercase text-rich-black leading-tight">
                {title || "Untitled Article Headline"}
              </h1>

              {/* Excerpt */}
              {excerpt && (
                <p className="text-sm md:text-base font-semibold text-black/75 italic border-l-4 border-zru-green pl-4 py-1">
                  {excerpt}
                </p>
              )}

              {/* Hero Image */}
              {previewImageUrl ? (
                <div className="rounded-2xl overflow-hidden border border-black/10 aspect-video relative bg-black/5 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewImageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-black/10 p-10 text-center text-xs text-black/40">
                  No hero image attached
                </div>
              )}

              {/* Body Content */}
              <div className="prose prose-sm max-w-none text-black/85 font-sans leading-relaxed">
                {body ? (
                  <div dangerouslySetInnerHTML={{ __html: body }} />
                ) : (
                  <p className="text-black/40 italic">Article body will render here...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPOSER FORM SECTION */}
      <CollapsibleSection
        title="Compose a News Story"
        icon={<Newspaper className="h-5 w-5 text-zru-green" />}
        description="Editorial publisher for match reports, squad announcements, and union news."
        defaultOpen={false}
        onDirtyChange={onDirtyChange}
        dirty={hasInput}
      >
        {posted ? (
          <div className="space-y-4">
            <div className="rounded-3xl border border-zru-green/30 bg-zru-green/5 p-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-zru-green" />
              <h3 className="mt-3 font-heading text-xl font-black uppercase text-rich-black">
                {posted.wasLive ? "Published Live" : "Draft Saved"}
              </h3>
              <p className="mt-1 text-xs text-black/60">
                {posted.wasLive
                  ? "Article is now live in the media section and homepage latest news panel."
                  : "Saved to your drafts list below."}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`/media/${posted.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-zru-green px-5 py-3 font-heading text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-green-800 transition-all"
                >
                  View Live Article <Eye className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setPosted(null)}
                  className="rounded-xl border border-black/15 bg-white px-5 py-3 font-heading text-xs font-black uppercase tracking-wider text-rich-black hover:bg-black/5 transition-all cursor-pointer"
                >
                  Write Another
                </button>
                {posted.wasLive && (
                  <button
                    type="button"
                    onClick={() => undoPublish(posted.id)}
                    className="rounded-xl bg-black/5 px-5 py-3 font-heading text-xs font-black uppercase tracking-wider text-black/60 hover:bg-black/10 transition-all cursor-pointer"
                  >
                    Unpublish to Draft
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step indicator bar */}
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                {[
                  { n: 1 as const, label: "Headline & Category", icon: Tag },
                  { n: 2 as const, label: "Write Story", icon: FileEdit },
                  { n: 3 as const, label: "Schedule & Publish", icon: Globe2 },
                ].map((s, i) => (
                  <div key={s.n} className="flex items-center gap-2">
                    {i > 0 && <span className="h-px w-6 bg-black/15" />}
                    <button
                      type="button"
                      onClick={() => s.n < step && setStep(s.n)}
                      disabled={s.n > step}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                        step === s.n
                          ? "bg-zru-green text-white shadow-sm"
                          : s.n < step
                          ? "bg-zru-green/10 text-zru-green hover:bg-zru-green/20 cursor-pointer"
                          : "bg-black/5 text-black/40"
                      }`}
                    >
                      <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white/20 text-[10px]">
                        {s.n}
                      </span>
                      <span>{s.label}</span>
                    </button>
                  </div>
                ))}
              </div>

              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3.5 py-2 text-xs font-black uppercase tracking-wider text-rich-black hover:bg-black/5 transition-colors cursor-pointer shadow-sm"
                >
                  <Eye className="h-3.5 w-3.5 text-zru-green" />
                  <span>Preview</span>
                </button>
              )}
            </div>

            <form onSubmit={(e) => handleSubmit(e, "published")} className="space-y-5">
              {/* STEP 1: Story Details */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/70">
                      Story Headline
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => onTitleChange(e.target.value)}
                      placeholder="e.g. Zimbabwe Sables Squad Announced for 2026 Africa Cup"
                      required
                      autoFocus
                      className="w-full rounded-2xl border border-black/10 bg-white p-4 font-heading text-lg font-black uppercase text-rich-black placeholder:text-black/30 outline-none focus:border-zru-green shadow-sm"
                    />
                    {title.trim().length > 0 && title.trim().length < 5 && (
                      <p className="mt-1 text-xs text-amber-600">Headline must be at least 5 characters.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-rich-black/70">
                      Category Badges (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((c) => {
                        const isSelected = selectedCategories.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => toggleCategory(c)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border ${
                              isSelected
                                ? "bg-zru-green text-white border-zru-green shadow-sm"
                                : "bg-black/5 text-rich-black/60 border-black/10 hover:border-black/20"
                            }`}
                          >
                            {isSelected ? `✓ ${c}` : c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <ImagePicker
                    value={image}
                    onChange={setImage}
                    label="Hero Image"
                    hint="High-resolution landscape photo (~1920x1080)."
                  />

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={title.trim().length < 5}
                      className="inline-flex items-center gap-2 rounded-xl bg-zru-green px-6 py-3 font-heading text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:bg-green-800 disabled:opacity-40 cursor-pointer"
                    >
                      Next: Write Story <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Writing Body & Hook */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/70">
                      Story Excerpt & Hook (shown on news cards)
                    </label>
                    <textarea
                      rows={2}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="One or two sentences summarizing the story for the homepage grid."
                      className="w-full rounded-2xl border border-black/10 bg-white p-3.5 text-sm outline-none focus:border-zru-green shadow-sm"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-black/70">
                        Article Content
                      </label>
                      <span className="text-[11px] font-mono text-black/50">
                        {body.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                    <RichTextEditor
                      value={body}
                      onChange={setBody}
                      placeholder="Write your article here — headings, blockquotes, bold text and links supported."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-xl border border-black/15 bg-white px-5 py-3 font-heading text-xs font-black uppercase tracking-wider text-black/60 hover:bg-black/5 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="inline-flex items-center gap-2 rounded-xl bg-zru-green px-6 py-3 font-heading text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-green-800 transition-all cursor-pointer"
                      >
                        Next: Publish Details <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Publishing & Schedule */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/70">
                        Schedule Publication (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={publishAt}
                        onChange={(e) => setPublishAt(e.target.value)}
                        className="w-full rounded-2xl border border-black/10 bg-white p-3.5 text-sm font-mono outline-none focus:border-zru-green shadow-sm"
                      />
                      <p className="mt-1 text-[10px] text-black/40">Leave empty to publish immediately.</p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/70">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => {
                          setSlug(e.target.value);
                          setSlugTouched(true);
                        }}
                        placeholder="auto-generated from headline"
                        className="w-full rounded-2xl border border-black/10 bg-white p-3.5 text-sm font-mono outline-none focus:border-zru-green shadow-sm"
                      />
                      <p className="mt-1 text-[10px] text-black/40">
                        Live address: /media/{slug || slugify(title) || "..."}
                      </p>
                    </div>
                  </div>

                  {/* Readiness checklist */}
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                    <p className="mb-3 font-heading text-xs font-black uppercase tracking-wider text-rich-black">
                      Pre-Publish Quality Check
                    </p>
                    <ul className="space-y-2">
                      {reviewChecklist.map((c) => (
                        <li key={c.label} className="flex items-center gap-2.5 text-xs">
                          {c.ok ? (
                            <CheckCircle2 className="h-4 w-4 text-zru-green shrink-0" />
                          ) : (
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[9px] font-black text-amber-700">
                              !
                            </span>
                          )}
                          <span className={c.ok ? "font-medium text-black/80" : "font-bold text-amber-700"}>
                            {c.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="rounded-xl border border-black/15 bg-white px-5 py-3 font-heading text-xs font-black uppercase tracking-wider text-black/60 hover:bg-black/5 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => save("draft")}
                        className="rounded-xl bg-black/5 px-5 py-3 font-heading text-xs font-black uppercase tracking-wider text-black/70 hover:bg-black/10 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Save as Draft
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => save("in_review")}
                        className="rounded-xl bg-amber-500/10 px-5 py-3 font-heading text-xs font-black uppercase tracking-wider text-amber-700 hover:bg-amber-500/20 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Send for Review
                      </button>
                      <button
                        type="submit"
                        disabled={saving || !checklistComplete}
                        className="inline-flex items-center gap-2 rounded-xl bg-zru-green px-7 py-3 font-heading text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-green-800 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        {saving ? "Publishing..." : publishAt ? "Schedule Publish" : "Publish Now"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </CollapsibleSection>
    </>
  );
}
