import { cn } from "@/lib/utils";

/**
 * Slanted brand divider used to break up long inner-page sections.
 * Renders a thin angled rule with a solid green leading segment,
 * echoing the athletic slant language used on CTAs and the hero.
 */
export default function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative flex items-center gap-3 my-16 sm:my-20", className)}>
      <div className="h-1.5 w-24 sm:w-36 bg-zru-green clip-slanted-sm" />
      <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
    </div>
  );
}
