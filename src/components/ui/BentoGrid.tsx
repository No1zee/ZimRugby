import React from 'react';

export function BentoGrid({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-7xl mx-auto w-full ${className}`}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bento-card group/bento p-6 flex flex-col justify-between ${className}`}
    >
      {children}
    </div>
  );
}
