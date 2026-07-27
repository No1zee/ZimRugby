import { cn } from "@/lib/utils";

const RESULT_STYLES: Record<"W" | "L" | "D", string> = {
  W: "bg-accent-teal text-rich-black",
  L: "bg-[#E4A2A2] text-rich-black",
  D: "bg-black/20 text-white",
};

export default function RecordDots({
  record,
}: {
  record: ("W" | "L" | "D")[];
}) {
  return (
    <div className="flex gap-1.5">
      {record.map((result, i) => (
        <span
          key={i}
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
            RESULT_STYLES[result]
          )}
        >
          {result}
        </span>
      ))}
    </div>
  );
}
