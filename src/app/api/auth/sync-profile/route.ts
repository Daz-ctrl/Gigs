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
      // Look up existing Customer by id or email
      let customer = await prisma.customer.findFirst({
        where: {
          OR: [{ id }, { email: cleanEmail }],
        },
      });

      if (customer) {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: {
            name: cleanName,
            email: cleanEmail,
          },
        });
      } else {
        customer = await prisma.customer.create({
          data: {
            id,
            name: cleanName,
            phone: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            email: cleanEmail,
            address: "MVP Colony, Visakhapatnam",
            zone: "Zone 1 - MVP Colony & Beach Road",
            latitude: 17.7410,
            longitude: 83.3390,
          },
        });
      }

      return NextResponse.json({ success: true, profile: customer, role: "CUSTOMER" });
    } else if (role === "WORKER") {
      let worker = await prisma.worker.findFirst({
        where: {
          OR: [{ id }],
        },
      });

      if (worker) {
        worker = await prisma.worker.update({
          where: { id: worker.id },
          data: {
            name: cleanName,
            avatar: avatar || worker.avatar,
          },
        });
      } else {
        const firstSoc = await prisma.society.findFirst();
        worker = await prisma.worker.create({
          data: {
            id,
            societyId: firstSoc?.id || "soc-mvp",
            name: cleanName,
            phone: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            aadhaarMasked: "XXXX-XXXX-PENDING",
            avatar:
              avatar ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
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
        });
      }

      return NextResponse.json({ success: true, profile: worker, role: "WORKER" });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in sync-profile API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
