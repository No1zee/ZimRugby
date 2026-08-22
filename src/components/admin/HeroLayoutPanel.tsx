"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Save, 
  LayoutGrid, 
  Radio, 
  ExternalLink,
  Pencil,
  ArrowRight
} from "lucide-react";
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
        headline_line1: editingSlide.headline_line1 || "",
        headline_line2: editingSlide.headline_line2 || "",
        subtext: editingSlide.subtext || "",
        tag: editingSlide.tag || "",
        context_pill: editingSlide.context_pill || "",
        image: editingSlide.image || DEFAULT_IMAGE,
        image_position: editingSlide.image_position || "center",
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
      setSaving(false)
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

  const getPositionClass = (pos?: string) => {
    if (pos === "top") return "object-top";
    if (pos === "bottom") return "object-bottom";
    return "object-center";
  };

  return (
    <div className="space-y-8">
      {/* ALERT BREAKING MATCHDAY MARQUEE TICKER MANAGER */}
      <div className="bg-white border border-[#eae8de] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eae8de] pb-4 mb-4">
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
            className="w-full sm:w-40 rounded-lg border border-[#eae8de] bg-white p-2 text-xs font-bold font-mono"
          >
            <option value="LIVE MATCH">LIVE LIVE MATCH</option>
            <option value="BREAKING">ALERT BREAKING</option>
            <option value="TICKETS">TICKETS TICKETS</option>
            <option value="NOTICE">NOTICE NOTICE</option>
          </select>
          <input
            type="text"
            required
            value={newTickerText}
            onChange={(e) => setNewTickerText(e.target.value)}
            placeholder="e.g. Sables vs Uganda kickoff delayed to 15:30 CAT due to pitch preparation..."
            className="flex-1 w-full rounded-lg border border-[#eae8de] bg-white px-3 py-2 text-xs focus:outline-none focus:border-zru-green"
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
          <div className="text-[11px] text-black/30 text-center py-6 border border-dashed border-[#eae8de] rounded-xl">
            No live ticker items. Publish matchday notices above.
          </div>
        ) : (
          <div className="divide-y divide-black/5 border border-[#eae8de] rounded-xl overflow-hidden">
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
                  âœ• Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ðŸ–¼ï¸ HERO SLIDES CAROUSEL MANAGER */}
      {/* 🖼️ HOMEPAGE HERO CAROUSEL MANAGER */}
      <div className="bg-white border border-[#eae8de] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eae8de] pb-4 mb-6">
          <div>
            <h2 className="text-sm font-black font-heading uppercase tracking-wider text-rich-black flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-zru-green" />
              <span>Homepage Hero Carousel</span>
            </h2>
            <p className="text-xs text-black/50 mt-0.5">
              Live-preview, reorder, edit, and create full cinematic hero banners for the public homepage.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#eae8de] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-rich-black hover:bg-black/5 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-black/60" />
              <span>View Live Site</span>
            </a>
            <button
              type="button"
              onClick={() => setEditingSlide({ image_position: "center", cta1_label: "EXPLORE", cta1_href: "/", tag: "ZRU", is_active: true })}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zru-green px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Slide</span>
            </button>
          </div>
        </div>

        {/* Cinematic Slide Cards List */}
        {slides.length === 0 ? (
          <div className="text-[11px] text-black/30 text-center py-12 border border-dashed border-[#eae8de] rounded-2xl">
            No hero slides yet. Click &quot;Add New Slide&quot; above to create your first banner.
          </div>
        ) : (
          <div className="space-y-6">
            {slides.map((slide, index) => {
              const bgUrl = toAssetUrl(slide.image) || DEFAULT_IMAGE;
              const posClass = getPositionClass(slide.image_position);

              return (
                <div
                  key={slide.id}
                  onClick={() => setEditingSlide(slide)}
                  className={`group relative w-full rounded-2xl overflow-hidden bg-rich-black border transition-all duration-300 min-h-[240px] sm:min-h-[280px] flex flex-col justify-between p-5 sm:p-7 select-none cursor-pointer shadow-md ${
                    slide.is_active 
                      ? "border-[#eae8de] hover:border-zru-green/60 hover:shadow-xl" 
                      : "border-[#eae8de] opacity-65 grayscale-30"
                  }`}
                >
                  {/* Background Image with Focal Alignment */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bgUrl}
                      alt=""
                      className={`w-full h-full object-cover ${posClass} transition-transform duration-700 ease-out group-hover:scale-105`}
                    />
                  </div>

                  {/* Gradient Scrim & Vignette Overlays */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/95 via-black/70 to-black/30 pointer-events-none" />
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                  {/* Top Bar: Status Badges & Glass Floating Toolbar */}
                  <div className="relative z-20 flex items-start justify-between gap-3 w-full">
                    {/* Order & Status Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black font-mono uppercase tracking-wider backdrop-blur-md border ${
                        slide.is_active
                          ? "bg-zru-green/20 border-zru-green/40 text-zru-green"
                          : "bg-black/60 border-white/20 text-white/50"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${slide.is_active ? "bg-zru-green animate-pulse" : "bg-white/40"}`} />
                        <span>#{slide.sort || index + 1} {slide.is_active ? "LIVE" : "HIDDEN"}</span>
                      </span>

                      {slide.context_pill && (
                        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black font-mono uppercase tracking-wider bg-white/10 border border-white/15 text-white/80 backdrop-blur-md">
                          {slide.context_pill}
                        </span>
                      )}
                    </div>

                    {/* Glass Floating Action Toolbar */}
                    <div 
                      onClick={(e) => e.stopPropagation()} 
                      className="bg-black/75 backdrop-blur-md border border-white/15 rounded-xl p-1 flex items-center gap-1 shadow-lg"
                    >
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 disabled:opacity-25 transition-colors cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(index, "down")}
                        disabled={index === slides.length - 1}
                        className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 disabled:opacity-25 transition-colors cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleSlide(slide.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          slide.is_active ? "text-zru-green hover:bg-zru-green/20" : "text-white/40 hover:bg-white/15"
                        }`}
                        title={slide.is_active ? "Hide Slide on Homepage" : "Show Slide on Homepage"}
                      >
                        {slide.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-white/40" />}
                      </button>
                      <div className="w-[1px] h-3.5 bg-white/15 mx-0.5" />
                      <button
                        type="button"
                        onClick={() => setEditingSlide(slide)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider text-white bg-white/10 hover:bg-zru-green hover:text-white transition-colors cursor-pointer"
                        title="Edit Slide Content"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Content: Authentic Live Hero Typography & CTA Preview */}
                  <div className="relative z-20 space-y-2 mt-6 max-w-3xl">
                    {/* Eyebrow Tag */}
                    <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-zru-green drop-shadow-md">
                      {slide.tag || "ZRU"}
                    </div>

                    {/* Dual-Tone Headline */}
                    <h3 className="font-heading uppercase tracking-tight leading-[0.95] drop-shadow-2xl">
                      <span className="block text-white font-black text-xl sm:text-2xl md:text-3xl">
                        {slide.headline_line1 || "UNTITLED SLIDE"}
                      </span>
                      {slide.headline_line2 && (
                        <span className="block text-zru-green font-black text-xl sm:text-2xl md:text-3xl">
                          {slide.headline_line2}
                        </span>
                      )}
                    </h3>

                    {/* Subtext */}
                    {slide.subtext && (
                      <p className="text-white/75 text-xs sm:text-sm font-normal max-w-xl line-clamp-2 leading-relaxed drop-shadow">
                        {slide.subtext}
                      </p>
                    )}

                    {/* Slanted CTA Button Preview */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <span className="inline-flex items-center gap-2 px-5 py-2 bg-white text-rich-black font-subheading font-black text-[11px] uppercase tracking-widest clip-slanted shadow-md group-hover:bg-zru-green group-hover:text-white transition-colors">
                        <span>{slide.cta1_label || "EXPLORE"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {slide.cta2_label && (
                        <span className="inline-flex items-center gap-2 px-5 py-2 border-2 border-white/25 text-white font-subheading font-black text-[11px] uppercase tracking-widest clip-slanted backdrop-blur-xs">
                          <span>{slide.cta2_label}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🛠️ SLIDE EDIT / CREATE MODAL WITH REAL-TIME LIVE PREVIEW */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#eae8de] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#eae8de] pb-4">
              <div>
                <h3 className="font-heading font-black uppercase text-base text-rich-black">
                  {editingSlide.id ? "Edit Homepage Hero Slide" : "Create New Hero Slide"}
                </h3>
                <p className="text-xs text-black/50">
                  Preview in real time and modify banner visuals, headline typography, and action links.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="text-black/40 hover:text-rich-black p-1 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 🌟 REAL-TIME LIVE PREVIEW STAGE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zru-green">
                  ● Real-Time Live Preview
                </span>
                <span className="text-[10px] font-mono text-black/40">
                  Exact Homepage Presentation
                </span>
              </div>
              <div className="relative w-full rounded-xl overflow-hidden bg-rich-black border border-black/20 min-h-[220px] flex flex-col justify-end p-5 select-none shadow-inner">
                {/* Background Image Preview */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={toAssetUrl(editingSlide.image) || DEFAULT_IMAGE}
                    alt=""
                    className={`w-full h-full object-cover ${getPositionClass(editingSlide.image_position)} transition-all duration-300`}
                  />
                </div>
                {/* Scrims */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/95 via-black/70 to-black/30 pointer-events-none" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                {/* Content */}
                <div className="relative z-20 space-y-1.5 max-w-xl">
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-zru-green drop-shadow">
                    {editingSlide.tag || "ZRU"}
                  </div>
                  <h4 className="font-heading uppercase tracking-tight leading-[0.95] drop-shadow-2xl">
                    <span className="block text-white font-black text-lg sm:text-xl">
                      {editingSlide.headline_line1 || "HEADLINE LINE 1"}
                    </span>
                    {editingSlide.headline_line2 && (
                      <span className="block text-zru-green font-black text-lg sm:text-xl">
                        {editingSlide.headline_line2}
                      </span>
                    )}
                  </h4>
                  {editingSlide.subtext && (
                    <p className="text-white/75 text-xs font-normal line-clamp-2 leading-relaxed drop-shadow">
                      {editingSlide.subtext}
                    </p>
                  )}
                  <div className="flex items-center gap-2 pt-1.5">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-rich-black font-subheading font-black text-[10px] uppercase tracking-widest clip-slanted shadow-sm">
                      <span>{editingSlide.cta1_label || "EXPLORE"}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                    {editingSlide.cta2_label && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-white/30 text-white font-subheading font-black text-[10px] uppercase tracking-widest clip-slanted">
                        <span>{editingSlide.cta2_label}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">
                    Headline Line 1 (White Title)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.headline_line1 || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, headline_line1: e.target.value })}
                    placeholder="e.g. LADY SABLES"
                    className="w-full bg-black/5 border border-[#eae8de] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">
                    Headline Line 2 (Green Highlight)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.headline_line2 || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, headline_line2: e.target.value })}
                    placeholder="e.g. READY FOR CAMEROON"
                    className="w-full bg-black/5 border border-[#eae8de] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">
                  Subtext / Summary Description
                </label>
                <textarea
                  value={editingSlide.subtext || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtext: e.target.value })}
                  rows={2}
                  placeholder="e.g. National women's squad kicks off Africa Cup campaign in Harare..."
                  className="w-full bg-black/5 border border-[#eae8de] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">
                    Tag / Category Eyebrow
                  </label>
                  <input
                    type="text"
                    value={editingSlide.tag || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, tag: e.target.value })}
                    placeholder="e.g. LADY SABLES, DEVELOPMENT, SABLES"
                    className="w-full bg-black/5 border border-[#eae8de] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">
                    Context Pill (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.context_pill || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, context_pill: e.target.value })}
                    placeholder="e.g. ROAD TO AUSTRALIA 2027"
                    className="w-full bg-black/5 border border-[#eae8de] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">
                    Focal Image Alignment
                  </label>
                  <select
                    value={editingSlide.image_position || "center"}
                    onChange={(e) => setEditingSlide({ ...editingSlide, image_position: e.target.value as "center" | "top" | "bottom" })}
                    className="w-full bg-black/5 border border-[#eae8de] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  >
                    <option value="center">Center (Default)</option>
                    <option value="top">Top Focus</option>
                    <option value="bottom">Bottom Focus</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <p className="text-[10px] text-black/40 pb-2">
                    Slides render in numerical order. Hidden slides (`is_active = false`) are automatically bypassed on the live site.
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={editingSlide.cta1_label || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta1_label: e.target.value })}
                    placeholder="EXPLORE"
                    className="w-full bg-black/5 border border-[#eae8de] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">
                    Primary CTA Link Target
                  </label>
                  <input
                    type="text"
                    value={editingSlide.cta1_href || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta1_href: e.target.value })}
                    placeholder="/fixtures or /media"
                    className="w-full bg-black/5 border border-[#eae8de] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">
                    Secondary CTA Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.cta2_label || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta2_label: e.target.value })}
                    placeholder="e.g. MATCH HIGHLIGHTS"
                    className="w-full bg-black/5 border border-[#eae8de] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">
                    Secondary CTA Link Target
                  </label>
                  <input
                    type="text"
                    value={editingSlide.cta2_href || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta2_href: e.target.value })}
                    placeholder="/tv"
                    className="w-full bg-black/5 border border-[#eae8de] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#eae8de]">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-[#eae8de] hover:bg-black/5 text-rich-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-lg bg-zru-green px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Hero Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}