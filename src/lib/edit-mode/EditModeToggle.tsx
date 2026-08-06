"use client";

import { Pencil, Eye } from "lucide-react";
import { useEditMode } from "./EditContext";

export default function EditModeToggle() {
  const { isEditMode, toggleEditMode } = useEditMode();

  return (
    <button
      onClick={toggleEditMode}
      className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] rounded-lg transition-all border ${
        isEditMode
          ? "bg-[#00A85A] text-white border-[#00A85A] shadow-[0_0_20px_rgba(0,168,90,0.3)]"
          : "bg-white/5 text-white/50 border-white/10 hover:text-white hover:border-[#006B3F]/50 hover:bg-[#006B3F]/10"
      }`}
    >
      {isEditMode ? (
        <>
          <Eye className="w-3.5 h-3.5" />
          Exit Edit
        </>
      ) : (
        <>
          <Pencil className="w-3.5 h-3.5" />
          Edit Page
        </>
      )}
    </button>
  );
}
