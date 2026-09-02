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
    async function handleAuth() {
      try {
        const code = searchParams.get("code");

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Error exchanging code:", error);
          }
        }

        // Fetch current session after exchange
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;

        if (user) {
          // Check if persona already chosen in metadata or localStorage
          const savedRole = user.user_metadata?.role || localStorage.getItem("coopserve_role");

          if (savedRole === "WORKER") {
            setStatusText("Welcome back! Loading Worker Dashboard...");
            router.replace("/worker/dashboard");
            return;
          } else if (savedRole === "CUSTOMER") {
            setStatusText("Welcome back! Loading Customer Services...");
            router.replace("/customer/book");
            return;
          }
        }

        // Brand new account without a saved role -> ask once
        setStatusText("Welcome! Please choose your account type...");
        router.replace("/auth/select-role");
      } catch (e) {
        console.error("Auth callback error:", e);
        router.replace("/login");
      }
    }

    handleAuth();
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
