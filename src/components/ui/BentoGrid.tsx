import React from 'react';
import { motion } from 'framer-motion';

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
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className={`bento-card group/bento p-6 flex flex-col justify-between relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
