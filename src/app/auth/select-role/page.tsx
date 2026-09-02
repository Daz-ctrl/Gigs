"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { User, Wrench, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";

export default function SelectRolePage() {
  const router = useRouter();
  const { setRole, login, showToast } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>("CUSTOMER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleUser, setGoogleUser] = useState<{
    name: string;
    email: string;
    avatar: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const u = data.user;
        const name =
          u.user_metadata?.full_name ||
          u.user_metadata?.name ||
          u.email?.split("@")[0] ||
          "User";
        const avatar =
          u.user_metadata?.avatar_url ||
          u.user_metadata?.picture ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

        setGoogleUser({
          name,
          email: u.email || "",
          avatar,
          id: u.id,
        });

        // If they already had a stored persona, default to it
        if (u.user_metadata?.role) {
          setSelectedRole(u.user_metadata.role as UserRole);
        }
      } else {
        // Fallback for demo or non-supabase session
        const savedCustom = localStorage.getItem("coopserve_custom_user");
        if (savedCustom) {
          try {
            const parsed = JSON.parse(savedCustom);
            setGoogleUser({
              name: parsed.name,
              email: parsed.subtext?.split(" · ")[0] || "user@example.com",
              avatar: parsed.avatar,
              id: parsed.id,
            });
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
    loadUser();
  }, []);

  const handleConfirmRole = async () => {
    setIsSubmitting(true);
    try {
      // 1. Update Supabase user metadata with selected role
      await supabase.auth.updateUser({
        data: {
          role: selectedRole,
          persona: selectedRole,
        },
      });

      // 2. Persist in local storage
      localStorage.setItem("coopserve_role", selectedRole);
      localStorage.setItem("coopserve_auth", "true");

      const isWorker = selectedRole === "WORKER";
      const uName = googleUser?.name || (isWorker ? "Co-op Worker" : "Citizen Customer");
      const uEmail = googleUser?.email || "user@sahakarkarmakar.gov.in";
      const uAvatar =
        googleUser?.avatar ||
        (isWorker
          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");

      const appUser = {
        role: selectedRole,
        name: uName,
        badge: isWorker ? "Google Verified Worker" : "Google Verified Resident",
        subtext: isWorker
          ? `${uEmail} · Registered Co-op Member`
          : `${uEmail} · MVP Colony, Vizag`,
        avatar: uAvatar,
        id: googleUser?.id ? `sb-${googleUser.id.slice(-6)}` : `usr-${Date.now().toString().slice(-4)}`,
        zone: "Zone 1 - MVP Colony & Beach Road, Vizag",
      };

      setRole(selectedRole);
      login(appUser);
      showToast(`Welcome! You are signed in as ${isWorker ? "a Worker" : "a Resident Customer"}.`);

      if (isWorker) {
        router.push("/worker/dashboard");
      } else {
        router.push("/customer/book");
      }
    } catch (err: any) {
      console.error(err);
      showToast("Error saving persona selection.");
      setIsSubmitting(false);
    }
  };

  return (
    <BackgroundGrid className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
      <div className="w-full max-w-[520px] mx-auto">
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.15)"
          className="p-7 sm:p-9 relative overflow-hidden rounded-[30px] border border-slate-200/90 dark:border-white/[0.1] bg-white/95 dark:bg-[#070c16]/95 backdrop-blur-2xl shadow-2xl"
        >
          <BorderBeam duration={8} colorFrom="#10b981" colorTo="#06b6d4" />

          {/* User Welcome Card */}
          <div className="text-center mb-6 relative z-10">
            {googleUser?.avatar ? (
              <div className="relative inline-block mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={googleUser.avatar}
                  alt={googleUser.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-lg mx-auto"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                  ✓
                </div>
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-emerald-500/20 mx-auto mb-3">
                SK
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Account Connected</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome, {googleUser?.name || "Member"}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              How would you like to use Sahakar Karmakar today?
            </p>
          </div>

          {/* 2 Big Choice Cards */}
          <div className="space-y-3.5 mb-7 relative z-10">
            {/* Option 1: Customer */}
            <button
              type="button"
              onClick={() => setSelectedRole("CUSTOMER")}
              className={`w-full p-4.5 rounded-2xl border text-left transition-all cursor-pointer relative flex items-start gap-4 ${
                selectedRole === "CUSTOMER"
                  ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md scale-[1.01]"
                  : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15]"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  selectedRole === "CUSTOMER"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                    : "bg-slate-200 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300"
                }`}
              >
                <User className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Citizen Customer
                  </span>
                  {selectedRole === "CUSTOMER" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  I want to discover and book verified cooperative electricians, plumbers, AC technicians, and caregivers with 0% surge fees.
                </p>
              </div>
            </button>

            {/* Option 2: Worker */}
            <button
              type="button"
              onClick={() => setSelectedRole("WORKER")}
              className={`w-full p-4.5 rounded-2xl border text-left transition-all cursor-pointer relative flex items-start gap-4 ${
                selectedRole === "WORKER"
                  ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md scale-[1.01]"
                  : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15]"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  selectedRole === "WORKER"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                    : "bg-slate-200 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300"
                }`}
              >
                <Wrench className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Cooperative Worker (Gig Member)
                  </span>
                  {selectedRole === "WORKER" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  I am a skilled artisan / worker. I want to earn guaranteed 90% direct payouts, free group healthcare, and manage my 3D virtual ID.
                </p>
              </div>
            </button>
          </div>

          {/* Action Button */}
          <div className="relative z-10">
            <button
              type="button"
              onClick={handleConfirmRole}
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Setting up your dashboard...</span>
                </>
              ) : (
                <>
                  <span>
                    Continue as {selectedRole === "CUSTOMER" ? "Citizen Customer" : "Co-op Worker"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-400 mt-3">
              You can switch your role anytime from the profile menu in the navigation bar.
            </p>
          </div>
        </SpotlightCard>
      </div>
    </BackgroundGrid>
  );
}
