import React from 'react';
import Link from 'next/link';

interface SlantedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
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
  const baseClasses = "inline-flex items-center justify-center font-heading tracking-wider uppercase transition-colors duration-300";
  
  const sizeClasses = {
    sm: "px-6 py-2 text-base clip-slanted-sm",
    md: "px-10 py-3 text-xl clip-slanted",
    lg: "px-12 py-4 text-2xl clip-slanted"
  };

  const variantClasses = {
    primary: "bg-white text-rich-black hover:bg-zru-green hover:text-white",
    secondary: "bg-zru-green text-white hover:bg-white hover:text-rich-black",
    outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-rich-black"
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
       {children}
    </button>
  );
}
