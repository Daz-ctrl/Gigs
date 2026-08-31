"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogIn,
  User,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Mail,
  Lock,
  ExternalLink,
  KeyRound,
  Wrench,
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

  const [selectedRoleTab, setSelectedRoleTab] = useState<"CUSTOMER" | "WORKER" | "ADMIN">("CUSTOMER");
  const [selectedRole, setSelectedRole] = useState<UserRole>("CUSTOMER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email & Password state
  const [emailInput, setEmailInput] = useState("Kameswara.surya@gmail.com");
  const [passwordInput, setPasswordInput] = useState("FDH12345");
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");

  // Email OTP state
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);
  const [demoOtpDisplay, setDemoOtpDisplay] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Auto-detect role when typing email
  useEffect(() => {
    const matched = findSystemAccount(emailInput);
    if (matched) {
      setSelectedRole(matched.role);
      setSelectedRoleTab(matched.role);
    }
  }, [emailInput]);

  const handleSelectPreconfigured = (email: string) => {
    setEmailInput(email);
    setPasswordInput("FDH12345");
    const matched = findSystemAccount(email);
    if (matched) {
      setSelectedRole(matched.role);
      setSelectedRoleTab(matched.role);
    }
    setAuthError(null);
  };

  // Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return;
    }
    if (!passwordInput) {
      setAuthError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "password_login",
          email: emailInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        showToast(`Authenticated as ${data.user.name} (${data.user.role})!`);
        login(data.user);
        if (data.user.role === "CUSTOMER") {
          router.push("/customer/book");
        } else if (data.user.role === "WORKER") {
          router.push("/worker/dashboard");
        } else {
          router.push("/admin/dashboard");
        }
      } else {
        setAuthError(data.error || "Invalid email or password.");
      }
    } catch (e: any) {
      setAuthError("Failed to reach authentication server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP Dispatch Handler
  const handleSendEmailOtp = async () => {
    if (!emailInput || !emailInput.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return;
    }
    setAuthError(null);
    setIsSendingEmailOtp(true);
    try {
      const res = await fetch("/api/auth/email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email: emailInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailOtpSent(true);
        if (data.previewUrl) setEmailPreviewUrl(data.previewUrl);
        if (data.demoCode) {
          setDemoOtpDisplay(data.demoCode);
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification("CoopServe Login OTP", {
              body: `Your verification code is ${data.demoCode}. Valid for 5 minutes.`,
              icon: "/favicon.ico",
            });
          }
        }
        showToast(`Verification code sent to ${emailInput}! Check your inbox.`);
      } else {
        setAuthError(data.error || "Failed to send email OTP.");
      }
    } catch (e: any) {
      setAuthError("Failed to reach email dispatch server.");
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  // OTP Verification Handler
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOtpCode) {
      setAuthError("Please enter the 6-digit code.");
      return;
    }
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email: emailInput,
          code: emailOtpCode,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        showToast(`Email verified! Welcome ${data.user.name} (${data.user.role}).`);
        login(data.user);
        if (data.user.role === "CUSTOMER") {
          router.push("/customer/book");
        } else if (data.user.role === "WORKER") {
          router.push("/worker/dashboard");
        } else {
          router.push("/admin/dashboard");
        }
      } else {
        setAuthError(data.error || "Invalid verification code.");
      }
    } catch (e: any) {
      setAuthError("Error verifying code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const matchedAccount = findSystemAccount(emailInput);

  return (
    <BackgroundGrid className="min-h-screen flex flex-col items-center justify-start pt-24 sm:pt-28 pb-16 px-4">
      <div className="w-full max-w-[440px] mx-auto">
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.12)"
          className="p-6 sm:p-7 relative overflow-hidden rounded-[26px] border border-slate-200/90 dark:border-white/[0.1] bg-white/95 dark:bg-[#070c16]/95 backdrop-blur-2xl shadow-xl"
        >
          <BorderBeam duration={8} colorFrom="#10b981" colorTo="#06b6d4" />

          {/* Header */}
          <div className="text-center mb-5 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-emerald-500/20 mx-auto mb-2.5">
              SK
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign In to Sahakar Karmakar
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Worker-Owned Cooperative Platform (सहकार कर्मकार)
            </p>
          </div>

          {/* Fast Persona Quick-Select */}
          <div className="mb-4 relative z-10">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Quick Select Persona:</span>
              <span className="text-[10px] text-emerald-500 font-semibold font-mono">Password: FDH12345</span>
            </div>

            {/* Persona Role Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] mb-2">
              {[
                { id: "CUSTOMER" as const, label: "👤 Customer" },
                { id: "WORKER" as const, label: "🛠️ Workers" },
                { id: "ADMIN" as const, label: "🏢 Admin" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoleTab(tab.id);
                    if (tab.id === "CUSTOMER") handleSelectPreconfigured("Kameswara.surya@gmail.com");
                    else if (tab.id === "ADMIN") handleSelectPreconfigured("Admin@gmail.com");
                    else handleSelectPreconfigured("dheeraj@gmail.com");
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                    selectedRoleTab === tab.id
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-extrabold"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Persona Selection */}
            {selectedRoleTab === "CUSTOMER" && (
              <button
                type="button"
                onClick={() => handleSelectPreconfigured("Kameswara.surya@gmail.com")}
                className="w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition border cursor-pointer bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-between"
              >
                <div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">Kameswara Surya</div>
                  <div className="text-[10px] text-slate-400 font-normal">Kameswara.surya@gmail.com · MVP Colony</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 font-bold">Selected</span>
              </button>
            )}

            {selectedRoleTab === "ADMIN" && (
              <button
                type="button"
                onClick={() => handleSelectPreconfigured("Admin@gmail.com")}
                className="w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition border cursor-pointer bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-between"
              >
                <div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">Ward Sachivalayam Secretary</div>
                  <div className="text-[10px] text-slate-400 font-normal">Admin@gmail.com · Ward #18 (GVMC)</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-500 font-bold">Selected</span>
              </button>
            )}

            {selectedRoleTab === "WORKER" && (
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { name: "Dheeraj", trade: "❄️ AC & HVAC", email: "dheeraj@gmail.com" },
                  { name: "Vaman", trade: "🔧 Plumber", email: "vaman@gmail.com" },
                  { name: "Mohan", trade: "🪚 Carpenter", email: "mohan@gmail.com" },
                  { name: "Hanish", trade: "🩺 Care Taker", email: "hanish@gmail.com" },
                ].map((artisan) => {
                  const isSelected = emailInput.toLowerCase() === artisan.email.toLowerCase();
                  return (
                    <button
                      key={artisan.email}
                      type="button"
                      onClick={() => handleSelectPreconfigured(artisan.email)}
                      className={`py-1.5 px-2 rounded-xl text-left text-xs font-bold transition border cursor-pointer ${
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30 shadow-sm"
                          : "bg-slate-100/70 dark:bg-white/[0.04] border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-extrabold text-[11px] text-slate-900 dark:text-white truncate">
                        {artisan.name}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                        {artisan.trade}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Option 1: Continue with Google */}
          <div className="relative z-10 mb-4">
            <GoogleSignInButton text="Continue with Google" />

            <div className="relative my-3.5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-white dark:bg-[#070c16] px-2.5 text-slate-400 font-bold">
                  Or Email & Password
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                {matchedAccount && (
                  <span className="text-[10px] font-bold text-emerald-500 px-2 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {matchedAccount.role}
                  </span>
                )}
              </div>
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
                    <span className="text-[10px] text-slate-400">Default: FDH12345</span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="FDH12345"
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
                  <form onSubmit={handleVerifyEmailOtp} className="space-y-3 animate-in fade-in">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Enter 6-Digit Code
                        </label>
                        <button
                          type="button"
                          onClick={() => setEmailOtpSent(false)}
                          className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                        >
                          Change Email
                        </button>
                      </div>

                      <input
                        type="text"
                        maxLength={6}
                        value={emailOtpCode}
                        onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        className="w-full text-center tracking-[0.5em] font-mono font-bold text-xl px-4 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                      />

                      {demoOtpDisplay && (
                        <div className="mt-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-between">
                          <span className="font-semibold">Demo Sandbox OTP:</span>
                          <strong className="font-mono font-black text-sm tracking-widest">{demoOtpDisplay}</strong>
                        </div>
                      )}

                      {emailPreviewUrl && (
                        <a
                          href={emailPreviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-blue-500 font-semibold hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open Ethereal Mailbox Preview</span>
                        </a>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Verifying...</span>
                      ) : (
                        <>
                          <span>Verify & Access Account</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer Links */}
          <div className="mt-5 pt-3.5 border-t border-slate-200/80 dark:border-white/[0.08] text-center text-xs text-slate-500 relative z-10 flex items-center justify-between">
            <Link
              href="/register"
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              New Citizen? Register
            </Link>

            <Link
              href="/worker/register"
              className="text-slate-500 dark:text-slate-400 font-medium hover:text-emerald-500 hover:underline"
            >
              Worker e-KYC Portal
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </BackgroundGrid>
  );
}
