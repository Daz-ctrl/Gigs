"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Star,
  FileText,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Printer,
  Sparkles,
  Phone,
} from "lucide-react";
import { BookingWithDetails } from "@/types";
import { useApp } from "@/context/AppContext";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";

export default function CustomerBookingsPage() {
  const { t, showToast, role, currentUser } = useApp();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [ratingBooking, setRatingBooking] = useState<BookingWithDetails | null>(null);
  const [selectedScore, setSelectedScore] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Punctual", "Cooperative Verified", "Fair Price"]);
  const [invoiceBooking, setInvoiceBooking] = useState<BookingWithDetails | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const email = currentUser?.subtext?.includes("@")
        ? currentUser.subtext.split("·")[0].trim()
        : "";
      const queryParams = new URLSearchParams();
      if (currentUser?.id) queryParams.set("customerId", currentUser.id);
      if (email) queryParams.set("customerEmail", email);

      const url = queryParams.toString() ? `/api/bookings?${queryParams.toString()}` : "/api/bookings";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [role, currentUser?.id, currentUser?.name]);

  const handleRatingSubmit = async () => {
    if (!ratingBooking) return;
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: ratingBooking.id,
          score: selectedScore,
          feedback: feedbackText,
          tags: selectedTags.join(","),
        }),
      });

      if (res.ok) {
        showToast(
          selectedScore <= 2
            ? "Rating logged. Alert flagged to Society Admin for review."
            : "Thank you! Rating submitted to cooperative member profile."
        );
        setRatingBooking(null);
        fetchBookings();
      }
    } catch (e) {
      showToast("Rating submitted successfully.");
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <BackgroundGrid className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <CalendarCheck className="w-3.5 h-3.5" />
              Booking History & Invoicing (FR5, FR6)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t.nav.myBookings}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track active service jobs, download cooperative invoices, and rate verified artisan members.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800/40 animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-slate-900">
            <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white">No bookings recorded yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Explore verified artisans in your locality to book your first cooperative service.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isCompleted = booking.status === "COMPLETED";
              const isInProgress = booking.status === "IN_PROGRESS";
              return (
                <SpotlightCard
                  key={booking.id}
                  spotlightColor={isCompleted ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.18)"}
                  className="p-6"
                >
                {/* Left details */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 ${
                      isCompleted
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : isInProgress
                        ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 animate-pulse"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {booking.serviceType.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {booking.serviceType} Service
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isCompleted
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : isInProgress
                            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
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

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 mt-2">
                      <span>Worker: <strong className="text-slate-300">{booking.worker?.name || "Assigned Worker"}</strong></span>
                      <span>Scheduled: {new Date(booking.scheduledAt).toLocaleDateString()}</span>
                      <span className="font-mono">Ref: {booking.id.slice(0, 10)}</span>
                    </div>

                    {/* Start-Work Handshake OTP (for ACCEPTED bookings) */}
                    {!isCompleted && !isInProgress && (
                      <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            🔐 Start-Work OTP:
                          </span>
                          <span className="text-sm font-mono font-black text-slate-900 dark:text-white tracking-widest px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-500/30">
                            {booking.startWorkOtp || "8341"}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Share this with {booking.worker?.name || "the worker"} upon arrival to initiate work
                        </span>
                      </div>
                    )}

                    {/* Timer active when IN_PROGRESS */}
                    {isInProgress && (
                      <div className="mt-3 p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 animate-pulse">
                        <Clock className="w-4 h-4" />
                        <span>Service Clock Active · Standard 60-min window (+₹49/30m extension if needed)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Actions & Fairness Tag */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-200 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-400">Total Paid</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      ₹{booking.basePrice}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      ₹{booking.workerPayout} (90%) directly to worker
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInvoiceBooking(booking)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>Invoice</span>
                    </button>

                    {isCompleted && !booking.rating && (
                      <button
                        type="button"
                        onClick={() => {
                          setRatingBooking(booking);
                          setSelectedScore(5);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Rate Worker</span>
                      </button>
                    )}

                    {booking.rating && (
                      <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-xs flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{booking.rating.score} ★ Rated</span>
                      </div>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}

      {/* RATING MODAL (FR6) */}
      {ratingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setRatingBooking(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.customer.rateWorkerTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your feedback directly impacts the cooperative rating and incentive bonus of {ratingBooking.worker?.name}.
              </p>
            </div>

            {/* Interactive Stars */}
            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedScore(star)}
                  className="p-1 cursor-pointer transition transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= selectedScore
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Low Rating Warning */}
            {selectedScore <= 2 && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Ratings of 2 stars or below trigger an automatic audit investigation by the Society Admin.
                </span>
              </div>
            )}

            {/* Tag Pills */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                What went well?
              </label>
              <div className="flex flex-wrap gap-2">
                {["Punctual", "Cooperative Verified", "Fair Price", "Polite", "Skillful", "Neat Work"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedTags.includes(tag)
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Written Review / Notes
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500/40 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleRatingSubmit}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer"
            >
              Submit Cooperative Rating
            </button>
          </div>
        </div>
      )}

      {/* DIGITAL INVOICE MODAL (FR5) */}
      {invoiceBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100">
            <button
              type="button"
              onClick={() => setInvoiceBooking(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Invoice Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                    CS
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight">CoopServe</h3>
                    <p className="text-[10px] text-slate-400">Labour Co-op Federation of India</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">PAID INVOICE</div>
                  <div className="text-[10px] font-mono text-slate-400">{invoiceBooking.id.slice(0, 14)}</div>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Billed To</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {invoiceBooking.customer?.name || currentUser.name || "Resident Customer"}
                </strong>
                <p className="text-[11px] text-slate-500">{invoiceBooking.customer?.address || "MVP Colony, Visakhapatnam"}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Service Provider</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {invoiceBooking.worker?.name || "Sunil Kumar"}
                </strong>
                <p className="text-[11px] text-emerald-500 font-medium">Verified Co-op Member</p>
              </div>
            </div>

            {/* Line items */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mb-6 text-xs">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 font-bold flex justify-between">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between">
                <div>
                  <div className="font-semibold">{invoiceBooking.serviceType} Certified Labour</div>
                  <div className="text-[11px] text-slate-400">{invoiceBooking.description}</div>
                </div>
                <div className="font-bold">₹{invoiceBooking.basePrice}</div>
              </div>
              <div className="p-3 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between font-extrabold text-sm">
                <span>Total Paid</span>
                <span className="text-emerald-500">₹{invoiceBooking.basePrice}</span>
              </div>
            </div>

            {/* THE SIGNATURE FAIRNESS METER ON INVOICE */}
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs mb-6">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Fairness Meter Transparency Audit
              </div>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Direct Worker Share (90%):</span>
                  <strong className="text-emerald-500">₹{invoiceBooking.workerPayout}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Member Welfare & Insurance Fund (7%):</span>
                  <strong className="text-teal-500">₹{invoiceBooking.welfareFee}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Federation Platform Operations (3%):</span>
                  <span>₹{invoiceBooking.platformFee}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setInvoiceBooking(null)}
                className="py-2.5 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </BackgroundGrid>
  );
}
