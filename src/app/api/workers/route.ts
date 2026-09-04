import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDistanceKm } from "@/lib/geo";

// High-speed In-Memory Cache (10s TTL)
let cachedAllWorkers: any[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 10000;

export function invalidateWorkersCache() {
  cachedAllWorkers = null;
  lastCacheTime = 0;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceType = searchParams.get("serviceType");
    const zone = searchParams.get("zone");
    const status = searchParams.get("status") || "VERIFIED";
    const available = searchParams.get("available");
    const userLat = parseFloat(searchParams.get("lat") || "");
    const userLng = parseFloat(searchParams.get("lng") || "");

    const now = Date.now();
    let allWorkers = cachedAllWorkers;

    if (!allWorkers || now - lastCacheTime > CACHE_TTL_MS) {
      allWorkers = await prisma.worker.findMany({
        include: {
          society: true,
          certifications: true,
          welfareRecord: true,
        },
        orderBy: { rating: "desc" },
      });
      cachedAllWorkers = allWorkers;
      lastCacheTime = now;
    }

    // Fast in-memory filtering (0ms latency)
    let filtered = allWorkers;

    if (status !== "ALL") {
      if (status === "PENDING" || status === "PENDING_VERIFICATION") {
        filtered = filtered.filter(
          (w) =>
            (w.status === "PENDING" || w.status === "PENDING_VERIFICATION") &&
            w.aadhaarMasked &&
            !w.aadhaarMasked.includes("PENDING")
        );
      } else {
        filtered = filtered.filter((w) => w.status === status);
      }
    }

    if (available === "true") {
      filtered = filtered.filter((w) => w.isAvailable === true);
    } else if (available === "false") {
      filtered = filtered.filter((w) => w.isAvailable === false);
    }

    if (zone && zone !== "ALL") {
      filtered = filtered.filter((w) => w.society?.zone === zone);
    }

    if (serviceType && serviceType !== "ALL") {
      filtered = filtered.filter((w) =>
        w.skills.toLowerCase().includes(serviceType.toLowerCase())
      );
    }

    // Attach Haversine distance if lat/lng are provided
    const withDistance = filtered.map((w) => {
      let distanceKm = 2.5;
      if (!isNaN(userLat) && !isNaN(userLng)) {
        distanceKm = calculateDistanceKm(userLat, userLng, w.latitude, w.longitude);
      }
      return {
        ...w,
        distanceKm,
      };
    });

    if (!isNaN(userLat) && !isNaN(userLng)) {
      withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return NextResponse.json(withDistance, {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15",
      },
    });
  } catch (error: any) {
    console.error("Workers API GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      phone,
      avatar,
      aadhaarLast4,
      skills,
      experienceYrs,
      hourlyRate,
      societyId,
      certTitle,
      certIssuer,
    } = body;

    const trimmedName = (name || "New Co-op Member").trim();
    const safePhone = (phone || `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`).trim();
    const aadhaarMasked = `XXXX-XXXX-${aadhaarLast4 || "1029"}`;
    const digitalIdCard = `COOP-ID-${trimmedName.toUpperCase().replace(/\s+/g, "")}-${Date.now().toString().slice(-4)}-PENDING`;

    let targetSocietyId = societyId;
    if (!targetSocietyId) {
      const firstSoc = await prisma.society.findFirst();
      targetSocietyId = firstSoc?.id || "soc-mvp";
    }

    // 1. Check for ANY existing worker with this ID, phone, or name to prevent duplicates
    const existingWorkers = await prisma.worker.findMany({
      where: {
        OR: [
          ...(id ? [{ id }] : []),
          { phone: safePhone },
          { name: { equals: trimmedName, mode: "insensitive" } },
        ],
      },
      include: { society: true, certifications: true, welfareRecord: true },
      orderBy: { createdAt: "desc" },
    });

    let resultWorker;

    if (existingWorkers.length > 0) {
      const primaryWorker = existingWorkers[0];
      resultWorker = await prisma.worker.update({
        where: { id: primaryWorker.id },
        data: {
          name: trimmedName,
          phone: safePhone,
          aadhaarMasked,
          avatar: avatar || primaryWorker.avatar,
          skills: skills || primaryWorker.skills,
          experienceYrs: Number(experienceYrs) || primaryWorker.experienceYrs,
          hourlyRate: Number(hourlyRate) || primaryWorker.hourlyRate,
          status: "PENDING_VERIFICATION",
          isAvailable: false,
          digitalIdCard,
        },
        include: {
          society: true,
          certifications: true,
          welfareRecord: true,
        },
      });

      // Purge any older duplicate records with same name/phone to keep DB clean
      if (existingWorkers.length > 1) {
        const redundantIds = existingWorkers.slice(1).map((w) => w.id);
        try {
          await prisma.worker.deleteMany({
            where: { id: { in: redundantIds } },
          });
        } catch (delErr) {
          console.warn("Redundant worker cleanup:", delErr);
        }
      }
    } else {
      resultWorker = await prisma.worker.create({
        data: {
          ...(id ? { id } : {}),
          societyId: targetSocietyId,
          name: trimmedName,
          phone: safePhone,
          aadhaarMasked,
          avatar:
            avatar ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          skills: skills || "General Maintenance",
          experienceYrs: Number(experienceYrs) || 3,
          hourlyRate: Number(hourlyRate) || 450,
          rating: 5.0,
          totalJobs: 0,
          status: "PENDING_VERIFICATION",
          isAvailable: false,
          latitude: 17.7421,
          longitude: 83.3384,
          digitalIdCard,
          certifications: {
            create: [
              {
                title: certTitle || "Cooperative Skill Profiling Assessment",
                issuer: certIssuer || "National Skill Development Corporation (NSDC)",
                certNumber: `NSDC-COOP-${Date.now().toString().slice(-6)}`,
                issuedYear: new Date().getFullYear(),
                verified: false,
              },
            ],
          },
          welfareRecord: {
            create: {
              insuranceStatus: "PENDING",
              insurancePlan: "Pradhan Mantri Suraksha Bima Yojana (Cooperative Group)",
              policyNumber: `PMSBY-${Date.now().toString().slice(-6)}`,
              fundBalance: 0,
              earningsYTD: 0,
            },
          },
        },
        include: {
          society: true,
          certifications: true,
          welfareRecord: true,
        },
      });
    }

    // Invalidate cache immediately on new or updated worker
    invalidateWorkersCache();

    return NextResponse.json(resultWorker, { status: 201 });
  } catch (error: any) {
    console.error("Workers API POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
