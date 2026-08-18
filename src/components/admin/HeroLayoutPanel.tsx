"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, ArrowUp, ArrowDown, Eye, EyeOff, Save, LayoutGrid, Radio } from "lucide-react";
import { useToast } from "./ui/ToastProvider";
import ImagePicker, { toAssetUrl } from "./ui/ImagePicker";

interface HeroSlide {
  id: string | number;
  headline_line1: string;
  headline_line2: string;
  subtext: string;
  tag: string;
  context_pill: string;
  image: string;
  image_position: "center" | "top" | "bottom";
  cta1_label: string;
  cta1_href: string;
  cta2_label?: string;
  cta2_href?: string;
  is_active: boolean;
  sort: number;
}

interface TickerItem {
  id: string;
  title: string;
  tag: string;
}

const DEFAULT_IMAGE = "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp";

const TICKER_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// announcements.priority is an integer in Directus; public API sorts -priority
// descending, so bigger = more urgent.
const TAG_PRIORITY: Record<string, number> = {
  "BREAKING": 30,
  "LIVE MATCH": 20,
  "TICKETS": 10,
  "NOTICE": 10,
};

export default function HeroLayoutPanel({ initialSlides }: { initialSlides?: any[] }) {
  const { toast } = useToast();

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [tickers, setTickers] = useState<TickerItem[]>([]);
  const [newTickerText, setNewTickerText] = useState("");
  const [newTickerTag, setNewTickerTag] = useState<"BREAKING" | "LIVE MATCH" | "TICKETS" | "NOTICE">("LIVE MATCH");

  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSlides = async () => {
    try {
      const res = await fetch("/api/admin/directus?collection=hero_slides&sort=sort&limit=50");
      if (!res.ok) throw new Error("Failed to load hero slides");
      const json = await res.json();
      const rows: any[] = json.data || [];
      if (rows.length > 0) {
        setSlides(
          rows.map((s: any) => ({
            id: s.id,
            headline_line1: s.headline_line1 || "",
            headline_line2: s.headline_line2 || "",
            subtext: s.subtext || "",
            tag: s.tag || "ZRU",
            context_pill: s.context_pill || "",
            image: s.image || s.image_url || "",
            image_position: (s.image_position || "center") as HeroSlide["image_position"],
            cta1_label: s.cta1_label || "EXPLORE",
            cta1_href: s.cta1_href || "/",
            cta2_label: s.cta2_label || "",
            cta2_href: s.cta2_href || "",
            is_active: s.is_active !== false,
            sort: Number(s.sort || 0),
          }))
        );
        return;
      }
    } catch (err) {
      console.warn("Failed to load hero slides from CMS:", err);
    }
    // Fallback: server-provided props (or empty state)
    if (initialSlides && initialSlides.length > 0) {
      setSlides(
        initialSlides.map((s: any) => ({
          id: s.id,
          headline_line1: s.headline_line1 || "",
          headline_line2: s.headline_line2 || "",
          subtext: s.subtext || "",
          tag: s.tag || "ZRU",
          context_pill: s.context_pill || "",
          image: s.image || s.image_url || "",
          image_position: "center",
          cta1_label: s.cta1_label || "EXPLORE",
          cta1_href: s.cta1_href || "/",
          cta2_label: s.cta2_label || "",
          cta2_href: s.cta2_href || "",
          is_active: s.is_active !== false,
          sort: Number(s.sort || 0),
        }))
      );
    }
  };

  const loadTickers = async () => {
    try {
      const res = await fetch("/api/admin/directus?collection=announcements&limit=50");
      if (!res.ok) throw new Error("Failed to load ticker items");
      const json = await res.json();
      const rows: any[] = json.data || [];
      setTickers(
        rows
          .filter((a: any) => a.design_variant === "ticker")
          .map((a: any) => ({ id: String(a.id), title: a.title || "", tag: a.badge || "NOTICE" }))
      );
    } catch (err) {
      console.warn("Failed to load ticker items from CMS:", err);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadSlides(), loadTickers()]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleSlide = async (id: string | number) => {
    const slide = slides.find((s) => s.id === id);
    if (!slide) return;
    const next = !slide.is_active;
    // Optimistic update
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: next } : s)));
    try {
      const res = await fetch("/api/admin/directus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "hero_slides", id, data: { is_active: next } }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Update failed");
      toast(next ? "Slide is now visible on the homepage." : "Slide hidden from the homepage.");
    } catch (err) {
      setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: slide.is_active } : s)));
      toast(`Failed to update slide: ${err instanceof Error ? err.message : String(err)}`, "error");
    }
  };

  const handleDeleteSlide = async (id: string | number) => {
    if (slides.length <= 1) {
      toast("You must keep at least one hero slide.", "error");
      return;
    }
    try {
      const res = await fetch("/api/admin/directus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "hero_slides", id }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Delete failed");
      setSlides((prev) => prev.filter((s) => s.id !== id));
      toast("Slide deleted from the homepage.");
    } catch (err) {
      toast(`Failed to delete slide: ${err instanceof Error ? err.message : String(err)}`, "error");
    }
  };

  const handleMoveSlide = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const next = [...slides];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    next.forEach((s, idx) => { s.sort = idx + 1; });

    const prev = slides;
    setSlides(next);
    try {
      // Persist the new sort order for both moved slides (Directus sorts by `sort`)
      for (const slide of [next[index], next[targetIndex]]) {
        const res = await fetch("/api/admin/directus", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collection: "hero_slides", id: slide.id, data: { sort: slide.sort } }),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Reorder failed");
      }
      toast("Slide order saved.");
    } catch (err) {
      setSlides(prev);
      toast(`Failed to reorder slides: ${err instanceof Error ? err.message : String(err)}`, "error");
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    setSaving(true);
    try {
      const payload = {
        headline_line1: editingSlide.headline_line1 || "NEW HEADLINE",
        headline_line2: editingSlide.headline_line2 || "",
        subtext: editingSlide.subtext || "",
        tag: editingSlide.tag || "ZRU",
        context_pill: editingSlide.context_pill || "",
        image: editingSlide.image || DEFAULT_IMAGE,
        image_position: editingSlide.image_position || "center",
        alignment: "left",
        cta1_label: editingSlide.cta1_label || "EXPLORE",
        cta1_href: editingSlide.cta1_href || "/",
        cta2_label: editingSlide.cta2_label || "",
        cta2_href: editingSlide.cta2_href || "",
      };

      if (editingSlide.id) {
        const res = await fetch("/api/admin/directus", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collection: "hero_slides", id: editingSlide.id, data: payload }),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Save failed");
        setSlides((prev) =>
          prev.map((s) => (s.id === editingSlide.id ? ({ ...s, ...payload, id: s.id } as HeroSlide) : s))
        );
        toast("Hero slide saved to the live homepage.");
      } else {
        const res = await fetch("/api/admin/directus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            collection: "hero_slides",
            data: { ...payload, is_active: true, sort: slides.length + 1 },
          }),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Create failed");
        const created = (await res.json()).data;
        setSlides((prev) => [
          ...prev,
          {
            id: created.id,
            ...payload,
            is_active: true,
            sort: slides.length + 1,
          } as HeroSlide,
        ]);
        toast("New hero slide published to the homepage.");
      }
      setEditingSlide(null);
    } catch (err) {
      toast(`Failed to save slide: ${err instanceof Error ? err.message : String(err)}`, "error");
    } finally {
      setSaving(false);
    }
  };

  // Marquee Ticker Actions — writes real announcements (design_variant = ticker)
  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerText.trim()) return;
    setSaving(true);
    const now = new Date();
    try {
      const res = await fetch("/api/admin/directus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "announcements",
          data: {
            title: newTickerText.trim(),
            slug: `ticker-${Date.now()}`,
            body: "",
            design_variant: "ticker",
            priority: TAG_PRIORITY[newTickerTag] || 10,
            starts_at: now.toISOString(),
            ends_at: new Date(now.getTime() + TICKER_TTL_MS).toISOString(),
            is_enabled: true,
            status: "published",
            badge: newTickerTag,
            segment: "general",
            scope: ["global"],
          },
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Publish failed");
      const created = (await res.json()).data;
      setTickers((prev) => [
        { id: String(created.id || `tk-${Date.now()}`), title: newTickerText.trim(), tag: newTickerTag },
        ...prev,
      ]);
      setNewTickerText("");
      toast("Ticker notice published to the live marquee.");
    } catch (err) {
      toast(`Broadcast failed: ${err instanceof Error ? err.message : String(err)}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTicker = async (id: string) => {
    try {
      const res = await fetch("/api/admin/directus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "announcements", id }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Delete failed");
      setTickers((prev) => prev.filter((t) => t.id !== id));
      toast("Ticker item removed from the live marquee.");
    } catch (err) {
      toast(`Failed to remove ticker item: ${err instanceof Error ? err.message : String(err)}`, "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-24 bg-black/5 rounded-2xl" />
        <div className="animate-pulse h-64 bg-black/5 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ⚡ BREAKING MATCHDAY MARQUEE TICKER MANAGER */}
      <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-4">
          <div>
            <h2 className="text-sm font-black font-heading uppercase tracking-wider text-rich-black flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#006B3F] animate-pulse" />
              <span>Breaking Matchday Marquee Ticker</span>
            </h2>
            <p className="text-xs text-black/50 mt-0.5">
              Broadcast urgent matchday notices, live test match scores, and ticket alerts to the homepage ribbon. Items stay live for 7 days.
            </p>
          </div>
        </div>

        {/* Quick entry form */}
        <form onSubmit={handleAddTicker} className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <select
            value={newTickerTag}
            onChange={(e) => setNewTickerTag(e.target.value as any)}
            className="w-full sm:w-40 rounded-lg border border-black/10 bg-white p-2 text-xs font-bold font-mono"
          >
            <option value="LIVE MATCH">🔴 LIVE MATCH</option>
            <option value="BREAKING">⚡ BREAKING</option>
            <option value="TICKETS">🎟️ TICKETS</option>
            <option value="NOTICE">📢 NOTICE</option>
          </select>
          <input
            type="text"
            required
            value={newTickerText}
            onChange={(e) => setNewTickerText(e.target.value)}
            placeholder="e.g. Sables vs Uganda kickoff delayed to 15:30 CAT due to pitch preparation..."
            className="flex-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs focus:outline-none focus:border-zru-green"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto rounded-lg bg-[#006B3F] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-sm shrink-0 disabled:opacity-50 cursor-pointer"
          >
            Push to Marquee
          </button>
        </form>

        {/* Active ticker list */}
        {tickers.length === 0 ? (
          <div className="text-[11px] text-black/30 text-center py-6 border border-dashed border-black/5 rounded-xl">
            No live ticker items. Publish matchday notices above.
          </div>
        ) : (
          <div className="divide-y divide-black/5 border border-black/5 rounded-xl overflow-hidden">
            {tickers.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-black/[0.01]">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-black font-mono bg-zru-green/10 text-zru-green border border-zru-green/20">
                    {t.tag}
                  </span>
                  <span className="text-xs text-black/80 truncate font-medium">{t.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteTicker(t.id)}
                  className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 font-bold ml-2 shrink-0 cursor-pointer"
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🖼️ HERO SLIDES CAROUSEL MANAGER */}
      <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-6">
          <div>
            <h2 className="text-sm font-black font-heading uppercase tracking-wider text-rich-black flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[#006B3F]" />
              <span>Homepage Hero Carousel</span>
            </h2>
            <p className="text-xs text-black/50 mt-0.5">
              Reorder, edit, and create hero banners promoting Sables test matches and campaigns.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditingSlide({ image_position: "center", cta1_label: "EXPLORE", cta1_href: "/" })}
            className="flex items-center gap-1.5 rounded-lg bg-zru-green px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Slide
          </button>
        </div>

        {/* Slide List */}
        {slides.length === 0 ? (
          <div className="text-[11px] text-black/30 text-center py-10 border border-dashed border-black/5 rounded-xl">
            No hero slides yet. Add your first slide above.
          </div>
        ) : (
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  slide.is_active ? "bg-white border-black/10 shadow-sm" : "bg-black/5 border-black/5 opacity-60"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-24 h-16 rounded-lg bg-black/10 overflow-hidden relative shrink-0 border border-black/10">
                    {toAssetUrl(slide.image) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={toAssetUrl(slide.image)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/20 text-[9px] font-mono">
                        NO IMAGE
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white font-mono text-[9px] px-1 rounded">
                      #{slide.sort}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zru-green bg-zru-green/10 px-2 py-0.5 rounded">
                        {slide.tag}
                      </span>
                      <h3 className="font-heading font-black text-sm text-rich-black truncate">
                        {slide.headline_line1} {slide.headline_line2}
                      </h3>
                    </div>
                    <p className="text-xs text-black/60 truncate mt-0.5 max-w-xl">{slide.subtext}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveSlide(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-black/10 hover:bg-black/5 text-black/60 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveSlide(index, "down")}
                    disabled={index === slides.length - 1}
                    className="p-1.5 rounded-lg border border-black/10 hover:bg-black/5 text-black/60 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSlide(slide.id)}
                    className={`p-1.5 rounded-lg border border-black/10 hover:bg-black/5 cursor-pointer ${
                      slide.is_active ? "text-zru-green" : "text-black/40"
                    }`}
                    title={slide.is_active ? "Hide Slide" : "Show Slide"}
                  >
                    {slide.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSlide(slide)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-black/10 hover:bg-black/5 text-rich-black cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                    title="Delete Slide"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL WITH DIRECTUS ASSET DROPZONE */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-black/10 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-4">
              <h3 className="font-heading font-black text-base uppercase text-rich-black">
                {editingSlide.id ? "Edit Hero Slide" : "Create Hero Slide"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="text-black/40 hover:text-black text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Headline Line 1</label>
                  <input
                    type="text"
                    required
                    value={editingSlide.headline_line1 || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, headline_line1: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Headline Line 2</label>
                  <input
                    type="text"
                    value={editingSlide.headline_line2 || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, headline_line2: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Subtext / Summary</label>
                <textarea
                  value={editingSlide.subtext || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtext: e.target.value })}
                  rows={2}
                  className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Tag / Category Badge</label>
                  <input
                    type="text"
                    value={editingSlide.tag || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, tag: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Context Pill</label>
                  <input
                    type="text"
                    value={editingSlide.context_pill || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, context_pill: e.target.value })}
                    placeholder="e.g. ROAD TO AUSTRALIA 2027"
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Focal Position</label>
                  <select
                    value={editingSlide.image_position || "center"}
                    onChange={(e) => setEditingSlide({ ...editingSlide, image_position: e.target.value as "center" | "top" | "bottom" })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  >
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <p className="text-[10px] text-black/40 pb-2">
                    Slides render in `sort` order. Hidden (`is_active = false`) slides are skipped on the homepage.
                  </p>
                </div>
              </div>

              {/* Directus Image Dropzone */}
              <div>
                <ImagePicker
                  label="Hero Banner Image Asset"
                  value={editingSlide.image || ""}
                  onChange={(val) => setEditingSlide({ ...editingSlide, image: val })}
                  hint="Drag & drop match photo or paste a Directus asset URL / local /images path"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">CTA 1 Button Label</label>
                  <input
                    type="text"
                    value={editingSlide.cta1_label || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta1_label: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">CTA 1 Link Target</label>
                  <input
                    type="text"
                    value={editingSlide.cta1_href || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta1_href: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">CTA 2 Button Label</label>
                  <input
                    type="text"
                    value={editingSlide.cta2_label || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta2_label: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">CTA 2 Link Target</label>
                  <input
                    type="text"
                    value={editingSlide.cta2_href || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta2_href: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-black/10 hover:bg-black/5 text-rich-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-lg bg-zru-green px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}