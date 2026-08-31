"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  badge,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-2xl transition duration-300 shadow-input dark:shadow-none p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl justify-between flex flex-col space-y-4 hover:border-emerald-500/40 relative overflow-hidden",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1.5 transition duration-200 relative z-20">
        <div className="flex items-center justify-between gap-2 mb-2">
          {icon}
          {badge && (
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {badge}
            </span>
          )}
        </div>
        <div className="font-extrabold text-slate-900 dark:text-slate-100 text-base mb-1.5">
          {title}
        </div>
        <div className="font-normal text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}
