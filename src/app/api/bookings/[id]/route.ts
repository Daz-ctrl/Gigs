import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, action, startWorkOtp } = body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { worker: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify Start-Work Security Handshake OTP
    if (action === "start_work") {
      const cleanInput = (startWorkOtp || "").toString().trim();
      const actualOtp = (booking.startWorkOtp || "8341").toString().trim();

      if (cleanInput !== actualOtp) {
        return NextResponse.json(
          { error: `Incorrect Start-Work OTP (${cleanInput}). Please ask the customer for their 4-digit code.` },
          { status: 400 }
        );
      }

      const startedBooking = await prisma.booking.update({
        where: { id },
        data: {
          status: "IN_PROGRESS",
          startedAt: new Date(),
        },
        include: {
          customer: true,
          worker: true,
          rating: true,
        },
      });

      return NextResponse.json(startedBooking);
    }

    const updatePayload: any = {};
    if (status) {
      updatePayload.status = status;
      if (status === "COMPLETED") {
        updatePayload.completedAt = new Date();
      }
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: updatePayload,
      include: {
        customer: true,
        worker: true,
        rating: true,
      },
    });

    // If marked COMPLETED, update worker total jobs and credit welfare fund
    if (status === "COMPLETED" && booking.workerId) {
      await prisma.worker.update({
        where: { id: booking.workerId },
        data: {
          totalJobs: { increment: 1 },
        },
      });

      // Update welfare fund record
      const welfare = await prisma.welfareRecord.findUnique({
        where: { workerId: booking.workerId },
      });
      if (welfare) {
        await prisma.welfareRecord.update({
          where: { id: welfare.id },
          data: {
            fundBalance: { increment: booking.welfareFee },
            earningsYTD: { increment: booking.workerPayout },
          },
        });
      }
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
