"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { Users, Globe, Sparkles } from "lucide-react";
import { findSystemAccount } from "@/lib/authUsers";

export function DemoRoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { role, setRole, currentUser, login, language, setLanguage, t } = useApp();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === "WORKER") {
      router.push("/worker/dashboard");
    } else if (newRole === "CUSTOMER") {
      router.push("/customer/book");
    } else if (newRole === "ADMIN") {
      router.push("/admin/dashboard");
    }
    router.refresh();
  };

  return (
    <header className="w-full bg-slate-950 text-slate-200 border-b border-slate-800 text-xs z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Hackathon Tag & Active Persona Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold tracking-wide text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH26089 · Ministry of Cooperation</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span>Active Persona:</span>
            <span className="font-semibold text-white">{currentUser.name}</span>
            <span className="text-slate-500">({currentUser.badge})</span>
          </div>
        </div>

        {/* Center: 3 Streamlined Demo Role Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[11px] text-slate-400 font-medium hidden md:inline-flex items-center gap-1 mr-1">
            <Users className="w-3 h-3" />
            Select Role:
          </span>

          <button
            type="button"
            onClick={() => handleRoleChange("CUSTOMER")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              role === "CUSTOMER"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <span>👤</span>
            <span>{t.roles.customer}</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("WORKER")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              role === "WORKER"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <span>🛠️</span>
            <span>{t.roles.worker}</span>
          </button>

          {role === "WORKER" && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-900 border border-emerald-500/30 rounded-xl p-0.5">
              {[
                { name: "Dheeraj", trade: "AC", email: "dheeraj@gmail.com" },
                { name: "Vaman", trade: "Plumber", email: "vaman@gmail.com" },
                { name: "Mohan", trade: "Carpenter", email: "mohan@gmail.com" },
                { name: "Hanish", trade: "Caretaker", email: "hanish@gmail.com" },
              ].map((artisan) => {
                const isSelected = currentUser.name?.toLowerCase().includes(artisan.name.toLowerCase());
                return (
                  <button
                    key={artisan.name}
                    type="button"
                    onClick={() => {
                      const acc = findSystemAccount(artisan.email);
                      if (acc) login(acc);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {artisan.name} ({artisan.trade})
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() => handleRoleChange("ADMIN")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              role === "ADMIN"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <span>🏢</span>
            <span>{t.roles.admin}</span>
          </button>
        </div>

        {/* Right: Multilingual Language Switcher (FR10) */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              language === "en" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage("hi")}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              language === "hi" ? "bg-slate-800 text-emerald-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => setLanguage("te")}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              language === "te" ? "bg-slate-800 text-teal-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            తెలుగు
          </button>
          <button
            type="button"
            onClick={() => setLanguage("ta")}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              language === "ta" ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            தமிழ்
          </button>
        </div>
      </div>
    </header>
  );
}
