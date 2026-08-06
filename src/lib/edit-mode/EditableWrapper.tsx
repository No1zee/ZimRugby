"use client";

import { ReactNode } from "react";
import { useEditMode } from "./EditContext";

interface EditableField {
  key: string;
  label: string;
  value: string;
  multiline?: boolean;
  type?: "text" | "image" | "select";
  options?: { label: string; value: string }[];
}

interface EditableWrapperProps {
  collection: string;
  id: string | number;
  fields: EditableField[];
  children: ReactNode;
  className?: string;
  label?: string;
}

export default function EditableWrapper({
  collection,
  id,
  fields,
  children,
  className = "",
  label,
}: EditableWrapperProps) {
  const { isEditMode, startEditing } = useEditMode();

  if (!isEditMode) return <>{children}</>;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startEditing({ collection, id, fields });
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`relative cursor-pointer transition-all duration-200 group/edit ${className}`}
      style={{
        outline: "2px dashed rgba(0, 168, 90, 0.4)",
        outlineOffset: "4px",
        borderRadius: "8px",
      }}
      title={`Double-click to edit ${label || "this content"}`}
    >
      {/* Green glow overlay on hover */}
      <div className="absolute -inset-1 rounded-xl bg-[#00A85A]/5 opacity-0 group-hover/edit:opacity-100 transition-opacity pointer-events-none -z-10" />
      
      {/* Edit badge */}
      <div className="absolute -top-3 left-4 z-30 opacity-0 group-hover/edit:opacity-100 transition-opacity">
        <div className="bg-[#006B3F] text-white text-[8px] font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded-sm shadow-lg font-subheading">
          {label || "Edit"}
        </div>
      </div>

      {children}
    </div>
  );
}
