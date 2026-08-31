"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KokonutStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  variant?: "emerald" | "blue" | "purple" | "amber";
  className?: string;
}

export function KokonutStatCard({
  title,
  value,
  subtitle,
  delta,
  icon: Icon,
  variant = "emerald",
  className = "",
}: KokonutStatCardProps) {
  const variantStyles = {
    emerald: {
      bg: "hover:border-emerald-500/40 dark:hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
      glow: "from-emerald-500/10 to-transparent",
    },
    blue: {
      bg: "hover:border-blue-500/40 dark:hover:border-blue-500/40",
      iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30",
      glow: "from-blue-500/10 to-transparent",
    },
    purple: {
      bg: "hover:border-purple-500/40 dark:hover:border-purple-500/40",
      iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30",
      glow: "from-purple-500/10 to-transparent",
    },
    amber: {
      bg: "hover:border-amber-500/40 dark:hover:border-amber-500/40",
      iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
      glow: "from-amber-500/10 to-transparent",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 p-6 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${style.bg} ${className}`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${style.glow} rounded-full blur-2xl pointer-events-none`}
      />

      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-2xl ${style.iconBg} shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {delta && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              delta.isPositive
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
            }`}
          >
            {delta.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {delta.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
