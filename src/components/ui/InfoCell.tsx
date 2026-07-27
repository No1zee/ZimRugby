import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCellProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  highlighted?: boolean;
}

export default function InfoCell({
  icon: Icon,
  label,
  value,
  highlighted,
}: InfoCellProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 shadow-card border transition-all duration-300",
        highlighted
          ? "bg-gradient-to-br from-[#00704D] to-[#005238] border-transparent text-white"
          : "bg-white border-black/5 hover:border-green-primary/20 text-rich-black"
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5 mb-3",
          highlighted ? "text-accent-teal" : "text-green-primary/60"
        )}
        strokeWidth={2}
      />
      <p
        className={cn(
          "text-[10px] uppercase tracking-wider mb-1",
          highlighted ? "text-white/70" : "text-black/40"
        )}
      >
        {label}
      </p>
      <div
        className={cn(
          "font-heading not-italic font-black tabular-nums",
          highlighted ? "text-3xl" : "text-base"
        )}
      >
        {value}
      </div>
    </div>
  );
}
