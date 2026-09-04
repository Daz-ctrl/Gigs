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
      // Look up existing worker by id, email, or name
      let worker = await prisma.worker.findFirst({
        where: {
          OR: [
            { id },
            ...(cleanEmail ? [{ email: cleanEmail }] : []),
            { name: { equals: cleanName, mode: "insensitive" } },
          ],
        },
      });

      if (worker) {
        worker = await prisma.worker.update({
          where: { id: worker.id },
          data: {
            name: cleanName,
            ...(cleanEmail ? { email: cleanEmail } : {}),
            avatar: avatar || worker.avatar,
          },
        });
        return NextResponse.json({ success: true, profile: worker, role: "WORKER" });
      }

      // DO NOT create a dummy worker in the database here!
      // Workers are officially created when they submit their e-KYC on /worker/register.
      // This eliminates duplicate OAuth entries in the Admin Verification Queue.
      return NextResponse.json({
        success: true,
        message: "Worker profile authenticated. Ready for e-KYC registration.",
        role: "WORKER",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in sync-profile API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
