import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const workerId = searchParams.get("workerId");
    const status = searchParams.get("status");

    const whereClause: any = {};
    if (customerId) whereClause.customerId = customerId;
    if (workerId) whereClause.workerId = workerId;
    if (status) whereClause.status = status;

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        customer: true,
        worker: true,
        rating: true,
      },
      orderBy: { scheduledAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Bookings API GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerId,
      workerId,
      serviceType,
      description,
      basePrice = 600,
      isEmergency = false,
      scheduledAt,
      latitude = 28.543,
      longitude = 77.2405,
    } = body;

    // Find default customer if not provided
    let targetCustId = customerId;
    if (!targetCustId) {
      const defaultCust = await prisma.customer.findFirst();
      targetCustId = defaultCust?.id || "";
    }

    const price = Number(basePrice);
    // Signature Cooperative Fairness 90 / 7 / 3 split
    const workerPayout = Math.round(price * 0.9);
    const welfareFee = Math.round(price * 0.07);
    const platformFee = Math.round(price * 0.03);

    const startWorkOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const booking = await prisma.booking.create({
      data: {
        customerId: targetCustId,
        workerId: workerId || null,
        serviceType,
        description: description || `Certified Cooperative ${serviceType} Service`,
        status: "ACCEPTED", // Accepted immediately for smooth demo
        isEmergency: Boolean(isEmergency),
        startWorkOtp,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
        basePrice: price,
        workerPayout,
        welfareFee,
        platformFee,
        paymentStatus: "PAID",
        paymentMethod: "UPI_SANDBOX",
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      include: {
        customer: true,
        worker: true,
        rating: true,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("Bookings API POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
