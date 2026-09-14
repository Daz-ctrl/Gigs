"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  User,
  ShieldCheck,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Building,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";

export default function RegisterPage() {
  const router = useRouter();
  const { registerCustomer } = useApp();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [zone, setZone] = useState("Zone 1 - South Delhi");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      registerCustomer({
        name: name.trim() || "New Resident",
        phone: phone.trim(),
        zone,
      });
      setIsSubmitting(false);
      router.push("/customer/book");
    }, 400);
  };

  return (
    <BackgroundGrid className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto my-10">
        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.15)"
          className="p-6 sm:p-10 relative overflow-hidden rounded-[32px] border border-white/10 bg-[#081C33]/95 shadow-2xl text-white"
        >
          <BorderBeam duration={7} colorFrom="#F59E0B" colorTo="#3B82F6" innerBg="bg-[#081C33]" />

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
              Community Citizen Registration
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Create Your Customer Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-md mx-auto">
              Connect directly with verified local cooperative artisans at statutory fair prices.
            </p>
          </div>

          {/* Alternative Worker Choice Card */}
          <div className="mb-6 p-4 rounded-2xl bg-[#0B2545] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 font-black">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-white block">
                  Are you an Electrician, Plumber, or Artisan?
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  Register as a Worker-Owner with Free UIDAI Aadhaar e-KYC (Keep 90% payout).
                </span>
              </div>
            </div>
            <Link
              href="/worker/register"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 self-end sm:self-auto shadow-sm"
            >
              Join as Artisan →
            </Link>
          </div>

          {/* Quick Sign up with Google */}
          <div className="mb-6 relative z-10">
            <GoogleSignInButton text="Sign up with Google (Instant)" />
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-[#081C33] px-3 text-slate-400 font-bold">
                  Or register manually
                </span>
              </div>
            </div>
          </div>

          {/* Customer Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-black text-slate-200 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-[#0B2545] text-xs text-white font-medium outline-none focus:ring-2 focus:ring-amber-400/40 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-200 mb-1">
                Mobile Number (for Start-Work OTP updates) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="+91 98100 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-[#0B2545] text-xs text-white font-medium outline-none focus:ring-2 focus:ring-amber-400/40 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-200 mb-1">
                Locality / Cooperative Service Zone *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-[#0B2545] text-xs text-white font-bold outline-none focus:ring-2 focus:ring-amber-400/40 cursor-pointer"
                >
                  <option value="Zone 1 - MVP Colony & Beach Road" className="bg-[#0B2545] text-white">Zone 1 - MVP Colony & Beach Road (MVP, Waltair, Pandurangapuram)</option>
                  <option value="Zone 2 - Gajuwaka & Steel Plant" className="bg-[#0B2545] text-white">Zone 2 - Gajuwaka & Steel Plant (Kurmannapalem, Sheela Nagar)</option>
                  <option value="Zone 3 - Madhurawada & IT SEZ" className="bg-[#0B2545] text-white">Zone 3 - Madhurawada & IT SEZ (Rushikonda, PM Palem, Yendada)</option>
                  <option value="Zone 4 - Jagadamba & City Central" className="bg-[#0B2545] text-white">Zone 4 - Jagadamba & City Central (Dwaraka Nagar, Daba Gardens)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-200 mb-1">
                Flat / Street Address (Optional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <textarea
                  rows={2}
                  placeholder="Flat 402, Block B, Silver Palms..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/15 bg-[#0B2545] text-xs text-white font-medium outline-none focus:ring-2 focus:ring-amber-400/40 placeholder:text-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>{isSubmitting ? "Creating Profile..." : "Create Profile & Explore Artisans"}</span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-slate-400 font-medium relative z-10">
            <span>Already registered? </span>
            <Link
              href="/login"
              className="font-black text-amber-400 hover:underline"
            >
              Sign In Here →
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </BackgroundGrid>
  );
}
