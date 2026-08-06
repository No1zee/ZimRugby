"use client";

import { useState } from "react";
import { ArrowLeft, Save, Layout, Globe, Image as ImageIcon, Layers, PlayCircle, Info } from "lucide-react";

interface Page {
  id: string;
  slug: string;
  title: string;
  hero_kicker?: string;
  hero_title?: string;
  hero_intro?: string;
  hero_image?: string;
  hero_image_url?: string;
  seo_title?: string;
  seo_description?: string;
  status?: string;
}

export default function PageSettingsEditor({
  page,
  onSave,
  onDeselect,
}: {
  page: Page;
  onSave: (data: Partial<Page>) => Promise<void>;
  onDeselect: () => void;
}) {
  const isHomePage = page.slug === "home";

  const [formData, setFormData] = useState<Partial<Page>>({
    title: page.title,
    hero_kicker: page.hero_kicker || "",
    hero_title: page.hero_title || "",
    hero_intro: page.hero_intro || "",
    hero_image_url: page.hero_image_url || "",
    seo_title: page.seo_title || "",
    seo_description: page.seo_description || "",
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "seo">("hero");

  const handleChange = (field: keyof Page, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#002D1A]">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 relative">
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#006B3F]/50 to-transparent" />
        <button
          onClick={onDeselect}
          type="button"
          className="text-white/40 hover:text-white flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sections
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A85A] bg-[#006B3F]/10 border border-[#006B3F]/20 px-2 py-0.5 rounded">
          Page Hero & Settings
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 shrink-0">
        <button
          onClick={() => setActiveTab("hero")}
          type="button"
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === "hero"
              ? "border-[#006B3F] text-white bg-white/5"
              : "border-transparent text-white/40 hover:text-white/60"
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          Hero Content
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          type="button"
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === "seo"
              ? "border-[#006B3F] text-white bg-white/5"
              : "border-transparent text-white/40 hover:text-white/60"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          SEO & Meta
        </button>
      </div>

      {/* Scrollable Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "hero" ? (
          <div className="space-y-5">
            <div>
              <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">
                Page Title (Navigation)
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#006B3F]/50 transition-colors"
              />
            </div>

            {isHomePage ? (
              /* Home Page — Hero Carousel Banner */
              <div className="rounded-xl border border-[#006B3F]/30 bg-[#006B3F]/10 p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#006B3F]/20 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-[#00A85A]" />
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-bold">Hero Carousel Active</h3>
                    <p className="text-white/40 text-[10px] mt-1 leading-relaxed">
                      The homepage uses a multi-slide Hero Carousel managed via the <strong className="text-white/60">hero_slides</strong> collection in Directus. Each slide has its own headline, subtext, image/video, CTAs, and optional match card.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/50 text-[10px]">
                    <PlayCircle className="w-3.5 h-3.5 text-[#00A85A]" />
                    <span>Slides auto-rotate with progress indicators</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-[10px]">
                    <Layers className="w-3.5 h-3.5 text-[#00A85A]" />
                    <span>Reorder slides via the <strong className="text-white/60">sort</strong> field in Directus</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-[10px]">
                    <Info className="w-3.5 h-3.5 text-[#00A85A]" />
                    <span>Standard hero fields below are ignored for the home page</span>
                  </div>
                </div>

                {process.env.NEXT_PUBLIC_DIRECTUS_URL && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/admin/content/hero_slides`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white bg-[#006B3F] rounded-lg hover:bg-[#00A85A] transition-all shadow-[0_0_15px_rgba(0,107,63,0.3)]"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Manage Carousel Slides in Directus
                  </a>
                )}
              </div>
            ) : (
              /* Standard Pages — Individual Hero Fields */
              <>
                <div>
                  <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">
                    Hero Kicker (Mini Header)
                  </label>
                  <input
                    type="text"
                    value={formData.hero_kicker}
                    onChange={(e) => handleChange("hero_kicker", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#006B3F]/50 transition-colors"
                    placeholder="e.g. ZIMBABWE RUGBY UNION"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">
                    Hero Title (Large Header)
                  </label>
                  <input
                    type="text"
                    value={formData.hero_title}
                    onChange={(e) => handleChange("hero_title", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#006B3F]/50 transition-colors"
                    placeholder="e.g. Official Home of The Sables"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">
                    Hero Intro Description
                  </label>
                  <textarea
                    value={formData.hero_intro}
                    onChange={(e) => handleChange("hero_intro", e.target.value)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#006B3F]/50 transition-colors resize-none"
                    placeholder="Welcome intro text..."
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">
                    Hero Image URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.hero_image_url}
                      onChange={(e) => handleChange("hero_image_url", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#006B3F]/50 transition-colors"
                      placeholder="https://example.com/hero.jpg"
                    />
                    <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">
                SEO Search Title
              </label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => handleChange("seo_title", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#006B3F]/50 transition-colors"
                placeholder="e.g. Zimbabwe Rugby Union | Home"
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">
                SEO Search Description
              </label>
              <textarea
                value={formData.seo_description}
                onChange={(e) => handleChange("seo_description", e.target.value)}
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#006B3F]/50 transition-colors resize-none"
                placeholder="Search engine summary..."
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#006B3F] text-white font-bold uppercase tracking-[0.2em] py-3 rounded-lg hover:bg-[#00A85A] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,107,63,0.3)] text-[10px]"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving Changes..." : "Save Page Settings"}
        </button>
      </form>
    </div>
  );
}
