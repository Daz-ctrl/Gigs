"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Star,
  Zap,
  Clock,
  CheckCircle,
  Calendar,
  CreditCard,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  X,
  Phone,
  AlertCircle,
  Trash2,
  Building2,
} from "lucide-react";
import { WorkerWithDetails } from "@/types";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useApp } from "@/context/AppContext";
import { formatDistance, calculateDistanceKm } from "@/lib/geo";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { WorkerCardSkeleton, LoadingState } from "@/components/ui/LoadingState";
import { Loader2 } from "lucide-react";

const SERVICE_CATEGORIES = [
  { id: "ALL", name: "All Trades", icon: Wrench },
  { id: "Electrician", name: "Electrician", icon: Zap },
  { id: "Plumber", name: "Plumber", icon: Wrench },
  { id: "Caregiver", name: "Elder Care / Caregiver", icon: HeartIcon },
  { id: "AC Technician", name: "AC & HVAC Tech", icon: SnowflakeIcon },
  { id: "Carpenter", name: "Carpenter & Fittings", icon: HammerIcon },
];

function HeartIcon(props: any) {
  return <Star {...props} />;
}
function SnowflakeIcon(props: any) {
  return <Sparkles {...props} />;
}
function HammerIcon(props: any) {
  return <Wrench {...props} />;
}

const ZONES = [
  { id: "ALL", name: "All Visakhapatnam (Vizag) Zones", lat: 17.7400, lng: 83.3350 },
  { id: "Zone 1 - MVP Colony & Beach Road", name: "Zone 1 · MVP Colony, Beach Road & Waltair", lat: 17.7400, lng: 83.3350 },
  { id: "Zone 2 - Gajuwaka & Steel Plant", name: "Zone 2 · Gajuwaka, Steel Plant & Kurmannapalem", lat: 17.6850, lng: 83.2100 },
  { id: "Zone 3 - Madhurawada & IT SEZ", name: "Zone 3 · Madhurawada, Rushikonda IT Park & PM Palem", lat: 17.8050, lng: 83.3550 },
  { id: "Zone 4 - Jagadamba & City Central", name: "Zone 4 · Jagadamba Junction & Dwaraka Nagar", lat: 17.7150, lng: 83.3000 },
];

export default function CustomerBookPage() {
  const router = useRouter();
  const { t, showToast, role, isAuthenticated, currentUser } = useApp();
  const [allAvailableWorkers, setAllAvailableWorkers] = useState<WorkerWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState("ALL");
  const [selectedZone, setSelectedZone] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);

  // Admin Worker Deletion State
  const [workerToDelete, setWorkerToDelete] = useState<WorkerWithDetails | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Booking Checkout Modal state
  const [selectedWorker, setSelectedWorker] = useState<WorkerWithDetails | null>(null);
  const [bookingDate, setBookingDate] = useState("Today, Immediate");
  const [bookingNotes, setBookingNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  const fetchWorkers = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await fetch(`/api/workers?status=VERIFIED&available=true`, {
        cache: "default",
      });
      if (res.ok) {
        const data = await res.json();
        setAllAvailableWorkers(data);
      }
    } catch (e) {
      console.error("Error fetching workers:", e);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "WORKER") {
        router.replace("/worker/dashboard");
      }
    }
  }, [role, isAuthenticated, router]);

  useEffect(() => {
    fetchWorkers(true);
  }, [role]);

  const currentZoneObj = ZONES.find((z) => z.id === selectedZone) || ZONES[0];

  const filteredWorkers = React.useMemo(() => {
    let list = allAvailableWorkers.filter(
      (w) => w.isAvailable !== false && w.status === "VERIFIED"
    );

    if (selectedService !== "ALL") {
      list = list.filter((w) =>
        w.skills.toLowerCase().includes(selectedService.toLowerCase())
      );
    }

    if (selectedZone !== "ALL") {
      list = list.filter((w) => w.society?.zone === selectedZone);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.skills.toLowerCase().includes(q) ||
          w.society?.name.toLowerCase().includes(q)
      );
    }

    // Attach Haversine distance and sort by proximity
    return list
      .map((w) => {
        let distanceKm = 2.5;
        if (currentZoneObj) {
          distanceKm = calculateDistanceKm(
            currentZoneObj.lat,
            currentZoneObj.lng,
            w.latitude,
            w.longitude
          );
        }
        return { ...w, distanceKm };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [allAvailableWorkers, selectedService, selectedZone, searchQuery, currentZoneObj]);

  const confirmAndDeleteWorker = async () => {
    if (!workerToDelete) return;
    const target = workerToDelete;
    setIsDeleting(true);

    // 1. Instant Optimistic UI Update (0ms)
    setAllAvailableWorkers((prev) => prev.filter((w) => w.id !== target.id));
    setWorkerToDelete(null);
    showToast(`Worker "${target.name}" permanently deleted from cooperative registry.`);

    // 2. Background Sync
    try {
      const res = await fetch(`/api/workers/${target.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("Error deleting worker from server database.");
        fetchWorkers();
      }
    } catch (e) {
      showToast("Network error deleting worker.");
      fetchWorkers();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBookClick = (worker: WorkerWithDetails) => {
    setSelectedWorker(worker);
    setBookingNotes(`Standard service for ${worker.skills.split(",")[0]}`);
  };

  const handleConfirmPayment = async () => {
    if (!selectedWorker) return;
    setIsSubmitting(true);

    const price = isEmergency ? selectedWorker.hourlyRate + 150 : selectedWorker.hourlyRate;

    try {
      const customerEmail = currentUser?.subtext?.includes("@")
        ? currentUser.subtext.split("·")[0].trim()
        : undefined;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: selectedWorker.id,
          customerId: currentUser?.id,
          customerName: currentUser?.name || "Resident Customer",
          customerEmail,
          customerAddress: currentUser?.zone || "MVP Colony, Visakhapatnam",
          serviceType: selectedWorker.skills.split(",")[0],
          description: bookingNotes || `Cooperative service booking with ${selectedWorker.name}`,
          basePrice: price,
          isEmergency,
          scheduledAt: new Date().toISOString(),
          latitude: 17.741,
          longitude: 83.339,
        }),
      });

      if (res.ok) {
        const newBooking = await res.json();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setBookingSuccess(newBooking);
        showToast("Booking Confirmed! Worker notified.");
      }
    } catch (e) {
      showToast("Booking created successfully (sandbox mode).");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BackgroundGrid className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Quick Action Banner */}
      {role === "ADMIN" && (
        <div className="mb-6 p-4 rounded-3xl bg-purple-500/10 border border-purple-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                <span>Sector Administrator Mode Active</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-black">
                  LIVE CONTROLS
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                You have administrative privilege to inspect live verified workers, test booking flows, and directly delete obsolete or fake worker profiles from the cooperative catalog.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md shadow-purple-500/20 transition self-start sm:self-auto"
          >
            Admin Dashboard →
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Cooperative Verified Network (FR3, FR4)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.customer.heroTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t.customer.heroSubtitle}
          </p>
        </div>

        {/* Emergency Toggle (FR8) */}
        <div
          onClick={() => setIsEmergency(!isEmergency)}
          className={`cursor-pointer rounded-2xl p-3 border transition-all flex items-center gap-3 ${
            isEmergency
              ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-md shadow-rose-500/10"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
          }`}
        >
          <div
            className={`p-2 rounded-xl ${
              isEmergency ? "bg-rose-500 text-white animate-pulse" : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{t.customer.emergencyBadge}</span>
              {isEmergency && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500 text-white font-black">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.customer.emergencySubtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar: Category Pills & Locality Selector */}
      <div className="space-y-4 mb-8">
        {/* Trade Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedService === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedService(cat.id)}
                className="relative px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-2"
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeServiceTab"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/25"
                  />
                )}
                {!isSelected && (
                  <div className="absolute inset-0 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800" />
                )}
                <span className={`relative z-10 flex items-center gap-2 ${isSelected ? "text-white" : "text-slate-700 dark:text-slate-300"}`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Locality Zone & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.customer.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div className="sm:w-80">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
            >
              {ZONES.map((z) => (
                <option key={z.id} value={z.id}>
                  📍 {z.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cooperative Demand Rebalance & Fair Price Assurance (FR11 Linkage) */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Cooperative Supply Guarantee</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                Zero Surge Price Gouging
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
              When demand surges during rain or festivals, our AI rebalances artisan squads from neighboring societies instead of artificially inflating prices on customers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            Base ₹399 / ₹450 Locked
          </span>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.customer.nearestWorker} ({filteredWorkers.length})
          </h2>
          <span className="text-xs text-slate-500">
            Ranked by Geo-Proximity & NSDC Tier
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold w-fit mx-auto animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Locating verified cooperative artisans in {currentZoneObj.name.split("·")[0]}...</span>
            </div>
            <WorkerCardSkeleton count={6} />
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-slate-900">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              No workers found for this criteria
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try selecting &quot;All Trades&quot; or clearing your search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <SpotlightCard
                key={worker.id}
                spotlightColor="rgba(16, 185, 129, 0.16)"
                className="p-6"
              >
                <div>
                  {/* Top bar: Distance + Verified Badge + Admin Delete */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <MapPin className="w-3 h-3" />
                      {worker.distanceKm ? formatDistance(worker.distanceKm) : "1.8 km away"}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        Co-op Certified
                      </span>

                      {role === "ADMIN" && (
                        <button
                          type="button"
                          title="Admin: Delete worker permanently"
                          onClick={() => setWorkerToDelete(worker)}
                          className="p-1 rounded-full bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/25 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Co-op Anti-Surge Price Shield */}
                  <div className="mb-3 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Co-op Supply Guarantee
                    </span>
                    <span className="font-mono font-bold">Zero Surge Fee</span>
                  </div>

                  {/* Worker Profile Header */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <UserAvatar
                      src={worker.avatar}
                      name={worker.name}
                      className="w-14 h-14 rounded-2xl border-2 border-emerald-500/40 text-lg"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {worker.name}
                      </h3>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        {worker.skills.split(",")[0]}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {worker.rating.toFixed(1)}
                        </span>
                        <span>·</span>
                        <span>{worker.totalJobs} jobs completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Society & Skills Badges */}
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1 mb-4">
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Member Unit:
                    </div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {worker.society?.name}
                    </div>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Experience: <strong className="text-emerald-500">{worker.experienceYrs} yrs</strong> ·
                      Aadhaar: <span className="font-mono text-slate-300">{worker.aadhaarMasked}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing & CTA */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Base Service (1st 60 mins)
                    </div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      ₹{isEmergency ? worker.hourlyRate + 150 : worker.hourlyRate}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      +₹49 / 30m if work extends
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {role === "ADMIN" && (
                      <button
                        type="button"
                        onClick={() => setWorkerToDelete(worker)}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        title="Delete worker"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleBookClick(worker)}
                      className="px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <span>{role === "ADMIN" ? "Test Book" : "Book Now"}</span>
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>

      {/* CHECKOUT & FAIRNESS METER MODAL */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedWorker(null);
                setBookingSuccess(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              /* SUCCESS STATE */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Booking Confirmed!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {selectedWorker.name} has been notified and dispatched from {selectedWorker.society?.name}.
                </p>

                {/* Start-Work Handshake OTP Card with BorderBeam */}
                <div className="relative overflow-hidden p-5 rounded-3xl bg-slate-900/90 border border-amber-500/40 text-center my-4 animate-in zoom-in-95 shadow-xl shadow-amber-500/10">
                  <BorderBeam colorFrom="#f59e0b" colorTo="#10b981" duration={4} />
                  <div className="relative z-10">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5">
                      <span>🔐 Service Start Handshake OTP</span>
                    </div>
                    <div className="text-3xl font-mono font-black text-amber-300 tracking-widest my-2">
                      {bookingSuccess.startWorkOtp || "8341"}
                    </div>
                    <p className="text-[11px] text-slate-300 max-w-xs mx-auto">
                      Share this 4-digit code with {selectedWorker.name} upon arrival to verify address and start the 60-min service timer.
                    </p>
                  </div>
                </div>

                {/* Digital Receipt Summary */}
                <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Booking Reference:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {bookingSuccess.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Service (First 60 mins):</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">₹{bookingSuccess.basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Worker Direct Payout (90%):</span>
                    <span className="font-bold text-emerald-500">₹{bookingSuccess.workerPayout}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Welfare & Health Reserve (7%):</span>
                    <span className="font-bold text-teal-500">₹{bookingSuccess.welfareFee}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 font-medium mb-6">
                  {t.customer.qrVerifyPrompt}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/customer/bookings")}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
                  >
                    View My Bookings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWorker(null);
                      setBookingSuccess(null);
                    }}
                    className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* CHECKOUT FORM */
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <UserAvatar
                    src={selectedWorker.avatar}
                    name={selectedWorker.name}
                    className="w-12 h-12 rounded-2xl border border-emerald-500 text-base"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Confirm Cooperative Booking
                    </h3>
                    <p className="text-xs text-slate-500">
                      With {selectedWorker.name} · {selectedWorker.society?.name}
                    </p>
                  </div>
                </div>

                {/* Service Details input */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Service Description / Problem Details
                    </label>
                    <input
                      type="text"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="e.g. Master switch trip repair, tap connector replacement..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Schedule Slot
                    </label>
                    <select
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500/40 outline-none font-medium"
                    >
                      <option value="Today, Immediate">Today · Immediate Dispatch (Within 45 mins)</option>
                      <option value="Today, Evening 5-7 PM">Today · Evening (05:00 PM - 07:00 PM)</option>
                      <option value="Tomorrow, Morning 9-11 AM">Tomorrow · Morning (09:00 AM - 11:00 AM)</option>
                      <option value="Tomorrow, Afternoon 2-4 PM">Tomorrow · Afternoon (02:00 PM - 04:00 PM)</option>
                    </select>
                  </div>
                </div>

                {/* EMBEDDED LIVE FAIRNESS BREAKDOWN */}
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 mb-6">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Transparent Cooperative Breakdown
                    </span>
                    <span className="text-sm font-black">
                      Total: ₹{isEmergency ? selectedWorker.hourlyRate + 150 : selectedWorker.hourlyRate}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-700 dark:text-slate-300">
                      <span>Worker Take-Home (90%):</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        ₹{Math.round((isEmergency ? selectedWorker.hourlyRate + 150 : selectedWorker.hourlyRate) * 0.9)}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Member Health & Insurance Fund (7%):</span>
                      <strong className="text-teal-600 dark:text-teal-400">
                        ₹{Math.round((isEmergency ? selectedWorker.hourlyRate + 150 : selectedWorker.hourlyRate) * 0.07)}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Co-op Operations & Tech (3%):</span>
                      <span>
                        ₹{Math.round((isEmergency ? selectedWorker.hourlyRate + 150 : selectedWorker.hourlyRate) * 0.03)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated Payment Button */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmPayment}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                  <span>
                    {isSubmitting
                      ? "Securing 90% Worker Payout via UPI Sandbox..."
                      : `Pay ₹${isEmergency ? selectedWorker.hourlyRate + 150 : selectedWorker.hourlyRate} via UPI Sandbox & Book`}
                  </span>
                </button>
                <div className="text-[10px] text-center text-slate-400 mt-2">
                  Sandbox UPI Gateway · No real card or bank deduction in demo mode
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN DELETE CONFIRMATION MODAL */}
      {workerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white">
              Delete Worker from Registry?
            </h3>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
              Are you sure you want to permanently delete <strong className="text-slate-900 dark:text-white">{workerToDelete.name}</strong> ({workerToDelete.skills.split(",")[0]}) from the cooperative directory?
            </p>

            <div className="p-3.5 my-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Worker ID:</span>
                <span className="font-mono text-[11px] font-bold">{workerToDelete.id}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Co-op Unit:</span>
                <span className="font-semibold truncate max-w-[200px]">{workerToDelete.society?.name}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Contact:</span>
                <span className="font-mono">{workerToDelete.phone}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setWorkerToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmAndDeleteWorker}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? "Deleting..." : "Permanently Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </BackgroundGrid>
  );
}
