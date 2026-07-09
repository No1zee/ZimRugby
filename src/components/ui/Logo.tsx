import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Approved logo lockups from the ZRU / Sables brand guide.
 *
 * The guide sanctions four variations (black-on-white, white-on-black,
 * white-on-green, striped). The repository currently ships two crest assets:
 *   - `/zru logo main.svg`     full-colour crest (gold bird, red star, black wordmark)
 *   - `/zru logo monotone.svg` single-tone crest for reversed / low-contrast use
 * so the approved variations are mapped onto those two files below.
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
  width: number;
  height: number;
  priority?: boolean;
  alt?: string;
  /** Applied to the clear-space wrapper. */
  className?: string;
  /** Applied to the underlying <Image>. */
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
  priority = false,
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
      <Image
        src={VARIANT_SOURCES[variant]}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("object-contain", imageClassName)}
      />
    </span>
  );
}
