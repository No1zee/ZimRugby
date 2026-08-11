"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Newspaper, Send } from "lucide-react";
import ImagePicker from "./ui/ImagePicker";
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
  const [saving, setSaving] = useState(false);

  const hasInput = title.trim() !== "" || excerpt.trim() !== "" || body.trim() !== "" || slug.trim() !== "";

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
            date: new Date().toISOString(),
          },
        }),
      });
      if (res.ok) {
        toast(saveStatus === "published" ? `'${title}' is now live on the website.` : `'${title}' saved as a draft.`);
        setTitle(""); setExcerpt(""); setBody(""); setImage(""); setSlug("");
        setSlugTouched(false); setStatus("draft");
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

  return (
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
          <RichTextEditor value={body} onChange={setBody} placeholder="Write your article here â€” bold, headings, lists and links supported." />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-black/60">Web address (slug)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
              placeholder="auto-generated from headline"
              className="w-full rounded-lg border border-black/10 bg-white p-2.5 text-sm"
            />
            <p className="mt-0.5 text-[10px] text-black/40">Leave blank to auto-generate. Live link: /media/{slug || slugify(title) || "â€¦"}</p>
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
          <ImagePicker value={image} onChange={setImage} label="Hero image" hint="Recommended: landscape, ~1200px wide." />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-zru-green px-6 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {saving ? "Savingâ€¦" : status === "published" ? "Publish article" : "Save as draft"}
          </button>
          {status === "draft" && (
            <button
              type="button"
              disabled={saving}
              onClick={() => setStatus("published")}
              className="rounded-lg bg-black/5 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/10 disabled:opacity-50"
            >
              Switch to publish
            </button>
          )}
        </div>
      </form>
    </CollapsibleSection>
  );
}
