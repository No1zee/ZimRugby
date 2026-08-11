"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

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

  const ACTIONS: { id: AiAction; label: string; emoji: string; hint: string }[] = [
    { id: "general", label: "Press release draft", emoji: "📰", hint: "Write an official ZRU press release from bullet points." },
    { id: "match_summary", label: "Match recap", emoji: "🏉", hint: "Turn raw scores into a match recap." },
    { id: "tags", label: "SEO tags", emoji: "🏷️", hint: "Generate search tags for an article." },
  ];

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-black text-white">
            <Sparkles className="h-5 w-5 text-emerald-400" /> AI Writer
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Draft press releases, match recaps or SEO tags to paste into your article.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAction(a.id)}
            title={a.hint}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              action === a.id
                ? "bg-[#006B3F] text-white shadow-md shadow-[#006B3F]/20"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {a.emoji} {a.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-zinc-300">Prompt / bullet points</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Sables win 32-15 against Namibia in Harare. Brilliant midfield display…"
          rows={4}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-white placeholder:text-zinc-600 focus:border-[#006B3F] focus:outline-none"
        />
      </div>

      <button
        onClick={() => run(prompt, action)}
        disabled={loading || !prompt.trim()}
        className="flex items-center gap-2 rounded-xl bg-[#006B3F] px-6 py-3 text-xs font-bold tracking-wider text-white shadow-md shadow-[#006B3F]/20 transition-all hover:bg-emerald-600 disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            Writing…
          </>
        ) : (
          <>✨ Generate draft</>
        )}
      </button>

      {output && (
        <div className="space-y-3 border-t border-zinc-800 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">Draft</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs font-semibold text-emerald-400 hover:underline"
            >
              Copy
            </button>
          </div>
          <div className="whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-200">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
