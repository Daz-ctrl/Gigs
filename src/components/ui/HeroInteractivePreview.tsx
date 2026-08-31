"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Brain,
  Sparkles,
  TrendingUp,
  MapPin,
  Lock,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { BorderBeam } from "./BorderBeam";

export function HeroInteractivePreview() {
  const [liveWorkers, setLiveWorkers] = useState(528);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveWorkers((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto my-12 perspective-1000">
      {/* Ambient background glow orb */}
      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-[40px] blur-3xl opacity-60 animate-pulse-glow -z-10" />

      {/* Floating Micro-Badge Top Left: Aadhaar e-KYC */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="hidden md:flex absolute -top-5 -left-6 z-30 items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl shadow-emerald-500/10 animate-float"
      >
        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-left text-xs">
          <div className="font-extrabold text-slate-900 dark:text-white">UIDAI e-KYC</div>
          <div className="text-[10px] text-emerald-500 font-semibold">100% Free · Verified</div>
        </div>
      </motion.div>

      {/* Floating Micro-Badge Bottom Right: Start-Work Handshake */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="hidden md:flex absolute -bottom-5 -right-6 z-30 items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl shadow-amber-500/10 animate-float"
        style={{ animationDelay: "1.5s" }}
      >
        <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-mono font-black text-xs">
          <Lock className="w-4 h-4" />
        </div>
        <div className="text-left text-xs">
          <div className="font-extrabold text-slate-900 dark:text-white">Start-Work OTP</div>
          <div className="text-[10px] text-amber-500 font-semibold">🔐 8530 · Anti-Fraud</div>
        </div>
      </motion.div>

      {/* Main Glass Console Card */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/5">
        <BorderBeam duration={7} colorFrom="#10b981" colorTo="#06b6d4" />

        {/* Console Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400">sahakar-karmakar.gov.in · live mission control</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-bold text-emerald-500">
              {liveWorkers} Workers On-Duty
            </span>
          </div>
        </div>

        {/* Interactive Live Telemetry Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: 90% Worker Payout */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-left">
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Fairness Meter</span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">90% Payout</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ₹720 out of ₹800 direct to verified worker
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden flex">
              <div className="bg-emerald-500 h-full w-[90%]" />
              <div className="bg-teal-500 h-full w-[7%]" />
              <div className="bg-slate-400 h-full w-[3%]" />
            </div>
          </div>

          {/* Card 2: AI Weather Forecast Radar */}
          <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-left">
            <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>AI Demand Radar</span>
              <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded-full">Live ML</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">Zone 2 Deficit</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Monsoon Waterlogging: 12 Plumbers needed
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-xl">
              <Zap className="w-3.5 h-3.5" />
              <span>1-Click Rebalance Ready</span>
            </div>
          </div>

          {/* Card 3: Free Healthcare & PMSBY */}
          <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-left">
            <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Welfare Reserve</span>
              <span className="text-[10px] bg-teal-500/20 px-2 py-0.5 rounded-full">7% Auto</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">₹3,24,000</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              100% Active PMSBY Insurance Cover
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-teal-500 bg-teal-500/10 px-2.5 py-1 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero Deductions from Worker</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
