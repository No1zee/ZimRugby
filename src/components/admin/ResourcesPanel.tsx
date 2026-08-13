"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Save, FileText, Download, Filter } from "lucide-react";
import { useToast } from "./ui/ToastProvider";
import { useRouter } from "next/navigation";

interface Resource {
  id: string | number;
  title: string;
  category: "laws" | "safeguarding" | "governance" | "applications";
  download_url: string;
  description: string;
  updated_at: string;
}

const DEFAULT_RESOURCES: Resource[] = [
  { id: 1, title: "ZRU Player Safeguarding Policy 2026", category: "safeguarding", download_url: "/docs/safeguarding-2026.pdf", description: "Mandatory guidelines and protection codes for all youth and academy teams.", updated_at: "2026-06-12" },
  { id: 2, title: "World Rugby Laws of the Game - 2026", category: "laws", download_url: "/docs/wr-laws-2026.pdf", description: "Official World Rugby rulebook and local ZRU regulation variations.", updated_at: "2026-04-18" },
  { id: 3, title: "Referee Certification Form", category: "applications", download_url: "/docs/referee-signup.pdf", description: "Application form for Level 1 and Level 2 referee certification courses.", updated_at: "2026-07-01" },
];

export default function ResourcesPanel({ initialResources }: { initialResources?: any[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>(DEFAULT_RESOURCES);
  const [editingResource, setEditingResource] = useState<Partial<Resource> | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [saving, setSaving] = useState(false);

  // Sync initial resources from Directus
  useEffect(() => {
    if (initialResources && initialResources.length > 0) {
      const mapped = initialResources.map((r: any) => ({
        id: r.id,
        title: r.title || "",
        category: r.category || "safeguarding",
        download_url: r.download_url || r.file || "",
        description: r.description || "",
        updated_at: r.date_updated ? r.date_updated.split("T")[0] : (r.date_created ? r.date_created.split("T")[0] : new Date().toISOString().split("T")[0]),
      }));
      setResources(mapped);
    }
  }, [initialResources]);

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    if (!editingResource.title || !editingResource.download_url) {
      toast("Title and Document URL/Path are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingResource.id && typeof editingResource.id !== "string";
      const payload = {
        title: editingResource.title,
        category: editingResource.category || "safeguarding",
        download_url: editingResource.download_url,
        file: editingResource.download_url,
        description: editingResource.description || "",
      };

      const res = await fetch("/api/admin/directus", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "referee_resources",
          id: isEdit ? editingResource.id : undefined,
          data: payload,
        }),
      });

      if (res.ok) {
        toast(isEdit ? "Resource document updated." : "New resource uploaded.");
        setEditingResource(null);
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

  const handleDeleteResource = async (id: string | number) => {
    try {
      const res = await fetch("/api/admin/directus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "referee_resources",
          id,
        }),
      });

      if (res.ok) {
        toast("Resource document deleted.", "info");
        router.refresh();
      } else {
        toast("Failed to delete resource from Directus.", "error");
      }
    } catch (err) {
      toast("Network error deleting resource.", "error");
    }
  };

  const filteredResources = activeCategoryFilter === "all"
    ? resources
    : resources.filter((r) => r.category === activeCategoryFilter);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
              <FileText className="h-5 w-5 text-zru-green" /> Resource vault & documents
            </h2>
            <p className="text-black/60 text-xs mt-1">Upload union PDF files, safety regulations, official laws, and course applications.</p>
          </div>
          <button
            onClick={() =>
              setEditingResource({
                title: "",
                category: "safeguarding",
                download_url: "",
                description: "",
              })
            }
            className="flex items-center gap-1.5 rounded-lg bg-zru-green px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Document
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-black/5 pb-4 mb-4">
          <Filter className="w-3.5 h-3.5 text-black/35" />
          <span className="text-[10px] font-black uppercase tracking-wider text-black/40 mr-2">Filter vault:</span>
          {["all", "laws", "safeguarding", "governance", "applications"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                activeCategoryFilter === cat
                  ? "bg-zru-green border-zru-green text-white"
                  : "bg-white border-black/10 text-black/50 hover:bg-black/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="flex flex-col justify-between p-4 rounded-xl border border-black/10 bg-white shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-black/25">
                <FileText className="w-6 h-6" />
              </div>
              
              <div>
                <span className="text-[9px] font-black bg-black/5 px-2 py-0.5 rounded text-black/40 uppercase tracking-wider">
                  {resource.category}
                </span>
                <h3 className="text-xs font-bold text-rich-black mt-2 pr-6 line-clamp-1">
                  {resource.title}
                </h3>
                <p className="text-[10px] text-black/50 mt-1 leading-relaxed line-clamp-2">
                  {resource.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                <span className="text-[9px] text-black/35 font-bold uppercase">
                  Updated: {resource.updated_at}
                </span>

                <div className="flex items-center gap-1">
                  <a
                    href={resource.download_url}
                    download
                    className="p-1.5 rounded hover:bg-black/5 text-zru-green"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setEditingResource(resource)}
                    className="px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border border-black/10 hover:bg-black/5 text-rich-black"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteResource(resource.id)}
                    className="p-1 rounded hover:bg-red-50 text-red-600"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editor Modal */}
      {editingResource && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-heading text-lg font-black uppercase text-rich-black">
              {editingResource.id ? "Edit Document Info" : "Register Document"}
            </h3>

            <form onSubmit={handleSaveResource} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={editingResource.title || ""}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                  className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Vault Category</label>
                <select
                  value={editingResource.category || "safeguarding"}
                  onChange={(e) => setEditingResource({ ...editingResource, category: e.target.value as Resource["category"] })}
                  className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green font-bold"
                >
                  <option value="laws">Laws & Regulations</option>
                  <option value="safeguarding">Safeguarding Policies</option>
                  <option value="governance">Governance Docs</option>
                  <option value="applications">Applications & Signups</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Brief Description</label>
                <textarea
                  value={editingResource.description || ""}
                  onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                  rows={2}
                  className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">Document Path / Download URL</label>
                <input
                  type="text"
                  required
                  value={editingResource.download_url || ""}
                  onChange={(e) => setEditingResource({ ...editingResource, download_url: e.target.value })}
                  placeholder="/docs/document-name.pdf"
                  className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zru-green"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
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
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
