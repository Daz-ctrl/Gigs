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
    const { status, isAvailable, avatar, name, skills, phone } = body;

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
    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }
    if (name !== undefined) {
      updateData.name = name;
    }
    if (skills !== undefined) {
      updateData.skills = skills;
    }
    if (phone !== undefined) {
      updateData.phone = phone;
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

      // Sync Supabase auth metadata so worker's Google account stays permanently verified
      try {
        const sbSuffix = id.startsWith("sb-") ? id.replace("sb-", "") : "";
        const workerEmail = updatedWorker.email || "";
        const cleanPhone = (updatedWorker.phone || "").replace(/[^0-9]/g, "");

        await prisma.$executeRawUnsafe(`
          UPDATE auth.users
          SET raw_user_meta_data = raw_user_meta_data || '{"profile_completed": true, "role": "WORKER"}'::jsonb
          WHERE ($1 != '' AND email ILIKE $1)
             OR ($2 != '' AND id::text LIKE '%' || $2)
             OR (raw_user_meta_data->>'name' ILIKE $3)
             OR ($4 != '' AND (phone LIKE '%' || $4 OR raw_user_meta_data->>'phone' LIKE '%' || $4));
        `, workerEmail, sbSuffix, updatedWorker.name, cleanPhone);
      } catch (authSyncErr) {
        console.warn("Non-fatal Supabase metadata sync on verify:", authSyncErr);
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

    // Also automatically purge from Supabase Auth (auth.users and profiles) so the admin doesn't have to manually delete in Supabase dashboard
    try {
      const sbSuffix = id.startsWith("sb-") ? id.replace("sb-", "") : "";
      const cleanPhone = (worker.phone || "").replace(/[^0-9]/g, "");

      // Delete from profiles if table exists
      try {
        await prisma.$executeRawUnsafe(`
          DELETE FROM public.profiles 
          WHERE (name ILIKE $1)
             OR ($2 != '' AND id::text LIKE '%' || $2)
        `, worker.name, sbSuffix);
      } catch (pErr) {}

      // Delete from auth.users (cascades identities, sessions, refresh tokens)
      await prisma.$executeRawUnsafe(`
        DELETE FROM auth.users 
        WHERE (raw_user_meta_data->>'name' ILIKE $1)
           OR (raw_user_meta_data->>'full_name' ILIKE $1)
           OR (email ILIKE $1)
           OR ($2 != '' AND id::text LIKE '%' || $2)
           OR ($3 != '' AND phone LIKE '%' || $3)
           OR ($3 != '' AND raw_user_meta_data->>'phone' LIKE '%' || $3)
      `, worker.name, sbSuffix, cleanPhone);
    } catch (authErr) {
      console.warn("Non-fatal Supabase auth.users delete:", authErr);
    }

    // Invalidate workers in-memory cache immediately
    invalidateWorkersCache();

    return NextResponse.json({ success: true, message: `Worker ${worker.name} and authentication profile deleted successfully` });
  } catch (error: any) {
    console.error("Error deleting worker:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

