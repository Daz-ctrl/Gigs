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
  borderWidth = 2,
  colorFrom = "#10b981", // Emerald 500
  colorTo = "#06b6d4",   // Cyan 500
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-0",
        className
      )}
    >
      {/* Primary Crisp LED Beam */}
      <div
        style={{
          padding: `${borderWidth}px`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        className="absolute inset-0 rounded-[inherit] overflow-hidden"
      >
        <div
          style={{
            animationDuration: `${duration}s`,
            animationDelay: `-${delay}s`,
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 40deg, ${colorFrom} 75deg, ${colorTo} 115deg, transparent 150deg, transparent 360deg)`,
          }}
          className="absolute -inset-[150%] animate-spin will-change-transform rounded-full filter blur-[1px]"
        />
      </div>

      {/* Soft Ambient Neon Glow Trace */}
      <div
        style={{
          padding: `${borderWidth + 1.5}px`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        className="absolute inset-0 rounded-[inherit] overflow-hidden opacity-50"
      >
        <div
          style={{
            animationDuration: `${duration}s`,
            animationDelay: `-${delay}s`,
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 35deg, ${colorFrom} 75deg, ${colorTo} 115deg, transparent 155deg, transparent 360deg)`,
          }}
          className="absolute -inset-[150%] animate-spin will-change-transform rounded-full filter blur-[3px]"
        />
      </div>
    </div>
  );
}
