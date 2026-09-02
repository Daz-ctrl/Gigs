"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusText, setStatusText] = useState("Verifying your Google session...");

  useEffect(() => {
    let isMounted = true;

    async function handleUserRouting(user: any) {
      if (!isMounted) return;

      // 1. Check user_metadata (the primary source of truth)
      let role = user.user_metadata?.role;

      // 2. Check Supabase public.profiles table if exists
      if (!role) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();
          if (profile?.role && profile.role !== "UNASSIGNED") {
            role = profile.role;
          }
        } catch (e) {
          // profiles check safe fallback
        }
      }

      // 3. Check user-specific localStorage key (scoped by user ID to prevent cross-account leaks)
      if (!role && typeof window !== "undefined" && user?.id) {
        role = localStorage.getItem(`coopserve_role_${user.id}`);
      }

      // If user has a verified role saved:
      if (role === "WORKER") {
        setStatusText("Welcome back! Opening Worker Portal...");
        if (typeof window !== "undefined") {
          localStorage.setItem("coopserve_role", "WORKER");
          if (user?.id) localStorage.setItem(`coopserve_role_${user.id}`, "WORKER");
          localStorage.setItem("coopserve_auth", "true");
        }
        router.replace("/worker/dashboard");
        return;
      } else if (role === "CUSTOMER") {
        setStatusText("Welcome back! Opening Citizen Services...");
        if (typeof window !== "undefined") {
          localStorage.setItem("coopserve_role", "CUSTOMER");
          if (user?.id) localStorage.setItem(`coopserve_role_${user.id}`, "CUSTOMER");
          localStorage.setItem("coopserve_auth", "true");
        }
        router.replace("/customer/book");
        return;
      }

      // If user is brand new and has NO role chosen yet:
      // Clear any stale global persona in localStorage so it doesn't leak from a deleted account
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

        // 1. Check if session already exists (auto-detected by Supabase client)
        const { data: sessionData } = await supabase.auth.getSession();
        let user = sessionData?.session?.user;

        // 2. If no session yet and code is present, attempt exchange safely
        if (!user && code) {
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error && data?.session?.user) {
              user = data.session.user;
            }
          } catch (codeErr) {
            console.warn("Exchange note (handled):", codeErr);
          }
        }

        if (user) {
          await handleUserRouting(user);
          return;
        }

        // 3. Fallback: Wait for onAuthStateChange
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
