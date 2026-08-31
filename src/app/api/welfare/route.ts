import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workerId = searchParams.get("workerId");

    if (workerId) {
      const record = await prisma.welfareRecord.findUnique({
        where: { workerId },
        include: { worker: true },
      });
      return NextResponse.json(record);
    }

    // Aggregate statistics for Federation Admin
    const allRecords = await prisma.welfareRecord.findMany();
    const totalWelfareCapital = allRecords.reduce(
      (sum, r) => sum + r.fundBalance,
      0
    );
    const totalEarningsDisbursed = allRecords.reduce(
      (sum, r) => sum + r.earningsYTD,
      0
    );
    const activeInsuredWorkers = allRecords.filter(
      (r) => r.insuranceStatus === "ACTIVE"
    ).length;

    return NextResponse.json({
      totalWelfareCapital,
      totalEarningsDisbursed,
      activeInsuredWorkers,
      schemeName: "Pradhan Mantri Suraksha Bima Yojana (Co-op Group)",
      guaranteePartner: "National Labour Cooperative Federation of India",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workerId, insurancePlan } = body;

    const policyNumber = `PMSBY-COOP-ACT-${Date.now().toString().slice(-7)}`;

    const updated = await prisma.welfareRecord.upsert({
      where: { workerId },
      update: {
        insuranceStatus: "ACTIVE",
        insurancePlan:
          insurancePlan ||
          "Pradhan Mantri Suraksha Bima Yojana (Cooperative Group)",
        policyNumber,
      },
      create: {
        workerId,
        insuranceStatus: "ACTIVE",
        insurancePlan:
          insurancePlan ||
          "Pradhan Mantri Suraksha Bima Yojana (Cooperative Group)",
        policyNumber,
        fundBalance: 3500.0,
        earningsYTD: 12000.0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Worker successfully enrolled into cooperative group insurance.",
      policyNumber,
      welfareRecord: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
