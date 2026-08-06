import React from "react";
import SlantedButton from "@/components/ui/SlantedButton";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "chip";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  href?: string;
  white?: boolean;
  active?: boolean;
  tone?: "light" | "dark";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}

const variantMap: Record<string, "primary" | "secondary" | "outline" | "ghost" | "chip"> = {
  primary: "primary",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  link: "ghost",
};

const sizeMap: Record<string, "xs" | "sm" | "md" | "lg"> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  white,
  active,
  tone,
  isLoading,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <SlantedButton
      href={href}
      variant={variantMap[variant]}
      size={sizeMap[size]}
      white={white}
      active={active}
      tone={tone}
      isLoading={isLoading}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      className={className}
      {...props}
    >
      {children}
    </SlantedButton>
  );
}
