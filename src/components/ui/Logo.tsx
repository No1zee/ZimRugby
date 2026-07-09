import { cn } from "@/lib/utils";

/**
 * Approved logo lockups from the ZRU / Sables brand guide.
 *
 * The guide sanctions four variations (black-on-white, white-on-black,
 * white-on-green, striped). The repository currently ships two crest assets:
 *   - `/zru logo main.svg`     full-colour crest (gold bird, red star, black wordmark)
 *   - `/zru logo monotone.svg` single-tone crest for reversed / low-contrast use
 * so the approved variations are mapped onto those two files below.
 *
 * A plain <img> is used (rather than next/image) to match this branch's SVG
 * logo handling.
 */
export type LogoVariant =
  | "black-on-white"
  | "white-on-black"
  | "white-on-green"
  | "striped";

const VARIANT_SOURCES: Record<LogoVariant, string> = {
  "black-on-white": "/zru logo main.svg",
  "white-on-black": "/zru logo main.svg",
  "white-on-green": "/zru logo main.svg",
  striped: "/zru logo monotone.svg",
};

interface LogoProps {
  /** Which approved lockup to render for the current background. */
  variant?: LogoVariant;
  /** Intrinsic aspect ratio (used to derive min-width from minHeightPx). */
  width: number;
  height: number;
  alt?: string;
  /** Applied to the clear-space wrapper. */
  className?: string;
  /** Applied to the underlying <img>. */
  imageClassName?: string;
  /**
   * Protection zone. The guide defines clear space as the width of the
   * wordmark 'S'; here it is a proportional padding ratio of the rendered
   * logo width so the zone scales with the mark. Default ≈ 12% of width.
   */
  clearSpaceRatio?: number;
  /**
   * Minimum rendered height in px. Maps the guide's 30mm print minimum to a
   * sensible digital floor so the mark is never rendered too small to read.
   */
  minHeightPx?: number;
}

export default function Logo({
  variant = "black-on-white",
  width,
  height,
  alt = "Zimbabwe Rugby Union",
  className = "",
  imageClassName = "",
  clearSpaceRatio = 0.12,
  minHeightPx = 40,
}: LogoProps) {
  const clearSpace = Math.round(width * clearSpaceRatio);
  const minWidthPx = Math.round(minHeightPx * (width / height));

  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      style={{
        padding: clearSpace,
        minWidth: minWidthPx,
        minHeight: minHeightPx,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={VARIANT_SOURCES[variant]}
        alt={alt}
        className={cn("object-contain", imageClassName)}
      />
    </span>
  );
}
