"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Newspaper, Send } from "lucide-react";
import ImagePicker from "./ui/ImagePicker";
import RichTextEditor from "./ui/RichTextEditor";

const CATEGORIES = ["NEWS", "PRESS RELEASE", "SABLES", "LADY SABLES", "JUNIORS", "CLUB RUGBY", "ANNOUNCEMENT", "SPONSORSHIP"];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ArticleComposer() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("NEWS");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function handleSubmit(e: React.FormEvent, saveStatus: string) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
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
        setMessage({
          text: saveStatus === "published" ? `'${title}' is now live on the website.` : `'${title}' saved as a draft.`,
          ok: true,
        });
        setTitle(""); setExcerpt(""); setBody(""); setImage(""); setSlug("");
        setSlugTouched(false); setStatus("draft");
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        setMessage({ text: `Failed to save: ${err?.error || res.statusText}`, ok: false });
      }
    } catch (err) {
      setMessage({ text: `Error: ${err instanceof Error ? err.message : err}`, ok: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
        <Newspaper className="h-5 w-5 text-zru-green" /> Write a news article
      </h2>
      <p className="mt-1 text-xs text-black/50">
        Articles appear in the homepage Latest News panel and the media archive. Add a hero image and write the body — formatting is done for you.
      </p>

      {message && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-xl border p-3 text-xs font-bold ${
            message.ok
              ? "border-zru-green/40 bg-zru-green/10 text-zru-green"
              : "border-red-400 bg-red-50 text-red-700"
          }`}
        >
          {message.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, status)} className="mt-4 space-y-4">
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
            <p className="mt-0.5 text-[10px] text-black/40">Leave blank to auto-generate. Live link: /media/{slug || slugify(title) || "…"}</p>
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
            {saving ? "Saving…" : status === "published" ? "Publish article" : "Save as draft"}
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
    </div>
  );
}
