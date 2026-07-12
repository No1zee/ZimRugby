import React from 'react';
import Link from 'next/link';

interface SlantedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function SlantedButton({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: SlantedButtonProps) {
  // Map legacy 'outline' to 'secondary'
  const resolvedVariant = variant === 'outline' ? 'secondary' : variant;

  const baseClasses = "inline-flex items-center justify-center font-heading tracking-wider uppercase transition-all duration-300";
  
  const sizeClasses = {
    sm: "px-6 py-2 text-base",
    md: "px-10 py-3 text-xl",
    lg: "px-12 py-4 text-2xl"
  };

  // 1. Ghost Variant
  if (resolvedVariant === 'ghost') {
    const ghostClasses = `${baseClasses} bg-transparent text-white hover:text-zru-green gap-1.5 ${sizeClasses[size]} ${className}`;
    if (href) {
      return (
        <Link href={href} className={ghostClasses}>
          {children}
        </Link>
      );
    }
    return (
      <button className={ghostClasses} {...props}>
        {children}
      </button>
    );
  }

  // 2. Primary Variant (Green filled)
  if (resolvedVariant === 'primary') {
    const primaryClasses = `${baseClasses} bg-zru-green text-white hover:bg-white hover:text-rich-black border border-zru-green hover:border-white shadow-md shadow-zru-green/20 clip-slanted ${sizeClasses[size]} ${className}`;
    if (href) {
      return (
        <Link href={href} className={primaryClasses}>
          {children}
        </Link>
      );
    }
    return (
      <button className={primaryClasses} {...props}>
        {children}
      </button>
    );
  }

  // 3. Secondary Variant (White outline - double slanted nested wrapper to avoid clipped borders)
  const outerClasses = `inline-flex p-[1px] clip-slanted bg-white/30 hover:bg-white transition-colors duration-300 group ${className}`;
  const innerClasses = `w-full h-full bg-rich-black group-hover:bg-transparent text-white group-hover:text-rich-black clip-slanted flex items-center justify-center transition-colors duration-300 ${sizeClasses[size]}`;

  if (href) {
    return (
      <Link href={href} className={outerClasses}>
        <span className={innerClasses}>
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button className={outerClasses} {...props}>
      <span className={innerClasses}>
        {children}
      </span>
    </button>
  );
}
