import { DemoUser, UserRole } from "@/types";

export interface SystemAccount {
  email: string;
  role: UserRole;
  password: string;
  name: string;
  badge: string;
  subtext: string;
  avatar: string;
  id: string;
  zone: string;
  trade?: string;
}

export const PRECONFIGURED_USERS: Record<string, SystemAccount> = {
  // Customer Persona
  "kameswara.surya@gmail.com": {
    email: "Kameswara.surya@gmail.com",
    role: "CUSTOMER",
    password: "FDH12345",
    name: "Kameswara Surya",
    badge: "Verified Resident Customer",
    subtext: "Kameswara.surya@gmail.com · MVP Colony, Vizag",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    id: "cust-kameswara",
    zone: "Zone 1 - MVP Colony & Beach Road, Vizag",
  },

  // Sector Admin Persona
  "admin@gmail.com": {
    email: "Admin@gmail.com",
    role: "ADMIN",
    password: "FDH12345",
    name: "Ward Sachivalayam Secretary",
    badge: "Ward Sachivalayam #18 · GVMC",
    subtext: "Admin@gmail.com · Ward Welfare & Development Secretary",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    id: "admin-sachivalayam",
    zone: "Ward Sachivalayam #18 (MVP Colony), GVMC Visakhapatnam",
  },

  // 1. Dheeraj - AC & HVAC Specialist
  "dheeraj@gmail.com": {
    email: "dheeraj@gmail.com",
    role: "WORKER",
    password: "FDH12345",
    name: "Dheeraj",
    badge: "AC & HVAC Specialist",
    subtext: "dheeraj@gmail.com · Member #VZG-7703",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    id: "work-dheeraj",
    zone: "Zone 1 - MVP Colony & Beach Road, Vizag",
    trade: "AC Technician",
  },
  "dheeraj.ac@gmail.com": {
    email: "dheeraj.ac@gmail.com",
    role: "WORKER",
    password: "FDH12345",
    name: "Dheeraj",
    badge: "AC & HVAC Specialist",
    subtext: "dheeraj.ac@gmail.com · Member #VZG-7703",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    id: "work-dheeraj",
    zone: "Zone 1 - MVP Colony & Beach Road, Vizag",
    trade: "AC Technician",
  },

  // 2. Vaman - Master Plumber
  "vaman@gmail.com": {
    email: "vaman@gmail.com",
    role: "WORKER",
    password: "FDH12345",
    name: "Vaman",
    badge: "Master Plumber",
    subtext: "vaman@gmail.com · Member #VZG-4412",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    id: "work-vaman",
    zone: "Zone 2 - Gajuwaka & Steel Plant, Vizag",
    trade: "Plumber",
  },
  "vaman.plumber@gmail.com": {
    email: "vaman.plumber@gmail.com",
    role: "WORKER",
    password: "FDH12345",
    name: "Vaman",
    badge: "Master Plumber",
    subtext: "vaman.plumber@gmail.com · Member #VZG-4412",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    id: "work-vaman",
    zone: "Zone 2 - Gajuwaka & Steel Plant, Vizag",
    trade: "Plumber",
  },

  // 3. Mohan - Master Carpenter
  "mohan@gmail.com": {
    email: "mohan@gmail.com",
    role: "WORKER",
    password: "FDH12345",
    name: "Mohan",
    badge: "Master Carpenter & Woodcrafter",
    subtext: "mohan@gmail.com · Member #VZG-9082",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    id: "work-mohan",
    zone: "Zone 3 - Madhurawada & IT SEZ, Vizag",
    trade: "Carpenter",
  },
  "mohan.carpenter@gmail.com": {
    email: "mohan.carpenter@gmail.com",
    role: "WORKER",
    password: "FDH12345",
    name: "Mohan",
    badge: "Master Carpenter & Woodcrafter",
    subtext: "mohan.carpenter@gmail.com · Member #VZG-9082",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    id: "work-mohan",
    zone: "Zone 3 - Madhurawada & IT SEZ, Vizag",
    trade: "Carpenter",
  },

  // 4. Hanish - Care Taker & Elder Nurse
  "hanish@gmail.com": {
    email: "hanish@gmail.com",
    role: "WORKER",
    password: "FDH12345",
    name: "Hanish",
    badge: "Certified Care Taker & Nurse",
    subtext: "hanish@gmail.com · Member #VZG-3319",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    id: "work-hanish",
    zone: "Zone 1 - MVP Colony & Waltair, Vizag",
    trade: "Caregiver",
  },
  "hanish.caretaker@gmail.com": {
    email: "hanish.caretaker@gmail.com",
    role: "WORKER",
    password: "FDH12345",
    name: "Hanish",
    badge: "Certified Care Taker & Nurse",
    subtext: "hanish.caretaker@gmail.com · Member #VZG-3319",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    id: "work-hanish",
    zone: "Zone 1 - MVP Colony & Waltair, Vizag",
    trade: "Caregiver",
  },
};

export const ARTISAN_PERSONAS = [
  PRECONFIGURED_USERS["dheeraj@gmail.com"],
  PRECONFIGURED_USERS["vaman@gmail.com"],
  PRECONFIGURED_USERS["mohan@gmail.com"],
  PRECONFIGURED_USERS["hanish@gmail.com"],
];

export function findSystemAccount(email: string): SystemAccount | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  return PRECONFIGURED_USERS[normalized] || null;
}
