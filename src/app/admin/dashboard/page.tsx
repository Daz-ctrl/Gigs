"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Building2,
  Users,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  Clock,
  Sparkles,
  Sliders,
  DollarSign,
  TrendingUp,
  Brain,
  CheckCircle2,
  Phone,
  Layers,
  Star,
  MessageSquare,
  Send,
  ArrowRight,
} from "lucide-react";
import { WorkerWithDetails } from "@/types";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { KokonutStatCard } from "@/components/ui/KokonutStatCard";
import { AllocationPanel } from "@/components/ai/AllocationPanel";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";

interface FlaggedRating {
  id: string;
  bookingId: string;
  score: number;
  feedback: string;
  tags?: string;
  flagged: boolean;
  noticeSent?: boolean;
  noticeSentAt?: string | null;
  workerAcknowledged?: boolean;
  acknowledgedAt?: string | null;
  adminStatus?: string;
  createdAt: string;
  booking: {
    id: string;
    serviceType: string;
    scheduledAt: string;
    worker?: {
      id: string;
      name: string;
      skills: string;
      phone: string;
      avatar?: string | null;
      digitalIdCard: string;
    };
    customer?: {
      id: string;
      name: string;
      phone: string;
      address: string;
      email?: string;
    };
  };
}

function AdminDashboardContent() {
  const { t, showToast, role, isAuthenticated } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [workers, setWorkers] = useState<WorkerWithDetails[]>([]);
  const [flaggedRatings, setFlaggedRatings] = useState<FlaggedRating[]>([]);
  const [alertSubTab, setAlertSubTab] = useState<"pending" | "acknowledged">("pending");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "queue" | "alerts" | "ai_radar" | "roster"
  >("queue");

  // Policy state
  const [wageFloor, setWageFloor] = useState(450);

  useEffect(() => {
    if (isAuthenticated && role !== "ADMIN") {
      showToast("Access restricted: Administrator portal is reserved for sector admins.");
      router.replace(role === "WORKER" ? "/worker/dashboard" : "/customer/book");
    }
  }, [role, isAuthenticated, router, showToast]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam === "queue" ||
      tabParam === "alerts" ||
      tabParam === "ai_radar" ||
      tabParam === "roster"
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const fetchWorkers = async () => {
    try {
      const res = await fetch("/api/workers?status=ALL");
      if (res.ok) {
        const data = await res.json();
        setWorkers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlaggedRatings = async () => {
    try {
      const res = await fetch("/api/ratings?flagged=true");
      if (res.ok) {
        const data = await res.json();
        setFlaggedRatings(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([
      fetch("/api/workers?status=ALL").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/ratings?flagged=true").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([workersData, ratingsData]) => {
        if (!isMounted) return;
        if (Array.isArray(workersData)) setWorkers(workersData);
        if (Array.isArray(ratingsData)) setFlaggedRatings(ratingsData);
      })
      .catch((e) => console.error("Admin parallel load error:", e))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [role]);

  const handleVerifyWorker = async (workerId: string) => {
    const target = workers.find((w) => w.id === workerId);
    const targetName = target?.name?.trim().toLowerCase();

    // 1. Instant Optimistic UI Update (0ms) - marks all matching instances as VERIFIED
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId || (targetName && w.name?.trim().toLowerCase() === targetName)
          ? { ...w, status: "VERIFIED", isAvailable: true }
          : w
      )
    );
    showToast("Worker approved! Digital Cooperative ID & QR credential issued.");

    // 2. Background Sync
    try {
      const res = await fetch(`/api/workers/${workerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "VERIFIED", isAvailable: true }),
      });
      if (!res.ok) {
        fetchWorkers();
      }
    } catch (e) {
      showToast("Error updating worker status on server.");
      fetchWorkers();
    }
  };

  const handleRejectWorker = async (workerId: string) => {
    const target = workers.find((w) => w.id === workerId);
    const targetName = target?.name?.trim().toLowerCase();

    // 1. Instant Optimistic UI Update (0ms) - marks all matching instances as REJECTED
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId || (targetName && w.name?.trim().toLowerCase() === targetName)
          ? { ...w, status: "REJECTED", isAvailable: false }
          : w
      )
    );
    showToast("Worker registration rejected.");

    // 2. Background Sync
    try {
      const res = await fetch(`/api/workers/${workerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });
      if (!res.ok) {
        fetchWorkers();
      }
    } catch (e) {
      showToast("Error rejecting worker on server.");
      fetchWorkers();
    }
  };

  const handleNotifyWorkerReview = async (rating: FlaggedRating) => {
    try {
      const res = await fetch("/api/ratings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rating.id,
          noticeSent: true,
          noticeSentAt: new Date().toISOString(),
          adminStatus: "NOTICE_SENT",
        }),
      });
      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("coopserve_worker_review_active", "true");
          localStorage.setItem(
            "coopserve_review_target_worker",
            rating.booking.worker?.name || "Sunil Kumar"
          );
        }
        showToast(
          `In-app review notice sent to ${rating.booking.worker?.name || "the worker"}. Awaiting acknowledgment.`
        );
        fetchFlaggedRatings();
      }
    } catch (e) {
      showToast("Error sending review notice.");
    }
  };

  const handleTransferToAcknowledged = async (ratingId: string) => {
    try {
      const res = await fetch("/api/ratings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ratingId,
          adminStatus: "ACKNOWLEDGED",
        }),
      });
      if (res.ok) {
        showToast("Incident transferred to Acknowledged sub-section! Peer review session approaching soon.");
        fetchFlaggedRatings();
        setAlertSubTab("acknowledged");
      }
    } catch (e) {
      showToast("Error transferring alert.");
    }
  };

  const handleResolveAlert = async (ratingId: string) => {
    try {
      const res = await fetch("/api/ratings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ratingId,
          flagged: false,
          adminStatus: "RESOLVED",
        }),
      });
      if (res.ok) {
        showToast("Alert investigation resolved and audit closed.");
        fetchFlaggedRatings();
      }
    } catch (e) {
      showToast("Error resolving alert.");
    }
  };

  // Deduplicate and filter applicants awaiting verification:
  // 1. Must be PENDING_VERIFICATION or PENDING
  // 2. Must have submitted e-KYC (not an unsubmitted XXXX-XXXX-PENDING stub)
  // 3. Deduplicate by worker name/identity to guarantee zero duplicate cards
  const pendingMap = new Map<string, any>();
  workers
    .filter(
      (w) =>
        (w.status === "PENDING_VERIFICATION" || w.status === "PENDING") &&
        w.aadhaarMasked &&
        !w.aadhaarMasked.includes("PENDING")
    )
    .forEach((w) => {
      const key = (w.name || "").trim().toLowerCase();
      if (!pendingMap.has(key)) {
        pendingMap.set(key, w);
      } else {
        const existing = pendingMap.get(key);
        if (!existing.avatar && w.avatar) {
          pendingMap.set(key, w);
        }
      }
    });
  const pendingWorkers = Array.from(pendingMap.values());

  const verifiedMap = new Map<string, any>();
  workers
    .filter((w) => w.status === "VERIFIED")
    .forEach((w) => {
      const key = (w.name || "").trim().toLowerCase();
      if (!verifiedMap.has(key)) {
        verifiedMap.set(key, w);
      }
    });
  const verifiedWorkers = Array.from(verifiedMap.values());

  const pendingAlerts = flaggedRatings.filter(
    (r) => r.flagged && r.adminStatus !== "ACKNOWLEDGED" && r.adminStatus !== "RESOLVED"
  );
  const acknowledgedAlerts = flaggedRatings.filter(
    (r) => r.flagged && r.adminStatus === "ACKNOWLEDGED"
  );

  return (
    <BackgroundGrid className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
                Ward Sachivalayam #18 · Control Center
              </span>
              <span className="text-xs text-slate-500">
                Ward Welfare & Development Secretary · GVMC Visakhapatnam
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Ward Sachivalayam & Cooperative Governance Hub
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Overseeing Ward 18 (MVP Colony & Beach Road) · Affiliated with Andhra Pradesh Labour Cooperative Federation (APLCF)
            </p>
          </div>
        </div>

        {/* 4 High-Craft Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KokonutStatCard
            title="Active Worker Roster"
            value={verifiedWorkers.length.toString()}
            subtitle="Verified Labour Co-op Members"
            delta={{ value: "+8 this month", isPositive: true }}
            icon={Users}
            variant="emerald"
          />

          <KokonutStatCard
            title="Verification Queue"
            value={pendingWorkers.length.toString()}
            subtitle="Applicants Awaiting Auth"
            delta={{
              value: pendingWorkers.length > 0 ? "Requires Action" : "Up to date",
              isPositive: pendingWorkers.length === 0,
            }}
            icon={Clock}
            variant="amber"
          />

          <KokonutStatCard
            title="Alert Review Section"
            value={flaggedRatings.length.toString()}
            subtitle="Ratings ≤ 2★ Under Audit"
            delta={{
              value: flaggedRatings.length > 0 ? "Peer Review Pending" : "0 Active Alerts",
              isPositive: flaggedRatings.length === 0,
            }}
            icon={AlertTriangle}
            variant="amber"
          />

          <KokonutStatCard
            title="Disbursed Wage Volume"
            value="₹1.09 Cr"
            subtitle="90% directly kept by workers"
            delta={{ value: "+32% YoY", isPositive: true }}
            icon={TrendingUp}
            variant="purple"
          />
        </div>

        {/* Navigation Tabs with Spring Motion */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          {[
            {
              id: "queue" as const,
              label: "Worker Auth Queue",
              count: pendingWorkers.length,
              color: "bg-amber-500 text-slate-950",
              icon: Clock,
            },
            {
              id: "alerts" as const,
              label: `Alert Review Section (${pendingAlerts.length + acknowledgedAlerts.length})`,
              count: pendingAlerts.length + acknowledgedAlerts.length,
              color: "bg-rose-600 text-white",
              icon: AlertTriangle,
            },
            {
              id: "ai_radar" as const,
              label: "FR11 AI Demand Radar",
              icon: Brain,
              color: "bg-purple-600 text-white",
            },
            {
              id: "roster" as const,
              label: `Worker Roster & Policy (${verifiedWorkers.length})`,
              icon: Users,
              color: "bg-emerald-600 text-white",
            },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="relative px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shrink-0"
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeAdminTab"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={`absolute inset-0 rounded-xl shadow-md ${tab.color}`}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-2 ${
                    isSelected
                      ? tab.id === "queue"
                        ? "text-slate-950 font-black"
                        : "text-white font-black"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                        tab.id === "alerts"
                          ? "bg-white text-rose-600"
                          : "bg-slate-950 text-amber-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: WORKER AUTH QUEUE */}
        {activeTab === "queue" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Applicants Awaiting Cooperative Verification ({pendingWorkers.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Review applicant e-KYC status and verify digital credentials.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-slate-400">
                Loading queue...
              </div>
            ) : pendingWorkers.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Verification Queue Clear!
                </div>
                <div className="text-[11px] text-slate-400">
                  All registered artisans are active and verified.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingWorkers.map((worker) => (
                  <SpotlightCard
                    key={worker.id}
                    className="p-5 flex flex-col justify-between rounded-3xl border border-amber-500/25 bg-amber-500/5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            src={worker.avatar}
                            name={worker.name}
                            className="w-12 h-12 rounded-2xl border border-amber-500/40 text-base"
                          />
                          <div>
                            <div className="font-bold text-sm text-slate-900 dark:text-white">
                              {worker.name}
                            </div>
                            <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                              {worker.skills} · ₹{worker.hourlyRate}/hr
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-2.5 h-2.5" />
                              <span>{worker.phone}</span>
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold">
                          Pending Auth
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs mb-4">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Aadhaar e-KYC:</span>
                          <span className="font-mono text-emerald-500 font-bold">
                            {worker.aadhaarMasked} (Verified)
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Society:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {worker.society?.name || "MVP Colony Labour Co-op, Vizag"}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Experience:</span>
                          <span>{worker.experienceYrs} Years Hands-on</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleVerifyWorker(worker.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify & Issue ID</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectWorker(worker.id)}
                        className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-bold text-xs transition cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALERT REVIEW SECTION */}
        {activeTab === "alerts" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <span>Quality Incident & Alert Review Section</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customer ratings ≤ 2★ routed for cooperative peer investigation under society bylaws.
                </p>
              </div>

              {/* Sub-Section Navigation Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setAlertSubTab("pending")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    alertSubTab === "pending"
                      ? "bg-rose-500 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Pending Notices ({pendingAlerts.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAlertSubTab("acknowledged")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    alertSubTab === "acknowledged"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acknowledged ({acknowledgedAlerts.length})</span>
                  {acknowledgedAlerts.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-teal-300 animate-ping" />
                  )}
                </button>
              </div>
            </div>

            {/* SUB-SECTION 1: PENDING ALERTS */}
            {alertSubTab === "pending" && (
              <div>
                {pendingAlerts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-900/40 p-8">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3 opacity-80" />
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Zero Pending Review Notices!
                    </div>
                    <div className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      All quality incidents have either been transferred to the Acknowledged sub-section or resolved.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingAlerts.map((rating) => {
                      const worker = rating.booking.worker;
                      const customer = rating.booking.customer;
                      return (
                        <SpotlightCard
                          key={rating.id}
                          className="p-6 rounded-3xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/15 shadow-md relative overflow-hidden"
                        >
                          <div className="flex flex-col lg:flex-row gap-6 justify-between">
                            {/* Left: Customer Feedback & Rating */}
                            <div className="flex-1 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-black text-xs flex items-center gap-1 shadow-sm">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span>{rating.score} Star Alert</span>
                                </span>

                                {!rating.noticeSent ? (
                                  <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-amber-500" />
                                    <span>Awaiting Admin Notice</span>
                                  </span>
                                ) : !rating.workerAcknowledged ? (
                                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5 border border-amber-500/30 animate-pulse">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>The worker has not acknowledged yet</span>
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Worker Acknowledged Notice</span>
                                  </span>
                                )}

                                <span className="text-[11px] text-slate-400">
                                  · Ref #{rating.booking.id.slice(0, 8)}
                                </span>
                              </div>

                              {/* Customer Feedback Quote */}
                              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-rose-500/20 space-y-1.5">
                                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3 text-rose-500" />
                                  <span>Customer Written Feedback:</span>
                                </div>
                                <blockquote className="text-xs font-semibold text-slate-800 dark:text-slate-200 italic leading-relaxed">
                                  &ldquo;{rating.feedback}&rdquo;
                                </blockquote>
                                {rating.tags && (
                                  <div className="pt-2 flex flex-wrap gap-1.5">
                                    {rating.tags.split(",").map((tag) => (
                                      <span
                                        key={tag}
                                        className="px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold"
                                      >
                                        {tag.trim()}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Customer Details */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                <span>
                                  Complainant: <strong className="text-slate-700 dark:text-slate-300">{customer?.name || "Resident"}</strong>
                                </span>
                                <span>Address: {customer?.address || "MVP Colony, Vizag"}</span>
                                <span>Date: {new Date(rating.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {/* Right: Worker Profile & Action Buttons */}
                            <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6 space-y-4">
                              <div>
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                  Target Worker / Artisan
                                </div>
                                <div className="flex items-center gap-3">
                                  <UserAvatar
                                    src={worker?.avatar}
                                    name={worker?.name || "Worker"}
                                    className="w-12 h-12 rounded-2xl border-2 border-rose-500/40 text-base"
                                  />
                                  <div>
                                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                                      {worker?.name || "Sunil Kumar"}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {worker?.skills || "Electrician"}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      ID: {worker?.digitalIdCard?.slice(0, 16) || "COOP-ID-9082"}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 pt-2">
                                {!rating.noticeSent ? (
                                  <button
                                    type="button"
                                    onClick={() => handleNotifyWorkerReview(rating)}
                                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Send Notice (Review of Work)</span>
                                  </button>
                                ) : !rating.workerAcknowledged ? (
                                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs space-y-1">
                                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-amber-600 dark:text-amber-400">
                                      <Clock className="w-3.5 h-3.5 animate-spin" />
                                      <span>Notice Dispatched</span>
                                    </div>
                                    <p className="font-extrabold text-xs text-slate-900 dark:text-white">
                                      The worker has not acknowledged yet
                                    </p>
                                    <div className="text-[10px] text-slate-500">
                                      Notice active on artisan portal · Awaiting acknowledgment
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs space-y-1">
                                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Worker Acknowledged Notice</span>
                                      </div>
                                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                        Confirmed by {worker?.name || "Artisan"}
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleTransferToAcknowledged(rating.id)}
                                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-95"
                                    >
                                      <span>Transfer to Acknowledged</span>
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleResolveAlert(rating.id)}
                                  className="w-full py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Resolve & Close Audit</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </SpotlightCard>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SUB-SECTION 2: ACKNOWLEDGED ALERTS */}
            {alertSubTab === "acknowledged" && (
              <div>
                {acknowledgedAlerts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-900/40 p-8">
                    <CheckCircle className="w-10 h-10 text-teal-500 mx-auto mb-3 opacity-80" />
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      No Incidents in Acknowledged Sub-Section
                    </div>
                    <div className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      When a worker acknowledges a notice and you click &quot;Transfer to Acknowledged&quot;, the incident will be tracked here for peer committee scheduling.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {acknowledgedAlerts.map((rating) => {
                      const worker = rating.booking.worker;
                      const customer = rating.booking.customer;
                      return (
                        <SpotlightCard
                          key={rating.id}
                          className="p-6 rounded-3xl border border-teal-500/30 bg-teal-500/5 dark:bg-teal-950/15 shadow-md relative overflow-hidden"
                        >
                          <div className="flex flex-col lg:flex-row gap-6 justify-between">
                            {/* Left: Hearing Details & Customer Feedback */}
                            <div className="flex-1 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-1 rounded-full bg-teal-600 text-white font-black text-xs flex items-center gap-1 shadow-sm">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Acknowledged Sub-Section</span>
                                </span>

                                <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold flex items-center gap-1.5 border border-teal-500/30">
                                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                                  <span>Approaching Soon: Peer Review Hearing</span>
                                </span>

                                <span className="text-[11px] text-slate-400">
                                  · Ref #{rating.booking.id.slice(0, 8)}
                                </span>
                              </div>

                              {/* Customer Feedback Quote */}
                              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-teal-500/20 space-y-1.5">
                                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3 text-teal-500" />
                                  <span>Customer Feedback (Rating: ★ {rating.score}):</span>
                                </div>
                                <blockquote className="text-xs font-semibold text-slate-800 dark:text-slate-200 italic leading-relaxed">
                                  &ldquo;{rating.feedback}&rdquo;
                                </blockquote>
                              </div>

                              {/* Peer Review Hearing Approaching Notice */}
                              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-xs space-y-1.5">
                                <div className="flex items-center gap-2 font-bold text-teal-300 text-xs">
                                  <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                                  <span>Approaching Soon · Cooperative Quality Committee Session</span>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-relaxed">
                                  Artisan acknowledged notice on{" "}
                                  <strong className="text-teal-300">
                                    {rating.acknowledgedAt
                                      ? new Date(rating.acknowledgedAt).toLocaleString([], {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        })
                                      : "Recorded"}
                                  </strong>
                                  . Local society hearing is approaching soon to review tooling and transit timing. No punitive penalties will be levied.
                                </p>
                              </div>

                              {/* Complainant Details */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                <span>
                                  Complainant: <strong className="text-slate-700 dark:text-slate-300">{customer?.name || "Resident"}</strong>
                                </span>
                                <span>Address: {customer?.address || "MVP Colony, Vizag"}</span>
                              </div>
                            </div>

                            {/* Right: Worker Profile & Action Buttons */}
                            <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6 space-y-4">
                              <div>
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                  Affiliated Artisan
                                </div>
                                <div className="flex items-center gap-3">
                                  <UserAvatar
                                    src={worker?.avatar}
                                    name={worker?.name || "Worker"}
                                    className="w-12 h-12 rounded-2xl border-2 border-teal-500/40 text-base"
                                  />
                                  <div>
                                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                                      {worker?.name || "Sunil Kumar"}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {worker?.skills || "Electrician"}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      ID: {worker?.digitalIdCard?.slice(0, 16) || "COOP-ID-9082"}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 pt-2">
                                <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                                  <span>Approaching Soon / Hearing Scheduled</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleResolveAlert(rating.id)}
                                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-600/25 active:scale-95"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Resolve & Close Audit</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </SpotlightCard>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FR11 AI DEMAND RADAR */}
        {activeTab === "ai_radar" && (
          <div className="space-y-6">
            <AllocationPanel />
          </div>
        )}

        {/* TAB 4: ARTISAN ROSTER & WELFARE POLICY */}
        {activeTab === "roster" && (
          <div className="space-y-6">
            {/* Integrated Wage Floor & Welfare Policy Card */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-500" />
                    <span>Statutory Wage Floor & Welfare Policy Architecture</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cooperative rules guaranteed under the Ministry of Cooperation bylaws.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    showToast(`Wage Policy Locked: Minimum floor set to ₹${wageFloor}/hr.`)
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer self-start sm:self-auto"
                >
                  Save Policy
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Wage Floor
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      ₹{wageFloor}
                    </span>
                    <span className="text-xs text-slate-400">/ hour floor</span>
                  </div>
                  <input
                    type="range"
                    min="350"
                    max="700"
                    step="25"
                    value={wageFloor}
                    onChange={(e) => setWageFloor(Number(e.target.value))}
                    className="w-full mt-3 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-2">
                    No customer can book below this floor. Ensures dignity of labour.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Worker Direct Take-Home
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      90%
                    </span>
                    <span className="text-xs text-slate-400">Statutory Guarantee</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Direct bank settlement via UPI/NEFT within 2 hours of completion.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Collective Welfare Fund
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
                      7%
                    </span>
                    <span className="text-xs text-slate-400">Auto Deducted</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Funds PMSBY accident cover & emergency medical loans.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Worker Directory Table */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 overflow-hidden shadow-sm backdrop-blur-xl">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Active Verified Worker Directory ({verifiedWorkers.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official cooperative registry of certified tradespeople.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Worker</th>
                      <th className="p-4">Trade</th>
                      <th className="p-4">Customer Rating</th>
                      <th className="p-4">Completed Jobs</th>
                      <th className="p-4">Insurance Status</th>
                      <th className="p-4">Digital ID Card Token</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {verifiedWorkers.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-500/5 transition">
                        <td className="p-4 flex items-center gap-3">
                          <UserAvatar
                            src={w.avatar}
                            name={w.name}
                            className="w-9 h-9 rounded-xl border border-emerald-500/40 text-xs"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{w.name}</div>
                            <div className="text-[11px] text-slate-400">{w.phone}</div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">
                          {w.skills}
                        </td>
                        <td className="p-4 font-bold text-amber-500">★ {w.rating.toFixed(1)}</td>
                        <td className="p-4 font-semibold">{w.totalJobs} jobs</td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 text-[10px] font-bold">
                            PMSBY ACTIVE
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-400">
                          {w.digitalIdCard.slice(0, 16)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </BackgroundGrid>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
          Loading Control Center...
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
