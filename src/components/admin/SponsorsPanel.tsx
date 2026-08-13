"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Save, ExternalLink, ShieldCheck } from "lucide-react";
import { useToast } from "./ui/ToastProvider";
import { useRouter } from "next/navigation";

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
  { id: 2, name: "Sable Lager", logo_url: "/images/sponsors/sable.png", tier: "gold", href: "https://www.delta.co.zw", is_active: true, sort: 2 },
  { id: 3, name: "Puma Sport", logo_url: "/images/sponsors/puma.png", tier: "gold", href: "https://puma.com", is_active: true, sort: 3 },
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

    if (!editingSponsor.name || !editingSponsor.logo_url) {
      toast("Name and Logo URL are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingSponsor.id && typeof editingSponsor.id !== "string";
      const payload = {
        name: editingSponsor.name,
        logo_url: editingSponsor.logo_url,
        logo: editingSponsor.logo_url,
        tier: editingSponsor.tier || "gold",
        href: editingSponsor.href || "",
        website_url: editingSponsor.href || "",
        is_active: editingSponsor.is_active !== false,
        sort: editingSponsor.sort || sponsors.length + 1,
      };

      const res = await fetch("/api/admin/directus", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "partners",
          id: isEdit ? editingSponsor.id : undefined,
          data: payload,
        }),
      });

      if (res.ok) {
        toast(isEdit ? "Sponsor profile updated." : "New sponsor added.");
        setEditingSponsor(null);
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

  const handleDeleteSponsor = async (id: string | number) => {
    try {
      const res = await fetch("/api/admin/directus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "partners",
          id,
        }),
      });

      if (res.ok) {
        toast("Sponsor deleted.", "info");
        router.refresh();
      } else {
        toast("Failed to delete sponsor from Directus.", "error");
      }
    } catch (err) {
      toast("Network error deleting sponsor.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
              <ShieldCheck className="h-5 w-5 text-zru-green" /> Union partners & sponsors
            </h2>
            <p className="text-black/60 text-xs mt-1">Manage corporate sponsors, assign visibility tiers, and update redirection links.</p>
          </div>
          <button
            onClick={() =>
              setEditingSponsor({
                name: "",
                logo_url: "",
                tier: "gold",
                href: "https://",
                is_active: true,
              })
            }
            className="flex items-center gap-1.5 rounded-lg bg-zru-green px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Partner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {["title", "gold", "silver", "bronze"].map((tier) => {
            const tierSponsors = sponsors.filter((s) => s.tier === tier);
            return (
              <div key={tier} className="border border-black/5 bg-black/[0.01] rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-black/50 flex items-center justify-between">
                  <span>{tier} sponsors</span>
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-black/5 text-black/40">
                    {tierSponsors.length} active
                  </span>
                </h3>

                {tierSponsors.length === 0 ? (
                  <div className="text-[10px] text-black/30 text-center py-6">No partners in this tier yet.</div>
                ) : (
                  <div className="space-y-2">
                    {tierSponsors.map((sponsor) => (
                      <div
                        key={sponsor.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white border border-black/5 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded border border-black/5 bg-black/[0.02] flex items-center justify-center p-1 overflow-hidden shrink-0">
                            {sponsor.logo_url ? (
                              <img src={sponsor.logo_url} alt="" className="object-contain max-w-full max-h-full" />
                            ) : (
                              <ShieldCheck className="w-5 h-5 text-black/20" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-rich-black">{sponsor.name}</h4>
                            <a
                              href={sponsor.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-zru-green hover:underline flex items-center gap-0.5 mt-0.5"
                            >
                              Visit Website <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingSponsor(sponsor)}
                            className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-black/10 hover:bg-black/5 text-rich-black"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSponsor(sponsor.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-red-600"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Editor Modal */}
      {editingSponsor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-heading text-lg font-black uppercase text-rich-black">
              {editingSponsor.id ? "Edit Partner Profile" : "Add Sponsor"}
            </h3>

            <form onSubmit={handleSaveSponsor} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Company / Partner Name</label>
                <input
                  type="text"
                  required
                  value={editingSponsor.name || ""}
                  onChange={(e) => setEditingSponsor({ ...editingSponsor, name: e.target.value })}
                  className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Redirection Tier</label>
                  <select
                    value={editingSponsor.tier || "gold"}
                    onChange={(e) => setEditingSponsor({ ...editingSponsor, tier: e.target.value as Sponsor["tier"] })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  >
                    <option value="title">Title Sponsor</option>
                    <option value="gold">Gold Partner</option>
                    <option value="silver">Silver Partner</option>
                    <option value="bronze">Bronze Sponsor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={editingSponsor.is_active ? "true" : "false"}
                    onChange={(e) => setEditingSponsor({ ...editingSponsor, is_active: e.target.value === "true" })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                  >
                    <option value="true">Active & Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Logo Image URL</label>
                <input
                  type="text"
                  required
                  value={editingSponsor.logo_url || ""}
                  onChange={(e) => setEditingSponsor({ ...editingSponsor, logo_url: e.target.value })}
                  placeholder="/images/sponsors/logo.png"
                  className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Partner Website URL</label>
                <input
                  type="url"
                  value={editingSponsor.href || ""}
                  onChange={(e) => setEditingSponsor({ ...editingSponsor, href: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setEditingSponsor(null)}
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
