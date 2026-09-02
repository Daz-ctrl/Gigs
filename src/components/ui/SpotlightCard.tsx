"use client";

import React, { useRef, useCallback } from "react";
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
  spotlightColor = "rgba(16, 185, 129, 0.15)", // Emerald highlight
  borderBeam,
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!divRef.current) return;
    divRef.current.style.setProperty("--spotlight-opacity", "1");
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!divRef.current) return;
    divRef.current.style.setProperty("--spotlight-opacity", "0");
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--mouse-x": "-999px",
          "--mouse-y": "-999px",
          "--spotlight-opacity": "0",
          "--spotlight-color": spotlightColor,
        } as React.CSSProperties
      }
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700",
        className
      )}
      {...props}
    >
      {/* 1. Full-size BorderBeam anchored directly to the card's outer perimeter (outside padding) */}
      {borderBeam}

      {/* 2. Zero-re-render GPU-accelerated CSS Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10 [opacity:var(--spotlight-opacity)]"
        style={{
          background: `radial-gradient(450px circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)`,
        }}
      />

      {/* 3. Card Content: safely padded away from the border beam */}
      <div className="z-20 h-full flex flex-col justify-between pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
