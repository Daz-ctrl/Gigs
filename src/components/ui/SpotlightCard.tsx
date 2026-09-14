"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderBeam?: React.ReactNode;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor,
  borderBeam,
  ...props
}: SpotlightCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border-2 border-[#7D684F]/35 bg-[#CBB89D] shadow-md shadow-[#7D684F]/15",
        className
      )}
      {...props}
    >
      {/* 1. Optional BorderBeam */}
      {borderBeam}

      {/* 2. Card Content */}
      <div className="relative z-10 h-full w-full pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
