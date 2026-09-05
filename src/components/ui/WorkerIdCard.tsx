"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ShieldCheck,
  Award,
  QrCode,
  Phone,
  CheckCircle2,
  RotateCw,
  Sparkles,
  HeartHandshake,
  Check,
  ExternalLink,
} from "lucide-react";
import { WorkerWithDetails } from "@/types";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { motion } from "framer-motion";

interface WorkerIdCardProps {
  worker: WorkerWithDetails;
  showFlipButton?: boolean;
  isPublicView?: boolean;
}

export function WorkerIdCard({
  worker,
  showFlipButton = true,
  isPublicView = false,
}: WorkerIdCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/worker/id/${worker.id}`
      : `https://coopserve.gov.in/worker/id/${worker.id}`;

  return (
    <div className="relative w-full max-w-sm mx-auto [perspective:1200px]">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full min-h-[460px]"
      >
        {/* ========================================================= */}
        {/* FRONT OF THE ID CARD (0 deg)                              */}
        {/* ========================================================= */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          className="w-full h-full rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white shadow-2xl border border-emerald-500/30 overflow-hidden absolute inset-0 flex flex-col justify-between"
        >
          {/* Subtle Guilloche / Hologram overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Top: Federation Seal & Name */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-emerald-500/30 shrink-0">
                KS
              </div>
              <div>
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">
                  Govt. of India · Ministry of Cooperation
                </div>
                <div className="text-xs font-black text-slate-100 tracking-tight mt-0.5">
                  Labour Co-op Digital Identity
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full shrink-0">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>VERIFIED</span>
            </div>
          </div>

          {/* Worker Photo & Main Details */}
          <div className="flex gap-4 items-center mb-3">
            <div className="relative shrink-0">
              <UserAvatar
                src={worker.avatar}
                name={worker.name}
                className="w-16 h-16 rounded-2xl border-2 border-emerald-400 shadow-md text-xl"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-1 shadow">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-base font-extrabold text-white truncate">{worker.name}</h4>
              <p className="text-xs text-emerald-300 font-semibold truncate">
                {worker.skills.split(",")[0]}
              </p>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>{worker.phone}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Aadhaar: <span className="font-mono text-slate-300">{worker.aadhaarMasked}</span>
              </div>
            </div>
          </div>

          {/* Society & Skills Meta */}
          <div className="bg-slate-800/70 rounded-2xl p-3 border border-slate-700/60 space-y-1.5 mb-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Affiliated Society:</span>
              <span className="font-semibold text-slate-200 text-right truncate max-w-[190px]">
                {worker.society?.name || "MVP Colony & Beach Sector Co-op, Vizag"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Experience:</span>
              <span className="font-semibold text-emerald-400">{worker.experienceYrs} Years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cooperative Rating:</span>
              <span className="font-semibold text-amber-300">★ {worker.rating.toFixed(1)} / 5.0</span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-3 text-slate-950 shadow-inner">
            {isPublicView ? (
              <div className="flex items-center gap-3">
                <QRCodeSVG
                  value={verificationUrl}
                  size={52}
                  level="M"
                  includeMargin={false}
                  className="rounded-lg shrink-0 border border-emerald-500/50"
                />
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Worker</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold leading-tight mt-0.5">
                    Cooperative Seal Authenticated
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                    ID: {worker.digitalIdCard.slice(0, 18)}...
                  </div>
                </div>
              </div>
            ) : (
              <a
                href={verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:opacity-85 transition group cursor-pointer"
                title="Click or scan to view standalone verified card"
              >
                <QRCodeSVG
                  value={verificationUrl}
                  size={52}
                  level="M"
                  includeMargin={false}
                  className="rounded-lg shrink-0 border border-slate-200 group-hover:border-emerald-500 transition"
                />
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1 group-hover:text-emerald-600 transition">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Scan to Verify</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-400 group-hover:text-emerald-600 ml-0.5" />
                  </div>
                  <div className="text-[10px] text-slate-600 leading-tight mt-0.5">
                    Instant Aadhaar & Skill check
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                    ID: {worker.digitalIdCard.slice(0, 18)}...
                  </div>
                </div>
              </a>
            )}

            {showFlipButton && (
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-700 transition cursor-pointer flex flex-col items-center gap-0.5 shrink-0"
                title="Flip to view Welfare details"
              >
                <RotateCw className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase">Flip</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* BACK OF THE ID CARD (180 deg, unmirrored, right-side-up)  */}
        {/* ========================================================= */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="w-full h-full rounded-3xl p-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white shadow-2xl border border-emerald-500/30 overflow-hidden absolute inset-0 flex flex-col justify-between"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                Social Security & Skill Credentials
              </span>
            </div>
            {showFlipButton && (
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                title="Flip to Front"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Front</span>
              </button>
            )}
          </div>

          {/* Certifications */}
          <div className="space-y-2 mb-3">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Verified Government Certifications
            </div>
            {worker.certifications && worker.certifications.length > 0 ? (
              worker.certifications.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl bg-slate-800/80 p-2.5 border border-slate-700/60 text-xs"
                >
                  <div className="font-bold text-emerald-300 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{c.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between mt-0.5">
                    <span className="truncate max-w-[200px]">{c.issuer}</span>
                    <span className="font-mono text-[10px] text-slate-400">Yr: {c.issuedYear}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-slate-800/80 p-2.5 border border-slate-700/60 text-xs">
                <div className="font-bold text-emerald-300">NSDC Master Craft Certification</div>
                <div className="text-[11px] text-slate-400">
                  National Skill Development Corporation
                </div>
              </div>
            )}
          </div>

          {/* Cooperative Welfare Linkage */}
          <div className="space-y-2 mb-3">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-3 h-3 text-emerald-400" />
              <span>Cooperative Welfare Linkage</span>
            </div>
            <div className="rounded-xl bg-emerald-950/40 p-2.5 border border-emerald-500/20 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Insurance Scheme:</span>
                <span className="font-bold text-emerald-400">PMSBY Co-op Cover</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Policy Ref:</span>
                <span className="font-mono text-slate-300 text-[11px]">
                  {worker.welfareRecord?.policyNumber || "PMSBY-AP-VZG-9082"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency Co-op Fund:</span>
                <span className="font-bold text-white">
                  ₹{worker.welfareRecord?.fundBalance?.toLocaleString() || "8,850"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 pt-2 border-t border-emerald-500/10">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Federation Digital Registry · Andhra Pradesh State Chapter</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
