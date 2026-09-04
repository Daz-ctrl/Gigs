"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, LanguageCode, DemoUser } from "@/types";
import { translations, TranslationDictionary } from "@/lib/i18n";
import { supabase } from "@/lib/supabaseClient";
import { findSystemAccount } from "@/lib/authUsers";

export const DEMO_USERS: Record<UserRole, DemoUser> = {
  CUSTOMER: {
    role: "CUSTOMER",
    name: "Ananya Sharma",
    badge: "Verified Resident Customer",
    subtext: "ananya.sharma@gmail.com · MVP Colony, Vizag",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    id: "cust-ananya",
    zone: "Zone 1 - MVP Colony & Beach Road, Vizag",
  },
  WORKER: {
    role: "WORKER",
    name: "Dheeraj",
    badge: "AC & HVAC Specialist",
    subtext: "dheeraj@gmail.com · Member #VZG-7703",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    id: "work-dheeraj",
    zone: "Zone 1 - MVP Colony & Beach Road, Vizag",
  },
  ADMIN: {
    role: "ADMIN",
    name: "Ward Sachivalayam Secretary",
    badge: "Ward Sachivalayam #18 · GVMC",
    subtext: "Admin@gmail.com · Ward Welfare & Development Secretary",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    id: "admin-sachivalayam",
    zone: "Ward Sachivalayam #18 (MVP Colony), GVMC Visakhapatnam",
  },
};

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: DemoUser;
  isAuthenticated: boolean;
  login: (userOrRole: DemoUser | UserRole) => void;
  logout: () => void;
  registerCustomer: (profile: { name: string; phone: string; zone: string }) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("CUSTOMER");
  const [customUser, setCustomUser] = useState<DemoUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname === "0.0.0.0") {
      window.location.href = window.location.href.replace("0.0.0.0", "localhost");
      return;
    }

    const savedAuth = localStorage.getItem("coopserve_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      const savedCustomUser = localStorage.getItem("coopserve_custom_user");
      if (savedCustomUser) {
        try {
          setCustomUser(JSON.parse(savedCustomUser));
        } catch (e) {
          console.error(e);
        }
      }
      const savedRole = localStorage.getItem("coopserve_role") as UserRole;
      if (savedRole && DEMO_USERS[savedRole]) {
        setRoleState(savedRole);
      }
    } else {
      setIsAuthenticated(false);
      setCustomUser(null);
      setRoleState("CUSTOMER");
    }
    const savedLang = localStorage.getItem("coopserve_lang") as LanguageCode;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
    }

    // Real-time Supabase Auth Listener for Google OAuth and magic links
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const u = session.user;
          const userEmail = u.email || "";
          const matched = findSystemAccount(userEmail);

          if (matched) {
            setRoleState(matched.role);
            setCustomUser(matched);
            setIsAuthenticated(true);
            localStorage.setItem("coopserve_auth", "true");
            localStorage.setItem("coopserve_role", matched.role);
            localStorage.setItem("coopserve_custom_user", JSON.stringify(matched));
            return;
          }

          const userRole = u.user_metadata?.role as UserRole | undefined;

          if (userRole) {
            const isWorker = userRole === "WORKER";
            const fullName =
              u.user_metadata?.full_name ||
              u.user_metadata?.name ||
              u.email?.split("@")[0] ||
              (isWorker ? "Co-op Worker" : "Resident Customer");

            const avatarUrl =
              u.user_metadata?.avatar_url ||
              u.user_metadata?.picture ||
              (isWorker
                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");

            const supabaseUser: DemoUser = {
              role: userRole,
              name: fullName,
              badge: isWorker ? "Applicant (e-KYC Pending)" : "Google Verified Resident",
              subtext: isWorker
                ? `${u.email} · e-KYC Verification Required`
                : `${u.email} · MVP Colony, Vizag`,
              avatar: avatarUrl,
              id: `sb-${u.id.slice(-6)}`,
              zone: "Zone 1 - MVP Colony & Beach Road, Vizag",
            };

            setRoleState(userRole);
            setCustomUser(supabaseUser);
            setIsAuthenticated(true);
            localStorage.setItem("coopserve_auth", "true");
            localStorage.setItem("coopserve_role", userRole);
            localStorage.setItem("coopserve_custom_user", JSON.stringify(supabaseUser));
          } else {
            // New user without role selected yet
            setIsAuthenticated(true);
            localStorage.setItem("coopserve_auth", "true");
          }
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("coopserve_role", newRole);
    setIsAuthenticated(true);
    localStorage.setItem("coopserve_auth", "true");

    if (customUser) {
      const isWorker = newRole === "WORKER";
      const updatedUser: DemoUser = {
        ...customUser,
        role: newRole,
        badge: isWorker
          ? "Applicant (e-KYC Pending)"
          : newRole === "CUSTOMER"
          ? "Google Verified Resident"
          : "Sector Administrator",
      };
      setCustomUser(updatedUser);
      localStorage.setItem("coopserve_custom_user", JSON.stringify(updatedUser));
      showToast(`Switched persona to ${updatedUser.name} (${updatedUser.badge})`);
    } else {
      showToast(`Switched persona to ${DEMO_USERS[newRole].name} (${DEMO_USERS[newRole].badge})`);
    }
  };

  const login = (userOrRole: DemoUser | UserRole) => {
    if (typeof userOrRole === "string") {
      const user = DEMO_USERS[userOrRole];
      setRoleState(userOrRole);
      setCustomUser(null);
      localStorage.removeItem("coopserve_custom_user");
      localStorage.setItem("coopserve_role", userOrRole);
      setIsAuthenticated(true);
      localStorage.setItem("coopserve_auth", "true");
      showToast(`Welcome back, ${user.name}!`);
    } else {
      setRoleState(userOrRole.role);
      setCustomUser(userOrRole);
      localStorage.setItem("coopserve_custom_user", JSON.stringify(userOrRole));
      localStorage.setItem("coopserve_role", userOrRole.role);
      setIsAuthenticated(true);
      localStorage.setItem("coopserve_auth", "true");
      showToast(`Welcome back, ${userOrRole.name}!`);
    }
  };

  const logout = () => {
    supabase.auth.signOut().catch(() => {});
    setIsAuthenticated(false);
    setRoleState("CUSTOMER");
    setCustomUser(null);
    localStorage.removeItem("coopserve_auth");
    localStorage.removeItem("coopserve_custom_user");
    localStorage.removeItem("coopserve_role");
    showToast("Signed out successfully. Session closed.");
  };

  const registerCustomer = (profile: { name: string; phone: string; zone: string }) => {
    const newUser: DemoUser = {
      role: "CUSTOMER",
      name: profile.name,
      badge: "Verified Resident",
      subtext: `${profile.zone} · ${profile.phone}`,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      id: `cust-${Date.now().toString().slice(-4)}`,
      zone: profile.zone,
    };
    setRoleState("CUSTOMER");
    setCustomUser(newUser);
    localStorage.setItem("coopserve_custom_user", JSON.stringify(newUser));
    localStorage.setItem("coopserve_role", "CUSTOMER");
    setIsAuthenticated(true);
    localStorage.setItem("coopserve_auth", "true");
    showToast(`Profile created! Welcome to CoopServe, ${profile.name}!`);
  };

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    localStorage.setItem("coopserve_lang", newLang);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const currentUser = customUser || DEMO_USERS[role] || DEMO_USERS.CUSTOMER;
  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        isAuthenticated,
        login,
        logout,
        registerCustomer,
        language,
        setLanguage,
        t,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-slate-950/95 px-5 py-3.5 text-xs sm:text-sm text-emerald-300 shadow-2xl backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-100">{toastMessage}</span>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
