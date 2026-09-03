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
  const [phone, setPhone] = useState("");
  const [originalGoogleAvatar, setOriginalGoogleAvatar] = useState("");

  useEffect(() => {
    // 0. Auto-redirect from 0.0.0.0 to localhost if ever visited via 0.0.0.0
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

      // If this specific user already chose a role AND completed profile customization in the past:
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

    // 1. Listen for Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          updateUserState(session.user);
        }
      }
    );

    // 2. Direct session check
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
        showToast("Profile photo loaded successfully!");
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
      // 1. Update Supabase user metadata with selected role and customized profile
      await supabase.auth.updateUser({
        data: {
          role: selectedRole,
          persona: selectedRole,
          full_name: trimmedName,
          name: trimmedName,
          avatar_url: finalAvatar,
          picture: finalAvatar,
          phone: phone.trim() || undefined,
          profile_completed: true,
        },
      });

      // 1b. Upsert into Supabase public.profiles table
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
          // profiles table is optional
        }
      }

      // 2. Persist in local storage
      localStorage.setItem("coopserve_role", selectedRole);
      if (googleUser?.id) {
        localStorage.setItem(`coopserve_role_${googleUser.id}`, selectedRole);
      }
      localStorage.setItem("coopserve_auth", "true");

      const isWorker = selectedRole === "WORKER";
      const uEmail = googleUser?.email || "user@sahakarkarmakar.gov.in";
      const userId = googleUser?.id ? `sb-${googleUser.id.slice(-6)}` : `usr-${Date.now().toString().slice(-4)}`;

      // 3. Persist profile record into PostgreSQL/Prisma database
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
      showToast(`Welcome, ${trimmedName}! Your profile is now set.`);

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
    <BackgroundGrid className="min-h-screen flex flex-col items-center justify-center py-16 px-4">
      <div className="w-full max-w-[560px] mx-auto">
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.15)"
          className="p-7 sm:p-9 relative overflow-hidden rounded-[32px] border border-slate-200/90 dark:border-white/[0.1] bg-white/95 dark:bg-[#070c16]/95 backdrop-blur-2xl shadow-2xl"
          borderBeam={
            <BorderBeam
              duration={8}
              colorFrom="#10b981"
              colorTo="#06b6d4"
              borderRadius="32px"
            />
          }
        >
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                step === 1
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
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
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-400"
              }`}
            >
              <span>2. Customize Profile</span>
            </div>
          </div>

          {/* ================= STEP 1: ROLE SELECTION ================= */}
          {step === 1 && (
            <div>
              {/* User Welcome Header */}
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
                  How would you like to join Sahakar Karmakar today?
                </p>
              </div>

              {/* Role Cards */}
              <div className="space-y-3.5 mb-7 relative z-10">
                {/* Customer Option */}
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
                      I want to discover & book verified electricians, plumbers, AC technicians, and home care services with 0% surge fees.
                    </p>
                  </div>
                </button>

                {/* Worker Option */}
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
                      I am a skilled artisan / worker. I want guaranteed 90% direct payouts, free group healthcare, and my 3D virtual ID.
                    </p>
                  </div>
                </button>
              </div>

              {/* Action Button */}
              <div className="relative z-10">
                <button
                  type="button"
                  onClick={handleProceedToProfile}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    Continue to Profile Setup (
                    {selectedRole === "CUSTOMER" ? "Customer" : "Worker"})
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: PROFILE CUSTOMIZATION ================= */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="relative z-10">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    Setting up your{" "}
                    {selectedRole === "CUSTOMER" ? "Customer" : "Worker"} Profile
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Customize Your Profile
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose your display name and photo. This will be shown on your{" "}
                  {selectedRole === "WORKER" ? "Virtual ID Card" : "Citizen Account"}.
                </p>
              </div>

              {/* Avatar Uploader Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl || activePresets[0]}
                    alt="Custom Avatar"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-emerald-500/40 shadow-2xl shadow-emerald-500/20 transition group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition cursor-pointer active:scale-90"
                    title="Upload Custom Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.1] text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>

                  {originalGoogleAvatar && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl(originalGoogleAvatar);
                        showToast("Reset to Google profile photo");
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.1] text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Use Google Photo</span>
                    </button>
                  )}
                </div>

                {/* Preset Avatars Quick Select */}
                <div className="mt-4 text-center">
                  <div className="text-[11px] font-semibold text-slate-400 mb-2">
                    Or choose a verified avatar:
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {activePresets.map((preset: string, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(preset)}
                        className={`w-10 h-10 rounded-2xl overflow-hidden border-2 transition cursor-pointer ${
                          avatarUrl === preset
                            ? "border-emerald-500 scale-110 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-500/20"
                            : "border-slate-300 dark:border-slate-700 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset}
                          alt="Preset avatar"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name <span className="text-emerald-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sunil Kumar / Ananya Sharma"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Connected Email (Locked)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={googleUser?.email || ""}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] text-slate-500 dark:text-slate-400 font-mono text-xs cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Primary Operational Ward
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      value="Ward #18 · MVP Colony & Beach Road, Vizag"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] text-slate-600 dark:text-slate-300 text-xs cursor-not-allowed"
                    />
                    <MapPin className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 font-bold text-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !fullName.trim()}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving your profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Profile & Enter Platform</span>
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
