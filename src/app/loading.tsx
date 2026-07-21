import React from "react";

// Minimal, silent loading boundary so route transitions do not trigger the full-screen particle loader
export default function Loading() {
  return (
    <div className="w-full min-h-[40vh] flex items-center justify-center bg-transparent">
      <div className="w-6 h-6 border-2 border-[#006747] border-t-transparent rounded-full animate-spin opacity-40" />
    </div>
  );
}
