"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import {
  User,
  Wrench,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
  Camera,
  Upload,
  RefreshCw,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";

const PRESET_AVATARS: Record<string, string[]> = {
  CUSTOMER: [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  ],
  WORKER: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  ],
};

export default function SelectRolePage() {
  const router = useRouter();
  const { setRole, login, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1 = Role Selection, Step 2 = Profile Customization
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("CUSTOMER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User Profile Form State
  const [googleUser, setGoogleUser] = useState<{
    name: string;
    email: string;
    avatar: string;
    id: string;
  } | null>(null);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [originalGoogleAvatar, setOriginalGoogleAvatar] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname === "0.0.0.0") {
      window.location.href = window.location.href.replace("0.0.0.0", "localhost");
      return;
    }

    const updateUserState = (u: any) => {
      const name =
        u.user_metadata?.full_name ||
        u.user_metadata?.name ||
        u.email?.split("@")[0] ||
        "Member";
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

      setFullName(name);
      setAvatarUrl(avatar);
      setOriginalGoogleAvatar(avatar);

      // If this specific user already chose a role AND completed profile customization:
      const existingRole = u.user_metadata?.role;
      const profileCompleted = u.user_metadata?.profile_completed;

      if (existingRole && profileCompleted) {
        if (existingRole === "WORKER") {
          router.replace("/worker/dashboard");
        } else if (existingRole === "CUSTOMER") {
          router.replace("/customer/book");
        }
        return;
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          updateUserState(session.user);
        }
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        updateUserState(data.session.user);
      } else {
        supabase.auth.getUser().then(({ data: userData }) => {
          if (userData?.user) {
            updateUserState(userData.user);
          }
        });
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  // Handle Local Photo File Upload (Instant Preview as Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
        showToast("Profile photo loaded!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Step 1 -> Step 2: Proceed to Profile Customization
  const handleProceedToProfile = () => {
    const presets = PRESET_AVATARS[selectedRole] || PRESET_AVATARS.CUSTOMER;
    if (selectedRole === "WORKER" && (!avatarUrl || avatarUrl === PRESET_AVATARS.CUSTOMER[0])) {
      setAvatarUrl(presets[0]);
    }
    setStep(2);
  };

  // Step 2: Save Profile & Finalize Onboarding
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = fullName.trim() || googleUser?.name || "Member";
    const presets = PRESET_AVATARS[selectedRole] || PRESET_AVATARS.CUSTOMER;
    const finalAvatar = avatarUrl || googleUser?.avatar || presets[0];

    setIsSubmitting(true);
    try {
      await supabase.auth.updateUser({
        data: {
          role: selectedRole,
          persona: selectedRole,
          full_name: trimmedName,
          name: trimmedName,
          avatar_url: finalAvatar,
          picture: finalAvatar,
          profile_completed: true,
        },
      });

      if (googleUser?.id) {
        try {
          await supabase.from("profiles").upsert({
            id: googleUser.id,
            email: googleUser.email,
            name: trimmedName,
            avatar_url: finalAvatar,
            role: selectedRole,
            updated_at: new Date().toISOString(),
          });
        } catch (e) {
          // profiles table optional
        }
      }

      localStorage.setItem("coopserve_role", selectedRole);
      if (googleUser?.id) {
        localStorage.setItem(`coopserve_role_${googleUser.id}`, selectedRole);
      }
      localStorage.setItem("coopserve_auth", "true");

      const isWorker = selectedRole === "WORKER";
      const uEmail = googleUser?.email || "user@sahakarkarmakar.gov.in";
      const userId = googleUser?.id ? `sb-${googleUser.id.slice(-6)}` : `usr-${Date.now().toString().slice(-4)}`;

      try {
        await fetch("/api/auth/sync-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            email: uEmail,
            name: trimmedName,
            avatar: finalAvatar,
            role: selectedRole,
          }),
        });
      } catch (syncErr) {
        console.warn("DB profile sync non-blocking:", syncErr);
      }

      const appUser = {
        role: selectedRole,
        name: trimmedName,
        badge: isWorker ? "Google Verified Worker" : "Google Verified Resident",
        subtext: isWorker
          ? `${uEmail} · Registered Co-op Member`
          : `${uEmail} · MVP Colony, Vizag`,
        avatar: finalAvatar,
        id: userId,
        zone: "Zone 1 - MVP Colony & Beach Road, Vizag",
      };

      localStorage.setItem("coopserve_custom_user", JSON.stringify(appUser));
      login(appUser);
      setRole(selectedRole);
      showToast(`Welcome, ${trimmedName}! Your profile is ready.`);

      if (isWorker) {
        router.push("/worker/dashboard");
      } else {
        router.push("/customer/book");
      }
    } catch (err: any) {
      console.error(err);
      showToast("Error saving profile customization.");
      setIsSubmitting(false);
    }
  };

  const activePresets = PRESET_AVATARS[selectedRole] || PRESET_AVATARS.CUSTOMER;

  return (
    <BackgroundGrid className="min-h-screen flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-lg mx-auto">
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.15)"
          className="p-6 sm:p-8 relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-white/[0.1] bg-white/95 dark:bg-[#070c16]/95 backdrop-blur-2xl shadow-2xl"
          borderBeam={
            <BorderBeam
              duration={8}
              colorFrom="#10b981"
              colorTo="#06b6d4"
              borderRadius="24px"
            />
          }
        >
          {/* Step Progress Pill */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                step === 1
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              <span>1. Choose Role</span>
              {step === 2 && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
            <div className="w-6 h-0.5 bg-slate-200 dark:bg-slate-800" />
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                step === 2
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-400"
              }`}
            >
              <span>2. Customize Profile</span>
            </div>
          </div>

          {/* ================= STEP 1: ROLE SELECTION ================= */}
          {step === 1 && (
            <div className="flex flex-col">
              {/* User Header */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        googleUser?.avatar ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={googleUser?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-[10px] shadow-sm">
                    ✓
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Google Account Connected</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Welcome, {googleUser?.name || "Member"}!
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  How would you like to join Sahakar Karmakar today?
                </p>
              </div>

              {/* Role Option Cards */}
              <div className="space-y-3 mb-6">
                {/* Customer Option */}
                <div
                  onClick={() => setSelectedRole("CUSTOMER")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    selectedRole === "CUSTOMER"
                      ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                      : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      selectedRole === "CUSTOMER"
                        ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Citizen Customer
                      </span>
                      {selectedRole === "CUSTOMER" && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Book verified electricians, plumbers, AC repair, and home services with 0% surge fees.
                    </p>
                  </div>
                </div>

                {/* Worker Option */}
                <div
                  onClick={() => setSelectedRole("WORKER")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    selectedRole === "WORKER"
                      ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                      : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      selectedRole === "WORKER"
                        ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <Wrench className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Cooperative Worker
                      </span>
                      {selectedRole === "WORKER" && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Earn guaranteed 90% direct payouts, free group healthcare, and manage your 3D virtual ID.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="button"
                  onClick={handleProceedToProfile}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    Continue as {selectedRole === "CUSTOMER" ? "Customer" : "Worker"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: PROFILE CUSTOMIZATION ================= */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="text-center mb-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    {selectedRole === "CUSTOMER" ? "Customer" : "Worker"} Profile
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Customize Your Profile
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Set your name & photo for your {selectedRole === "WORKER" ? "Virtual ID Card" : "Account"}.
                </p>
              </div>

              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2.5">
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-xl mx-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl || activePresets[0]}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition cursor-pointer"
                    title="Upload Custom Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-2 mb-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.1] text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Photo</span>
                  </button>

                  {originalGoogleAvatar && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl(originalGoogleAvatar);
                        showToast("Reset to Google photo");
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.1] text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Use Google Photo</span>
                    </button>
                  )}
                </div>

                {/* Preset Avatars Row */}
                <div className="flex items-center justify-center gap-2">
                  {activePresets.map((preset: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset)}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                        avatarUrl === preset
                          ? "border-emerald-500 scale-105 shadow-sm ring-2 ring-emerald-500/20"
                          : "border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preset}
                        alt="Preset"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-emerald-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sunil Kumar / Ananya Sharma"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Connected Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={googleUser?.email || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] text-slate-500 dark:text-slate-400 font-mono text-xs cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !fullName.trim()}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Profile & Enter</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </SpotlightCard>
      </div>
    </BackgroundGrid>
  );
}
