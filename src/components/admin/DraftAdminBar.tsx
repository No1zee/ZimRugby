"use client";

import { useDraftMode } from "@/lib/hooks/useDraftMode";
import { usePathname } from "next/navigation";
import { Eye, Edit3, LogOut } from "lucide-react";

export function DraftAdminBar() {
  const isDraft = useDraftMode();
  const pathname = usePathname();

  if (!isDraft) return null;
  
  // Don't render preview bar inside admin views
  if (pathname.startsWith("/admin") || pathname.startsWith("/admin-login")) {
    return null;
  }

  // Determine current page slug for editing link
  let slug = "home";
  if (pathname !== "/") {
    const parts = pathname.split("/").filter(Boolean);
    slug = parts[parts.length - 1] || "home";
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#0c0e0d] border-t border-[#006B3F]/40 py-3.5 px-4 sm:px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-lg">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left side: status */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#006B3F]/20 border border-[#006B3F]/30 text-[#00A85A]">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-white text-xs font-black uppercase tracking-widest font-heading">
              Draft Preview Active
            </span>
            <span className="hidden md:inline text-white/40 text-[10px] font-subheading uppercase tracking-[0.2em] ml-2">
              &bull; Double-click elements to edit inline
            </span>
          </div>
        </div>

        {/* Right side: actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <a
            href={`/admin/${slug}`}
            className="flex items-center gap-2 bg-[#006B3F] hover:bg-[#005230] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-md transition-all shadow-md font-heading w-full sm:w-auto justify-center"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Page Layout
          </a>
          
          <a
            href={`/api/draft/disable?redirect=${encodeURIComponent(pathname)}`}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-md transition-all font-heading w-full sm:w-auto justify-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Preview
          </a>
        </div>
      </div>
    </div>
  );
}

