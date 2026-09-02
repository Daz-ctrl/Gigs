"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  duration?: number;
  borderWidth?: number;
  borderRadius?: string;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className = "",
  duration = 7,
  borderWidth = 2.5,
  borderRadius = "32px",
  colorFrom = "#10b981", // Emerald 500
  colorTo = "#06b6d4",   // Cyan 500
  delay = 0,
}: BorderBeamProps) {
  const numericRadius = parseInt(borderRadius) || 32;
  const innerRadius = `${Math.max(numericRadius - borderWidth, 4)}px`;

  return (
    <div
      aria-hidden="true"
      style={{
        borderRadius,
        contain: "paint layout", // Hardware isolate rendering so scrolling never repaints parent DOM
      }}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-0",
        className
      )}
    >
      {/* 1. Large Vibrant LED Beam (GPU-accelerated with translateZ) */}
      <div
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `-${delay}s`,
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 20deg, ${colorFrom} 60deg, ${colorTo} 115deg, transparent 155deg, transparent 360deg)`,
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
        className="absolute -inset-[150%] animate-spin will-change-transform rounded-full"
      />

      {/* 2. Soft Ambient Neon Glow Trace (Active on Desktop/Tablet, off on mobile to prevent scroll lag) */}
      <div
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `-${delay}s`,
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 15deg, ${colorFrom} 60deg, ${colorTo} 115deg, transparent 160deg, transparent 360deg)`,
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
        className="hidden sm:block absolute -inset-[150%] animate-spin will-change-transform rounded-full filter blur-[4px] opacity-60"
      />

      {/* 3. SOLID INNER SHIELD */}
      <div
        style={{
          top: `${borderWidth}px`,
          left: `${borderWidth}px`,
          right: `${borderWidth}px`,
          bottom: `${borderWidth}px`,
          borderRadius: innerRadius,
        }}
        className="absolute bg-white/95 dark:bg-[#070c16] z-10"
      />
    </div>
  );
}
