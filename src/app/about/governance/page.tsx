import { Metadata } from "next";
import { Landmark, FileText, Download } from "lucide-react";
import { directusFetch } from "@/lib/directus/fetch";
import { getPageBySlug } from "@/lib/api/pages";

import { buildPageMetadata } from "@/lib/api/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(
    "about-governance",
    "Governance & Compliance | Zimbabwe Rugby Union",
    "ZRU governance structure, constitution, annual reports, and compliance documentation."
  );
}

const DEFAULT_DOCUMENTS = [
  { title: "ZRU Constitution (2020 Amendment)", download_url: "/docs/constitution.pdf", description: "Official union charter and constitutional bylaws." },
  { title: "Strategic Vision Plan 2024 - 2028", download_url: "/docs/strategic-plan.pdf", description: "Multi-year tactical roadmap for high performance and grassroots expansion." },
  { title: "ZRU Code of Conduct & Integrity Guidelines", download_url: "/docs/code-of-conduct.pdf", description: "Ethical standards, behavioral policies, and compliance procedures." },
  { title: "Anti-Doping Compliance Policy Statement", download_url: "/docs/anti-doping.pdf", description: "Rules and drug-free regulations enforced by the ZRU medical board." }
];

export default async function GovernancePage() {
  let documents = DEFAULT_DOCUMENTS;

  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      const rawDocs = await directusFetch<any>("referee_resources", {
        filter: { category: { _eq: "governance" } },
        sort: ["id"],
      });
      if (rawDocs && rawDocs.length > 0) {
        documents = rawDocs.map((doc: any) => ({
          title: doc.title,
          download_url: doc.download_url || doc.file || "#",
          description: doc.description || "Official compliance document.",
        }));
      }
    }
  } catch (e) {
    console.warn("Directus fetch failed for governance documents:", e);
  }

  return (
    <div className="space-y-10">
      {/* Overview header */}
      <div className="border-l-4 border-zru-green pl-4">
        <h2 className="text-2xl font-black uppercase tracking-wider text-rich-black">GOVERNANCE & COMPLIANCE</h2>
        <p className="text-sm text-rich-black/50 mt-1">Official constitution, transparency reports, and administrative files.</p>
      </div>

      <p className="text-rich-black/80 leading-relaxed text-sm font-normal">
        The Zimbabwe Rugby Union operates in alignment with World Rugby, Rugby Africa, and the Sports and Recreation Commission (SRC) of Zimbabwe, publishing its constitution and compliance documents for public review.
      </p>

      {/* Constitution downloads */}
      <div className="pt-5 border-t border-black/5 space-y-5">
        <h3 className="text-lg font-black uppercase tracking-wide text-rich-black flex items-center gap-2">
          <Landmark className="w-5 h-5 text-zru-green" />
          <span>OFFICIAL CONSTITUTIONAL DOCUMENTS</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc, idx) => (
            <div 
              key={idx} 
              className="bg-milk-white border border-black/5 rounded-xl p-4 flex items-center justify-between group transition-[border-color,box-shadow] duration-300 hover:border-zru-green/30 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zru-green/10 rounded-lg flex items-center justify-center shrink-0 border border-zru-green/10">
                  <FileText className="w-5 h-5 text-zru-green" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-rich-black uppercase tracking-tight">{doc.title}</h4>
                  <p className="text-[10px] text-rich-black/50 mt-0.5 leading-relaxed">{doc.description}</p>
                </div>
              </div>
              
              <a 
                href={doc.download_url}
                download
                className="p-2.5 rounded-full bg-black/5 border border-black/5 hover:bg-zru-green hover:text-white transition-all group-hover:scale-105 flex items-center justify-center"
                title="Download Document"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
