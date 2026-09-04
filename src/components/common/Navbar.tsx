"use client";

import React, { useState, useEffect, Suspense } from "react";
import NextLink from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Home,
  Wrench,
  CalendarCheck,
  Building2,
  ChevronDown,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  UserPlus,
  QrCode,
  ShieldAlert,
} from "lucide-react";

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, role, currentUser, isAuthenticated, logout, language, setLanguage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname, searchParams]);

  // Strict Role-Based Nav Links
  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { href: "/", label: "Home", icon: Home },
        { href: "/customer/book", label: "Services", icon: Wrench },
        { href: "/worker/register", label: "Join as Worker", icon: UserPlus },
      ];
    }

    if (role === "CUSTOMER") {
      return [
        { href: "/", label: "Home", icon: Home },
        { href: "/customer/book", label: "Services", icon: Wrench },
        { href: "/customer/bookings", label: "My Bookings", icon: CalendarCheck },
      ];
    }

    if (role === "WORKER") {
      return [
        { href: "/", label: "Home", icon: Home },
        { href: "/worker/dashboard", label: "My Jobs & Profile", icon: Wrench },
        { href: currentUser.id ? `/worker/id/${currentUser.id}` : "/worker/dashboard", label: "Virtual ID", icon: QrCode },
      ];
    }

    if (role === "ADMIN") {
      return [
        { href: "/", label: "Home", icon: Home },
        { href: "/admin/dashboard", label: "Admin Control", icon: Building2 },
      ];
    }

    return [{ href: "/", label: "Home", icon: Home }];
  };

  const navLinks = getNavLinks();

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <>
      {/* Click-away overlay when dropdowns are active */}
      {(userMenuOpen || mobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
          onClick={() => {
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}

      {/* TOP DESKTOP & MOBILE NAVBAR */}
      <header className="sticky top-3 z-50 w-full px-3 sm:px-6 max-w-5xl mx-auto">
        <div className="rounded-full border border-slate-200/90 dark:border-white/[0.12] bg-white/95 dark:bg-[#070c16]/95 backdrop-blur-2xl px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between shadow-xl shadow-black/5 dark:shadow-black/50 transition-all">
          {/* Brand Logo */}
          <NextLink
            href="/"
            onClick={() => handleNavClick("/")}
            className="flex items-center gap-2.5 group shrink-0 pl-1 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              KS
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                KaryaSetu
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </NextLink>

          {/* Desktop Navigation Links (Strictly Role-Based) */}
          <nav className="hidden md:flex items-center p-1 rounded-full bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08]">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = isLinkActive(item.href);
              return (
                <NextLink
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-white dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-300 font-bold shadow-xs border border-slate-200/60 dark:border-emerald-500/40"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-500" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </NextLink>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher + User Profile / Sign In */}
          <div className="flex items-center gap-2">
            {/* Micro Language Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] rounded-full p-0.5">
              {(["en", "hi", "te", "ta"] as const).map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => setLanguage(lng)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                    language === lng
                      ? "bg-white dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-300 shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {lng === "en" ? "EN" : lng === "hi" ? "हिं" : lng === "te" ? "తె" : "த"}
                </button>
              ))}
            </div>

            {/* Profile Button / Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-full border border-slate-200/90 dark:border-white/[0.1] bg-white/70 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] transition cursor-pointer shadow-xs active:scale-95"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500/40"
                  />
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[95px] truncate">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl border border-slate-200/90 dark:border-white/[0.12] bg-white/95 dark:bg-[#070c16]/95 backdrop-blur-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                    <div className="p-2 border-b border-slate-200 dark:border-slate-800 mb-2">
                      <div className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {currentUser.subtext}
                      </div>
                      <span className="inline-block mt-2 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {role === "CUSTOMER"
                          ? "👤 Citizen Customer"
                          : role === "WORKER"
                          ? "🛠️ Cooperative Worker"
                          : "🏢 Sector Administrator"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {role === "CUSTOMER" && (
                        <>
                          <NextLink
                            href="/customer/book"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
                          >
                            <Wrench className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Book Services</span>
                          </NextLink>
                          <NextLink
                            href="/customer/bookings"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
                          >
                            <CalendarCheck className="w-3.5 h-3.5 text-teal-500" />
                            <span>My Bookings</span>
                          </NextLink>
                        </>
                      )}

                      {role === "WORKER" && (
                        <>
                          <NextLink
                            href="/worker/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
                          >
                            <Wrench className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Worker Dashboard</span>
                          </NextLink>
                          <NextLink
                            href={currentUser.id ? `/worker/id/${currentUser.id}` : "/worker/dashboard"}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5 text-teal-500" />
                            <span>3D Virtual ID Card</span>
                          </NextLink>
                        </>
                      )}

                      {role === "ADMIN" && (
                        <NextLink
                          href="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
                        >
                          <Building2 className="w-3.5 h-3.5 text-purple-500" />
                          <span>Admin Control Hub</span>
                        </NextLink>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                          router.push("/login");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t.nav.signOut}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NextLink
                href="/login"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.nav.signIn}</span>
              </NextLink>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setUserMenuOpen(false);
              }}
              className="md:hidden p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer active:scale-95"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-500" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-3xl border border-slate-200/90 dark:border-white/[0.12] bg-white/95 dark:bg-[#070c16]/95 backdrop-blur-2xl p-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2 relative z-50">
            <div className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = isLinkActive(item.href);
                return (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-500" />
                    <span>{item.label}</span>
                  </NextLink>
                );
              })}
            </div>

            {/* Role indicator in mobile drawer */}
            {isAuthenticated && (
              <div className="p-2.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>Account Role:</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {role === "CUSTOMER" ? "Citizen Customer" : role === "WORKER" ? "Co-op Worker" : "Administrator"}
                </span>
              </div>
            )}

            {/* Quick Language Switcher inside Mobile Drawer */}
            <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06]">
              <span className="text-[11px] font-bold text-slate-500">Language:</span>
              <div className="flex gap-1">
                {(["en", "hi", "te", "ta"] as const).map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => setLanguage(lng)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                      language === lng
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {lng === "en" ? "EN" : lng === "hi" ? "हिन्दी" : lng === "te" ? "తెలుగు" : "தமிழ்"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MOBILE BOTTOM FLOATING NAVIGATION BAR (STRICT ROLE-BASED) */}
      <div className="md:hidden fixed bottom-3 inset-x-3 z-50 pointer-events-auto">
        <nav className="p-1.5 rounded-3xl border border-slate-200/90 dark:border-white/[0.12] bg-white/95 dark:bg-[#070c16]/95 backdrop-blur-2xl shadow-2xl flex items-center justify-around">
          {/* 1. Home (All users) */}
          <NextLink
            href="/"
            onClick={() => {
              setMobileMenuOpen(false);
              setUserMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[10px] font-bold transition cursor-pointer ${
              pathname === "/" ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </NextLink>

          {/* CUSTOMER PERSONA: Services + My Bookings */}
          {(!isAuthenticated || role === "CUSTOMER") && (
            <NextLink
              href="/customer/book"
              onClick={() => {
                setMobileMenuOpen(false);
                setUserMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[10px] font-bold transition cursor-pointer ${
                pathname.startsWith("/customer/book") ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Wrench className="w-4 h-4 mb-0.5" />
              <span>Services</span>
            </NextLink>
          )}

          {isAuthenticated && role === "CUSTOMER" && (
            <NextLink
              href="/customer/bookings"
              onClick={() => {
                setMobileMenuOpen(false);
                setUserMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[10px] font-bold transition cursor-pointer ${
                pathname.startsWith("/customer/bookings") ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <CalendarCheck className="w-4 h-4 mb-0.5" />
              <span>Bookings</span>
            </NextLink>
          )}

          {/* WORKER PERSONA: Worker Dashboard + Virtual ID */}
          {isAuthenticated && role === "WORKER" && (
            <>
              <NextLink
                href="/worker/dashboard"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setUserMenuOpen(false);
                }}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[10px] font-bold transition cursor-pointer ${
                  pathname.startsWith("/worker/dashboard") ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Wrench className="w-4 h-4 mb-0.5" />
                <span>My Jobs</span>
              </NextLink>

              <NextLink
                href={currentUser.id ? `/worker/id/${currentUser.id}` : "/worker/dashboard"}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setUserMenuOpen(false);
                }}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[10px] font-bold transition cursor-pointer ${
                  pathname.startsWith("/worker/id") ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <QrCode className="w-4 h-4 mb-0.5" />
                <span>Virtual ID</span>
              </NextLink>
            </>
          )}

          {/* ADMIN PERSONA: Admin Dashboard only */}
          {isAuthenticated && role === "ADMIN" && (
            <NextLink
              href="/admin/dashboard"
              onClick={() => {
                setMobileMenuOpen(false);
                setUserMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[10px] font-bold transition cursor-pointer ${
                pathname.startsWith("/admin") ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Building2 className="w-4 h-4 mb-0.5" />
              <span>Admin Hub</span>
            </NextLink>
          )}

          {/* Sign In or Profile */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[10px] font-bold text-slate-500 dark:text-slate-400 transition cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-4 h-4 rounded-full object-cover mb-0.5 border border-emerald-500/40"
              />
              <span>Profile</span>
            </button>
          ) : (
            <NextLink
              href="/login"
              onClick={() => {
                setMobileMenuOpen(false);
                setUserMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[10px] font-bold text-emerald-600 dark:text-emerald-400 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4 mb-0.5" />
              <span>Sign In</span>
            </NextLink>
          )}
        </nav>
      </div>
    </>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<div className="h-16" />}>
      <NavbarContent />
    </Suspense>
  );
}
