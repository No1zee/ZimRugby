"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, ArrowUp, ArrowDown, Eye, EyeOff, Save, Image as ImageIcon, Video, LayoutGrid } from "lucide-react";
import { useToast } from "./ui/ToastProvider";
import { useRouter } from "next/navigation";

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

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 1,
    headline_line1: "THE SABLES",
    headline_line2: "ROAD TO AUSTRALIA 2027",
    subtext: "Support Zimbabwe's national rugby team in their quest for World Cup qualification.",
    tag: "MEN'S NATIONAL TEAM",
    image_url: "/images/sables-hero.jpg",
    imagePosition: "center",
    cta1_label: "SUPPORT THE CAMPAIGN",
    cta1_href: "/world-cup-campaign",
    cta2_label: "MATCH CENTRE",
    cta2_href: "/match-centre",
    is_active: true,
    sort: 1,
  },
  {
    id: 2,
    headline_line1: "LADY SABLES",
    headline_line2: "AFRICA CUP CAMPAIGN",
    subtext: "Following the women's national team journey across continental tournaments.",
    tag: "WOMEN'S NATIONAL TEAM",
    image_url: "/images/lady-sables-hero.jpg",
    imagePosition: "center",
    cta1_label: "VIEW FIXTURES",
    cta1_href: "/teams/lady-sables",
    is_active: true,
    sort: 2,
  }
];

export default function HeroLayoutPanel({ initialSlides }: { initialSlides?: any[] }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [activeSections, setActiveSections] = useState({
    spotlight: true,
    news: true,
    calendar: true,
    videoHub: true,
    sponsors: true,
  });

  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync initial slides from Directus
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      const mapped = initialSlides.map((slide: any) => ({
        id: slide.id,
        headline_line1: slide.headline_line1 || "",
        headline_line2: slide.headline_line2 || "",
        subtext: slide.subtext || "",
        tag: slide.tag || "PROMO",
        image_url: slide.image_url || slide.image || "",
        video_url: slide.video_url || slide.video || "",
        imagePosition: slide.imagePosition || "center",
        cta1_label: slide.cta1_label || "LEARN MORE",
        cta1_href: slide.cta1_href || "#",
        cta2_label: slide.cta2_label || "",
        cta2_href: slide.cta2_href || "",
        is_active: slide.is_active !== false,
        sort: slide.sort || 1,
      }));
      setSlides(mapped);
    }
  }, [initialSlides]);

  const toggleSection = (section: keyof typeof activeSections) => {
    setActiveSections((prev) => ({ ...prev, [section]: !prev[section] }));
    toast("Homepage section settings updated locally.");
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    if (!editingSlide.headline_line1 || !editingSlide.image_url) {
      toast("Headline and Image URL are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingSlide.id && typeof editingSlide.id !== "string";
      const payload = {
        headline_line1: editingSlide.headline_line1,
        headline_line2: editingSlide.headline_line2 || "",
        subtext: editingSlide.subtext || "",
        tag: editingSlide.tag || "PROMO",
        image_url: editingSlide.image_url,
        video_url: editingSlide.video_url || "",
        imagePosition: editingSlide.imagePosition || "center",
        cta1_label: editingSlide.cta1_label || "LEARN MORE",
        cta1_href: editingSlide.cta1_href || "#",
        cta2_label: editingSlide.cta2_label || "",
        cta2_href: editingSlide.cta2_href || "",
        is_active: editingSlide.is_active !== false,
        sort: editingSlide.sort || slides.length + 1,
      };

      const res = await fetch("/api/admin/directus", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "hero_slides",
          id: isEdit ? editingSlide.id : undefined,
          data: payload,
        }),
      });

      if (res.ok) {
        toast(isEdit ? "Hero slide updated." : "New hero slide added.");
        setEditingSlide(null);
        router.refresh();
      } else {
        const err = await res.json().catch(() => null);
        toast(`Error saving to Directus: ${err?.error || res.statusText}`, "error");
      }
    } catch (err) {
      toast(`Network error: ${err instanceof Error ? err.message : err}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id: string | number) => {
    try {
      const res = await fetch("/api/admin/directus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "hero_slides",
          id,
        }),
      });

      if (res.ok) {
        toast("Hero slide deleted.", "info");
        router.refresh();
      } else {
        toast("Failed to delete slide from Directus.", "error");
      }
    } catch (err) {
      toast("Network error deleting slide.", "error");
    }
  };

  const moveSlide = async (index: number, direction: "up" | "down") => {
    const newSlides = [...slides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;

    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    // Recalculate sort keys locally
    newSlides.forEach((slide, idx) => {
      slide.sort = idx + 1;
    });

    setSlides(newSlides);

    // Patch both affected slides
    try {
      await Promise.all([
        fetch("/api/admin/directus", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            collection: "hero_slides",
            id: newSlides[index].id,
            data: { sort: newSlides[index].sort },
          }),
        }),
        fetch("/api/admin/directus", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            collection: "hero_slides",
            id: newSlides[targetIndex].id,
            data: { sort: newSlides[targetIndex].sort },
          }),
        }),
      ]);
      toast("Slide order updated in Directus.");
      router.refresh();
    } catch {
      toast("Could not update order in Directus.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Homepage Sections Toggle */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
          <LayoutGrid className="h-5 w-5 text-zru-green" /> Homepage layout builder
        </h2>
        <p className="text-black/60 text-xs mt-1">Enable or disable specific sections on the main homepage feed.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {Object.entries(activeSections).map(([section, isActive]) => (
            <button
              key={section}
              type="button"
              onClick={() => toggleSection(section as keyof typeof activeSections)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                isActive
                  ? "border-zru-green bg-zru-green/5 text-zru-green"
                  : "border-black/10 bg-white text-black/40"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                {section.replace(/([A-Z])/g, " $1")} Section
              </span>
              {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </section>

      {/* Hero Carousel Management */}
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-heading text-xl font-black uppercase text-rich-black">
              Hero carousel slides
            </h2>
            <p className="text-black/60 text-xs mt-1">Configure multi-slide promotional hero blocks at the top of the homepage.</p>
          </div>
          <button
            onClick={() =>
              setEditingSlide({
                headline_line1: "",
                headline_line2: "",
                subtext: "",
                tag: "PROMO",
                image_url: "",
                imagePosition: "center",
                cta1_label: "LEARN MORE",
                cta1_href: "#",
                is_active: true,
              })
            }
            className="flex items-center gap-1.5 rounded-lg bg-zru-green px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Slide
          </button>
        </div>

        {/* Slide List */}
        <div className="space-y-3 mt-4">
          {slides
            .sort((a, b) => a.sort - b.sort)
            .map((slide, index) => (
              <div
                key={slide.id}
                className="flex items-center justify-between p-4 rounded-xl border border-black/10 bg-white hover:bg-black/[0.01] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-black/5 border border-black/10 flex items-center justify-center text-black/30">
                    {slide.image_url ? (
                      <img src={slide.image_url} alt="" className="object-cover w-full h-full" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold bg-black/5 px-2 py-0.5 rounded text-black/50 uppercase tracking-wider">
                      {slide.tag}
                    </span>
                    <h3 className="text-xs font-bold text-rich-black mt-1">
                      {slide.headline_line1} {slide.headline_line2}
                    </h3>
                    <p className="text-[10px] text-black/40 mt-0.5">{slide.subtext}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSlide(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded hover:bg-black/5 text-black/60 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveSlide(index, "down")}
                    disabled={index === slides.length - 1}
                    className="p-1.5 rounded hover:bg-black/5 text-black/60 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setEditingSlide(slide)}
                    className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border border-black/10 hover:bg-black/5 text-rich-black"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-600"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Editor Modal */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4">
            <h3 className="font-heading text-lg font-black uppercase text-rich-black">
              {editingSlide.id ? "Edit Hero Slide" : "Add Hero Slide"}
            </h3>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Headline Line 1</label>
                  <input
                    type="text"
                    required
                    value={editingSlide.headline_line1 || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, headline_line1: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Headline Line 2</label>
                  <input
                    type="text"
                    value={editingSlide.headline_line2 || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, headline_line2: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green"
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
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green"
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

              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Background Image URL</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editingSlide.image_url || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, image_url: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-zru-green"
                  />
                  <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-black/35" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Background Video URL (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editingSlide.video_url || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, video_url: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-zru-green"
                  />
                  <Video className="absolute left-3 top-2.5 w-4 h-4 text-black/35" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">CTA 1 Button Label</label>
                  <input
                    type="text"
                    value={editingSlide.cta1_label || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta1_label: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">CTA 1 Link href</label>
                  <input
                    type="text"
                    value={editingSlide.cta1_href || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta1_href: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/60">
                  <input
                    type="checkbox"
                    checked={editingSlide.is_active || false}
                    onChange={(e) => setEditingSlide({ ...editingSlide, is_active: e.target.checked })}
                    className="rounded border-black/20 text-zru-green focus:ring-zru-green"
                  />
                  Active & Visible
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-black/10 hover:bg-black/5 text-rich-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-lg bg-zru-green px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-sm disabled:opacity-50"
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
