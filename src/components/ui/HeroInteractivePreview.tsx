"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Brain,
  Sparkles,
  TrendingUp,
  MapPin,
  Lock,
  CheckCircle2,
  Zap,
  ArrowRight,
  CloudRain,
  Sun,
  Flame,
  KeyRound,
  Radio,
} from "lucide-react";
import { BorderBeam } from "./BorderBeam";

type ScenarioType = "normal" | "monsoon" | "festival";

export function HeroInteractivePreview() {
  const [scenario, setScenario] = useState<ScenarioType>("normal");
  const [liveWorkers, setLiveWorkers] = useState(528);
  const [handshakeVerified, setHandshakeVerified] = useState(false);
  const [isSimulatingDispatch, setIsSimulatingDispatch] = useState(false);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveWorkers((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateDispatch = () => {
    setIsSimulatingDispatch(true);
    setTimeout(() => {
      setIsSimulatingDispatch(false);
      setDispatchConfirmed(true);
      setTimeout(() => setDispatchConfirmed(false), 3500);
    }, 600);
  };

  const scenarioData = {
    normal: {
      title: "Ward #18 (MVP Colony, Vizag) · Equilibrium",
      badge: "Normal Operations",
      badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
      demandText: "Supply in Equilibrium",
      deficitText: "0 Deficit · 24 Active Roster",
      forecastHighlight: "Zero surge pricing · Fair ₹450 standard floor",
      rebalanceText: "Standard Auto-Match",
      workersDelta: 528,
      payout: "₹720 / ₹800",
      payoutPercent: 90,
    },
    monsoon: {
      title: "Coastal Gale Warning · Heavy Precipitation",
      badge: "🌧️ Monsoon Rain Surge (+220%)",
      badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      demandText: "Zone 2 Plumber Shortage",
      deficitText: "Deficit: -12 Plumbers Needed",
      forecastHighlight: "Severe waterlogging spike. Pre-notifying off-duty artisans with +₹120/hr shift bonus",
      rebalanceText: "1-Click Mobilize 12 Plumbers",
      workersDelta: 564,
      payout: "₹810 / ₹900 (+Surge Bonus)",
      payoutPercent: 90,
    },
    festival: {
      title: "Festive Evening Load Spike · 6 PM - 9 PM",
      badge: "🪔 Festive Lighting Surge (+180%)",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      demandText: "Zone 1 Electrician Deficit",
      deficitText: "Deficit: -10 Electricians Needed",
      forecastHighlight: "Lighting load spike. Mobilizing certified electricians from Zone 3 residential roster",
      rebalanceText: "1-Click Mobilize 10 Electricians",
      workersDelta: 542,
      payout: "₹855 / ₹950 (+Surge Bonus)",
      payoutPercent: 90,
    },
  };

  const current = scenarioData[scenario];

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
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 dark:border-white/[0.1] bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/5 text-left">
        <BorderBeam duration={7} colorFrom="#10b981" colorTo="#06b6d4" />

        {/* Console Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400">karyasetu.gov.in · Live Telemetry Simulator</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-bold text-emerald-500">
              {current.workersDelta} Artisans On-Duty
            </span>
          </div>
        </div>

        {/* Scenario Switcher Controls */}
        <div className="relative z-10 mb-5 p-2 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 pl-2 uppercase tracking-wider">
            Simulate Event Trigger:
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { id: "normal" as const, label: "☀️ Standard Day", icon: Sun },
              { id: "monsoon" as const, label: "🌧️ Monsoon Gale", icon: CloudRain },
              { id: "festival" as const, label: "🪔 Festive Evening", icon: Sparkles },
            ].map((s) => {
              const active = scenario === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScenario(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25 scale-105"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent"
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Telemetry Banner */}
        <div className="relative z-10 mb-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Active Trigger: <strong className="text-slate-900 dark:text-white">{current.title}</strong>
            </span>
          </div>
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
            {current.badge}
          </span>
        </div>

        {/* Interactive Live Telemetry Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: 90% Worker Payout */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-left">
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Fairness Meter</span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">90% Direct</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{current.payout}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Zero middleman cuts · 90% direct to worker
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
              <span>AI Demand Predictor</span>
              <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded-full font-bold">Live Model</span>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white truncate">{current.demandText}</div>
            <div className="text-xs text-purple-600 dark:text-purple-300 font-semibold mt-0.5">
              {current.deficitText}
            </div>
            <button
              type="button"
              disabled={isSimulatingDispatch || dispatchConfirmed}
              onClick={handleSimulateDispatch}
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-purple-600 dark:text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 px-2.5 py-1.5 rounded-xl border border-purple-500/30 transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>
                {isSimulatingDispatch
                  ? "Broadcasting..."
                  : dispatchConfirmed
                  ? "✅ Rebalance Broadcasted!"
                  : current.rebalanceText}
              </span>
            </button>
          </div>

          {/* Card 3: Free Healthcare & PMSBY */}
          <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-left">
            <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Welfare Reserve</span>
              <span className="text-[10px] bg-teal-500/20 px-2 py-0.5 rounded-full font-bold">7% Reserve</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">₹3,24,000</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              PMSBY ₹2 Lakh active group cover
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

