"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface EditableField {
  key: string;
  label: string;
  value: string;
  multiline?: boolean;
  type?: "text" | "image" | "select";
  options?: { label: string; value: string }[];
}

interface EditTarget {
  collection: string;
  id: string | number;
  fields: EditableField[];
}

interface EditContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  editingTarget: EditTarget | null;
  startEditing: (target: EditTarget) => void;
  stopEditing: () => void;
  saveField: (collection: string, id: string | number, data: Record<string, string>) => Promise<boolean>;
  refreshPreview: () => void;
}

const EditContext = createContext<EditContextType | null>(null);

export function useEditMode() {
  const ctx = useContext(EditContext);
  if (!ctx) throw new Error("useEditMode must be used within EditProvider");
  return ctx;
}

export function EditProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTarget, setEditingTarget] = useState<EditTarget | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-enable edit mode if URL has ?edit=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("edit") === "true") {
      setIsEditMode(true);
    }
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => {
      const next = !prev;
      // Update URL param without reload
      const url = new URL(window.location.href);
      if (next) {
        url.searchParams.set("edit", "true");
      } else {
        url.searchParams.delete("edit");
      }
      window.history.replaceState({}, "", url.toString());
      return next;
    });
    setEditingTarget(null);
  }, []);

  const startEditing = useCallback((target: EditTarget) => {
    setEditingTarget(target);
  }, []);

  const stopEditing = useCallback(() => {
    setEditingTarget(null);
  }, []);

  const saveField = useCallback(async (collection: string, id: string | number, data: Record<string, string>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/edit/${collection}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      setRefreshKey((k) => k + 1);
      return true;
    } catch (error) {
      console.error("Save failed:", error);
      return false;
    }
  }, []);

  const refreshPreview = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <EditContext.Provider
      value={{
        isEditMode,
        toggleEditMode,
        editingTarget,
        startEditing,
        stopEditing,
        saveField,
        refreshPreview,
      }}
    >
      {children}
      <div data-refresh-key={refreshKey} className="hidden" />
    </EditContext.Provider>
  );
}
