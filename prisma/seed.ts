import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CoopServe database for Visakhapatnam (Vizag) with New Artisan Personas...");

  // Clear existing data safely in sequence
  await prisma.rating.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.demandForecastLog.deleteMany({});
  await prisma.certification.deleteMany({});
  await prisma.welfareRecord.deleteMany({});
  await prisma.worker.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.society.deleteMany({});
  await prisma.federation.deleteMany({});

  // 1. Create State Federation for Andhra Pradesh (Visakhapatnam Region)
  const federation = await prisma.federation.create({
    data: {
      name: "Andhra Pradesh Labour Cooperative Federation (APLCF) · Visakhapatnam Region",
      code: "APLCF-VZG-2024",
      state: "Andhra Pradesh",
      minWageFloor: 450.0, // Minimum wage floor ₹450/hr under AP labour cooperative rules
      platformCommPct: 3.0, // 3% sustainable platform fee
      welfareCommPct: 7.0,  // 7% social security/welfare fund
    },
  });

  // 2. Create 3 Primary Cooperative Societies across Visakhapatnam (Vizag)
  const societyMVP = await prisma.society.create({
    data: {
      federationId: federation.id,
      name: "MVP Colony & Beach Sector Labour Cooperative Society Ltd.",
      registrationNo: "AP-VZG-COOP-2019-8812",
      district: "Visakhapatnam",
      zone: "Zone 1 - MVP Colony & Beach Road",
      latitude: 17.7400,
      longitude: 83.3350,
    },
  });

  const societyGajuwaka = await prisma.society.create({
    data: {
      federationId: federation.id,
      name: "Gajuwaka Industrial & Electrical Workers Cooperative Society Ltd.",
      registrationNo: "AP-VZG-COOP-2020-5541",
      district: "Visakhapatnam",
      zone: "Zone 2 - Gajuwaka & Steel Plant",
      latitude: 17.6850,
      longitude: 83.2100,
    },
  });

  const societyMadhurawada = await prisma.society.create({
    data: {
      federationId: federation.id,
      name: "Madhurawada & Rushikonda Green Trades Cooperative Society Ltd.",
      registrationNo: "AP-VZG-COOP-2021-3310",
      district: "Visakhapatnam",
      zone: "Zone 3 - Madhurawada & IT SEZ",
      latitude: 17.8050,
      longitude: 83.3550,
    },
  });

  // 3. Create 4 Verified Artisan Personas + 1 Pending Applicant

  // Persona 1: Dheeraj - AC & HVAC Specialist (MVP Colony, Vizag)
  const worker1 = await prisma.worker.create({
    data: {
      societyId: societyMVP.id,
      name: "Dheeraj",
      phone: "+91 98188 99001",
      aadhaarMasked: "XXXX-XXXX-7703",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      skills: "AC Technician,HVAC Specialist,Air Cooler & Refrigerator Repair",
      experienceYrs: 8,
      hourlyRate: 550,
      rating: 4.9,
      totalJobs: 142,
      status: "VERIFIED",
      isAvailable: true,
      latitude: 17.7421,
      longitude: 83.3384,
      digitalIdCard: "COOP-ID-DHEERAJ-AC-VZG-7703-VERIFIED",
      certifications: {
        create: [
          {
            title: "HVAC & Commercial Refrigeration Specialist",
            issuer: "NSDC - Electronics Sector Skills Council",
            certNumber: "ESSCI-HVAC-2019-8911",
            issuedYear: 2019,
            verified: true,
          },
          {
            title: "Inverter AC Diagnostic & Energy Star Auditor",
            issuer: "Skill Council for Green Jobs (SCGJ)",
            certNumber: "SCGJ-AC-2021-4402",
            issuedYear: 2021,
            verified: true,
          },
        ],
      },
      welfareRecord: {
        create: {
          insuranceStatus: "ACTIVE",
          insurancePlan: "Pradhan Mantri Suraksha Bima Yojana + Co-op Medical Shield",
          policyNumber: "PMSBY-COOP-AP-VZG-77030",
          fundBalance: 8450.0,
          earningsYTD: 104500.0,
        },
      },
    },
  });

  // Persona 2: Vaman - Master Plumber (Gajuwaka Industrial Belt, Vizag)
  const worker2 = await prisma.worker.create({
    data: {
      societyId: societyGajuwaka.id,
      name: "Vaman",
      phone: "+91 98711 55667",
      aadhaarMasked: "XXXX-XXXX-4412",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      skills: "Plumber,Sanitary Fitting,Water Purifier Specialist,Pipefitting",
      experienceYrs: 7,
      hourlyRate: 480,
      rating: 4.85,
      totalJobs: 118,
      status: "VERIFIED",
      isAvailable: true,
      latitude: 17.6870,
      longitude: 83.2120,
      digitalIdCard: "COOP-ID-VAMAN-PLM-VZG-4412-VERIFIED",
      certifications: {
        create: [
          {
            title: "ITI Plumber Certification (Gold Grade)",
            issuer: "Govt Industrial Training Institute (ITI) Visakhapatnam",
            certNumber: "ITI-AP-VZG-PLM-2018-502",
            issuedYear: 2018,
            verified: true,
          },
        ],
      },
      welfareRecord: {
        create: {
          insuranceStatus: "ACTIVE",
          insurancePlan: "Pradhan Mantri Jeevan Jyoti Bima Yojana",
          policyNumber: "PMJJBY-COOP-AP-VZG-44819",
          fundBalance: 5600.0,
          earningsYTD: 78400.0,
        },
      },
    },
  });

  // Persona 3: Mohan - Master Carpenter (Madhurawada & IT SEZ, Vizag)
  const worker3 = await prisma.worker.create({
    data: {
      societyId: societyMadhurawada.id,
      name: "Mohan",
      phone: "+91 98112 99881",
      aadhaarMasked: "XXXX-XXXX-9082",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      skills: "Carpenter,Woodwork Artisan,Modular Furniture Fitting,Door & Window Locks",
      experienceYrs: 9,
      hourlyRate: 520,
      rating: 4.92,
      totalJobs: 164,
      status: "VERIFIED",
      isAvailable: true,
      latitude: 17.8060,
      longitude: 83.3520,
      digitalIdCard: "COOP-ID-MOHAN-CRP-VZG-9082-VERIFIED",
      certifications: {
        create: [
          {
            title: "Furniture & Fittings Skill Council Master Joiner",
            issuer: "FFSC India",
            certNumber: "FFSC-CRP-2017-9104",
            issuedYear: 2017,
            verified: true,
          },
        ],
      },
      welfareRecord: {
        create: {
          insuranceStatus: "ACTIVE",
          insurancePlan: "Cooperative Workers Group Accidental Cover",
          policyNumber: "CWGAC-AP-VZG-908201",
          fundBalance: 7800.0,
          earningsYTD: 98600.0,
        },
      },
    },
  });

  // Persona 4: Hanish - Certified Care Taker & Elder Nurse (MVP & Waltair, Vizag)
  const worker4 = await prisma.worker.create({
    data: {
      societyId: societyMVP.id,
      name: "Hanish",
      phone: "+91 99100 88234",
      aadhaarMasked: "XXXX-XXXX-3319",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      skills: "Caregiver,Care Taker,Elderly Care,Patient Assistance & Nursing Aide",
      experienceYrs: 6,
      hourlyRate: 600,
      rating: 5.0,
      totalJobs: 86,
      status: "VERIFIED",
      isAvailable: true,
      latitude: 17.7380,
      longitude: 83.3340,
      digitalIdCard: "COOP-ID-HANISH-CARE-VZG-3319-VERIFIED",
      certifications: {
        create: [
          {
            title: "Healthcare Sector Skill Council - Geriatric Care Aide",
            issuer: "HSSC India",
            certNumber: "HSSC-GCA-2020-1922",
            issuedYear: 2020,
            verified: true,
          },
        ],
      },
      welfareRecord: {
        create: {
          insuranceStatus: "ACTIVE",
          insurancePlan: "Ayushman Bharat PM-JAY Co-op Affiliated Plan",
          policyNumber: "AB-COOP-AP-VZG-11094",
          fundBalance: 6900.0,
          earningsYTD: 84500.0,
        },
      },
    },
  });

  // Persona 5: Deepak Yadav - Applicant for admin verification queue demo
  await prisma.worker.create({
    data: {
      societyId: societyGajuwaka.id,
      name: "Deepak Yadav",
      phone: "+91 97112 00981",
      aadhaarMasked: "XXXX-XXXX-9021",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      skills: "Carpenter,Furniture Assembly,Modular Kitchen Fitting",
      experienceYrs: 4,
      hourlyRate: 480,
      rating: 5.0,
      totalJobs: 0,
      status: "PENDING_VERIFICATION",
      isAvailable: false,
      latitude: 17.6910,
      longitude: 83.2140,
      digitalIdCard: "COOP-ID-DEEPAK-AP-PENDING",
      certifications: {
        create: [
          {
            title: "ITI Carpentry & Joinery Trade Certificate",
            issuer: "Govt ITI Visakhapatnam",
            certNumber: "ITI-AP-VZG-CRP-2021-884",
            issuedYear: 2021,
            verified: false,
          },
        ],
      },
      welfareRecord: {
        create: {
          insuranceStatus: "PENDING",
          insurancePlan: "Enrollment in PMSBY upon verification",
          policyNumber: "PENDING-APPROVAL",
          fundBalance: 0.0,
          earningsYTD: 0.0,
        },
      },
    },
  });

  // 4. Create Customers in Visakhapatnam
  const customer1 = await prisma.customer.create({
    data: {
      name: "Kameswara Surya",
      phone: "+91 98990 88776",
      email: "Kameswara.surya@gmail.com",
      address: "Flat 402, Sea Breeze Enclave, Sector 3, MVP Colony, Visakhapatnam - 530017",
      zone: "Zone 1 - MVP Colony & Beach Road",
      latitude: 17.7410,
      longitude: 83.3390,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "Chaitanya Varma",
      phone: "+91 98101 22334",
      email: "Chaitanya.varma@gmail.com",
      address: "Plot 88, Green Valley Layout, Gajuwaka, Visakhapatnam - 530026",
      zone: "Zone 2 - Gajuwaka & Steel Plant",
      latitude: 17.6860,
      longitude: 83.2080,
    },
  });

  // 5. Create Sample Completed Bookings with 90/7/3 Split & Ratings

  // Booking 1: Dheeraj (AC Service) - 5 Stars
  await prisma.booking.create({
    data: {
      customerId: customer1.id,
      workerId: worker1.id,
      serviceType: "AC Technician",
      description: "Air conditioner high-pressure jet cleaning and refrigerant level diagnostic in MVP Colony",
      status: "COMPLETED",
      isEmergency: false,
      scheduledAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      basePrice: 650.0,
      workerPayout: 585.0, // 90% direct payout
      welfareFee: 45.5,    // 7% co-op welfare fund
      platformFee: 19.5,   // 3% tech maintenance
      paymentStatus: "PAID",
      paymentMethod: "UPI_SANDBOX",
      latitude: 17.7410,
      longitude: 83.3390,
      rating: {
        create: {
          score: 5,
          feedback: "Dheeraj arrived punctually at MVP Colony, showed his digital cooperative QR ID, and serviced the AC thoroughly. Excellent fair pricing!",
          tags: "Punctual,Cooperative Verified,Fair Price,Knowledgeable",
          flagged: false,
        },
      },
    },
  });

  // Booking 2: Vaman (Emergency Plumbing) - 5 Stars
  await prisma.booking.create({
    data: {
      customerId: customer2.id,
      workerId: worker2.id,
      serviceType: "Plumber",
      description: "Kitchen under-sink RO filter connector burst leak",
      status: "COMPLETED",
      isEmergency: true,
      scheduledAt: new Date(Date.now() - 86400000), // Yesterday
      basePrice: 500.0,
      workerPayout: 450.0, // 90%
      welfareFee: 35.0,    // 7%
      platformFee: 15.0,   // 3%
      paymentStatus: "PAID",
      paymentMethod: "UPI_SANDBOX",
      latitude: 17.6860,
      longitude: 83.2080,
      rating: {
        create: {
          score: 5,
          feedback: "Emergency plumbing response within 20 minutes in Gajuwaka. No surge extortion, transparent cooperative rate.",
          tags: "Fast Response,Transparent,Fair Price",
          flagged: false,
        },
      },
    },
  });

  // Booking 3: Mohan (1-Star Rating Incident for Alert Review Demonstration)
  await prisma.booking.create({
    data: {
      customerId: customer1.id,
      workerId: worker3.id,
      serviceType: "Carpenter",
      description: "Custom teakwood door hinge alignment and lock fitting in MVP Colony",
      status: "COMPLETED",
      isEmergency: false,
      scheduledAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
      basePrice: 650.0,
      workerPayout: 585.0,
      welfareFee: 45.5,
      platformFee: 19.5,
      paymentStatus: "PAID",
      paymentMethod: "UPI_SANDBOX",
      latitude: 17.7410,
      longitude: 83.3390,
      rating: {
        create: {
          score: 1,
          feedback: "Arrived 45 minutes late to MVP Colony without calling in advance. Fixed the lock but left wood shavings and dust on the entrance floor.",
          flagged: true,
          noticeSent: false,
          workerAcknowledged: false,
          adminStatus: "PENDING",
        },
      },
    },
  });

  // Booking 4: Hanish (In-Progress Caregiver Booking in MVP Colony)
  await prisma.booking.create({
    data: {
      customerId: customer1.id,
      workerId: worker4.id,
      serviceType: "Caregiver",
      description: "4-hour elder care assistance and vitals monitoring in MVP Colony",
      status: "IN_PROGRESS",
      isEmergency: false,
      scheduledAt: new Date(Date.now() + 3600000), // Today in 1 hr
      basePrice: 700.0,
      workerPayout: 630.0,
      welfareFee: 49.0,
      platformFee: 21.0,
      paymentStatus: "PAID",
      paymentMethod: "UPI_SANDBOX",
      latitude: 17.7410,
      longitude: 83.3390,
    },
  });

  // 6. Pre-populate Forecast Log Data (FR11) for Visakhapatnam
  await prisma.demandForecastLog.createMany({
    data: [
      {
        zone: "Zone 2 - Gajuwaka & Steel Plant",
        serviceType: "Plumber",
        predictedDemand: 18,
        availableSupply: 6,
        deficitSurplus: -12,
        confidenceScore: 0.95,
        recommendation: "High coastal monsoon drainage backlog in Gajuwaka. Recommend redeploying verified plumbers from MVP Colony to Gajuwaka.",
      },
      {
        zone: "Zone 1 - MVP Colony & Beach Road",
        serviceType: "AC Technician",
        predictedDemand: 26,
        availableSupply: 14,
        deficitSurplus: -12,
        confidenceScore: 0.94,
        recommendation: "Upcoming coastal heatwave in MVP Colony & Waltair Uplands. Alert off-duty AC technicians with ₹150 incentive grant.",
      },
      {
        zone: "Zone 3 - Madhurawada & IT SEZ",
        serviceType: "Caregiver",
        predictedDemand: 10,
        availableSupply: 11,
        deficitSurplus: 1,
        confidenceScore: 0.88,
        recommendation: "Balanced demand & supply in Rushikonda & Madhurawada. Standard shift rotation recommended.",
      },
    ],
  });

  console.log("✅ Seed completed successfully for Visakhapatnam with New Personas!");
  console.log(`- Federation: ${federation.name}`);
  console.log(`- 3 Societies in Visakhapatnam (MVP Colony, Gajuwaka, Madhurawada)`);
  console.log(`- 4 Verified Artisans: Dheeraj (AC), Vaman (Plumber), Mohan (Carpenter), Hanish (Care Taker)`);
  console.log(`- 1 Pending Applicant: Deepak Yadav (Carpenter)`);
  console.log(`- Customer: Kameswara Surya (MVP Colony)`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
