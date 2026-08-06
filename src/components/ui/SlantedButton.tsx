import React from 'react';
import Link from 'next/link';

interface SlantedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'chip';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  white?: boolean;
  active?: boolean;
  tone?: 'light' | 'dark';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function SlantedButton({
  href,
  variant = 'primary',
  size = 'md',
  white = false,
  active = false,
  tone = 'light',
  className = '',
  isLoading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: SlantedButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-heading tracking-wider uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zru-green";

  const sizeClasses = {
    xs: "px-5 py-2 text-[10px]",
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
    const ghostClasses = `${baseClasses} bg-transparent text-white hover:text-zru-green gap-1.5 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`;
    if (href) {
      return <Link href={href} className={ghostClasses} onClick={isDisabled ? (e) => e.preventDefault() : undefined}>{content}</Link>;
    }
    return <button className={ghostClasses} disabled={isDisabled} {...props}>{content}</button>;
  }

  function renderPrimary() {
    /* Edge Plaque — button with a dark slanted plate offset behind it.
       Hover lifts the button and slides the plate further out; press sinks
       the button into the plate. Disabled fades the whole stack uniformly.
       The `white` variant flips the face to white-on-green with a deeper
       plaque (#005238), matching the approved "Become a Partner" CTA. */
    const plaqueTone = white ? 'bg-[#005238]' : 'bg-[#003D20]';
    const faceTone = white
      ? 'bg-white text-[#006747] hover:bg-white/90 border-t-white/60'
      : 'bg-gradient-to-b from-[#00704D] to-[#005238] hover:from-[#006747] hover:to-[#00402B] text-white border-t border-white/20';
    const wrapperClasses = `relative inline-flex group has-[:disabled]:opacity-60 ${className}`;
    const plaqueClasses = `absolute inset-0 z-0 clip-slanted ${plaqueTone} translate-x-[5px] translate-y-[5px] transition-transform duration-200 group-hover:translate-x-[7px] group-hover:translate-y-[7px] group-active:translate-x-[3px] group-active:translate-y-[3px] ${isDisabled ? 'opacity-0' : ''}`;
    const innerClasses = `relative z-10 w-full clip-slanted ${faceTone} shadow-[0_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 group-hover:-translate-y-px group-active:translate-x-[2px] group-active:translate-y-[2px] disabled:cursor-not-allowed ${sizeClasses[size]} ${white ? '' : className}`;
    const inner = (
      <span className={innerClasses}>{content}</span>
    );
    if (href) {
      return (
        <span className={wrapperClasses}>
          <span aria-hidden className={plaqueClasses} />
          <Link href={href} className="relative z-10 w-full inline-flex" onClick={isDisabled ? (e) => e.preventDefault() : undefined}>
            {inner}
          </Link>
        </span>
      );
    }
    return (
      <span className={wrapperClasses}>
        <span aria-hidden className={plaqueClasses} />
        <button className="relative z-10 w-full inline-flex" disabled={isDisabled} {...props}>
          {inner}
        </button>
      </span>
    );
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

  function renderOutline() {
    /* Glass-free outlined key — translucent face with edge-light border.
       Reads on dark backgrounds; callers override border/text via className
       for light surfaces. No plaque: the outline is the elevation. */
    const outlineClasses = `${baseClasses} clip-slanted border border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200 hover:-translate-y-px active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`;
    if (href) {
      return <Link href={href} className={outlineClasses} onClick={isDisabled ? (e) => e.preventDefault() : undefined}>{content}</Link>;
    }
    return <button className={outlineClasses} disabled={isDisabled} {...props}>{content}</button>;
  }

  function renderChip() {
    /* Compact filter/tab pill — flat, no plaque (chips sit in crowded rows). */
    const inactive = tone === 'dark'
      ? 'text-white/60 hover:text-white hover:bg-zru-green/10'
      : 'text-black/60 hover:text-black hover:bg-black/5';
    const chipClasses = `inline-flex items-center justify-center gap-2 clip-slanted-sm px-5 py-2.5 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${active ? 'bg-zru-green text-white shadow-md shadow-zru-green/25' : inactive} ${isDisabled ? 'opacity-50 pointer-events-none' : ''} ${className}`;
    if (href) {
      return <Link href={href} className={chipClasses} onClick={isDisabled ? (e) => e.preventDefault() : undefined}>{content}</Link>;
    }
    return <button className={chipClasses} disabled={isDisabled} {...props}>{content}</button>;
  }

  switch (variant) {
    case 'ghost':
      return renderGhost();
    case 'outline':
      return renderOutline();
    case 'chip':
      return renderChip();
    case 'primary':
      return renderPrimary();
    default:
      return renderSecondary();
  }
}
