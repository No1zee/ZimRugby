import React from "react";

export interface SectionTitleProps {
  /** Main heading text or custom node */
  title?: React.ReactNode;
  /** Primary title text when using standard string mode */
  text?: string;
  /** Highlighted accent word appended/embedded */
  accent?: string;
  /** Subtitle / Tagline below heading */
  subtitle?: string;
  /** Category badge above heading */
  badge?: string;
  /** 
   * Color variant for the slanted background plate:
   * - "dark": Dark green tint plate for light backgrounds (default)
   * - "light": White/translucent plate for dark green/black backgrounds
   * - "none": Standard text without background plate
   */
  variant?: "dark" | "light" | "none";
  /** Alignment */
  align?: "left" | "center" | "right";
  /** Size scale */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional extra container class */
  className?: string;
}

const SIZE_CLASSES = {
  sm: "text-2xl sm:text-3xl",
  md: "text-3xl sm:text-4xl lg:text-5xl",
  lg: "text-4xl sm:text-5xl lg:text-6xl",
  xl: "text-5xl sm:text-6xl lg:text-7xl",
};

export default function SectionTitle({
  title,
  text,
  accent,
  subtitle,
  badge,
  variant = "dark",
  align = "left",
  size = "md",
  className = "",
}: SectionTitleProps) {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  }[align];

  const plateClass =
    variant === "dark"
      ? "heading-plate"
      : variant === "light"
      ? "heading-plate heading-plate-light"
      : "";

  const headingTextColor = variant === "light" ? "text-white" : "text-rich-black";

  return (
    <div className={`flex flex-col ${alignClasses} ${className}`}>
      {badge && (
        <span className="inline-block px-3 py-1 bg-[#006747]/10 text-[#006747] text-[10px] font-black uppercase tracking-widest rounded-full mb-3 border border-[#006747]/20">
          {badge}
        </span>
      )}

      <div className={plateClass}>
        <h2 className={`${sizeClass} font-heading font-black uppercase tracking-wide sm:tracking-widest ${headingTextColor} not-italic leading-[1.05]`}>
          {title ? (
            title
          ) : (
            <>
              {text}{" "}
              {accent && <span className="text-accent-teal">{accent}</span>}
            </>
          )}
        </h2>
      </div>

      {subtitle && (
        <p className="text-xs sm:text-sm lg:text-base text-neutral-mid font-medium tracking-wide mt-2.5 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
