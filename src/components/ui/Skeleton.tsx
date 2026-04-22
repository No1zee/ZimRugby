"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`relative overflow-hidden bg-white/5 rounded-lg ${className}`}>
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 p-4 border border-white/10 rounded-2xl bg-white/5">
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
    </div>
  );
}
export function TableSkeleton() {
  return (
    <div className="space-y-4 border border-white/10 rounded-2xl bg-white/5 p-4">
      <div className="flex justify-between border-b border-white/10 pb-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-12" />
        ))}
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
           <div className="flex items-center gap-4 flex-1">
             <Skeleton className="h-8 w-8 rounded-full" />
             <Skeleton className="h-6 w-32" />
           </div>
           <div className="flex gap-8">
             <Skeleton className="h-4 w-8" />
             <Skeleton className="h-4 w-8" />
             <Skeleton className="h-4 w-8" />
           </div>
        </div>
      ))}
    </div>
  );
}
