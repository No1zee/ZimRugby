import type { ReactNode } from "react";

type Tone = "green" | "amber" | "blue" | "red" | "grey" | "teal" | "dark";

const TONES: Record<Tone, string> = {
  green: "bg-green-100 text-green-800 ring-green-600/20",
  amber: "bg-amber-100 text-amber-800 ring-amber-600/20",
  blue: "bg-blue-100 text-blue-800 ring-blue-600/20",
  red: "bg-red-100 text-red-800 ring-red-600/20",
  grey: "bg-neutral-100 text-neutral-700 ring-neutral-600/20",
  teal: "bg-teal-100 text-teal-800 ring-teal-600/20",
  dark: "bg-rich-black text-white ring-rich-black/30",
};

function toneFor(status: string): Tone {
  const s = (status || "").toLowerCase();
  if (["published", "active", "running", "live", "complete", "completed", "enabled", "featured", "winner", "true", "1", "on"].includes(s)) return "green";
  if (["in_review", "pending", "onboarding"].includes(s)) return "amber";
  if (["draft", "review", "disabled", "false", "0", "off"].includes(s)) return "grey";
  if (["approved"].includes(s)) return "teal";
  if (["scheduled", "upcoming", "future"].includes(s)) return "blue";
  if (["final", "full_time", "closed", "cancelled", "expired"].includes(s)) return "red";
  if (["fixture", "open", "archived"].includes(s)) return "dark";
  return "grey";
}

const LABELS: Record<string, string> = {
  published: "Live",
  draft: "Draft",
  in_review: "In review",
  approved: "Approved",
  archived: "Archived",
  scheduled: "Scheduled",
  upcoming: "Scheduled",
  future: "Scheduled",
  expired: "Archived",
  cancelled: "Cancelled",
  completed: "Completed",
  final: "Completed",
  active: "Active",
  running: "Running",
  live: "Live",
  pending: "In review",
  review: "In review",
  enabled: "On",
  disabled: "Off",
};

function displayStatus(status: string): string {
  const s = (status || "").toLowerCase();
  if (s === "true" || s === "1") return "On";
  if (s === "false" || s === "0") return "Off";
  return LABELS[s] ?? status;
}

export default function StatusChip({ status, label }: { status: string; label?: string }) {
  const tone = toneFor(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label ?? displayStatus(status) ?? "—"}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
      {icon ? <div className="mb-2 text-neutral-400">{icon}</div> : null}
      <p className="text-sm font-medium text-neutral-700">{title}</p>
      {hint ? <p className="mt-1 max-w-sm text-xs text-neutral-500">{hint}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
