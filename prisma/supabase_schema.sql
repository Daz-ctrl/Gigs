-- =====================================================================
-- SAHAKAR KARMAKAR (सहकार कर्मकार) — SUPABASE POSTGRESQL INITIAL SCHEMA
-- Paste this entire script into your Supabase SQL Editor and click "Run"
-- =====================================================================

-- 1. Create Tables matching Prisma Schema exactly

-- Federation Table
CREATE TABLE IF NOT EXISTS "Federation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL UNIQUE,
    "state" TEXT NOT NULL,
    "minWageFloor" DOUBLE PRECISION NOT NULL DEFAULT 450.0,
    "platformCommPct" DOUBLE PRECISION NOT NULL DEFAULT 3.0,
    "welfareCommPct" DOUBLE PRECISION NOT NULL DEFAULT 7.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Society Table
CREATE TABLE IF NOT EXISTS "Society" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "federationId" TEXT NOT NULL REFERENCES "Federation"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "name" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL UNIQUE,
    "district" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Worker Table
CREATE TABLE IF NOT EXISTS "Worker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "societyId" TEXT NOT NULL REFERENCES "Society"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL UNIQUE,
    "aadhaarMasked" TEXT NOT NULL,
    "avatar" TEXT,
    "skills" TEXT NOT NULL,
    "experienceYrs" INTEGER NOT NULL,
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "totalJobs" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'VERIFIED',
    "isAvailable" BOOLEAN NOT NULL DEFAULT TRUE,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "digitalIdCard" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Certification Table
CREATE TABLE IF NOT EXISTS "Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workerId" TEXT NOT NULL REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "certNumber" TEXT NOT NULL,
    "issuedYear" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Customer Table
CREATE TABLE IF NOT EXISTS "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL UNIQUE,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Booking Table
CREATE TABLE IF NOT EXISTS "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "workerId" TEXT REFERENCES "Worker"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "serviceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACCEPTED',
    "isEmergency" BOOLEAN NOT NULL DEFAULT FALSE,
    "startWorkOtp" TEXT NOT NULL DEFAULT '8341',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "workerPayout" DOUBLE PRECISION NOT NULL,
    "welfareFee" DOUBLE PRECISION NOT NULL,
    "platformFee" DOUBLE PRECISION NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PAID',
    "paymentMethod" TEXT NOT NULL DEFAULT 'UPI_SANDBOX',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Rating Table
CREATE TABLE IF NOT EXISTS "Rating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL UNIQUE REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "score" INTEGER NOT NULL,
    "feedback" TEXT,
    "tags" TEXT,
    "flagged" BOOLEAN NOT NULL DEFAULT FALSE,
    "noticeSent" BOOLEAN NOT NULL DEFAULT FALSE,
    "noticeSentAt" TIMESTAMP(3),
    "workerAcknowledged" BOOLEAN NOT NULL DEFAULT FALSE,
    "acknowledgedAt" TIMESTAMP(3),
    "adminStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- WelfareRecord Table
CREATE TABLE IF NOT EXISTS "WelfareRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workerId" TEXT NOT NULL UNIQUE REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "insuranceStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "insurancePlan" TEXT NOT NULL DEFAULT 'Pradhan Mantri Suraksha Bima Yojana (Cooperative Group)',
    "policyNumber" TEXT NOT NULL DEFAULT 'PMSBY-COOP-8849102',
    "fundBalance" DOUBLE PRECISION NOT NULL DEFAULT 4850.0,
    "earningsYTD" DOUBLE PRECISION NOT NULL DEFAULT 64200.0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- DemandForecastLog Table
CREATE TABLE IF NOT EXISTS "DemandForecastLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "zone" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "predictedDemand" INTEGER NOT NULL,
    "availableSupply" INTEGER NOT NULL,
    "deficitSurplus" INTEGER NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "recommendation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create High-Performance Indexes
CREATE INDEX IF NOT EXISTS "idx_society_federation" ON "Society"("federationId");
CREATE INDEX IF NOT EXISTS "idx_worker_society" ON "Worker"("societyId");
CREATE INDEX IF NOT EXISTS "idx_worker_status" ON "Worker"("status");
CREATE INDEX IF NOT EXISTS "idx_certification_worker" ON "Certification"("workerId");
CREATE INDEX IF NOT EXISTS "idx_booking_customer" ON "Booking"("customerId");
CREATE INDEX IF NOT EXISTS "idx_booking_worker" ON "Booking"("workerId");
CREATE INDEX IF NOT EXISTS "idx_booking_status" ON "Booking"("status");
CREATE INDEX IF NOT EXISTS "idx_rating_booking" ON "Rating"("bookingId");

-- 3. Seed Essential Demo Data (Andhra Pradesh · Visakhapatnam)

-- Federation
INSERT INTO "Federation" ("id", "name", "code", "state", "minWageFloor", "platformCommPct", "welfareCommPct", "createdAt", "updatedAt")
VALUES (
    'fed-ap-vzg',
    'Andhra Pradesh Labour Cooperative Federation (APLCF) · Visakhapatnam Region',
    'APLCF-VZG-2024',
    'Andhra Pradesh',
    450.0,
    3.0,
    7.0,
    NOW(),
    NOW()
) ON CONFLICT ("code") DO NOTHING;

-- Primary Societies
INSERT INTO "Society" ("id", "federationId", "name", "registrationNo", "district", "zone", "latitude", "longitude", "createdAt", "updatedAt")
VALUES 
    ('soc-mvp', 'fed-ap-vzg', 'MVP Colony & Beach Sector Labour Cooperative Society Ltd.', 'AP-VZG-COOP-2019-8812', 'Visakhapatnam', 'Zone 1 - MVP Colony & Beach Road', 17.7400, 83.3350, NOW(), NOW()),
    ('soc-gajuwaka', 'fed-ap-vzg', 'Gajuwaka Industrial & Electrical Workers Cooperative Society Ltd.', 'AP-VZG-COOP-2020-5541', 'Visakhapatnam', 'Zone 2 - Gajuwaka & Steel Plant', 17.6850, 83.2100, NOW(), NOW()),
    ('soc-madhurawada', 'fed-ap-vzg', 'Madhurawada & Rushikonda Green Trades Cooperative Society Ltd.', 'AP-VZG-COOP-2021-3310', 'Visakhapatnam', 'Zone 3 - Madhurawada & IT SEZ', 17.8050, 83.3550, NOW(), NOW())
ON CONFLICT ("registrationNo") DO NOTHING;

-- Workers
INSERT INTO "Worker" ("id", "societyId", "name", "phone", "aadhaarMasked", "avatar", "skills", "experienceYrs", "hourlyRate", "rating", "totalJobs", "status", "isAvailable", "latitude", "longitude", "digitalIdCard", "createdAt", "updatedAt")
VALUES 
    (
        'work-dheeraj',
        'soc-mvp',
        'Dheeraj',
        '+91 98188 99001',
        'XXXX-XXXX-7703',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        'AC Technician,HVAC Specialist,Air Cooler & Refrigerator Repair',
        8,
        550.0,
        4.9,
        142,
        'VERIFIED',
        TRUE,
        17.7421,
        83.3384,
        'COOP-ID-DHEERAJ-AC-VZG-7703-VERIFIED',
        NOW(),
        NOW()
    ),
    (
        'work-vaman',
        'soc-gajuwaka',
        'Vaman',
        '+91 98711 55667',
        'XXXX-XXXX-4412',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        'Plumber,Sanitary Fitting,Water Purifier Specialist,Pipefitting',
        7,
        480.0,
        4.85,
        118,
        'VERIFIED',
        TRUE,
        17.6870,
        83.2120,
        'COOP-ID-VAMAN-PLM-VZG-4412-VERIFIED',
        NOW(),
        NOW()
    ),
    (
        'work-mohan',
        'soc-madhurawada',
        'Mohan',
        '+91 98112 99881',
        'XXXX-XXXX-9082',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        'Carpenter,Woodwork Artisan,Modular Furniture Fitting,Door & Window Locks',
        9,
        520.0,
        4.92,
        164,
        'VERIFIED',
        TRUE,
        17.8060,
        83.3520,
        'COOP-ID-MOHAN-CRP-VZG-9082-VERIFIED',
        NOW(),
        NOW()
    ),
    (
        'work-hanish',
        'soc-mvp',
        'Hanish',
        '+91 99100 88234',
        'XXXX-XXXX-3319',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        'Caregiver,Care Taker,Elderly Care,Patient Assistance & Nursing Aide',
        6,
        600.0,
        5.0,
        86,
        'VERIFIED',
        TRUE,
        17.7380,
        83.3340,
        'COOP-ID-HANISH-CARE-VZG-3319-VERIFIED',
        NOW(),
        NOW()
    ),
    (
        'work-deepak',
        'soc-gajuwaka',
        'Deepak Yadav',
        '+91 97112 00981',
        'XXXX-XXXX-9021',
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        'Carpenter,Furniture Assembly,Modular Kitchen Fitting',
        4,
        480.0,
        5.0,
        0,
        'PENDING_VERIFICATION',
        FALSE,
        17.6910,
        83.2140,
        'COOP-ID-DEEPAK-AP-PENDING',
        NOW(),
        NOW()
    )
ON CONFLICT ("phone") DO NOTHING;

-- Worker Welfare Records
INSERT INTO "WelfareRecord" ("id", "workerId", "insuranceStatus", "insurancePlan", "policyNumber", "fundBalance", "earningsYTD", "updatedAt")
VALUES 
    ('welf-dheeraj', 'work-dheeraj', 'ACTIVE', 'Pradhan Mantri Suraksha Bima Yojana + Co-op Medical Shield', 'PMSBY-COOP-AP-VZG-77030', 8450.0, 104500.0, NOW()),
    ('welf-vaman', 'work-vaman', 'ACTIVE', 'Pradhan Mantri Jeevan Jyoti Bima Yojana', 'PMJJBY-COOP-AP-VZG-44819', 5600.0, 78400.0, NOW()),
    ('welf-mohan', 'work-mohan', 'ACTIVE', 'Cooperative Workers Group Accidental Cover', 'CWGAC-AP-VZG-908201', 7800.0, 98600.0, NOW()),
    ('welf-hanish', 'work-hanish', 'ACTIVE', 'Ayushman Bharat PM-JAY Co-op Affiliated Plan', 'AB-COOP-AP-VZG-11094', 6900.0, 84500.0, NOW()),
    ('welf-deepak', 'work-deepak', 'PENDING', 'Enrollment in PMSBY upon verification', 'PENDING-APPROVAL', 0.0, 0.0, NOW())
ON CONFLICT ("workerId") DO NOTHING;

-- Worker Certifications
INSERT INTO "Certification" ("id", "workerId", "title", "issuer", "certNumber", "issuedYear", "verified", "createdAt")
VALUES 
    ('cert-1', 'work-dheeraj', 'HVAC & Commercial Refrigeration Specialist', 'NSDC - Electronics Sector Skills Council', 'ESSCI-HVAC-2019-8911', 2019, TRUE, NOW()),
    ('cert-2', 'work-dheeraj', 'Inverter AC Diagnostic & Energy Star Auditor', 'Skill Council for Green Jobs (SCGJ)', 'SCGJ-AC-2021-4402', 2021, TRUE, NOW()),
    ('cert-3', 'work-vaman', 'ITI Plumber Certification (Gold Grade)', 'Govt Industrial Training Institute (ITI) Visakhapatnam', 'ITI-AP-VZG-PLM-2018-502', 2018, TRUE, NOW()),
    ('cert-4', 'work-mohan', 'Furniture & Fittings Skill Council Master Joiner', 'FFSC India', 'FFSC-CRP-2017-9104', 2017, TRUE, NOW()),
    ('cert-5', 'work-hanish', 'Healthcare Sector Skill Council - Geriatric Care Aide', 'HSSC India', 'HSSC-GCA-2020-1922', 2020, TRUE, NOW()),
    ('cert-6', 'work-deepak', 'ITI Carpentry & Joinery Trade Certificate', 'Govt ITI Visakhapatnam', 'ITI-AP-VZG-CRP-2021-884', 2021, FALSE, NOW())
ON CONFLICT ("id") DO NOTHING;

-- Customers
INSERT INTO "Customer" ("id", "name", "phone", "email", "address", "zone", "latitude", "longitude", "createdAt", "updatedAt")
VALUES 
    (
        'cust-kameswara',
        'Kameswara Surya',
        '+91 98990 88776',
        'Kameswara.surya@gmail.com',
        'Flat 402, Sea Breeze Enclave, Sector 3, MVP Colony, Visakhapatnam - 530017',
        'Zone 1 - MVP Colony & Beach Road',
        17.7410,
        83.3390,
        NOW(),
        NOW()
    ),
    (
        'cust-chaitanya',
        'Chaitanya Varma',
        '+91 98101 22334',
        'Chaitanya.varma@gmail.com',
        'Plot 88, Green Valley Layout, Gajuwaka, Visakhapatnam - 530026',
        'Zone 2 - Gajuwaka & Steel Plant',
        17.6860,
        83.2080,
        NOW(),
        NOW()
    )
ON CONFLICT ("phone") DO NOTHING;

-- Sample Bookings
INSERT INTO "Booking" ("id", "customerId", "workerId", "serviceType", "description", "status", "isEmergency", "startWorkOtp", "scheduledAt", "basePrice", "workerPayout", "welfareFee", "platformFee", "paymentStatus", "paymentMethod", "latitude", "longitude", "createdAt", "updatedAt")
VALUES 
    (
        'book-1',
        'cust-kameswara',
        'work-dheeraj',
        'AC Technician',
        'Air conditioner high-pressure jet cleaning and refrigerant level diagnostic in MVP Colony',
        'COMPLETED',
        FALSE,
        '8341',
        NOW() - INTERVAL '2 days',
        650.0,
        585.0,
        45.5,
        19.5,
        'PAID',
        'UPI_SANDBOX',
        17.7410,
        83.3390,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days'
    ),
    (
        'book-2',
        'cust-chaitanya',
        'work-vaman',
        'Plumber',
        'Kitchen under-sink RO filter connector burst leak',
        'COMPLETED',
        TRUE,
        '5521',
        NOW() - INTERVAL '1 day',
        500.0,
        450.0,
        35.0,
        15.0,
        'PAID',
        'UPI_SANDBOX',
        17.6860,
        83.2080,
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '1 day'
    ),
    (
        'book-3',
        'cust-kameswara',
        'work-mohan',
        'Carpenter',
        'Custom teakwood door hinge alignment and lock fitting in MVP Colony',
        'COMPLETED',
        FALSE,
        '9012',
        NOW() - INTERVAL '3 days',
        650.0,
        585.0,
        45.5,
        19.5,
        'PAID',
        'UPI_SANDBOX',
        17.7410,
        83.3390,
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '3 days'
    ),
    (
        'book-4',
        'cust-kameswara',
        'work-hanish',
        'Caregiver',
        '4-hour elder care assistance and vitals monitoring in MVP Colony',
        'IN_PROGRESS',
        FALSE,
        '4190',
        NOW() + INTERVAL '1 hour',
        700.0,
        630.0,
        49.0,
        21.0,
        'PAID',
        'UPI_SANDBOX',
        17.7410,
        83.3390,
        NOW(),
        NOW()
    )
ON CONFLICT ("id") DO NOTHING;

-- Ratings
INSERT INTO "Rating" ("id", "bookingId", "score", "feedback", "tags", "flagged", "noticeSent", "workerAcknowledged", "adminStatus", "createdAt")
VALUES 
    (
        'rate-1',
        'book-1',
        5,
        'Dheeraj arrived punctually at MVP Colony, showed his digital cooperative QR ID, and serviced the AC thoroughly. Excellent fair pricing!',
        'Punctual,Cooperative Verified,Fair Price,Knowledgeable',
        FALSE,
        FALSE,
        FALSE,
        'PENDING',
        NOW() - INTERVAL '2 days'
    ),
    (
        'rate-2',
        'book-2',
        5,
        'Emergency plumbing response within 20 minutes in Gajuwaka. No surge extortion, transparent cooperative rate.',
        'Fast Response,Transparent,Fair Price',
        FALSE,
        FALSE,
        FALSE,
        'PENDING',
        NOW() - INTERVAL '1 day'
    ),
    (
        'rate-3',
        'book-3',
        1,
        'Arrived 45 minutes late to MVP Colony without calling in advance. Fixed the lock but left wood shavings and dust on the entrance floor.',
        'Late Arrival,Untidy Workspace',
        TRUE,
        FALSE,
        FALSE,
        'PENDING',
        NOW() - INTERVAL '3 days'
    )
ON CONFLICT ("bookingId") DO NOTHING;

-- AI Demand Forecast Logs
INSERT INTO "DemandForecastLog" ("id", "zone", "serviceType", "predictedDemand", "availableSupply", "deficitSurplus", "confidenceScore", "recommendation", "createdAt")
VALUES 
    (
        'log-1',
        'Zone 2 - Gajuwaka & Steel Plant',
        'Plumber',
        18,
        6,
        -12,
        0.95,
        'High coastal monsoon drainage backlog in Gajuwaka. Recommend redeploying verified plumbers from MVP Colony to Gajuwaka.',
        NOW()
    ),
    (
        'log-2',
        'Zone 1 - MVP Colony & Beach Road',
        'AC Technician',
        26,
        14,
        -12,
        0.94,
        'Upcoming coastal heatwave in MVP Colony & Waltair Uplands. Alert off-duty AC technicians with ₹150 incentive grant.',
        NOW()
    ),
    (
        'log-3',
        'Zone 3 - Madhurawada & IT SEZ',
        'Caregiver',
        10,
        11,
        1,
        0.88,
        'Balanced demand & supply in Rushikonda & Madhurawada. Standard shift rotation recommended.',
        NOW()
    )
ON CONFLICT ("id") DO NOTHING;

-- 4. Enable Row Level Security (RLS) with Full Permissive Access for Prisma
ALTER TABLE "Federation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Society" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Worker" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Certification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Rating" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WelfareRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DemandForecastLog" ENABLE ROW LEVEL SECURITY;

-- Allow all operations for public and authenticated users (Prisma connects via postgres superuser/service role, but this ensures anon client works too)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Full Access Federation" ON "Federation";
    CREATE POLICY "Public Full Access Federation" ON "Federation" FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access Society" ON "Society";
    CREATE POLICY "Public Full Access Society" ON "Society" FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access Worker" ON "Worker";
    CREATE POLICY "Public Full Access Worker" ON "Worker" FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access Certification" ON "Certification";
    CREATE POLICY "Public Full Access Certification" ON "Certification" FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access Customer" ON "Customer";
    CREATE POLICY "Public Full Access Customer" ON "Customer" FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access Booking" ON "Booking";
    CREATE POLICY "Public Full Access Booking" ON "Booking" FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access Rating" ON "Rating";
    CREATE POLICY "Public Full Access Rating" ON "Rating" FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access WelfareRecord" ON "WelfareRecord";
    CREATE POLICY "Public Full Access WelfareRecord" ON "WelfareRecord" FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Full Access DemandForecastLog" ON "DemandForecastLog";
    CREATE POLICY "Public Full Access DemandForecastLog" ON "DemandForecastLog" FOR ALL USING (true) WITH CHECK (true);
END $$;
