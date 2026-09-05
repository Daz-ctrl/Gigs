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
      const userId = (user.id || "").trim();
      const userShortId = userId ? userId.slice(-6) : "";

      // 1. Query the Worker registry in the database to see if this user has an existing worker profile
      let matchedWorker: any = null;
      try {
        const res = await fetch("/api/workers?status=ALL");
        if (res.ok) {
          const workers = await res.json();
          if (Array.isArray(workers)) {
            matchedWorker = workers.find((w: any) => {
              const wEmail = (w.email || "").toLowerCase().trim();
              const wName = (w.name || "").toLowerCase().trim();
              const wId = (w.id || "").trim();
              const wAvatar = (w.avatar || "").trim();

              // Exact email match
              if (userEmail && wEmail && userEmail === wEmail) return true;
              // ID match
              if (userId && (wId === userId || wId === `sb-${userShortId}` || (userShortId && wId.includes(userShortId)))) return true;
              // Avatar match (Google profile pictures share root identity URL)
              if (userAvatar && wAvatar && (userAvatar === wAvatar || (userAvatar.includes("googleusercontent.com") && wAvatar.includes("googleusercontent.com") && userAvatar.split("=")[0] === wAvatar.split("=")[0]))) return true;
              // Name match
              if (userName && wName && userName === wName) return true;
              return false;
            });
          }
        }
      } catch (dbCheckErr) {
        console.warn("DB check fallback:", dbCheckErr);
      }

      // If this user is an existing worker in the cooperative database:
      if (matchedWorker) {
        const isVerified = matchedWorker.status === "VERIFIED";

        // Keep Supabase user metadata permanently in sync
        await supabase.auth.updateUser({
          data: {
            role: "WORKER",
            persona: "WORKER",
            full_name: matchedWorker.name,
            name: matchedWorker.name,
            avatar_url: matchedWorker.avatar || userAvatar,
            picture: matchedWorker.avatar || userAvatar,
            profile_completed: true,
          },
        }).catch(() => {});

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

        setStatusText(
          isVerified
            ? `Welcome back, ${matchedWorker.name}! Loading Worker Dashboard...`
            : `Welcome back, ${matchedWorker.name}! Loading application status...`
        );
        router.replace("/worker/dashboard");
        return;
      }

      // 2. Check Supabase role metadata for customers or workers without DB entry yet
      const role = user.user_metadata?.role;
      const profileCompleted = user.user_metadata?.profile_completed;

      if (role === "CUSTOMER") {
        setStatusText(`Welcome back, ${user.user_metadata?.name || "Customer"}! Loading Customer Services...`);
        if (typeof window !== "undefined") {
          localStorage.setItem("coopserve_auth", "true");
          localStorage.setItem("coopserve_role", "CUSTOMER");
        }
        router.replace("/customer/book");
        return;
      }

      if (role === "WORKER") {
        setStatusText("Welcome back! Loading Worker Dashboard...");
        if (typeof window !== "undefined") {
          localStorage.setItem("coopserve_auth", "true");
          localStorage.setItem("coopserve_role", "WORKER");
        }
        router.replace("/worker/dashboard");
        return;
      }

      // 3. New user without role selected yet:
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
        KS
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
