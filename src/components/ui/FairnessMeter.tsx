"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, HeartHandshake, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface FairnessMeterProps {
  amount?: number;
  interactive?: boolean;
  className?: string;
}

export function FairnessMeter({
  amount: initialAmount = 600,
  interactive = true,
  className = "",
}: FairnessMeterProps) {
  const { t } = useApp();
  const [amount, setAmount] = useState<number>(initialAmount);

  // CoopServe Breakdown
  const workerPayout = Math.round(amount * 0.9);
  const welfareFund = Math.round(amount * 0.07);
  const platformFee = Math.round(amount * 0.03);

  // Corporate Comparison
  const corporateWorker = Math.round(amount * 0.72);
  const corporatePlatform = Math.round(amount * 0.28);
  const workerExtraIncome = workerPayout - corporateWorker;

  return (
    <div
      className={`rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white to-slate-50/70 dark:from-slate-900/90 dark:to-slate-950 p-6 md:p-8 shadow-xl shadow-emerald-500/5 backdrop-blur-xl ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Cooperative USP · Ministry of Cooperation PS
          </div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.fairnessMeterTitle}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {t.fairnessMeterSubtitle}
          </p>
        </div>

        {/* Live Amount Controller */}
        {interactive && (
          <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 min-w-[200px]">
            <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span>Service Value</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{amount}</span>
            </div>
            <input
              type="range"
              min="300"
              max="2500"
              step="50"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹300</span>
              <span>₹1,400</span>
              <span>₹2,500</span>
            </div>
          </div>
        )}
      </div>

      {/* Visual Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: CoopServe (Worker-Owned) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-5 md:p-6 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 bg-emerald-500 text-white font-bold text-[11px] px-3 py-1 rounded-bl-xl tracking-wide uppercase">
            Worker Owned
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                KS
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  KaryaSetu Platform
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Democratic Federation Governance
                </p>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5 p-0.5 mb-4">
              <div
                style={{ width: "90%" }}
                className="h-full bg-emerald-500 rounded-l-full relative group cursor-pointer transition-all"
                title="90% Worker Payout"
              />
              <div
                style={{ width: "7%" }}
                className="h-full bg-teal-400 relative group cursor-pointer transition-all"
                title="7% Member Welfare Fund"
              />
              <div
                style={{ width: "3%" }}
                className="h-full bg-slate-400 rounded-r-full relative group cursor-pointer transition-all"
                title="3% Platform Tech/Ops"
              />
            </div>

            {/* Breakdown Items */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {t.workerKeeps}
                  </span>
                </div>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  ₹{workerPayout}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {t.welfareCut}
                  </span>
                </div>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  ₹{welfareFund}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {t.platformCut}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  ₹{platformFee}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
            <HeartHandshake className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>Includes PM Suraksha Bima Yojana & Co-op Health Cover</span>
          </div>
        </motion.div>

        {/* Card 2: Private Gig Platforms (Exploitative Benchmark) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 p-5 md:p-6 flex flex-col justify-between opacity-85">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                PVT
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  Corporate Gig Platforms
                </h4>
                <p className="text-xs text-slate-400">
                  Urban Company / Housejoy model
                </p>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5 p-0.5 mb-4">
              <div
                style={{ width: "72%" }}
                className="h-full bg-slate-400 rounded-l-full"
                title="72% Worker Payout"
              />
              <div
                style={{ width: "28%" }}
                className="h-full bg-purple-500 rounded-r-full"
                title="28% Corporate Cut"
              />
            </div>

            {/* Breakdown Items */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Worker Payout (Avg ~72%)
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  ₹{corporateWorker}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                    Platform Commission (~28%)
                  </span>
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  ₹{corporatePlatform}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                    Worker Welfare & Healthcare
                  </span>
                </div>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  ₹0 (None)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Worker Loss per Job:</span>
            <span className="font-bold text-rose-500">-₹{workerExtraIncome} loss</span>
          </div>
        </div>
      </div>

      {/* Impact Callout */}
      <div className="mt-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Worker earns +₹{workerExtraIncome} more on this single job
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Projected annual wage boost of ~₹48,000 + guaranteed pension & medical cover.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2 rounded-xl border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Cooperative Social Security Act Aligned
        </div>
      </div>
    </div>
  );
}
