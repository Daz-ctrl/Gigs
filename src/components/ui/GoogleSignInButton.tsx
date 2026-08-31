"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Check, X, Shield, ArrowRight, User, Wrench, Sparkles } from "lucide-react";
import { findSystemAccount } from "@/lib/authUsers";

export function GoogleSignInButton({
  text = "Continue with Google",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  const router = useRouter();
  const { login, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"CUSTOMER" | "WORKER">("CUSTOMER");
  const [customName, setCustomName] = useState("Surya");
  const [customEmail, setCustomEmail] = useState("surya@gmail.com");
  const [customRole, setCustomRole] = useState<"CUSTOMER" | "WORKER">("CUSTOMER");
  const [isCustomMode, setIsCustomMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleClick = () => {
    setModalOpen(true);
  };

  const handleSelectGoogleAccount = (
    name: string,
    email: string,
    role: "CUSTOMER" | "WORKER",
    avatar?: string,
    badge?: string
  ) => {
    setModalOpen(false);

    // Look up system account if predefined
    const matched = findSystemAccount(email);
    if (matched) {
      login(matched);
      showToast(`Signed in with Google as ${matched.name} (${role})!`);
      if (role === "WORKER") {
        router.push("/worker/dashboard");
      } else {
        router.push("/customer/book");
      }
      return;
    }

    const googleUser = {
      role,
      name,
      badge: badge || (role === "WORKER" ? "Google Verified Worker" : "Google Verified Resident"),
      subtext: `${email} · MVP Colony, Vizag`,
      avatar:
        avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      id: `google-${Date.now().toString().slice(-4)}`,
      zone: "Zone 1 - MVP Colony & Beach Road, Vizag",
    };
    login(googleUser);
    showToast(`Signed in with Google as ${name}!`);
    if (role === "WORKER") {
      router.push("/worker/dashboard");
    } else {
      router.push("/customer/book");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        className={`w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer hover:border-slate-400 active:scale-[0.99] ${className}`}
      >
        {/* Official Google G Logo SVG */}
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{text}</span>
      </button>

      {/* Global Portal Google Account Picker Modal */}
      {modalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left z-[100000]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Continue with Google
              </h3>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Select whether you are signing in as a <strong>Resident Customer</strong> or a <strong>Cooperative Worker</strong>.
            </p>

            {/* 2 Primary Category Tabs */}
            <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedCategory("CUSTOMER")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedCategory === "CUSTOMER"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer (Resident)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory("WORKER")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedCategory === "WORKER"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Worker (Co-op Member)</span>
              </button>
            </div>

            {!isCustomMode ? (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {selectedCategory === "CUSTOMER" ? (
                  /* Customer Accounts */
                  <div className="space-y-2">
                    <div
                      onClick={() =>
                        handleSelectGoogleAccount(
                          "Kameswara Surya",
                          "Kameswara.surya@gmail.com",
                          "CUSTOMER",
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        )
                      }
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-500/5 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                          alt="Kameswara Surya"
                          className="w-10 h-10 rounded-full object-cover border border-blue-500/30"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Kameswara Surya</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/15 text-blue-500 font-bold">Resident</span>
                          </div>
                          <div className="text-[11px] text-slate-500">Kameswara.surya@gmail.com</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                ) : (
                  /* Worker Accounts (All 4 Personas) */
                  <div className="space-y-2">
                    {[
                      {
                        name: "Dheeraj",
                        email: "dheeraj@gmail.com",
                        trade: "❄️ AC & HVAC Specialist",
                        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
                      },
                      {
                        name: "Vaman",
                        email: "vaman@gmail.com",
                        trade: "🔧 Master Plumber",
                        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                      },
                      {
                        name: "Mohan",
                        email: "mohan@gmail.com",
                        trade: "🪚 Master Carpenter",
                        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                      },
                      {
                        name: "Hanish",
                        email: "hanish@gmail.com",
                        trade: "🩺 Certified Care Taker",
                        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
                      },
                    ].map((artisan) => (
                      <div
                        key={artisan.email}
                        onClick={() =>
                          handleSelectGoogleAccount(
                            artisan.name,
                            artisan.email,
                            "WORKER",
                            artisan.avatar,
                            artisan.trade
                          )
                        }
                        className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/5 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={artisan.avatar}
                            alt={artisan.name}
                            className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{artisan.name}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">{artisan.trade}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">{artisan.email}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Custom Option */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomMode(true);
                    setCustomRole(selectedCategory);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition text-center cursor-pointer mt-2"
                >
                  + Use another Google account ({selectedCategory === "WORKER" ? "Worker" : "Customer"})
                </button>
              </div>
            ) : (
              /* Custom Google Account Form */
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-500">Signing in as:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${customRole === "WORKER" ? "bg-emerald-500/20 text-emerald-500" : "bg-blue-500/20 text-blue-500"}`}>
                    {customRole}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Google Email
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectGoogleAccount(customName, customEmail, customRole)
                    }
                    className={`flex-1 py-2 rounded-xl text-white font-bold text-xs cursor-pointer shadow-md ${customRole === "WORKER" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-blue-600 hover:bg-blue-500"}`}
                  >
                    Confirm & Sign In ({customRole})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(false)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-[10px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>To continue, Google will securely share your profile with Sahakar Karmakar.</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
