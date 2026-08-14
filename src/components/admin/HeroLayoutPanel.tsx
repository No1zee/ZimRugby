"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, ArrowUp, ArrowDown, Eye, EyeOff, Save, Image as ImageIcon, Video, LayoutGrid, Zap, Radio, Bell } from "lucide-react";
import { useToast } from "./ui/ToastProvider";
import { useRouter } from "next/navigation";
import ImagePicker from "./ui/ImagePicker";

interface HeroSlide {
  id: string | number;
  headline_line1: string;
  headline_line2: string;
  subtext: string;
  tag: string;
  image_url: string;
  video_url?: string;
  imagePosition: "center" | "top" | "bottom";
  cta1_label: string;
  cta1_href: string;
  cta2_label?: string;
  cta2_href?: string;
  is_active: boolean;
  sort: number;
}

interface MarqueeTickerItem {
  id: string;
  text: string;
  tag: "BREAKING" | "LIVE MATCH" | "TICKETS" | "NOTICE";
  active: boolean;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "sable-world-cup",
    headline_line1: "ROAD TO AUSTRALIA",
    headline_line2: "RUGBY WORLD CUP 2027",
    subtext: "Support the Zimbabwe Sables as they clash with Africa's elite in the qualification pathway.",
    tag: "ROAD TO 2027",
    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    imagePosition: "center",
    cta1_label: "CAMPAIGN HUB",
    cta1_href: "/world-cup-campaign",
    cta2_label: "GET TICKETS",
    cta2_href: "/tickets",
    is_active: true,
    sort: 1,
  },
  {
    id: "cheetahs-7s",
    headline_line1: "ZIMBABWE CHEETAHS",
    headline_line2: "WORLD SEVENS CHALLENGER",
    subtext: "High-octane rugby sevens action live from Dubai & Montevideo.",
    tag: "SEVENS",
    image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop",
    imagePosition: "center",
    cta1_label: "SQUAD & FIXTURES",
    cta1_href: "/teams",
    is_active: true,
    sort: 2,
  },
];

const DEFAULT_TICKERS: MarqueeTickerItem[] = [
  { id: "tk-1", text: "Sables vs Kenya Simbas: Africa Cup Final at Harare Sports Club · Kickoff 15:00 CAT", tag: "LIVE MATCH", active: true },
  { id: "tk-2", text: "Matchday Grandstand & VIP Hospitality tickets are 85% sold out on Ticketmaster", tag: "TICKETS", active: true },
  { id: "tk-3", text: "ZRU announces 32-player travelling squad for the November European Tour", tag: "BREAKING", active: true },
];

export default function HeroLayoutPanel({ initialSlides }: { initialSlides?: any[] }) {
  const { toast } = useToast();
  const router = useRouter();

  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [tickers, setTickers] = useState<MarqueeTickerItem[]>(DEFAULT_TICKERS);
  const [newTickerText, setNewTickerText] = useState("");
  const [newTickerTag, setNewTickerTag] = useState<"BREAKING" | "LIVE MATCH" | "TICKETS" | "NOTICE">("LIVE MATCH");

  const [layoutToggles, setLayoutToggles] = useState<Record<string, boolean>>({
    hero: true,
    ticker: true,
    roadToWorldCup: true,
    hubGrid: true,
    sponsors: true,
  });

  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync initial slides from Directus if provided
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      const mapped = initialSlides.map((slide: any) => ({
        id: slide.id,
        headline_line1: slide.headline_line1 || "",
        headline_line2: slide.headline_line2 || "",
        subtext: slide.subtext || "",
        tag: slide.tag || "PROMO",
        image_url: slide.image_url || "",
        video_url: slide.video_url || "",
        imagePosition: slide.imagePosition || "center",
        cta1_label: slide.cta1_label || "LEARN MORE",
        cta1_href: slide.cta1_href || "#",
        cta2_label: slide.cta2_label || "",
        cta2_href: slide.cta2_href || "",
        is_active: slide.is_active !== undefined ? slide.is_active : true,
        sort: slide.sort || 1,
      }));
      setSlides(mapped);
    }
  }, [initialSlides]);

  const handleToggleSlide = (id: string | number) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
    toast("Slide visibility updated.");
  };

  const handleDeleteSlide = (id: string | number) => {
    if (slides.length <= 1) {
      toast("You must keep at least one hero slide.", "error");
      return;
    }
    setSlides((prev) => prev.filter((s) => s.id !== id));
    toast("Slide removed.");
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const newSlides = [...slides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;

    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    newSlides.forEach((s, idx) => {
      s.sort = idx + 1;
    });

    setSlides(newSlides);
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    setSaving(true);
    try {
      if (editingSlide.id) {
        // Update existing
        setSlides((prev) =>
          prev.map((s) => (s.id === editingSlide.id ? ({ ...s, ...editingSlide } as HeroSlide) : s))
        );
      } else {
        // Create new
        const newSlide: HeroSlide = {
          id: `slide-${Date.now()}`,
          headline_line1: editingSlide.headline_line1 || "NEW HEADLINE",
          headline_line2: editingSlide.headline_line2 || "",
          subtext: editingSlide.subtext || "",
          tag: editingSlide.tag || "ZRU",
          image_url: editingSlide.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
          imagePosition: editingSlide.imagePosition || "center",
          cta1_label: editingSlide.cta1_label || "EXPLORE",
          cta1_href: editingSlide.cta1_href || "#",
          cta2_label: editingSlide.cta2_label || "",
          cta2_href: editingSlide.cta2_href || "",
          is_active: true,
          sort: slides.length + 1,
        };
        setSlides((prev) => [...prev, newSlide]);
      }

      toast("Hero carousel updated!");
      setEditingSlide(null);
    } catch {
      toast("Failed to save slide.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Marquee Ticker Actions
  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerText.trim()) return;
    const item: MarqueeTickerItem = {
      id: `tk-${Date.now()}`,
      text: newTickerText.trim(),
      tag: newTickerTag,
      active: true,
    };
    setTickers((prev) => [item, ...prev]);
    setNewTickerText("");
    toast("Breaking ticker notice published to live site!");
  };

  const handleDeleteTicker = (id: string) => {
    setTickers((prev) => prev.filter((t) => t.id !== id));
    toast("Ticker item removed.");
  };

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
              Broadcast urgent matchday notices, live test match scores, and ticket alerts across the homepage ribbon.
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
            className="w-full sm:w-auto rounded-lg bg-[#006B3F] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-sm shrink-0 cursor-pointer"
          >
            Push to Marquee
          </button>
        </form>

        {/* Active ticker list */}
        <div className="divide-y divide-black/5 border border-black/5 rounded-xl overflow-hidden">
          {tickers.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 bg-black/[0.01]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-black font-mono bg-zru-green/10 text-zru-green border border-zru-green/20">
                  {t.tag}
                </span>
                <span className="text-xs text-black/80 truncate font-medium">{t.text}</span>
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
            onClick={() => setEditingSlide({})}
            className="flex items-center gap-1.5 rounded-lg bg-zru-green px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Slide
          </button>
        </div>

        {/* Slide List */}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
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
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Focal Position</label>
                  <select
                    value={editingSlide.imagePosition || "center"}
                    onChange={(e) => setEditingSlide({ ...editingSlide, imagePosition: e.target.value as "center" | "top" | "bottom" })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  >
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
              </div>

              {/* Directus Image Dropzone */}
              <div>
                <ImagePicker
                  label="Hero Banner Image Asset"
                  value={editingSlide.image_url || ""}
                  onChange={(val) => setEditingSlide({ ...editingSlide, image_url: val })}
                  hint="Drag & drop match photo or paste Directus asset URL"
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
