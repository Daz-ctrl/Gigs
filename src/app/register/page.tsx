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
          spotlightColor="rgba(11, 37, 69, 0.12)"
          className="p-6 sm:p-10 relative overflow-hidden rounded-[32px] border-2 border-[#0B2545]/15 bg-[#FFFDF9] shadow-xl"
        >
          <BorderBeam duration={7} colorFrom="#FF9933" colorTo="#0B2545" />

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B2545]/10 border border-[#0B2545]/20 text-[#0B2545] text-xs font-black uppercase tracking-wider mb-3">
              <UserPlus className="w-3.5 h-3.5 text-amber-600" />
              Community Citizen Registration
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1120] tracking-tight">
              Create Your Customer Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 max-w-md mx-auto">
              Connect directly with verified local cooperative artisans at statutory fair prices.
            </p>
          </div>

          {/* Alternative Worker Choice Card */}
          <div className="mb-6 p-4 rounded-2xl bg-[#F4ECE1] border border-[#0B2545]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-black">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-[#0A1120] block">
                  Are you an Electrician, Plumber, or Artisan?
                </span>
                <span className="text-[11px] text-slate-700 font-medium">
                  Register as a Worker-Owner with Free UIDAI Aadhaar e-KYC (Keep 90% payout).
                </span>
              </div>
            </div>
            <Link
              href="/worker/register"
              className="px-3.5 py-1.5 rounded-xl bg-[#0B2545] hover:bg-[#07182c] text-white font-black text-xs shrink-0 self-end sm:self-auto shadow-sm"
            >
              Join as Artisan →
            </Link>
          </div>

          {/* Quick Sign up with Google */}
          <div className="mb-6 relative z-10">
            <GoogleSignInButton text="Sign up with Google (Instant)" />
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#0B2545]/15" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-[#FFFDF9] px-3 text-slate-600 font-bold">
                  Or register manually
                </span>
              </div>
            </div>
          </div>

          {/* Customer Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-black text-[#0A1120] mb-1">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#0B2545]/20 bg-white text-xs text-[#0A1120] font-medium outline-none focus:ring-2 focus:ring-[#0B2545]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#0A1120] mb-1">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#0B2545]/20 bg-white text-xs text-[#0A1120] font-medium outline-none focus:ring-2 focus:ring-[#0B2545]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#0A1120] mb-1">
                Locality / Cooperative Service Zone *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#0B2545]/20 bg-white text-xs text-[#0A1120] font-medium outline-none focus:ring-2 focus:ring-[#0B2545]/40 cursor-pointer"
                >
                  <option value="Zone 1 - MVP Colony & Beach Road">Zone 1 - MVP Colony & Beach Road (MVP, Waltair, Pandurangapuram)</option>
                  <option value="Zone 2 - Gajuwaka & Steel Plant">Zone 2 - Gajuwaka & Steel Plant (Kurmannapalem, Sheela Nagar)</option>
                  <option value="Zone 3 - Madhurawada & IT SEZ">Zone 3 - Madhurawada & IT SEZ (Rushikonda, PM Palem, Yendada)</option>
                  <option value="Zone 4 - Jagadamba & City Central">Zone 4 - Jagadamba & City Central (Dwaraka Nagar, Daba Gardens)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#0A1120] mb-1">
                Flat / Street Address (Optional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <textarea
                  rows={2}
                  placeholder="Flat 402, Block B, Silver Palms..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#0B2545]/20 bg-white text-xs text-[#0A1120] font-medium outline-none focus:ring-2 focus:ring-[#0B2545]/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#0B2545] hover:bg-[#07182c] text-white font-black text-xs shadow-lg shadow-[#0B2545]/20 transition cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{isSubmitting ? "Creating Profile..." : "Create Profile & Explore Artisans"}</span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-[#0B2545]/10 text-center text-xs text-slate-700 font-medium relative z-10">
            <span>Already registered? </span>
            <Link
              href="/login"
              className="font-black text-[#0B2545] hover:underline"
            >
              Sign In Here →
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </BackgroundGrid>
  );
}
