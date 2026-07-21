import React from "react";
import SlantedButton from "@/components/ui/SlantedButton";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}

const variantMap: Record<string, "primary" | "secondary" | "ghost"> = {
  primary: "primary",
  secondary: "secondary",
  outline: "secondary",
  ghost: "ghost",
  link: "ghost",
};

const sizeMap: Record<string, "sm" | "md" | "lg"> = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
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
