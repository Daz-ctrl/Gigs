import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// High-speed In-Memory Cache for Bookings (3s TTL)
let cachedAllBookings: any[] | null = null;
let lastBookingsCacheTime = 0;
const CACHE_TTL_MS = 3000;

export function invalidateBookingsCache() {
  cachedAllBookings = null;
  lastBookingsCacheTime = 0;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const customerEmail = searchParams.get("customerEmail")?.toLowerCase().trim();
    const workerId = searchParams.get("workerId");
    const workerEmail = searchParams.get("workerEmail")?.toLowerCase().trim();
    const status = searchParams.get("status");

    const now = Date.now();
    let allBookings = cachedAllBookings;

    if (!allBookings || now - lastBookingsCacheTime > CACHE_TTL_MS) {
      allBookings = await prisma.booking.findMany({
        include: {
          customer: true,
          worker: true,
          rating: true,
        },
        orderBy: { scheduledAt: "desc" },
      });
      cachedAllBookings = allBookings;
      lastBookingsCacheTime = now;
    }

    // Fast in-memory filtering (0ms)
    let filtered = allBookings;
    if (customerId || customerEmail) {
      filtered = filtered.filter(
        (b) =>
          (customerId && b.customerId === customerId) ||
          (customerEmail && b.customer?.email?.toLowerCase().trim() === customerEmail)
      );
    }
    if (workerId || workerEmail) {
      filtered = filtered.filter(
        (b) =>
          (workerId && b.workerId === workerId) ||
          (workerEmail && b.worker?.email?.toLowerCase().trim() === workerEmail)
      );
    }
    if (status) filtered = filtered.filter((b) => b.status === status);

    return NextResponse.json(filtered, {
      headers: {
        "Cache-Control": "public, s-maxage=3, stale-while-revalidate=10",
      },
    });
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
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      workerId,
      serviceType,
      description,
      basePrice = 600,
      isEmergency = false,
      scheduledAt,
      latitude = 17.741,
      longitude = 83.339,
    } = body;

    // Find or create customer matching the actual logged-in user
    let targetCustId = customerId;
    if (customerId) {
      const existingCust = await prisma.customer.findFirst({
        where: {
          OR: [
            { id: customerId },
            ...(customerEmail ? [{ email: customerEmail }] : []),
          ],
        },
      });

      if (existingCust) {
        targetCustId = existingCust.id;
        if (customerName && existingCust.name !== customerName) {
          await prisma.customer.update({
            where: { id: existingCust.id },
            data: { name: customerName },
          });
        }
      } else {
        const createdCust = await prisma.customer.create({
          data: {
            id: customerId,
            name: customerName || "Citizen Customer",
            email: customerEmail || null,
            phone: customerPhone || `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
            address: customerAddress || "MVP Colony, Visakhapatnam",
            zone: "Zone 1 - MVP Colony & Beach Road",
            latitude: Number(latitude) || 17.741,
            longitude: Number(longitude) || 83.339,
          },
        });
        targetCustId = createdCust.id;
      }
    } else {
      const defaultCust = await prisma.customer.findFirst();
      targetCustId = defaultCust?.id || "cust-chaitanya";
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

    // Invalidate bookings cache immediately
    invalidateBookingsCache();

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("Bookings API POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
