"use client";

import React, { type ReactNode, type ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

export type ZruButtonVariant =
  | "primary" // White front plate, green text, hover solid ZRU green + white text
  | "solid-green" // Solid ZRU green front, hover rich black
  | "outline" // Transparent front, white border & text, hover white plate
  | "dark" // Rich black front, hover ZRU green
  | "danger"; // Red front, hover red-800

export type ZruButtonSize = "sm" | "md" | "lg";

export interface ZruButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ZruButtonVariant;
  size?: ZruButtonSize;
  href?: string;
  target?: string;
  rel?: string;
  icon?: ReactNode;
  showArrow?: boolean;
  isLoading?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<ZruButtonSize, { front: string; font: string; icon: string }> = {
  sm: {
    front: "px-5 py-2 text-[10px]",
    font: "font-black tracking-widest uppercase font-heading",
    icon: "w-3.5 h-3.5",
  },
  md: {
    front: "px-7 py-3 text-xs",
    font: "font-black tracking-widest uppercase font-heading",
    icon: "w-4 h-4",
  },
  lg: {
    front: "px-9 py-3.5 text-sm",
    font: "font-black tracking-widest uppercase font-heading",
    icon: "w-4.5 h-4.5",
  },
};

const VARIANT_CLASSES: Record<
  ZruButtonVariant,
  { front: string; shadow: string }
> = {
  primary: {
    front:
      "bg-white text-rich-black hover:bg-zru-green hover:text-white border border-white/20 hover:border-zru-green shadow-sm",
    shadow: "bg-[#003D20]",
  },
  "solid-green": {
    front:
      "bg-zru-green text-white hover:bg-rich-black hover:text-white border border-zru-green shadow-md",
    shadow: "bg-[#002815]",
  },
  outline: {
    front:
      "bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-rich-black hover:border-white backdrop-blur-xs",
    shadow: "bg-white/10",
  },
  dark: {
    front:
      "bg-rich-black text-white hover:bg-zru-green border border-white/10 hover:border-zru-green shadow-sm",
    shadow: "bg-black/40",
  },
  danger: {
    front:
      "bg-red-600 text-white hover:bg-red-700 border border-red-600 shadow-sm",
    shadow: "bg-red-950",
  },
};

export function ZruButton({
  children,
  variant = "primary",
  size = "md",
  href,
  target,
  rel,
  icon,
  showArrow = false,
  isLoading = false,
  className = "",
  disabled,
  ...buttonProps
}: ZruButtonProps) {
  const sizeConfig = SIZE_CLASSES[size];
  const variantConfig = VARIANT_CLASSES[variant];

  const content = (
    <span className={`relative inline-flex group/zrubtn select-none ${className}`}>
      {/* 1. Tactile Slanted Layered Depth Shadow Plate */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 clip-slanted ${variantConfig.shadow} translate-x-[4px] translate-y-[4px] transition-transform duration-200 group-hover/zrubtn:translate-x-[6px] group-hover/zrubtn:translate-y-[6px] group-active/zrubtn:translate-x-[2px] group-active/zrubtn:translate-y-[2px]`}
      />

      {/* 2. Front Slanted Active Button Surface */}
      <span
        className={`relative z-10 clip-slanted inline-flex items-center justify-center gap-2.5 transition-all duration-200 group-hover/zrubtn:-translate-y-px group-active/zrubtn:translate-x-[2px] group-active/zrubtn:translate-y-[2px] ${sizeConfig.front} ${sizeConfig.font} ${variantConfig.front} ${
          disabled || isLoading ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer"
        }`}
      >
        {isLoading ? (
          <Loader2 className={`${sizeConfig.icon} animate-spin`} />
        ) : icon ? (
          <span className="shrink-0 transition-transform duration-200 group-hover/zrubtn:scale-110">
            {icon}
          </span>
        ) : null}

        <span>{children}</span>

        {showArrow && !isLoading && (
          <ArrowRight
            className={`${sizeConfig.icon} transition-transform duration-200 group-hover/zrubtn:translate-x-1`}
          />
        )}
      </span>
    </span>
  );

  if (href && !disabled && !isLoading) {
    return (
      <Link href={href} target={target} rel={rel} className="inline-block">
        {content}
      </Link>
    );
  }

  return (
    <button
      type={buttonProps.type || "button"}
      disabled={disabled || isLoading}
      className="inline-block bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-zru-green rounded"
      {...buttonProps}
    >
      {content}
    </button>
  );
}

export default ZruButton;
