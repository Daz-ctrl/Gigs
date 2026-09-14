"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundGridProps {
  children?: React.ReactNode;
  className?: string;
}

export function BackgroundGrid({ children, className = "" }: BackgroundGridProps) {
  return (
    <div className={cn("relative w-full overflow-hidden bg-[#FAF8F5]", className)}>
      {/* Government Architectural Subtle Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-60 [background-image:linear-gradient(to_right,#0B25450C_1px,transparent_1px),linear-gradient(to_bottom,#0B25450C_1px,transparent_1px)] [background-size:36px_36px]"
      />

      {/* Warm Saffron & Ivory Ambient Glow Vignette */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/8 via-orange-500/3 to-transparent"
      />

      {/* Subtle Ambient Orbs */}
      <div className="hidden sm:block pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/5 blur-[100px] rounded-full -z-10" />
      <div className="hidden sm:block pointer-events-none absolute top-3/4 right-10 w-[400px] h-[250px] bg-blue-500/5 blur-[80px] rounded-full -z-10" />

      {children}
    </div>
  );
}
