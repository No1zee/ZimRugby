import React from "react";

/**
 * ZRU Homepage loading skeleton.
 * Mimics layout flow to avoid layout shift (CLS) and provide premium loading aesthetics.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-rich-black text-white relative overflow-hidden">
      {/* 1. Hero Skeleton */}
      <div className="relative h-[80vh] md:h-[90vh] w-full bg-neutral-900/50 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-rich-black/20 via-transparent to-rich-black z-10" />
        <div className="w-16 h-16 rounded-full border-4 border-zru-green border-t-transparent animate-spin z-20" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 space-y-24 py-16">
        
        {/* 2. Match Centre Strip Skeleton */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-white/10 pb-4">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-white/10 rounded-sm animate-pulse" />
              <div className="h-8 w-48 bg-white/15 rounded-md animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-16 bg-white/10 rounded-sm" />
                  <div className="h-4 w-12 bg-white/10 rounded-sm" />
                </div>
                <div className="flex items-center justify-between my-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                    <div className="h-4 w-16 bg-white/10 rounded-sm" />
                  </div>
                  <div className="h-4 w-8 bg-white/15 rounded-sm" />
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-16 bg-white/10 rounded-sm" />
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="h-3 w-32 bg-white/10 rounded-sm self-center" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. News Bento Grid Skeleton */}
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="h-3 w-20 bg-white/10 rounded-sm animate-pulse" />
              <div className="h-10 w-64 bg-white/15 rounded-md animate-pulse" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-20 bg-white/10 rounded-sm animate-pulse" />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Hero card skeleton */}
            <div className="lg:col-span-1 h-[524px] rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col justify-end space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-5 w-16 bg-zru-green/30 rounded-sm" />
                <div className="h-3 w-20 bg-white/10 rounded-sm" />
              </div>
              <div className="h-8 w-full bg-white/15 rounded-md" />
              <div className="h-8 w-2/3 bg-white/15 rounded-md" />
              <div className="h-4 w-full bg-white/10 rounded-sm" />
              <div className="h-4 w-3/4 bg-white/10 rounded-sm" />
              <div className="h-4 w-28 bg-white/20 rounded-sm pt-2" />
            </div>
            
            {/* Right side secondary grid skeletons */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-[250px] rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col justify-end space-y-3 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-14 bg-zru-green/20 rounded-sm" />
                    <div className="w-1 h-1 bg-white/20" />
                    <div className="h-3 w-16 bg-white/10 rounded-sm" />
                  </div>
                  <div className="h-6 w-full bg-white/15 rounded-md" />
                  <div className="h-6 w-5/6 bg-white/15 rounded-md" />
                </div>
              ))}
              <div className="md:col-span-2 h-[250px] rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col justify-end space-y-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-14 bg-zru-green/20 rounded-sm" />
                  <div className="w-1 h-1 bg-white/20" />
                  <div className="h-3 w-16 bg-white/10 rounded-sm" />
                </div>
                <div className="h-6 w-3/4 bg-white/15 rounded-md" />
                <div className="h-6 w-1/2 bg-white/15 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Store Preview Strip Skeleton */}
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="h-3 w-20 bg-white/10 rounded-sm animate-pulse" />
              <div className="h-10 w-52 bg-white/15 rounded-md animate-pulse" />
            </div>
            <div className="h-12 w-40 bg-white/10 rounded-sm animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col justify-between animate-pulse">
                <div className="h-44 w-full bg-white/10 rounded-xl" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 w-2/3 bg-white/15 rounded-sm" />
                  <div className="h-3 w-1/2 bg-white/10 rounded-sm" />
                </div>
                <div className="h-4 w-12 bg-white/20 rounded-sm mt-2" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
