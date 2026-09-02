"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundGridProps {
  children?: React.ReactNode;
  className?: string;
}

export function BackgroundGrid({ children, className = "" }: BackgroundGridProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {/* SVG Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-35 dark:opacity-20 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:36px_36px]"
      />

      {/* Radial Glow Gradient Vignette */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/12 via-teal-500/5 to-transparent"
      />

      {/* Subtle Ambient Orbs - Rendered on tablet/desktop to save mobile GPU */}
      <div className="hidden sm:block pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[100px] rounded-full -z-10" />
      <div className="hidden sm:block pointer-events-none absolute top-3/4 right-10 w-[400px] h-[250px] bg-teal-500/10 blur-[80px] rounded-full -z-10" />

      {children}
    </div>
  );
}
