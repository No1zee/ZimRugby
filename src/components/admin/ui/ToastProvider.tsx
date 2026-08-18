"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
  durationMs?: number;
}

interface ToastItem {
  id: number;
  type: ToastType;
  text: string;
  action?: ToastAction;
}

interface ToastContextValue {
  toast: (text: string, type?: ToastType, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const STYLES: Record<ToastType, string> = {
  success: "border-zru-green/40 bg-zru-green text-white",
  error: "border-red-500/40 bg-red-600 text-white",
  info: "border-black/20 bg-rich-black text-white",
};

const ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 shrink-0" />,
  error: <XCircle className="h-4 w-4 shrink-0" />,
  info: <Info className="h-4 w-4 shrink-0" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const toast = useCallback((text: string, type: ToastType = "success", action?: ToastAction) => {
    const id = nextId.current++;
    setItems((prev) => [...prev.slice(-3), { id, type, text, action }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, action ? action.durationMs ?? 10000 : 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-80 flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 text-xs font-bold shadow-lg ${STYLES[t.type]}`}
            role="status"
          >
            {ICONS[t.type]}
            <span className="min-w-0 flex-1">{t.text}</span>
            {t.action && (
              <button
                onClick={t.action.onClick}
                className="shrink-0 rounded-md border border-white/40 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white transition-colors hover:bg-white/20"
              >
                {t.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
