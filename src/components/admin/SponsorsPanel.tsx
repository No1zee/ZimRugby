"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Save, ExternalLink, ShieldCheck, Handshake } from "lucide-react";
import { useToast } from "./ui/ToastProvider";
import { useRouter } from "next/navigation";
import ImagePicker, { toAssetUrl } from "./ui/ImagePicker";

interface Sponsor {
  id: string | number;
  name: string;
  logo_url: string;
  tier: "title" | "gold" | "silver" | "bronze";
  href: string;
  is_active: boolean;
  sort: number;
}

const DEFAULT_SPONSORS: Sponsor[] = [
  { id: 1, name: "Nedbank Zimbabwe", logo_url: "/images/sponsors/nedbank.png", tier: "title", href: "https://www.nedbank.co.zw", is_active: true, sort: 1 },
  { id: 2, name: "Sable Lager (Delta)", logo_url: "/images/sponsors/sable.png", tier: "gold", href: "https://www.delta.co.zw", is_active: true, sort: 2 },
  { id: 3, name: "Macron Sport", logo_url: "/images/sponsors/puma.png", tier: "gold", href: "https://www.macron.com", is_active: true, sort: 3 },
];

export default function SponsorsPanel({ initialSponsors }: { initialSponsors?: any[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>(DEFAULT_SPONSORS);
  const [editingSponsor, setEditingSponsor] = useState<Partial<Sponsor> | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync initial sponsors from Directus
  useEffect(() => {
    if (initialSponsors && initialSponsors.length > 0) {
      const mapped = initialSponsors.map((s: any) => ({
        id: s.id,
        name: s.name || "",
        logo_url: s.logo_url || s.logo || "",
        tier: s.tier || "gold",
        href: s.href || s.website_url || "",
        is_active: s.is_active !== false,
        sort: s.sort || 1,
      }));
      setSponsors(mapped);
    }
  }, [initialSponsors]);

  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsor) return;

    setSaving(true);
    try {
      if (editingSponsor.id) {
        setSponsors((prev) =>
          prev.map((s) => (s.id === editingSponsor.id ? ({ ...s, ...editingSponsor } as Sponsor) : s))
        );
      } else {
        const newSponsor: Sponsor = {
          id: `sp-${Date.now()}`,
          name: editingSponsor.name || "New Partner",
          logo_url: editingSponsor.logo_url || "",
          tier: (editingSponsor.tier as Sponsor["tier"]) || "gold",
          href: editingSponsor.href || "#",
          is_active: editingSponsor.is_active !== false,
          sort: sponsors.length + 1,
        };
        setSponsors((prev) => [...prev, newSponsor]);
      }
      toast("Partner profile saved!");
      setEditingSponsor(null);
    } catch {
      toast("Failed to save sponsor.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSponsor = (id: string | number) => {
    setSponsors((prev) => prev.filter((s) => s.id !== id));
    toast("Partner removed.");
  };

  const TIERS: { key: Sponsor["tier"]; label: string }[] = [
    { key: "title", label: "Title Partners (Nedbank)" },
    { key: "gold", label: "Gold Partners (Delta / Macron)" },
    { key: "silver", label: "Silver Partners" },
    { key: "bronze", label: "Bronze & Grassroots Partners" },
  ];

  return (
    <div className="space-y-6">
      <section className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-6">
          <div>
            <h2 className="text-sm font-black font-heading uppercase tracking-wider text-rich-black flex items-center gap-2">
              <Handshake className="w-4 h-4 text-[#006B3F]" />
              <span>Commercial Partners & Sponsors</span>
            </h2>
            <p className="text-xs text-black/50 mt-0.5">
              Manage official union sponsors, brand logos, redirect URLs, and sponsor tier hierarchy.
            </p>
          </div>
          <button
            onClick={() => setEditingSponsor({ tier: "gold", is_active: true })}
            className="flex items-center gap-1.5 rounded-lg bg-zru-green px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Partner
          </button>
        </div>

        {/* Sponsors by Tier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TIERS.map(({ key: tierKey, label: tierLabel }) => {
            const tierSponsors = sponsors.filter((s) => s.tier === tierKey);
            return (
              <div key={tierKey} className="bg-black/[0.01] border border-black/5 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-black/60 flex items-center justify-between">
                  <span>{tierLabel}</span>
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-black/10 text-black/60 font-mono">
                    {tierSponsors.length} Active
                  </span>
                </h3>

                {tierSponsors.length === 0 ? (
                  <div className="text-[11px] text-black/30 text-center py-6 border border-dashed border-black/5 rounded-lg">
                    No partners in this tier yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tierSponsors.map((sponsor) => {
                      const logoSrc = toAssetUrl(sponsor.logo_url);
                      return (
                        <div
                          key={sponsor.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white border border-black/5 shadow-sm hover:border-black/15 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-lg border border-black/5 bg-black/[0.02] flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                              {logoSrc ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={logoSrc} alt={sponsor.name} className="object-contain max-w-full max-h-full" />
                              ) : (
                                <ShieldCheck className="w-5 h-5 text-black/20" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-rich-black truncate">{sponsor.name}</h4>
                              <a
                                href={sponsor.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-zru-green hover:underline flex items-center gap-1 mt-0.5 truncate"
                              >
                                <span>{sponsor.href.replace(/^https?:\/\//, "")}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <button
                              onClick={() => setEditingSponsor(sponsor)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-black/10 hover:bg-black/5 text-rich-black cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSponsor(sponsor.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                              title="Delete Partner"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Editor Modal with Directus Dropzone */}
      {editingSponsor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-black/10">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h3 className="font-heading text-base font-black uppercase text-rich-black">
                {editingSponsor.id ? "Edit Partner Profile" : "Add Sponsor"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSponsor(null)}
                className="text-black/40 hover:text-black text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSponsor} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Company / Partner Name</label>
                <input
                  type="text"
                  required
                  value={editingSponsor.name || ""}
                  onChange={(e) => setEditingSponsor({ ...editingSponsor, name: e.target.value })}
                  placeholder="e.g. Nedbank Zimbabwe"
                  className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Sponsor Tier</label>
                  <select
                    value={editingSponsor.tier || "gold"}
                    onChange={(e) => setEditingSponsor({ ...editingSponsor, tier: e.target.value as Sponsor["tier"] })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  >
                    <option value="title">Title Partner</option>
                    <option value="gold">Gold Partner</option>
                    <option value="silver">Silver Partner</option>
                    <option value="bronze">Bronze / Grassroots</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={editingSponsor.is_active !== false ? "true" : "false"}
                    onChange={(e) => setEditingSponsor({ ...editingSponsor, is_active: e.target.value === "true" })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  >
                    <option value="true">Active & Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              {/* Directus Image Dropzone for Logos */}
              <div>
                <ImagePicker
                  label="Partner Logo Asset"
                  value={editingSponsor.logo_url || ""}
                  onChange={(val) => setEditingSponsor({ ...editingSponsor, logo_url: val })}
                  hint="Drag & drop logo (PNG with transparent background recommended)"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Partner Website URL</label>
                <input
                  type="url"
                  value={editingSponsor.href || ""}
                  onChange={(e) => setEditingSponsor({ ...editingSponsor, href: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setEditingSponsor(null)}
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
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
