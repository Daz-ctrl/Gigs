"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusText, setStatusText] = useState("Authenticating your Google account...");

  useEffect(() => {
    let isMounted = true;

    async function handleUserRouting(user: any) {
      if (!isMounted) return;

      const userEmail = (user.email || "").toLowerCase().trim();
      const userName = (user.user_metadata?.name || user.user_metadata?.full_name || "").toLowerCase().trim();
      const userAvatar = (user.user_metadata?.avatar_url || user.user_metadata?.picture || "").trim();
      const userRole = user.user_metadata?.role;

      // 1. FAST PATH (0ms): If user metadata already has a role, route IMMEDIATELY without DB fetch delay
      if (userRole === "CUSTOMER") {
        setStatusText("Welcome! Redirecting to Citizen Services...");
        if (typeof window !== "undefined") {
          localStorage.setItem("coopserve_auth", "true");
          localStorage.setItem("coopserve_role", "CUSTOMER");
          const customUser = {
            role: "CUSTOMER",
            name: user.user_metadata?.name || user.user_metadata?.full_name || "Resident Citizen",
            badge: "Verified Resident Customer",
            subtext: `${user.email} · MVP Colony, Vizag`,
            avatar: userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            id: user.id ? `cust-${user.id.slice(-6)}` : "cust-resident",
            zone: "Zone 1 - MVP Colony & Beach Road, Vizag",
          };
          localStorage.setItem("coopserve_custom_user", JSON.stringify(customUser));
        }
        router.replace("/customer/book");
        return;
      }

      if (userRole === "WORKER") {
        setStatusText("Welcome! Redirecting to Worker Dashboard...");
        if (typeof window !== "undefined") {
          localStorage.setItem("coopserve_auth", "true");
          localStorage.setItem("coopserve_role", "WORKER");
        }
        router.replace("/worker/dashboard");
        return;
      }

      // 2. Fast check against system worker database (capped at 400ms)
      const userId = (user.id || "").trim();
      const userShortId = userId ? userId.slice(-6) : "";
      let matchedWorker: any = null;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 450);
        const res = await fetch("/api/workers?status=ALL", {
          signal: controller.signal,
          cache: "default",
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const workers = await res.json();
          if (Array.isArray(workers)) {
            matchedWorker = workers.find((w: any) => {
              const wEmail = (w.email || "").toLowerCase().trim();
              const wId = (w.id || "").trim();
              const wName = (w.name || "").toLowerCase().trim();
              return (
                (userEmail && wEmail && userEmail === wEmail) ||
                (userId && (wId === userId || wId === `sb-${userShortId}` || (userShortId && wId.includes(userShortId)))) ||
                (userName && wName && userName === wName)
              );
            });
          }
        }
      } catch (dbCheckErr) {
        // Continue without blocking
      }

      // If matched worker found
      if (matchedWorker) {
        const isVerified = matchedWorker.status === "VERIFIED";
        if (typeof window !== "undefined") {
          localStorage.setItem("coopserve_auth", "true");
          localStorage.setItem("coopserve_role", "WORKER");
          const customUser = {
            role: "WORKER",
            name: matchedWorker.name,
            badge: isVerified ? "Verified Co-op Member" : "Applicant (Pending Verification)",
            subtext: `${user.email} · ${isVerified ? "Verified Member" : "Status: Pending Verification"}`,
            avatar: matchedWorker.avatar || userAvatar,
            id: matchedWorker.id,
            zone: matchedWorker.society?.zone || "MVP Colony & Beach Road, Vizag",
          };
          localStorage.setItem("coopserve_custom_user", JSON.stringify(customUser));
        }
        router.replace("/worker/dashboard");
        return;
      }

      // 3. New user without a role selected
      if (typeof window !== "undefined") {
        localStorage.removeItem("coopserve_role");
        localStorage.removeItem("coopserve_custom_user");
      }
      setStatusText("Welcome! Please choose how you want to use the platform...");
      router.replace("/auth/select-role");
    }

    async function handleAuth() {
      try {
        const code = searchParams.get("code");

        // Fast session check
        const { data: sessionData } = await supabase.auth.getSession();
        let user = sessionData?.session?.user;

        if (!user && code) {
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error && data?.session?.user) {
              user = data.session.user;
            }
          } catch (codeErr) {
            console.warn("Exchange handled by client:", codeErr);
          }
        }

        if (user) {
          await handleUserRouting(user);
          return;
        }

        // Fast listener with 300ms safety timeout
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user && isMounted) {
              authListener.subscription.unsubscribe();
              await handleUserRouting(session.user);
            }
          }
        );

        setTimeout(() => {
          if (isMounted) {
            router.replace("/auth/select-role");
          }
        }, 400);
      } catch (e) {
        console.error("Auth callback error:", e);
        router.replace("/auth/select-role");
      }
    }

    handleAuth();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] text-slate-900 p-4 relative">
      {/* Top Tricolor Ribbon */}
      <div className="absolute top-0 inset-x-0 h-1.5 grid grid-cols-3">
        <div className="bg-[#FF9933]" />
        <div className="bg-[#FFFFFF]" />
        <div className="bg-[#138808]" />
      </div>

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-xl shadow-amber-500/20 mb-4 border border-amber-300">
        KS
      </div>
      <div className="text-sm font-extrabold text-[#0B2545] mb-1">
        कार्यसेतु · भारत सरकार
      </div>
      <div className="flex items-center gap-2.5 text-amber-700 font-bold text-xs mt-1">
        <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
        <span>{statusText}</span>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] text-slate-900">
          <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
