"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Award,
  Wallet,
  HeartHandshake,
  Clock,
  CheckCircle2,
  Calendar,
  CalendarCheck,
  Phone,
  Power,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  QrCode,
  AlertTriangle,
  Lock,
  AlertCircle,
} from "lucide-react";
import { WorkerWithDetails, BookingWithDetails } from "@/types";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { WorkerIdCard } from "@/components/ui/WorkerIdCard";
import { KokonutStatCard } from "@/components/ui/KokonutStatCard";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { supabase } from "@/lib/supabaseClient";

function WorkerDashboardContent() {
  const router = useRouter();
  const { t, showToast, role, setRole, currentUser, isAuthenticated } = useApp();
  const searchParams = useSearchParams();
  const [worker, setWorker] = useState<WorkerWithDetails | null>(() => {
    if (currentUser?.role === "WORKER" || role === "WORKER") {
      const isVerifiedMember = currentUser?.badge?.includes("Verified");
      const isUnregistered = !isVerifiedMember && (currentUser?.badge?.includes("e-KYC") || currentUser?.badge?.includes("Applicant"));
      return {
        id: currentUser?.id || "work-initial",
        societyId: "soc-mvp",
        name: currentUser?.name || "Co-op Artisan",
        phone: currentUser?.subtext?.split("·")[0]?.trim() || "+91 98480 22334",
        aadhaarMasked: "XXXX-XXXX-4821",
        skills: "General Maintenance & Repairs",
        experienceYrs: 3,
        hourlyRate: 500,
        status: isVerifiedMember ? "VERIFIED" : isUnregistered ? "UNSUBMITTED" : "PENDING_VERIFICATION",
        isAvailable: isVerifiedMember,
        rating: 5.0,
        totalJobs: 0,
        latitude: 17.742,
        longitude: 83.338,
        digitalIdCard: `COOP-ID-${currentUser?.name?.toUpperCase().replace(/\s+/g, "") || "WORKER"}-PENDING`,
        society: { id: "soc-mvp", federationId: "fed-ap-vzg", name: "Ward Sachivalayam #18 (MVP Colony Co-op)", registrationNo: "AP-VZG-1802", district: "Visakhapatnam", zone: "Zone 1 - MVP Colony & Beach Road", latitude: 17.74, longitude: 83.335, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        certifications: [],
        welfareRecord: { id: "welf-init", workerId: currentUser?.id || "work-initial", insuranceStatus: "PENDING", insurancePlan: "Pradhan Mantri Suraksha Bima Yojana", policyNumber: "PMSBY-COOP-8849", fundBalance: 0, earningsYTD: 0, updatedAt: new Date().toISOString() },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as unknown as WorkerWithDetails;
    }
    return null;
  });
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [startingJobId, setStartingJobId] = useState<string | null>(null);
  const [hasActiveReview, setHasActiveReview] = useState(false);
  const [activeNoticeRating, setActiveNoticeRating] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"jobs" | "id">("jobs");

  useEffect(() => {
    if (isAuthenticated && role !== "WORKER") {
      showToast("Access restricted: Worker dashboard is reserved for verified workers.");
      router.replace(role === "ADMIN" ? "/admin/dashboard" : "/customer/book");
    }
  }, [role, isAuthenticated, router, showToast]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "id" || tabParam === "jobs") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const fetchWorkerData = async () => {
    try {
      let authUserEmail = "";
      try {
        const { data: authData } = await supabase.auth.getUser();
        authUserEmail = (authData?.user?.email || "").toLowerCase().trim();
      } catch (e) {}

      const res = await fetch("/api/workers?status=ALL");
      if (res.ok) {
        const workers = await res.json();
        const cId = (currentUser?.id || "").trim();
        const cShortId = cId.replace("sb-", "").slice(-6);
        const cName = (currentUser?.name || "").toLowerCase().trim();
        const cAvatar = (currentUser?.avatar || "").trim();
        const cEmail = authUserEmail || (currentUser?.subtext?.includes("@") ? currentUser.subtext.split("·")[0].trim().toLowerCase() : "");

        const matchingWorkers = workers.filter((w: any) => {
          const wEmail = (w.email || "").toLowerCase().trim();
          const wId = (w.id || "").trim();
          const wName = (w.name || "").toLowerCase().trim();
          const wAvatar = (w.avatar || "").trim();

          // 1. Email match
          if (cEmail && wEmail && cEmail === wEmail) return true;
          // 2. ID match
          if (cId && (wId === cId || (cShortId && wId.includes(cShortId)))) return true;
          // 3. Avatar match
          if (cAvatar && wAvatar && (cAvatar === wAvatar || (cAvatar.includes("googleusercontent.com") && wAvatar.includes("googleusercontent.com") && cAvatar.split("=")[0] === wAvatar.split("=")[0]))) return true;
          // 4. Name match
          if (cName && wName && (cName === wName || wName.includes(cName) || cName.includes(wName))) return true;

          return false;
        });

        let currentArtisan =
          matchingWorkers.find((w: any) => w.status === "VERIFIED") ||
          matchingWorkers.find((w: any) => w.status === "PENDING_VERIFICATION") ||
          matchingWorkers[0];

        if (!currentArtisan && currentUser?.role === "WORKER") {
          currentArtisan = {
            id: currentUser.id || `custom-${Date.now()}`,
            name: currentUser.name || "Co-op Artisan",
            avatar: currentUser.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            phone: currentUser.subtext?.split("·")[0]?.trim() || "+91 98480 22334",
            skills: "General Maintenance & Repairs",
            status: "UNSUBMITTED",
            isAvailable: false,
            rating: 5.0,
            totalJobs: 0,
            digitalIdCard: `COOP-ID-${currentUser.name?.toUpperCase().replace(/\s+/g, "") || "WORKER"}-PENDING`,
            society: { name: "Ward Sachivalayam #18 (MVP Colony Co-op)", zone: "MVP Colony & Beach Road" },
            certifications: [],
            welfareRecord: { earningsYTD: 0, fundBalance: 0, insuranceStatus: "PENDING" },
          };
        } else if (!currentArtisan) {
          currentArtisan = workers.find((w: any) => w.name.toLowerCase().includes("dheeraj")) || workers[0];
        }

        if (currentArtisan && currentArtisan.status === "VERIFIED") {
          try {
            const rawUser = localStorage.getItem("coopserve_custom_user");
            if (rawUser) {
              const parsed = JSON.parse(rawUser);
              if (parsed.badge?.includes("Applicant") || parsed.badge?.includes("e-KYC")) {
                parsed.badge = "Verified Co-op Member";
                parsed.name = currentArtisan.name;
                parsed.id = currentArtisan.id;
                parsed.subtext = `${cEmail || currentArtisan.phone} · Status: Verified Member`;
                localStorage.setItem("coopserve_custom_user", JSON.stringify(parsed));
              }
            }
          } catch (e) {}
        }

        // Keep avatar in sync with logged-in user profile
        if (currentArtisan && currentUser?.avatar && currentArtisan.avatar !== currentUser.avatar) {
          currentArtisan = { ...currentArtisan, avatar: currentUser.avatar };
          if (currentArtisan.id && !currentArtisan.id.startsWith("custom-")) {
            fetch(`/api/workers/${currentArtisan.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ avatar: currentUser.avatar }),
            }).catch(() => {});
          }
        }

        setWorker(currentArtisan);
        setIsAvailable(currentArtisan?.status === "VERIFIED" && currentArtisan?.isAvailable === true);

        if (currentArtisan?.id) {
          // Parallel fetch for instantaneous booking & notice loading
          const [bRes, rRes] = await Promise.all([
            fetch(`/api/bookings?workerId=${currentArtisan.id}`),
            fetch(`/api/ratings?workerId=${currentArtisan.id}&flagged=true`),
          ]);

          if (bRes.ok) {
            const bData = await bRes.json();
            setBookings(bData);
          }

          if (rRes.ok) {
            const rData = await rRes.json();
            const pending = rData.find((r: any) => r.noticeSent && !r.workerAcknowledged);
            if (pending) {
              setActiveNoticeRating(pending);
              setHasActiveReview(true);
            } else {
              setActiveNoticeRating(null);
              setHasActiveReview(false);
            }
          }
        }
      }
    } catch (e) {
      console.error("Worker fetch error:", e);
    }
  };

  // Stable dependency keys to prevent re-render loops and UI flickering
  useEffect(() => {
    fetchWorkerData();
  }, [role, currentUser?.id, currentUser?.name]);

  const toggleAvailability = async () => {
    if (!worker) return;
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    try {
      await fetch(`/api/workers/${worker.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newStatus }),
      });
      showToast(newStatus ? "You are now ON-DUTY and available for nearby jobs!" : "Shift paused. You are now OFF-DUTY.");
    } catch (e) {
      setIsAvailable(!newStatus);
    }
  };

  const handleStartJobWithOtp = async (bookingId: string) => {
    const enteredOtp = otpInputs[bookingId];
    if (!enteredOtp || enteredOtp.length !== 4) {
      showToast("Please enter the 4-digit code provided by the customer.");
      return;
    }

    setStartingJobId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "IN_PROGRESS", startOtp: enteredOtp }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Handshake Verified! 60-Minute Service Clock Started.");
        fetchWorkerData();
      } else {
        showToast(data.error || "Invalid Start-Work OTP.");
      }
    } catch (e) {
      showToast("Error verifying security handshake.");
    } finally {
      setStartingJobId(null);
    }
  };

  const handleAcknowledgeNotice = async () => {
    if (!activeNoticeRating) {
      setHasActiveReview(false);
      return;
    }
    try {
      const res = await fetch("/api/ratings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeNoticeRating.id,
          workerAcknowledged: true,
          acknowledgedAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setHasActiveReview(false);
        setActiveNoticeRating(null);
        showToast("Notice acknowledged! Your society peer review committee will coordinate your schedule.");
        if (typeof window !== "undefined") {
          localStorage.removeItem("coopserve_worker_review_active");
          localStorage.removeItem("coopserve_review_target_worker");
        }
      }
    } catch (e) {
      console.error(e);
      showToast("Error updating acknowledgment.");
    }
  };

  const handleCompleteJob = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });

      if (res.ok) {
        showToast("Job Completed! 90% direct payout transferred to your account.");
        fetchWorkerData();
      }
    } catch (e) {
      showToast("Error updating job status.");
    }
  };

  if (loading || !worker) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800/40 animate-pulse" />
      </div>
    );
  }

  const isUnsubmitted = worker?.status === "UNSUBMITTED";
  const isPending = worker?.status === "PENDING_VERIFICATION" || worker?.status === "PENDING";
  const isLocked = isUnsubmitted || isPending;

  return (
    <BackgroundGrid className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Welcome & Shift Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/70 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <UserAvatar
              src={worker.avatar}
              name={worker.name}
              className="w-16 h-16 rounded-2xl border-2 border-emerald-500 shadow-md text-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Namaste, {worker.name}
                </h1>
                {isUnsubmitted ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>e-KYC Required</span>
                  </span>
                ) : isPending ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Waiting for Admin Approval</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Verified Member
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {worker.society?.name} · Member ID: {worker.digitalIdCard?.slice(0, 16) || "COOP-ID-NEW"}
              </p>
            </div>
          </div>

          {/* Shift Availability Switch */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isLocked}
              onClick={toggleAvailability}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                isLocked
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-70"
                  : isAvailable
                  ? "bg-emerald-600 text-white shadow-emerald-500/25"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isLocked ? "Awaiting Verification" : isAvailable ? "On-Duty Available" : "Off-Duty / Shift Paused"}</span>
            </button>
          </div>
        </div>

        {/* 1. UNSUBMITTED STATE BANNER */}
        {isUnsubmitted && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-blue-500/10 border-2 border-blue-500/30 text-blue-900 dark:text-blue-200 backdrop-blur-xl shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-3">
            <BorderBeam colorFrom="#3b82f6" colorTo="#10b981" duration={6} />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30 shadow-inner">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Apply for Aadhaar e-KYC Verification
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/25 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider">
                      Action Required
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
                    Your worker profile is created. To unlock your cryptographic 3D Digital Co-op ID, group healthcare insurance, and direct customer job matching, complete your free Aadhaar e-KYC application.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/worker/register")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <span>Apply for e-KYC 📲</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 2. SUBMITTED & WAITING FOR APPROVAL BANNER */}
        {isPending && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 backdrop-blur-xl shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-3">
            <BorderBeam colorFrom="#f59e0b" colorTo="#3b82f6" duration={6} />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30 shadow-inner">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Application Submitted to Local Sector Admin — Waiting for Approval
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider">
                      Waiting for Approval
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
                    Your e-KYC documents and skill profile have been submitted to the <strong>Ward Sachivalayam Secretary (Ward #18, GVMC)</strong>. While your application is being audited, dispatch matching and your cryptographic 3D Digital Co-op ID remain locked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IN-APP NOTIFICATION BANNER: REVIEW OF WORK CONDUCTED */}
        {!isPending && hasActiveReview && activeNoticeRating && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 backdrop-blur-xl shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-3">
            <BorderBeam colorFrom="#f59e0b" colorTo="#ef4444" duration={6} />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30 shadow-inner">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Cooperative Quality Notice: A Review of Work Will Be Conducted
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider">
                      Peer Committee
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
                    A recent service feedback rating (≤ 2★) was received regarding job #{activeNoticeRating.booking?.id?.slice(0, 8) || "REF-01"}. Under Labour Cooperative Society governance bylaws, an empowering peer review of work will be conducted by your local Quality Committee to assess tooling, timing, and customer expectations. No punitive deactivation will occur.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleAcknowledgeNotice}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md shadow-amber-500/25 active:scale-95"
                >
                  Acknowledge Notice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KokonutStatCard
            title="Earnings YTD (90% Payout)"
            value={isLocked ? "₹0 (Inactive)" : `₹${worker.welfareRecord?.earningsYTD?.toLocaleString() || "84,300"}`}
            subtitle={isLocked ? "Inactive · Pending verification & first payout" : "+₹18,400 higher than private apps"}
            delta={isLocked ? { value: "Inactive", isPositive: false } : { value: "+28% vs pvt apps", isPositive: true }}
            icon={Wallet}
            variant="emerald"
          />

          <KokonutStatCard
            title="Co-op Welfare & Health Fund"
            value={isLocked ? "₹0 (Inactive)" : `₹${worker.welfareRecord?.fundBalance?.toLocaleString() || "6,850"}`}
            subtitle={isLocked ? "Inactive · 7% reserve unlocks after activation" : "Funded by automatic 7% per-job reserve"}
            delta={isLocked ? { value: "Inactive", isPositive: false } : { value: "Active Interest", isPositive: true }}
            icon={HeartHandshake}
            variant="blue"
          />

          <KokonutStatCard
            title="Cooperative Star Rating"
            value={isLocked ? "N/A (Inactive)" : `★ ${worker.rating?.toFixed(1) || "5.0"} / 5.0`}
            subtitle={isLocked ? "Inactive · Rating activates after first job" : `Across ${worker.totalJobs || 0} verified customer services`}
            delta={isLocked ? { value: "Inactive", isPositive: false } : { value: "Top Tier", isPositive: true }}
            icon={Award}
            variant="amber"
          />

          <KokonutStatCard
            title="Insurance Status (FR7)"
            value={isLocked ? "INACTIVE" : (worker.welfareRecord?.insuranceStatus || "ACTIVE")}
            subtitle={isLocked ? "Pending Verification & PMSBY Enrollment" : "PM Suraksha Bima Yojana Covered"}
            delta={isLocked ? { value: "Inactive", isPositive: false } : { value: "₹2,00,000 Cover", isPositive: true }}
            icon={ShieldCheck}
            variant="purple"
          />
        </div>

        {/* 2 Artisan Section Tabs with Spring Motion */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto">
          {[
            { id: "jobs" as const, label: `My Bookings & Assigned Jobs (${bookings.length})`, icon: CalendarCheck, color: "bg-emerald-600 text-white", locked: false },
            { id: "id" as const, label: isLocked ? "3D Virtual QR Identity Card (Locked 🔒)" : "3D Virtual QR Identity Card", icon: isLocked ? Lock : QrCode, color: isLocked ? "bg-slate-800 text-white border border-amber-500/40" : "bg-teal-600 text-white", locked: isLocked },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                  tab.locked ? "opacity-90" : ""
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeWorkerTab"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={`absolute inset-0 rounded-xl shadow-md ${tab.color}`}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-2 ${isSelected ? "text-white font-black" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MY BOOKINGS & JOBS */}
        {activeTab === "jobs" && (
          isLocked ? (
            <div className="rounded-3xl border-2 border-dashed border-amber-500/30 bg-white/50 dark:bg-slate-900/50 p-8 sm:p-12 text-center backdrop-blur-xl max-w-xl mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/30 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Job Dispatching Locked (Verification Required)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                {isUnsubmitted
                  ? "Please complete your free Aadhaar e-KYC application to submit your profile for verification."
                  : "Your worker profile has been submitted and is currently in the Ward Sachivalayam Secretary verification queue. You will be able to go on-duty and receive customer service requests as soon as your profile is approved."}
              </p>
              {isUnsubmitted && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/worker/register")}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Complete e-KYC Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 p-6 backdrop-blur-xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Active & Assigned Cooperative Jobs
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Fair dispatch directly from your local cooperative society.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    {bookings.length} Assigned Jobs
                  </span>
                </div>

                {bookings.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                    No active jobs currently assigned. Keep your status &quot;On-Duty&quot; to receive nearest customer bookings.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const isCompleted = booking.status === "COMPLETED";
                      return (
                        <div
                          key={booking.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            isCompleted
                              ? "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                              : "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/15 shadow-md shadow-emerald-500/5"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                  {booking.serviceType} Request
                                </h4>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    isCompleted
                                      ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                      : "bg-emerald-500 text-white animate-pulse"
                                  }`}
                                >
                                  {booking.status}
                                </span>
                                {booking.isEmergency && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                                    EMERGENCY
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                {booking.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3">
                                <span>Client: <strong className="text-slate-300">{booking.customer?.name || "Resident"}</strong></span>
                                <span>Address: {booking.customer?.address || "Zone 1"}</span>
                                <span>Ref: <span className="font-mono">{booking.id.slice(0, 8)}</span></span>
                              </div>
                            </div>

                            {/* Payout & Complete Button */}
                            <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-800">
                              <div className="text-xs text-slate-400">Your Take-Home (90%)</div>
                              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                ₹{booking.workerPayout}
                              </div>
                              <div className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                                +₹{booking.welfareFee} into your Welfare Fund
                              </div>

                              {booking.status === "ACCEPTED" && (
                                <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-2">
                                  <span className="block text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                    🔐 Ask Customer For Start-Work OTP:
                                  </span>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      maxLength={4}
                                      placeholder="e.g. 8341"
                                      value={otpInputs[booking.id] || ""}
                                      onChange={(e) =>
                                        setOtpInputs({
                                          ...otpInputs,
                                          [booking.id]: e.target.value,
                                        })
                                      }
                                      className="w-24 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-white dark:bg-slate-900 font-mono font-black text-sm text-center focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      disabled={startingJobId === booking.id}
                                      onClick={() => handleStartJobWithOtp(booking.id)}
                                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-sm"
                                    >
                                      Verify
                                    </button>
                                  </div>
                                </div>
                              )}

                              {booking.status === "IN_PROGRESS" && (
                                <button
                                  type="button"
                                  onClick={() => handleCompleteJob(booking.id)}
                                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-500/20"
                                >
                                  Mark Completed
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Certifications Section */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 p-6 backdrop-blur-xl">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Verified Skill Badges & NSDC Certifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {worker.certifications?.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-xs"
                    >
                      <div className="font-bold text-emerald-700 dark:text-emerald-300">
                        {c.title}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 mt-1">
                        {c.issuer}
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-emerald-500/20 text-[11px]">
                        <span className="font-mono text-slate-400">{c.certNumber}</span>
                        <span className="font-bold text-emerald-600">VERIFIED</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}

        {/* TAB 2: VIRTUAL ID */}
        {activeTab === "id" && (
          isLocked ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-8 sm:p-12 text-center backdrop-blur-xl max-w-xl mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto border border-slate-300 dark:border-slate-700 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {isUnsubmitted ? "3D Virtual QR Identity Card Locked (e-KYC Required)" : "3D Virtual QR Identity Card Locked (Under Review)"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                {isUnsubmitted
                  ? "Your cryptographic, tamper-proof 3D Digital Co-op ID and verifiable QR credential will be unlocked once you submit your free Aadhaar e-KYC and skill profile to the Ward Sachivalayam Secretary."
                  : "Your cryptographic 3D Digital Co-op ID card and QR credential will be automatically unlocked and issued once your profile is verified and approved by the Ward Sachivalayam Secretary."}
              </p>
              {isUnsubmitted && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/worker/register")}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Complete e-KYC Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* 3D Physical Flip Card */}
              <div className="space-y-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-1">
                    Official Digital Credential
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    3D Verifiable Member ID Card
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Click the flip button on the card to inspect your back-side policy numbers and society seals.
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-3xl p-3 bg-slate-900/60 border border-emerald-500/30 shadow-2xl">
                  <BorderBeam colorFrom="#10b981" colorTo="#06b6d4" duration={5} />
                  <div className="relative z-10">
                    <WorkerIdCard worker={worker} showFlipButton={true} />
                  </div>
                </div>
              </div>

              {/* Welfare & Healthcare Details */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-teal-500/20 bg-teal-500/5 p-6 backdrop-blur-xl text-xs space-y-4">
                  <div className="flex items-center gap-2 font-bold text-teal-700 dark:text-teal-300 text-sm">
                    <HeartHandshake className="w-4 h-4" />
                    <span>Worker Social Security & Healthcare (FR7)</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Every job automatically deposits 7% into your collective society welfare account, granting you free hospitalization and accident cover under government cooperative schemes.
                  </p>
                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-teal-500/20 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Insurance Scheme:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {worker.welfareRecord?.insurancePlan || "PM Suraksha Bima Yojana (PMSBY)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Policy Number:</span>
                      <span className="font-mono text-emerald-500 font-bold">
                        {worker.welfareRecord?.policyNumber || "PMSBY-AP-VZG-90820-2026"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Coverage Sum:</span>
                      <strong className="text-teal-600 dark:text-teal-400">₹2,00,000 Accident & Disability</strong>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl text-xs space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Labour Cooperative Society Affiliation
                  </span>
                  <p className="text-slate-400">
                    Affiliated with <strong>{worker.society?.name || "MVP Colony Labour Co-op, Vizag"}</strong> (Zone: {worker.society?.zone || "MVP Colony & Beach Road"}) under MSCS Act Bylaws.
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </BackgroundGrid>
  );
}

export default function WorkerDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-400">Loading Worker Portal...</div>}>
      <WorkerDashboardContent />
    </Suspense>
  );
}
