import React from 'react';
import Link from 'next/link';

interface SlantedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function SlantedButton({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: SlantedButtonProps) {
  const resolvedVariant = variant === 'outline' ? 'secondary' : variant;

  const baseClasses = "inline-flex items-center justify-center font-heading tracking-wider uppercase transition-all duration-300 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zru-green disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-6 py-2 text-base",
    md: "px-10 py-3 text-xl",
    lg: "px-12 py-4 text-2xl"
  };

  const spinner = (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  const isDisabled = isLoading || disabled;

  const content = (
    <>
      {isLoading ? spinner : leftIcon ? <span className="mr-2">{leftIcon}</span> : null}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </>
  );

  function renderGhost() {
    const ghostClasses = `${baseClasses} bg-transparent text-white hover:text-zru-green gap-1.5 ${sizeClasses[size]} ${className}`;
    if (href) {
      return <Link href={href} className={ghostClasses} onClick={isDisabled ? (e) => e.preventDefault() : undefined}>{content}</Link>;
    }
    return <button className={ghostClasses} disabled={isDisabled} {...props}>{content}</button>;
  }

  function renderPrimary() {
    const primaryClasses = `${baseClasses} bg-gradient-to-b from-[#00704D] to-[#005238] text-white hover:from-[#005238] hover:to-[#004522] border-0 shadow-md hover:shadow-xl shadow-[#006747]/25 clip-slanted ${sizeClasses[size]} ${className}`;
    if (href) {
      return <Link href={href} className={primaryClasses} onClick={isDisabled ? (e) => e.preventDefault() : undefined}>{content}</Link>;
    }
    return <button className={primaryClasses} disabled={isDisabled} {...props}>{content}</button>;
  }

  function renderSecondary() {
    const outerClasses = `inline-flex p-[1px] clip-slanted bg-white/30 hover:bg-white transition-colors duration-300 group ${className} ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`;
    const innerClasses = `w-full h-full bg-rich-black group-hover:bg-transparent text-white group-hover:text-rich-black clip-slanted flex items-center justify-center transition-colors duration-300 ${sizeClasses[size]}`;
    if (href) {
      return (
        <Link href={href} className={outerClasses} onClick={isDisabled ? (e) => e.preventDefault() : undefined}>
          <span className={innerClasses}>{content}</span>
        </Link>
      );
    }
    return (
      <button className={outerClasses} disabled={isDisabled} {...props}>
        <span className={innerClasses}>{content}</span>
      </button>
    );
  }

  if (resolvedVariant === 'ghost') return renderGhost();
  if (resolvedVariant === 'primary') return renderPrimary();
  return renderSecondary();
}
