export type UserRole = "CUSTOMER" | "WORKER" | "ADMIN";

export type LanguageCode = "en" | "hi" | "te" | "ta";

export type VerificationPathway =
  | "EXPERIENCE_VOUCH"
  | "RPL_SKILL_INDIA"
  | "FORMAL_CERTIFICATE";

export interface DemoUser {
  role: UserRole;
  name: string;
  badge: string;
  subtext: string;
  avatar: string;
  id: string;
  zone: string;
}

export interface WorkerWithDetails {
  id: string;
  societyId: string;
  name: string;
  phone: string;
  aadhaarMasked: string;
  avatar?: string | null;
  skills: string;
  experienceYrs: number;
  hourlyRate: number;
  rating: number;
  totalJobs: number;
  status: string; // PENDING, VERIFIED, REJECTED
  isAvailable: boolean;
  latitude: number;
  longitude: number;
  digitalIdCard: string;
  distanceKm?: number;
  verificationPathway?: VerificationPathway | string;
  society?: {
    id: string;
    name: string;
    zone: string;
    district: string;
  };
  certifications?: Array<{
    id: string;
    title: string;
    issuer: string;
    certNumber: string;
    issuedYear: number;
    verified: boolean;
  }>;
  welfareRecord?: {
    insuranceStatus: string;
    insurancePlan: string;
    policyNumber: string;
    fundBalance: number;
    earningsYTD: number;
  } | null;
}

export interface BookingWithDetails {
  id: string;
  customerId: string;
  workerId?: string | null;
  serviceType: string;
  description: string;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  isEmergency: boolean;
  startWorkOtp?: string;
  startedAt?: string | null;
  completedAt?: string | null;
  scheduledAt: string;
  basePrice: number;
  workerPayout: number;
  welfareFee: number;
  platformFee: number;
  paymentStatus: string;
  paymentMethod: string;
  latitude: number;
  longitude: number;
  customer?: {
    id: string;
    name: string;
    phone: string;
    address: string;
    zone: string;
  };
  worker?: {
    id: string;
    name: string;
    phone: string;
    skills: string;
    rating: number;
    digitalIdCard: string;
  } | null;
  rating?: {
    score: number;
    feedback?: string | null;
    tags?: string | null;
  } | null;
}

export interface ForecastProjection {
  zone: string;
  service_type: string;
  predicted_demand: number;
  available_supply: number;
  deficit_surplus: number;
  confidence_score: number;
  recommendation: string;
  factors: {
    weather: string;
    is_festival: boolean;
    peak_window: string;
  };
}

export interface ForecastResponse {
  timestamp: string;
  projections: ForecastProjection[];
  summary: {
    total_predicted_demand: number;
    total_available_supply: number;
    critical_deficits_count: number;
    top_recommendation: string;
  };
}
