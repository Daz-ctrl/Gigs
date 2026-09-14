"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  Brain,
  Wrench,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  QrCode,
  Users,
  Smartphone,
  Award,
  Zap,
  Lock,
  UserPlus,
} from "lucide-react";
import { FairnessMeter } from "@/components/ui/FairnessMeter";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { Meteors } from "@/components/ui/Meteors";
import { HeroInteractivePreview } from "@/components/ui/HeroInteractivePreview";
import { TrustBentoGrid } from "@/components/ui/TrustBentoGrid";
import { Marquee } from "@/components/ui/Marquee";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function HomePage() {
  const { t, setRole, showToast } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const oauthError = searchParams.get("error_description") || searchParams.get("error");

  return (
    <BackgroundGrid className="min-h-screen relative overflow-hidden">
      {oauthError && (
        <div className="fixed top-20 inset-x-4 z-50 max-w-lg mx-auto p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="font-bold">OAuth Notice</div>
            <div className="text-[11px] text-amber-700 dark:text-amber-300">Previous login session expired. Please sign in again.</div>
          </div>
          <Link
            href="/login"
            onClick={() => router.replace("/")}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="pt-[87px] sm:pt-[95px] md:pt-[103px] pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center relative z-20">
        {/* Official Scheme Pill / Ministry Motto */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
          <span className="text-sm">🏛️</span>
          <span>सहकारिता से समृद्धि · Ministry of Cooperation</span>
        </div>

        {/* Hero Title - Balanced & Proportional */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
          {t.home.heroTitle1}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 dark:from-amber-400 dark:via-orange-400 dark:to-amber-300">
            {t.home.heroTitleAccent}
          </span>
          {t.home.heroTitle2}
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.home.heroSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <Link href="/customer/book">
            <button
              type="button"
              className="px-6 py-3 rounded-2xl bg-[#E65100] hover:bg-[#D84315] text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-600/25 transition-all duration-150 active:scale-95 flex items-center gap-2 cursor-pointer border border-amber-300/30"
            >
              <Wrench className="w-4 h-4" />
              <span>{t.home.bookWorker}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>

          <Link
            href="/admin/dashboard"
            onClick={() => setRole("ADMIN")}
            className="px-5 py-3 rounded-2xl bg-white/90 dark:bg-[#07172B]/90 hover:bg-slate-100 dark:hover:bg-[#0B2545] text-slate-900 dark:text-slate-100 border border-[#0B2545]/20 dark:border-amber-500/30 font-bold text-xs sm:text-sm transition-all duration-150 active:scale-95 flex items-center gap-2 cursor-pointer shadow-sm backdrop-blur-xl"
          >
            <Brain className="w-4 h-4 text-amber-500" />
            <span>{t.home.exploreAdmin}</span>
          </Link>
        </div>

        {/* 3D Glass Console Live Preview Widget */}
        <HeroInteractivePreview />

        {/* Micro-Stats Bar */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg border border-emerald-500/25">
              90%
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Direct Payout</div>
              <div className="text-[11px] text-slate-500">Worker keeps 90% via DBT</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg border border-amber-500/25">
              7%
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">PMSBY Insurance</div>
              <div className="text-[11px] text-slate-500">Auto-credited medical & accident cover</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/25">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Digital QR ID</div>
              <div className="text-[11px] text-slate-500">Free Aadhaar e-KYC verified</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0B2545]/15 dark:bg-amber-500/15 text-[#0B2545] dark:text-amber-400 flex items-center justify-center border border-[#0B2545]/20 dark:border-amber-500/25">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">AI Demand Radar</div>
              <div className="text-[11px] text-slate-500">Zero surge pricing tariff</div>
            </div>
          </div>
        </div>
      </section>

      {/* INFINITE MARQUEE SOCIAL PROOF STRIP */}
      <div className="py-5 border-y border-[#0B2545]/15 bg-[#F5F1E9] shadow-inner overflow-hidden relative z-20">
        <Marquee pauseOnHover className="[--duration:32s]">
          {[
            { text: "Ministry of Cooperation Registered", badge: "MSCS ACT 2002", icon: "🏛️" },
            { text: "Zero Ghost Artisans", badge: "UIDAI e-KYC", icon: "🇮🇳" },
            { text: "90% Direct Worker Take-Home Pay", badge: "FAIR GIG ECONOMY", icon: "⚡" },
            { text: "₹5 Lakh Medical & Accident Cover", badge: "PMSBY INTEGRATED", icon: "🛡️" },
            { text: "AI Weather-Demand Rebalancing", badge: "ZERO SURGE PRICING", icon: "🤖" },
            { text: "4-Digit Start-Work Safety Handshake", badge: "ANTI-FRAUD PIN", icon: "🔐" },
            { text: "Statutory Living Wage Guarantee", badge: "CO-OP FLOOR", icon: "⚖️" },
            { text: "4.92 / 5 Grassroots Trust Rating", badge: "COMMUNITY OWNED", icon: "⭐" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs mx-2 shrink-0"
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {item.text}
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {item.badge}
              </span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* SIGNATURE USP: FAIRNESS METER WITH SPOTLIGHT */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <FairnessMeter amount={800} interactive={true} />
      </section>

      {/* ACETERNITY BENTO GRID SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            सहकारिता मॉडल · Cooperative Innovation Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Engineered For Grassroots Trust & Scale
          </h2>
        </div>

        <TrustBentoGrid />
      </section>

      {/* 3 CLEAN PERSONA SPOTLIGHT CARDS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            {t.home.ecosystemBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            {t.home.ecosystemTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            {t.home.ecosystemSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Worker */}
          <SpotlightCard
            spotlightColor="rgba(230, 81, 0, 0.15)"
            className="p-8"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.home.workerCardTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {t.home.workerCardDesc}
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{t.home.workerCardFeature1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{t.home.workerCardFeature2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{t.home.workerCardFeature3}</span>
                </li>
              </ul>
            </div>

            <Link
              href="/worker/dashboard"
              onClick={() => setRole("WORKER")}
              className="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center justify-between group-hover:translate-x-1 transition"
            >
              <span>{t.home.workerCardLink}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </SpotlightCard>

          {/* 2. Customer */}
          <SpotlightCard
            spotlightColor="rgba(11, 37, 69, 0.15)"
            className="p-8"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.home.customerCardTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {t.home.customerCardDesc}
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>{t.home.customerCardFeature1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>{t.home.customerCardFeature2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>{t.home.customerCardFeature3}</span>
                </li>
              </ul>
            </div>

            <Link
              href="/customer/book"
              onClick={() => setRole("CUSTOMER")}
              className="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between group-hover:translate-x-1 transition"
            >
              <span>{t.home.customerCardLink}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </SpotlightCard>

          {/* 3. Cooperative Admin */}
          <SpotlightCard
            spotlightColor="rgba(19, 136, 8, 0.15)"
            className="p-8"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.home.adminCardTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {t.home.adminCardDesc}
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{t.home.adminCardFeature1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{t.home.adminCardFeature2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{t.home.adminCardFeature3}</span>
                </li>
              </ul>
            </div>

            <Link
              href="/admin/dashboard"
              onClick={() => setRole("ADMIN")}
              className="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between group-hover:translate-x-1 transition"
            >
              <span>{t.home.adminCardLink}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </SpotlightCard>
        </div>
      </section>

      {/* FINAL HIGH-IMPACT COOPERATIVE CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative z-20">
        <SpotlightCard
          spotlightColor="rgba(230, 81, 0, 0.15)"
          className="p-8 sm:p-12 relative overflow-hidden rounded-[36px] border-2 border-[#0B2545]/20 dark:border-amber-500/20 bg-[#0B2545]/95 dark:bg-[#07172B]/95 text-white backdrop-blur-2xl shadow-2xl"
        >
          {/* Top tricolor ribbon on banner */}
          <div className="absolute top-0 inset-x-0 h-1.5 grid grid-cols-3">
            <div className="bg-[#FF9933]" />
            <div className="bg-[#FFFFFF]" />
            <div className="bg-[#138808]" />
          </div>
          <BorderBeam colorFrom="#FF9933" colorTo="#0B2545" duration={8} />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider inline-block mb-3.5">
              {t.home.ctaBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t.home.ctaTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed max-w-lg mx-auto">
              {t.home.ctaSubtitle}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
              <Link href="/customer/book">
                <button
                  type="button"
                  className="px-6 py-3 rounded-2xl bg-[#E65100] hover:bg-[#D84315] text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-950/40 transition-all duration-150 active:scale-95 flex items-center gap-2 cursor-pointer border border-amber-400/40"
                >
                  <Wrench className="w-4 h-4" />
                  <span>{t.home.bookWorker}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link
                href="/worker/register"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-lg backdrop-blur-xl active:scale-95"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>{t.home.joinArtisan}</span>
              </Link>
            </div>
          </div>
        </SpotlightCard>
      </section>
    </BackgroundGrid>
  );
}
