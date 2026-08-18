"use client";

import { useState } from "react";
import { Sparkles, Newspaper, Trophy, Tag } from "lucide-react";

type AiAction = "general" | "match_summary" | "tags";

export default function AiAssistantPanel() {
  const [prompt, setPrompt] = useState("");
  const [action, setAction] = useState<AiAction>("general");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(p: string, a: AiAction) {
    if (!p.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p, action: a }),
      });
      const data = await res.json();
      setOutput(data.result ? String(data.result) : data.error ? `Error: ${data.error}` : "");
    } catch (err) {
      setOutput(`Failed to contact the AI writer: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  const ACTIONS: { id: AiAction; label: string; icon: any; hint: string }[] = [
    { id: "general", label: "Press release draft", icon: Newspaper, hint: "Write an official ZRU press release from bullet points." },
    { id: "match_summary", label: "Match recap", icon: Trophy, hint: "Turn raw scores into a match recap." },
    { id: "tags", label: "SEO tags", icon: Tag, hint: "Generate search tags for an article." },
  ];

  return (
    <div className="space-y-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-black/5 pb-4">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-xl font-black uppercase text-rich-black">
            <Sparkles className="h-5 w-5 text-zru-green" /> Drafting Assistant
          </h2>
          <p className="mt-1 text-xs text-black/60">
            Draft press releases, match recaps or SEO tags to paste into your article.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              onClick={() => setAction(a.id)}
              title={a.hint}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-[background-color,color,box-shadow] duration-200 ${
                action === a.id
                  ? "bg-[#006B3F] text-white shadow-md shadow-[#006B3F]/20"
                  : "bg-black/5 text-black/70 hover:bg-black/10 hover:text-black"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{a.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-black/60">Prompt / bullet points</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Sables win 32-15 against Namibia in Harare. Brilliant midfield display…"
          rows={4}
          className="w-full rounded-xl border border-black/10 bg-white p-4 text-xs text-rich-black placeholder:text-black/35 focus:border-[#006B3F] focus:outline-none transition-[border-color] duration-200"
        />
      </div>

      <button
        onClick={() => run(prompt, action)}
        disabled={loading || !prompt.trim()}
        className="inline-flex items-center gap-2 rounded-xl bg-[#006B3F] px-6 py-3 text-xs font-heading font-black uppercase tracking-wider text-white shadow-sm transition-[background-color,box-shadow] duration-200 hover:bg-[#006B3F]/90 disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <span>Writing…</span>
          </>
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate draft</span>
          </>
        )}
      </button>

      {output && (
        <div className="space-y-3 border-t border-black/5 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-black/60">Draft</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs font-bold uppercase tracking-wider text-zru-green hover:underline"
            >
              Copy
            </button>
          </div>
          <div className="whitespace-pre-wrap rounded-xl border border-black/10 bg-black/5 p-4 font-mono text-xs leading-relaxed text-rich-black">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
