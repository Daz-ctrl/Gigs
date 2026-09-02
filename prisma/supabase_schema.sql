-- ====================================================================================
-- Sahakar Karmakar (सहकार कर्मकार) - Complete Supabase PostgreSQL Schema & Seed
-- Run this entire script in your Supabase Dashboard -> SQL Editor -> New Query
-- ====================================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE CORE TABLES

-- Table: Federation
CREATE TABLE IF NOT EXISTS public."Federation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "code" TEXT UNIQUE NOT NULL,
  "state" TEXT NOT NULL,
  "minWageFloor" DOUBLE PRECISION NOT NULL DEFAULT 450.0,
  "platformCommPct" DOUBLE PRECISION NOT NULL DEFAULT 3.0,
  "welfareCommPct" DOUBLE PRECISION NOT NULL DEFAULT 7.0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Society
CREATE TABLE IF NOT EXISTS public."Society" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "federationId" TEXT NOT NULL REFERENCES public."Federation"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "registrationNo" TEXT UNIQUE NOT NULL,
  "district" TEXT NOT NULL,
  "zone" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Worker
CREATE TABLE IF NOT EXISTS public."Worker" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "societyId" TEXT NOT NULL REFERENCES public."Society"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "phone" TEXT UNIQUE NOT NULL,
  "aadhaarMasked" TEXT NOT NULL,
  "avatar" TEXT,
  "skills" TEXT NOT NULL,
  "experienceYrs" INTEGER NOT NULL DEFAULT 3,
  "hourlyRate" DOUBLE PRECISION NOT NULL DEFAULT 500.0,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
  "totalJobs" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'VERIFIED',
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "digitalIdCard" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Certification
CREATE TABLE IF NOT EXISTS public."Certification" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "workerId" TEXT NOT NULL REFERENCES public."Worker"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "issuer" TEXT NOT NULL,
  "certNumber" TEXT NOT NULL,
  "issuedYear" INTEGER NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Customer
CREATE TABLE IF NOT EXISTS public."Customer" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "phone" TEXT UNIQUE NOT NULL,
  "email" TEXT,
  "address" TEXT NOT NULL,
  "zone" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Booking
CREATE TABLE IF NOT EXISTS public."Booking" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "customerId" TEXT NOT NULL REFERENCES public."Customer"("id") ON DELETE CASCADE,
  "workerId" TEXT REFERENCES public."Worker"("id") ON DELETE SET NULL,
  "serviceType" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACCEPTED',
  "isEmergency" BOOLEAN NOT NULL DEFAULT false,
  "startWorkOtp" TEXT NOT NULL DEFAULT '8341',
  "startedAt" TIMESTAMPTZ,
  "completedAt" TIMESTAMPTZ,
  "scheduledAt" TIMESTAMPTZ NOT NULL,
  "basePrice" DOUBLE PRECISION NOT NULL,
  "workerPayout" DOUBLE PRECISION NOT NULL,
  "welfareFee" DOUBLE PRECISION NOT NULL,
  "platformFee" DOUBLE PRECISION NOT NULL,
  "paymentStatus" TEXT NOT NULL DEFAULT 'PAID',
  "paymentMethod" TEXT NOT NULL DEFAULT 'UPI_SANDBOX',
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Rating
CREATE TABLE IF NOT EXISTS public."Rating" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "bookingId" TEXT UNIQUE NOT NULL REFERENCES public."Booking"("id") ON DELETE CASCADE,
  "score" INTEGER NOT NULL,
  "feedback" TEXT,
  "tags" TEXT,
  "flagged" BOOLEAN NOT NULL DEFAULT false,
  "noticeSent" BOOLEAN NOT NULL DEFAULT false,
  "noticeSentAt" TIMESTAMPTZ,
  "workerAcknowledged" BOOLEAN NOT NULL DEFAULT false,
  "acknowledgedAt" TIMESTAMPTZ,
  "adminStatus" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: WelfareRecord
CREATE TABLE IF NOT EXISTS public."WelfareRecord" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "workerId" TEXT UNIQUE NOT NULL REFERENCES public."Worker"("id") ON DELETE CASCADE,
  "insuranceStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
  "insurancePlan" TEXT NOT NULL DEFAULT 'Pradhan Mantri Suraksha Bima Yojana (Cooperative Group)',
  "policyNumber" TEXT NOT NULL DEFAULT 'PMSBY-COOP-8849102',
  "fundBalance" DOUBLE PRECISION NOT NULL DEFAULT 4850.0,
  "earningsYTD" DOUBLE PRECISION NOT NULL DEFAULT 64200.0,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: DemandForecastLog
CREATE TABLE IF NOT EXISTS public."DemandForecastLog" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "zone" TEXT NOT NULL,
  "serviceType" TEXT NOT NULL,
  "predictedDemand" INTEGER NOT NULL,
  "availableSupply" INTEGER NOT NULL,
  "deficitSurplus" INTEGER NOT NULL,
  "confidenceScore" DOUBLE PRECISION NOT NULL,
  "recommendation" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: profiles (Permanent Supabase OAuth User Profile & Role)
CREATE TABLE IF NOT EXISTS public.profiles (
  "id" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "email" TEXT,
  "name" TEXT,
  "avatar_url" TEXT,
  "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE ROW LEVEL SECURITY & OPEN POLICIES FOR CO-OP PLATFORM
ALTER TABLE public."Federation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Society" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Worker" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Certification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Rating" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."WelfareRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DemandForecastLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow read/write access for platform operations
DO $$
BEGIN
  EXECUTE 'CREATE POLICY "Allow all read" ON public."Federation" FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Allow all write" ON public."Federation" FOR ALL USING (true)';
  EXECUTE 'CREATE POLICY "Allow all read" ON public."Society" FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Allow all write" ON public."Society" FOR ALL USING (true)';
  EXECUTE 'CREATE POLICY "Allow all read" ON public."Worker" FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Allow all write" ON public."Worker" FOR ALL USING (true)';
  EXECUTE 'CREATE POLICY "Allow all read" ON public."Certification" FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Allow all write" ON public."Certification" FOR ALL USING (true)';
  EXECUTE 'CREATE POLICY "Allow all read" ON public."Customer" FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Allow all write" ON public."Customer" FOR ALL USING (true)';
  EXECUTE 'CREATE POLICY "Allow all read" ON public."Booking" FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Allow all write" ON public."Booking" FOR ALL USING (true)';
  EXECUTE 'CREATE POLICY "Allow all read" ON public."Rating" FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Allow all write" ON public."Rating" FOR ALL USING (true)';
  EXECUTE 'CREATE POLICY "Allow all read" ON public."WelfareRecord" FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Allow all write" ON public."WelfareRecord" FOR ALL USING (true)';
  EXECUTE 'CREATE POLICY "Allow all read" ON public."DemandForecastLog" FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Allow all write" ON public."DemandForecastLog" FOR ALL USING (true)';
  EXECUTE 'CREATE POLICY "Allow all read" ON public.profiles FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Allow all write" ON public.profiles FOR ALL USING (true)';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- 4. GOOGLE OAUTH AUTO-PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'CUSTOMER')
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. SEED INITIAL COOPERATIVE DATA

-- 5a. Federation
INSERT INTO public."Federation" ("id", "name", "code", "state", "minWageFloor", "platformCommPct", "welfareCommPct")
VALUES (
  'fed-ap-nlcf',
  'Andhra Pradesh State Federation of Labour Cooperatives (AP-SFLC)',
  'AP-SFLC-VIZAG',
  'Andhra Pradesh',
  450.0,
  3.0,
  7.0
)
ON CONFLICT ("id") DO NOTHING;

-- 5b. Societies (Visakhapatnam Primary Cooperative Societies)
INSERT INTO public."Society" ("id", "federationId", "name", "registrationNo", "district", "zone", "latitude", "longitude")
VALUES
  ('soc-mvp', 'fed-ap-nlcf', 'Ward Sachivalayam #18 Labour Co-op Society Ltd.', 'AP/VSP/COOP/2023/1802', 'Visakhapatnam', 'Zone 1 - MVP Colony & Beach Road', 17.7400, 83.3350),
  ('soc-gajuwaka', 'fed-ap-nlcf', 'Gajuwaka Industrial Corridor Artisans Co-op Society', 'AP/VSP/COOP/2022/0941', 'Visakhapatnam', 'Zone 2 - Gajuwaka & Steel Plant', 17.6850, 83.2100),
  ('soc-madhurawada', 'fed-ap-nlcf', 'Madhurawada IT & Tech Services Cooperative Ltd.', 'AP/VSP/COOP/2024/3104', 'Visakhapatnam', 'Zone 3 - Madhurawada & IT SEZ', 17.8050, 83.3550)
ON CONFLICT ("id") DO NOTHING;

-- 5c. Verified Workers
INSERT INTO public."Worker" ("id", "societyId", "name", "phone", "aadhaarMasked", "avatar", "skills", "experienceYrs", "hourlyRate", "rating", "totalJobs", "status", "isAvailable", "latitude", "longitude", "digitalIdCard")
VALUES
  ('w-dheeraj', 'soc-mvp', 'Dheeraj Varma (Master Artisan)', '+91 98480 22334', 'XXXX-XXXX-4821', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Electrician,Solar Technician,Wiring Specialist', 8, 550, 4.95, 142, 'VERIFIED', true, 17.7420, 83.3380, 'COOP-ID-DHEERAJ-VARMA-9848'),
  ('w-priya', 'soc-mvp', 'Priya Sharma (Certified Caregiver)', '+91 98480 33445', 'XXXX-XXXX-7712', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Caregiver,Elderly Support,Post-Operative Care', 6, 480, 4.98, 89, 'VERIFIED', true, 17.7410, 83.3395, 'COOP-ID-PRIYA-SHARMA-7712'),
  ('w-ramesh', 'soc-gajuwaka', 'Ramesh Chandra (Lead Plumber)', '+91 98480 44556', 'XXXX-XXXX-3349', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'Plumber,Hydro-Jetting,Pipe Fittings', 10, 600, 4.88, 215, 'VERIFIED', true, 17.6890, 83.2140, 'COOP-ID-RAMESH-CHANDRA-3349'),
  ('w-sunita', 'soc-madhurawada', 'Sunita Rao (HVAC Specialist)', '+91 98480 55667', 'XXXX-XXXX-9921', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'AC Technician,HVAC Inverter,Refrigeration', 5, 520, 4.92, 76, 'VERIFIED', true, 17.8080, 83.3590, 'COOP-ID-SUNITA-RAO-9921')
ON CONFLICT ("id") DO NOTHING;

-- 5d. Certifications
INSERT INTO public."Certification" ("id", "workerId", "title", "issuer", "certNumber", "issuedYear", "verified")
VALUES
  ('c-1', 'w-dheeraj', 'National Skill Development Corp (NSDC) Level 4 Electrician', 'NSDC Skill India', 'NSDC-ELE-2021-9842', 2021, true),
  ('c-2', 'w-dheeraj', 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY) Solar Installer', 'Ministry of Skill Development', 'PMKVY-SOL-2022-1102', 2022, true),
  ('c-3', 'w-priya', 'Healthcare Sector Skill Council (HSSC) Geriatric Care Aide', 'HSSC India', 'HSSC-GER-2020-5421', 2020, true),
  ('c-4', 'w-ramesh', 'Indian Plumbing Skills Council (IPSC) Master Plumber', 'IPSC India', 'IPSC-MP-2019-3891', 2019, true)
ON CONFLICT ("id") DO NOTHING;

-- 5e. Welfare Records
INSERT INTO public."WelfareRecord" ("id", "workerId", "insuranceStatus", "insurancePlan", "policyNumber", "fundBalance", "earningsYTD")
VALUES
  ('wel-dheeraj', 'w-dheeraj', 'ACTIVE', 'Pradhan Mantri Suraksha Bima Yojana (Cooperative Group)', 'PMSBY-COOP-8849102', 4850.0, 64200.0),
  ('wel-priya', 'w-priya', 'ACTIVE', 'Ayushman Bharat Cooperative Workers Healthcare Cover', 'AB-COOP-5591023', 3920.0, 48900.0),
  ('wel-ramesh', 'w-ramesh', 'ACTIVE', 'Pradhan Mantri Suraksha Bima Yojana (Cooperative Group)', 'PMSBY-COOP-7721893', 6120.0, 82400.0),
  ('wel-sunita', 'w-sunita', 'ACTIVE', 'Ayushman Bharat Cooperative Workers Healthcare Cover', 'AB-COOP-9941203', 3150.0, 39600.0)
ON CONFLICT ("workerId") DO NOTHING;

-- 5f. Customers
INSERT INTO public."Customer" ("id", "name", "phone", "email", "address", "zone", "latitude", "longitude")
VALUES (
  'c-surya',
  'Kameswara Surya',
  '+91 98990 88776',
  'kameswara.surya@gmail.com',
  'Flat 402, Sea Pearl Towers, Beach Road, MVP Colony, Visakhapatnam',
  'Zone 1 - MVP Colony & Beach Road',
  17.7410,
  83.3390
)
ON CONFLICT ("id") DO NOTHING;

-- 5g. Demand Forecast Logs
INSERT INTO public."DemandForecastLog" ("id", "zone", "serviceType", "predictedDemand", "availableSupply", "deficitSurplus", "confidenceScore", "recommendation")
VALUES
  ('df-1', 'Zone 1 - MVP Colony & Beach Road', 'AC Technician', 42, 18, -24, 0.94, 'High AC servicing demand expected due to coastal humidity surge. Mobilize 6 reserve artisans.'),
  ('df-2', 'Zone 1 - MVP Colony & Beach Road', 'Electrician', 35, 30, -5, 0.91, 'Steady demand in MVP Colony sector. Balanced supply.'),
  ('df-3', 'Zone 2 - Gajuwaka & Steel Plant', 'Plumber', 28, 14, -14, 0.88, 'Industrial township piping maintenance peak detected. Issue temporary surge incentive.')
ON CONFLICT ("id") DO NOTHING;
