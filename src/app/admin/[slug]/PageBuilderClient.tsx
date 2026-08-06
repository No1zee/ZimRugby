"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Save, ChevronLeft, Monitor, Tablet, Smartphone, ExternalLink, Eye, Code, Pencil } from "lucide-react";
import Link from "next/link";
import AdminAuthGate from "../AdminAuthGate";
import PagePreview from "./PagePreview";
import SectionPanel from "./SectionPanel";
import FieldEditor from "./FieldEditor";
import PageSettingsEditor from "./PageSettingsEditor";

type ViewportSize = "desktop" | "tablet" | "mobile";
type PreviewMode = "editor" | "live";

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const PAGE_ROUTES: Record<string, string> = {
  "home": "/",
  "teams": "/teams",
  "events": "/events",
  "tickets": "/tickets",
  "about": "/about",
  "fan-zone": "/fan-zone",
  "play-rugby": "/play-rugby",
  "media": "/media",
  "match-centre": "/match-centre",
};

interface Section {
  id: string;
  section_key: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  content?: string;
  cta_label?: string;
  cta_url?: string;
  display_variant?: string;
  image?: string;
  items?: any;
  sort?: number;
  status?: string;
  is_enabled?: boolean;
  date_created?: string;
  date_updated?: string;
}

interface Page {
  id: string;
  slug: string;
  title: string;
  hero_kicker?: string;
  hero_title?: string;
  hero_intro?: string;
  hero_image?: string;
  seo_title?: string;
  seo_description?: string;
  status?: string;
}

export default function PageBuilderClient({
  page,
  initialSections,
}: {
  page: Page;
  initialSections: Section[];
}) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [pageData, setPageData] = useState(page);
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("live");
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || null;

  const pageRoute = PAGE_ROUTES[pageData.slug] || `/${pageData.slug}`;

  const refreshIframe = useCallback(() => {
    setIframeKey(k => k + 1);
  }, []);

  useEffect(() => {
    if (previewMode === "live") {
      refreshIframe();
    }
  }, [previewMode, refreshIframe]);

  const handleSaveSection = useCallback(async (sectionId: string, data: Partial<Section>) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/pages/${page.slug}/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, ...data } : s))
      );
    } finally {
      setSaving(false);
    }
  }, [page.slug]);

  const handleReorder = useCallback(async (newOrder: string[]) => {
    const reordered = newOrder
      .map((id) => sections.find((s) => s.id === id))
      .filter(Boolean) as Section[];
    setSections(reordered);

    await fetch(`/api/admin/pages/${page.slug}/sections`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionIds: newOrder }),
    });
  }, [page.slug, sections]);

  const handleAddSection = useCallback(async (sectionData: Partial<Section>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${page.slug}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionData),
      });
      const { section } = await res.json();
      setSections((prev) => [...prev, section]);
      setSelectedSectionId(section.id);
    } finally {
      setSaving(false);
    }
  }, [page.slug]);

  const handleDeleteSection = useCallback(async (sectionId: string) => {
    await fetch(`/api/admin/pages/${page.slug}/sections/${sectionId}`, {
      method: "DELETE",
    });
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
  }, [page.slug, selectedSectionId]);

  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      await fetch(`/api/admin/pages/${page.slug}/publish`, { method: "POST" });
      setPageData((prev) => ({ ...prev, status: "published" }));
      setSections((prev) => prev.map((s) => ({ ...s, status: "published" })));
      refreshIframe();
    } finally {
      setPublishing(false);
    }
  }, [page.slug, refreshIframe]);

  const handleSavePage = useCallback(async (data: Partial<Page>) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/pages/${page.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setPageData((prev) => ({ ...prev, ...data }));
    } finally {
      setSaving(false);
    }
  }, [page.slug]);

  return (
    <AdminAuthGate>
    <div className="h-screen flex flex-col bg-[#001A0E]">
      {/* Top bar */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 shrink-0 relative">
        {/* Subtle green glow at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#006B3F]/50 to-transparent" />
        
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-white/40 hover:text-[#00A85A] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-white font-heading text-sm uppercase tracking-wider">
              {pageData.title}
            </h1>
            <span className="text-white/30 text-[10px] font-subheading uppercase tracking-[0.3em]">/{pageData.slug}</span>
          </div>
          <span
            className={`text-[9px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-sm border ${
              pageData.status === "published"
                ? "bg-[#006B3F]/20 text-[#00A85A] border-[#006B3F]/30"
                : "bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/30"
            }`}
          >
            {pageData.status}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {saving && (
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-subheading">Saving...</span>
          )}

          {/* Preview mode toggle */}
          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setPreviewMode("live")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                previewMode === "live"
                  ? "bg-[#006B3F] text-white"
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              }`}
              title="Live preview (1:1 with site)"
            >
              <Eye className="w-3.5 h-3.5" />
              Live
            </button>
            <button
              onClick={() => setPreviewMode("editor")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                previewMode === "editor"
                  ? "bg-[#006B3F] text-white"
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              }`}
              title="Editor preview (CMS sections only)"
            >
              <Code className="w-3.5 h-3.5" />
              Editor
            </button>
          </div>

          {/* Viewport toggle */}
          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
            {(["desktop", "tablet", "mobile"] as ViewportSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setViewport(size)}
                className={`p-1.5 transition-all ${
                  viewport === size
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/60 hover:bg-white/5"
                }`}
                title={size.charAt(0).toUpperCase() + size.slice(1)}
              >
                {size === "desktop" && <Monitor className="w-3.5 h-3.5" />}
                {size === "tablet" && <Tablet className="w-3.5 h-3.5" />}
                {size === "mobile" && <Smartphone className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>

          {previewMode === "live" && (
            <>
              <button
                onClick={refreshIframe}
                className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                title="Refresh preview"
              >
                Refresh
              </button>
              <a
                href={pageRoute}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#00A85A] border border-[#006B3F]/30 rounded-lg hover:bg-[#006B3F]/10 transition-all"
                title="Open in new tab with inline editing"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Live
              </a>
            </>
          )}

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white bg-[#006B3F] rounded-lg hover:bg-[#00A85A] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,107,63,0.3)] hover:shadow-[0_0_25px_rgba(0,107,63,0.5)]"
          >
            <Save className="w-3.5 h-3.5" />
            {publishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </header>

      {/* Split panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Preview */}
        <div className="flex-1 overflow-auto bg-[#0A0F0C] flex justify-center">
          <div
            className="h-full bg-white shadow-2xl transition-all duration-300 overflow-hidden"
            style={{ width: VIEWPORT_WIDTHS[viewport] }}
          >
            {previewMode === "live" ? (
              <iframe
                ref={iframeRef}
                key={iframeKey}
                src={pageRoute}
                className="w-full h-full border-0"
                title="Live Preview"
                sandbox="allow-same-origin allow-scripts allow-popups"
              />
            ) : (
              <PagePreview
                page={pageData}
                sections={sections}
                selectedSectionId={selectedSectionId}
                onSelectSection={setSelectedSectionId}
              />
            )}
          </div>
        </div>

        {/* Right: Editor panel */}
        <div className="w-[400px] border-l border-white/10 flex flex-col bg-[#002D1A] overflow-hidden">
          {selectedSectionId === "page_settings" ? (
            <PageSettingsEditor
              page={pageData}
              onSave={handleSavePage}
              onDeselect={() => setSelectedSectionId(null)}
            />
          ) : selectedSection ? (
            <FieldEditor
              section={selectedSection}
              onSave={(data) => handleSaveSection(selectedSection.id, data)}
              onDelete={() => handleDeleteSection(selectedSection.id)}
              onDeselect={() => setSelectedSectionId(null)}
            />
          ) : (
            <SectionPanel
              sections={sections}
              selectedSectionId={selectedSectionId}
              onSelect={setSelectedSectionId}
              onReorder={handleReorder}
              onAdd={handleAddSection}
              onDelete={handleDeleteSection}
              pageSlug={page.slug}
            />
          )}
        </div>
      </div>
    </div>
    </AdminAuthGate>
  );
}
