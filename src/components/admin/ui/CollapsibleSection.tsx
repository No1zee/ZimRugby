"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useConfirm } from "./ConfirmProvider";

interface CollapsibleSectionProps {
  title: string;
  icon?: ReactNode;
  count?: number;
  description?: string;
  defaultOpen?: boolean;
  dirty?: boolean;
  onDirtyChange?: (dirty: boolean) => void;
  children: ReactNode;
}

export default function CollapsibleSection({
  title,
  icon,
  count,
  description,
  defaultOpen = true,
  dirty = false,
  onDirtyChange,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const confirm = useConfirm();

  async function toggle() {
    if (open && dirty) {
      const ok = await confirm({
        title: "Discard unsaved changes?",
        message: "You've started writing in this section. Closing it will lose what you've typed.",
        confirmLabel: "Discard",
        danger: true,
      });
      if (!ok) return;
      onDirtyChange?.(false);
    }
    setOpen((v) => !v);
  }

  return (
    <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center gap-3 px-6 py-4 text-left"
        aria-expanded={open}
      >
        {icon && <span className="text-zru-green">{icon}</span>}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-lg font-black uppercase text-rich-black">{title}</h2>
            {typeof count === "number" && count > 0 && (
              <span className="rounded-full bg-zru-green/10 px-2 py-0.5 text-[10px] font-black text-zru-green">{count}</span>
            )}
            {dirty && (
              <span className="h-2 w-2 rounded-full bg-amber-500" title="Unsaved changes" />
            )}
          </div>
          {description && <p className="mt-0.5 truncate text-xs text-black/50">{description}</p>}
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-black/40 transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="border-t border-black/5 p-6">{children}</div>}
    </section>
  );
}
