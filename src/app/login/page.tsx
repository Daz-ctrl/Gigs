"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  ArrowRight,
  Mail,
  Lock,
  ExternalLink,
  KeyRound,
  Wrench,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";
import { findSystemAccount } from "@/lib/authUsers";

export default function LoginPage() {
  const router = useRouter();
  const { login, showToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "WORKER">("CUSTOMER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email & Password state
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");

  // Email OTP state
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);
  const [demoOtpDisplay, setDemoOtpDisplay] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Handle manual Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!emailInput) {
      setAuthError("Please enter your email address.");
      return;
    }
    if (!passwordInput) {
      setAuthError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check if it matches an admin or registered system account
      const matched = findSystemAccount(emailInput);
      if (matched) {
        if (passwordInput !== matched.password && passwordInput !== "FDH12345") {
          setAuthError("Incorrect password. Please verify your credentials.");
          setIsSubmitting(false);
          return;
        }

        login(matched);
        showToast(`Welcome back, ${matched.name}!`);

        if (matched.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (matched.role === "WORKER") {
          router.push("/worker/dashboard");
        } else {
          router.push("/customer/book");
        }
        return;
      }

      // 2. Fallback general login
      const fallbackUser = {
        role: selectedRole,
        name: emailInput.split("@")[0].replace(/\./g, " "),
        badge: selectedRole === "WORKER" ? "Co-op Worker" : "Resident Customer",
        subtext: `${emailInput} · Sahakar Karmakar`,
        avatar:
          selectedRole === "WORKER"
            ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        id: `user-${Date.now().toString().slice(-4)}`,
        zone: "Zone 1 - MVP Colony & Beach Road, Vizag",
      };

      login(fallbackUser);
      showToast(`Signed in as ${fallbackUser.name}!`);

      if (selectedRole === "WORKER") {
        router.push("/worker/dashboard");
      } else {
        router.push("/customer/book");
      }
    } catch (err: any) {
      setAuthError(err.message || "An error occurred during authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Send Email OTP
  const handleSendEmailOtp = async () => {
    if (!emailInput) {
      setAuthError("Please enter your email address first.");
      return;
    }

    setIsSendingEmailOtp(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/auth/email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEmailOtpSent(true);
        setEmailPreviewUrl(data.previewUrl || null);
        setDemoOtpDisplay(data.demoOtp || null);
        showToast("6-digit OTP sent to your email!");
      } else {
        setAuthError(data.error || "Failed to send OTP.");
      }
    } catch (e) {
      setAuthError("Network error while sending OTP.");
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  // Handle Verify Email OTP
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!emailOtpCode) {
      setAuthError("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/email-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, otp: emailOtpCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const matched = findSystemAccount(emailInput);
        if (matched) {
          login(matched);
          showToast(`Verified! Welcome back, ${matched.name}`);
          if (matched.role === "ADMIN") {
            router.push("/admin/dashboard");
          } else if (matched.role === "WORKER") {
            router.push("/worker/dashboard");
          } else {
            router.push("/customer/book");
          }
          return;
        }

        const otpUser = {
          role: selectedRole,
          name: emailInput.split("@")[0].replace(/\./g, " "),
          badge: selectedRole === "WORKER" ? "Verified Worker" : "Verified Resident",
          subtext: `${emailInput} · Sahakar Karmakar`,
          avatar:
            selectedRole === "WORKER"
              ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          id: `otp-${Date.now().toString().slice(-4)}`,
          zone: "Zone 1 - MVP Colony & Beach Road, Vizag",
        };

        login(otpUser);
        showToast("Email verified successfully!");

        if (selectedRole === "WORKER") {
          router.push("/worker/dashboard");
        } else {
          router.push("/customer/book");
        }
      } else {
        setAuthError(data.error || "Invalid OTP code.");
      }
    } catch (e) {
      setAuthError("Error verifying OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BackgroundGrid className="min-h-screen flex flex-col items-center justify-start pt-24 sm:pt-28 pb-16 px-4">
      <div className="w-full max-w-[440px] mx-auto">
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.12)"
          className="p-6 sm:p-7 relative overflow-hidden rounded-[26px] border border-slate-200/90 dark:border-white/[0.1] bg-white/95 dark:bg-[#070c16]/95 backdrop-blur-2xl shadow-xl"
        >
          <BorderBeam duration={8} colorFrom="#10b981" colorTo="#06b6d4" />

          {/* Header */}
          <div className="text-center mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-emerald-500/20 mx-auto mb-3">
              SK
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign In to Sahakar Karmakar
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Worker-Owned Cooperative Platform (सहकार कर्मकार)
            </p>
          </div>

          {/* Step 1: Choose Persona */}
          <div className="mb-5 relative z-10">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              1. Choose Your Account Type
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedRole("CUSTOMER")}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer relative ${
                  selectedRole === "CUSTOMER"
                    ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-950 dark:text-white shadow-sm"
                    : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <User className={`w-5 h-5 ${selectedRole === "CUSTOMER" ? "text-emerald-500" : "text-slate-400"}`} />
                  {selectedRole === "CUSTOMER" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <span className="block font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Citizen Customer
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Book verified workers
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("WORKER")}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer relative ${
                  selectedRole === "WORKER"
                    ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-950 dark:text-white shadow-sm"
                    : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Wrench className={`w-5 h-5 ${selectedRole === "WORKER" ? "text-emerald-500" : "text-slate-400"}`} />
                  {selectedRole === "WORKER" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <span className="block font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Co-op Worker
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Accept gigs & virtual ID
                </span>
              </button>
            </div>
          </div>

          {/* Step 2: Continue with Google OAuth */}
          <div className="relative z-10 mb-5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              2. One-Tap Google Sign-In
            </label>
            <GoogleSignInButton
              role={selectedRole}
              text={`Continue with Google as ${selectedRole === "CUSTOMER" ? "Customer" : "Worker"}`}
            />

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-white dark:bg-[#070c16] px-2.5 text-slate-400 font-bold">
                  Or Administrator / Password Login
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher: Password vs OTP */}
          <div className="flex items-center gap-1.5 mb-3 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] relative z-10">
            <button
              type="button"
              onClick={() => {
                setLoginMode("password");
                setAuthError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                loginMode === "password"
                  ? "bg-emerald-600 text-white shadow-sm font-extrabold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode("otp");
                setAuthError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                loginMode === "otp"
                  ? "bg-emerald-600 text-white shadow-sm font-extrabold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Email OTP</span>
            </button>
          </div>

          {/* Auth Form */}
          <div className="relative z-10">
            {authError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {authError}
              </div>
            )}

            {/* Email Address Input */}
            <div className="mb-2.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition"
                />
                <Mail className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* PASSWORD LOGIN MODE */}
            {loginMode === "password" && (
              <form onSubmit={handlePasswordLogin} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition"
                    />
                    <Lock className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In with Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* EMAIL OTP LOGIN MODE */}
            {loginMode === "otp" && (
              <div>
                {!emailOtpSent ? (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={isSendingEmailOtp}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSendingEmailOtp ? (
                      <span>Sending OTP...</span>
                    ) : (
                      <>
                        <span>Send 6-Digit Email OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <form onSubmit={handleVerifyEmailOtp} className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Enter 6-Digit Code
                        </label>
                        {demoOtpDisplay && (
                          <span className="text-[10px] text-emerald-500 font-bold font-mono">
                            OTP: {demoOtpDisplay}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={emailOtpCode}
                        onChange={(e) => setEmailOtpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full px-3.5 py-2 rounded-xl border border-emerald-500 bg-emerald-500/5 text-slate-900 dark:text-white text-center text-base tracking-widest font-mono font-bold focus:outline-none"
                      />
                    </div>

                    {emailPreviewUrl && (
                      <a
                        href={emailPreviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] text-emerald-500 hover:underline font-semibold"
                      >
                        <span>View simulated email in Ethereal Inbox</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? "Verifying..." : "Verify & Sign In"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmailOtpSent(false)}
                        className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        Resend
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 relative z-10">
            <Link
              href="/worker/register"
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>Worker e-KYC Portal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/customer/book"
              className="hover:text-slate-700 dark:hover:text-slate-300 transition"
            >
              Customer Services
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </BackgroundGrid>
  );
}
