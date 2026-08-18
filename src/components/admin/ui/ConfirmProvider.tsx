"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

interface PromptOptions {
  title: string;
  message?: string;
  label: string;
  placeholder?: string;
  confirmLabel?: string;
}

interface ConfirmState extends ConfirmOptions {
  resolve: (ok: boolean) => void;
}

interface PromptState extends PromptOptions {
  value: string;
  resolve: (value: string | null) => void;
}

const ConfirmContext = createContext<(opts: ConfirmOptions) => Promise<boolean>>(async () => false);
const PromptContext = createContext<(opts: PromptOptions) => Promise<string | null>>(async () => null);

export function useConfirm() {
  return useContext(ConfirmContext);
}

export function usePrompt() {
  return useContext(PromptContext);
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);
  const [promptState, setPromptState] = useState<PromptState | null>(null);
  const resolver = useRef<(ok: boolean) => void>(() => {});
  const promptResolver = useRef<(value: string | null) => void>(() => {});

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
      setState({ ...opts, resolve });
    });
  }, []);

  const prompt = useCallback((opts: PromptOptions) => {
    return new Promise<string | null>((resolve) => {
      promptResolver.current = resolve;
      setPromptState({ ...opts, value: "", resolve });
    });
  }, []);

  const close = (ok: boolean) => {
    resolver.current(ok);
    setState(null);
  };

  const closePrompt = (value: string | null) => {
    promptResolver.current(value);
    setPromptState(null);
  };

return (
    <ConfirmContext.Provider value={confirm}>
      <PromptContext.Provider value={prompt}>
        {children}
        {state && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4" onClick={() => close(false)}>
            <div
              className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="alertdialog"
              aria-modal="true"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    state.danger ? "bg-red-500/10 text-red-600" : "bg-black/5 text-black/60"
                  }`}
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-black uppercase text-rich-black">{state.title}</h3>
                  <p className="mt-1 text-xs text-black/60">{state.message}</p>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => close(false)}
                  className="rounded-lg bg-black/5 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => close(true)}
                  className={`rounded-lg px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors ${
                    state.danger ? "bg-red-600 hover:bg-red-700" : "bg-zru-green hover:bg-green-800"
                  }`}
                >
                  {state.confirmLabel || "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
        {promptState && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
            <div
              className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <h3 className="font-heading text-base font-black uppercase text-rich-black">{promptState.title}</h3>
              {promptState.message ? <p className="mt-1 text-xs text-black/60">{promptState.message}</p> : null}
              <label className="mt-4 block">
                <span className="mb-1 block text-[11px] font-black uppercase tracking-wider text-black/50">
                  {promptState.label}
                </span>
                <textarea
                  value={promptState.value}
                  onChange={(e) => setPromptState((p) => (p ? { ...p, value: e.target.value } : p))}
                  placeholder={promptState.placeholder}
                  rows={3}
                  autoFocus
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs text-rich-black outline-none transition-colors focus:border-zru-green"
                />
              </label>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => closePrompt(null)}
                  className="rounded-lg bg-black/5 px-4 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-black/60 transition-colors hover:bg-black/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => closePrompt(promptState.value.trim())}
                  disabled={!promptState.value.trim()}
                  className="rounded-lg bg-zru-green px-5 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-green-800 disabled:opacity-50"
                >
                  {promptState.confirmLabel || "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </PromptContext.Provider>
    </ConfirmContext.Provider>
  );
}
