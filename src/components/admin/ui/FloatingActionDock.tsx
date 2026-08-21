"use client";

import React from "react";
import {
  CheckSquare,
  Eye,
  FileCheck,
  FileX,
  Trash2,
  Tag,
  Calendar,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";

interface FloatingActionDockProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBatchPublish?: () => void;
  onBatchDraft?: () => void;
  onBatchDelete?: () => void;
  isLoading?: boolean;
}

export function FloatingActionDock({
  selectedCount,
  onClearSelection,
  onBatchPublish,
  onBatchDraft,
  onBatchDelete,
  isLoading = false,
}: FloatingActionDockProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950/95 border border-zru-green/40 rounded-xl shadow-2xl shadow-black/80 backdrop-blur-md text-white text-xs">
        {/* Selected count chip */}
        <div className="flex items-center gap-2 pr-3 border-r border-white/10 font-medium">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zru-green text-[11px] font-bold text-white">
            {selectedCount}
          </span>
          <span>Selected</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {onBatchPublish && (
            <button
              onClick={onBatchPublish}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 transition-colors font-medium disabled:opacity-50"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Publish</span>
            </button>
          )}

          {onBatchDraft && (
            <button
              onClick={onBatchDraft}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 transition-colors font-medium disabled:opacity-50"
            >
              <FileX className="w-3.5 h-3.5" />
              <span>Set Draft</span>
            </button>
          )}

          {onBatchDelete && (
            <button
              onClick={onBatchDelete}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 transition-colors font-medium disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Move to Trash</span>
            </button>
          )}
        </div>

        {/* Clear selection */}
        <button
          onClick={onClearSelection}
          className="ml-2 p-1 text-zinc-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
          title="Deselect all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
