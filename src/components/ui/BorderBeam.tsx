"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className = "",
  duration = 6,
  borderWidth = 1.5,
  colorFrom = "#10b981", // Emerald 500
  colorTo = "#06b6d4",   // Cyan 500
  delay = 0,
}: BorderBeamProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        padding: `${borderWidth}px`,
        animationDuration: `${duration}s`,
        animationDelay: `-${delay}s`,
      }}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-0",
        className
      )}
    >
      <span
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${colorFrom} 40deg, ${colorTo} 80deg, transparent 120deg)`,
        }}
        className="absolute -inset-[150%] block animate-spin [animation-duration:inherit] [animation-delay:inherit] will-change-transform"
      />
      <span className="absolute inset-[1.5px] rounded-[inherit] bg-slate-950/90 block z-0 backdrop-blur-md" />
    </span>
  );
}
