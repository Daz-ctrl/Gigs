import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDistanceKm } from "@/lib/geo";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceType = searchParams.get("serviceType");
    const zone = searchParams.get("zone");
    const status = searchParams.get("status") || "VERIFIED";
    const available = searchParams.get("available");
    const userLat = parseFloat(searchParams.get("lat") || "");
    const userLng = parseFloat(searchParams.get("lng") || "");

    const whereClause: any = {};
    if (status !== "ALL") {
      if (status === "PENDING" || status === "PENDING_VERIFICATION") {
        whereClause.status = { in: ["PENDING", "PENDING_VERIFICATION"] };
      } else {
        whereClause.status = status;
      }
    }
    if (available === "true") {
      whereClause.isAvailable = true;
    } else if (available === "false") {
      whereClause.isAvailable = false;
    }
    if (zone && zone !== "ALL") {
      whereClause.society = { zone };
    }

    const workers = await prisma.worker.findMany({
      where: whereClause,
      include: {
        society: true,
        certifications: true,
        welfareRecord: true,
      },
      orderBy: { rating: "desc" },
    });

    let filtered = workers;

    if (serviceType && serviceType !== "ALL") {
      filtered = filtered.filter((w) =>
        w.skills.toLowerCase().includes(serviceType.toLowerCase())
      );
    }

    // Attach Haversine distance if lat/lng are provided
    const withDistance = filtered.map((w) => {
      let distanceKm = 2.5; // default reasonable distance
      if (!isNaN(userLat) && !isNaN(userLng)) {
        distanceKm = calculateDistanceKm(userLat, userLng, w.latitude, w.longitude);
      }
      return {
        ...w,
        distanceKm,
      };
    });

    // Sort by proximity if coordinates available, otherwise by rating
    if (!isNaN(userLat) && !isNaN(userLng)) {
      withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return NextResponse.json(withDistance);
  } catch (error: any) {
    console.error("Workers API GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      aadhaarLast4,
      skills,
      experienceYrs,
      hourlyRate,
      societyId,
      certTitle,
      certIssuer,
    } = body;

    // Mask Aadhaar: "XXXX-XXXX-" + last4
    const aadhaarMasked = `XXXX-XXXX-${aadhaarLast4 || "1029"}`;
    const digitalIdCard = `COOP-ID-${(name || "WORKER").toUpperCase().replace(/\s+/g, "")}-${Date.now().toString().slice(-4)}-PENDING`;

    // Find default society if not specified
    let targetSocietyId = societyId;
    if (!targetSocietyId) {
      const firstSoc = await prisma.society.findFirst();
      targetSocietyId = firstSoc?.id || "";
    }

    const newWorker = await prisma.worker.create({
      data: {
        societyId: targetSocietyId,
        name,
        phone,
        aadhaarMasked,
        skills,
        experienceYrs: Number(experienceYrs) || 3,
        hourlyRate: Number(hourlyRate) || 450,
        rating: 5.0,
        totalJobs: 0,
        status: "PENDING_VERIFICATION", // Visible in Sector Admin verification queue
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
            policyNumber: `PMSBY-PENDING-${Date.now().toString().slice(-5)}`,
            fundBalance: 1000.0, // Welcome seed grant from federation
            earningsYTD: 0.0,
          },
        },
      },
      include: {
        society: true,
        certifications: true,
        welfareRecord: true,
      },
    });

    return NextResponse.json(newWorker, { status: 201 });
  } catch (error: any) {
    console.error("Workers API POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
