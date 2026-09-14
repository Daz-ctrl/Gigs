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
      className={`rounded-3xl border-2 border-[#7D684F]/35 bg-[#CBB89D] p-6 md:p-8 shadow-xl shadow-[#7D684F]/10 backdrop-blur-xl ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/15 border border-emerald-600/30 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Cooperative USP · Ministry of Cooperation PS
          </div>
          <h3 className="text-xl md:text-2xl font-black tracking-tight text-[#0A1120]">
            {t.fairnessMeterTitle}
          </h3>
          <p className="text-sm text-slate-800 mt-1 max-w-xl font-medium">
            {t.fairnessMeterSubtitle}
          </p>
        </div>

        {/* Live Amount Controller */}
        {interactive && (
          <div className="bg-[#BEAB8F] p-3 rounded-2xl border-2 border-[#7D684F]/35 min-w-[200px]">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Service Value</span>
              <span className="font-black text-[#0A1120]">₹{amount}</span>
            </div>
            <input
              type="range"
              min="300"
              max="2500"
              step="50"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-[#AF9C7F] rounded-lg appearance-none cursor-pointer accent-[#0B2545]"
            />
            <div className="flex justify-between text-[10px] text-slate-700 font-bold mt-1">
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
          className="relative overflow-hidden rounded-2xl border-2 border-emerald-700/35 bg-[#BEAB8F] p-5 md:p-6 flex flex-col justify-between shadow-sm"
        >
          <div className="absolute top-0 right-0 bg-[#0B2545] text-white font-black text-[11px] px-3 py-1 rounded-bl-xl tracking-wide uppercase">
            Worker Owned
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-900 flex items-center justify-center font-black text-sm">
                KS
              </div>
              <div>
                <h4 className="font-black text-[#0A1120] text-base">
                  KaryaSetu Platform
                </h4>
                <p className="text-xs text-emerald-800 font-bold">
                  Democratic Federation Governance
                </p>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="h-4 w-full bg-[#AF9C7F] rounded-full overflow-hidden flex gap-0.5 p-0.5 mb-4">
              <div
                style={{ width: "90%" }}
                className="h-full bg-[#138808] rounded-l-full relative group cursor-pointer transition-all"
                title="90% Worker Payout"
              />
              <div
                style={{ width: "7%" }}
                className="h-full bg-teal-600 relative group cursor-pointer transition-all"
                title="7% Member Welfare Fund"
              />
              <div
                style={{ width: "3%" }}
                className="h-full bg-[#0B2545] rounded-r-full relative group cursor-pointer transition-all"
                title="3% Platform Tech/Ops"
              />
            </div>

            {/* Breakdown Items */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#AF9C7F] border border-emerald-700/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#138808]" />
                  <span className="text-xs font-bold text-[#0A1120]">
                    {t.workerKeeps}
                  </span>
                </div>
                <span className="text-sm font-black text-emerald-800">
                  ₹{workerPayout}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#AF9C7F] border border-[#7D684F]/25">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  <span className="text-xs font-bold text-slate-800">
                    {t.welfareCut}
                  </span>
                </div>
                <span className="text-xs font-black text-teal-800">
                  ₹{welfareFund}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#AF9C7F] border border-[#7D684F]/25">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0B2545]" />
                  <span className="text-xs font-bold text-slate-800">
                    {t.platformCut}
                  </span>
                </div>
                <span className="text-xs font-black text-slate-900">
                  ₹{platformFee}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#7D684F]/25 flex items-center gap-2 text-xs text-emerald-900 font-bold">
            <HeartHandshake className="w-4 h-4 shrink-0 text-emerald-700" />
            <span>Includes PM Suraksha Bima Yojana & Co-op Health Cover</span>
          </div>
        </motion.div>

        {/* Card 2: Private Gig Platforms (Exploitative Benchmark) */}
        <div className="rounded-2xl border-2 border-[#7D684F]/35 bg-[#BEAB8F] p-5 md:p-6 flex flex-col justify-between opacity-90 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600/15 text-purple-900 flex items-center justify-center font-black text-sm">
                PVT
              </div>
              <div>
                <h4 className="font-black text-[#0A1120] text-base">
                  Corporate Gig Platforms
                </h4>
                <p className="text-xs text-slate-700 font-medium">
                  Urban Company / Housejoy model
                </p>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="h-4 w-full bg-[#AF9C7F] rounded-full overflow-hidden flex gap-0.5 p-0.5 mb-4">
              <div
                style={{ width: "72%" }}
                className="h-full bg-slate-500 rounded-l-full"
                title="72% Worker Payout"
              />
              <div
                style={{ width: "28%" }}
                className="h-full bg-purple-600 rounded-r-full"
                title="28% Corporate Cut"
              />
            </div>

            {/* Breakdown Items */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#AF9C7F] border border-[#7D684F]/25">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  <span className="text-xs font-bold text-slate-800">
                    Worker Payout (Avg ~72%)
                  </span>
                </div>
                <span className="text-sm font-black text-slate-900">
                  ₹{corporateWorker}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#AF9C7F] border border-[#7D684F]/25">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span className="text-xs font-bold text-purple-900">
                    Platform Commission (~28%)
                  </span>
                </div>
                <span className="text-xs font-black text-purple-900">
                  ₹{corporatePlatform}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#AF9C7F] border border-rose-600/20">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                  <span className="text-xs font-bold text-rose-800">
                    Worker Welfare & Healthcare
                  </span>
                </div>
                <span className="text-xs font-black text-rose-800">
                  ₹0 (None)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#7D684F]/25 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium">Worker Loss per Job:</span>
            <span className="font-black text-rose-700">-₹{workerExtraIncome} loss</span>
          </div>
        </div>
      </div>

      {/* Impact Callout */}
      <div className="mt-6 rounded-2xl bg-[#BEAB8F] border-2 border-emerald-700/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0B2545] text-white flex items-center justify-center shrink-0 shadow-md">
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-sm font-black text-[#0A1120]">
              Worker earns +₹{workerExtraIncome} more on this single job
            </div>
            <div className="text-xs text-slate-700 font-medium">
              Projected annual wage boost of ~₹48,000 + guaranteed pension & medical cover.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs font-black text-emerald-900 bg-[#AF9C7F] px-3.5 py-2 rounded-xl border border-emerald-700/25">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          Cooperative Social Security Act Aligned
        </div>
      </div>
    </div>
  );
}
