import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email, name, avatar, role } = body;

    if (!id || !role) {
      return NextResponse.json(
        { error: "Missing required fields (id, role)" },
        { status: 400 }
      );
    }

    const cleanEmail = email || `${id}@sahakar.gov.in`;
    const cleanName = name || (role === "WORKER" ? "Co-op Worker" : "Citizen Customer");

    if (role === "CUSTOMER") {
      // 1. Ensure Customer record exists in Database
      const customer = await prisma.customer.upsert({
        where: { id },
        update: {
          name: cleanName,
          email: cleanEmail,
        },
        create: {
          id,
          name: cleanName,
          phone: cleanEmail,
          email: cleanEmail,
          address: "MVP Colony, Visakhapatnam",
          zone: "Zone 1 - MVP Colony & Beach Road",
          latitude: 17.7410,
          longitude: 83.3390,
        },
      });

      return NextResponse.json({ success: true, profile: customer, role: "CUSTOMER" });
    } else if (role === "WORKER") {
      // 2. Ensure Worker record exists in Database
      const firstSoc = await prisma.society.findFirst();
      const societyId = firstSoc?.id || "soc-mvp";

      const worker = await prisma.worker.upsert({
        where: { id },
        update: {
          name: cleanName,
          avatar: avatar || null,
        },
        create: {
          id,
          societyId,
          name: cleanName,
          phone: cleanEmail,
          aadhaarMasked: "XXXX-XXXX-PENDING",
          avatar: avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          skills: "General Repairs,Maintenance",
          experienceYrs: 3,
          hourlyRate: 500,
          status: "PENDING_VERIFICATION",
          isAvailable: false,
          latitude: 17.7421,
          longitude: 83.3384,
          digitalIdCard: `COOP-ID-${cleanName.toUpperCase().replace(/\s+/g, "")}-PENDING`,
          certifications: {
            create: [
              {
                title: "Cooperative Onboarding Assessment",
                issuer: "Labour Cooperative Society",
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
              policyNumber: "PENDING-APPROVAL",
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

      return NextResponse.json({ success: true, profile: worker, role: "WORKER" });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in sync-profile API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
