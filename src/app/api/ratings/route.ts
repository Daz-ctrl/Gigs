import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const flaggedOnly = searchParams.get("flagged") === "true";
    const workerId = searchParams.get("workerId");
    const adminStatus = searchParams.get("status");

    const where: any = {};
    if (flaggedOnly) {
      where.flagged = true;
    }
    if (workerId) {
      where.booking = { workerId };
    }
    if (adminStatus) {
      where.adminStatus = adminStatus;
    }

    const ratings = await prisma.rating.findMany({
      where,
      include: {
        booking: {
          include: {
            worker: true,
            customer: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(ratings);
  } catch (error: any) {
    console.error("Ratings API GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, score, feedback, tags } = body;

    const numScore = Math.max(1, Math.min(5, Number(score) || 5));
    // Low rating flag threshold (<= 2 stars triggers admin audit per FR6)
    const isFlagged = numScore <= 2;

    const rating = await prisma.rating.create({
      data: {
        bookingId,
        score: numScore,
        feedback: feedback || "Verified cooperative service completed.",
        tags: tags || "Punctual,Fair Price",
        flagged: isFlagged,
        adminStatus: isFlagged ? "PENDING" : "RESOLVED",
      },
      include: {
        booking: {
          include: { worker: true, customer: true },
        },
      },
    });

    // Update worker's average rating
    const workerId = rating.booking.workerId;
    if (workerId) {
      const allWorkerRatings = await prisma.rating.findMany({
        where: {
          booking: { workerId },
        },
      });

      if (allWorkerRatings.length > 0) {
        const avg =
          allWorkerRatings.reduce((sum, r) => sum + r.score, 0) /
          allWorkerRatings.length;
        await prisma.worker.update({
          where: { id: workerId },
          data: { rating: Math.round(avg * 10) / 10 },
        });
      }
    }

    return NextResponse.json(rating, { status: 201 });
  } catch (error: any) {
    console.error("Ratings API POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      flagged,
      noticeSent,
      noticeSentAt,
      workerAcknowledged,
      acknowledgedAt,
      adminStatus,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Rating ID is required." }, { status: 400 });
    }

    const updateData: any = {};
    if (flagged !== undefined) updateData.flagged = Boolean(flagged);
    if (noticeSent !== undefined) {
      updateData.noticeSent = Boolean(noticeSent);
      if (noticeSent) {
        updateData.noticeSentAt = noticeSentAt ? new Date(noticeSentAt) : new Date();
        if (!adminStatus) updateData.adminStatus = "NOTICE_SENT";
      }
    }
    if (workerAcknowledged !== undefined) {
      updateData.workerAcknowledged = Boolean(workerAcknowledged);
      if (workerAcknowledged) {
        updateData.acknowledgedAt = acknowledgedAt ? new Date(acknowledgedAt) : new Date();
      }
    }
    if (adminStatus !== undefined) updateData.adminStatus = String(adminStatus);

    const updated = await prisma.rating.update({
      where: { id },
      data: updateData,
      include: {
        booking: {
          include: { worker: true, customer: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Ratings API PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
