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
  const [handshakeVerified, setHandshakeVerified] = useState(false);

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
        className="hidden md:flex absolute -top-5 -left-6 z-30 items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-emerald-500/30 backdrop-blur-xl shadow-xl shadow-emerald-500/10"
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
        onClick={() => setHandshakeVerified(!handshakeVerified)}
        className="hidden md:flex absolute -bottom-5 -right-6 z-30 items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-amber-500/30 backdrop-blur-xl shadow-xl shadow-amber-500/10 cursor-pointer hover:scale-105 transition-transform"
      >
        <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-mono font-black text-xs">
          {handshakeVerified ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4" />}
        </div>
        <div className="text-left text-xs">
          <div className="font-extrabold text-slate-900 dark:text-white">
            {handshakeVerified ? "Handshake Verified" : "Start-Work OTP"}
          </div>
          <div className="text-[10px] text-amber-500 font-semibold font-mono">
            {handshakeVerified ? "⏱️ Service Clock Started" : "🔐 8530 · Tap to Test"}
          </div>
        </div>
      </motion.div>

      {/* Main Glass Console Card */}
      <div className="relative overflow-hidden rounded-[32px] border-2 border-[#0B2545]/20 dark:border-amber-500/20 bg-white/95 dark:bg-[#07172B]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-[#0B2545]/10 text-left">
        {/* Tricolor top indicator */}
        <div className="absolute top-0 inset-x-0 h-1 grid grid-cols-3">
          <div className="bg-[#FF9933]" />
          <div className="bg-[#FFFFFF]" />
          <div className="bg-[#138808]" />
        </div>
        <BorderBeam duration={7} colorFrom="#FF9933" colorTo="#0B2545" />

        {/* Console Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF9933]" />
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
              <div className="w-3 h-3 rounded-full bg-[#138808]" />
            </div>
            <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <span className="text-amber-500 font-bold">🏛️ karyasetu.gov.in</span>
              <span>·</span>
              <span>सहकारिता डिजिटल नियंत्रण कक्ष</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {liveWorkers} On-Duty Artisans
            </span>
          </div>
        </div>

        {/* Interactive Live Telemetry Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: 90% Worker Direct Payout */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 text-left">
            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Fairness Meter</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">DBT Direct</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">90% Payout</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              ₹720 out of ₹800 direct to artisan bank account
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden flex">
              <div className="bg-[#138808] h-full w-[90%]" />
              <div className="bg-[#FF9933] h-full w-[7%]" />
              <div className="bg-[#0B2545] h-full w-[3%]" />
            </div>
          </div>

          {/* Card 2: AI Weather & Demand Radar */}
          <div className="p-4 rounded-2xl bg-[#0B2545]/5 dark:bg-[#0B2545]/30 border border-[#0B2545]/20 dark:border-blue-500/20 text-left">
            <div className="text-[11px] font-bold text-[#0B2545] dark:text-blue-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>AI Demand Radar</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">Zero Surge</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">Zone 2 Deficit</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Monsoon Waterlogging: 12 Plumbers mobilized
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0B2545] dark:text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">
              <Zap className="w-3.5 h-3.5" />
              <span>Co-op Rebalance Active</span>
            </div>
          </div>

          {/* Card 3: Free Healthcare & PMSBY */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/25 text-left">
            <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Social Security</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">PMSBY</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">₹3,24,000</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              ₹5 Lakh accidental & health cover per artisan
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Govt. Subsidized Welfare</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

