"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  ShieldCheck,
  Lock,
  Brain,
  CheckCircle2,
  Users,
  Sparkles,
  CloudRain,
  Zap,
  Clock,
  Check,
} from "lucide-react";
import { BorderBeam } from "./BorderBeam";
import { SpotlightCard } from "./SpotlightCard";

export function TrustBentoGrid() {
  const [activePathway, setActivePathway] = useState<0 | 1 | 2>(0);

  const pathways = [
    {
      title: "Pathway 1: Peer Vouching",
      badge: "Zero Paperwork Needed",
      desc: "3+ years practical hands-on work endorsed by a senior co-op worker.",
      icon: Users,
      stamp: "Co-op Verified Worker",
      stampColor: "text-emerald-800 bg-emerald-100 border-emerald-300 font-bold",
    },
    {
      title: "Pathway 2: RPL (Skill India)",
      badge: "Govt. Certified",
      desc: "Free NSDC practical skill test converting informal skill into Level 4 badge.",
      icon: Sparkles,
      stamp: "NSDC Level 4 Certified",
      stampColor: "text-blue-800 bg-blue-100 border-blue-300 font-bold",
    },
    {
      title: "Pathway 3: ITI / Vocational",
      badge: "Master Tier",
      desc: "Formal ITI or Solar PV diploma for high-voltage industrial jobs.",
      icon: Award,
      stamp: "Master Craft Specialist",
      stampColor: "text-purple-800 bg-purple-100 border-purple-300 font-bold",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
      {/* CARD 1: INCLUSIVE 3-PATHWAY VERIFICATION (Col-span 7 on Desktop) */}
      <SpotlightCard
        spotlightColor="rgba(230, 81, 0, 0.15)"
        borderBeam={
          <BorderBeam
            duration={8}
            colorFrom="#FF9933"
            colorTo="#0B2545"
            borderRadius="32px"
            borderWidth={2.5}
            innerBg="bg-[#CBB89D]"
          />
        }
        className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-2 border-[#7D684F]/35 rounded-[32px] bg-[#CBB89D] shadow-md"
      >

        {/* Visual Interactive Header: The 3 Pathway Selector Stack */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-emerald-600/15 text-emerald-800 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-black">
                Grassroots Inclusion Model
              </span>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Zero Degree Barrier
            </span>
          </div>

          {/* Interactive 3-Pill Switcher with Rounded Corners */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#BEAB8F] border border-[#7D684F]/35 mb-4">
            {pathways.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePathway(idx as any)}
                className={`py-2 px-2 sm:px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer truncate ${
                  activePathway === idx
                    ? "bg-[#0B2545] text-white shadow-md shadow-[#0B2545]/20 font-black"
                    : "text-slate-800 hover:text-[#0A1120] hover:bg-[#AF9C7F]"
                }`}
              >
                {p.title.split(":")[1]}
              </button>
            ))}
          </div>

          {/* Dynamic Interactive Pathway Preview Showcase with Soft Rounded Edges */}
          <div className="p-5 rounded-3xl bg-[#BEAB8F] border-2 border-emerald-700/30 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-black text-[#0A1120]">
                    {pathways[activePathway].title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0B2545]/10 text-[#0B2545]">
                    {pathways[activePathway].badge}
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed max-w-md">
                  {pathways[activePathway].desc}
                </p>
              </div>

              <div
                className={`hidden sm:flex shrink-0 px-3 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-wider items-center gap-1.5 ${pathways[activePathway].stampColor}`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{pathways[activePathway].stamp}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#7D684F]/25 flex items-center justify-between text-[11px] text-slate-700 font-medium">
              <span>Peer Committee: <strong className="text-[#0A1120] font-black">MVP Colony Labour Co-op, Vizag</strong></span>
              <span className="text-emerald-800 font-bold">100% Eligible For Instant Verification</span>
            </div>
          </div>
        </div>

        {/* Text Footer */}
        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl font-black text-[#0A1120] tracking-tight">
            Inclusive 3-Pathway Verification: No Papers Needed
          </h3>
          <p className="text-xs text-slate-800 font-medium mt-1.5 leading-relaxed">
            Real craftsmen learn on the field, not in college classrooms. Any artisan with 3+ years hands-on experience can get peer-vouched by their local cooperative society and begin working immediately.
          </p>
        </div>
      </SpotlightCard>

      {/* CARD 2: FREE AADHAAR e-KYC (Col-span 5 on Desktop) */}
      <SpotlightCard
        spotlightColor="rgba(59, 130, 246, 0.18)"
        className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-2 border-[#7D684F]/35 rounded-[32px] bg-[#CBB89D] shadow-md"
      >
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-blue-600/15 text-blue-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-800 font-black">
                Identity Security
              </span>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
              100% Free For Worker
            </span>
          </div>

          {/* Visual Aadhaar Card Chip Mockup with Soft Rounded Edges */}
          <div className="p-5 rounded-3xl bg-[#BEAB8F] border-2 border-blue-700/30 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#0A1120] tracking-wide">UIDAI Aadhaar Sandbox</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3 h-3" />
                VERIFIED
              </span>
            </div>

            <div className="font-mono text-xl font-black text-[#0B2545] tracking-widest my-2">
              XXXX-XXXX-8921
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-800 font-medium mt-3 pt-2 border-t border-[#7D684F]/25">
              <span>Linked Mobile: <strong className="text-[#0A1120] font-black">+91 98XXX-XX210</strong></span>
              <span className="text-amber-800 font-mono font-black">Demo OTP: 482109</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl font-black text-[#0A1120] tracking-tight">
            Free Aadhaar e-KYC via OTP Handshake
          </h3>
          <p className="text-xs text-slate-800 font-medium mt-1.5 leading-relaxed">
            Instant 12-digit identity validation. Masks citizen privacy under the Aadhaar Act, 2016 while eliminating duplicate or fraudulent gig profiles.
          </p>
        </div>
      </SpotlightCard>

      {/* CARD 3: START-WORK SECURITY HANDSHAKE OTP (Col-span 5 on Desktop) */}
      <SpotlightCard
        spotlightColor="rgba(245, 158, 11, 0.18)"
        className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-2 border-[#7D684F]/35 rounded-[32px] bg-[#CBB89D] shadow-md"
      >
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-amber-600/15 text-amber-800 flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-800 font-black">
                Anti-Fraud Protocol
              </span>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              Handshake Active
            </span>
          </div>

          {/* 4-Digit Security PIN Showcase with Soft Rounded Corners */}
          <div className="p-5 rounded-3xl bg-[#BEAB8F] border-2 border-amber-700/30 text-center relative overflow-hidden shadow-sm">
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-900 mb-2">
              Customer Handshake Code
            </div>
            <div className="flex justify-center gap-2.5 my-2">
              {["8", "5", "3", "0"].map((digit, i) => (
                <div
                  key={i}
                  className="w-11 h-12 rounded-2xl bg-[#AF9C7F] border-2 border-amber-800/40 text-amber-950 font-mono font-black text-xl flex items-center justify-center shadow-sm"
                >
                  {digit}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-800 font-medium mt-3 pt-2 border-t border-[#7D684F]/25">
              <Clock className="w-3.5 h-3.5 text-emerald-700 font-bold" />
              <span>Starts 60-min service timer on physical arrival</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl font-black text-[#0A1120] tracking-tight">
            Start-Work Security Handshake OTP
          </h3>
          <p className="text-xs text-slate-800 font-medium mt-1.5 leading-relaxed">
            Eliminates ghost bookings and false completions. The worker must physically obtain this 4-digit code from the homeowner to start the job clock.
          </p>
        </div>
      </SpotlightCard>

      {/* CARD 4: AI DEMAND RADAR & 1-CLICK REBALANCE (Col-span 7 on Desktop) */}
      <SpotlightCard
        spotlightColor="rgba(11, 37, 69, 0.18)"
        borderBeam={
          <BorderBeam
            duration={8}
            colorFrom="#0B2545"
            colorTo="#FF9933"
            borderRadius="32px"
            borderWidth={2.5}
            innerBg="bg-[#CBB89D]"
          />
        }
        className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-2 border-[#7D684F]/35 rounded-[32px] bg-[#CBB89D] shadow-md"
      >

        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-purple-600/15 text-purple-800 flex items-center justify-center font-bold">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-purple-800 font-black">
                FastAPI Predictive Copilot (FR11)
              </span>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
              R² = 0.97 Precision
            </span>
          </div>

          {/* Visual AI Zone Deficit Simulation Console with Soft Rounded Edges */}
          <div className="p-5 rounded-3xl bg-[#BEAB8F] border-2 border-purple-700/30 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-blue-100 text-blue-800 font-bold">
                  <CloudRain className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-black text-[#0A1120] block">Zone 2 (Gajuwaka Industrial Belt, Vizag)</span>
                  <span className="text-[11px] text-slate-800 font-medium">Coastal Rain & Drainage Spike</span>
                </div>
              </div>

              <div className="px-3 py-1 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-black self-start sm:self-auto">
                Shortage: -12 Plumbers
              </div>
            </div>

            {/* Demand vs Supply Visual Bar with Soft Rounded Edges */}
            <div className="space-y-1.5 my-3">
              <div className="flex justify-between text-[11px] text-slate-800 font-bold">
                <span>Predicted Demand: 18 bookings</span>
                <span className="text-emerald-800 font-black">Supply: 6 on-duty</span>
              </div>
              <div className="w-full bg-[#AF9C7F] h-2 rounded-full overflow-hidden flex">
                <div className="bg-rose-500 h-full w-[67%]" />
                <div className="bg-emerald-600 h-full w-[33%]" />
              </div>
            </div>

            <div className="pt-3 border-t border-[#7D684F]/25 flex items-center justify-between text-[11px]">
              <span className="text-slate-800 font-medium">Rebalance Recommendation:</span>
              <span className="text-purple-800 font-black flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Broadcast +₹120/hr Surge Shift
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl font-black text-[#0A1120] tracking-tight">
            AI Demand Radar & 1-Click Rebalance Copilot
          </h3>
          <p className="text-xs text-slate-800 font-medium mt-1.5 leading-relaxed">
            Correlates seasonal urban booking patterns with weather triggers (Monsoon rain, heatwaves) and festival calendars, allowing cooperative admins to mobilize artisan squads before citizen backlogs occur.
          </p>
        </div>
      </SpotlightCard>
    </div>
  );
}
