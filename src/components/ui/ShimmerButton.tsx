"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  shimmerColor?: string;
  className?: string;
}

export function ShimmerButton({
  children,
  shimmerColor = "#ffffff",
  className = "",
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 animate-shimmer items-center justify-center rounded-2xl border border-emerald-500/30 bg-[linear-gradient(110deg,#047857,45%,#10b981,55%,#047857)] bg-[length:200%_100%] px-6 text-xs font-bold text-white shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-103 hover:shadow-emerald-500/40 active:scale-97 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
