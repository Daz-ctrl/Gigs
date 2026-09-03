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

      // The SINGLE SOURCE OF TRUTH: this specific user's metadata in Supabase
      const role = user.user_metadata?.role;
      const profileCompleted = user.user_metadata?.profile_completed;

      if (role === "WORKER" && profileCompleted) {
        setStatusText(`Welcome back, ${user.user_metadata?.name || "Worker"}! Loading Worker Dashboard...`);
        if (typeof window !== "undefined") {
          localStorage.setItem("coopserve_auth", "true");
          localStorage.setItem("coopserve_role", "WORKER");
        }
        router.replace("/worker/dashboard");
        return;
      } else if (role === "CUSTOMER" && profileCompleted) {
        setStatusText(`Welcome back, ${user.user_metadata?.name || "Customer"}! Loading Customer Services...`);
        if (typeof window !== "undefined") {
          localStorage.setItem("coopserve_auth", "true");
          localStorage.setItem("coopserve_role", "CUSTOMER");
        }
        router.replace("/customer/book");
        return;
      }

      // If this specific Google account has NO role selected yet in Supabase:
      // Clear any stale local cache from previous accounts on this browser
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

        // 1. Check if session already exists
        const { data: sessionData } = await supabase.auth.getSession();
        let user = sessionData?.session?.user;

        // 2. If no session yet and code present, exchange code
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

        // 3. Fallback: Listen for auth change
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user && isMounted) {
              authListener.subscription.unsubscribe();
              await handleUserRouting(session.user);
            }
          }
        );

        // Safety timeout
        setTimeout(() => {
          if (isMounted) {
            router.replace("/auth/select-role");
          }
        }, 3000);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 mb-4 animate-pulse">
        SK
      </div>
      <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{statusText}</span>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
