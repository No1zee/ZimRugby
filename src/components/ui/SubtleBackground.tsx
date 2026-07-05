"use client";

import React from "react";
import EdgyGradient from "./EdgyGradient";

interface SubtleBackgroundProps {
  className?: string;
  opacity?: number;
}

export default function SubtleBackground({ 
  className = "",
  opacity = 0.45
}: SubtleBackgroundProps) {
  return (
    <EdgyGradient className={className} opacity={opacity} />
  );
}
