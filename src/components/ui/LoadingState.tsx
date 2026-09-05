"use client";

import React from "react";
import { Loader2, Sparkles, ShieldCheck, Wrench, Users, CheckCircle2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading verified cooperative records...",
  submessage = "Connecting to decentralized Ward Sachivalayam roster...",
  className = "",
}: LoadingStateProps) {
  return (
    <div className={`w-full py-10 px-4 flex flex-col items-center justify-center text-center animate-in fade-in duration-300 ${className}`}>
      <div className="relative mb-4">
        {/* Glowing pulse aura */}
        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-xl animate-pulse" />
        
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center backdrop-blur-md shadow-lg shadow-emerald-500/10">
          <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-[9px] shadow-sm">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>{message}</span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        {submessage}
      </p>
    </div>
  );
}

export function WorkerCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 p-6 backdrop-blur-xl space-y-4 shadow-sm"
        >
          {/* Top badges skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          </div>

          {/* Profile header skeleton */}
          <div className="flex items-center gap-3.5 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
              <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
            </div>
          </div>

          {/* Skills & rating pills */}
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>

          {/* Pricing & CTA skeleton */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardRosterSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
            <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
            <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>

      {/* 4 KPI Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
            <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminQueueSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-5 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-6 w-20 bg-amber-500/20 rounded-full animate-pulse" />
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 space-y-2">
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>

          <div className="flex gap-2 pt-2">
            <div className="h-9 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
