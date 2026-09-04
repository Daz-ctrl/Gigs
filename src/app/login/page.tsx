"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { findSystemAccount } from "@/lib/authUsers";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, showToast } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Quick fill helper for presentation/demo
  const handleFillDemoAdmin = () => {
    setAdminEmail("Admin@gmail.com");
    setAdminPassword("1234");
    setAuthError(null);
  };

  // Handle Ward Administrator Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const email = adminEmail.trim().toLowerCase();
    const password = adminPassword.trim();

    if (!email) {
      setAuthError("Please enter your official Ward Admin email.");
      return;
    }
    if (!password) {
      setAuthError("Please enter your secret access password.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if it matches Ward Admin
      if (email === "admin@gmail.com") {
        if (password !== "1234" && password !== "FDH12345") {
          setAuthError("Incorrect password. Please verify your credentials.");
          setIsSubmitting(false);
          return;
        }

        const adminAccount = findSystemAccount("admin@gmail.com") || {
          email: "Admin@gmail.com",
          role: "ADMIN" as const,
          password: "1234",
          name: "Ward Sachivalayam Secretary",
          badge: "Ward Sachivalayam #18 · GVMC",
          subtext: "Admin@gmail.com · Ward Welfare & Development Secretary",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          id: "admin-sachivalayam",
          zone: "Ward Sachivalayam #18 (MVP Colony), GVMC Visakhapatnam",
        };

        login(adminAccount);
        showToast("Welcome, Ward Sachivalayam Secretary! Opening Control Hub...");
        router.push("/admin/dashboard");
        return;
      }

      // Check if any other preconfigured system worker
      const matched = findSystemAccount(email);
      if (matched && (password === matched.password || password === "1234")) {
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

      setAuthError("Access restricted. This login is strictly for authorized Ward Sachivalayam & GVMC administrative personnel.");
    } catch (err: any) {
      setAuthError(err.message || "An authentication error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BackgroundGrid className="min-h-screen flex flex-col items-center justify-center py-16 px-4">
      <div className="w-full max-w-[430px] mx-auto">
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.12)"
          className="p-6 sm:p-8 relative overflow-hidden rounded-[28px] border border-slate-200/90 dark:border-white/[0.1] bg-white/95 dark:bg-[#070c16]/95 backdrop-blur-2xl shadow-2xl"
        >
          <BorderBeam duration={8} colorFrom="#10b981" colorTo="#06b6d4" />

          {/* Platform Header */}
          <div className="text-center mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-emerald-500/20 mx-auto mb-3">
              KS
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign In to KaryaSetu
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Worker-Owned Cooperative Platform (कार्यसेतु)
            </p>
          </div>

          {/* SECTION 1: Citizens & Workers Single Tap Login */}
          <div className="relative z-10 mb-6">
            <GoogleSignInButton text="Continue with Google" />
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2 font-medium">
              1-Tap Login for Citizens & Cooperative Artisans
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-6 text-center z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800/80" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-extrabold">
              <span className="bg-white dark:bg-[#070c16] px-3 text-slate-400 dark:text-slate-500">
                Official Government Access
              </span>
            </div>
          </div>

          {/* SECTION 2: Ward Administrator Login Form */}
          <div className="relative z-10">
            <div className="mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06]">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Admin Login
                </span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  Ward Provided
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Direct administrative credentials provided by the Ward Sachivalayam Secretariat for GVMC officials.
              </p>
            </div>

            {authError && (
              <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3">
              {/* Admin Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Admin@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition"
                  />
                  <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Secret Password
                  </label>
                  <button
                    type="button"
                    onClick={handleFillDemoAdmin}
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-fill Demo (1234)</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition"
                  />
                  <Lock className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? "Verifying Official Credentials..." : "Sign In to Admin Hub"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
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
              Citizen Services
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </BackgroundGrid>
  );
}
