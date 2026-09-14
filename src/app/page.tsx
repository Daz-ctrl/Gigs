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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
          <span className="text-sm">🏛️</span>
          <span>सहकारिता से समृद्धि · Ministry of Cooperation</span>
        </div>

        {/* Hero Title - Balanced & Proportional */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          {t.home.heroTitle1}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400">
            {t.home.heroTitleAccent}
          </span>
          {t.home.heroTitle2}
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium">
          {t.home.heroSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <Link href="/customer/book">
            <button
              type="button"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all duration-150 active:scale-95 flex items-center gap-2 cursor-pointer border border-amber-300/40"
            >
              <Wrench className="w-4 h-4 text-slate-950" />
              <span>{t.home.bookWorker}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </Link>

          <Link
            href="/admin/dashboard"
            onClick={() => setRole("ADMIN")}
            className="px-5 py-3 rounded-2xl bg-[#081C33]/90 hover:bg-[#0D2E55] text-white border border-white/15 font-bold text-xs sm:text-sm transition-all duration-150 active:scale-95 flex items-center gap-2 cursor-pointer shadow-md backdrop-blur-xl"
          >
            <Brain className="w-4 h-4 text-amber-400" />
            <span>{t.home.exploreAdmin}</span>
          </Link>
        </div>

        {/* 3D Glass Console Live Preview Widget */}
        <HeroInteractivePreview />

        {/* Micro-Stats Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg border border-emerald-500/30">
              90%
            </div>
            <div>
              <div className="text-xs font-black text-white">Direct Payout</div>
              <div className="text-[11px] text-slate-300 font-medium">Worker keeps 90% via DBT</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg border border-amber-500/30">
              7%
            </div>
            <div>
              <div className="text-xs font-black text-white">PMSBY Insurance</div>
              <div className="text-[11px] text-slate-300 font-medium">Auto-credited medical & accident cover</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white">Digital QR ID</div>
              <div className="text-[11px] text-slate-300 font-medium">Free Aadhaar e-KYC verified</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white">AI Demand Radar</div>
              <div className="text-[11px] text-slate-300 font-medium">Zero surge pricing tariff</div>
            </div>
          </div>
        </div>
      </section>

      {/* INFINITE MARQUEE SOCIAL PROOF STRIP */}
      <div className="py-5 border-y border-white/10 bg-[#081C33]/90 shadow-inner overflow-hidden relative z-20">
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
              className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#0B2545] border border-white/10 shadow-xs mx-2 shrink-0"
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs font-black text-white">
                {item.text}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
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
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
            सहकारिता मॉडल · Cooperative Innovation Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
            Engineered For Grassroots Trust & Scale
          </h2>
        </div>

        <TrustBentoGrid />
      </section>

      {/* 3 CLEAN PERSONA SPOTLIGHT CARDS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
            {t.home.ecosystemBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
            {t.home.ecosystemTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto font-medium">
            {t.home.ecosystemSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Worker */}
          <SpotlightCard
            className="p-8 bg-[#081C33] border border-white/10 shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">
                {t.home.workerCardTitle}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                {t.home.workerCardDesc}
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-200 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.home.workerCardFeature1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.home.workerCardFeature2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.home.workerCardFeature3}</span>
                </li>
              </ul>
            </div>

            <Link
              href="/worker/dashboard"
              onClick={() => setRole("WORKER")}
              className="mt-8 pt-4 border-t border-white/10 text-xs font-black text-amber-400 flex items-center justify-between"
            >
              <span>{t.home.workerCardLink}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </SpotlightCard>

          {/* 2. Customer */}
          <SpotlightCard
            className="p-8 bg-[#081C33] border border-white/10 shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/30">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">
                {t.home.customerCardTitle}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                {t.home.customerCardDesc}
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-200 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>{t.home.customerCardFeature1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>{t.home.customerCardFeature2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>{t.home.customerCardFeature3}</span>
                </li>
              </ul>
            </div>

            <Link
              href="/customer/book"
              onClick={() => setRole("CUSTOMER")}
              className="mt-8 pt-4 border-t border-white/10 text-xs font-black text-blue-400 flex items-center justify-between"
            >
              <span>{t.home.customerCardLink}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </SpotlightCard>

          {/* 3. Cooperative Admin */}
          <SpotlightCard
            className="p-8 bg-[#081C33] border border-white/10 shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">
                {t.home.adminCardTitle}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                {t.home.adminCardDesc}
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-200 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.home.adminCardFeature1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.home.adminCardFeature2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.home.adminCardFeature3}</span>
                </li>
              </ul>
            </div>

            <Link
              href="/admin/dashboard"
              onClick={() => setRole("ADMIN")}
              className="mt-8 pt-4 border-t border-white/10 text-xs font-black text-emerald-400 flex items-center justify-between"
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
          className="p-8 sm:p-12 relative overflow-hidden rounded-[36px] border border-amber-400/30 bg-[#081C33] text-white shadow-2xl"
        >
          {/* Top tricolor ribbon on banner */}
          <div className="absolute top-0 inset-x-0 h-1.5 grid grid-cols-3">
            <div className="bg-[#FF9933]" />
            <div className="bg-[#FFFFFF]" />
            <div className="bg-[#138808]" />
          </div>
          <BorderBeam colorFrom="#FF9933" colorTo="#07172B" duration={8} innerBg="bg-[#081C33]" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider inline-block mb-3.5">
              {t.home.ctaBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t.home.ctaTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-3 leading-relaxed max-w-lg mx-auto">
              {t.home.ctaSubtitle}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
              <Link href="/customer/book">
                <button
                  type="button"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all duration-150 active:scale-95 flex items-center gap-2 cursor-pointer border border-amber-300/40"
                >
                  <Wrench className="w-4 h-4 text-slate-950" />
                  <span>{t.home.bookWorker}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </Link>
              <Link
                href="/worker/register"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs sm:text-sm transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-md backdrop-blur-xl active:scale-95"
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
