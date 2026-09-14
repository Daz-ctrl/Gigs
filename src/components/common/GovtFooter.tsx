"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Phone,
  Building2,
  ExternalLink,
  Award,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  Mail,
  Scale,
  FileText,
} from "lucide-react";

export function GovtFooter() {
  return (
    <footer className="w-full bg-[#051121] text-slate-300 border-t-2 border-amber-500/80 relative z-20 text-xs">
      {/* 1. National Cooperative Initiatives Strip */}
      <div className="bg-[#091b33] border-b border-white/[0.08] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm border border-amber-500/30">
              🇮🇳
            </div>
            <div>
              <div className="font-bold text-white text-xs tracking-wide">
                सहकार से समृद्धि (Sahakar Se Samriddhi)
              </div>
              <div className="text-[11px] text-slate-400">
                National Mission for Empowering Labour & Artisan Cooperative Federations
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MSCS Act 2002 Compliant</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>UIDAI e-KYC Certified</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>PMSBY ₹2 Lakh Covered</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Government Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Ministry Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
              KS
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">कार्यसेतु (KaryaSetu)</div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Ministry of Cooperation
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Official National Digital Platform for Multi-State Labour Cooperatives, Ward Artisans & Household Services. Ensuring 90% direct artisan remuneration with 0% corporate commissions.
          </p>
          <div className="pt-1 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi – 110001</span>
            </div>
          </div>
        </div>

        {/* Col 2: Citizen & Worker Services */}
        <div className="space-y-2.5">
          <div className="font-bold text-white text-xs uppercase tracking-wider border-b border-white/10 pb-1.5 text-amber-400">
            Public Services / नागरिक सेवाएं
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li>
              <Link href="/customer/book" className="hover:text-amber-400 transition flex items-center gap-1">
                <span>Book Cooperative Artisan (0% Surge)</span>
              </Link>
            </li>
            <li>
              <Link href="/worker/register" className="hover:text-amber-400 transition flex items-center gap-1">
                <span>Worker Free e-KYC Registration</span>
              </Link>
            </li>
            <li>
              <Link href="/worker/dashboard" className="hover:text-amber-400 transition flex items-center gap-1">
                <span>Artisan Digital ID & Welfare Roster</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard" className="hover:text-amber-400 transition flex items-center gap-1">
                <span>Cooperative Registrar Administration</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Legal & GIGW Governance */}
        <div className="space-y-2.5">
          <div className="font-bold text-white text-xs uppercase tracking-wider border-b border-white/10 pb-1.5 text-amber-400">
            Policy & Compliance / नीतियां
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li>
              <span className="hover:text-white cursor-pointer">Multi-State Co-op Societies (MSCS) Bylaws</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">PMSBY Insurance & Welfare Fund Norms</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">Citizen Charter & Fair Wage Schedule</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">GIGW 3.0 Accessibility Statement</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">Privacy Policy & Hyperlinking Terms</span>
            </li>
          </ul>
        </div>

        {/* Col 4: National Helpdesk & Verification */}
        <div className="space-y-2.5">
          <div className="font-bold text-white text-xs uppercase tracking-wider border-b border-white/10 pb-1.5 text-amber-400">
            National Helpdesk / सहायता केंद्र
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-sm tracking-wide">1800-180-26089</span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              Toll-Free 24x7 Citizen & Artisan Support (English, हिन्दी, తెలుగు, தமிழ்)
            </div>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-300">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>support.cooperation@gov.in</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom GIGW Copyright Bar */}
      <div className="bg-[#030914] py-4 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            Website Content Managed by <strong>Ministry of Cooperation, Government of India</strong>.
            <div className="text-[10px] text-slate-400 mt-0.5">
              Designed, Developed and Deployed for National Labour Cooperative Federations (SIH26089).
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">GIGW Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
