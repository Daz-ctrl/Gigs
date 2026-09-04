import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invalidateWorkersCache } from "@/app/api/workers/route";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const worker = await prisma.worker.findUnique({
      where: { id },
      include: {
        society: {
          include: {
            federation: true,
          },
        },
        certifications: true,
        welfareRecord: true,
      },
    });

    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    return NextResponse.json(worker);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, isAvailable } = body;

    const updateData: any = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === "VERIFIED") {
        updateData.digitalIdCard = `COOP-ID-VERIFIED-${Date.now().toString().slice(-6)}`;
        if (isAvailable === undefined) {
          updateData.isAvailable = true;
        }
      }
    }
    if (isAvailable !== undefined) {
      updateData.isAvailable = isAvailable;
    }

    const updatedWorker = await prisma.worker.update({
      where: { id },
      data: updateData,
      include: {
        society: true,
        certifications: true,
        welfareRecord: true,
      },
    });

    // Also verify certifications if worker is verified
    if (status === "VERIFIED") {
      await prisma.certification.updateMany({
        where: { workerId: id },
        data: { verified: true },
      });
      if (updatedWorker.welfareRecord) {
        await prisma.welfareRecord.update({
          where: { id: updatedWorker.welfareRecord.id },
          data: { insuranceStatus: "ACTIVE" },
        });
      }
    }

    // Invalidate in-memory cache
    invalidateWorkersCache();

    return NextResponse.json(updatedWorker);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const worker = await prisma.worker.findUnique({
      where: { id },
    });

    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    // Set workerId to null for any existing bookings to preserve booking history
    await prisma.booking.updateMany({
      where: { workerId: id },
      data: { workerId: null },
    });

    // Delete certifications & welfare record if not fully cascaded
    await prisma.certification.deleteMany({
      where: { workerId: id },
    });
    await prisma.welfareRecord.deleteMany({
      where: { workerId: id },
    });

    // Delete the worker record
    await prisma.worker.delete({
      where: { id },
    });

    // Invalidate workers in-memory cache immediately
    invalidateWorkersCache();

    return NextResponse.json({ success: true, message: `Worker ${worker.name} deleted successfully` });
  } catch (error: any) {
    console.error("Error deleting worker:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

