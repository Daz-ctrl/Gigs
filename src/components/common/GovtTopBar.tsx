"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Volume2, Eye, Globe } from "lucide-react";

export function GovtTopBar() {
  const { language, setLanguage } = useApp();
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");

  const handleFontSize = (size: "sm" | "md" | "lg") => {
    setFontSize(size);
    if (typeof document !== "undefined") {
      if (size === "sm") document.documentElement.style.fontSize = "14px";
      if (size === "md") document.documentElement.style.fontSize = "16px";
      if (size === "lg") document.documentElement.style.fontSize = "18px";
    }
  };

  return (
    <div className="w-full relative z-50 select-none">
      {/* 1. Indian National Flag Tricolor Ribbon Strip */}
      <div className="h-1.5 w-full grid grid-cols-3">
        <div className="bg-[#FF9933]" /> {/* Saffron / केसरिया */}
        <div className="bg-[#FFFFFF]" /> {/* White / श्वेत */}
        <div className="bg-[#138808]" /> {/* Green / हरा */}
      </div>

      {/* 2. Top Utility & Accessibility Bar (Official GOI Dark Blue) */}
      <div className="bg-[#07172b] text-slate-200 border-b border-white/[0.08] px-3 sm:px-6 py-1.5 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Ministry & Govt of India Label */}
          <div className="flex items-center gap-2 font-medium">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <span className="text-amber-400">🏛️</span>
              <span>भारत सरकार | Government of India</span>
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">
              सहकारिता मंत्रालय (Ministry of Cooperation)
            </span>
          </div>

          {/* Right: Accessibility & Official Controls */}
          <div className="flex items-center gap-3 ml-auto font-medium">
            {/* Screen Reader & Skip to Content */}
            <a
              href="#main-content"
              className="text-slate-300 hover:text-white transition hidden md:inline hover:underline"
            >
              Skip to Main Content
            </a>

            <span className="text-slate-600 hidden md:inline">|</span>

            {/* Font Resize Accessibility (A- A A+) */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
              <button
                type="button"
                onClick={() => handleFontSize("sm")}
                className={`px-1 text-[10px] font-bold hover:text-white transition cursor-pointer ${
                  fontSize === "sm" ? "text-amber-400 font-extrabold" : "text-slate-400"
                }`}
                title="Decrease font size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontSize("md")}
                className={`px-1 text-[11px] font-bold hover:text-white transition cursor-pointer ${
                  fontSize === "md" ? "text-amber-400 font-extrabold" : "text-slate-400"
                }`}
                title="Default font size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontSize("lg")}
                className={`px-1 text-[12px] font-bold hover:text-white transition cursor-pointer ${
                  fontSize === "lg" ? "text-amber-400 font-extrabold" : "text-slate-400"
                }`}
                title="Increase font size"
              >
                A+
              </button>
            </div>

            <span className="text-slate-600">|</span>

            {/* Official Language Selector */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
              <Globe className="w-3 h-3 text-amber-400 shrink-0" />
              {(["en", "hi", "te", "ta"] as const).map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => setLanguage(lng)}
                  className={`px-1 rounded text-[10px] font-bold transition cursor-pointer ${
                    language === lng
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {lng === "en" ? "EN" : lng === "hi" ? "हिन्दी" : lng === "te" ? "తెలుగు" : "தமிழ்"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
