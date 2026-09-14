"use client";

import React, { useState, useEffect, Suspense } from "react";
import NextLink from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserAvatar } from "@/components/ui/UserAvatar";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        { href: "/customer/book", label: "Services", icon: Wrench },
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
      <header className="sticky top-2 z-50 w-full px-3 sm:px-6 max-w-6xl mx-auto">
        <div className="rounded-2xl border-2 border-amber-500/30 dark:border-amber-500/20 bg-[#0b2545]/95 dark:bg-[#08172c]/95 text-white backdrop-blur-2xl px-3 sm:px-5 py-2 flex items-center justify-between shadow-2xl shadow-black/20 transition-all">
          {/* Brand Logo */}
          <NextLink
            href="/"
            onClick={() => handleNavClick("/")}
            className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform border border-amber-300/40">
              KS
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-1">
                  <span>कार्यसेतु</span>
                  <span className="text-amber-400 text-xs font-bold font-sans">(KaryaSetu)</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-slate-300 font-medium tracking-wide">
                सहकारिता मंत्रालय · Govt of India
              </span>
            </div>
          </NextLink>

          {/* Desktop Navigation Links (Strictly Role-Based) */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-black/25 border border-white/10">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = isLinkActive(item.href);
              return (
                <NextLink
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                      : "text-slate-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
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
            {mounted && isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-full border border-[#7D684F]/35 bg-[#CBB89D] hover:bg-[#BEAB8F] transition cursor-pointer shadow-xs active:scale-95"
                >
                  <UserAvatar
                    src={currentUser.avatar}
                    name={currentUser.name}
                    className="w-6 h-6 rounded-full border border-emerald-500/40"
                  />
                  <span className="font-black text-xs text-[#0A1120] hidden sm:inline max-w-[95px] truncate">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-600" />
                </button>

                {/* Profile Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl border-2 border-[#7D684F]/40 bg-[#CBB89D] backdrop-blur-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                    <div className="p-2 border-b border-[#7D684F]/25 mb-2">
                      <div className="font-black text-[#0A1120] text-xs truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-700 truncate mt-0.5 font-medium">
                        {currentUser.subtext}
                      </div>
                      <span className="inline-block mt-2 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
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
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#0A1120] hover:bg-[#BEAB8F] transition cursor-pointer"
                          >
                            <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Book Services</span>
                          </NextLink>
                          <NextLink
                            href="/customer/bookings"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#0A1120] hover:bg-[#BEAB8F] transition cursor-pointer"
                          >
                            <CalendarCheck className="w-3.5 h-3.5 text-teal-700" />
                            <span>My Bookings</span>
                          </NextLink>
                        </>
                      )}

                      {role === "WORKER" && (
                        <>
                          <NextLink
                            href="/worker/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#0A1120] hover:bg-[#BEAB8F] transition cursor-pointer"
                          >
                            <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Worker Dashboard</span>
                          </NextLink>
                          <NextLink
                            href={currentUser.id ? `/worker/id/${currentUser.id}` : "/worker/dashboard"}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#0A1120] hover:bg-[#BEAB8F] transition cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5 text-teal-700" />
                            <span>3D Virtual ID Card</span>
                          </NextLink>
                        </>
                      )}

                      {role === "ADMIN" && (
                        <>
                          <NextLink
                            href="/customer/book"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#0A1120] hover:bg-[#BEAB8F] transition cursor-pointer"
                          >
                            <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Browse Services & Workers</span>
                          </NextLink>
                          <NextLink
                            href="/admin/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#0A1120] hover:bg-[#BEAB8F] transition cursor-pointer"
                          >
                            <Building2 className="w-3.5 h-3.5 text-purple-700" />
                            <span>Admin Control Hub</span>
                          </NextLink>
                        </>
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
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer border border-amber-300/40"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-950 font-black" />
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
          <div className="md:hidden mt-2 rounded-3xl border-2 border-[#7D684F]/40 bg-[#CBB89D] backdrop-blur-2xl p-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2 relative z-50">
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
                        ? "bg-[#0B2545] text-white font-black shadow-sm"
                        : "text-[#0A1120] hover:bg-[#BEAB8F]"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-600" />
                    <span>{item.label}</span>
                  </NextLink>
                );
              })}
            </div>

            {/* Role indicator in mobile drawer */}
            {isAuthenticated && (
              <div className="p-2.5 rounded-2xl bg-[#BEAB8F] border border-[#7D684F]/25 text-[11px] font-bold text-[#0A1120] flex items-center justify-between">
                <span>Account Role:</span>
                <span className="text-emerald-800 font-black">
                  {role === "CUSTOMER" ? "Citizen Customer" : role === "WORKER" ? "Co-op Worker" : "Administrator"}
                </span>
              </div>
            )}

            {/* Quick Language Switcher inside Mobile Drawer */}
            <div className="flex items-center justify-between p-2 rounded-2xl bg-[#BEAB8F] border border-[#7D684F]/25">
              <span className="text-[11px] font-bold text-slate-700">Language:</span>
              <div className="flex gap-1">
                {(["en", "hi", "te", "ta"] as const).map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => setLanguage(lng)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                      language === lng
                        ? "bg-[#0B2545] text-white shadow-xs font-black"
                        : "text-slate-800 hover:bg-[#AF9C7F]"
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
        <nav className="p-1.5 rounded-3xl border-2 border-[#7D684F]/40 bg-[#CBB89D] backdrop-blur-2xl shadow-2xl flex items-center justify-around">
          {/* 1. Home (All users) */}
          <NextLink
            href="/"
            onClick={() => {
              setMobileMenuOpen(false);
              setUserMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[10px] font-bold transition cursor-pointer ${
              pathname === "/" ? "text-[#0B2545] font-black" : "text-slate-700"
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </NextLink>

          {/* Services Tab: Customer, Admin, and Guest */}
          {(!isAuthenticated || role === "CUSTOMER" || role === "ADMIN") && (
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
          {mounted && isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[10px] font-bold text-slate-500 dark:text-slate-400 transition cursor-pointer"
            >
              <UserAvatar
                src={currentUser.avatar}
                name={currentUser.name}
                className="w-4 h-4 rounded-full mb-0.5 border border-emerald-500/40 text-[9px]"
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
